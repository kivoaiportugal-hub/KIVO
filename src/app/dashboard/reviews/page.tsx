"use client";

const reviewStats = {
  average: 4.2,
  total: 342,
  distribution: [
    { stars: 5, count: 156, percentage: 46 },
    { stars: 4, count: 103, percentage: 30 },
    { stars: 3, count: 45, percentage: 13 },
    { stars: 2, count: 24, percentage: 7 },
    { stars: 1, count: 14, percentage: 4 },
  ],
};

const recentReviews = [
  {
    id: 1,
    platform: "Uber Eats",
    rating: 5,
    text: "Excelente! Burger superiava tudo. Entrega rápida.",
    date: "Hoje",
    sentiment: "positive",
  },
  {
    id: 2,
    platform: "Glovo",
    rating: 2,
    text: "Demorou mais de 45 min. Burger chegou frio.",
    date: "Hoje",
    sentiment: "negative",
  },
  {
    id: 3,
    platform: "Bolt Food",
    rating: 4,
    text: "Bom mas pouco molho. Preço justo.",
    date: "Ontem",
    sentiment: "neutral",
  },
  {
    id: 4,
    platform: "Uber Eats",
    rating: 1,
    text: "Pedido errado. Faltavam as batatas.",
    date: "Ontem",
    sentiment: "negative",
  },
  {
    id: 5,
    platform: "Glovo",
    rating: 5,
    text: "O melhor burger da zona! Recomendo.",
    date: "2 dias",
    sentiment: "positive",
  },
];

const sentimentColors = {
  positive: "bg-green-100 text-green-800",
  neutral: "bg-yellow-100 text-yellow-800",
  negative: "bg-red-100 text-red-800",
};

export default function ReviewsPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
        <p className="text-sm text-muted-foreground">
          Monitoriza e responde às avaliações dos teus clientes.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4 shadow-sm text-center">
          <div className="text-4xl font-bold text-primary">{reviewStats.average}</div>
          <div className="text-sm text-muted-foreground">de 5 estrelas</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm text-center">
          <div className="text-4xl font-bold">{reviewStats.total}</div>
          <div className="text-sm text-muted-foreground">avaliações totais</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm text-center">
          <div className="text-4xl font-bold text-green-600">76%</div>
          <div className="text-sm text-muted-foreground">4-5 estrelas</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm text-center">
          <div className="text-4xl font-bold text-red-600">4%</div>
          <div className="text-sm text-muted-foreground">1 estrela</div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="text-sm font-semibold mb-4">Distribuição</h3>
        <div className="space-y-2">
          {reviewStats.distribution.map((d) => (
            <div key={d.stars} className="flex items-center gap-3">
              <span className="w-8 text-sm text-right">{d.stars}★</span>
              <div className="flex-1 h-4 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-4 rounded-full bg-primary"
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

      {/* AI Insight */}
      <div className="rounded-lg border-2 border-yellow-500/20 bg-yellow-500/5 p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-500 text-sm text-white">⚠️</div>
          <div>
            <div className="text-sm font-semibold text-yellow-600">Padrão Detetado</div>
            <p className="mt-1 text-sm text-muted-foreground">
              60% das avaliações negativas mencionam atraso na entrega. Considera otimizar o
              tempo de preparação entre 19h-21h.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Avaliações Recentes</h3>
        {recentReviews.map((r) => (
          <div key={r.id} className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{r.platform}</span>
                <span className="text-yellow-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${sentimentColors[r.sentiment as keyof typeof sentimentColors]}`}>
                  {r.sentiment === "positive" ? "Positivo" : r.sentiment === "negative" ? "Negativo" : "Neutro"}
                </span>
                <span className="text-xs text-muted-foreground">{r.date}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{r.text}</p>
            <div className="mt-2 flex gap-2">
              <button className="text-xs text-primary hover:underline">Responder</button>
              <button className="text-xs text-muted-foreground hover:underline">Ver detalhe</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
