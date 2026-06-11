"use client";

import { useData } from "@/lib/mock-data-provider";
import { useRouter } from "next/navigation";

export default function MenuPage() {
  const { menuItems, deleteMenuItem } = useData();
  const router = useRouter();

  const handleTalkToKivo = () => {
    sessionStorage.setItem(
      "kivo_agent_context",
      JSON.stringify({
        action: "menu_analysis",
        message: "Analisa o meu menu e sugere melhorias.",
      })
    );
    router.push("/dashboard/assistant");
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">Menu</h1>
          <button
            onClick={handleTalkToKivo}
            className="rounded-lg bg-[#2CDF0C] px-4 py-2 text-sm font-medium text-white hover:bg-[#23b80a]"
          >
            Falar com Kivo
          </button>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Item</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Categoria</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">Preço</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">Custo</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">Margem</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">Pedidos</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">Receita</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item) => {
                  const margin = item.price > 0 ? ((item.price - item.cost) / item.price * 100) : 0;
                  return (
                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{item.category}</td>
                      <td className="px-4 py-3 text-right text-sm text-gray-900">€{item.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-sm text-gray-500">€{item.cost.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-sm">
                        <span className={`font-medium ${margin >= 60 ? "text-green-600" : margin >= 40 ? "text-yellow-600" : "text-red-600"}`}>
                          {margin.toFixed(0)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-500">{item.orders_count}</td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">€{(item.revenue || 0).toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
