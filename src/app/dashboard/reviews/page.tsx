"use client";

import { useState } from "react";
import { useRestaurant, useReviews } from "@/hooks/use-data";

export default function ReviewsPage() {
  const { restaurant } = useRestaurant();
  const { reviews, loading, addReview, respondToReview } = useReviews(restaurant?.id);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReview, setNewReview] = useState({
    platform: "uber_eats",
    rating: 5,
    text: "",
  });
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");

  const reviewStats = {
    average:
      reviews.length > 0
        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        : 0,
    total: reviews.length,
    positive: reviews.filter((r) => r.rating >= 4).length,
    negative: reviews.filter((r) => r.rating <= 2).length,
  };

  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
    percentage:
      reviews.length > 0
        ? (reviews.filter((r) => r.rating === stars).length / reviews.length) * 100
        : 0,
  }));

  const handleAdd = async () => {
    if (!newReview.text) return;
    const sentiment =
      newReview.rating >= 4 ? "positive" : newReview.rating <= 2 ? "negative" : "neutral";
    await addReview({ ...newReview, sentiment });
    setNewReview({ platform: "uber_eats", rating: 5, text: "" });
    setShowAddForm(false);
  };

  const handleRespond = async (id: string) => {
    if (!responseText) return;
    await respondToReview(id, responseText);
    setRespondingId(null);
    setResponseText("");
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-muted" />
          <div className="grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 rounded-lg border bg-card" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
          <p className="text-sm text-muted-foreground">
            Monitoriza e responde às avaliações dos teus clientes.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          + Review
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <h3 className="text-sm font-semibold mb-3">Nova Review</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <select
              value={newReview.platform}
              onChange={(e) => setNewReview({ ...newReview, platform: e.target.value })}
              className="flex h-10 rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="uber_eats">Uber Eats</option>
              <option value="glovo">Glovo</option>
              <option value="bolt_food">Bolt Food</option>
            </select>
            <select
              value={newReview.rating}
              onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
              className="flex h-10 rounded-md border bg-background px-3 py-2 text-sm"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} estrela{r > 1 ? "s" : ""}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Texto da review"
              value={newReview.text}
              onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
              className="flex h-10 rounded-md border bg-background px-3 py-2 text-sm col-span-2 md:col-span-1"
            />
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleAdd}
              disabled={!newReview.text}
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

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4 shadow-sm text-center">
          <div className="text-4xl font-bold text-primary">
            {reviewStats.average.toFixed(1)}
          </div>
          <div className="text-sm text-muted-foreground">de 5 estrelas</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm text-center">
          <div className="text-4xl font-bold">{reviewStats.total}</div>
          <div className="text-sm text-muted-foreground">avaliações</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm text-center">
          <div className="text-4xl font-bold text-green-600">
            {reviewStats.total > 0
              ? Math.round((reviewStats.positive / reviewStats.total) * 100)
              : 0}
            %
          </div>
          <div className="text-sm text-muted-foreground">4-5 estrelas</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm text-center">
          <div className="text-4xl font-bold text-red-600">
            {reviewStats.total > 0
              ? Math.round((reviewStats.negative / reviewStats.total) * 100)
              : 0}
            %
          </div>
          <div className="text-sm text-muted-foreground">1-2 estrelas</div>
        </div>
      </div>

      {/* Distribution */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="text-sm font-semibold mb-4">Distribuição</h3>
        <div className="space-y-2">
          {distribution.map((d) => (
            <div key={d.stars} className="flex items-center gap-3">
              <span className="w-8 text-sm text-right">{d.stars}★</span>
              <div className="flex-1 h-4 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-4 rounded-full bg-primary transition-all"
                  style={{ width: `${d.percentage}%` }}
                />
              </div>
              <span className="w-12 text-sm text-right text-muted-foreground">
                {d.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Avaliações</h3>
        {reviews.length === 0 ? (
          <div className="rounded-lg border bg-card p-6 text-center text-sm text-muted-foreground">
            Sem reviews ainda. Adiciona a primeira review acima.
          </div>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium capitalize">
                    {r.platform?.replace("_", " ")}
                  </span>
                  <span className="text-yellow-500">
                    {"★".repeat(r.rating)}
                    {"☆".repeat(5 - r.rating)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      r.sentiment === "positive"
                        ? "bg-green-100 text-green-800"
                        : r.sentiment === "negative"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {r.sentiment === "positive"
                      ? "Positivo"
                      : r.sentiment === "negative"
                        ? "Negativo"
                        : "Neutro"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(r.reviewed_at).toLocaleDateString("pt-PT")}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{r.text}</p>

              {r.responded && r.response_text && (
                <div className="mt-2 rounded-md bg-muted p-2 text-xs">
                  <span className="font-medium">Resposta:</span> {r.response_text}
                </div>
              )}

              {respondingId === r.id ? (
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="A tua resposta..."
                    className="flex-1 h-8 rounded border px-2 text-sm"
                  />
                  <button
                    onClick={() => handleRespond(r.id)}
                    className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground"
                  >
                    Enviar
                  </button>
                  <button
                    onClick={() => setRespondingId(null)}
                    className="inline-flex h-8 items-center justify-center rounded-md border px-3 text-xs font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                !r.responded && (
                  <button
                    onClick={() => setRespondingId(r.id)}
                    className="mt-2 text-xs text-primary hover:underline"
                  >
                    Responder
                  </button>
                )
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
