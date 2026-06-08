import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getStripe } from "@/lib/stripe";

const PLAN_TO_PRICE: Record<string, { monthly: string; yearly: string }> = {
  start: {
    monthly: process.env.STRIPE_PRICE_START_MONTHLY!,
    yearly: process.env.STRIPE_PRICE_START_YEARLY!,
  },
  grow: {
    monthly: process.env.STRIPE_PRICE_GROW_MONTHLY!,
    yearly: process.env.STRIPE_PRICE_GROW_YEARLY!,
  },
  autopilot: {
    monthly: process.env.STRIPE_PRICE_AUTOPILOT_MONTHLY!,
    yearly: process.env.STRIPE_PRICE_AUTOPILOT_YEARLY!,
  },
};

export async function POST(request: NextRequest) {
  const { planId, interval } = await request.json();

  if (!planId || !interval || !PLAN_TO_PRICE[planId]) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {},
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const priceId = PLAN_TO_PRICE[planId][interval as "monthly" | "yearly"];
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://kivo.ai";

  // Check for existing customer
  const { data: existing } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single();

  let customerId = existing?.stripe_customer_id;

  if (!customerId) {
    const customer = await (await getStripe()).customers.create({
      email: user.email!,
      metadata: { user_id: user.id },
    });
    customerId = customer.id;

    await supabase.from("subscriptions").insert({
      user_id: user.id,
      stripe_customer_id: customerId,
      plan_id: planId,
      status: "trialing",
    });
  }

  const session = await (await getStripe()).checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/dashboard/billing`,
    metadata: {
      user_id: user.id,
      plan_id: planId,
      interval,
    },
    subscription_data: {
      trial_period_days: 14,
      metadata: {
        user_id: user.id,
        plan_id: planId,
      },
    },
  });

  return NextResponse.json({ url: session.url });
}
