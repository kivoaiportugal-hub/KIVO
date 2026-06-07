"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRestaurant } from "@/hooks/use-data";
import { KPICard } from "@/features/home/components/kpi-card";
import { AIInsight } from "@/features/home/components/ai-insight";
import { NextBestAction } from "@/features/home/components/next-best-action";

export default function DashboardHomePage() {
  const supabase = createClient();
  const { restaurant } = useRestaurant();
  const [userName, setUserName] = useState("");
  const [todayStats, setTodayStats] = useState({
    revenue: 0,
    orders: 0,
    avgTicket: 0,
  });
  const [yesterdayStats, setYesterdayStats] = useState({
    revenue: 0,
    orders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserName(
          user.user_metadata?.full_name ||
            user.user_metadata?.restaurant_name ||
            user.email?.split("@")[0] ||
            "Utilizador"
        );
      }

      if (!restaurant?.id) {
        setLoading(false);
        return;
      }

      // Fetch today's orders
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString();

      const { data: todayOrders } = await supabase
        .from("orders")
        .select("total")
        .eq("restaurant_id", restaurant.id)
        .gte("ordered_at", todayStr);

      // Fetch yesterday's orders
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString();

      const { data: yesterdayOrders } = await supabase
        .from("orders")
        .select("total")
        .eq("restaurant_id", restaurant.id)
        .gte("ordered_at", yesterdayStr)
        .lt("ordered_at", todayStr);

      const tRevenue =
        todayOrders?.reduce((s, o) => s + (o.total || 0), 0) || 0;
      const tOrders = todayOrders?.length || 0;
      const tAvg = tOrders > 0 ? tRevenue / tOrders : 0;

      const yRevenue =
        yesterdayOrders?.reduce((s, o) => s + (o.total || 0), 0) || 0;
      const yOrders = yesterdayOrders?.length || 0;

      setTodayStats({ revenue: tRevenue, orders: tOrders, avgTicket: tAvg });
      setYesterdayStats({ revenue: yRevenue, orders: yOrders });
      setLoading(false);
    };

    fetchData();
  }, [restaurant?.id]);

  const revenueChange =
    yesterdayStats.revenue > 0
      ? Math.round(
          ((todayStats.revenue - yesterdayStats.revenue) /
            yesterdayStats.revenue) *
            100
        )
      : 0;

  const ordersChange =
    yesterdayStats.orders > 0
      ? Math.round(
          ((todayStats.orders - yesterdayStats.orders) /
            yesterdayStats.orders) *
            100
        )
      : 0;

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-muted" />
          <div className="h-4 w-96 rounded bg-muted" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 rounded-lg border bg-card p-4" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Business Control Center
          </h1>
          <p className="text-sm text-muted-foreground">
            {restaurant
              ? `Visão geral do ${restaurant.name}.`
              : `Bem-vindo, ${userName}.`}
          </p>
        </div>
        <div className="text-xs text-muted-foreground">
          {restaurant && (
            <>
              <span className="font-medium">{restaurant.name}</span>
              <span className="mx-1">·</span>
              <span className="capitalize">{restaurant.onboarding_plan}</span>
            </>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          label="Receita Hoje"
          value={`€${todayStats.revenue.toFixed(0)}`}
          change={revenueChange}
          icon="💰"
        />
        <KPICard
          label="Pedidos Hoje"
          value={String(todayStats.orders)}
          change={ordersChange}
          icon="📦"
        />
        <KPICard
          label="Ticket Médio"
          value={`€${todayStats.avgTicket.toFixed(2)}`}
          icon="🎫"
        />
        <KPICard
          label="Margem Média"
          value={
            restaurant
              ? `${restaurant.onboarding_score || 0}%`
              : "—"
          }
          icon="📊"
        />
      </div>

      {/* Restaurant Info */}
      {restaurant && (
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold mb-3">O Teu Restaurante</h3>
          <div className="grid gap-4 md:grid-cols-3 text-sm">
            <div>
              <span className="text-muted-foreground">Tipo:</span>{" "}
              <span className="font-medium">{restaurant.cuisine_type}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Cidade:</span>{" "}
              <span className="font-medium">{restaurant.city}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Plataformas:</span>{" "}
              <span className="font-medium">
                {restaurant.platforms?.join(", ") || "Nenhuma"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* AI Insight */}
      <AIInsight
        message={
          todayStats.orders === 0 && yesterdayStats.orders === 0
            ? "Liga as tuas plataformas de delivery para receber insights personalizados sobre o teu restaurante."
            : todayStats.revenue > yesterdayStats.revenue
              ? `Boas! A receita de hoje está ${revenueChange}% acima de ontem. Continua assim!`
              : `A receita de hoje está ${Math.abs(revenueChange)}% abaixo de ontem. Considera uma ação para aumentar pedidos.`
        }
      />

      {/* Next Best Action */}
      <NextBestAction
        title={
          restaurant?.platforms?.length === 0
            ? "Liga as tuas plataformas"
            : todayStats.orders === 0
              ? "Adiciona dados de pedidos"
              : "Melhora o teu menu"
        }
        description={
          restaurant?.platforms?.length === 0
            ? "Connecta o Uber Eats, Glovo ou Bolt Food para começar a receber dados em tempo real."
            : todayStats.orders === 0
              ? "Os dados de pedidos são essenciais para insights precisos. Verifica as integrações."
              : "Adiciona itens ao menu com custos precisos para receber sugestões de preço."
        }
        impact={
          restaurant?.platforms?.length === 0
            ? "Dados automáticos"
            : "Análise completa"
        }
        onApply={() => {
          window.location.href =
            restaurant?.platforms?.length === 0
              ? "/dashboard/integrations"
              : "/dashboard/menu";
        }}
        onDismiss={() => {}}
      />

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-3">
        <a
          href="/dashboard/assistant"
          className="rounded-lg border bg-card p-4 shadow-sm hover:border-primary/50 transition-colors"
        >
          <div className="text-2xl mb-2">🤖</div>
          <div className="font-medium text-sm">AI Assistant</div>
          <div className="text-xs text-muted-foreground">
            Fala com o Kivo sobre o teu negócio
          </div>
        </a>
        <a
          href="/dashboard/billing"
          className="rounded-lg border bg-card p-4 shadow-sm hover:border-primary/50 transition-colors"
        >
          <div className="text-2xl mb-2">💳</div>
          <div className="font-medium text-sm">Billing</div>
          <div className="text-xs text-muted-foreground">
            Gerir a tua subscrição
          </div>
        </a>
        <a
          href="/dashboard/integrations"
          className="rounded-lg border bg-card p-4 shadow-sm hover:border-primary/50 transition-colors"
        >
          <div className="text-2xl mb-2">🔗</div>
          <div className="font-medium text-sm">Integrações</div>
          <div className="text-xs text-muted-foreground">
            Liga as tuas plataformas
          </div>
        </a>
      </div>
    </div>
  );
}
