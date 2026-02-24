import { NextRequest } from "next/server";
import { withErrorHandling } from "@/lib/api/handler";
import { created, paginated } from "@/lib/api/response";
import { validateBody, parsePagination } from "@/lib/api/validator";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { FabricService } from "@/services/fabric.service";
import { AuthenticationError } from "@/lib/api/errors";
import { z } from "zod";

const createFabricSchema = z.object({
  order_id: z.string().uuid(),
  style_id: z.string().uuid().optional(),
  name: z.string().min(1, "面料名称不能为空"),
  fabric_code: z.string().min(1, "面料编码不能为空"),
  material: z.string().optional(),
  color: z.string().optional(),
  weight: z.string().optional(),
  width: z.string().optional(),
  supplier: z.string().optional(),
  unit_price: z.number().positive().optional(),
  quantity: z.number().positive().optional(),
});

export const GET = withErrorHandling(async (req: NextRequest) => {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new AuthenticationError();

  const service = new FabricService(supabase);
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

  const service = new FabricService(supabase);
  const body = await validateBody(req, createFabricSchema);

  const fabric = await service.create({
    ...body,
    created_by: user.id,
    status: "pending",
  });

  return created(fabric);
});
