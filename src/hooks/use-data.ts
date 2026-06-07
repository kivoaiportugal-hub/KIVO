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
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data, error } = await supabase
        .from("restaurants").select("*").eq("user_id", user.id).single();
      if (!error && data) setRestaurant(data as Restaurant | null);
    } catch { /* table might not exist */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchRestaurant(); }, [fetchRestaurant]);
  return { restaurant, loading, refresh: fetchRestaurant };
}

export function useUser() {
  const supabase = createClient();
  const [user, setUser] = useState<{
    id: string; email: string; full_name: string; restaurant_name: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          setUser({
            id: authUser.id,
            email: authUser.email || "",
            full_name: authUser.user_metadata?.full_name || "",
            restaurant_name: authUser.user_metadata?.restaurant_name || "",
          });
        }
      } catch {} finally { setLoading(false); }
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
    if (!restaurantId) { setLoading(false); return; }
    try {
      const { data, error } = await supabase
        .from("menu_items").select("*").eq("restaurant_id", restaurantId)
        .order("orders_count", { ascending: false });
      if (!error) setItems(data || []);
    } catch {} finally { setLoading(false); }
  }, [restaurantId]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const addItem = async (item: { name: string; category: string; price: number; cost: number }) => {
    if (!restaurantId) return;
    try { await supabase.from("menu_items").insert({ ...item, restaurant_id: restaurantId }); fetchItems(); } catch {}
  };
  const updateItem = async (id: string, updates: Partial<any>) => {
    try { await supabase.from("menu_items").update(updates).eq("id", id); fetchItems(); } catch {}
  };
  const deleteItem = async (id: string) => {
    try { await supabase.from("menu_items").delete().eq("id", id); fetchItems(); } catch {}
  };

  return { items, loading, addItem, updateItem, deleteItem, refresh: fetchItems };
}

export function useReviews(restaurantId: string | undefined) {
  const supabase = createClient();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    if (!restaurantId) { setLoading(false); return; }
    try {
      const { data, error } = await supabase
        .from("reviews").select("*").eq("restaurant_id", restaurantId)
        .order("reviewed_at", { ascending: false });
      if (!error) setReviews(data || []);
    } catch {} finally { setLoading(false); }
  }, [restaurantId]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const addReview = async (review: { platform: string; rating: number; text: string; sentiment: string }) => {
    if (!restaurantId) return;
    try { await supabase.from("reviews").insert({ ...review, restaurant_id: restaurantId }); fetchReviews(); } catch {}
  };
  const respondToReview = async (id: string, responseText: string) => {
    try { await supabase.from("reviews").update({ responded: true, response_text: responseText }).eq("id", id); fetchReviews(); } catch {}
  };

  return { reviews, loading, addReview, respondToReview, refresh: fetchReviews };
}

export function usePromotions(restaurantId: string | undefined) {
  const supabase = createClient();
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPromotions = useCallback(async () => {
    if (!restaurantId) { setLoading(false); return; }
    try {
      const { data, error } = await supabase
        .from("promotions").select("*").eq("restaurant_id", restaurantId)
        .order("created_at", { ascending: false });
      if (!error) setPromotions(data || []);
    } catch {} finally { setLoading(false); }
  }, [restaurantId]);

  useEffect(() => { fetchPromotions(); }, [fetchPromotions]);

  const addPromotion = async (promo: { name: string; platform: string; discount_type: string; discount_value: number }) => {
    if (!restaurantId) return;
    try { await supabase.from("promotions").insert({ ...promo, restaurant_id: restaurantId, status: "active" }); fetchPromotions(); } catch {}
  };
  const updatePromotion = async (id: string, updates: Partial<any>) => {
    try { await supabase.from("promotions").update(updates).eq("id", id); fetchPromotions(); } catch {}
  };
  const deletePromotion = async (id: string) => {
    try { await supabase.from("promotions").delete().eq("id", id); fetchPromotions(); } catch {}
  };

  return { promotions, loading, addPromotion, updatePromotion, deletePromotion, refresh: fetchPromotions };
}

export function useAlerts(restaurantId: string | undefined) {
  const supabase = createClient();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = useCallback(async () => {
    if (!restaurantId) { setLoading(false); return; }
    try {
      const { data, error } = await supabase
        .from("alerts").select("*").eq("restaurant_id", restaurantId)
        .order("created_at", { ascending: false });
      if (!error) setAlerts(data || []);
    } catch {} finally { setLoading(false); }
  }, [restaurantId]);

  useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

  const markAsRead = async (id: string) => {
    try { await supabase.from("alerts").update({ read: true }).eq("id", id); fetchAlerts(); } catch {}
  };

  return { alerts, loading, markAsRead, refresh: fetchAlerts };
}

export function useOrders(restaurantId: string | undefined) {
  const supabase = createClient();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    if (!restaurantId) { setLoading(false); return; }
    try {
      const { data, error } = await supabase
        .from("orders").select("*").eq("restaurant_id", restaurantId)
        .order("ordered_at", { ascending: false }).limit(100);
      if (!error) setOrders(data || []);
    } catch {} finally { setLoading(false); }
  }, [restaurantId]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  return { orders, loading, refresh: fetchOrders };
}
