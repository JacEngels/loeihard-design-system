# loei-ds — LOEI Design System (code side)

One design system for every app, dashboard and site Loeihard! builds, by hand or with coding agents.

| Path | What it is |
|---|---|
| `AGENTS.md` | **Instructions for coding agents** (Claude Code, Cursor, Codex, Copilot, Gemini…): stack, library choices, tokens, brand rules, patterns, definition of done |
| `CLAUDE.md` | Points Claude Code at `AGENTS.md` |
| `css/theme.css` | Generated Tailwind v4 theme: CSS variables (light + dark), shadcn/ui mapping, `type-*` text styles |
| `tokens/tokens.json` | Generated W3C design tokens (for other platforms and tools) |
| `tokens/figma-export.json` | Raw export of the Figma variables, the input for the build |
| `scripts/build-tokens.mjs` | `node scripts/build-tokens.mjs` regenerates `theme.css` + `tokens.json` |
| `components/` | Reference components: `button`, `button-cta`, `button-expand`, `layout` (grid + page patterns), `app-shell`, `field` (inputs), `controls` (checkbox/radio/switch), `tabs`, `icon`, `stat-tile`, `chart-theme` |
| `templates/app/` | `AGENTS.md` + `CLAUDE.md` templates for apps that use the system |
| `scripts/connect-app.sh` | Creates those files in an app (`bash loei/scripts/connect-app.sh "App name"`) |
| `CHANGELOG.md` | What changed per version and how to migrate |
| `assets/logo.svg` | Wordmark (uses `currentColor`, so it's ink or white via `text-*`) |

Figma library: https://www.figma.com/design/gH8WCeLsjGhAZITd4BWukV/LOEI---Design-system

## Connecting an app

Every LOEI app includes this repo as a **git submodule in `loei/`**. The app imports the theme and components from there,
so one update here reaches every app.

### 1 · Add it to an app (once per app)
```bash
cd my-app
git submodule add https://github.com/JacEngels/loeihard-design-system.git loei
bash loei/scripts/connect-app.sh "My App"     # creates AGENTS.md + CLAUDE.md in the app root
git add .gitmodules loei AGENTS.md CLAUDE.md
git commit -m "Connect LOEI design system"
```
Then fill in "About this app" in the new `AGENTS.md`. For a fresh project, ask your agent:
*"Set up this project following loei/AGENTS.md section 3."* It wires up the theme import, the `@loei/*` alias and the
shadcn overrides.

### 2 · How agents find it
- `AGENTS.md` (app root) tells every agent to read `loei/AGENTS.md` first and never to edit `loei/`. Codex, Cursor,
  Copilot, Gemini and Claude Code all read `AGENTS.md`.
- `CLAUDE.md` (app root) imports both files (`@AGENTS.md`, `@loei/AGENTS.md`), so Claude Code loads the full design
  system into every session automatically.

### 3 · Cloning an app that uses it
```bash
git clone --recurse-submodules <app-repo-url>
# already cloned without it?
git submodule update --init
```

### 4 · Getting design-system updates into an app
```bash
git submodule update --remote loei
git add loei && git commit -m "Update LOEI design system"
```
Each app stays pinned to a specific design-system commit until you run this, so an update never breaks an app by
surprise. Read `loei/CHANGELOG.md` for migration notes.

### 5 · CI and hosting (this repo is private)
- **GitHub Actions:** `actions/checkout` with `submodules: true` and a `token:` that can read this repo (a fine-grained
  PAT or GitHub App token, stored as a secret). The default `GITHUB_TOKEN` can only read the app's own repo.
- **Vercel / Netlify / others:** cloning private submodules often needs extra setup or isn't supported. Check your host's
  docs before the first deploy. Fallbacks: use the same Git account/org and an HTTPS submodule URL, add a deploy token, or
  make this repo public (it contains no secrets, only the brand system).
- Use the **HTTPS** URL (as above) for the submodule, not SSH. It works in more CI environments.

## Updating tokens

1. Change variables in Figma (Color, Spacing, Typography collections).
2. Re-export them into `tokens/figma-export.json` (ask Claude to "re-export the LOEI Figma variables").
3. `node scripts/build-tokens.mjs`
4. Add a `CHANGELOG.md` entry, commit and push. Apps update with `git submodule update --remote loei`.

## Status (v0.3, October 2026)

Done: foundations (172 variables: 54 primitives, 63 semantic colors in Light + Dark, 31 spacing/radius/size, 13 type, 11 layout with Mobile/Tablet/Desktop modes), 20 text styles,
4 elevation styles (incl. pop), 35 icons with a size/stroke scale and 35 components in Figma. On-brand, CVD-validated chart palette. Layout & Grid page: 4/8/12-col grid (Layout variables + grid styles), 4 shells, 6 page patterns, 8 templates (desktop, tablet, mobile).

Open: brand fonts (Neue Haas) in Figma + web licensing, Code Connect mappings, a component playground (Storybook), and
the website Navbar/Footer as components.
