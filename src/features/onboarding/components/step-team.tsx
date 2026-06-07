"use client";

import type { OnboardingData } from "../lib/types";
import { TEAM_SIZES } from "../lib/types";

interface StepTeamProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
}

export function StepTeam({ data, onUpdate }: StepTeamProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-medium">Tamanho da equipa</label>
        <div className="grid gap-2">
          {TEAM_SIZES.map((size) => (
            <button
              key={size.id}
              type="button"
              onClick={() => onUpdate({ teamSize: size.id })}
              className={`rounded-md border px-4 py-3 text-left text-sm transition-colors ${
                data.teamSize === size.id
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-border hover:bg-accent"
              }`}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">
          Alguém gere especificamente o delivery?
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onUpdate({ hasDeliveryManager: true })}
            className={`rounded-md border px-4 py-3 text-center text-sm transition-colors ${
              data.hasDeliveryManager
                ? "border-primary bg-primary/10 text-primary font-medium"
                : "border-border hover:bg-accent"
            }`}
          >
            Sim
          </button>
          <button
            type="button"
            onClick={() => onUpdate({ hasDeliveryManager: false })}
            className={`rounded-md border px-4 py-3 text-center text-sm transition-colors ${
              !data.hasDeliveryManager
                ? "border-primary bg-primary/10 text-primary font-medium"
                : "border-border hover:bg-accent"
            }`}
          >
            Não
          </button>
        </div>
      </div>
    </div>
  );
}
