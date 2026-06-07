"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PlanId } from "@/lib/constants";

interface Subscription {
  id: string;
  user_id: string;
  plan_id: PlanId;
  status: string;
  interval: string;
  current_period_start: string;
  current_period_end: string;
  trial_end: string | null;
  stripe_customer_id: string;
  stripe_subscription_id: string | null;
}

interface SubscriptionContextValue {
  subscription: Subscription | null;
  plan: PlanId;
  isActive: boolean;
  isTrialing: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextValue>({
  subscription: null,
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
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    setSubscription(data as Subscription | null);
    setLoading(false);
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const plan = subscription?.plan_id || "start";
  const isActive = subscription?.status === "active";
  const isTrialing = subscription?.status === "trialing";

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        plan,
        isActive,
        isTrialing,
        loading,
        refresh: fetchSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}
