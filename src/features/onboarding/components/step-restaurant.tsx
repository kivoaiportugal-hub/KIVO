"use client";

import type { OnboardingData } from "../lib/types";
import { CUISINE_TYPES, CITIES } from "../lib/types";

interface StepRestaurantProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
}

export function StepRestaurant({ data, onUpdate }: StepRestaurantProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="restaurantName">
          Nome do restaurante
        </label>
        <input
          id="restaurantName"
          type="text"
          value={data.restaurantName}
          onChange={(e) => onUpdate({ restaurantName: e.target.value })}
          placeholder="Ex: O Meu Restaurante"
          className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Tipo de cozinha</label>
        <div className="grid grid-cols-2 gap-2">
          {CUISINE_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onUpdate({ cuisineType: type })}
              className={`rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                data.cuisineType === type
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-border hover:bg-accent"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Cidade</label>
        <div className="grid grid-cols-3 gap-2">
          {CITIES.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => onUpdate({ city })}
              className={`rounded-md border px-3 py-2 text-center text-sm transition-colors ${
                data.city === city
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-border hover:bg-accent"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
