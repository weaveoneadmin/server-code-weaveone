import { z } from "zod";

export const createOrderSchema = z.object({
  order_number: z.string().min(1, "订单编号不能为空"),
  client_name: z.string().min(1, "客户名称不能为空"),
  client_contact: z.string().optional(),
  description: z.string().optional(),
  requirements: z.record(z.string(), z.unknown()).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  deadline: z.string().datetime().optional(),
  assigned_to: z.string().uuid().optional(),
});

export const updateOrderSchema = z.object({
  client_name: z.string().min(1).optional(),
  client_contact: z.string().optional(),
  description: z.string().optional(),
  requirements: z.record(z.string(), z.unknown()).optional(),
  status: z.enum(["draft", "active", "on_hold", "completed", "cancelled"]).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  deadline: z.string().datetime().optional(),
  assigned_to: z.string().uuid().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
