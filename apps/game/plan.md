# Games Hub – Plan

## Architecture

The hub is a standalone Vite + React app (`@app/game`) that embeds each game in a
full-screen `<iframe>`. Games must run concurrently on fixed dev ports.

**Dev ports (fixed):**
| App | URL |
|-----|-----|
| Hub | `http://localhost:5173` |
| Minesweeper | `http://localhost:5174` |
| Sudoku | `http://localhost:5175` |

Run `npm run dev:all` to start all three simultaneously.

## ThemeToggle reusability

`ThemeToggle` already lives in `@core/ui` and is exported from there. All apps
(including the new hub) import it via `@core/ui` — no additional core packages are
needed. `ThemeProvider` from `@core/ui` wraps each app's root independently, sharing
the theme via `localStorage` (`uiTheme` key).

---

## Checklist

- [x] Create `apps/game/plan.md`
- [x] Create SVG thumbnails in each game's `public/` folder
  - [x] `apps/minesweeper/public/thumbnail.svg`
  - [x] `apps/sudoku/public/thumbnail.svg`
  - [x] `apps/game/public/thumbnails/minesweeper.svg` (hub copy)
  - [x] `apps/game/public/thumbnails/sudoku.svg` (hub copy)
- [x] Set fixed dev ports: minesweeper → 5174, sudoku → 5175
- [x] Scaffold `apps/game` project
  - [x] `package.json` (`@app/game`)
  - [x] `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
  - [x] `vite.config.ts`
  - [x] `index.html`
  - [x] `eslint.config.js`
- [x] Create `src/index.css` (Tailwind + `@core/ui` source scan)
- [x] Create `src/vite-env.d.ts` (VITE_* env var types)
- [x] Create `src/config/games.ts` (game registry)
- [x] Create `src/App.tsx` (theme-aware shell, no ThemeToggle — lives in home page)
- [x] Create `src/main.tsx` (ThemeProvider + router)
- [x] Create `src/pages/home.tsx` (header with title + ThemeToggle, responsive game grid)
- [x] Create `src/pages/game-frame.tsx` (full-screen iframe + fixed back button)
- [x] Add `dev:all`, `dev:game`, `build:game` to root `package.json`
- [x] Run `npm install` to register the new workspace package
