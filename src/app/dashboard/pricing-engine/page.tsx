"use client";

import { useMenuItems, useRestaurant } from "@/hooks/use-data";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const { restaurant } = useRestaurant();
  const { items, loading } = useMenuItems(restaurant?.id);
  const router = useRouter();

  const handleApplyPricing = (itemName: string) => {
    router.push("/dashboard/assistant");
    sessionStorage.setItem(
      "kivo_agent_context",
      JSON.stringify({
        action: "adjust_pricing",
        message: `Quero ajustar o preço do item "${itemName}". Analisa o mercado e sugere o melhor preço.`,
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

  const suggestions = items
    .map((item) => {
      const margin = item.margin_pct || 0;
      let suggestedIncrease = 0;
      let confidence = 0;

      if (margin < 50) {
        suggestedIncrease = 1.0;
        confidence = 95;
      } else if (margin < 60) {
        suggestedIncrease = 0.5;
        confidence = 88;
      } else if (margin < 70) {
        suggestedIncrease = 0.3;
        confidence = 80;
      } else {
        suggestedIncrease = 0.15;
        confidence = 65;
      }

      const suggestedPrice = (item.price || 0) + suggestedIncrease;
      const monthlyImpact = suggestedIncrease * (item.orders_count || 0);

      return {
        ...item,
        suggestedPrice,
        suggestedIncrease,
        confidence,
        monthlyImpact,
      };
    })
    .filter((s) => s.suggestedIncrease > 0)
    .sort((a, b) => b.monthlyImpact - a.monthlyImpact);

  const totalPotential = suggestions.reduce((s, i) => s + i.monthlyImpact, 0);

  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-4">
        <h1 className="text-lg font-bold text-gray-900">Pricing</h1>
        <p className="text-sm text-gray-500">Sugestões de otimização de preços</p>
      </div>

      {/* Summary */}
      <div className="mb-4 rounded-xl border border-[#2CDF0C]/20 bg-[#2CDF0C]/5 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Potencial mensal extra</p>
            <p className="text-2xl font-bold text-[#2CDF0C]">+€{totalPotential.toFixed(2)}</p>
          </div>
          <span className="text-3xl">💰</span>
        </div>
      </div>

      {/* Suggestions table */}
      <div className="flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="h-full overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-4 py-2.5 font-medium text-gray-500">Item</th>
                <th className="px-4 py-2.5 font-medium text-gray-500">Preço Atual</th>
                <th className="px-4 py-2.5 font-medium text-gray-500">Preço Sugerido</th>
                <th className="px-4 py-2.5 font-medium text-gray-500">Impacto €/mês</th>
                <th className="px-4 py-2.5 font-medium text-gray-500">Confiança</th>
                <th className="px-4 py-2.5 font-medium text-gray-500">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {suggestions.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-2.5 font-medium text-gray-900">{item.name}</td>
                  <td className="px-4 py-2.5 text-gray-500">€{(item.price || 0).toFixed(2)}</td>
                  <td className="px-4 py-2.5 font-medium text-green-600">
                    €{item.suggestedPrice.toFixed(2)}
                  </td>
                  <td className="px-4 py-2.5 font-medium text-green-600">
                    +€{item.monthlyImpact.toFixed(2)}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        item.confidence >= 85
                          ? "bg-green-100 text-green-700"
                          : item.confidence >= 70
                          ? "bg-amber-100 text-amber-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.confidence}%
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <button
                      onClick={() => handleApplyPricing(item.name)}
                      className="rounded-lg bg-[#2CDF0C] px-3 py-1 text-xs font-medium text-white hover:bg-[#23b80a]"
                    >
                      Aplicar via Kivo
                    </button>
                  </td>
                </tr>
              ))}
              {suggestions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    Sem sugestões de preço. Adiciona itens ao menu primeiro.
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
