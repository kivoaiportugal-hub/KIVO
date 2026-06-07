"use client";

import { useState } from "react";
import { useRestaurant, useMenuItems } from "@/hooks/use-data";

export default function PricingEnginePage() {
  const { restaurant } = useRestaurant();
  const { items } = useMenuItems(restaurant?.id);
  const [simIncrease, setSimIncrease] = useState(10);
  const [selectedItem, setSelectedItem] = useState<string>("");

  // Generate pricing suggestions from real menu items
  const suggestions = items
    .filter((item) => item.price > 0)
    .map((item) => {
      // Simple heuristic: if margin < 60%, suggest price increase
      const suggestedIncrease = item.margin_pct < 60 ? 0.50 : item.margin_pct < 70 ? 0.30 : 0.20;
      const suggestedPrice = item.price + suggestedIncrease;
      const potentialExtraRevenue = suggestedIncrease * (item.orders_count || 0);

      return {
        item: item.name,
        currentPrice: item.price,
        suggestedPrice: Math.round(suggestedPrice * 100) / 100,
        impact: `+€${Math.round(potentialExtraRevenue)}/mês`,
        confidence: item.margin_pct < 60 ? 92 : item.margin_pct < 70 ? 85 : 75,
        reason:
          item.margin_pct < 60
            ? "Margem abaixo da média — aumento justificável"
            : item.margin_pct < 70
              ? "Margem adequada — aumento cautiously"
              : "Margem boa — aumento pequeno possível",
        margin: item.margin_pct,
      };
    })
    .sort((a, b) => b.confidence - a.confidence);

  // Simulator calculations
  const simItem = items.find((i) => i.id === selectedItem) || items[0];
  const simulatedRevenue = simItem
    ? (simItem.revenue || 0) * (1 + simIncrease / 100)
    : 0;
  const simulatedOrders = simItem
    ? Math.round((simItem.orders_count || 0) * (1 - simIncrease / 200))
    : 0;
  const impact = simItem ? simulatedRevenue - (simItem.revenue || 0) : 0;

  // Competitor reference (placeholder — would come from external data)
  const competitors = [
    { name: "Média do mercado", avgPrice: 12.50, items: items.length },
  ];

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pricing Engine</h1>
        <p className="text-sm text-muted-foreground">
          Recomendações inteligentes de preço com impacto estimado em euros.
        </p>
      </div>

      {/* AI Suggestions */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Recomendações de Preço</h3>
        {suggestions.length === 0 ? (
          <div className="rounded-lg border bg-card p-6 text-center text-sm text-muted-foreground">
            Adiciona itens ao menu primeiro para receber sugestões de preço.
          </div>
        ) : (
          suggestions.slice(0, 5).map((s) => (
            <div key={s.item} className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{s.item}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {s.reason}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                      €{s.currentPrice.toFixed(2)}
                    </span>
                    <svg
                      className="h-4 w-4 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                    <span className="font-bold text-primary">
                      €{s.suggestedPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-1 text-sm font-medium text-green-600">
                    {s.impact}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Confiança: {s.confidence}%
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Price Simulator */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="text-sm font-semibold mb-4">Simulador de Impacto</h3>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Adiciona itens ao menu para usar o simulador.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Item</label>
                <select
                  value={selectedItem || items[0]?.id || ""}
                  onChange={(e) => setSelectedItem(e.target.value)}
                  className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} — €{item.price.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Aumento: {simIncrease}%
                </label>
                <input
                  type="range"
                  min={0}
                  max={30}
                  value={simIncrease}
                  onChange={(e) => setSimIncrease(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
            <div className="rounded-lg bg-muted/50 p-4 space-y-2">
              <div className="text-sm text-muted-foreground">
                Impacto Estimado
              </div>
              <div
                className={`text-2xl font-bold ${
                  impact >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {impact >= 0 ? "+" : ""}€{impact.toFixed(0)}/mês
              </div>
              <div className="text-xs text-muted-foreground">
                Receita: €{simulatedRevenue.toFixed(0)} | Pedidos: ~
                {simulatedOrders}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Menu Item Margins Overview */}
      {items.length > 0 && (
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold mb-4">
            Margens por Item
          </h3>
          <div className="space-y-2">
            {items
              .sort((a, b) => (a.margin_pct || 0) - (b.margin_pct || 0))
              .slice(0, 10)
              .map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <span className="w-40 text-sm truncate">{item.name}</span>
                  <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-3 rounded-full ${
                        (item.margin_pct || 0) >= 70
                          ? "bg-green-500"
                          : (item.margin_pct || 0) >= 60
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${Math.min(item.margin_pct || 0, 100)}%` }}
                    />
                  </div>
                  <span className="w-12 text-sm text-right font-medium">
                    {(item.margin_pct || 0).toFixed(0)}%
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
