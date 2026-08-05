import { z } from 'zod';

export const ProductInputSchema = z.object({
  productName: z.string().min(1, 'Product name is required').max(100),
  color: z.string().min(1, 'Color is required').max(50),
  material: z.string().min(1, 'Material is required').max(50),
  features: z.union([z.string(), z.array(z.string())]).transform((val) => {
    if (Array.isArray(val)) return val.join(', ');
    return val;
  }),
  tone: z.string().optional().default('Professional'),
});

export type ProductInput = z.infer<typeof ProductInputSchema>;
