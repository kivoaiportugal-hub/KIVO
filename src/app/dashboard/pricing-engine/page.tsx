"use client";

import { useState } from "react";

const pricingSuggestions = [
  {
    item: "Classic Burger",
    currentPrice: 12.00,
    suggestedPrice: 12.90,
    impact: "+€180/mês",
    confidence: 92,
    reason: "Demanda alta, margem abaixo da média do mercado",
  },
  {
    item: "Caesar Salad",
    currentPrice: 11.00,
    suggestedPrice: 11.50,
    impact: "+€65/mês",
    confidence: 88,
    reason: "Ticket médio da categoria permite aumento",
  },
  {
    item: "Onion Rings",
    currentPrice: 3.00,
    suggestedPrice: 3.50,
    impact: "+€60/mês",
    confidence: 85,
    reason: "Item acessório com alta margem — poucos clientes notam",
  },
];

const competitors = [
  { name: "Burger House (Glovo)", avgPrice: 13.50, items: 45 },
  { name: "Urban Burger (Uber Eats)", avgPrice: 14.20, items: 38 },
  { name: "Food Corner (Bolt Food)", avgPrice: 11.80, items: 52 },
];

export default function PricingEnginePage() {
  const [simItem, setSimItem] = useState("Classic Burger");
  const [simIncrease, setSimIncrease] = useState(10);

  const simulatedRevenue = 1872 * (1 + simIncrease / 100);
  const simulatedOrders = Math.round(156 * (1 - simIncrease / 200));
  const impact = simulatedRevenue - 1872;

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
        {pricingSuggestions.map((s) => (
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
                  <span className="text-muted-foreground">€{s.currentPrice.toFixed(2)}</span>
                  <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <span className="font-bold text-primary">€{s.suggestedPrice.toFixed(2)}</span>
                </div>
                <div className="mt-1 text-sm font-medium text-green-600">{s.impact}</div>
                <div className="mt-1 text-xs text-muted-foreground">Confiança: {s.confidence}%</div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground hover:bg-primary/90">
                Aplicar
              </button>
              <button className="inline-flex h-8 items-center justify-center rounded-md border px-4 text-xs font-medium hover:bg-accent">
                Ver Análise
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Price Simulator */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="text-sm font-semibold mb-4">Simulador de Impacto</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Item</label>
              <select
                value={simItem}
                onChange={(e) => setSimItem(e.target.value)}
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                <option>Classic Burger</option>
                <option>Chicken Burger</option>
                <option>Margherita Pizza</option>
                <option>Caesar Salad</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Aumento: {simIncrease}%</label>
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
            <div className="text-sm text-muted-foreground">Impacto Estimado</div>
            <div className={`text-2xl font-bold ${impact >= 0 ? "text-green-600" : "text-red-600"}`}>
              {impact >= 0 ? "+" : ""}€{impact.toFixed(0)}/mês
            </div>
            <div className="text-xs text-muted-foreground">
              Receita: €{simulatedRevenue.toFixed(0)} | Pedidos: ~{simulatedOrders}
            </div>
          </div>
        </div>
      </div>

      {/* Competitor Reference */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="text-sm font-semibold mb-4">Referência de Concorrentes</h3>
        <div className="space-y-3">
          {competitors.map((c) => (
            <div key={c.name} className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
              <div>
                <div className="text-sm font-medium">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.items} itens no menu</div>
              </div>
              <div className="text-sm font-bold">€{c.avgPrice.toFixed(2)} média</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
