import { z } from "zod";

export const advanceWorkflowSchema = z.object({
  order_id: z.string().uuid("无效的订单 ID"),
  notes: z.string().optional(),
});

export const rollbackWorkflowSchema = z.object({
  order_id: z.string().uuid("无效的订单 ID"),
  target_stage: z.enum([
    "order_intake",
    "style_design",
    "fabric_selection",
    "craft_planning",
    "pattern_making",
    "delivery",
  ]),
  notes: z.string().optional(),
});

export type AdvanceWorkflowInput = z.infer<typeof advanceWorkflowSchema>;
export type RollbackWorkflowInput = z.infer<typeof rollbackWorkflowSchema>;
