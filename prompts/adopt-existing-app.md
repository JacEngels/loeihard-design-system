# Prompt: adopt the LOEI design system in an existing app

Copy everything inside the block below into your agent (Claude Code, Codex, Cursor, …) from the app's repo root.
Replace the bits in [brackets].

```text
This app needs to adopt the LOEI design system. Work in phases and do not change business logic, data
fetching or routes — only the UI layer.

Setup
1. If there is no `loei/` folder yet, run:
   git submodule add https://github.com/JacEngels/loeihard-design-system.git loei
   bash loei/scripts/connect-app.sh "[App name]"
   If AGENTS.md or CLAUDE.md already exist, merge the pointer to loei/AGENTS.md into them instead.
2. Read loei/AGENTS.md completely. It is binding for all UI.

Phase 1: audit (stop after this and wait for my approval)
- Inventory the current UI stack (framework, styling, component library, icons, charts, tables, forms)
  and compare it to loei/AGENTS.md §2. List every library that has to be replaced.
- List all pages, and for each the LOEI shell (A–D) and page pattern (1–6) it should use.
- List hard-coded colors, fonts, radii and shadows, and custom components that have a LOEI equivalent.
- Propose a migration plan in small, shippable steps, with the riskiest changes called out.

Phase 2: migrate (after approval, one step per commit)
1. Theme: connect loei/css/theme.css, the @loei/* alias and fonts (loei/AGENTS.md §3). Remove the old
   theme variables.
2. Shell: move the app into <AppShell> and give every page <Page> + <PageHeader> with the right pattern.
3. Components: replace buttons, fields, controls, tabs, tables, charts, toasts and dialogs with the
   LOEI/shadcn versions. Replace raw colors with tokens.
4. Remove libraries that are no longer used.

Rules
- Keep behavior identical: same routes, data, validation and permissions.
- Never edit files in loei/. If something is missing, build it in the app from LOEI tokens and list it
  under "Design system gaps".
- After each step, check light + dark mode at 375, 834 and 1440px, and run the loei/AGENTS.md §8 checklist.
- End every step with a short summary: what changed, what is left, gaps found.
```

## Why it's written this way
- **It stops for approval after the audit.** Library swaps (e.g. MUI → shadcn) are the risky part of a migration, so you
  get to see them before anything is rewritten.
- **Behavior stays identical.** The agent can't "improve" logic while restyling, which keeps each step easy to review.
- **"Design system gaps"** tells you what to add to the shared system next, so later apps get it for free.
