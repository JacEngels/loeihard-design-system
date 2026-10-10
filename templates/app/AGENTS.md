# {{APP_NAME}} — instructions for coding agents

This app is built with the **LOEI design system**. It is included as a git submodule in `loei/`.

## Before you write any UI
1. **Read `loei/AGENTS.md` completely.** It is binding for all UI work: stack and libraries, tokens, components, layout and
   grid, brand rules, patterns and the definition of done.
2. **Never edit files inside `loei/`.** Every LOEI app shares them. If the design system is missing something, build it
   in this app from the LOEI tokens and list it under **"Design system gaps"** in your summary.
3. If `loei/` is empty, run `git submodule update --init`.
4. If this project isn't set up yet, follow `loei/AGENTS.md` §3 "Setup in a new project".

## About this app
<!-- Fill these in. They steer the layout choices in loei/AGENTS.md §7. -->
- **What it does:** …
- **Who uses it:** internal team / clients / public
- **Shell:** A · sidebar docked / B · sidebar floating / C · topbar / D · focus only
- **Main pages and pattern:** e.g. Dashboard (pattern 1), Projects (2 List), Project detail (3 Detail), Settings (5)
- **Language:** nl-NL

## App-specific rules
<!-- Anything here overrides loei/AGENTS.md, but only for the point it names. Keep it short. -->
- …

## Commands
- Dev: `npm run dev`
- Lint / types: `npm run lint` · `npx tsc --noEmit`
- Tests: `npm test`
- Update the design system: `git submodule update --remote loei` (then check `loei/CHANGELOG.md`)
