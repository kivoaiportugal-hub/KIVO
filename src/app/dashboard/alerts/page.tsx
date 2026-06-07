"use client";

import { useRestaurant, useAlerts } from "@/hooks/use-data";

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
  const { restaurant } = useRestaurant();
  const { alerts, loading, markAsRead } = useAlerts(restaurant?.id);

  const unreadCount = alerts.filter((a) => !a.read).length;
  const todayCount = alerts.filter(
    (a) => new Date(a.created_at).toDateString() === new Date().toDateString()
  ).length;

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-muted" />
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-lg border bg-card" />
            ))}
          </div>
        </div>
      </div>
    );
  }

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
          <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">Hoje</div>
          <div className="text-2xl font-bold">{todayCount}</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">Total</div>
          <div className="text-2xl font-bold">{alerts.length}</div>
        </div>
      </div>

      {/* Alerts List */}
      {alerts.length === 0 ? (
        <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
          Sem alertas. Tudo está a funcionar bem!
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-lg border-l-4 p-4 shadow-sm ${
                alertStyles[alert.type as keyof typeof alertStyles] || alertStyles.info
              } ${!alert.read ? "ring-1 ring-primary/20" : ""}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg">
                  {alertIcons[alert.type as keyof typeof alertIcons] || "ℹ️"}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{alert.title}</span>
                    {!alert.read && (
                      <span className="inline-flex h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                  {alert.message && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {alert.message}
                    </p>
                  )}
                  <div className="mt-2 text-xs text-muted-foreground">
                    {new Date(alert.created_at).toLocaleDateString("pt-PT", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                {!alert.read && (
                  <button
                    onClick={() => markAsRead(alert.id)}
                    className="text-xs text-primary hover:underline"
                  >
                    Marcar como lido
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
