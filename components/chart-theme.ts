// LOEI chart defaults for Recharts (and shadcn/ui <ChartContainer>).
// Colors are CSS variables, so light/dark switch automatically. The categorical order below was
// built only from brand hues and validated for color-vision deficiency + contrast in both modes — never reorder, cycle, or invent a 7th hue.

/** Categorical series colors, in fixed order. Series N always gets SERIES[N]. */
export const SERIES = [
  "var(--color-chart-1)", // aubergine
  "var(--color-chart-2)", // coral
  "var(--color-chart-3)", // teal
  "var(--color-chart-4)", // orange
  "var(--color-chart-5)", // navy
  "var(--color-chart-6)", // crimson
] as const;

/** Emphasise ONE series/bar (e.g. "this month"). Always add a direct label — yellow is low-contrast on white. */
export const HIGHLIGHT = "var(--color-chart-highlight)";

/** Sequential (magnitude, heatmaps): single hue, light → dark. */
export const SEQUENTIAL = [
  "var(--aubergine-100)",
  "var(--aubergine-200)",
  "var(--aubergine-500)",
  "var(--aubergine-700)",
  "var(--aubergine-900)",
] as const;

/** Diverging (above/below target): two poles + neutral midpoint. */
export const DIVERGING = ["var(--red-600)", "var(--red-300)", "var(--neutral-200)", "var(--blue-300)", "var(--blue-500)"] as const;

/** shadcn/ui ChartConfig helper: chartConfig({ website: "Website", retail: "Retail" }) */
export function chartConfig<T extends Record<string, string>>(labels: T) {
  return Object.fromEntries(
    Object.entries(labels).map(([key, label], i) => [key, { label, color: SERIES[i] }]),
  ) as { [K in keyof T]: { label: string; color: string } };
}

/** Spread onto Recharts primitives. */
export const axis = {
  stroke: "var(--color-chart-axis)",
  tick: { fill: "var(--color-text-muted)", fontSize: 12 },
  tickLine: false,
  axisLine: false,
} as const;
export const grid = { stroke: "var(--color-chart-grid)", vertical: false } as const;
export const bar = { radius: [4, 4, 0, 0] as [number, number, number, number], maxBarSize: 32 } as const;
export const line = { strokeWidth: 2, dot: false, activeDot: { r: 4, strokeWidth: 2, stroke: "var(--color-bg-surface)" } } as const;

/** Number formatting — Dutch locale by default. */
export const fmt = {
  eur: new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }),
  compact: new Intl.NumberFormat("nl-NL", { notation: "compact" }),
  pct: new Intl.NumberFormat("nl-NL", { style: "percent", maximumFractionDigits: 1 }),
};
