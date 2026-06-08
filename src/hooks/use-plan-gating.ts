"use client";

import { useSubscription } from "@/features/billing/subscription-provider";
import { PLANS, type PlanId } from "@/lib/constants";

export function usePlanGating() {
  const { plan, isActive, isTrialing } = useSubscription();

  const hasAccess = (feature: string): boolean => {
    // Trial gives full access
    if (isTrialing) return true;

    // Active subscription required
    if (!isActive && plan === "start") return true; // Start is free tier

    const planFeatures: Record<PlanId, string[]> = {
      start: [
        "whatsapp",
        "chat",
        "analytics",
        "insights",
        "alerts",
        "forecasts",
      ],
      grow: [
        "whatsapp",
        "chat",
        "analytics",
        "insights",
        "alerts",
        "forecasts",
        "menu_intelligence",
        "pricing_engine",
        "promotions",
        "reviews",
        "import_data",
        "euro_impact",
      ],
      autopilot: [
        "whatsapp",
        "chat",
        "analytics",
        "insights",
        "alerts",
        "forecasts",
        "menu_intelligence",
        "pricing_engine",
        "promotions",
        "reviews",
        "import_data",
        "euro_impact",
        "auto_actions",
        "auto_pricing",
        "auto_promotions",
        "auto_reviews",
        "custom_rules",
        "action_log",
      ],
    };

    return planFeatures[plan]?.includes(feature) ?? false;
  };

  const getLimit = (limit: string): number => {
    const planLimits: Record<PlanId, Record<string, number>> = {
      start: {
        max_platforms: 3,
        max_menu_items: 100,
        data_retention_days: 90,
        ai_queries_per_day: 50,
      },
      grow: {
        max_platforms: 5,
        max_menu_items: 500,
        data_retention_days: 365,
        ai_queries_per_day: 200,
      },
      autopilot: {
        max_platforms: 10,
        max_menu_items: -1, // unlimited
        data_retention_days: -1, // unlimited
        ai_queries_per_day: -1, // unlimited
      },
    };

    return planLimits[plan]?.[limit] ?? 0;
  };

  const isUnlimited = (limit: string): boolean => {
    return getLimit(limit) === -1;
  };

  const getUpgradeMessage = (feature: string): string => {
    if (feature.startsWith("auto_") || feature === "custom_rules" || feature === "action_log") {
      return "Faz upgrade para o plano Autopilot para aceder a esta funcionalidade.";
    }
    if (["menu_intelligence", "pricing_engine", "promotions", "reviews", "import_data"].includes(feature)) {
      return "Faz upgrade para o plano Grow para aceder a esta funcionalidade.";
    }
    return "Esta funcionalidade não está disponível no teu plano atual.";
  };

  return { plan, isActive, isTrialing, hasAccess, getLimit, isUnlimited, getUpgradeMessage };
}
