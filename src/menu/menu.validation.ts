import { z, ZodType } from 'zod';

export class MenuValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.string().min(1).max(100),
    parentId: z.string().uuid().optional().nullable(),
    order: z.number().int().nonnegative().optional(),
    depth: z.number().int().nonnegative().optional(),
  });

  static readonly UPDATE: ZodType = z.object({
    name: z.string().min(1).max(100).optional(),
    parentId: z.string().uuid().optional().nullable(),
    order: z.number().int().nonnegative().optional(),
    depth: z.number().int().nonnegative().optional(),
  });
}
