# Prompt: build a new app on the LOEI design system

Copy everything inside the block below into your agent (Claude Code, Codex, Cursor, …) in an empty folder or a fresh
repo. Replace the bits in [brackets].

```text
Build a new app on the LOEI design system.

The app
- Name: [App name]
- What it does: [one or two sentences]
- Who uses it: [internal team / clients / public]
- Main pages: [e.g. Dashboard, Projects, Project detail, Settings]
- Data: [real API at … / use realistic mock data for now]

Setup
1. Create a Next.js project (App Router, TypeScript, Tailwind, ESLint, src dir) and make sure it is a
   git repo, then add the design system:
   git submodule add https://github.com/JacEngels/loeihard-design-system.git loei
   bash loei/scripts/connect-app.sh "[App name]"
2. Read loei/AGENTS.md completely. It is binding for all UI.
3. Do the rest of the setup in loei/AGENTS.md §3 (shadcn init + components, packages, theme import,
   @loei/* alias, fonts, shadcn re-exports, ThemeProvider and Toaster).
4. Fill in "About this app" in the root AGENTS.md.

Plan first (stop and wait for my approval)
- Pick the shell (A–D) and explain why.
- For each page: route, page pattern (1–6), container width, and the components you'll use.
- Every library you'll add beyond loei/AGENTS.md §2, and why.

Build (after approval)
1. The shell and route structure from loei/AGENTS.md §7 "Layout & grid", with empty pages.
2. Pages one by one: PageHeader + pattern + real components, including loading, empty and error states.
3. Dutch UI copy and nl-NL formatting, unless I say otherwise.

Rules
- Use only LOEI tokens, components and layouts. No custom page skeletons, no raw colors.
- Never edit files in loei/. List missing pieces under "Design system gaps".
- Before you call anything done: light + dark mode, 375/834/1440px, and the loei/AGENTS.md §8 checklist.
```

## Why it's written this way
- **It plans before it builds.** You approve the shell, the page patterns and any extra libraries before code is written.
- **Shell first, then pages.** Every app gets the same skeleton, so LOEI apps feel like one family.
- **"Design system gaps"** tells you what to add to the shared system next, so later apps get it for free.
