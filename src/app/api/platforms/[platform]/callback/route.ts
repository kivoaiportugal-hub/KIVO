import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/dashboard/settings?error=missing_params", request.url));
  }

  // Mock: always succeed and redirect to settings
  return NextResponse.redirect(new URL("/dashboard/settings?connected=mock_platform", request.url));
}
