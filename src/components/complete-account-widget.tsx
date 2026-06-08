"use client";

import { useEffect, useState } from "react";
import { useRestaurant, useUser, useMenuItems, useReviews } from "@/hooks/use-data";
import { useSubscription } from "@/features/billing/subscription-provider";
import Link from "next/link";

interface Step {
  id: string;
  label: string;
  completed: boolean;
  href?: string;
}

export function CompleteAccountWidget() {
  const { user } = useUser();
  const { restaurant } = useRestaurant();
  const { items } = useMenuItems(restaurant?.id);
  const { reviews } = useReviews(restaurant?.id);
  const { plan, isActive, isTrialing } = useSubscription();
  const [expanded, setExpanded] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  const steps: Step[] = [
    { id: "account", label: "Criar conta", completed: true },
    { id: "plan", label: "Escolher plano", completed: isActive || isTrialing },
    { id: "onboarding", label: "Completar onboarding", completed: restaurant?.onboarding_completed || false },
    { id: "platforms", label: "Conectar plataformas", completed: (restaurant?.platforms?.length || 0) > 0, href: "/dashboard/settings" },
    { id: "menu", label: "Importar menu", completed: items.length > 0, href: "/dashboard/assistant" },
    { id: "reviews", label: "Importar reviews", completed: reviews.length > 0, href: "/dashboard/reviews" },
  ];

  const completedCount = steps.filter((s) => s.completed).length;
  const pct = Math.round((completedCount / steps.length) * 100);

  if (dismissed || steps.length === 0 || pct === 100) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 w-72 rounded-2xl border border-gray-200 bg-white shadow-xl">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-4"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2CDF0C]/10">
            <span className="text-sm font-bold text-[#187906]">{pct}%</span>
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-900">Complete a conta</span>
            <p className="text-[10px] text-gray-400">{completedCount}/{steps.length} passos</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
            className="rounded p-1 text-gray-300 hover:text-gray-500"
          >
            ✕
          </button>
          <span className="text-xs text-gray-400">{expanded ? "▼" : "▲"}</span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4">
          <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-[#2CDF0C] transition-all duration-500"
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
                {step.href && !step.completed ? (
                  <Link
                    href={step.href}
                    className="text-xs text-gray-700 hover:text-[#187906]"
                  >
                    {step.label}
                  </Link>
                ) : (
                  <span
                    className={`text-xs ${
                      step.completed ? "text-gray-400 line-through" : "text-gray-700"
                    }`}
                  >
                    {step.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
