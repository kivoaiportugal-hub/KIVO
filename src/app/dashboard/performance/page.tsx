"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRestaurant } from "@/hooks/use-data";

interface Order {
  total: number;
  platform: string;
  ordered_at: string;
}

export default function PerformancePage() {
  const { restaurant } = useRestaurant();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!restaurant?.id) return;
    const supabase = createClient();
    supabase
      .from("orders")
      .select("total, platform, ordered_at")
      .eq("restaurant_id", restaurant.id)
      .order("ordered_at", { ascending: false })
      .limit(500)
      .then(({ data }) => {
        setOrders(data || []);
        setLoading(false);
      });
  }, [restaurant?.id]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#2CDF0C]" />
      </div>
    );
  }

  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const totalOrders = orders.length;
  const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const today = new Date().toDateString();
  const todayOrders = orders.filter((o) => new Date(o.ordered_at).toDateString() === today);
  const todayRevenue = todayOrders.reduce((s, o) => s + (o.total || 0), 0);

  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const yesterdayOrders = orders.filter((o) => new Date(o.ordered_at).toDateString() === yesterday);
  const yesterdayRevenue = yesterdayOrders.reduce((s, o) => s + (o.total || 0), 0);

  const revenueChange = yesterdayRevenue > 0 ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 : 0;
  const ordersChange = yesterdayOrders.length > 0 ? ((todayOrders.length - yesterdayOrders.length) / yesterdayOrders.length) * 100 : 0;

  const platformStats: Record<string, { count: number; revenue: number }> = {};
  orders.forEach((o) => {
    if (!platformStats[o.platform]) platformStats[o.platform] = { count: 0, revenue: 0 };
    platformStats[o.platform].count++;
    platformStats[o.platform].revenue += o.total || 0;
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

  const hourlyOrders: Record<number, number> = {};
  orders.forEach((o) => {
    const h = new Date(o.ordered_at).getHours();
    hourlyOrders[h] = (hourlyOrders[h] || 0) + 1;
  });
  const maxHourly = Math.max(...Object.values(hourlyOrders), 1);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: "Receita Hoje", value: `€${todayRevenue.toFixed(2)}`, change: revenueChange },
            { label: "Pedidos Hoje", value: todayOrders.length.toString(), change: ordersChange },
            { label: "Ticket Médio", value: `€${avgTicket.toFixed(2)}`, change: null },
            { label: "Total Receita", value: `€${totalRevenue.toFixed(2)}`, change: null },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-xs text-gray-500">{kpi.label}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{kpi.value}</p>
              {kpi.change !== null && (
                <div className="mt-1 flex items-center gap-1">
                  {kpi.change >= 0 ? (
                    <span className="text-xs font-medium text-green-600">↑ {kpi.change.toFixed(0)}%</span>
                  ) : (
                    <span className="text-xs font-medium text-red-500">↓ {Math.abs(kpi.change).toFixed(0)}%</span>
                  )}
                  <span className="text-[10px] text-gray-400">vs ontem</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Platform breakdown */}
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Por Plataforma</h3>
          <div className="space-y-3">
            {Object.entries(platformStats).map(([platform, stats]) => {
              const pct = totalRevenue > 0 ? (stats.revenue / totalRevenue) * 100 : 0;
              return (
                <div key={platform}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">
                      {platformNames[platform] || platform}
                    </span>
                    <span className="text-gray-500">
                      €{stats.revenue.toFixed(2)} · {stats.count} pedidos
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: platformColors[platform] || "#9CA3AF",
                      }}
                    />
                  </div>
                </div>
              );
            })}
            {Object.keys(platformStats).length === 0 && (
              <p className="text-sm text-gray-400">Sem dados de pedidos ainda.</p>
            )}
          </div>
        </div>

        {/* Hourly chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Pedidos por Hora</h3>
          <div className="flex items-end gap-1" style={{ height: 100 }}>
            {Array.from({ length: 15 }, (_, i) => i + 9).map((hour) => {
              const count = hourlyOrders[hour] || 0;
              const height = (count / maxHourly) * 100;
              return (
                <div key={hour} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-[#2CDF0C]/30 transition-all"
                    style={{ height: `${Math.max(height, 2)}%` }}
                  />
                  <span className="text-[9px] text-gray-400">{hour}h</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
