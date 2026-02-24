import { NextRequest } from "next/server";
import { withErrorHandling } from "@/lib/api/handler";
import { success } from "@/lib/api/response";
import { validateBody } from "@/lib/api/validator";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { WorkflowService } from "@/services/workflow.service";
import { rollbackWorkflowSchema } from "@/lib/validations/workflow.schema";
import { AuthenticationError } from "@/lib/api/errors";

export const POST = withErrorHandling(async (req: NextRequest) => {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new AuthenticationError();

  const body = await validateBody(req, rollbackWorkflowSchema);
  const service = new WorkflowService(supabase);
  const result = await service.rollbackOrder(body.order_id, user.id, body.target_stage, body.notes);

  return success(result);
});
