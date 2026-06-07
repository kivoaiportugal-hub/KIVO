"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSubscription } from "@/features/billing/subscription-provider";
import { PLANS } from "@/lib/constants";
import type { PlanId } from "@/lib/constants";

export default function BillingPage() {
  const { subscription, plan, isActive, isTrialing, loading, refresh } =
    useSubscription();
  const supabase = createClient();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>(plan);
  const [interval, setInterval] = useState<"monthly" | "yearly">("monthly");
  const [creating, setCreating] = useState(false);

  const handleCheckout = async (planId: PlanId) => {
    setCreating(true);
    setSelectedPlan(planId);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const response = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId, interval }),
    });

    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
    }
    setCreating(false);
  };

  const handlePortal = async () => {
    const response = await fetch("/api/billing/portal", { method: "POST" });
    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
    }
  };

  const trialEndDate = subscription?.trial_end
    ? new Date(subscription.trial_end).toLocaleDateString("pt-PT")
    : null;

  const periodEndDate = subscription?.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString("pt-PT")
    : null;

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-muted" />
          <div className="h-4 w-96 rounded bg-muted" />
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-lg border bg-card p-6" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        <p className="text-sm text-muted-foreground">
          Gerir a tua subscrição e pagamentos.
        </p>
      </div>

      {/* Current plan */}
      {subscription && (
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Plano Atual</h3>
              <p className="text-2xl font-bold">{PLANS[plan]?.name || "Free"}</p>
              {isTrialing && trialEndDate && (
                <p className="text-sm text-muted-foreground">
                  Trial termina em {trialEndDate}
                </p>
              )}
              {isActive && periodEndDate && (
                <p className="text-sm text-muted-foreground">
                  Renova em {periodEndDate}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  isActive
                    ? "bg-green-100 text-green-800"
                    : isTrialing
                      ? "bg-blue-100 text-blue-800"
                      : subscription.status === "past_due"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                }`}
              >
                {isActive
                  ? "Ativo"
                  : isTrialing
                    ? "Em trial"
                    : subscription.status === "past_due"
                      ? "Pagamento pendente"
                      : subscription.status}
              </span>
              <button
                onClick={handlePortal}
                className="inline-flex h-8 items-center justify-center rounded-md border px-3 text-xs font-medium hover:bg-accent"
              >
                Gerir Subscrição
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interval toggle */}
      <div className="flex items-center justify-center gap-1 rounded-lg border bg-muted p-1 w-fit">
        <button
          onClick={() => setInterval("monthly")}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            interval === "monthly"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Mensal
        </button>
        <button
          onClick={() => setInterval("yearly")}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            interval === "yearly"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Anual
          <span className="ml-1 text-xs text-primary">-17%</span>
        </button>
      </div>

      {/* Plans */}
      <div className="grid gap-4 md:grid-cols-3">
        {(Object.entries(PLANS) as [PlanId, (typeof PLANS)[PlanId]][]).map(
          ([id, planData]) => {
            const isCurrent = plan === id;
            const price =
              interval === "yearly" ? planData.priceYearly : planData.price;
            const periodPrice =
              interval === "yearly"
                ? Math.round(planData.priceYearly / 12)
                : planData.price;

            return (
              <div
                key={id}
                className={`relative rounded-lg border bg-card p-6 shadow-sm transition-all ${
                  isCurrent
                    ? "border-primary ring-2 ring-primary/20"
                    : "hover:border-primary/50"
                } ${id === "grow" ? "border-primary" : ""}`}
              >
                {id === "grow" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
                    Popular
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="text-lg font-bold">{planData.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {planData.tagline}
                  </p>
                </div>
                <div className="mb-6">
                  <span className="text-3xl font-bold">€{periodPrice}</span>
                  <span className="text-sm text-muted-foreground">/mês</span>
                  {interval === "yearly" && (
                    <p className="text-xs text-muted-foreground">
                      €{price}/ano (poupas €{(planData.price * 12 - planData.priceYearly)})
                    </p>
                  )}
                </div>
                <ul className="mb-6 space-y-2 text-sm">
                  {planData.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleCheckout(id)}
                  disabled={isCurrent || creating}
                  className={`flex h-10 w-full items-center justify-center rounded-md text-sm font-medium transition-colors ${
                    isCurrent
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : id === "grow"
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "border bg-background hover:bg-accent"
                  } disabled:opacity-50`}
                >
                  {isCurrent
                    ? "Plano Atual"
                    : creating
                      ? "A redirecionar..."
                      : "Começar"}
                </button>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
