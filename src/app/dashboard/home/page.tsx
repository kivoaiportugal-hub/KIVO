"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { KPICard } from "@/features/home/components/kpi-card";
import { AIInsight } from "@/features/home/components/ai-insight";
import { NextBestAction } from "@/features/home/components/next-best-action";
import { AlertsList } from "@/features/home/components/alerts-list";

interface Restaurant {
  name: string;
  cuisine_type: string;
  city: string;
  platforms: string[];
  onboarding_score: number;
  onboarding_plan: string;
}

export default function DashboardHomePage() {
  const supabase = createClient();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [userName, setUserName] = useState("");
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

        const { data } = await supabase
          .from("restaurants")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (data) {
          setRestaurant(data);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

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
        <KPICard label="Receita Hoje" value="€0" icon="💰" />
        <KPICard label="Margem Estimada" value="0%" icon="📊" />
        <KPICard label="Pedidos" value="0" icon="📦" />
        <KPICard label="Ticket Médio" value="€0" icon="🎫" />
      </div>

      {/* Restaurant Info (from onboarding) */}
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
            <div>
              <span className="text-muted-foreground">Maturidade:</span>{" "}
              <span className="font-medium">{restaurant.onboarding_score}/100</span>
            </div>
          </div>
        </div>
      )}

      {/* AI Insight */}
      <AIInsight
        message="Liga as tuas plataformas de delivery para receber insights personalizados sobre o teu restaurante."
      />

      {/* Next Best Action */}
      <NextBestAction
        title="Próximo Passo"
        description="Connecta o Uber Eats, Glovo ou Bolt Food para começar a receber dados em tempo real."
        impact="Dados automáticos"
        onApply={() => {
          window.location.href = "/dashboard/integrations";
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
