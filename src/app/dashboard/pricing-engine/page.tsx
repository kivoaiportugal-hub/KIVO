"use client";

import { useData } from "@/lib/mock-data-provider";
import { useRouter } from "next/navigation";

export default function PricingEnginePage() {
  const { menuItems } = useData();
  const router = useRouter();

  // Generate pricing suggestions based on mock data
  const suggestions = menuItems
    .filter((item) => item.price > 0 && item.cost > 0)
    .slice(0, 5)
    .map((item) => {
      const currentMargin = ((item.price - item.cost) / item.price) * 100;
      const targetMargin = 65;
      const suggestedPrice = currentMargin < targetMargin
        ? Math.round((item.cost / (1 - targetMargin / 100)) * 100) / 100
        : Math.round(item.price * 1.05 * 100) / 100;
      const diff = suggestedPrice - item.price;
      const diffPct = (diff / item.price) * 100;
      const monthlyImpact = Math.round(diff * (item.orders_count || 0) * 4 * 100) / 100;

      return {
        ...item,
        suggestedPrice,
        diff,
        diffPct,
        monthlyImpact,
        confidence: Math.min(95, 60 + Math.floor(Math.random() * 30)),
      };
    });

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">Pricing Engine</h1>
          <button
            onClick={() => {
              sessionStorage.setItem("kivo_agent_context", JSON.stringify({
                action: "pricing",
                message: "Analisa os preços do meu menu e sugere ajustes.",
              }));
              router.push("/dashboard/assistant");
            }}
            className="rounded-lg bg-[#2CDF0C] px-4 py-2 text-sm font-medium text-white hover:bg-[#23b80a]"
          >
            Falar com Kivo
          </button>
        </div>

        <div className="space-y-4">
          {suggestions.map((item) => (
            <div key={item.id} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="mt-1 text-xs text-gray-500">{item.category} · {item.orders_count} pedidos/mês</p>
                </div>
                <span className="rounded-full bg-[#2CDF0C]/10 px-2.5 py-0.5 text-xs font-medium text-[#187906]">
                  {item.confidence}% confiança
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Preço atual</p>
                  <p className="font-medium text-gray-900">€{item.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Preço sugerido</p>
                  <p className="font-medium text-[#187906]">€{item.suggestedPrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Impacto mensal</p>
                  <p className={`font-medium ${item.monthlyImpact >= 0 ? "text-green-600" : "text-red-500"}`}>
                    {item.monthlyImpact >= 0 ? "+" : ""}€{item.monthlyImpact.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="rounded-lg bg-[#2CDF0C] px-4 py-2 text-xs font-medium text-white hover:bg-[#23b80a]">
                  Aplicar via Kivo
                </button>
                <button className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50">
                  Ignorar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
