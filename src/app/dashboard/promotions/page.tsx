"use client";

import { useState } from "react";
import { useRestaurant, usePromotions } from "@/hooks/use-data";

export default function PromotionsPage() {
  const { restaurant } = useRestaurant();
  const { promotions, loading, addPromotion, updatePromotion, deletePromotion } =
    usePromotions(restaurant?.id);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPromo, setNewPromo] = useState({
    name: "",
    platform: "todas",
    discount_type: "percentage",
    discount_value: 10,
  });

  const activePromos = promotions.filter((p) => p.status === "active");
  const inactivePromos = promotions.filter((p) => p.status !== "active");

  const handleAdd = async () => {
    if (!newPromo.name) return;
    await addPromotion(newPromo);
    setNewPromo({ name: "", platform: "todas", discount_type: "percentage", discount_value: 10 });
    setShowAddForm(false);
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    await updatePromotion(id, {
      status: currentStatus === "active" ? "paused" : "active",
    });
  };

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
          <h1 className="text-2xl font-bold tracking-tight">Promoções</h1>
          <p className="text-sm text-muted-foreground">
            Cria, gere e monitoriza as tuas promoções.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          + Nova Promoção
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <h3 className="text-sm font-semibold mb-3">Nova Promoção</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Nome da promoção"
              value={newPromo.name}
              onChange={(e) => setNewPromo({ ...newPromo, name: e.target.value })}
              className="flex h-10 rounded-md border bg-background px-3 py-2 text-sm col-span-2"
            />
            <select
              value={newPromo.platform}
              onChange={(e) => setNewPromo({ ...newPromo, platform: e.target.value })}
              className="flex h-10 rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="todas">Todas</option>
              <option value="uber_eats">Uber Eats</option>
              <option value="glovo">Glovo</option>
              <option value="bolt_food">Bolt Food</option>
            </select>
            <div className="flex gap-2">
              <select
                value={newPromo.discount_type}
                onChange={(e) => setNewPromo({ ...newPromo, discount_type: e.target.value })}
                className="flex h-10 rounded-md border bg-background px-3 py-2 text-sm"
              >
                <option value="percentage">%</option>
                <option value="fixed">€</option>
                <option value="free_delivery">Free Delivery</option>
              </select>
              <input
                type="number"
                value={newPromo.discount_value}
                onChange={(e) =>
                  setNewPromo({ ...newPromo, discount_value: Number(e.target.value) })
                }
                className="flex h-10 w-20 rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleAdd}
              disabled={!newPromo.name}
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

      {/* Active Promos */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">
          Promoções Ativas ({activePromos.length})
        </h3>
        {activePromos.length === 0 ? (
          <div className="rounded-lg border bg-card p-6 text-center text-sm text-muted-foreground">
            Sem promoções ativas. Cria uma acima.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {activePromos.map((p) => (
              <div key={p.id} className="rounded-lg border bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{p.name}</div>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                    Ativa
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mb-3 capitalize">
                  {p.platform?.replace("_", " ")} ·{" "}
                  {p.discount_type === "percentage"
                    ? `${p.discount_value}% off`
                    : p.discount_type === "fixed"
                      ? `€${p.discount_value} off`
                      : "Free Delivery"}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleStatus(p.id, p.status)}
                    className="inline-flex h-8 flex-1 items-center justify-center rounded-md border px-4 text-xs font-medium hover:bg-accent"
                  >
                    Pausar
                  </button>
                  <button
                    onClick={() => deletePromotion(p.id)}
                    className="inline-flex h-8 items-center justify-center rounded-md border border-red-300 px-4 text-xs font-medium text-red-700 hover:bg-red-50"
                  >
                    Apagar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inactive Promos */}
      {inactivePromos.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">
            Outras Promoções ({inactivePromos.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {inactivePromos.map((p) => (
              <div key={p.id} className="rounded-lg border bg-card p-4 shadow-sm opacity-60">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{p.name}</div>
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                    {p.status === "paused" ? "Pausada" : "Rascunho"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleStatus(p.id, p.status)}
                    className="inline-flex h-8 flex-1 items-center justify-center rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Ativar
                  </button>
                  <button
                    onClick={() => deletePromotion(p.id)}
                    className="inline-flex h-8 items-center justify-center rounded-md border border-red-300 px-4 text-xs font-medium text-red-700 hover:bg-red-50"
                  >
                    Apagar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
