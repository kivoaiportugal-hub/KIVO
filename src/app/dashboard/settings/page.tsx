"use client";

import { useState } from "react";
import { useData } from "@/lib/mock-data-provider";
import { useAuth } from "@/lib/auth/mock-auth";
import { PLATFORMS } from "@/lib/constants";

export default function SettingsPage() {
  const { restaurant, updateRestaurant, autopilotRules, addAutopilotRule, toggleAutopilotRule, deleteAutopilotRule } = useData();
  const { user, signOut } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || "");
  const [restaurantName, setRestaurantName] = useState(restaurant?.name || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showNewRule, setShowNewRule] = useState(false);
  const [newRule, setNewRule] = useState({
    name: "",
    condition_type: "sales_drop",
    condition_value: "20",
    action_type: "notify",
    action_value: "",
  });

  const handleSaveProfile = () => {
    setSaving(true);
    updateRestaurant({ name: restaurantName });
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 500);
  };

  const handleCreateRule = () => {
    addAutopilotRule({
      name: newRule.name,
      condition_type: newRule.condition_type,
      condition_value: { threshold: Number(newRule.condition_value) },
      action_type: newRule.action_type,
      action_value: { value: newRule.action_value },
    });
    setShowNewRule(false);
    setNewRule({ name: "", condition_type: "sales_drop", condition_value: "20", action_type: "notify", action_value: "" });
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-lg font-bold text-gray-900">Definições</h1>

        {/* Profile */}
        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">Perfil</h2>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs text-gray-500">Nome</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2CDF0C]"
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
            <div>
              <label className="mb-1 block text-xs text-gray-500">Restaurante</label>
              <input
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2CDF0C]"
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

        {/* Platforms */}
        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">Plataformas</h2>
          <div className="space-y-2">
            {Object.entries(PLATFORMS).map(([id, platform]) => {
              const connected = restaurant?.platforms?.includes(id);
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
                  <button
                    onClick={() => {
                      const current = restaurant?.platforms || [];
                      const updated = connected
                        ? current.filter((p) => p !== id)
                        : [...current, id];
                      updateRestaurant({ platforms: updated });
                    }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                      connected
                        ? "border border-gray-200 text-gray-600 hover:bg-gray-50"
                        : "bg-[#2CDF0C] text-white hover:bg-[#23b80a]"
                    }`}
                  >
                    {connected ? "Desconectar" : "Conectar"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Autopilot */}
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
                  <option value="sales_drop">Queda de vendas {'>'}</option>
                  <option value="low_margin">Margem abaixo de</option>
                  <option value="negative_review">Review negativo</option>
                  <option value="high_demand">Pedidos acima de</option>
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
                <option value="notify">Enviar notificação</option>
                <option value="promo">Criar promoção</option>
                <option value="price_adjust">Ajustar preço</option>
                <option value="alert">Criar alerta</option>
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
                    onClick={() => toggleAutopilotRule(rule.id)}
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                      rule.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {rule.status === "active" ? "Ativo" : "Pausado"}
                  </button>
                  <button
                    onClick={() => deleteAutopilotRule(rule.id)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Account Info */}
        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-gray-700">Conta</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Plano</span>
              <span className="font-medium text-gray-900">Grow</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Membro desde</span>
              <span className="text-gray-900">01/01/2026</span>
            </div>
          </div>
        </section>

        {/* Danger zone */}
        <section className="rounded-xl border border-red-200 bg-red-50/50 p-5">
          <h2 className="mb-3 text-sm font-semibold text-red-700">Sair</h2>
          <button
            onClick={() => {
              signOut();
              window.location.href = "/login";
            }}
            className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
          >
            Terminar sessão
          </button>
        </section>
      </div>
    </div>
  );
}
