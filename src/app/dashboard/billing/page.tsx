"use client";

import { useEffect, useState } from "react";
import { useRestaurant } from "@/hooks/use-data";
import { useSubscription } from "@/features/billing/subscription-provider";
import { createClient } from "@/lib/supabase/client";
import { PLANS } from "@/lib/constants";

export default function BillingPage() {
  const { restaurant } = useRestaurant();
  const { plan, isActive, isTrialing, loading: subLoading, refresh } = useSubscription();
  const supabase = createClient();

  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const { data } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();
        if (data) setSubscription(data);
      } catch {} finally { setLoading(false); }
    };
    loadSubscription();
  }, []);

  const handleUpgrade = async (planId: string) => {
    setUpgrading(planId);
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, interval: "monthly" }),
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
    } catch {} finally { setUpgrading(null); }
  };

  const handlePortal = async () => {
    try {
      const response = await fetch("/api/billing/portal", { method: "POST" });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
    } catch {}
  };

  const currentPlan = PLANS[plan] || PLANS.start;

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-lg font-bold text-gray-900">Subscrição</h1>

        {/* Current Plan */}
        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-700">Plano Atual</h2>
              <p className="mt-1 text-2xl font-bold text-gray-900">{currentPlan.name}</p>
              <p className="text-sm text-gray-500">€{currentPlan.price}/mês</p>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                isActive ? "bg-green-100 text-green-700" :
                isTrialing ? "bg-blue-100 text-blue-700" :
                "bg-gray-100 text-gray-500"
              }`}>
                {isActive ? "Ativo" : isTrialing ? "Trial" : "Inativo"}
              </span>
            </div>
          </div>

          {subscription?.current_period_end && (
            <p className="text-xs text-gray-400">
              {isActive ? "Próxima cobrança" : "Acesso até"}:{" "}
              {new Date(subscription.current_period_end).toLocaleDateString("pt-PT")}
            </p>
          )}

          <div className="mt-4 flex gap-2">
            <button
              onClick={handlePortal}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Gerir Subscrição
            </button>
          </div>
        </section>

        {/* Plan Features */}
        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">O teu plano inclui</h2>
          <ul className="space-y-2">
            {currentPlan.features.map((feature: string) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-[#187906]">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </section>

        {/* Upgrade Options */}
        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">Upgrade de Plano</h2>
          <div className="space-y-3">
            {Object.entries(PLANS).map(([id, p]) => {
              const isCurrent = id === plan;
              const isHigher = p.price > currentPlan.price;
              return (
                <div
                  key={id}
                  className={`flex items-center justify-between rounded-lg border p-4 ${
                    isCurrent ? "border-[#2CDF0C] bg-[#2CDF0C]/5" : "border-gray-100"
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-500">€{p.price}/mês</p>
                  </div>
                  {isCurrent ? (
                    <span className="text-xs font-medium text-[#187906]">Plano Atual</span>
                  ) : isHigher ? (
                    <button
                      onClick={() => handleUpgrade(id)}
                      disabled={upgrading === id}
                      className="rounded-lg bg-[#2CDF0C] px-4 py-2 text-xs font-medium text-white hover:bg-[#23b80a] disabled:opacity-50"
                    >
                      {upgrading === id ? "A processar..." : "Fazer Upgrade"}
                    </button>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>

        {/* Invoice History */}
        {subscription?.stripe_customer_id && (
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-gray-700">Histórico de Faturação</h2>
            <p className="text-sm text-gray-500">
              Visita o portal de clientes para ver faturas ehistórico de pagamentos.
            </p>
            <button
              onClick={handlePortal}
              className="mt-3 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Ver Faturas
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
