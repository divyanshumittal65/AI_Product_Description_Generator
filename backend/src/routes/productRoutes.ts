import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ProductInputSchema, ProductInput } from '../validators/productValidator';
import { generateProductDescription, streamProductDescription } from '../services/aiService';

const router = Router();
const prisma = new PrismaClient();

interface SessionData {
  input: ProductInput;
  createdAt: number;
}
const sessions = new Map<string, SessionData>();

// Clean up expired sessions after 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [id, data] of sessions.entries()) {
    if (now - data.createdAt > 10 * 60 * 1000) {
      sessions.delete(id);
    }
  }
}, 60 * 1000);

// POST /api/generate/session - Create streaming session
router.post('/generate/session', (req: Request, res: Response) => {
  try {
    const parseResult = ProductInputSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Validation Error',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    sessions.set(sessionId, {
      input: parseResult.data,
      createdAt: Date.now(),
    });

    return res.status(201).json({
      success: true,
      sessionId,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error?.message || 'Failed to create streaming session',
    });
  }
});

// GET /api/generate/stream or GET /api/generate/stream/:sessionId - SSE Streaming
router.get(['/generate/stream', '/generate/stream/:sessionId'], async (req: Request, res: Response) => {
  const paramSessionId = req.params.sessionId;
  const querySessionId = req.query.sessionId as string;
  const sessionId = paramSessionId || querySessionId;

  let input: ProductInput | undefined;

  if (sessionId && sessions.has(sessionId)) {
    input = sessions.get(sessionId)!.input;
    sessions.delete(sessionId);
  } else if (req.query.productName) {
    const parseResult = ProductInputSchema.safeParse({
      productName: req.query.productName,
      color: req.query.color,
      material: req.query.material,
      features: req.query.features,
      tone: req.query.tone,
    });
    if (parseResult.success) {
      input = parseResult.data;
    }
  }

  // Set mandatory SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  if (!input) {
    res.write(`data: ${JSON.stringify({ error: 'Invalid or expired session request' })}\n\n`);
    return res.end();
  }

  let isClosed = false;
  req.on('close', () => {
    isClosed = true;
  });

  try {
    await streamProductDescription(
      input,
      (chunk: string) => {
        if (!isClosed) {
          res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
        }
      },
      async (fullText: string, modelUsed: string) => {
        if (isClosed) return;

        let savedRecord = null;
        try {
          savedRecord = await prisma.productDescription.create({
            data: {
              productName: input!.productName,
              color: input!.color,
              material: input!.material,
              features: input!.features,
              tone: input!.tone,
              generatedDescription: fullText,
              modelUsed: modelUsed,
            },
          });
        } catch (dbErr: any) {
          console.warn('[DB Error] Could not persist to DB:', dbErr?.message || dbErr);
        }

        res.write(`data: ${JSON.stringify({ done: true, modelUsed, record: savedRecord })}\n\n`);
        res.end();
      },
      (err: any) => {
        if (!isClosed) {
          res.write(`data: ${JSON.stringify({ error: err?.message || 'Streaming failed' })}\n\n`);
          res.end();
        }
      }
    );
  } catch (error: any) {
    if (!isClosed) {
      res.write(`data: ${JSON.stringify({ error: error?.message || 'Server error during stream' })}\n\n`);
      res.end();
    }
  }
});

// POST /api/generate (Original Non-streaming endpoint preserved)
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const parseResult = ProductInputSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Validation Error',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const input = parseResult.data;
    const { description, modelUsed } = await generateProductDescription(input);

    // Store in Database for persistence
    const savedRecord = await prisma.productDescription.create({
      data: {
        productName: input.productName,
        color: input.color,
        material: input.material,
        features: input.features,
        tone: input.tone,
        generatedDescription: description,
        modelUsed: modelUsed,
      },
    });

    return res.status(201).json({
      success: true,
      data: savedRecord,
    });
  } catch (error: any) {
    console.error('Error generating product description:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to generate product description',
    });
  }
});

// GET /api/history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const history = await prisma.productDescription.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, data: history });
  } catch (error: any) {
    console.error('Error fetching history:', error);
    return res.status(500).json({ error: 'Failed to retrieve history' });
  }
});

// DELETE /api/history/:id
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.productDescription.delete({ where: { id } });
    return res.json({ success: true, message: 'Record deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting history record:', error);
    return res.status(500).json({ error: 'Failed to delete record' });
  }
});

// GET /api/health
router.get('/health', (_req: Request, res: Response) => {
  return res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;

