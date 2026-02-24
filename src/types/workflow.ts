export type WorkflowStage =
  | "order_intake"
  | "style_design"
  | "fabric_selection"
  | "craft_planning"
  | "pattern_making"
  | "delivery";

export type OrderStatus = "draft" | "active" | "on_hold" | "completed" | "cancelled";

export type PriorityLevel = "low" | "medium" | "high" | "urgent";

export interface WorkflowTransition {
  from: WorkflowStage;
  to: WorkflowStage;
  action: string;
  requiredRole?: string;
}

export interface StageInfo {
  key: WorkflowStage;
  label: string;
  agent: string;
  description: string;
  order: number;
}
