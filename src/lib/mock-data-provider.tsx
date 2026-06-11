"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import {
  MOCK_RESTAURANT,
  MOCK_MENU_ITEMS,
  MOCK_ORDERS,
  MOCK_REVIEWS,
  MOCK_PROMOTIONS,
  MOCK_ALERTS,
  MOCK_AUTOPILOT_RULES,
} from "@/lib/mock-data";
import { useAuth } from "@/lib/auth/mock-auth";

interface DataContextValue {
  restaurant: typeof MOCK_RESTAURANT | null;
  menuItems: typeof MOCK_MENU_ITEMS;
  orders: typeof MOCK_ORDERS;
  reviews: typeof MOCK_REVIEWS;
  promotions: typeof MOCK_PROMOTIONS;
  alerts: typeof MOCK_ALERTS;
  autopilotRules: typeof MOCK_AUTOPILOT_RULES;
  chatMessages: Array<{ role: string; content: string }>;
  addChatMessage: (msg: { role: string; content: string }) => void;
  clearChat: () => void;
  addMenuItem: (item: any) => void;
  updateMenuItem: (id: string, updates: any) => void;
  deleteMenuItem: (id: string) => void;
  addPromotion: (promo: any) => void;
  updatePromotion: (id: string, updates: any) => void;
  deletePromotion: (id: string) => void;
  addReview: (review: any) => void;
  respondToReview: (id: string, response: string) => void;
  markAlertAsRead: (id: string) => void;
  addAlert: (alert: any) => void;
  addAutopilotRule: (rule: any) => void;
  toggleAutopilotRule: (id: string) => void;
  deleteAutopilotRule: (id: string) => void;
  updateRestaurant: (updates: any) => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(MOCK_RESTAURANT);
  const [menuItems, setMenuItems] = useState(MOCK_MENU_ITEMS);
  const [orders] = useState(MOCK_ORDERS);
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [promotions, setPromotions] = useState(MOCK_PROMOTIONS);
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [autopilotRules, setAutopilotRules] = useState(MOCK_AUTOPILOT_RULES);
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([
    {
      role: "assistant",
      content: "Olá! Sou o Kivo, o teu agente AI de delivery. Pergunta-me sobre vendas, preços, promoções, avaliações ou qualquer coisa relacionada com o teu restaurante. Como posso ajudar?",
    },
  ]);

  // Update restaurant when user changes
  const updateRestaurant = (updates: any) => {
    setRestaurant((prev) => ({ ...prev, ...updates }));
  };

  const addChatMessage = (msg: { role: string; content: string }) => {
    setChatMessages((prev) => [...prev, msg]);
  };

  const clearChat = () => {
    setChatMessages([
      {
        role: "assistant",
        content: "Olá! Sou o Kivo, o teu agente AI de delivery. Pergunta-me sobre vendas, preços, promoções, avaliações ou qualquer coisa relacionada com o teu restaurante. Como posso ajudar?",
      },
    ]);
  };

  const addMenuItem = (item: any) => {
    setMenuItems((prev) => [...prev, { ...item, id: "mi-" + Date.now() }]);
  };

  const updateMenuItem = (id: string, updates: any) => {
    setMenuItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((i) => i.id !== id));
  };

  const addPromotion = (promo: any) => {
    setPromotions((prev) => [{ ...promo, id: "promo-" + Date.now(), status: "active" }, ...prev]);
  };

  const updatePromotion = (id: string, updates: any) => {
    setPromotions((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePromotion = (id: string) => {
    setPromotions((prev) => prev.filter((p) => p.id !== id));
  };

  const addReview = (review: any) => {
    setReviews((prev) => [{ ...review, id: "rev-" + Date.now() }, ...prev]);
  };

  const respondToReview = (id: string, response: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, responded: true, response_text: response } : r))
    );
  };

  const markAlertAsRead = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  const addAlert = (alert: any) => {
    setAlerts((prev) => [{ ...alert, id: "alert-" + Date.now(), read: false }, ...prev]);
  };

  const addAutopilotRule = (rule: any) => {
    setAutopilotRules((prev) => [...prev, { ...rule, id: "rule-" + Date.now(), status: "active" }]);
  };

  const toggleAutopilotRule = (id: string) => {
    setAutopilotRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: r.status === "active" ? "paused" : "active" } : r))
    );
  };

  const deleteAutopilotRule = (id: string) => {
    setAutopilotRules((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        restaurant,
        menuItems,
        orders,
        reviews,
        promotions,
        alerts,
        autopilotRules,
        chatMessages,
        addChatMessage,
        clearChat,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        addPromotion,
        updatePromotion,
        deletePromotion,
        addReview,
        respondToReview,
        markAlertAsRead,
        addAlert,
        addAutopilotRule,
        toggleAutopilotRule,
        deleteAutopilotRule,
        updateRestaurant,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
