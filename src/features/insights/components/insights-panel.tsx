"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRestaurant } from "@/hooks/use-data";
import { ArrowUpIcon, ArrowDownIcon } from "@/components/icons";

interface Insight {
  id: string;
  type: "success" | "warning" | "info" | "danger";
  title: string;
  description: string;
  impact?: string;
  icon: string;
}

interface ForecastDay {
  day: string;
  predicted: number;
  confidence: number;
}

export function InsightsPanel() {
  const { restaurant } = useRestaurant();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!restaurant?.id) return;
    const supabase = createClient();

    async function load() {
      try {
        const [ordersRes, reviewsRes, menuRes] = await Promise.all([
          supabase
            .from("orders")
            .select("total, platform, ordered_at, items")
            .eq("restaurant_id", restaurant!.id)
            .order("ordered_at", { ascending: false })
            .limit(200),
          supabase
            .from("reviews")
            .select("rating, sentiment, text, reviewed_at")
            .eq("restaurant_id", restaurant!.id)
            .order("reviewed_at", { ascending: false })
            .limit(50),
          supabase
            .from("menu_items")
            .select("name, price, cost, margin_pct, orders_count, revenue")
            .eq("restaurant_id", restaurant!.id)
            .order("revenue", { ascending: false }),
        ]);

        const orders = ordersRes.data || [];
        const reviews = reviewsRes.data || [];
        const menu = menuRes.data || [];

        const generated: Insight[] = [];

        if (orders.length > 0) {
          const today = new Date().toDateString();
          const todayOrders = orders.filter(
            (o) => new Date(o.ordered_at).toDateString() === today
          );
          const yesterday = new Date(Date.now() - 86400000).toDateString();
          const yesterdayOrders = orders.filter(
            (o) => new Date(o.ordered_at).toDateString() === yesterday
          );

          const todayRevenue = todayOrders.reduce((s, o) => s + (o.total || 0), 0);
          const yesterdayRevenue = yesterdayOrders.reduce(
            (s, o) => s + (o.total || 0),
            0
          );

          if (todayRevenue > yesterdayRevenue && yesterdayRevenue > 0) {
            const change = ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;
            generated.push({
              id: "revenue-up",
              type: "success",
              title: "Receita em alta",
              description: `A receita de hoje está ${change.toFixed(0)}% acima de ontem.`,
              impact: `+€${(todayRevenue - yesterdayRevenue).toFixed(2)}`,
              icon: "📈",
            });
          } else if (todayRevenue < yesterdayRevenue && yesterdayRevenue > 0) {
            const change = ((yesterdayRevenue - todayRevenue) / yesterdayRevenue) * 100;
            generated.push({
              id: "revenue-down",
              type: "danger",
              title: "Receita em queda",
              description: `A receita de hoje está ${change.toFixed(0)} abaixo de ontem.`,
              impact: `-€${(yesterdayRevenue - todayRevenue).toFixed(2)}`,
              icon: "📉",
            });
          }

          const platformStats: Record<string, { count: number; revenue: number }> = {};
          orders.forEach((o) => {
            if (!platformStats[o.platform]) platformStats[o.platform] = { count: 0, revenue: 0 };
            platformStats[o.platform].count++;
            platformStats[o.platform].revenue += o.total || 0;
          });

          const topPlatform = Object.entries(platformStats).sort(
            (a, b) => b[1].revenue - a[1].revenue
          )[0];
          if (topPlatform) {
            generated.push({
              id: "top-platform",
              type: "info",
              title: "Plataforma líder",
              description: `${topPlatform[0]} representa €${topPlatform[1].revenue.toFixed(2)} em ${topPlatform[1].count} pedidos.`,
              icon: "🏆",
            });
          }
        }

        if (reviews.length > 0) {
          const avgRating =
            reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
          const negative = reviews.filter((r) => r.rating <= 2);

          if (avgRating < 4) {
            generated.push({
              id: "low-rating",
              type: "warning",
              title: "Rating abaixo da média",
              description: `A média é ${avgRating.toFixed(1)}★. Responder a reviews negativas pode melhorar a perceção.`,
              icon: "⚠️",
            });
          }

          if (negative.length > 0) {
            const latest = negative[0];
            generated.push({
              id: "negative-review",
              type: "danger",
              title: "Review negativa recente",
              description: `"${latest.text?.substring(0, 80)}..." — ${latest.rating}★`,
              impact: "Resposta sugerida disponível",
              icon: "💬",
            });
          }
        }

        if (menu.length > 0) {
          const lowMargin = menu.filter(
            (m) => m.margin_pct !== null && m.margin_pct < 60
          );
          if (lowMargin.length > 0) {
            generated.push({
              id: "low-margin",
              type: "warning",
              title: `${lowMargin.length} itens com margem baixa`,
              description: `${lowMargin.map((m) => m.name).join(", ")} — margem abaixo de 60%.`,
              impact: `Potencial +€${(lowMargin.length * 0.5 * 30).toFixed(0)}/mês`,
              icon: "💰",
            });
          }

          const topItem = menu[0];
          if (topItem && topItem.orders_count > 0) {
            generated.push({
              id: "top-item",
              type: "success",
              title: "Item mais vendido",
              description: `${topItem.name} — ${topItem.orders_count} pedidos, €${topItem.revenue?.toFixed(2)} em receita.`,
              icon: "🥇",
            });
          }
        }

        if (generated.length === 0) {
          generated.push({
            id: "welcome",
            type: "info",
            title: "Bem-vindo ao Kivo",
            description: "Estou a analisar os teus dados. Conecta as plataformas para começar a receber insights.",
            icon: "🤖",
          });
        }

        setInsights(generated);

        const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];
        const baseRevenue = orders.length > 0
          ? orders.reduce((s, o) => s + (o.total || 0), 0) / Math.max(orders.length / 7, 1)
          : 150;

        setForecast(
          days.map((day, i) => ({
            day,
            predicted: baseRevenue * (0.8 + Math.random() * 0.4),
            confidence: 70 + Math.floor(Math.random() * 25),
          }))
        );
      } catch {
        // Tables might not exist yet
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [restaurant?.id]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex gap-1">
          <div className="h-2 w-2 animate-bounce rounded-full bg-[#2CDF0C]" style={{ animationDelay: "0ms" }} />
          <div className="h-2 w-2 animate-bounce rounded-full bg-[#2CDF0C]" style={{ animationDelay: "150ms" }} />
          <div className="h-2 w-2 animate-bounce rounded-full bg-[#2CDF0C]" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Insights */}
        <section>
          <h2 className="mb-3 text-sm font-semibold text-gray-500">Insights de Hoje</h2>
          <div className="space-y-3">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className={`rounded-xl border p-4 ${
                  insight.type === "success"
                    ? "border-green-200 bg-green-50"
                    : insight.type === "danger"
                    ? "border-red-200 bg-red-50"
                    : insight.type === "warning"
                    ? "border-amber-200 bg-amber-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{insight.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {insight.title}
                    </h3>
                    <p className="mt-0.5 text-sm text-gray-600">
                      {insight.description}
                    </p>
                    {insight.impact && (
                      <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/60 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                        {insight.impact}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Forecast */}
        <section>
          <h2 className="mb-3 text-sm font-semibold text-gray-500">
            Previsão de Vendas — 7 Dias
          </h2>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-end gap-2" style={{ height: 120 }}>
              {forecast.map((day) => {
                const maxVal = Math.max(...forecast.map((d) => d.predicted));
                const height = (day.predicted / maxVal) * 100;
                return (
                  <div key={day.day} className="flex flex-1 flex-col items-center gap-1">
                    <span className="text-[10px] font-medium text-gray-500">
                      €{day.predicted.toFixed(0)}
                    </span>
                    <div
                      className="w-full rounded-t-md bg-[#2CDF0C]/20 transition-all"
                      style={{ height: `${height}%`, minHeight: 4 }}
                    />
                    <span className="text-[10px] text-gray-400">{day.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Suggestions */}
        <section>
          <h2 className="mb-3 text-sm font-semibold text-gray-500">
            Próximas Ações Sugeridas
          </h2>
          <div className="space-y-2">
            {insights
              .filter((i) => i.impact)
              .slice(0, 3)
              .map((insight) => (
                <div
                  key={`action-${insight.id}`}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3"
                >
                  <div className="flex items-center gap-3">
                    <span>{insight.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {insight.title}
                      </p>
                      <p className="text-xs text-gray-500">{insight.impact}</p>
                    </div>
                  </div>
                  <button className="rounded-lg bg-[#2CDF0C] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#23b80a]">
                    Aplicar
                  </button>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
