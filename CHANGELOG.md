# Changelog

Apps pick up changes with `git submodule update --remote loei`. Breaking changes include a **Migration** line.

## 0.3.1 — 2026-10-10
- Added `prompts/new-app.md` and `prompts/adopt-existing-app.md`: copy-paste agent prompts for starting a new app on LOEI
  and migrating an existing one.

## 0.3.0 — 2026-10-10
- Layout & grid: 4/8/12-column grid with responsive CSS variables (`--grid-*`, `--header-height`, `--aside-width`, …),
  container widths (`max-w-narrow|default|wide`), `components/layout.tsx` (Page, PageHeader, Grid, Split, MasterDetail,
  SettingsLayout, CardGrid, FocusLayout) and `components/app-shell.tsx` (shells A–C).
- Added `ButtonExpand`. **Removed `ButtonBold`.** Migration: replace it with `ButtonCTA` or `ButtonExpand`.
- Repo set up as a shared submodule: `templates/app/` + `scripts/connect-app.sh`.

## 0.2.0 — 2026-10-10
- Trimmed palette (66 → 54 primitives), brand-only chart palette, new tokens `bg-field`, `border-line-field`,
  `bg-aubergine-selected`, `shadow-pop`, `animate-pop`.
- Contact-form style fields, playful checkbox/radio/switch, three tab styles, icon stroke scale, sharper radius scale.

## 0.1.0 — 2026-10-10
- First version: tokens (light + dark), type scale, Tailwind v4 / shadcn theme, Button, ButtonCTA, StatTile, chart theme, AGENTS.md.
