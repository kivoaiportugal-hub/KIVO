import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { planId, interval } = await request.json();

  if (!planId || !interval) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  // Mock: return a fake Stripe checkout URL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://kivo.ai";
  return NextResponse.json({
    url: `${appUrl}/dashboard/billing/success?session_id=mock_session`,
  });
}
