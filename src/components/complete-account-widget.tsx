"use client";

import { useEffect, useState } from "react";
import { useRestaurant, useUser, useMenuItems, useReviews, usePromotions } from "@/hooks/use-data";
import { createClient } from "@/lib/supabase/client";

interface Step {
  id: string;
  label: string;
  completed: boolean;
}

export function CompleteAccountWidget() {
  const { user } = useUser();
  const { restaurant } = useRestaurant();
  const { items } = useMenuItems(restaurant?.id);
  const { reviews } = useReviews(restaurant?.id);
  const [expanded, setExpanded] = useState(true);
  const [steps, setSteps] = useState<Step[]>([]);

  useEffect(() => {
    if (!restaurant || !user) return;

    const platforms = restaurant.platforms || [];
    const hasPlatforms = platforms.length > 0;
    const hasMenu = items.length > 0;
    const hasReviews = reviews.length > 0;

    setSteps([
      { id: "account", label: "Criar conta", completed: true },
      { id: "plan", label: "Escolher plano", completed: !!restaurant?.onboarding_plan },
      { id: "onboarding", label: "Completar onboarding", completed: restaurant.onboarding_completed },
      { id: "platforms", label: "Conectar plataformas", completed: hasPlatforms },
      { id: "menu", label: "Importar menu", completed: hasMenu },
      { id: "reviews", label: "Importar reviews", completed: hasReviews },
      { id: "whatsapp", label: "1ª msg WhatsApp", completed: false },
    ]);
  }, [restaurant, user, items, reviews]);

  const completedCount = steps.filter((s) => s.completed).length;
  const totalCount = steps.length;
  const pct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (totalCount === 0 || pct === 100) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 w-72 rounded-2xl border border-gray-200 bg-white shadow-xl">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-4"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">📋</span>
          <span className="text-sm font-semibold text-gray-900">Complete a sua conta</span>
        </div>
        <span className="text-xs text-gray-400">{expanded ? "▼" : "▲"}</span>
      </button>

      {expanded && (
        <div className="px-4 pb-4">
          <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-[#2CDF0C] transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="space-y-1.5">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-2">
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                    step.completed
                      ? "bg-[#2CDF0C] text-white"
                      : "border border-gray-300 text-gray-300"
                  }`}
                >
                  {step.completed ? "✓" : ""}
                </span>
                <span
                  className={`text-xs ${
                    step.completed ? "text-gray-400 line-through" : "text-gray-700"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-3 text-center text-[11px] text-gray-400">
            {completedCount}/{totalCount} completos
          </p>
        </div>
      )}
    </div>
  );
}
