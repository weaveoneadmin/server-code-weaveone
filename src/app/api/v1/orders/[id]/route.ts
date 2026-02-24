import { NextRequest } from "next/server";
import { withErrorHandling } from "@/lib/api/handler";
import { success } from "@/lib/api/response";
import { validateBody } from "@/lib/api/validator";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { OrderService } from "@/services/order.service";
import { updateOrderSchema } from "@/lib/validations/order.schema";
import { AuthenticationError } from "@/lib/api/errors";
import type { Json } from "@/types/database";

export const GET = withErrorHandling(
  async (_req: NextRequest, context) => {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new AuthenticationError();

    const { id } = await context!.params;
    const service = new OrderService(supabase);
    const order = await service.findById(id);

    return success(order);
  }
);

export const PATCH = withErrorHandling(
  async (req: NextRequest, context) => {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new AuthenticationError();

    const { id } = await context!.params;
    const service = new OrderService(supabase);
    const body = await validateBody(req, updateOrderSchema);

    const order = await service.update(id, {
      ...body,
      requirements: body.requirements as Json | undefined,
      updated_at: new Date().toISOString(),
    });

    return success(order);
  }
);

export const DELETE = withErrorHandling(
  async (_req: NextRequest, context) => {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new AuthenticationError();

    const { id } = await context!.params;
    const service = new OrderService(supabase);
    await service.delete(id);

    return success({ deleted: true });
  }
);
