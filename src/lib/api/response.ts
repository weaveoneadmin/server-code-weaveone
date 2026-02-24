import { NextResponse } from "next/server";
import type { ApiResponse, PaginatedResponse, PaginationParams } from "@/types/api";

export function success<T>(data: T, statusCode = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    { success: true, data, error: null, timestamp: new Date().toISOString() },
    { status: statusCode }
  );
}

export function created<T>(data: T): NextResponse<ApiResponse<T>> {
  return success(data, 201);
}

export function paginated<T>(
  data: T[],
  total: number,
  pagination: PaginationParams
): NextResponse<PaginatedResponse<T>> {
  const { page = 1, pageSize = 20 } = pagination;
  const totalPages = Math.ceil(total / pageSize);

  return NextResponse.json(
    {
      success: true,
      data,
      error: null,
      timestamp: new Date().toISOString(),
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    },
    { status: 200 }
  );
}

export function error(
  message: string,
  statusCode = 500,
  code = "INTERNAL_ERROR",
  details?: Record<string, string[]>
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      success: false,
      data: null,
      error: { message, code, details },
      timestamp: new Date().toISOString(),
    },
    { status: statusCode }
  );
}
