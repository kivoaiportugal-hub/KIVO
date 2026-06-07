"use client";

import { KPICard } from "@/features/home/components/kpi-card";

const platformData = [
  { name: "Uber Eats", revenue: "€4,230", orders: 298, change: 12, color: "#06C167" },
  { name: "Glovo", revenue: "€3,120", orders: 234, change: -5, color: "#000000" },
  { name: "Bolt Food", revenue: "€1,890", orders: 156, change: 20, color: "#2DB5A0" },
];

const hourlyData = [
  { hour: "12h", orders: 12, revenue: 168 },
  { hour: "13h", orders: 18, revenue: 252 },
  { hour: "14h", orders: 8, revenue: 112 },
  { hour: "15h", orders: 5, revenue: 70 },
  { hour: "16h", orders: 6, revenue: 84 },
  { hour: "17h", orders: 10, revenue: 140 },
  { hour: "18h", orders: 22, revenue: 308 },
  { hour: "19h", orders: 28, revenue: 392 },
  { hour: "20h", orders: 25, revenue: 350 },
  { hour: "21h", orders: 15, revenue: 210 },
  { hour: "22h", orders: 8, revenue: 112 },
];

const maxOrders = Math.max(...hourlyData.map((d) => d.orders));

export default function PerformancePage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Performance</h1>
        <p className="text-sm text-muted-foreground">
          Análise detalhada do teu desempenho por plataforma e período.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <KPICard label="Receita Total" value="€9,240" change={8} icon="💰" />
        <KPICard label="Total Pedidos" value="688" change={11} icon="📦" />
        <KPICard label="Ticket Médio" value="€13.43" change={2.1} icon="🎫" />
      </div>

      {/* Platform Breakdown */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="text-sm font-semibold mb-4">Por Plataforma</h3>
        <div className="space-y-4">
          {platformData.map((p) => (
            <div key={p.name} className="flex items-center gap-4">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                style={{ backgroundColor: p.color }}
              >
                {p.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{p.name}</span>
                  <span className="text-sm font-bold">{p.revenue}</span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${(parseInt(p.revenue.replace(/[€,]/g, "")) / 4230) * 100}%`,
                      backgroundColor: p.color,
                    }}
                  />
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{p.orders} pedidos</span>
                  <span className={p.change >= 0 ? "text-green-600" : "text-red-600"}>
                    {p.change >= 0 ? "+" : ""}{p.change}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hourly Chart */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="text-sm font-semibold mb-4">Pedidos por Hora (Hoje)</h3>
        <div className="flex items-end gap-2 h-48">
          {hourlyData.map((d) => (
            <div key={d.hour} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-primary/80 transition-all"
                style={{ height: `${(d.orders / maxOrders) * 100}%` }}
              />
              <span className="text-[10px] text-muted-foreground">{d.hour}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
