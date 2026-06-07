"use client";

interface AIInsightProps {
  title?: string;
  message: string;
  type?: "info" | "warning" | "success";
}

export function AIInsight({
  title = "AI Insight",
  message,
  type = "info",
}: AIInsightProps) {
  const typeStyles = {
    info: "border-primary/20 bg-primary/5",
    warning: "border-yellow-500/20 bg-yellow-500/5",
    success: "border-green-500/20 bg-green-500/5",
  };

  const iconBg = {
    info: "bg-primary text-primary-foreground",
    warning: "bg-yellow-500 text-white",
    success: "bg-green-500 text-white",
  };

  return (
    <div className={`rounded-lg border-2 p-6 ${typeStyles[type]}`}>
      <div className="flex items-start gap-3">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ${iconBg[type]}`}
        >
          🧠
        </div>
        <div>
          <div
            className={`text-sm font-semibold ${
              type === "info"
                ? "text-primary"
                : type === "warning"
                  ? "text-yellow-600"
                  : "text-green-600"
            }`}
          >
            {title}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
}
