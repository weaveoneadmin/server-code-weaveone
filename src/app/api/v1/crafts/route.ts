import { NextRequest } from "next/server";
import { withErrorHandling } from "@/lib/api/handler";
import { created, paginated } from "@/lib/api/response";
import { validateBody, parsePagination } from "@/lib/api/validator";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CraftService } from "@/services/craft.service";
import { AuthenticationError } from "@/lib/api/errors";
import type { Json } from "@/types/database";
import { z } from "zod";

const createCraftSchema = z.object({
  order_id: z.string().uuid(),
  style_id: z.string().uuid().optional(),
  process_name: z.string().min(1, "工艺名称不能为空"),
  process_code: z.string().min(1, "工艺编码不能为空"),
  description: z.string().optional(),
  steps: z.array(z.record(z.string(), z.unknown())).optional(),
  equipment: z.array(z.string()).optional(),
  estimated_hours: z.number().positive().optional(),
});

export const GET = withErrorHandling(async (req: NextRequest) => {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new AuthenticationError();

  const service = new CraftService(supabase);
  const { page, pageSize } = parsePagination(req);
  const orderId = req.nextUrl.searchParams.get("order_id") ?? undefined;

  const filters: Record<string, unknown> = {};
  if (orderId) filters.order_id = orderId;

  const result = await service.findMany({ page, pageSize, filters });
  return paginated(result.data, result.total, { page, pageSize });
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new AuthenticationError();

  const service = new CraftService(supabase);
  const body = await validateBody(req, createCraftSchema);

  const craft = await service.create({
    ...body,
    steps: body.steps as Json | undefined,
    equipment: body.equipment as Json | undefined,
    created_by: user.id,
    status: "draft",
  });

  return created(craft);
});
