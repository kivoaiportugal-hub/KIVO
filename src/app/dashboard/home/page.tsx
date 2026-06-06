export default function DashboardHomePage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Business Control Center
          </h1>
          <p className="text-sm text-muted-foreground">
            Visão geral do teu restaurante em tempo real.
          </p>
        </div>
      </div>

      {/* Top Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">
            Receita Hoje
          </div>
          <div className="text-2xl font-bold">€1,245</div>
          <div className="text-xs text-green-600">+12% vs ontem</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">
            Margem Estimada
          </div>
          <div className="text-2xl font-bold">34.2%</div>
          <div className="text-xs text-red-600">-2.1% vs ontem</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">
            Pedidos
          </div>
          <div className="text-2xl font-bold">89</div>
          <div className="text-xs text-green-600">+8% vs ontem</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">
            Ticket Médio
          </div>
          <div className="text-2xl font-bold">€14.01</div>
          <div className="text-xs text-green-600">+3.5% vs ontem</div>
        </div>
      </div>

      {/* AI Insight */}
      <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
            🧠
          </div>
          <div>
            <div className="text-sm font-semibold text-primary">AI Insight</div>
            <p className="mt-1 text-sm text-muted-foreground">
              As vendas caíram 8% esta semana devido à quebra de performance
              entre 19h–21h na Glovo. O principal fator é menor destaque do menu
              burger.
            </p>
          </div>
        </div>
      </div>

      {/* Next Best Action */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm">
            🎯
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold">Next Best Action</div>
            <p className="mt-1 text-sm text-muted-foreground">
              Ativar promoção de 10% no menu burger (19h–21h). Impacto estimado:
              +€120/semana.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground hover:bg-primary/90">
              Aplicar
            </button>
            <button className="inline-flex h-8 items-center justify-center rounded-md border px-4 text-xs font-medium hover:bg-accent">
              Ver Impacto
            </button>
            <button className="inline-flex h-8 items-center justify-center rounded-md border px-4 text-xs font-medium hover:bg-accent">
              Ignorar
            </button>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Alertas</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3 rounded-lg border bg-card p-3 text-sm shadow-sm">
            <span className="text-red-500">⚠️</span>
            <span className="flex-1">Chicken Burger perdeu 25% vendas</span>
            <button className="text-xs text-primary hover:underline">Ver</button>
          </div>
          <div className="flex items-center gap-3 rounded-lg border bg-card p-3 text-sm shadow-sm">
            <span className="text-yellow-500">⚠️</span>
            <span className="flex-1">
              Avaliações negativas aumentaram 15%
            </span>
            <button className="text-xs text-primary hover:underline">Ver</button>
          </div>
          <div className="flex items-center gap-3 rounded-lg border bg-card p-3 text-sm shadow-sm">
            <span className="text-green-500">📈</span>
            <span className="flex-1">Bolt Food +20% esta semana</span>
            <button className="text-xs text-primary hover:underline">Ver</button>
          </div>
        </div>
      </div>
    </div>
  );
}
