"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import type { PlanId } from "@/lib/constants";
import { PLANS } from "@/lib/constants";

const PLAN_TO_PRICE: Record<PlanId, { monthly: string; yearly: string }> = {
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

export async function createCheckoutSession(planId: PlanId, interval: "monthly" | "yearly") {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const priceId = PLAN_TO_PRICE[planId][interval];
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://kivo.ai";

  const { data: existingSubscription } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single();

  let customerId = existingSubscription?.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
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

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard/billing?session_id={CHECKOUT_SESSION_ID}`,
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

  if (session.url) {
    redirect(session.url);
  }
}

export async function createPortalSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single();

  if (!subscription?.stripe_customer_id) {
    redirect("/dashboard/billing");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://kivo.ai"}/dashboard/billing`,
  });

  if (session.url) {
    redirect(session.url);
  }
}
