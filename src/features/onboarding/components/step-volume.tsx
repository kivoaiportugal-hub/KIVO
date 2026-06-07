"use client";

import type { OnboardingData } from "../lib/types";
import { VOLUME_RANGES } from "../lib/types";

interface StepVolumeProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
}

export function StepVolume({ data, onUpdate }: StepVolumeProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-medium">Pedidos por dia (média)</label>
        <div className="grid gap-2">
          {VOLUME_RANGES.map((range) => (
            <button
              key={range.id}
              type="button"
              onClick={() => onUpdate({ dailyOrders: range.id })}
              className={`rounded-md border px-4 py-3 text-left text-sm transition-colors ${
                data.dailyOrders === range.id
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-border hover:bg-accent"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="monthlyRevenue">
          Faturação mensal (€) — estimativa
        </label>
        <input
          id="monthlyRevenue"
          type="number"
          value={data.monthlyRevenue}
          onChange={(e) => onUpdate({ monthlyRevenue: e.target.value })}
          placeholder="Ex: 15000"
          className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="avgTicket">
          Ticket médio por pedido (€) — estimativa
        </label>
        <input
          id="avgTicket"
          type="number"
          value={data.avgTicket}
          onChange={(e) => onUpdate({ avgTicket: e.target.value })}
          placeholder="Ex: 14.50"
          step="0.10"
          className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
    </div>
  );
}
