import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret || webhookSecret === "whsec_REPLACE_ME") {
    return NextResponse.json(
      { error: "Stripe webhook not configured" },
      { status: 503 }
    );
  }

  // Mock: just acknowledge
  return NextResponse.json({ received: true });
}
