"use client";

import { KPICard } from "@/features/home/components/kpi-card";
import { AIInsight } from "@/features/home/components/ai-insight";
import { NextBestAction } from "@/features/home/components/next-best-action";
import { AlertsList } from "@/features/home/components/alerts-list";
import { useSubscription } from "@/features/billing/subscription-provider";

export default function DashboardHomePage() {
  const { plan } = useSubscription();

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Business Control Center
          </h1>
          <p className="text-sm text-muted-foreground">
            Visão geral do teu restaurante em tempo real.
          </p>
        </div>
        <div className="text-xs text-muted-foreground">
          Plano: <span className="font-medium capitalize">{plan}</span>
        </div>
      </div>

      {/* Top Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Receita Hoje" value="€1,245" change={12} icon="💰" />
        <KPICard label="Margem Estimada" value="34.2%" change={-2.1} icon="📊" />
        <KPICard label="Pedidos" value="89" change={8} icon="📦" />
        <KPICard label="Ticket Médio" value="€14.01" change={3.5} icon="🎫" />
      </div>

      {/* AI Insight */}
      <AIInsight
        message="As vendas caíram 8% esta semana devido à quebra de performance entre 19h–21h na Glovo. O principal fator é menor destaque do menu burger."
      />

      {/* Next Best Action */}
      <NextBestAction
        title="Next Best Action"
        description="Ativar promoção de 10% no menu burger (19h–21h)."
        impact="+€120/semana"
        onApply={() => {}}
        onViewImpact={() => {}}
        onDismiss={() => {}}
      />

      {/* Alerts */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Alertas</h3>
        <AlertsList
          alerts={[
            {
              id: "1",
              type: "error",
              message: "Chicken Burger perdeu 25% vendas",
              action: { label: "Ver", onClick: () => {} },
            },
            {
              id: "2",
              type: "warning",
              message: "Avaliações negativas aumentaram 15%",
              action: { label: "Ver", onClick: () => {} },
            },
            {
              id: "3",
              type: "success",
              message: "Bolt Food +20% esta semana",
              action: { label: "Ver", onClick: () => {} },
            },
          ]}
        />
      </div>
    </div>
  );
}
