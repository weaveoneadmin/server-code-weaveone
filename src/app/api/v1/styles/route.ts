import { NextRequest } from "next/server";
import { withErrorHandling } from "@/lib/api/handler";
import { created, paginated } from "@/lib/api/response";
import { validateBody, parsePagination } from "@/lib/api/validator";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { StyleService } from "@/services/style.service";
import { createStyleSchema } from "@/lib/validations/style.schema";
import { AuthenticationError } from "@/lib/api/errors";
import type { Json } from "@/types/database";

export const GET = withErrorHandling(async (req: NextRequest) => {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new AuthenticationError();

  const service = new StyleService(supabase);
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

  const service = new StyleService(supabase);
  const body = await validateBody(req, createStyleSchema);

  const style = await service.create({
    ...body,
    design_images: body.design_images as Json | undefined,
    specifications: body.specifications as Json | undefined,
    created_by: user.id,
    status: "draft",
  });

  return created(style);
});
