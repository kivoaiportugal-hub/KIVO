"use client";

import { useEffect, useState } from "react";
import { useData } from "@/lib/mock-data-provider";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from "recharts";

export default function PerformancePage() {
  const { orders } = useData();
  const [period, setPeriod] = useState<"week" | "month" | "all">("week");

  const now = new Date();
  const filtered = orders.filter((o) => {
    const d = new Date(o.ordered_at);
    if (period === "week") return now.getTime() - d.getTime() < 7 * 86400000;
    if (period === "month") return now.getTime() - d.getTime() < 30 * 86400000;
    return true;
  });

  const totalRevenue = filtered.reduce((s, o) => s + (o.total || 0), 0);
  const totalOrders = filtered.length;
  const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const today = new Date().toDateString();
  const todayOrders = filtered.filter((o) => new Date(o.ordered_at).toDateString() === today);
  const todayRevenue = todayOrders.reduce((s, o) => s + (o.total || 0), 0);

  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const yesterdayOrders = filtered.filter((o) => new Date(o.ordered_at).toDateString() === yesterday);
  const yesterdayRevenue = yesterdayOrders.reduce((s, o) => s + (o.total || 0), 0);

  const revenueChange = yesterdayRevenue > 0 ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 : 0;
  const ordersChange = yesterdayOrders.length > 0 ? ((todayOrders.length - yesterdayOrders.length) / yesterdayOrders.length) * 100 : 0;

  // Daily revenue data
  const dailyData: Record<string, number> = {};
  filtered.forEach((o) => {
    const date = o.ordered_at.split("T")[0];
    dailyData[date] = (dailyData[date] || 0) + (o.total || 0);
  });
  const dailyChartData = Object.entries(dailyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, revenue]) => ({
      date: new Date(date).toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit" }),
      revenue: Math.round(revenue * 100) / 100,
    }));

  // Platform pie data
  const platformStats: Record<string, { count: number; revenue: number }> = {};
  filtered.forEach((o) => {
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

  const pieData = Object.entries(platformStats).map(([platform, stats]) => ({
    name: platformNames[platform] || platform,
    value: Math.round(stats.revenue * 100) / 100,
    count: stats.count,
    color: platformColors[platform] || "#9CA3AF",
  }));

  // Hourly orders
  const hourlyOrders: Record<number, number> = {};
  filtered.forEach((o) => {
    const h = new Date(o.ordered_at).getHours();
    hourlyOrders[h] = (hourlyOrders[h] || 0) + 1;
  });
  const hourlyData = Array.from({ length: 15 }, (_, i) => i + 9).map((hour) => ({
    hour: `${hour}h`,
    orders: hourlyOrders[hour] || 0,
  }));

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">Performance</h1>
          <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1">
            {(["week", "month", "all"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  period === p
                    ? "bg-[#2CDF0C] text-white"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {p === "week" ? "7 dias" : p === "month" ? "30 dias" : "Tudo"}
              </button>
            ))}
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: "Receita Hoje", value: `€${todayRevenue.toFixed(2)}`, change: revenueChange },
            { label: "Pedidos Hoje", value: todayOrders.length.toString(), change: ordersChange },
            { label: "Ticket Médio", value: `€${avgTicket.toFixed(2)}`, change: null },
            { label: `Receita ${period === "week" ? "7d" : period === "month" ? "30d" : "Total"}`, value: `€${totalRevenue.toFixed(2)}`, change: null },
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

        {/* Revenue Line Chart */}
        {dailyChartData.length > 1 && (
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">Receita Diária</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={dailyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                <YAxis tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                <Tooltip
                  formatter={(value) => [`€${Number(value).toFixed(2)}`, "Receita"]}
                  contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#2CDF0C" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Two columns: Platform pie + Hourly bar */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Platform Pie */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">Por Plataforma</h3>
            {pieData.length > 0 ? (
              <div className="flex items-center gap-4">
                <ResponsiveContainer width={120} height={120}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      dataKey="value"
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`€${Number(value).toFixed(2)}`, "Receita"]}
                      contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {pieData.map((p) => (
                    <div key={p.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: p.color }} />
                        <span className="text-gray-600">{p.name}</span>
                      </div>
                      <span className="font-medium text-gray-900">€{p.value.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Sem dados.</p>
            )}
          </div>

          {/* Hourly Bar Chart */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">Pedidos por Hora</h3>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="hour" tick={{ fontSize: 9 }} stroke="#9CA3AF" />
                <YAxis tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />
                <Bar dataKey="orders" fill="#2CDF0C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
