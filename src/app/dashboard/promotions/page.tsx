"use client";

import { usePromotions, useRestaurant } from "@/hooks/use-data";
import { useRouter } from "next/navigation";

export default function PromotionsPage() {
  const { restaurant } = useRestaurant();
  const { promotions, loading } = usePromotions(restaurant?.id);
  const router = useRouter();

  const handleCreatePromo = () => {
    router.push("/dashboard/assistant");
    sessionStorage.setItem(
      "kivo_agent_context",
      JSON.stringify({
        action: "create_promotion",
        message:
          "Quero criar uma promoção. Analisa o que faz mais sentido para o meu restaurante e propõe uma promoção com detalhes.",
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

  const active = promotions.filter((p) => p.status === "active");
  const inactive = promotions.filter((p) => p.status !== "active");

  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Promoções</h1>
          <p className="text-sm text-gray-500">{active.length} ativas · {inactive.length} inativas</p>
        </div>
        <button
          onClick={handleCreatePromo}
          className="rounded-xl bg-[#2CDF0C] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#23b80a]"
        >
          + Falar com Kivo
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {active.length > 0 && (
          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Ativas</h2>
            <div className="space-y-2">
              {active.map((promo) => (
                <div key={promo.id} className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 p-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{promo.name}</h3>
                    <p className="text-sm text-gray-500">
                      {promo.platform || "Todas"} · {promo.discount_type === "percent" ? `${promo.discount_value}%` : promo.discount_type === "free_delivery" ? "Entrega grátis" : `€${promo.discount_value}`}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-gray-700">{promo.orders_count || 0} pedidos</p>
                    <p className="text-gray-500">€{(promo.revenue || 0).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {inactive.length > 0 && (
          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Inativas</h2>
            <div className="space-y-2">
              {inactive.map((promo) => (
                <div key={promo.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4 opacity-70">
                  <div>
                    <h3 className="font-medium text-gray-900">{promo.name}</h3>
                    <p className="text-sm text-gray-500">{promo.platform || "Todas"}</p>
                  </div>
                  <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                    {promo.status || "draft"}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {promotions.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 p-12 text-center">
            <span className="text-4xl">🎯</span>
            <h3 className="mt-3 font-medium text-gray-900">Sem promoções</h3>
            <p className="mt-1 text-sm text-gray-500">
              Fala com o Kivo para criar a tua primeira promoção.
            </p>
            <button
              onClick={handleCreatePromo}
              className="mt-4 rounded-xl bg-[#2CDF0C] px-4 py-2 text-sm font-medium text-white hover:bg-[#23b80a]"
            >
              Criar promoção
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
