"use client";

const forecastData = [
  { day: "Seg", actual: 85, predicted: 82 },
  { day: "Ter", actual: 62, predicted: 65 },
  { day: "Qua", actual: 78, predicted: 75 },
  { day: "Qui", actual: 91, predicted: 88 },
  { day: "Sex", actual: 120, predicted: 115 },
  { day: "Sáb", actual: null, predicted: 142 },
  { day: "Dom", actual: null, predicted: 95 },
];

const maxVal = Math.max(...forecastData.map((d) => Math.max(d.actual || 0, d.predicted)));

const insights = [
  {
    title: "Pico esperado sexta-feira",
    description: "Previsão de 142 pedidos. Considera reforçar a equipa entre 19h-21h.",
    type: "info",
  },
  {
    title: "Domingo mais fraco",
    description: "Queda de 33% vs sábado. Campanha de domingo pode ajudar.",
    type: "warning",
  },
  {
    title: "Tendência semanal: +8%",
    description: "Crescimento consistente. Se mantiveres, atinges €10k/mês.",
    type: "success",
  },
];

const typeStyles = {
  info: "border-primary/20 bg-primary/5",
  warning: "border-yellow-500/20 bg-yellow-500/5",
  success: "border-green-500/20 bg-green-500/5",
};

export default function ForecastsPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Forecast</h1>
        <p className="text-sm text-muted-foreground">
          Previsões de demanda baseadas em dados históricos e padrões.
        </p>
      </div>

      {/* Forecast Chart */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="text-sm font-semibold mb-4">Previsão 7 Dias</h3>
        <div className="flex items-end gap-3 h-48">
          {forecastData.map((d) => (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex w-full items-end gap-1" style={{ height: "140px" }}>
                {d.actual !== null && (
                  <div
                    className="flex-1 rounded-t bg-primary"
                    style={{ height: `${(d.actual / maxVal) * 100}%` }}
                  />
                )}
                <div
                  className="flex-1 rounded-t bg-primary/30 border border-primary/50 border-dashed"
                  style={{ height: `${(d.predicted / maxVal) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium">{d.day}</span>
              <span className="text-[10px] text-muted-foreground">
                {d.actual || d.predicted}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-primary" /> Real
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded border border-primary/50 border-dashed bg-primary/30" /> Previsto
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Insights AI</h3>
        {insights.map((insight) => (
          <div key={insight.title} className={`rounded-lg border p-4 ${typeStyles[insight.type as keyof typeof typeStyles]}`}>
            <div className="font-medium text-sm">{insight.title}</div>
            <div className="text-sm text-muted-foreground mt-1">{insight.description}</div>
          </div>
        ))}
      </div>

      {/* Weekly Summary */}
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="text-sm font-semibold mb-4">Resumo Semanal</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">651</div>
            <div className="text-xs text-muted-foreground">Pedidos previstos</div>
          </div>
          <div>
            <div className="text-2xl font-bold">€8,680</div>
            <div className="text-xs text-muted-foreground">Receita prevista</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">+8%</div>
            <div className="text-xs text-muted-foreground">vs semana anterior</div>
          </div>
        </div>
      </div>
    </div>
  );
}
