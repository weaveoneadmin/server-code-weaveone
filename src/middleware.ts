import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/v1/health") || pathname.startsWith("/api/v1/workflow/stages")) {
    return NextResponse.next();
  }

  return await updateSession(request);
}

export const config = {
  matcher: ["/api/:path*"],
};
