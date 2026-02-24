import { NextRequest } from "next/server";
import { ZodSchema } from "zod";

/**
 * Parse and validate request JSON body against a Zod schema.
 */
export async function validateBody<T>(req: NextRequest, schema: ZodSchema<T>): Promise<T> {
  const body = await req.json();
  return schema.parse(body);
}

/**
 * Parse and validate URL search params against a Zod schema.
 */
export function validateQuery<T>(req: NextRequest, schema: ZodSchema<T>): T {
  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  return schema.parse(params);
}

/**
 * Extract pagination params from search params.
 */
export function parsePagination(req: NextRequest) {
  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page")) || 1);
  const pageSize = Math.min(
    100,
    Math.max(1, Number(req.nextUrl.searchParams.get("pageSize")) || 20)
  );
  const offset = (page - 1) * pageSize;
  return { page, pageSize, offset };
}
