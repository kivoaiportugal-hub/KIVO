import { NextResponse, type NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  if (!webhookSecret || webhookSecret === "whsec_REPLACE_ME") {
    return NextResponse.json(
      { error: "Stripe webhook not configured" },
      { status: 503 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: any;

  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.user_id;
        const planId = session.metadata?.plan_id;
        const interval = session.metadata?.interval;

        if (userId && session.subscription) {
          const subscription = await getStripe().subscriptions.retrieve(
            session.subscription as string
          );

          const sub = subscription as unknown as {
            current_period_start: number;
            current_period_end: number;
            trial_end: number | null;
          };

          await supabase
            .from("subscriptions")
            .update({
              stripe_subscription_id: subscription.id,
              stripe_price_id: subscription.items.data[0]?.price.id,
              plan_id: planId,
              status:
                subscription.status === "trialing" ? "trialing" : "active",
              interval: interval || "monthly",
              current_period_start: new Date(
                sub.current_period_start * 1000
              ).toISOString(),
              current_period_end: new Date(
                sub.current_period_end * 1000
              ).toISOString(),
              trial_end: sub.trial_end
                ? new Date(sub.trial_end * 1000).toISOString()
                : null,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", userId);

          await supabase.auth.admin.updateUserById(userId, {
            user_metadata: { plan: planId },
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const userId = subscription.metadata?.user_id;

        if (userId) {
          const statusMap: Record<string, string> = {
            active: "active",
            past_due: "past_due",
            canceled: "canceled",
            unpaid: "unpaid",
            trialing: "trialing",
            paused: "paused",
          };

          const sub = subscription as unknown as {
            current_period_start: number;
            current_period_end: number;
          };

          await supabase
            .from("subscriptions")
            .update({
              status: statusMap[subscription.status] || subscription.status,
              current_period_start: new Date(
                sub.current_period_start * 1000
              ).toISOString(),
              current_period_end: new Date(
                sub.current_period_end * 1000
              ).toISOString(),
              stripe_price_id: subscription.items.data[0]?.price.id,
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", subscription.id);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;

        await supabase
          .from("subscriptions")
          .update({
            status: "canceled",
            canceled_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        if (subscription.metadata?.user_id) {
          await supabase.auth.admin.updateUserById(
            subscription.metadata.user_id,
            { user_metadata: { plan: "free" } }
          );
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        if (invoice.subscription) {
          const subscription = await getStripe().subscriptions.retrieve(
            invoice.subscription as string
          );
          const userId = subscription.metadata?.user_id;

          if (userId) {
            await supabase
              .from("subscriptions")
              .update({
                status: "past_due",
                updated_at: new Date().toISOString(),
              })
              .eq("stripe_subscription_id", subscription.id);
          }
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
