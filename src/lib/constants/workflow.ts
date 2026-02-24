import type { StageInfo, WorkflowStage, WorkflowTransition } from "@/types/workflow";

export const WORKFLOW_STAGES: Record<WorkflowStage, StageInfo> = {
  order_intake: {
    key: "order_intake",
    label: "接单组",
    agent: "Nora",
    description: "客户需求对接与订单录入",
    order: 1,
  },
  style_design: {
    key: "style_design",
    label: "款式组",
    agent: "Cleo",
    description: "款式设计与确认",
    order: 2,
  },
  fabric_selection: {
    key: "fabric_selection",
    label: "面料组",
    agent: "Faye",
    description: "面料选择与采购",
    order: 3,
  },
  craft_planning: {
    key: "craft_planning",
    label: "工艺组",
    agent: "Tess",
    description: "工艺方案制定",
    order: 4,
  },
  pattern_making: {
    key: "pattern_making",
    label: "版型组",
    agent: "Pax",
    description: "版型制作与放码",
    order: 5,
  },
  delivery: {
    key: "delivery",
    label: "交付组",
    agent: "Odin",
    description: "生产交付与质检",
    order: 6,
  },
};

export const WORKFLOW_TRANSITIONS: WorkflowTransition[] = [
  { from: "order_intake", to: "style_design", action: "提交款式设计" },
  { from: "style_design", to: "fabric_selection", action: "确认款式，选择面料" },
  { from: "fabric_selection", to: "craft_planning", action: "面料确认，制定工艺" },
  { from: "craft_planning", to: "pattern_making", action: "工艺确认，制作版型" },
  { from: "pattern_making", to: "delivery", action: "版型确认，安排交付" },
];

export const STAGE_ORDER: WorkflowStage[] = [
  "order_intake",
  "style_design",
  "fabric_selection",
  "craft_planning",
  "pattern_making",
  "delivery",
];

export function getNextStage(current: WorkflowStage): WorkflowStage | null {
  const idx = STAGE_ORDER.indexOf(current);
  return idx >= 0 && idx < STAGE_ORDER.length - 1 ? STAGE_ORDER[idx + 1] : null;
}

export function getPrevStage(current: WorkflowStage): WorkflowStage | null {
  const idx = STAGE_ORDER.indexOf(current);
  return idx > 0 ? STAGE_ORDER[idx - 1] : null;
}

export function canTransition(from: WorkflowStage, to: WorkflowStage): boolean {
  return WORKFLOW_TRANSITIONS.some((t) => t.from === from && t.to === to);
}
