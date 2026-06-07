"use client";

interface NextBestActionProps {
  title: string;
  description: string;
  impact: string;
  onApply?: () => void;
  onViewImpact?: () => void;
  onDismiss?: () => void;
}

export function NextBestAction({
  title,
  description,
  impact,
  onApply,
  onViewImpact,
  onDismiss,
}: NextBestActionProps) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm">
          🎯
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold">{title}</div>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          <div className="mt-2 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            Impacto estimado: {impact}
          </div>
        </div>
        <div className="flex gap-2">
          {onApply && (
            <button
              onClick={onApply}
              className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              Aplicar
            </button>
          )}
          {onViewImpact && (
            <button
              onClick={onViewImpact}
              className="inline-flex h-8 items-center justify-center rounded-md border px-4 text-xs font-medium hover:bg-accent"
            >
              Ver Impacto
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="inline-flex h-8 items-center justify-center rounded-md border px-4 text-xs font-medium hover:bg-accent"
            >
              Ignorar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
