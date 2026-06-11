"use client";

import { useData } from "@/lib/mock-data-provider";
import { useRouter } from "next/navigation";

export default function PromotionsPage() {
  const { promotions, updatePromotion, deletePromotion } = useData();
  const router = useRouter();

  const active = promotions.filter((p) => p.status === "active");
  const inactive = promotions.filter((p) => p.status !== "active");

  const handleTalkToKivo = () => {
    sessionStorage.setItem(
      "kivo_agent_context",
      JSON.stringify({
        action: "create_promotion",
        message: "Quero criar uma nova promoção para o meu restaurante.",
      })
    );
    router.push("/dashboard/assistant");
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">Promoções</h1>
          <button
            onClick={handleTalkToKivo}
            className="rounded-lg bg-[#2CDF0C] px-4 py-2 text-sm font-medium text-white hover:bg-[#23b80a]"
          >
            Falar com Kivo
          </button>
        </div>

        {/* Active */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-700">Ativas ({active.length})</h2>
          {active.map((promo) => (
            <div key={promo.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    <p className="text-sm font-medium text-gray-900">{promo.name}</p>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {promo.platform === "all" ? "Todas as plataformas" : promo.platform} · {promo.discount_value}{promo.discount_type === "percentage" ? "%" : "€"} desconto
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updatePromotion(promo.id, { status: "inactive" })}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Pausar
                  </button>
                  <button
                    onClick={() => deletePromotion(promo.id)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              <div className="mt-3 flex gap-4 text-xs text-gray-500">
                <span>{promo.orders_count} pedidos</span>
                <span>€{(promo.revenue || 0).toFixed(2)} receita</span>
              </div>
            </div>
          ))}
        </div>

        {/* Inactive */}
        {inactive.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-700">Inativas ({inactive.length})</h2>
            {inactive.map((promo) => (
              <div key={promo.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-gray-300" />
                      <p className="text-sm font-medium text-gray-500">{promo.name}</p>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">
                      {promo.platform === "all" ? "Todas" : promo.platform} · {promo.discount_value}{promo.discount_type === "percentage" ? "%" : "€"} desconto
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updatePromotion(promo.id, { status: "active" })}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                    >
                      Ativar
                    </button>
                    <button
                      onClick={() => deletePromotion(promo.id)}
                      className="text-xs text-red-400 hover:text-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
