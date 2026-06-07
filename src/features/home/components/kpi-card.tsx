"use client";

interface KPICardProps {
  label: string;
  value: string;
  change?: number;
  icon?: string;
}

export function KPICard({ label, value, change, icon }: KPICardProps) {
  const isPositive = change !== undefined && change >= 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-muted-foreground">{label}</div>
        {icon && <span className="text-lg">{icon}</span>}
      </div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
      {change !== undefined && (
        <div
          className={`mt-1 text-xs font-medium ${
            isPositive ? "text-green-600" : isNegative ? "text-red-600" : "text-muted-foreground"
          }`}
        >
          {isPositive ? "+" : ""}
          {change}% vs ontem
        </div>
      )}
    </div>
  );
}
