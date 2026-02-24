import { NextRequest } from "next/server";
import { withErrorHandling } from "@/lib/api/handler";
import { success } from "@/lib/api/response";
import { validateBody } from "@/lib/api/validator";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { WorkflowService } from "@/services/workflow.service";
import { advanceWorkflowSchema } from "@/lib/validations/workflow.schema";
import { AuthenticationError } from "@/lib/api/errors";

export const POST = withErrorHandling(async (req: NextRequest) => {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new AuthenticationError();

  const body = await validateBody(req, advanceWorkflowSchema);
  const service = new WorkflowService(supabase);
  const result = await service.advanceOrder(body.order_id, user.id, body.notes);

  return success(result);
});
