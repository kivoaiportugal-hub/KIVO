"use client";

const activePromos = [
  {
    name: "10% no Burger (19h-21h)",
    platform: "Glovo",
    status: "active",
    startDate: "01/06",
    orders: 45,
    revenue: "€540",
    cost: "€54",
    roi: "900%",
  },
  {
    name: "Free Onion Rings + Burger",
    platform: "Uber Eats",
    status: "active",
    startDate: "05/06",
    orders: 28,
    revenue: "€336",
    cost: "€84",
    roi: "300%",
  },
];

const suggestedPromos = [
  {
    name: "15% em Pizzas (terças)",
    platform: "Todas",
    impact: "+€210/semana",
    confidence: 87,
    reason: "Terças têm 30% menos vendas — promoção pode aumentar tráfego",
  },
  {
    name: "Combo Família (4+ itens)",
    platform: "Bolt Food",
    impact: "+€350/semana",
    confidence: 78,
    reason: "Bolt Food tem mais pedidos de grupo — combo pode aumentar ticket",
  },
  {
    name: "Free Delivery (pedidos >€25)",
    platform: "Glovo",
    impact: "+€180/semana",
    confidence: 82,
    reason: "Aumenta ticket médio — clientes adicionam itens para atingir o mínimo",
  },
];

export default function PromotionsPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Promoções</h1>
          <p className="text-sm text-muted-foreground">
            Cria, gere e monitoriza as tuas promoções.
          </p>
        </div>
        <button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          + Nova Promoção
        </button>
      </div>

      {/* Active Promos */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Promoções Ativas</h3>
        {activePromos.length === 0 ? (
          <div className="rounded-lg border bg-card p-6 text-center text-sm text-muted-foreground">
            Sem promoções ativas.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {activePromos.map((p) => (
              <div key={p.name} className="rounded-lg border bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.platform} · desde {p.startDate}</div>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                    Ativa
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div>
                    <div className="font-bold text-lg">{p.orders}</div>
                    <div className="text-muted-foreground">Pedidos</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg">{p.revenue}</div>
                    <div className="text-muted-foreground">Receita</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg">{p.cost}</div>
                    <div className="text-muted-foreground">Custo</div>
                  </div>
                  <div>
                    <div className="font-bold text-lg text-green-600">{p.roi}</div>
                    <div className="text-muted-foreground">ROI</div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="inline-flex h-8 flex-1 items-center justify-center rounded-md border px-4 text-xs font-medium hover:bg-accent">
                    Pausar
                  </button>
                  <button className="inline-flex h-8 flex-1 items-center justify-center rounded-md border px-4 text-xs font-medium hover:bg-accent">
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Suggestions */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Sugestões da AI</h3>
        {suggestedPromos.map((s) => (
          <div key={s.name} className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium">{s.name}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.reason}</div>
                <div className="mt-2 flex gap-2">
                  <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs">
                    {s.platform}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                    {s.impact}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs">
                    {s.confidence}% confiança
                  </span>
                </div>
              </div>
              <button className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground hover:bg-primary/90">
                Criar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
