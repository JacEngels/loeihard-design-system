# LOEI Design System — instructions for coding agents

You are building UI for **Loeihard!** (LOEI). Every app, dashboard, and site we build uses this design system.
Follow this file over your own defaults. If something you need is not covered, pick the closest pattern here,
build it from the tokens, and mention the gap in your summary.

- **Figma (source of truth for design):** https://www.figma.com/design/gH8WCeLsjGhAZITd4BWukV/LOEI---Design-system
- **Tokens (source of truth for code):** `css/theme.css` (generated) and `tokens/tokens.json` (W3C DTCG)
- **Reference components:** `components/` (copy into the project)

---

## 1. Golden rules

1. **Never hard-code colors, radii, shadows or font sizes.** Use the Tailwind utilities from `theme.css`
   (`bg-surface`, `text-fg-muted`, `border-line-subtle`, `rounded-md`, `type-heading-md` …). No hex, no `bg-gray-*`,
   no `text-slate-*`, no arbitrary values like `bg-[#FBD504]`.
2. **Yellow is precious.** One yellow primary action per view (`<Button variant="primary">` or `<ButtonCTA>`).
   Everything else is ink (secondary), outline or ghost. Text on yellow is always ink (`text-on-brand`).
3. **Use shadcn/ui first.** Don't hand-roll a dialog, select, popover, tooltip, tabs, or menu. Install the
   shadcn component; our theme styles it automatically.
4. **Flat by default.** Cards have a 1px `border-line-subtle` and no shadow. Soft shadows (`shadow-md`/`shadow-lg`)
   only for floating layers: menus, popovers, toasts, dialogs, floating sidebar/header. The one playful exception is the
   hard 2px `shadow-pop`, which only goes on checked controls, and the active segmented tab.
5. **Every view handles 4 states:** loading (skeleton), empty (Empty state), error (Alert + retry), and success.
6. **Light and dark both work.** Never write `dark:` color overrides for semantic tokens. They switch automatically.
   Only use `dark:` for layout or imagery differences.
7. **Accessible by default.** Focus is always visible. Icon-only buttons have `aria-label`. Status is never shown
   by color alone (add an icon and text). Hit targets are at least 32px (40px on touch).
8. **Dutch first.** UI copy defaults to Dutch (nl-NL) unless the project says otherwise. Format numbers, money
   and dates with `Intl` / date-fns using `nl` (`€ 12.480`, `10 okt 2026`).

---

## 2. Stack & libraries — use these, not alternatives

| Need | Use | Don't use |
|---|---|---|
| Framework (apps with server) | **Next.js** (App Router, React 19, TypeScript) | CRA, Gatsby |
| Framework (internal SPA / tools) | **Vite + React + TypeScript** (+ TanStack Router or React Router) | — |
| Styling | **Tailwind CSS v4** + `theme.css` | CSS-in-JS (styled-components, Emotion), Sass, CSS modules for tokens |
| Components | **shadcn/ui** (Radix primitives) + `components/` from this repo | MUI, Chakra, Ant Design, Mantine, Bootstrap, Headless UI |
| Variants | **class-variance-authority** + `cn()` (clsx + tailwind-merge) | ad-hoc string concatenation |
| Icons | **lucide-react** (stroke 2, sizes 16/20/24) | Font Awesome, Heroicons, Material Icons, emoji as icons |
| Charts | **Recharts** via shadcn `chart` + `components/chart-theme.ts` | Chart.js, Highcharts, Nivo, ApexCharts. Ask before adding ECharts/visx for >10k points or maps |
| Tables / data grids | **TanStack Table v8** + shadcn `table` (data-table pattern) | AG Grid, MUI DataGrid, react-table v7 |
| Long lists | **TanStack Virtual** | react-window |
| Forms | **React Hook Form** + **Zod** + shadcn `form` | Formik, Yup |
| Data fetching / cache | **TanStack Query** (client) / Server Components + Server Actions (Next) | SWR + manual caches, Redux for server state |
| Client state | React state → **Zustand** if shared | Redux, MobX, Recoil |
| URL state (filters, tabs, pagination) | **nuqs** | hand-rolled `URLSearchParams` syncing |
| Motion / animation | **Motion** (`import { motion } from "motion/react"`) + Tailwind transitions | `framer-motion` import name, GSAP (ask first), Anime.js |
| Toasts | **Sonner** (shadcn `sonner`) | react-toastify, react-hot-toast |
| Command menu / search (⌘K) | **cmdk** (shadcn `command`) | — |
| Combobox / autocomplete | shadcn `popover` + `command` | react-select |
| Date picker | shadcn `calendar` (react-day-picker) + **date-fns** with `nl` locale | moment.js, dayjs, MUI pickers |
| Drag & drop / sortable | **dnd-kit** | react-beautiful-dnd (dead), react-dnd |
| Drawer / bottom sheet | shadcn `drawer` (Vaul) on mobile, `sheet` on desktop | — |
| Resizable panels | shadcn `resizable` (react-resizable-panels) | — |
| Rich text | **Tiptap** | Draft.js, Quill |
| File upload | **react-dropzone** styled with tokens | — |
| Theme switching | **next-themes** (`attribute="class"`) | custom localStorage logic |
| Fonts (fallbacks) | **@fontsource-variable/inter**, **@fontsource/archivo** (900 italic), **@fontsource-variable/jetbrains-mono** | Google Fonts `<link>` in apps |
| Utilities | native JS, `es-toolkit` if needed | lodash (full), jQuery |
| Testing | **Vitest** + Testing Library; **Playwright** for e2e | Enzyme, Jest (new projects) |

If a task needs a library not in this table, prefer the platform or a shadcn primitive. If you still need one,
choose a small, maintained, typed package and say why in your summary.

---

## 3. Setup in a new project

```bash
# Next.js app (or: npm create vite@latest -- --template react-ts)
npx create-next-app@latest my-app --ts --tailwind --eslint --app --src-dir
cd my-app
npx shadcn@latest init            # choose: neutral base color, CSS variables = yes
npx shadcn@latest add button input textarea select checkbox radio-group switch label form card badge avatar \
  tabs dialog alert-dialog sheet drawer dropdown-menu popover tooltip command table sonner skeleton separator \
  scroll-area calendar chart sidebar breadcrumb pagination
npm i lucide-react class-variance-authority motion next-themes nuqs @tanstack/react-table @tanstack/react-query \
  react-hook-form zod @hookform/resolvers date-fns recharts
npm i @fontsource-variable/inter @fontsource/archivo @fontsource-variable/jetbrains-mono
```

Then connect the design system. It lives in the app as a **git submodule at `loei/`** (see the repo README). Import
from it instead of copying, so design-system updates reach every app:

1. **Theme.** In `globals.css`, keep `@import "tailwindcss";` and add (adjust the relative path):
   ```css
   @import "../../loei/css/theme.css";
   @source "../../loei/components";
   ```
   **Delete the `:root`/`.dark` color blocks and the `@theme inline` block that `shadcn init` generated.** `theme.css`
   replaces them.
2. **Path alias.** In `tsconfig.json` → `compilerOptions.paths`, add `"@loei/*": ["./loei/components/*"]`
   (next to `"@/*"`). The LOEI components import `@/lib/utils` and `@/components/ui/sidebar` from the app itself.
3. **Fonts.** Import them once (e.g. in `layout.tsx`):
   `import "@fontsource-variable/inter"; import "@fontsource/archivo/900-italic.css"; import "@fontsource-variable/jetbrains-mono";`
   If the project has the licensed **Neue Haas** web fonts, add `@font-face` rules for `"Neue Haas Unica W1G"`
   (Black Italic, 900 italic) and `"Neue Haas Grotesk Display Pro"` (400/500/700). The font stacks pick them up automatically.
4. **Point shadcn at the LOEI versions.** Replace the content of these generated files with a one-line re-export, so other
   shadcn components keep working:
   `ui/button.tsx` → `export * from "@loei/button";` · `ui/input.tsx` → `export { Input } from "@loei/field";` ·
   `ui/textarea.tsx` → `export { Textarea } from "@loei/field";` · `ui/label.tsx` → `export { Label } from "@loei/field";` ·
   `ui/checkbox.tsx` → `export { Checkbox } from "@loei/controls";` · `ui/radio-group.tsx` → `export { RadioGroup, RadioGroupItem } from "@loei/controls";` ·
   `ui/switch.tsx` → `export { Switch } from "@loei/controls";` · `ui/tabs.tsx` → `export * from "@loei/tabs";`
   Everything else you import directly: `@loei/app-shell`, `@loei/layout`, `@loei/button-cta`, `@loei/button-expand`,
   `@loei/icon`, `@loei/stat-tile`, `@loei/chart-theme`. Build every app on `AppShell` + `Page` (see §7 Layout & grid).
   **Never edit files inside `loei/`.** Every LOEI app shares them. If something is missing, build it in the app from the
   tokens and report it as a design-system gap.
5. Wrap the app in `<ThemeProvider attribute="class" defaultTheme="system" enableSystem>` (next-themes) and add `<Toaster />` (sonner).

---

## 4. Tokens cheat-sheet (Tailwind classes)

**Backgrounds:** `bg-canvas` (page) · `bg-surface` (cards, inputs) · `bg-surface-raised` (menus, dialogs) ·
`bg-subtle` (hover rows, wells) · `bg-sand` (brand sand sections) · `bg-inverse` (ink blocks, tooltips) ·
`bg-brand` (yellow) · `bg-brand-subtle` · `bg-aubergine` · `bg-aubergine-subtle` (selected rows) ·
`bg-aubergine-selected` (selected rows) · `bg-field` (form fields) · `bg-success-subtle` `bg-warning-subtle`
`bg-danger-subtle` `bg-info-subtle` · `bg-overlay/60` (modal scrim)

**Actions (also via shadcn names):** `bg-primary` (yellow) + `hover:bg-primary-hover` · `bg-secondary` (ink) +
`hover:bg-secondary-hover` · `hover:bg-ghost-hover` · `bg-destructive` + `hover:bg-destructive-hover`

**Text:** `text-fg` · `text-fg-secondary` · `text-fg-muted` · `text-fg-disabled` · `text-fg-inverse` ·
`text-on-brand` (on yellow) · `text-on-aubergine` · `text-on-secondary` (on ink button) · `text-fg-brand`
(yellow eyebrow, darkened in light mode) · `text-fg-accent` · `text-link` · `text-success` `text-warning`
`text-danger` `text-info`

**Icons:** `text-icon` · `text-icon-muted` · `text-icon-brand` · `text-icon-on-brand` · `text-icon-inverse`

**Borders:** `border-line-subtle` (default card/divider) · `border-line` · `border-line-input` (form controls) ·
`border-line-strong` (outline buttons, controls) · `border-line-field` (field bottom border) · `border-line-brand` ·
`border-line-danger` · focus: `outline-focus` / `ring-ring`

**Charts:** `chart-1` … `chart-6` (aubergine, coral, teal, orange, navy, crimson), `chart-highlight` (yellow),
`chart-grid`, `chart-axis` (as `fill-*`, `stroke-*`, `bg-*`)

**Radius — sharp and purposeful:** `rounded-none` (form fields) · `rounded-xs` 4 (checkbox, menu items) ·
`rounded-sm` 8 (small elements: toasts, alerts, menus, tooltips, popovers) · `rounded-md` 12 (cards, tables, stat tiles) ·
`rounded-lg` 16 (big surfaces only: dialogs, sheets, floating sidebar/header) · `rounded-xl` 24 (marketing hero blocks) ·
`rounded-full` (buttons, chips, badges, avatars, switches)

**Spacing:** the standard Tailwind 4px scale (`p-4` = 16px). Use steps 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24.
Card padding `p-5`/`p-6`. Section gap `gap-6`/`gap-8`. Page gutter `px-6 md:px-8`. Marketing sections `py-24`.

**Elevation:** `shadow-sm` (hover lift) · `shadow-md` (menus, popovers, toasts, floating sidebar/header) ·
`shadow-lg` (dialogs, sheets) · `shadow-pop` (hard 2px ink offset, playful accents only) · `animate-pop` (scale-in for checkmarks)

**Icons:** always via `<Icon icon={X} size={16} />` from `components/icon.tsx`. Strokes thin out as icons shrink so they
keep the same weight: 12 → 1.25 · 16 → 1.5 · 20 → 1.75 · 24 → 2. Sizes: 12 badges/deltas, 16 buttons/inputs/menus/tables,
20 nav/alerts/large buttons, 24 standalone and empty states.

**Typography (use these classes instead of `text-xl font-bold`):**

| Class | Use for |
|---|---|
| `type-display-2xl` / `-xl` / `-lg` / `-md` / `-sm` | Brand headlines: Black Italic, UPPERCASE. Marketing heroes, section titles, empty-state titles |
| `type-heading-xl` / `-lg` / `-md` / `-sm` | App page titles, card titles, section headings |
| `type-body-lg` (marketing) · `type-body-md` (app default) · `type-body-sm` (dense UI, tables) · `type-body-xs` (captions) | Running text |
| `type-label-lg` / `-md` / `-sm` | Buttons, form labels, tabs, badges |
| `type-eyebrow` | Kicker above a display headline (with `text-fg-brand`) |
| `type-mono-md` / `-sm` | IDs, code, numbers in tables (tabular-nums) |

---

## 5. Brand rules (what makes it look like LOEI)

- **Small palette on purpose:** 3 brand ramps (ink/sand neutrals, yellow, aubergine) + 4 short status ramps. Don't
  reach for primitives. If a semantic token doesn't exist for the job, ask instead of inventing a color.
- **Palette roles:** yellow `#FBD504` = action and highlight. Ink `#161615` = text and secondary actions.
  Sand `#E5DED3` = warm section background. Aubergine `#2D1539` = accent blocks, chips, footer, active nav.
  Signature pairings: **ink + yellow** and **aubergine + yellow**.
- **Display headlines:** Black Italic, uppercase, tight leading. Highlight **one** word, either yellow
  (`text-fg-brand` on dark, `bg-brand` highlight) **or** outlined (`[-webkit-text-stroke:1.5px_currentColor] text-transparent`).
  Never both, never more than one word.
- **Eyebrow + headline + yellow dashes:** marketing sections start with an eyebrow, a display headline, and the dash
  ornament (one 40×5 bar plus three 16×5 bars in `bg-brand`, gap 6px).
- **Pills everywhere:** buttons, chips, badges and avatars are `rounded-full`. Containers use the radius scale above (cards 12, small elements 8).
  Form fields are the deliberate exception: square, like the loeihard.com contact form.
- **CTA pill with arrow circle** (`<ButtonCTA>`) is the signature action. Use at most one per section. The circle has an
  equal 6px inset on the top, right and bottom.
- **Button Expand** (`<ButtonExpand>`) is the expressive secondary CTA: an outlined pill with an ink arrow circle. On hover
  the circle floods out into a yellow fill and the arrow tilts to ↗. Pair it with a `ButtonCTA` (e.g. "Start gesprek" +
  "Bekijk ons werk") or use it for "explore / see more" moments. Not for form submits.
- **Playful controls:** checkbox, radio and switch have a 2px ink outline, turn yellow when on, show an ink mark, and get
  `shadow-pop`. Labels are 16px (`type-body-md`). Never restyle them back to thin grey defaults.
- **Chips:** aubergine chip with a yellow dot (`bg-aubergine text-on-aubergine` + dot `rounded-full bg-brand`)
  for services and categories. Outline chips for passive tags. Spacing: md `py-1.5 pl-3 pr-3.5 gap-2`, 8px dot, `type-label-md` ·
  sm `py-1 pl-2 pr-2.5 gap-1.5`, 6px dot, `type-label-sm`. The left side is slightly tighter to balance the dot.
- **Imagery:** case/portfolio cards use full-bleed images with a bottom ink gradient (`from-transparent to-inverse/85`)
  and white text. An ink badge sits top-right.
- **Slanted section edges** (marketing only): sections may end with a ~4° diagonal (`clip-path`). Never in app UI.
- **Logo:** use the supplied SVG. Ink on light backgrounds, white on dark or aubergine. Never yellow, never stretched,
  min height 32px.
- **Tone of voice:** direct, energetic, informal Dutch ("je", not "u"). Buttons are verbs ("Start gesprek",
  "Project opslaan"). No exclamation marks in app UI except the logo.

---

## 6. Components — Figma → code map

| Figma component | Code |
|---|---|
| Button (Primary/Secondary/Outline/Ghost/Danger × sm/md/lg) | `components/button.tsx` → `<Button variant size>` |
| Icon Button | `<Button size="icon-sm" \| "icon" \| "icon-lg" variant aria-label>` |
| Button CTA (Yellow/Ink/Outline × Right/Down) | `<ButtonCTA tone arrow>` |
| Button Expand (Light/Dark × Default/Hover) | `<ButtonExpand>` (`components/button-expand.tsx`) |
| Link arrow | `<a className="group inline-flex items-center gap-1 type-label-md text-link hover:underline">Lees meer <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5"/></a>` |
| Input / Textarea / Select | `components/field.tsx` (contact-form style: `bg-field`, square, 2px `border-line-field` bottom; hover → `border-line-input`, focus → `border-line-strong`, `aria-invalid` → `border-line-danger`). 52px default, 40px `fieldSize="sm"` in toolbars. `SelectTrigger`: `cn(fieldClasses, fieldSizes.md, "justify-between")` |
| Form field | shadcn `FormField` + `FormItem` + `FormLabel` (bold `type-label-field`, above the field) + `FormControl` + `FormDescription`/`FormMessage` (`FieldHint`) |
| Checkbox / Radio / Switch | `components/controls.tsx` (22px, 2px ink outline, yellow when on, ink mark, `shadow-pop`; switch 48×28 with an ink knob that shows a yellow check when on) |
| Chip | `<span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 type-label-md …">` (Accent/Outline/Brand/Subtle) |
| Badge (Neutral/Ink/Brand/Accent/Success/Warning/Danger/Info) | shadcn `Badge` with variants → `bg-{tone}-subtle text-{tone}`, `rounded-full px-2 py-0.5 type-label-sm` |
| Avatar | shadcn `Avatar` + `AvatarFallback className="bg-aubergine text-on-aubergine"` |
| Tab (Underline / Segmented / Display) | `components/tabs.tsx` → `<Tabs variant="underline">` for page sections (yellow slanted dash), `"segmented"` for view switches and filters (sand track, active = ink outline + pop), `"display"` for marketing/service nav (outlined Black Italic, active solid + yellow arrow circle) |
| Nav item / Sidebar | shadcn `Sidebar`. Active item = `bg-sand text-fg font-semibold` with the icon in `text-icon` (`sidebar-accent` maps to sand). Variants: **docked** (full height, `border-r`), **floating** (`variant="floating"`: inset 12px, `rounded-lg border shadow-md`). Dark theme: wrap the sidebar in `className="dark"` so it renders ink while the page stays light |
| App header | 64px bar: title (`type-heading-md`), search (`fieldSize="sm"`, opens ⌘K), notifications, avatar menu. **Docked** = full width + `border-b`. **Floating** = `m-3 rounded-lg border border-line-subtle bg-surface shadow-md`, pairs with the floating sidebar |
| Card | shadcn `Card`: `rounded-md border-line-subtle bg-surface p-6`, no shadow |
| Stat tile | `components/stat-tile.tsx` |
| Case card | image card, 3:4, bottom gradient, ink badge |
| Empty state | yellow 64px icon circle, `type-display-sm` title, one sentence, one `<ButtonCTA>` |
| Alert | shadcn `Alert`: `bg-{tone}-subtle`, icon + title in `text-{tone}`, `rounded-sm` |
| Toast | Sonner: `toast.success()`, `toast.error()`. `bg-surface-raised shadow-md rounded-sm` |
| Tooltip | shadcn `Tooltip`: `bg-inverse text-fg-inverse type-body-xs rounded-sm` |
| Menu | shadcn `DropdownMenu`: `bg-surface-raised shadow-md rounded-sm p-1`, items `rounded-xs h-9` |
| Dialog | shadcn `Dialog` / `AlertDialog` (for destructive confirms): `rounded-lg shadow-lg`, scrim `bg-overlay/60` |
| Table | TanStack Table + shadcn `Table` (see §7) |
| Page header (Default / With tabs / Detail) | `<PageHeader title description breadcrumb actions tabs status backHref>` (`components/layout.tsx`) |
| Sidebar (Docked / Floating / Rail × Light / Dark) · App header (Docked / Floating) · Topbar · Mobile header | `<AppShell shell sidebarStyle darkSidebar>` (`components/app-shell.tsx`) |

---

## 7. Patterns

### Layout & grid — every app uses this structure
Figma: page **Layout & Grid** (grid spec, shells, patterns, and 8 full templates). Code: `components/app-shell.tsx` +
`components/layout.tsx`. Never invent a new page skeleton; compose it from these parts.

**1 · Grid** (the `theme.css` variables change per breakpoint automatically)

| | Mobile <768 | Tablet 768–1023 | Desktop ≥1024 |
|---|---|---|---|
| Columns | 4 | 8 | 12 |
| Gutter `--grid-gutter` | 16 | 24 | 24 |
| Page margin `--grid-margin` | 16 | 24 | 32 |
| Header `--header-height` | 56 | 64 | 64 |
| Sidebar | sheet (menu button) | 72px icon rail | 256px |
| Aside `--aside-width` | stacks below | stacks below | 320px |
| Page padding-y / section gap | 24 | 32 | 32 |

Use `<Grid>` + `<GridItem span={{ base, md, lg }}>` for anything that isn't a single column. Common spans:
stat tile `{base:4, md:4, lg:3}` · chart `{lg:8}` + side card `{lg:4}` · half `{md:4, lg:6}` · full width (default).
Spacing between cards = gutter (`gap-[var(--grid-gutter)]`), between page sections = `--section-gap`.

**2 · Content width:** `<Page width>`: `narrow` 720 (forms, settings, articles, wizards) · `default` 1200 (most pages) ·
`wide` 1440 (dashboards, big tables) · `full` (boards, maps, editors). Header, sidebar and background are always full width.

**3 · Shell (one per app):**
- **A · Sidebar docked** (`<AppShell sidebarStyle="docked">`): internal tools and dashboards, 5+ sections.
- **B · Sidebar floating** (`sidebarStyle="floating"`): client-facing apps. Sidebar and header float 12px from the edges.
- **C · Topbar** (`shell="topbar"`): ≤5 sections, client portals, simple tools. Nav links in the header, content centered.
- **D · Focus** (`<FocusLayout>`): no navigation. Sign-in, onboarding, wizards, checkout.
- Optional `darkSidebar` gives an ink sidebar on a light page.

**4 · Page = Page header + one pattern:**
1. **Dashboard** (`wide`): stat tiles → charts → table. Filters in one row above the charts.
2. **List** (`default`/`wide`): `PageHeader` (optionally with tabs) → table or `CardGrid`.
3. **Detail** (`default`): `PageHeader` with `backHref` + `status` → `<Split aside={…}>` (main + 320 aside for meta, team, activity).
4. **Master–detail** (`full`): `<MasterDetail list={…}>`. Inbox, CRM, tickets; one pane at a time under 1024.
5. **Settings** (`default`): `<SettingsLayout nav={…}>` with section nav 220 + form column 720, and a save bar at the bottom.
6. **Card grid** (`default`): `<CardGrid>`, 1 → 2 → 3 → 4 columns.

**5 · Route structure (Next.js App Router)**
```
app/
  (app)/layout.tsx        → <AppShell …>{children}</AppShell>   (shell A, B or C)
  (app)/page.tsx          → <Page width="wide"><PageHeader title="Dashboard"/>…</Page>
  (app)/projects/page.tsx → <Page><PageHeader …/><DataTable …/></Page>
  (app)/projects/[id]/page.tsx → <Page><PageHeader backHref="/projects" …/><Split aside={…}>…</Split></Page>
  (app)/settings/page.tsx → <Page><PageHeader title="Instellingen"/><SettingsLayout nav={…}>…</SettingsLayout></Page>
  (focus)/layout.tsx      → <FocusLayout logo={…} exit={…}>   (onboarding, wizards)
  (auth)/sign-in/page.tsx → FocusLayout as well
```
Vite/React Router apps use the same split: one layout route with `AppShell`, one with `FocusLayout`.

**Page header rules:** title `type-heading-xl` (one per page, it is the `<h1>`), one-line description, breadcrumb only
when the page is ≥2 levels deep, max one primary action top-right (others outline/ghost or in a `…` menu). Sub-sections
use underline tabs inside the page header.

**Form fields need a white surface.** `bg-field` is the same warm off-white as `bg-canvas`, so put forms inside a `Card`
(or the `FocusLayout` card), never directly on the page background.

### Forms
Label above the field, always visible (never placeholder-as-label). Helper text `type-body-xs text-fg-muted`. Errors in
`text-danger`, shown on blur or submit. Group related fields in Cards. Submit button at the bottom-right (or full-width on
mobile) and disabled while submitting (use the `loading` spinner from lucide `Loader2 animate-spin`). Validate with Zod and
share the schema between client and server.

### Tables
- Toolbar: title, search input (`h-8`, search icon), filter (outline button), primary or export action (secondary button).
- Container: `rounded-md border border-line-subtle bg-surface overflow-hidden`.
- Header: `bg-aubergine-subtle type-label-sm font-semibold text-fg-accent`, sortable columns show `ChevronsUpDown` in `text-fg-accent`.
- Rows: 48px, `border-b border-line-subtle`, `hover:bg-aubergine-subtle`, selected rows
  (`data-[state=selected]`) get `bg-aubergine-selected`. Don't use `bg-subtle`/`bg-muted` in tables.
- Numbers: right-aligned, `type-mono-md tabular-nums`. Status: Badge. Row actions: ghost icon button with `MoreHorizontal` → DropdownMenu.
- Footer: selection count + pagination (outline icon buttons). Keep URL state (page, sort, filters) in `nuqs`.
- Empty: Empty state inside the table body. Loading: 5 skeleton rows.

### Charts (Recharts) — rules
1. **Pick the form first.** One number → `StatTile`, not a chart. Change over time → line or area. Comparing categories →
   bar (horizontal if labels are long). Part-of-whole with ≤ 5 parts → stacked bar. **Avoid** pie/donut with more than 3 slices, gauges and 3D.
2. **Colors:** `SERIES` from `chart-theme.ts`, in order (aubergine, coral, teal, orange, navy, crimson: all brand hues,
   CVD-validated in light and dark). Series N always gets the same color, even when filters hide
   others. Max 6 series; fold the rest into "Overig". Use `HIGHLIGHT` (yellow) only to emphasise one series or bar, with a direct label.
3. **Never use a dual y-axis.** Two measures → two charts.
4. **Marks:** bars max 32px with a 4px rounded top and a 2px gap; lines 2px, no dots (active dot on hover); gridlines
   horizontal only, `chart-grid`; axes without lines and with muted 12px ticks.
5. **Labels and legend:** a legend is required for ≥ 2 series. Direct-label up to 4 series. Text uses text tokens, never the series color.
6. **Interaction:** tooltip on hover (shadcn `ChartTooltip`); line/area charts get a crosshair.
7. **Accessibility:** give every chart an `aria-label` summary and offer a table view ("Toon als tabel").
   Status colors (success/danger) are **not** series colors.

### Loading, empty, error
- Loading: shadcn `Skeleton` that matches the final layout. No spinners for whole pages.
- Empty: Empty state component (icon circle, title, sentence, CTA).
- Error: `Alert variant="danger"` with a "Opnieuw proberen" button. Toast only for errors from a user's own action.

### Motion
Use 150–200ms `ease-out` for hover and press, and 200–300ms for enter/exit (dialogs, sheets). Use Motion for layout or
list animations only. Arrows nudge 2px right on hover. Respect `prefers-reduced-motion` (handled globally in `theme.css`).
No bouncy springs in app UI.

### Responsive
Mobile first. Breakpoints are the Tailwind defaults (sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536). The shell handles
navigation per breakpoint (sheet → rail → sidebar). Inside pages: grids collapse via `GridItem` spans, the aside stacks
under the main column, tables scroll horizontally inside their card (`overflow-x-auto`) or collapse to cards, page-header
actions wrap below the title, the primary action becomes full-width at the bottom on mobile, and dialogs become a `Drawer`.

---

## 8. Definition of done (check before you finish)

- [ ] No raw hex, `gray-*`/`slate-*`/`zinc-*` classes or arbitrary color values (`grep -rE "#[0-9a-fA-F]{3,6}|(gray|slate|zinc|neutral)-[0-9]" src`)
- [ ] Looks right in light **and** dark mode
- [ ] At most one yellow primary action per view
- [ ] Loading, empty and error states exist
- [ ] Keyboard: everything is reachable and the focus ring is visible. Icon buttons have `aria-label`s
- [ ] Text contrast is ≥ 4.5:1 (the tokens guarantee this, as long as you don't put `text-fg-muted` on `bg-sand`)
- [ ] Copy is in Dutch, numbers and dates use `nl-NL`
- [ ] Uses `AppShell` + `Page` + `PageHeader` + one page pattern (no custom page skeletons)
- [ ] Works at 375px, 834px and 1440px widths

---

## 9. Keeping in sync with Figma

Figma variables use the same names as the CSS variables (`bg/surface` ↔ `--color-bg-surface`, code syntax is set in
Figma Dev Mode). To update tokens: re-export variables from Figma into `tokens/figma-export.json`, then run
`node scripts/build-tokens.mjs`. Never edit `css/theme.css` or `tokens/tokens.json` by hand.

---

## 10. Working on this repo (design-system maintainers only)

These instructions apply when you're editing **this** repository, not an app that uses it.
- `css/theme.css` and `tokens/tokens.json` are generated. Edit `tokens/figma-export.json` (exported from the Figma variables),
  then run `node scripts/build-tokens.mjs`. Keep names identical to the Figma variable names / code syntax.
- Components in `components/` must use tokens only, type-check against React 19 + the listed Radix packages, and match
  their Figma component (name, variants, states). Update §6 when you add one.
- Every change ships to every app on its next `git submodule update --remote loei`. Treat renames and removals as
  breaking: note them in `CHANGELOG.md` with a migration line.

