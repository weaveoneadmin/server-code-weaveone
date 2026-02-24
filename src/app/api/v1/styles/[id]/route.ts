import { NextRequest } from "next/server";
import { withErrorHandling } from "@/lib/api/handler";
import { success } from "@/lib/api/response";
import { validateBody } from "@/lib/api/validator";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { StyleService } from "@/services/style.service";
import { updateStyleSchema } from "@/lib/validations/style.schema";
import { AuthenticationError } from "@/lib/api/errors";
import type { Json } from "@/types/database";

export const GET = withErrorHandling(async (_req: NextRequest, context) => {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new AuthenticationError();

  const { id } = await context!.params;
  const service = new StyleService(supabase);
  return success(await service.findById(id));
});

export const PATCH = withErrorHandling(async (req: NextRequest, context) => {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new AuthenticationError();

  const { id } = await context!.params;
  const service = new StyleService(supabase);
  const body = await validateBody(req, updateStyleSchema);
  return success(await service.update(id, {
    ...body,
    design_images: body.design_images as Json | undefined,
    specifications: body.specifications as Json | undefined,
    updated_at: new Date().toISOString(),
  }));
});

export const DELETE = withErrorHandling(async (_req: NextRequest, context) => {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new AuthenticationError();

  const { id } = await context!.params;
  const service = new StyleService(supabase);
  await service.delete(id);
  return success({ deleted: true });
});
