import { NextRequest } from "next/server";
import { withErrorHandling } from "@/lib/api/handler";
import { success } from "@/lib/api/response";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { WorkflowService } from "@/services/workflow.service";
import { AuthenticationError } from "@/lib/api/errors";

export const GET = withErrorHandling(async (_req: NextRequest, context) => {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new AuthenticationError();

  const { orderId } = await context!.params;
  const service = new WorkflowService(supabase);
  const timeline = await service.getOrderTimeline(orderId);

  return success(timeline);
});
