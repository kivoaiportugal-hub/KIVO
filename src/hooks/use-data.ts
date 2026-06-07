"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export interface Restaurant {
  id: string;
  user_id: string;
  name: string;
  cuisine_type: string;
  city: string;
  platforms: string[];
  daily_orders: string;
  monthly_revenue: number;
  avg_ticket: number;
  team_size: string;
  has_delivery_manager: boolean;
  challenges: string[];
  onboarding_score: number;
  onboarding_plan: string;
  onboarding_completed: boolean;
  created_at: string;
}

export function useRestaurant() {
  const supabase = createClient();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRestaurant = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("restaurants")
      .select("*")
      .eq("user_id", user.id)
      .single();

    setRestaurant(data as Restaurant | null);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRestaurant();
  }, [fetchRestaurant]);

  return { restaurant, loading, refresh: fetchRestaurant };
}

export function useUser() {
  const supabase = createClient();
  const [user, setUser] = useState<{
    id: string;
    email: string;
    full_name: string;
    restaurant_name: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (authUser) {
        setUser({
          id: authUser.id,
          email: authUser.email || "",
          full_name: authUser.user_metadata?.full_name || "",
          restaurant_name: authUser.user_metadata?.restaurant_name || "",
        });
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  return { user, loading };
}

export function useMenuItems(restaurantId: string | undefined) {
  const supabase = createClient();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("menu_items")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("orders_count", { ascending: false });

    setItems(data || []);
    setLoading(false);
  }, [restaurantId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = async (item: { name: string; category: string; price: number; cost: number }) => {
    if (!restaurantId) return;
    await supabase.from("menu_items").insert({ ...item, restaurant_id: restaurantId });
    fetchItems();
  };

  const updateItem = async (id: string, updates: Partial<any>) => {
    await supabase.from("menu_items").update(updates).eq("id", id);
    fetchItems();
  };

  const deleteItem = async (id: string) => {
    await supabase.from("menu_items").delete().eq("id", id);
    fetchItems();
  };

  return { items, loading, addItem, updateItem, deleteItem, refresh: fetchItems };
}

export function useReviews(restaurantId: string | undefined) {
  const supabase = createClient();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("reviewed_at", { ascending: false });

    setReviews(data || []);
    setLoading(false);
  }, [restaurantId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const addReview = async (review: { platform: string; rating: number; text: string; sentiment: string }) => {
    if (!restaurantId) return;
    await supabase.from("reviews").insert({ ...review, restaurant_id: restaurantId });
    fetchReviews();
  };

  const respondToReview = async (id: string, responseText: string) => {
    await supabase.from("reviews").update({ responded: true, response_text: responseText }).eq("id", id);
    fetchReviews();
  };

  return { reviews, loading, addReview, respondToReview, refresh: fetchReviews };
}

export function usePromotions(restaurantId: string | undefined) {
  const supabase = createClient();
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPromotions = useCallback(async () => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("promotions")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false });

    setPromotions(data || []);
    setLoading(false);
  }, [restaurantId]);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const addPromotion = async (promo: { name: string; platform: string; discount_type: string; discount_value: number }) => {
    if (!restaurantId) return;
    await supabase.from("promotions").insert({ ...promo, restaurant_id: restaurantId, status: "active" });
    fetchPromotions();
  };

  const updatePromotion = async (id: string, updates: Partial<any>) => {
    await supabase.from("promotions").update(updates).eq("id", id);
    fetchPromotions();
  };

  const deletePromotion = async (id: string) => {
    await supabase.from("promotions").delete().eq("id", id);
    fetchPromotions();
  };

  return { promotions, loading, addPromotion, updatePromotion, deletePromotion, refresh: fetchPromotions };
}

export function useAlerts(restaurantId: string | undefined) {
  const supabase = createClient();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = useCallback(async () => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("alerts")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false });

    setAlerts(data || []);
    setLoading(false);
  }, [restaurantId]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const markAsRead = async (id: string) => {
    await supabase.from("alerts").update({ read: true }).eq("id", id);
    fetchAlerts();
  };

  return { alerts, loading, markAsRead, refresh: fetchAlerts };
}

export function useOrders(restaurantId: string | undefined) {
  const supabase = createClient();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("ordered_at", { ascending: false })
      .limit(100);

    setOrders(data || []);
    setLoading(false);
  }, [restaurantId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, refresh: fetchOrders };
}
