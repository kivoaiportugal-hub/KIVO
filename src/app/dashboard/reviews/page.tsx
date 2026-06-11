"use client";

import { useData } from "@/lib/mock-data-provider";
import { useRouter } from "next/navigation";

export default function ReviewsPage() {
  const { reviews, respondToReview } = useData();
  const router = useRouter();

  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const starCounts = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
    percentage: reviews.length > 0 ? (reviews.filter((r) => r.rating === stars).length / reviews.length) * 100 : 0,
  }));

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">Reviews</h1>
          <button
            onClick={() => {
              sessionStorage.setItem("kivo_agent_context", JSON.stringify({
                action: "reviews",
                message: "Analisa os meus reviews e sugere respostas.",
              }));
              router.push("/dashboard/assistant");
            }}
            className="rounded-lg bg-[#2CDF0C] px-4 py-2 text-sm font-medium text-white hover:bg-[#23b80a]"
          >
            Falar com Kivo
          </button>
        </div>

        {/* Star distribution */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{avgRating.toFixed(1)}</p>
              <p className="text-xs text-gray-500">{reviews.length} reviews</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {starCounts.map(({ stars, count, percentage }) => (
                <div key={stars} className="flex items-center gap-2">
                  <span className="w-3 text-xs text-gray-500">{stars}★</span>
                  <div className="flex-1 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-[#2CDF0C]"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-xs text-gray-400">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews list */}
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{review.author_name}</span>
                    <span className="text-xs text-gray-400">· {review.platform}</span>
                    {review.responded ? (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">Respondido</span>
                    ) : (
                      <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-medium text-yellow-700">Por responder</span>
                    )}
                  </div>
                  <div className="mt-1 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`text-sm ${i < review.rating ? "text-yellow-400" : "text-gray-200"}`}>★</span>
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{review.text}</p>
                  {review.responded && review.response_text && (
                    <div className="mt-3 rounded-lg bg-gray-50 p-3">
                      <p className="text-xs font-medium text-gray-500">Resposta:</p>
                      <p className="mt-1 text-sm text-gray-600">{review.response_text}</p>
                    </div>
                  )}
                </div>
              </div>
              {!review.responded && (
                <div className="mt-3">
                  <button
                    onClick={() => {
                      respondToReview(review.id, "Obrigado pelo feedback! Valoramos a tua opinião.");
                    }}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Responder via Kivo
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
