// LOEI KPI tile. Figma: "Stat tile" (Trend=Up/Down/Neutral).
// A single headline number is not a chart — use this instead of a one-bar chart or gauge.
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Trend = "up" | "down" | "neutral";

const trendStyle: Record<Trend, { className: string; Icon: typeof TrendingUp; label: string }> = {
  up: { className: "bg-success-subtle text-success", Icon: TrendingUp, label: "Gestegen" },
  down: { className: "bg-danger-subtle text-danger", Icon: TrendingDown, label: "Gedaald" },
  neutral: { className: "bg-subtle text-fg-secondary", Icon: Minus, label: "Gelijk" },
};

export function StatTile({
  label,
  value,
  delta,
  trend = "neutral",
  comparison = "vs. vorige maand",
  className,
}: {
  label: string;
  value: string; // pre-formatted, e.g. new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" })
  delta?: string; // e.g. "+12,4%"
  trend?: Trend;
  comparison?: string;
  className?: string;
}) {
  const t = trendStyle[trend];
  return (
    <div className={cn("flex flex-col gap-2 rounded-md border border-line-subtle bg-surface p-5", className)}>
      <span className="type-label-md text-fg-secondary">{label}</span>
      <div className="flex items-center gap-3">
        <span className="type-heading-xl text-fg tabular-nums">{value}</span>
        {delta && (
          <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 type-label-sm", t.className)}>
            <t.Icon size={12} strokeWidth={1.25} absoluteStrokeWidth aria-hidden />
            <span className="sr-only">{t.label}: </span>
            {delta}
          </span>
        )}
      </div>
      {comparison && <span className="type-body-xs text-fg-muted">{comparison}</span>}
    </div>
  );
}
