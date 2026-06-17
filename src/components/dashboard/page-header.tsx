import * as React from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  actions,
  className
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6", className)}>
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  hint
}: {
  label: string;
  value: string | number;
  delta?: number;
  icon?: any;
  hint?: string;
}) {
  const isUp = (delta ?? 0) >= 0;
  return (
    <div className="relative overflow-hidden rounded-xl border bg-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </div>
          <div className="mt-2 font-display text-2xl font-semibold tracking-tight">
            {value}
          </div>
          {(delta !== undefined || hint) && (
            <div className="mt-2 flex items-center gap-1.5 text-xs">
              {delta !== undefined && (
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 font-medium",
                    isUp ? "text-success" : "text-destructive"
                  )}
                >
                  {isUp ? "↑" : "↓"} {Math.abs(delta)}%
                </span>
              )}
              {hint && <span className="text-muted-foreground">{hint}</span>}
            </div>
          )}
        </div>
        {Icon && (
          <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />
    </div>
  );
}
