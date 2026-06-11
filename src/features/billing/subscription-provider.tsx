"use client";

import { createContext, useContext, useState } from "react";
import { useData } from "@/lib/mock-data-provider";
import type { PlanId } from "@/lib/constants";

interface SubscriptionContextValue {
  plan: PlanId;
  isActive: boolean;
  isTrialing: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextValue>({
  plan: "grow",
  isActive: true,
  isTrialing: false,
  loading: false,
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
  const { restaurant } = useData();
  const plan = (restaurant?.onboarding_plan || "grow") as PlanId;

  return (
    <SubscriptionContext.Provider
      value={{ plan, isActive: true, isTrialing: false, loading: false, refresh: async () => {} }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}
