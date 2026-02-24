import { NextRequest } from "next/server";
import { withErrorHandling } from "@/lib/api/handler";
import { created, paginated } from "@/lib/api/response";
import { validateBody, parsePagination } from "@/lib/api/validator";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PatternService } from "@/services/pattern.service";
import { AuthenticationError } from "@/lib/api/errors";
import type { Json } from "@/types/database";
import { z } from "zod";

const createPatternSchema = z.object({
  order_id: z.string().uuid(),
  style_id: z.string().uuid().optional(),
  pattern_code: z.string().min(1, "版型编码不能为空"),
  version: z.string().default("1.0"),
  size_range: z.record(z.string(), z.unknown()).optional(),
  grading_rules: z.record(z.string(), z.unknown()).optional(),
  file_url: z.string().url().optional(),
  notes: z.string().optional(),
});

export const GET = withErrorHandling(async (req: NextRequest) => {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new AuthenticationError();

  const service = new PatternService(supabase);
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

  const service = new PatternService(supabase);
  const body = await validateBody(req, createPatternSchema);

  const pattern = await service.create({
    ...body,
    size_range: body.size_range as Json | undefined,
    grading_rules: body.grading_rules as Json | undefined,
    created_by: user.id,
    status: "draft",
  });

  return created(pattern);
});
