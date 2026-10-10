// LOEI layout primitives — the body of every page. Figma: "Layout & Grid" page (patterns 1–6, templates).
// Grid: 4 cols (<768) · 8 cols (768–1023) · 12 cols (≥1024). Gutter/margin/padding come from CSS variables in
// theme.css (--grid-gutter, --grid-margin, --page-padding-y, --section-gap), so they change per breakpoint automatically.
//
//   <Page width="wide">                      ← container: narrow 720 · default 1200 · wide 1440 · full
//     <PageHeader title="Dashboard" … />
//     <Grid>
//       <GridItem span={{ base: 4, md: 4, lg: 3 }}>…</GridItem>
//     </Grid>
//   </Page>
import * as React from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------- Page container ---------- */
const widths = { narrow: "max-w-narrow", default: "max-w-default", wide: "max-w-wide", full: "max-w-none" } as const;
export type PageWidth = keyof typeof widths;

export function Page({ width = "default", className, children }: { width?: PageWidth; className?: string; children: React.ReactNode }) {
  return (
    <main className="px-[var(--grid-margin)] py-[var(--page-padding-y)]">
      <div className={cn("mx-auto flex w-full flex-col gap-[var(--section-gap)]", widths[width], className)}>{children}</div>
    </main>
  );
}

/* ---------- Page header ---------- */
export function PageHeader({
  title,
  description,
  breadcrumb,
  actions,
  status,
  backHref,
  tabs,
}: {
  title: string;
  description?: React.ReactNode;
  breadcrumb?: React.ReactNode; // e.g. <Breadcrumb> from shadcn
  actions?: React.ReactNode; // max ONE primary button; secondary actions as outline/ghost
  status?: React.ReactNode; // e.g. <Badge> next to the title (detail pages)
  backHref?: string;
  tabs?: React.ReactNode; // <Tabs variant="underline"> list for sub-sections
}) {
  return (
    <header className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          {breadcrumb && <div className="type-body-sm text-fg-muted">{breadcrumb}</div>}
          <div className="flex items-center gap-3">
            {backHref && (
              <a href={backHref} aria-label="Terug"
                className="grid size-8 shrink-0 place-items-center rounded-full border border-line-strong hover:bg-ghost-hover">
                <ArrowLeft size={16} strokeWidth={1.5} absoluteStrokeWidth />
              </a>
            )}
            <h1 className="truncate type-heading-xl text-fg">{title}</h1>
            {status}
          </div>
          {description && <p className="type-body-md text-fg-secondary">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {tabs}
    </header>
  );
}

/* ---------- 12-column grid ---------- */
export function Grid({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("grid grid-cols-4 gap-[var(--grid-gutter)] md:grid-cols-8 lg:grid-cols-12", className)}>{children}</div>;
}

// Literal class lists so Tailwind can see every class.
const SPAN_BASE = ["col-span-1", "col-span-2", "col-span-3", "col-span-4"];
const SPAN_MD = ["md:col-span-1", "md:col-span-2", "md:col-span-3", "md:col-span-4", "md:col-span-5", "md:col-span-6", "md:col-span-7", "md:col-span-8"];
const SPAN_LG = ["lg:col-span-1", "lg:col-span-2", "lg:col-span-3", "lg:col-span-4", "lg:col-span-5", "lg:col-span-6",
  "lg:col-span-7", "lg:col-span-8", "lg:col-span-9", "lg:col-span-10", "lg:col-span-11", "lg:col-span-12"];

/** span: columns per breakpoint. Defaults to full width everywhere. e.g. stat tile = { base: 4, md: 4, lg: 3 } */
export function GridItem({ span = {}, className, children }: {
  span?: { base?: 1 | 2 | 3 | 4; md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8; lg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 };
  className?: string;
  children: React.ReactNode;
}) {
  const { base = 4, md = 8, lg = 12 } = span;
  return <div className={cn(SPAN_BASE[base - 1], SPAN_MD[md - 1], SPAN_LG[lg - 1], "min-w-0", className)}>{children}</div>;
}

/* ---------- Page patterns ---------- */

/** Pattern 3 — Detail: main column + 320px aside (stacks below the main column under 1024px). */
export function Split({ aside, children, className }: { aside: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("grid items-start gap-[var(--grid-gutter)] lg:grid-cols-[minmax(0,1fr)_var(--aside-width)]", className)}>
      <div className="flex min-w-0 flex-col gap-[var(--grid-gutter)]">{children}</div>
      <aside className="flex flex-col gap-[var(--grid-gutter)]">{aside}</aside>
    </div>
  );
}

/** Pattern 4 — Master–detail: 360px list pane + detail pane, full height. Under 1024px show one at a time (showDetail). */
export function MasterDetail({ list, children, showDetail = false }: { list: React.ReactNode; children: React.ReactNode; showDetail?: boolean }) {
  return (
    <div className="grid h-[calc(100dvh-var(--header-height))] lg:grid-cols-[360px_minmax(0,1fr)]">
      <div className={cn("min-h-0 overflow-y-auto border-r border-line-subtle bg-surface", showDetail && "hidden lg:block")}>{list}</div>
      <div className={cn("min-h-0 overflow-y-auto", !showDetail && "hidden lg:block")}>{children}</div>
    </div>
  );
}

/** Pattern 5 — Settings: section nav (220) + narrow form column (720). Nav becomes a horizontal scroller on mobile. */
export function SettingsLayout({ nav, children }: { nav: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,720px)] lg:gap-12">
      <nav className="-mx-[var(--grid-margin)] flex gap-1 overflow-x-auto px-[var(--grid-margin)] lg:mx-0 lg:flex-col lg:px-0">{nav}</nav>
      <div className="flex min-w-0 flex-col gap-6">{children}</div>
    </div>
  );
}

/** Pattern 6 — Card grid: 1 → 2 → 3 → 4 columns. */
export function CardGrid({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("grid gap-[var(--grid-gutter)] sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4", className)}>{children}</div>;
}

/** Section inside a page: optional heading row + content. */
export function Section({ title, actions, children, className }: { title?: string; actions?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("flex flex-col gap-4", className)}>
      {(title || actions) && (
        <div className="flex items-center justify-between gap-4">
          {title && <h2 className="type-heading-md text-fg">{title}</h2>}
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

/** Shell D — Focus: no navigation. Logo top-left, exit top-right, one narrow column on a surface card. */
export function FocusLayout({ logo, exit, children }: { logo: React.ReactNode; exit?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-canvas px-[var(--grid-margin)] pb-16">
      <header className="flex h-[var(--header-height)] items-center justify-between">{logo}{exit}</header>
      <main className="mx-auto mt-6 w-full max-w-[640px] rounded-lg border border-line-subtle bg-surface p-6 md:mt-10 md:p-10">{children}</main>
    </div>
  );
}
