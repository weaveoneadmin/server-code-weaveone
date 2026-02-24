import { NextRequest } from "next/server";
import { withErrorHandling } from "@/lib/api/handler";
import { created, paginated } from "@/lib/api/response";
import { validateBody, parsePagination } from "@/lib/api/validator";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { DeliveryService } from "@/services/delivery.service";
import { AuthenticationError } from "@/lib/api/errors";
import { z } from "zod";

const createDeliverySchema = z.object({
  order_id: z.string().uuid(),
  delivery_number: z.string().min(1, "交付编号不能为空"),
  shipment_method: z.string().optional(),
  tracking_number: z.string().optional(),
  estimated_date: z.string().datetime().optional(),
  quantity: z.number().positive().optional(),
});

export const GET = withErrorHandling(async (req: NextRequest) => {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new AuthenticationError();

  const service = new DeliveryService(supabase);
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

  const service = new DeliveryService(supabase);
  const body = await validateBody(req, createDeliverySchema);

  const delivery = await service.create({
    ...body,
    created_by: user.id,
    status: "pending",
  });

  return created(delivery);
});
