"use client";

const autopilotRules = [
  {
    id: 1,
    name: "Reagir a queda de vendas",
    condition: "Vendas caem >15% vs média",
    action: "Ativar promoção 10% no item afetado",
    status: "active",
    triggers: 12,
    lastTriggered: "Há 2 dias",
  },
  {
    id: 2,
    name: "Proteger margem",
    condition: "Margem <25% em qualquer item",
    action: "Notificar no WhatsApp + sugerir aumento",
    status: "active",
    triggers: 5,
    lastTriggered: "Há 5 dias",
  },
  {
    id: 3,
    name: "Responder avaliações negativas",
    condition: "Avaliação ≤2 estrelas",
    action: "Gerar resposta sugerida + alertar",
    status: "active",
    triggers: 8,
    lastTriggered: "Ontem",
  },
];

const availableRules = [
  {
    name: "Ajuste dinâmico de preços",
    description: "Ajusta preços automaticamente com base na procura e concorrência",
    plan: "autopilot",
  },
  {
    name: "Gestão automática de promoções",
    description: "Ativa/desativa promoções com base em performance e margem",
    plan: "autopilot",
  },
  {
    name: "Alerta de stock baixo",
    description: "Notifica quando um item está quase esgotado",
    plan: "grow",
  },
];

export default function AutopilotPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Autopilot</h1>
          <p className="text-sm text-muted-foreground">
            Define regras e a IA executa automaticamente para ti.
          </p>
        </div>
        <button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          + Nova Regra
        </button>
      </div>

      {/* Status */}
      <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            ⚙️
          </div>
          <div>
            <div className="font-semibold">Autopilot Ativo</div>
            <div className="text-sm text-muted-foreground">
              3 regras ativas · 25 triggers esta semana
            </div>
          </div>
        </div>
      </div>

      {/* Active Rules */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Regras Ativas</h3>
        {autopilotRules.map((rule) => (
          <div key={rule.id} className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">{rule.name}</div>
              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                Ativa
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
              <div>
                <span className="font-medium">SE:</span> {rule.condition}
              </div>
              <div>
                <span className="font-medium">ENTÃO:</span> {rule.action}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Triggers: {rule.triggers} · Último: {rule.lastTriggered}</span>
              <div className="flex gap-2">
                <button className="text-primary hover:underline">Editar</button>
                <button className="text-red-500 hover:underline">Desativar</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Available Rules */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Regras Disponíveis</h3>
        {availableRules.map((rule) => (
          <div key={rule.name} className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{rule.name}</div>
                <div className="text-sm text-muted-foreground mt-1">{rule.description}</div>
              </div>
              <button className="inline-flex h-8 items-center justify-center rounded-md border px-3 text-xs font-medium hover:bg-accent">
                Adicionar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
