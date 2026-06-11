import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const next = searchParams.get("next") ?? "/dashboard/assistant";

  // Mock: always redirect to dashboard
  return NextResponse.redirect(`${origin}${next}`, 302);
}
