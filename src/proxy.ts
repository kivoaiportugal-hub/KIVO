import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isDashboard = pathname.startsWith("/dashboard");
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");

  // Simple auth check using localStorage (mock mode)
  // In mock mode, we allow all routes and let the client handle auth
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
