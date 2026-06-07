"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRestaurant } from "@/hooks/use-data";
import { KPICard } from "@/features/home/components/kpi-card";

export default function PerformancePage() {
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
        .limit(200);

      setOrders(data || []);
      setLoading(false);
    };

    fetchOrders();
  }, [restaurant?.id]);

  // Calculate stats from real orders
  const today = new Date().toDateString();
  const todayOrders = orders.filter(
    (o) => new Date(o.ordered_at).toDateString() === today
  );
  const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const todayCount = todayOrders.length;
  const avgTicket = todayCount > 0 ? todayRevenue / todayCount : 0;

  // Platform breakdown
  const platformMap: Record<string, { revenue: number; orders: number }> = {};
  orders.forEach((o) => {
    if (!platformMap[o.platform]) {
      platformMap[o.platform] = { revenue: 0, orders: 0 };
    }
    platformMap[o.platform].revenue += o.total || 0;
    platformMap[o.platform].orders += 1;
  });

  const platformColors: Record<string, string> = {
    uber_eats: "#06C167",
    glovo: "#000000",
    bolt_food: "#2DB5A0",
  };

  const platformNames: Record<string, string> = {
    uber_eats: "Uber Eats",
    glovo: "Glovo",
    bolt_food: "Bolt Food",
  };

  // Hourly breakdown (last 7 days)
  const hourlyMap: Record<number, number> = {};
  for (let h = 10; h <= 23; h++) hourlyMap[h] = 0;
  orders.forEach((o) => {
    const h = new Date(o.ordered_at).getHours();
    if (hourlyMap[h] !== undefined) hourlyMap[h]++;
  });
  const hourlyData = Object.entries(hourlyMap).map(([h, count]) => ({
    hour: `${h}h`,
    orders: count,
  }));
  const maxOrders = Math.max(...hourlyData.map((d) => d.orders), 1);

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-muted" />
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 rounded-lg border bg-card p-4" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Performance</h1>
        <p className="text-sm text-muted-foreground">
          Análise detalhada do teu desempenho por plataforma e período.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <KPICard
          label="Receita Total"
          value={`€${orders.reduce((s, o) => s + (o.total || 0), 0).toFixed(0)}`}
          icon="💰"
        />
        <KPICard label="Total Pedidos" value={String(orders.length)} icon="📦" />
        <KPICard
          label="Ticket Médio"
          value={
            orders.length > 0
              ? `€${(orders.reduce((s, o) => s + (o.total || 0), 0) / orders.length).toFixed(2)}`
              : "€0"
          }
          icon="🎫"
        />
      </div>

      {/* Platform Breakdown */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="text-sm font-semibold mb-4">Por Plataforma</h3>
        {Object.keys(platformMap).length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Sem dados de pedidos. Liga as tuas plataformas em{" "}
            <a href="/dashboard/integrations" className="text-primary hover:underline">
              Integrações
            </a>
            .
          </p>
        ) : (
          <div className="space-y-4">
            {Object.entries(platformMap).map(([platform, data]) => {
              const maxRevenue = Math.max(...Object.values(platformMap).map((p) => p.revenue), 1);
              return (
                <div key={platform} className="flex items-center gap-4">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                    style={{ backgroundColor: platformColors[platform] || "#666" }}
                  >
                    {(platformNames[platform] || platform).charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {platformNames[platform] || platform}
                      </span>
                      <span className="text-sm font-bold">
                        €{data.revenue.toFixed(0)}
                      </span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${(data.revenue / maxRevenue) * 100}%`,
                          backgroundColor: platformColors[platform] || "#666",
                        }}
                      />
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {data.orders} pedidos
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Hourly Chart */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="text-sm font-semibold mb-4">Pedidos por Hora</h3>
        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Sem dados de pedidos ainda.
          </p>
        ) : (
          <div className="flex items-end gap-2 h-48">
            {hourlyData.map((d) => (
              <div
                key={d.hour}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <div
                  className="w-full rounded-t bg-primary/80 transition-all min-h-[2px]"
                  style={{
                    height: `${maxOrders > 0 ? (d.orders / maxOrders) * 100 : 0}%`,
                  }}
                />
                <span className="text-[10px] text-muted-foreground">
                  {d.hour}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
