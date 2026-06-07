"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PlanId } from "@/lib/constants";

interface SubscriptionContextValue {
  plan: PlanId;
  isActive: boolean;
  isTrialing: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextValue>({
  plan: "start",
  isActive: false,
  isTrialing: false,
  loading: true,
  refresh: async () => {},
});

export function useSubscription() {
  return useContext(SubscriptionContext);
}

export function SubscriptionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const [plan, setPlan] = useState<PlanId>("start");
  const [isActive, setIsActive] = useState(false);
  const [isTrialing, setIsTrialing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // Get plan from user metadata first (fast)
      const planFromMeta = user.user_metadata?.onboarding_plan as PlanId;
      if (planFromMeta && planFromMeta in ["start", "grow", "autopilot"]) {
        setPlan(planFromMeta);
      }

      // Try to get from subscriptions table (may not exist yet)
      const { data, error } = await supabase
        .from("subscriptions")
        .select("plan_id, status")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        setPlan(data.plan_id as PlanId);
        setIsActive(data.status === "active");
        setIsTrialing(data.status === "trialing");
      }
    } catch {
      // Subscriptions table might not exist yet — use metadata fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{ plan, isActive, isTrialing, loading, refresh: fetchSubscription }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}
