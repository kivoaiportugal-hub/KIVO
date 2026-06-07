"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Integration {
  id: string;
  name: string;
  description: string;
  color: string;
  status: "connected" | "pending" | "disconnected";
  lastSync: string | null;
}

export default function IntegrationsPage() {
  const supabase = createClient();
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "uber_eats",
      name: "Uber Eats",
      description: "Sincroniza vendas, menu e avaliações do Uber Eats.",
      color: "#06C167",
      status: "disconnected",
      lastSync: null,
    },
    {
      id: "glovo",
      name: "Glovo",
      description: "Connect com Glovo para dados de vendas e performance.",
      color: "#000000",
      status: "disconnected",
      lastSync: null,
    },
    {
      id: "bolt_food",
      name: "Bolt Food",
      description: "Integra Bolt Food para análise de pedidos e margem.",
      color: "#2DB5A0",
      status: "disconnected",
      lastSync: null,
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      description: "Recebe alertas e interage com o Kivo via WhatsApp.",
      color: "#25D366",
      status: "disconnected",
      lastSync: null,
    },
  ]);

  useEffect(() => {
    const loadIntegrations = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: restaurant } = await supabase
        .from("restaurants")
        .select("platforms")
        .eq("user_id", user.id)
        .single();

      if (restaurant?.platforms) {
        setIntegrations((prev) =>
          prev.map((intg) => ({
            ...intg,
            status: restaurant.platforms.includes(intg.id)
              ? ("connected" as const)
              : intg.status,
          }))
        );
      }
    };
    loadIntegrations();
  }, []);

  const handleConnect = async (integrationId: string) => {
    // Update restaurant platforms in Supabase
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("platforms")
      .eq("user_id", user.id)
      .single();

    const currentPlatforms = restaurant?.platforms || [];
    const newPlatforms = currentPlatforms.includes(integrationId)
      ? currentPlatforms
      : [...currentPlatforms, integrationId];

    await supabase
      .from("restaurants")
      .update({ platforms: newPlatforms })
      .eq("user_id", user.id);

    setIntegrations((prev) =>
      prev.map((intg) =>
        intg.id === integrationId
          ? { ...intg, status: "connected" as const, lastSync: "Agora" }
          : intg
      )
    );
  };

  const handleDisconnect = async (integrationId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("platforms")
      .eq("user_id", user.id)
      .single();

    const currentPlatforms = restaurant?.platforms || [];
    const newPlatforms = currentPlatforms.filter((p: string) => p !== integrationId);

    await supabase
      .from("restaurants")
      .update({ platforms: newPlatforms })
      .eq("user_id", user.id);

    setIntegrations((prev) =>
      prev.map((intg) =>
        intg.id === integrationId
          ? { ...intg, status: "disconnected" as const, lastSync: null }
          : intg
      )
    );
  };

  const statusConfig = {
    connected: { label: "Conectado", color: "bg-green-100 text-green-800" },
    pending: { label: "Pendente", color: "bg-yellow-100 text-yellow-800" },
    disconnected: { label: "Desconectado", color: "bg-gray-100 text-gray-800" },
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Integrações</h1>
        <p className="text-sm text-muted-foreground">
          Liga o Kivo às tuas plataformas de delivery.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {integrations.map((integration) => (
          <div
            key={integration.id}
            className="rounded-lg border bg-card p-6 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white"
                style={{ backgroundColor: integration.color }}
              >
                {integration.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{integration.name}</h3>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusConfig[integration.status].color}`}
                  >
                    {statusConfig[integration.status].label}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {integration.description}
                </p>
                {integration.lastSync && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Última sincronização: {integration.lastSync}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              {integration.status === "connected" ? (
                <>
                  <button
                    onClick={() => handleConnect(integration.id)}
                    className="inline-flex h-8 flex-1 items-center justify-center rounded-md border px-4 text-xs font-medium hover:bg-accent"
                  >
                    Sincronizar
                  </button>
                  <button
                    onClick={() => handleDisconnect(integration.id)}
                    className="inline-flex h-8 items-center justify-center rounded-md border border-red-300 px-4 text-xs font-medium text-red-700 hover:bg-red-50"
                  >
                    Desligar
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleConnect(integration.id)}
                  className="inline-flex h-8 flex-1 items-center justify-center rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Ligar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="text-sm font-semibold mb-2">Sobre as Integrações</h3>
        <p className="text-sm text-muted-foreground">
          Quando ligas uma plataforma, o Kivo sincroniza automaticamente os dados
          de vendas, menu e avaliações. A sincronização acontece a cada 15 minutos.
        </p>
      </div>
    </div>
  );
}
