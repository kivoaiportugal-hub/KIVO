"use client";

const alerts = [
  {
    id: 1,
    type: "error",
    title: "Margem abaixo do mínimo",
    message: "Chicken Burger tem margem de 22% (mínimo: 25%)",
    time: "Há 2 horas",
    read: false,
  },
  {
    id: 2,
    type: "warning",
    title: "Avaliações negativas em aumento",
    message: "15% mais avaliações 1-2 estrelas esta semana",
    time: "Há 5 horas",
    read: false,
  },
  {
    id: 3,
    type: "success",
    title: "Bolt Food cresceu 20%",
    message: "Vendas Bolt Food +20% vs semana anterior",
    time: "Ontem",
    read: true,
  },
  {
    id: 4,
    type: "info",
    title: "Nova sugestão de preço",
    message: "Classic Burger pode subir para €12.90 (+€180/mês)",
    time: "Ontem",
    read: true,
  },
  {
    id: 5,
    type: "warning",
    title: "Pico de pedidos à porta",
    message: "19h-21h espera-se pico. Equipa atual: 3 pessoas",
    time: "Há 2 dias",
    read: true,
  },
];

const alertStyles = {
  error: "border-l-red-500 bg-red-50",
  warning: "border-l-yellow-500 bg-yellow-50",
  success: "border-l-green-500 bg-green-50",
  info: "border-l-blue-500 bg-blue-50",
};

const alertIcons = {
  error: "🔴",
  warning: "🟡",
  success: "🟢",
  info: "🔵",
};

export default function AlertsPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Alertas</h1>
        <p className="text-sm text-muted-foreground">
          Notificações e alertas importantes sobre o teu negócio.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">Não Lidos</div>
          <div className="text-2xl font-bold text-red-600">2</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">Esta Semana</div>
          <div className="text-2xl font-bold">5</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">Resolvidos</div>
          <div className="text-2xl font-bold text-green-600">12</div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`rounded-lg border-l-4 p-4 shadow-sm ${alertStyles[alert.type as keyof typeof alertStyles]} ${
              !alert.read ? "ring-1 ring-primary/20" : ""
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-lg">{alertIcons[alert.type as keyof typeof alertIcons]}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{alert.title}</span>
                  {!alert.read && (
                    <span className="inline-flex h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                <div className="mt-2 text-xs text-muted-foreground">{alert.time}</div>
              </div>
              <button className="text-xs text-primary hover:underline">Ver</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
