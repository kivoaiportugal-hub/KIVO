"use client";

interface Alert {
  id: string;
  type: "error" | "warning" | "success" | "info";
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface AlertsListProps {
  alerts: Alert[];
}

const alertIcons = {
  error: "⚠️",
  warning: "⚠️",
  success: "📈",
  info: "ℹ️",
};

const alertColors = {
  error: "text-red-500",
  warning: "text-yellow-500",
  success: "text-green-500",
  info: "text-blue-500",
};

export function AlertsList({ alerts }: AlertsListProps) {
  if (alerts.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-6 shadow-sm text-center text-sm text-muted-foreground">
        Sem alertas ativos.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="flex items-center gap-3 rounded-lg border bg-card p-3 text-sm shadow-sm"
        >
          <span className={alertColors[alert.type]}>{alertIcons[alert.type]}</span>
          <span className="flex-1">{alert.message}</span>
          {alert.action && (
            <button
              onClick={alert.action.onClick}
              className="text-xs text-primary hover:underline"
            >
              {alert.action.label}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
