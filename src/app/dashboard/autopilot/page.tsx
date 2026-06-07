"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRestaurant } from "@/hooks/use-data";

interface AutopilotRule {
  id: string;
  name: string;
  condition_type: string;
  condition_value: any;
  action_type: string;
  action_value: any;
  status: string;
  triggers_count: number;
  last_triggered_at: string | null;
}

export default function AutopilotPage() {
  const supabase = createClient();
  const { restaurant } = useRestaurant();
  const [rules, setRules] = useState<AutopilotRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRule, setNewRule] = useState({
    name: "",
    condition_type: "sales_drop",
    condition_value: "15",
    action_type: "notify",
    action_value: "Alertar queda de vendas",
  });

  const fetchRules = useCallback(async () => {
    if (!restaurant?.id) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("autopilot_rules")
      .select("*")
      .eq("restaurant_id", restaurant.id)
      .order("created_at", { ascending: false });

    setRules(data || []);
    setLoading(false);
  }, [restaurant?.id]);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const handleAdd = async () => {
    if (!newRule.name || !restaurant?.id) return;
    await supabase.from("autopilot_rules").insert({
      restaurant_id: restaurant.id,
      name: newRule.name,
      condition_type: newRule.condition_type,
      condition_value: { threshold: Number(newRule.condition_value) },
      action_type: newRule.action_type,
      action_value: { message: newRule.action_value },
      status: "active",
    });
    setNewRule({
      name: "",
      condition_type: "sales_drop",
      condition_value: "15",
      action_type: "notify",
      action_value: "Alertar queda de vendas",
    });
    setShowAddForm(false);
    fetchRules();
  };

  const handleToggle = async (id: string, currentStatus: string) => {
    await supabase
      .from("autopilot_rules")
      .update({ status: currentStatus === "active" ? "paused" : "active" })
      .eq("id", id);
    fetchRules();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("autopilot_rules").delete().eq("id", id);
    fetchRules();
  };

  const conditionLabels: Record<string, string> = {
    sales_drop: "Vendas caem >{threshold}%",
    low_margin: "Margem <{threshold}%",
    negative_review: "Avaliação ≤{threshold} estrelas",
    high_demand: "Pedidos >{threshold}/dia",
  };

  const actionLabels: Record<string, string> = {
    notify: "Notificar no WhatsApp",
    promo: "Ativar promoção {value}%",
    price_adjust: "Ajustar preços",
    alert: "Enviar alerta",
  };

  const activeRules = rules.filter((r) => r.status === "active");

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-muted" />
          <div className="h-48 rounded-lg border bg-card" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Autopilot</h1>
          <p className="text-sm text-muted-foreground">
            Define regras e a IA executa automaticamente para ti.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          + Nova Regra
        </button>
      </div>

      {/* Status */}
      <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            ⚙️
          </div>
          <div>
            <div className="font-semibold">
              Autopilot {activeRules.length > 0 ? "Ativo" : "Inativo"}
            </div>
            <div className="text-sm text-muted-foreground">
              {activeRules.length} regra{activeRules.length !== 1 ? "s" : ""}{" "}
              ativa{activeRules.length !== 1 ? "s" : ""} · {rules.length} total
            </div>
          </div>
        </div>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <h3 className="text-sm font-semibold mb-3">Nova Regra</h3>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Nome da regra"
              value={newRule.name}
              onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
              className="flex h-10 rounded-md border bg-background px-3 py-2 text-sm col-span-2"
            />
            <select
              value={newRule.condition_type}
              onChange={(e) =>
                setNewRule({ ...newRule, condition_type: e.target.value })
              }
              className="flex h-10 rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="sales_drop">Queda de vendas</option>
              <option value="low_margin">Margem baixa</option>
              <option value="negative_review">Review negativa</option>
              <option value="high_demand">Alta procura</option>
            </select>
            <input
              type="number"
              placeholder="Valor limite"
              value={newRule.condition_value}
              onChange={(e) =>
                setNewRule({ ...newRule, condition_value: e.target.value })
              }
              className="flex h-10 rounded-md border bg-background px-3 py-2 text-sm"
            />
            <select
              value={newRule.action_type}
              onChange={(e) =>
                setNewRule({ ...newRule, action_type: e.target.value })
              }
              className="flex h-10 rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="notify">Notificar</option>
              <option value="promo">Criar promoção</option>
              <option value="price_adjust">Ajustar preços</option>
              <option value="alert">Enviar alerta</option>
            </select>
            <input
              type="text"
              placeholder="Ação"
              value={newRule.action_value}
              onChange={(e) =>
                setNewRule({ ...newRule, action_value: e.target.value })
              }
              className="flex h-10 rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleAdd}
              disabled={!newRule.name}
              className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              Criar
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="inline-flex h-8 items-center justify-center rounded-md border px-4 text-xs font-medium hover:bg-accent"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Rules List */}
      {rules.length === 0 ? (
        <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
          Sem regras de autopilot. Cria a primeira regra acima.
        </div>
      ) : (
        <div className="space-y-3">
          {rules.map((rule) => (
            <div key={rule.id} className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">{rule.name}</div>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    rule.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {rule.status === "active" ? "Ativa" : "Pausada"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
                <div>
                  <span className="font-medium">SE:</span>{" "}
                  {conditionLabels[rule.condition_type]?.replace(
                    "{threshold}",
                    rule.condition_value?.threshold || "?"
                  ) || rule.condition_type}
                </div>
                <div>
                  <span className="font-medium">ENTÃO:</span>{" "}
                  {actionLabels[rule.action_type]?.replace(
                    "{value}",
                    rule.action_value?.message || "?"
                  ) || rule.action_type}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Triggers: {rule.triggers_count || 0}
                  {rule.last_triggered_at &&
                    ` · Último: ${new Date(rule.last_triggered_at).toLocaleDateString("pt-PT")}`}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggle(rule.id, rule.status)}
                    className="text-primary hover:underline"
                  >
                    {rule.status === "active" ? "Pausar" : "Ativar"}
                  </button>
                  <button
                    onClick={() => handleDelete(rule.id)}
                    className="text-red-500 hover:underline"
                  >
                    Apagar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
