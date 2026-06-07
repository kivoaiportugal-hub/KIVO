"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRestaurant } from "@/hooks/use-data";

export default function ForecastsPage() {
  const supabase = createClient();
  const { restaurant } = useRestaurant();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!restaurant?.id) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("restaurant_id", restaurant.id)
        .order("ordered_at", { ascending: false })
        .limit(300);

      setOrders(data || []);
      setLoading(false);
    };

    fetchOrders();
  }, [restaurant?.id]);

  // Calculate daily averages from real data
  const dayOfWeekMap: Record<string, number[]> = {
    Seg: [],
    Ter: [],
    Qua: [],
    Qui: [],
    Sex: [],
    Sáb: [],
    Dom: [],
  };

  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  orders.forEach((o) => {
    const date = new Date(o.ordered_at);
    const dayName = dayNames[date.getDay()];
    if (dayOfWeekMap[dayName]) {
      dayOfWeekMap[dayName].push(o.total || 0);
    }
  });

  const forecastData = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map(
    (day) => {
      const dayOrders = dayOfWeekMap[day];
      const avg = dayOrders.length > 0
        ? dayOrders.reduce((s, v) => s + v, 0) / dayOrders.length
        : 0;
      const count = dayOrders.length;
      return {
        day,
        avgRevenue: Math.round(avg),
        orderCount: count,
      };
    }
  );

  const totalWeeklyRevenue = forecastData.reduce(
    (s, d) => s + d.avgRevenue,
    0
  );
  const totalWeeklyOrders = forecastData.reduce(
    (s, d) => s + d.orderCount,
    0
  );

  const maxRevenue = Math.max(...forecastData.map((d) => d.avgRevenue), 1);

  // Generate insights from real data
  const bestDay = forecastData.reduce((a, b) =>
    a.avgRevenue > b.avgRevenue ? a : b
  );
  const worstDay = forecastData.reduce((a, b) =>
    a.avgRevenue < b.avgRevenue ? a : b
  );

  const insights = [];
  if (orders.length > 0) {
    if (bestDay.day !== worstDay.day) {
      insights.push({
        title: `${bestDay.day} é o melhor dia`,
        description: `Média de €${bestDay.avgRevenue}/dia. Considera reforçar a equipa.`,
        type: "success",
      });
    }
    if (worstDay.avgRevenue < bestDay.avgRevenue * 0.5) {
      insights.push({
        title: `${worstDay.day} é mais fraco`,
        description: `Média de €${worstDay.avgRevenue}/dia. Uma promoção pode ajudar.`,
        type: "warning",
      });
    }
    insights.push({
      title: `${orders.length} pedidos nos últimos registos`,
      description: `Receita média: €${totalWeeklyOrders > 0 ? (totalWeeklyRevenue / 7).toFixed(0) : 0}/dia.`,
      type: "info",
    });
  }

  const typeStyles = {
    info: "border-primary/20 bg-primary/5",
    warning: "border-yellow-500/20 bg-yellow-500/5",
    success: "border-green-500/20 bg-green-500/5",
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-muted" />
          <div className="h-48 rounded-lg border bg-card" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Forecast</h1>
        <p className="text-sm text-muted-foreground">
          Previsões baseadas nos teus dados históricos de pedidos.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
          Sem dados de pedidos para gerar previsões. Liga as tuas plataformas em{" "}
          <a href="/dashboard/integrations" className="text-primary hover:underline">
            Integrações
          </a>
          .
        </div>
      ) : (
        <>
          {/* Forecast Chart */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-semibold mb-4">
              Receita Média por Dia da Semana
            </h3>
            <div className="flex items-end gap-3 h-48">
              {forecastData.map((d) => (
                <div
                  key={d.day}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  <div
                    className="w-full rounded-t bg-primary transition-all min-h-[2px]"
                    style={{
                      height: `${
                        maxRevenue > 0
                          ? (d.avgRevenue / maxRevenue) * 100
                          : 0
                      }%`,
                    }}
                  />
                  <span className="text-xs font-medium">{d.day}</span>
                  <span className="text-[10px] text-muted-foreground">
                    €{d.avgRevenue}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          {insights.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Insights AI</h3>
              {insights.map((insight) => (
                <div
                  key={insight.title}
                  className={`rounded-lg border p-4 ${
                    typeStyles[insight.type as keyof typeof typeStyles]
                  }`}
                >
                  <div className="font-medium text-sm">{insight.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {insight.description}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Summary */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-semibold mb-4">Resumo</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{totalWeeklyOrders}</div>
                <div className="text-xs text-muted-foreground">
                  Pedidos (total registados)
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  €{totalWeeklyRevenue}
                </div>
                <div className="text-xs text-muted-foreground">
                  Receita total
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  €{orders.length > 0 ? (orders.reduce((s, o) => s + (o.total || 0), 0) / orders.length).toFixed(2) : "0"}
                </div>
                <div className="text-xs text-muted-foreground">
                  Ticket médio
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
