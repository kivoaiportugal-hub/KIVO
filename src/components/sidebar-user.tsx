"use client";

import { useAuth } from "@/lib/auth/mock-auth";
import { useData } from "@/lib/mock-data-provider";

export function SidebarUser() {
  const { user } = useAuth();
  const { restaurant } = useData();

  const name = user?.full_name || user?.email?.split("@")[0] || "Utilizador";
  const restaurantName = restaurant?.name || name;
  const plan = restaurant?.onboarding_plan || "grow";

  return (
    <div className="flex items-center gap-3 rounded-md px-3 py-2 text-sm">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2CDF0C] text-xs font-bold text-white">
        {name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 truncate">
        <div className="font-medium truncate">{restaurantName}</div>
        <div className="text-xs text-gray-500 capitalize">
          Plano: {plan}
        </div>
      </div>
    </div>
  );
}
