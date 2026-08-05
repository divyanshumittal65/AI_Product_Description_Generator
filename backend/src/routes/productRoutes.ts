import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ProductInputSchema } from '../validators/productValidator';
import { generateProductDescription } from '../services/aiService';

const router = Router();
const prisma = new PrismaClient();

// POST /api/generate
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
