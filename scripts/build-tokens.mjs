#!/usr/bin/env node
// Builds tokens/tokens.json (W3C DTCG) and css/theme.css (Tailwind v4 + shadcn/ui)
// from tokens/figma-export.json. No dependencies.  Usage: node scripts/build-tokens.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = JSON.parse(readFileSync(join(root, "tokens/figma-export.json"), "utf8"));
const col = (n) => src.collections.find((c) => c.name === n);
const prim = Object.fromEntries(col("Primitives").vars.map((v) => [v.name, v.values.Value]));
const cssName = (n) => n.replace(/\//g, "-");

// ---------- tokens.json (DTCG) ----------
const dtcg = { $description: `LOEI design tokens — generated from ${src.source} on ${src.exported}. Do not edit by hand.` };
const set = (obj, path, val) => { const k = path.split("/"); let o = obj; for (const p of k.slice(0, -1)) o = o[p] ??= {}; o[k.at(-1)] = val; };
dtcg.primitive = {};
for (const [n, hex] of Object.entries(prim)) set(dtcg.primitive, n, { $type: "color", $value: hex });
for (const mode of ["Light", "Dark"]) {
  const m = (dtcg[mode.toLowerCase()] = {});
  for (const v of col("Color").vars) {
    const ref = v.values[mode];
    set(m, v.name, { $type: "color", $value: `{primitive.${ref.replace(/\//g, ".")}}`, ...(v.desc && { $description: v.desc }) });
  }
}
dtcg.dimension = {};
for (const v of col("Spacing").vars) set(dtcg.dimension, v.name, { $type: "dimension", $value: `${v.values.Value}px` });
const layoutCol = col("Layout");
if (layoutCol) { dtcg.layout = {}; for (const v of layoutCol.vars) set(dtcg.layout, v.name, { $type: v.name === "grid/columns" ? "number" : "dimension", $value: Object.fromEntries(Object.entries(v.values).map(([m, x]) => [m.toLowerCase(), v.name === "grid/columns" ? x : `${x}px`])) }); }
dtcg.typography = {};
for (const t of src.textStyles) set(dtcg.typography, t.name, { $type: "typography", $value: { fontFamily: `{font.${t.font}}`, fontWeight: t.weight, fontSize: `${t.size}px`, lineHeight: t.lineHeight, ...(t.italic && { fontStyle: "italic" }), ...(t.case && { textTransform: "uppercase" }) } });
dtcg.font = {
  display: { $type: "fontFamily", $value: ["Neue Haas Unica W1G", "Archivo", "system-ui", "sans-serif"] },
  body: { $type: "fontFamily", $value: ["Neue Haas Grotesk Display Pro", "Inter", "system-ui", "sans-serif"] },
  mono: { $type: "fontFamily", $value: ["JetBrains Mono", "ui-monospace", "monospace"] },
};
dtcg.shadow = Object.fromEntries(src.effectStyles.map((e) => [e.name.split("/")[1], { $type: "shadow", $value: e.css }]));
writeFileSync(join(root, "tokens/tokens.json"), JSON.stringify(dtcg, null, 2) + "\n");

// ---------- theme.css ----------
const sem = col("Color").vars;
const semVars = (mode) => sem.map((v) => `  --color-${cssName(v.name)}: var(--${cssName(v.values[mode])});`).join("\n");

// Short Tailwind utility names → semantic CSS variable (classes: bg-surface, text-fg-muted, border-line, …)
const utility = {
  canvas: "bg/canvas", surface: "bg/surface", "surface-raised": "bg/surface-raised", subtle: "bg/subtle", sand: "bg/sand",
  inverse: "bg/inverse", brand: "bg/brand", "brand-subtle": "bg/brand-subtle", aubergine: "bg/accent", "aubergine-subtle": "bg/accent-subtle",
  "success-subtle": "bg/success-subtle", "warning-subtle": "bg/warning-subtle", "danger-subtle": "bg/danger-subtle", "info-subtle": "bg/info-subtle",
  disabled: "bg/disabled", overlay: "bg/overlay", "static-white": "bg/static-white",
  field: "bg/field", "line-field": "border/field", "aubergine-selected": "bg/accent-selected",
  "primary-hover": "action/primary-hover", "secondary-hover": "action/secondary-hover", "ghost-hover": "action/ghost-hover", "destructive-hover": "action/danger-hover",
  fg: "text/primary", "fg-secondary": "text/secondary", "fg-muted": "text/muted", "fg-disabled": "text/disabled", "fg-inverse": "text/inverse",
  "on-brand": "text/on-brand", "on-aubergine": "text/on-accent", "on-secondary": "text/on-secondary", "fg-brand": "text/brand", "fg-accent": "text/accent",
  link: "text/link", success: "text/success", warning: "text/warning", danger: "text/danger", info: "text/info",
  icon: "icon/default", "icon-muted": "icon/muted", "icon-on-brand": "icon/on-brand", "icon-inverse": "icon/inverse", "icon-brand": "icon/brand",
  "line-subtle": "border/subtle", line: "border/default", "line-input": "border/input", "line-strong": "border/strong", focus: "border/focus", "line-brand": "border/brand", "line-danger": "border/danger",
  "chart-1": "chart/1", "chart-2": "chart/2", "chart-3": "chart/3", "chart-4": "chart/4", "chart-5": "chart/5", "chart-6": "chart/6",
  "chart-highlight": "chart/highlight", "chart-grid": "chart/grid", "chart-axis": "chart/axis",
};
// shadcn/ui contract → LOEI semantic tokens
const shadcn = {
  background: "bg/canvas", foreground: "text/primary", card: "bg/surface", "card-foreground": "text/primary",
  popover: "bg/surface-raised", "popover-foreground": "text/primary", primary: "action/primary", "primary-foreground": "text/on-brand",
  secondary: "action/secondary", "secondary-foreground": "text/on-secondary", muted: "bg/subtle", "muted-foreground": "text/muted",
  accent: "action/ghost-hover", "accent-foreground": "text/primary", destructive: "action/danger", "destructive-foreground": "text/on-accent",
  border: "border/subtle", input: "border/input", ring: "border/focus",
  sidebar: "bg/surface", "sidebar-foreground": "text/secondary", "sidebar-primary": "bg/accent", "sidebar-primary-foreground": "text/on-accent",
  "sidebar-accent": "bg/sand", "sidebar-accent-foreground": "text/primary", "sidebar-border": "border/subtle", "sidebar-ring": "border/focus",
};
const sp = col("Spacing").vars;
const px = (n) => `${n}px`;
const typeUtil = src.textStyles.map((t) => {
  const lh = t.lineHeight < 4 ? t.lineHeight : `${t.lineHeight}px`;
  const fam = { display: "var(--font-display)", body: "var(--font-sans)", mono: "var(--font-mono)" }[t.font];
  const extra = [t.italic && "  font-style: italic;", t.case && "  text-transform: uppercase;", t.tracking && `  letter-spacing: ${t.tracking}px;`, t.trackingEm && `  letter-spacing: ${t.trackingEm}em;`, t.font === "mono" && "  font-variant-numeric: tabular-nums;"].filter(Boolean).join("\n");
  return `@utility type-${cssName(t.name)} {\n  font-family: ${fam};\n  font-weight: ${t.weight};\n  font-size: ${px(t.size)};\n  line-height: ${lh};${extra ? "\n" + extra : ""}\n}`;
}).join("\n\n");

const css = `/* LOEI Design System — theme.css
 * GENERATED by scripts/build-tokens.mjs from tokens/figma-export.json — do not edit by hand.
 * Requires Tailwind CSS v4. Import once in your global stylesheet:
 *   @import "tailwindcss";
 *   @import "./loei/theme.css";
 * Dark mode: add class="dark" (or data-theme="dark") on <html>. Use next-themes in React apps.
 */

@custom-variant dark (&:where(.dark, .dark *, [data-theme="dark"], [data-theme="dark"] *));

/* ---------- Primitives (never use directly in components) ---------- */
:root {
${Object.entries(prim).map(([n, h]) => `  --${cssName(n)}: ${h};`).join("\n")}
}

/* ---------- Semantic tokens — names match Figma variable code syntax ---------- */
:root {
${semVars("Light")}

${sp.filter((v) => !v.name.startsWith("radius/")).map((v) => `  --${cssName(v.name)}: ${px(v.values.Value)};`).join("\n")}

${src.effectStyles.map((e) => `  --${cssName(e.name)}: ${e.css};`).join("\n")}

  /* shadcn/ui contract */
${Object.entries(shadcn).map(([k, v]) => `  --${k}: var(--color-${cssName(v)});`).join("\n")}
  --chart-1: var(--color-chart-1);
  --chart-2: var(--color-chart-2);
  --chart-3: var(--color-chart-3);
  --chart-4: var(--color-chart-4);
  --chart-5: var(--color-chart-5);
  --radius: 0.75rem;

  color-scheme: light;
}

.dark, [data-theme="dark"] {
${semVars("Dark")}
  --elevation-sm: 0 1px 2px rgb(0 0 0 / 0.4);
  --elevation-md: 0 4px 12px rgb(0 0 0 / 0.5), 0 1px 2px rgb(0 0 0 / 0.3);
  --elevation-lg: 0 16px 40px rgb(0 0 0 / 0.6), 0 2px 6px rgb(0 0 0 / 0.4);
  /* re-declare the shadcn contract so a nested .dark (e.g. a dark sidebar on a light page) also flips */
${Object.entries(shadcn).map(([k, v]) => `  --${k}: var(--color-${cssName(v)});`).join("\n")}
  color-scheme: dark;
}

/* ---------- Layout (mobile-first; tablet ≥768, desktop ≥1024) ---------- */
${(() => {
  if (!layoutCol) return "";
  const varName = (n) => n.startsWith("grid/") ? `--grid-${n.split("/")[1]}` : n.startsWith("container/") ? `--container-${n.split("/")[1]}` : `--${n.split("/")[1]}`;
  const val = (n, x) => n === "grid/columns" ? String(x) : `${x}px`;
  const responsive = layoutCol.vars.filter((v) => !v.name.startsWith("container/"));
  const block = (mode) => responsive.map((v) => `  ${varName(v.name)}: ${val(v.name, v.values[mode])};`).join("\n");
  return `:root {\n${block("Mobile")}\n}\n@media (min-width: 768px) {\n  :root {\n${block("Tablet").replace(/^/gm, "  ")}\n  }\n}\n@media (min-width: 1024px) {\n  :root {\n${block("Desktop").replace(/^/gm, "  ")}\n  }\n}\n`;
})()}
/* ---------- Tailwind theme ---------- */
@theme inline {
  /* fonts — brand fonts first; fallbacks load via @fontsource (see AGENTS.md) */
  --font-display: "Neue Haas Unica W1G", "Archivo", system-ui, sans-serif;
  --font-sans: "Neue Haas Grotesk Display Pro", "Inter Variable", "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono Variable", "JetBrains Mono", ui-monospace, monospace;

  /* LOEI utilities */
${Object.entries(utility).map(([k, v]) => `  --color-${k}: var(--color-${cssName(v)});`).join("\n")}

  /* shadcn/ui utilities */
${[...Object.keys(shadcn), "chart-1", "chart-2", "chart-3", "chart-4", "chart-5"].filter((k) => !k.startsWith("chart")).map((k) => `  --color-${k}: var(--${k});`).join("\n")}

  /* elevation (LOEI is flat at rest — shadows only for floating layers) */
  --shadow-sm: var(--elevation-sm);
  --shadow-md: var(--elevation-md);
  --shadow-lg: var(--elevation-lg);
  --animate-pop: loei-pop 180ms cubic-bezier(0.3, 1.6, 0.6, 1);
  --shadow-pop: var(--elevation-pop); /* playful hard 2px offset — checked controls, active segmented tab, ButtonBold */
}
/* radius (overrides Tailwind defaults: rounded-sm = 8px, rounded-md = 12px, …; rounded-full = pills) */
@theme {
${sp.filter((v) => v.name.startsWith("radius/") && !["radius/none", "radius/full"].includes(v.name)).map((v) => `  --${cssName(v.name)}: ${px(v.values.Value)};`).join("\n")}
}
/* content widths: max-w-narrow (720) · max-w-default (1200) · max-w-wide (1440) */
@theme {
${(layoutCol ? layoutCol.vars.filter((v) => v.name.startsWith("container/")) : []).map((v) => `  --container-${v.name.split("/")[1]}: ${v.values.Desktop / 16}rem;`).join("\n")}
}
/* Spacing: Tailwind's default 4px scale already equals LOEI space/* (p-4 = space/4 = 16px). */

/* ---------- Type styles: class="type-display-xl", "type-body-sm", … ---------- */
${typeUtil}

@keyframes loei-pop { from { transform: scale(0.4); opacity: 0; } to { transform: scale(1); opacity: 1; } }

@layer base {
  * { border-color: var(--color-border-subtle); }
  html { background: var(--color-bg-canvas); color: var(--color-text-primary); font-family: var(--font-sans); -webkit-font-smoothing: antialiased; }
  :focus-visible { outline: 2px solid var(--color-border-focus); outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }
}
`;
writeFileSync(join(root, "css/theme.css"), css);
console.log(`tokens.json + theme.css written (${Object.keys(prim).length} primitives, ${sem.length} semantic colors, ${src.textStyles.length} type styles)`);
