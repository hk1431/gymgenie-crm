import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({ label, value, hint, icon, accent }: { label: string; value: string; hint?: string; icon?: ReactNode; accent?: boolean }) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl border border-border bg-card p-5", accent && "ring-1 ring-primary/30")}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
          <div className="mt-2 text-2xl font-bold sm:text-3xl">{value}</div>
          {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
        </div>
        {icon && <div className="rounded-lg bg-primary/10 p-2.5 text-primary">{icon}</div>}
      </div>
      {accent && <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <div className="h-3 w-20 animate-pulse rounded bg-muted/60" />
          <div className="h-8 w-24 animate-pulse rounded bg-muted/50" />
          <div className="h-3 w-28 animate-pulse rounded bg-muted/40" />
        </div>
        <div className="h-10 w-10 animate-pulse rounded-lg bg-muted/40" />
      </div>
    </div>
  );
}

export function EmptyState({ title, description, action, icon }: { title: string; description: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
      {icon && <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">{icon}</div>}
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
