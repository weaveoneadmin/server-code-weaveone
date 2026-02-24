import { withErrorHandling } from "@/lib/api/handler";
import { success } from "@/lib/api/response";
import { WORKFLOW_STAGES, STAGE_ORDER, WORKFLOW_TRANSITIONS } from "@/lib/constants/workflow";

export const GET = withErrorHandling(async () => {
  const stages = STAGE_ORDER.map((key) => WORKFLOW_STAGES[key]);

  return success({
    stages,
    transitions: WORKFLOW_TRANSITIONS,
  });
});
