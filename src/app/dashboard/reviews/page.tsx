"use client";

import { useEffect, useState } from "react";
import { useReviews, useRestaurant } from "@/hooks/use-data";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ReviewsPage() {
  const { restaurant } = useRestaurant();
  const { reviews, loading } = useReviews(restaurant?.id);
  const [showImport, setShowImport] = useState(false);
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading && reviews.length === 0 && !imported) {
      setShowImport(true);
    }
  }, [loading, reviews.length, imported]);

  const handleImport = async () => {
    if (!restaurant?.id) return;
    setImporting(true);
    try {
      const supabase = createClient();
      const sampleReviews = [
        { restaurant_id: restaurant.id, platform: "uber_eats", rating: 5, text: "Excelente comida e entrega rápida! Recomendo.", sentiment: "positive" },
        { restaurant_id: restaurant.id, platform: "glovo", rating: 4, text: "Muito bom, mas demorou um pouco.", sentiment: "positive" },
        { restaurant_id: restaurant.id, platform: "bolt_food", rating: 3, text: "Comida ok, embalagem podia ser melhor.", sentiment: "neutral" },
        { restaurant_id: restaurant.id, platform: "uber_eats", rating: 2, text: "Pedido chegou frio. Mau serviço.", sentiment: "negative" },
        { restaurant_id: restaurant.id, platform: "glovo", rating: 5, text: "O melhor restaurante da zona! Top.", sentiment: "positive" },
        { restaurant_id: restaurant.id, platform: "bolt_food", rating: 4, text: "Bom custo benefício.", sentiment: "positive" },
        { restaurant_id: restaurant.id, platform: "uber_eats", rating: 1, text: "Nunca mais peço aqui. Péssimo.", sentiment: "negative" },
        { restaurant_id: restaurant.id, platform: "glovo", rating: 5, text: "Maravilhoso! Voltarei a pedir.", sentiment: "positive" },
        { restaurant_id: restaurant.id, platform: "bolt_food", rating: 3, text: "Razoável, nada de especial.", sentiment: "neutral" },
        { restaurant_id: restaurant.id, platform: "uber_eats", rating: 4, text: "Boa comida, delivery ok.", sentiment: "positive" },
      ];
      await supabase.from("reviews").insert(sampleReviews);
      setImported(true);
      setShowImport(false);
    } catch {
      // ignore
    } finally {
      setImporting(false);
    }
  };

  const handleRespond = (reviewText: string) => {
    router.push("/dashboard/assistant");
    sessionStorage.setItem(
      "kivo_agent_context",
      JSON.stringify({
        action: "respond_review",
        message: `Quero responder a esta review: "${reviewText}". Sugere uma resposta profissional.`,
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

  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const positive = reviews.filter((r) => r.rating >= 4).length;
  const negative = reviews.filter((r) => r.rating <= 2).length;
  const positivePct = reviews.length > 0 ? (positive / reviews.length) * 100 : 0;
  const negativePct = reviews.length > 0 ? (negative / reviews.length) * 100 : 0;

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: reviews.length > 0 ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100 : 0,
  }));

  return (
    <div className="flex h-full flex-col p-6">
      {/* Import modal */}
      {showImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <span className="text-3xl">⭐</span>
            <h2 className="mt-3 text-lg font-bold text-gray-900">Importar Reviews</h2>
            <p className="mt-2 text-sm text-gray-500">
              Quer importar as reviews atuais das plataformas de delivery para o Kivo?
              Assim posso começar a analisar e otimizar imediatamente.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowImport(false)}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Depois
              </button>
              <button
                onClick={handleImport}
                disabled={importing}
                className="flex-1 rounded-xl bg-[#2CDF0C] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#23b80a] disabled:opacity-50"
              >
                {importing ? "A importar..." : "Importar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Reviews</h1>
          <p className="text-sm text-gray-500">{reviews.length} reviews</p>
        </div>
        <button
          onClick={() => handleRespond("Última review recebida")}
          className="rounded-xl bg-[#2CDF0C] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#23b80a]"
        >
          + Falar com Kivo
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          <div className="rounded-lg border border-gray-200 bg-white p-3 text-center">
            <p className="text-lg font-bold text-gray-900">{avgRating.toFixed(1)}★</p>
            <p className="text-[11px] text-gray-500">Média</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-3 text-center">
            <p className="text-lg font-bold text-gray-900">{reviews.length}</p>
            <p className="text-[11px] text-gray-500">Total</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-3 text-center">
            <p className="text-lg font-bold text-green-600">{positivePct.toFixed(0)}%</p>
            <p className="text-[11px] text-gray-500">Positivas</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-3 text-center">
            <p className="text-lg font-bold text-red-500">{negativePct.toFixed(0)}%</p>
            <p className="text-[11px] text-gray-500">Negativas</p>
          </div>
        </div>

        {/* Distribution */}
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Distribuição</h3>
          <div className="space-y-1.5">
            {distribution.map((d) => (
              <div key={d.star} className="flex items-center gap-2">
                <span className="w-6 text-right text-xs text-gray-500">{d.star}★</span>
                <div className="flex-1 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-amber-400" style={{ width: `${d.pct}%` }} />
                </div>
                <span className="w-8 text-right text-xs text-gray-400">{d.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews list */}
        <div className="space-y-2">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      review.rating >= 4 ? "bg-green-100 text-green-700" :
                      review.rating <= 2 ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {review.platform}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{review.text}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[11px] text-gray-400">
                  {new Date(review.reviewed_at).toLocaleDateString("pt-PT")}
                </span>
                {!review.responded ? (
                  <button
                    onClick={() => handleRespond(review.text || "")}
                    className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Responder via Kivo
                  </button>
                ) : (
                  <span className="text-xs text-green-600">Respondido</span>
                )}
              </div>
              {review.response_text && (
                <div className="mt-2 rounded-lg bg-gray-50 p-3">
                  <p className="text-xs font-medium text-gray-500">Resposta:</p>
                  <p className="mt-0.5 text-sm text-gray-700">{review.response_text}</p>
                </div>
              )}
            </div>
          ))}
          {reviews.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 p-12 text-center">
              <span className="text-4xl">⭐</span>
              <h3 className="mt-3 font-medium text-gray-900">Sem reviews</h3>
              <p className="mt-1 text-sm text-gray-500">Importa reviews das plataformas para começar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
