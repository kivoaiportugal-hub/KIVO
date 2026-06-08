"use client";

import { useEffect, useState } from "react";
import { useRestaurant, useUser, useAlerts } from "@/hooks/use-data";
import { useSubscription } from "@/features/billing/subscription-provider";
import { createClient } from "@/lib/supabase/client";
import { PLATFORMS } from "@/lib/constants";
import { useRouter } from "next/navigation";

const conditionTypes = [
  { value: "sales_drop", label: "Queda de vendas >" },
  { value: "low_margin", label: "Margem abaixo de" },
  { value: "negative_review", label: "Review negativo" },
  { value: "high_demand", label: "Pedidos acima de" },
];

const actionTypes = [
  { value: "notify", label: "Enviar notificação" },
  { value: "promo", label: "Criar promoção" },
  { value: "price_adjust", label: "Ajustar preço" },
  { value: "alert", label: "Criar alerta" },
];

export default function SettingsPage() {
  const { restaurant, refresh: refreshRestaurant } = useRestaurant();
  const { user } = useUser();
  const { alerts } = useAlerts(restaurant?.id);
  const { plan, isActive, isTrialing } = useSubscription();
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [autopilotRules, setAutopilotRules] = useState<any[]>([]);
  const [showNewRule, setShowNewRule] = useState(false);
  const [newRule, setNewRule] = useState({
    name: "",
    condition_type: "sales_drop",
    condition_value: "20",
    action_type: "notify",
    action_value: "",
  });
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    if (user) setFullName(user.full_name || "");
    if (restaurant) {
      setRestaurantName(restaurant.name || "");
      setConnectedPlatforms(restaurant.platforms || []);
      setWhatsappPhone((restaurant as any).whatsapp_phone || "");
    }
  }, [user, restaurant]);

  useEffect(() => {
    if (!restaurant?.id) return;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("autopilot_rules")
          .select("*")
          .eq("restaurant_id", restaurant.id)
          .order("created_at", { ascending: false });
        if (!error) setAutopilotRules(data || []);
      } catch {}
    })();
  }, [restaurant?.id]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      if (user) {
        await supabase.auth.updateUser({ data: { full_name: fullName } });
      }
      if (restaurant?.id) {
        await supabase.from("restaurants").update({
          name: restaurantName,
          whatsapp_phone: whatsappPhone || null,
        }).eq("id", restaurant.id);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {} finally {
      setSaving(false);
    }
  };

  const togglePlatform = async (platformId: string) => {
    if (!restaurant?.id) return;
    const updated = connectedPlatforms.includes(platformId)
      ? connectedPlatforms.filter((p) => p !== platformId)
      : [...connectedPlatforms, platformId];
    setConnectedPlatforms(updated);
    await supabase.from("restaurants").update({ platforms: updated }).eq("id", restaurant.id);
  };

  const handleConnectPlatform = (platformId: string) => {
    router.push("/dashboard/assistant");
    sessionStorage.setItem(
      "kivo_agent_context",
      JSON.stringify({
        action: "connect_platform",
        message: `Quero conectar o ${PLATFORMS[platformId as keyof typeof PLATFORMS]?.name || platformId}. Preciso de ajuda para configurar.`,
      })
    );
  };

  const handleCreateRule = async () => {
    if (!restaurant?.id || !newRule.name) return;
    const { data } = await supabase
      .from("autopilot_rules")
      .insert({
        restaurant_id: restaurant.id,
        name: newRule.name,
        condition_type: newRule.condition_type,
        condition_value: { threshold: Number(newRule.condition_value) },
        action_type: newRule.action_type,
        action_value: { value: newRule.action_value },
        status: "active",
      })
      .select()
      .single();
    if (data) setAutopilotRules([data, ...autopilotRules]);
    setShowNewRule(false);
    setNewRule({ name: "", condition_type: "sales_drop", condition_value: "20", action_type: "notify", action_value: "" });
  };

  const toggleRule = async (ruleId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    await supabase.from("autopilot_rules").update({ status: newStatus }).eq("id", ruleId);
    setAutopilotRules(autopilotRules.map((r) => (r.id === ruleId ? { ...r, status: newStatus } : r)));
  };

  const deleteRule = async (ruleId: string) => {
    await supabase.from("autopilot_rules").delete().eq("id", ruleId);
    setAutopilotRules(autopilotRules.filter((r) => r.id !== ruleId));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const sections = [
    { id: "profile", label: "Perfil", icon: "👤" },
    { id: "platforms", label: "Plataformas", icon: "🔗" },
    { id: "whatsapp", label: "WhatsApp", icon: "📱" },
    { id: "autopilot", label: "Autopilot", icon: "🤖" },
    { id: "account", label: "Conta", icon: "📊" },
    { id: "danger", label: "Sair", icon: "🚪" },
  ];

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mx-auto max-w-2xl space-y-4">
        <h1 className="text-lg font-bold text-gray-900">Definições</h1>

        {/* Section nav */}
        <div className="flex flex-wrap gap-2">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(activeSection === s.id ? null : s.id)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeSection === s.id
                  ? "bg-[#2CDF0C] text-white"
                  : "border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>

        {/* Profile */}
        {(activeSection === "profile" || activeSection === null) && (
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-gray-700">Perfil</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-gray-500">Nome</label>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2CDF0C] focus:ring-1 focus:ring-[#2CDF0C]/30"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-500">Email</label>
                  <input
                    value={user?.email || ""}
                    disabled
                    className="w-full rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-400"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">Restaurante</label>
                <input
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2CDF0C] focus:ring-1 focus:ring-[#2CDF0C]/30"
                />
              </div>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="rounded-lg bg-[#2CDF0C] px-4 py-2 text-sm font-medium text-white hover:bg-[#23b80a] disabled:opacity-50"
              >
                {saved ? "Guardado!" : saving ? "A guardar..." : "Guardar"}
              </button>
            </div>
          </section>
        )}

        {/* Platforms */}
        {(activeSection === "platforms" || activeSection === null) && (
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-gray-700">Plataformas de Delivery</h2>
            <div className="space-y-2">
              {Object.entries(PLATFORMS).map(([id, platform]) => {
                const connected = connectedPlatforms.includes(id);
                return (
                  <div key={id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white"
                        style={{ backgroundColor: platform.color }}
                      >
                        {platform.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{platform.name}</p>
                        <p className="text-[11px] text-gray-400">
                          {connected ? "Conectado" : "Não conectado"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {connected ? (
                        <button
                          onClick={() => togglePlatform(id)}
                          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                        >
                          Desconectar
                        </button>
                      ) : (
                        <button
                          onClick={() => handleConnectPlatform(id)}
                          className="rounded-lg bg-[#2CDF0C] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#23b80a]"
                        >
                          Conectar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* WhatsApp */}
        {(activeSection === "whatsapp" || activeSection === null) && (
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-gray-700">WhatsApp Business</h2>
            <p className="mb-3 text-xs text-gray-500">
              Liga o teu número de WhatsApp para o Kivo responder automaticamente aos teus clientes.
            </p>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-gray-500">Número de WhatsApp</label>
                <input
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  placeholder="+351 912 345 678"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2CDF0C] focus:ring-1 focus:ring-[#2CDF0C]/30"
                />
              </div>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="rounded-lg bg-[#2CDF0C] px-4 py-2 text-sm font-medium text-white hover:bg-[#23b80a] disabled:opacity-50"
              >
                Guardar
              </button>
            </div>
          </section>
        )}

        {/* Autopilot */}
        {(activeSection === "autopilot" || activeSection === null) && (
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700">Autopilot</h2>
              <button
                onClick={() => setShowNewRule(!showNewRule)}
                className="rounded-lg bg-[#2CDF0C] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#23b80a]"
              >
                + Nova Regra
              </button>
            </div>

            {showNewRule && (
              <div className="mb-4 space-y-3 rounded-lg border border-[#2CDF0C]/30 bg-[#2CDF0C]/5 p-4">
                <input
                  placeholder="Nome da regra"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2CDF0C]"
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={newRule.condition_type}
                    onChange={(e) => setNewRule({ ...newRule, condition_type: e.target.value })}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
                  >
                    {conditionTypes.map((ct) => (
                      <option key={ct.value} value={ct.value}>{ct.label}</option>
                    ))}
                  </select>
                  <input
                    placeholder="Valor"
                    value={newRule.condition_value}
                    onChange={(e) => setNewRule({ ...newRule, condition_value: e.target.value })}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2CDF0C]"
                  />
                </div>
                <select
                  value={newRule.action_type}
                  onChange={(e) => setNewRule({ ...newRule, action_type: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
                >
                  {actionTypes.map((at) => (
                    <option key={at.value} value={at.value}>{at.label}</option>
                  ))}
                </select>
                <button
                  onClick={handleCreateRule}
                  className="w-full rounded-lg bg-[#2CDF0C] px-4 py-2 text-sm font-medium text-white hover:bg-[#23b80a]"
                >
                  Criar Regra
                </button>
              </div>
            )}

            <div className="space-y-2">
              {autopilotRules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{rule.name}</p>
                    <p className="text-[11px] text-gray-400">
                      SE {rule.condition_type} ENTÃO {rule.action_type}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleRule(rule.id, rule.status)}
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                        rule.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {rule.status === "active" ? "Ativo" : "Pausado"}
                    </button>
                    <button
                      onClick={() => deleteRule(rule.id)}
                      className="text-xs text-red-400 hover:text-red-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
              {autopilotRules.length === 0 && (
                <p className="py-4 text-center text-sm text-gray-400">
                  Sem regras. Cria a primeira regra de autopilot.
                </p>
              )}
            </div>
          </section>
        )}

        {/* Account */}
        {(activeSection === "account" || activeSection === null) && (
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-gray-700">Conta</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Plano</span>
                <span className="font-medium text-gray-900 capitalize">{plan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Estado</span>
                <span className={`font-medium ${isActive ? "text-green-600" : isTrialing ? "text-blue-600" : "text-gray-400"}`}>
                  {isActive ? "Ativo" : isTrialing ? "Em trial" : "Inativo"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Membro desde</span>
                <span className="text-gray-900">
                  {restaurant?.created_at ? new Date(restaurant.created_at).toLocaleDateString("pt-PT") : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Alertas não lidos</span>
                <span className="text-gray-900">{alerts.filter((a: { read: boolean }) => !a.read).length}</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <a
                href="/dashboard/billing"
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Gerir Subscrição
              </a>
              <a
                href="/dashboard/support"
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Suporte
              </a>
            </div>
          </section>
        )}

        {/* Danger zone */}
        {(activeSection === "danger" || activeSection === null) && (
          <section className="rounded-xl border border-red-200 bg-red-50/50 p-5">
            <h2 className="mb-3 text-sm font-semibold text-red-700">Sair da conta</h2>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
            >
              Terminar sessão
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
