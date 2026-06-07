"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SidebarUser() {
  const supabase = createClient();
  const [name, setName] = useState("Utilizador");
  const [restaurantName, setRestaurantName] = useState("");
  const [plan, setPlan] = useState("start");

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setName(
          user.user_metadata?.full_name ||
            user.user_metadata?.restaurant_name ||
            user.email?.split("@")[0] ||
            "Utilizador"
        );
        setRestaurantName(user.user_metadata?.restaurant_name || "");
        setPlan(user.user_metadata?.onboarding_plan || "start");
      }
    };
    loadUser();
  }, []);

  return (
    <div className="flex items-center gap-3 rounded-md px-3 py-2 text-sm">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
        {name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 truncate">
        <div className="font-medium truncate">{restaurantName || name}</div>
        <div className="text-xs text-muted-foreground capitalize">
          Plano: {plan}
        </div>
      </div>
    </div>
  );
}
