import { NextRequest } from "next/server";
import { withErrorHandling } from "@/lib/api/handler";
import { created, paginated } from "@/lib/api/response";
import { validateBody, parsePagination } from "@/lib/api/validator";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { OrderService } from "@/services/order.service";
import { createOrderSchema } from "@/lib/validations/order.schema";
import { AuthenticationError } from "@/lib/api/errors";
import type { Json } from "@/types/database";

export const GET = withErrorHandling(async (req: NextRequest) => {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new AuthenticationError();

  const service = new OrderService(supabase);
  const { page, pageSize } = parsePagination(req);

  const status = req.nextUrl.searchParams.get("status") ?? undefined;
  const stage = req.nextUrl.searchParams.get("stage") ?? undefined;
  const search = req.nextUrl.searchParams.get("search") ?? undefined;

  let result;
  if (search) {
    result = await service.search(search, page, pageSize);
  } else {
    const filters: Record<string, unknown> = {};
    if (status) filters.status = status;
    if (stage) filters.current_stage = stage;
    result = await service.findMany({ page, pageSize, filters });
  }

  return paginated(result.data, result.total, { page, pageSize });
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new AuthenticationError();

  const service = new OrderService(supabase);
  const body = await validateBody(req, createOrderSchema);

  const order = await service.create({
    ...body,
    requirements: body.requirements as Json | undefined,
    created_by: user.id,
    current_stage: "order_intake",
    status: "draft",
  });

  return created(order);
});
