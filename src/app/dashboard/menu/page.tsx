"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRestaurant, useMenuItems } from "@/hooks/use-data";

export default function MenuPage() {
  const supabase = createClient();
  const { restaurant } = useRestaurant();
  const { items, loading, addItem, updateItem, deleteItem } = useMenuItems(restaurant?.id);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", category: "Burgers", price: 0, cost: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ price: number; cost: number }>({ price: 0, cost: 0 });

  const categories = ["Todos", "Burgers", "Pizzas", "Saladas", "Extras", "Bebidas", "Sobremesas"];
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredItems =
    selectedCategory === "Todos"
      ? items
      : items.filter((i) => i.category === selectedCategory);

  const totalRevenue = items.reduce((s, i) => s + (i.revenue || 0), 0);
  const avgMargin =
    items.length > 0
      ? items.reduce((s, i) => s + (i.margin_pct || 0), 0) / items.length
      : 0;
  const topSeller = items.length > 0 ? items.reduce((a, b) => (a.orders_count > b.orders_count ? a : b), items[0]) : null;

  const handleAdd = async () => {
    if (!newItem.name || newItem.price <= 0) return;
    await addItem(newItem);
    setNewItem({ name: "", category: "Burgers", price: 0, cost: 0 });
    setShowAddForm(false);
  };

  const handleSaveEdit = async (id: string) => {
    await updateItem(id, { price: editValues.price, cost: editValues.cost });
    setEditingId(null);
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-muted" />
          <div className="h-64 rounded-lg border bg-card" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Menu Intelligence</h1>
          <p className="text-sm text-muted-foreground">
            Análise de performance e margem de cada item do teu menu.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          + Item
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <h3 className="text-sm font-semibold mb-3">Novo Item</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Nome"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="flex h-10 rounded-md border bg-background px-3 py-2 text-sm"
            />
            <select
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              className="flex h-10 rounded-md border bg-background px-3 py-2 text-sm"
            >
              {categories.filter((c) => c !== "Todos").map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Preço (€)"
              value={newItem.price || ""}
              onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
              className="flex h-10 rounded-md border bg-background px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="Custo (€)"
              value={newItem.cost || ""}
              onChange={(e) => setNewItem({ ...newItem, cost: Number(e.target.value) })}
              className="flex h-10 rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleAdd}
              disabled={!newItem.name || newItem.price <= 0}
              className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              Guardar
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

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">Itens no Menu</div>
          <div className="text-2xl font-bold">{items.length}</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">Margem Média</div>
          <div className="text-2xl font-bold">{avgMargin.toFixed(1)}%</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">Top Seller</div>
          <div className="text-2xl font-bold">{topSeller?.name || "—"}</div>
          {topSeller && (
            <div className="text-xs text-muted-foreground">
              {topSeller.orders_count} pedidos
            </div>
          )}
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              selectedCategory === c
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Menu Items Table */}
      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        {items.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Sem itens no menu. Adiciona o teu primeiro item acima.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">Item</th>
                  <th className="px-4 py-3 text-left font-medium">Categoria</th>
                  <th className="px-4 py-3 text-right font-medium">Preço</th>
                  <th className="px-4 py-3 text-right font-medium">Custo</th>
                  <th className="px-4 py-3 text-right font-medium">Margem</th>
                  <th className="px-4 py-3 text-right font-medium">Pedidos</th>
                  <th className="px-4 py-3 text-right font-medium">Receita</th>
                  <th className="px-4 py-3 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{item.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.category}</td>
                    <td className="px-4 py-3 text-right">
                      {editingId === item.id ? (
                        <input
                          type="number"
                          value={editValues.price}
                          onChange={(e) =>
                            setEditValues({ ...editValues, price: Number(e.target.value) })
                          }
                          className="w-20 rounded border px-2 py-1 text-right text-sm"
                        />
                      ) : (
                        `€${item.price?.toFixed(2)}`
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {editingId === item.id ? (
                        <input
                          type="number"
                          value={editValues.cost}
                          onChange={(e) =>
                            setEditValues({ ...editValues, cost: Number(e.target.value) })
                          }
                          className="w-20 rounded border px-2 py-1 text-right text-sm"
                        />
                      ) : (
                        `€${item.cost?.toFixed(2)}`
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          (item.margin_pct || 0) >= 70
                            ? "bg-green-100 text-green-800"
                            : (item.margin_pct || 0) >= 60
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {(item.margin_pct || 0).toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">{item.orders_count || 0}</td>
                    <td className="px-4 py-3 text-right font-medium">
                      €{(item.revenue || 0).toFixed(0)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-1 justify-end">
                        {editingId === item.id ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(item.id)}
                              className="text-xs text-primary hover:underline"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-xs text-muted-foreground hover:underline"
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingId(item.id);
                                setEditValues({ price: item.price, cost: item.cost });
                              }}
                              className="text-xs text-primary hover:underline"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => deleteItem(item.id)}
                              className="text-xs text-red-500 hover:underline"
                            >
                              Apagar
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
