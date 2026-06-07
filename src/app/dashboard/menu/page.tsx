"use client";

import { useMenuItems } from "@/hooks/use-data";
import { useRestaurant } from "@/hooks/use-data";
import { useRouter } from "next/navigation";

export default function MenuPage() {
  const { restaurant } = useRestaurant();
  const { items, loading } = useMenuItems(restaurant?.id);
  const router = useRouter();

  const handleAddItem = () => {
    router.push("/dashboard/assistant");
    sessionStorage.setItem(
      "kivo_agent_context",
      JSON.stringify({
        action: "add_menu_item",
        message:
          "Quero adicionar um novo item ao menu. Preciso que me faças as perguntas necessárias (nome, descrição, preço, custo, categorias, etc.) para criar o item da melhor forma.",
      })
    );
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#2CDF0C]" />
      </div>
    );
  }

  const totalItems = items.length;
  const avgMargin =
    totalItems > 0
      ? items.reduce((s, m) => s + (m.margin_pct || 0), 0) / totalItems
      : 0;
  const topItem = [...items].sort((a, b) => (b.orders_count || 0) - (a.orders_count || 0))[0];

  return (
    <div className="flex h-full flex-col p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Menu</h1>
          <p className="text-sm text-gray-500">{totalItems} itens no menu</p>
        </div>
        <button
          onClick={handleAddItem}
          className="rounded-xl bg-[#2CDF0C] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#23b80a]"
        >
          + Falar com Kivo
        </button>
      </div>

      {/* Stats */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-gray-200 bg-white p-3 text-center">
          <p className="text-lg font-bold text-gray-900">{totalItems}</p>
          <p className="text-[11px] text-gray-500">Itens</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-3 text-center">
          <p className="text-lg font-bold text-gray-900">{avgMargin.toFixed(0)}%</p>
          <p className="text-[11px] text-gray-500">Margem Média</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-3 text-center">
          <p className="text-lg font-bold text-gray-900 truncate">
            {topItem?.name || "—"}
          </p>
          <p className="text-[11px] text-gray-500">Mais Vendido</p>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="h-full overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-4 py-2.5 font-medium text-gray-500">Item</th>
                <th className="px-4 py-2.5 font-medium text-gray-500">Categoria</th>
                <th className="px-4 py-2.5 font-medium text-gray-500">Preço</th>
                <th className="px-4 py-2.5 font-medium text-gray-500">Custo</th>
                <th className="px-4 py-2.5 font-medium text-gray-500">Margem</th>
                <th className="px-4 py-2.5 font-medium text-gray-500">Pedidos</th>
                <th className="px-4 py-2.5 font-medium text-gray-500">Receita</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-2.5 font-medium text-gray-900">{item.name}</td>
                  <td className="px-4 py-2.5 text-gray-500">{item.category || "—"}</td>
                  <td className="px-4 py-2.5 text-gray-700">€{(item.price || 0).toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-gray-700">€{(item.cost || 0).toFixed(2)}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        (item.margin_pct || 0) >= 70
                          ? "bg-green-100 text-green-700"
                          : (item.margin_pct || 0) >= 60
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {(item.margin_pct || 0).toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-gray-500">{item.orders_count || 0}</td>
                  <td className="px-4 py-2.5 text-gray-700">
                    €{(item.revenue || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    Sem itens no menu. Fala com o Kivo para adicionar o primeiro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
