import { z } from "zod";

export const createStyleSchema = z.object({
  order_id: z.string().uuid("无效的订单 ID"),
  style_number: z.string().min(1, "款号不能为空"),
  name: z.string().min(1, "款式名称不能为空"),
  category: z.string().optional(),
  description: z.string().optional(),
  design_images: z.array(z.string()).optional(),
  specifications: z.record(z.string(), z.unknown()).optional(),
});

export const updateStyleSchema = z.object({
  style_number: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  design_images: z.array(z.string()).optional(),
  specifications: z.record(z.string(), z.unknown()).optional(),
  status: z.string().optional(),
});

export type CreateStyleInput = z.infer<typeof createStyleSchema>;
export type UpdateStyleInput = z.infer<typeof updateStyleSchema>;
