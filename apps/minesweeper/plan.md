# Minesweeper Scaffold Plan

Goal: scaffold `apps/minesweeper` as a Vite + TypeScript + React app whose landing
page (app shell + menu) is identical to `apps/sudoku`'s, except the title reads
"Minesweeper". No gameplay logic (New Game / Load Game / board mechanics) is
implemented yet. Reusable utility logic found in `apps/sudoku` is relocated to a
new `core/utility` package first, so both apps can share it.

## 1. `core/utility` package (shared, non-UI logic)

- [x] Scaffold `core/utility` package (`package.json`, `tsconfig.json`, `eslint.config.js`)
- [x] Generalize `apps/sudoku`'s `util/highscore.ts` into a reusable
      `createHighScoreStore` factory + `formatTime` helper, parameterized by
      storage key and difficulty levels (no longer hardcoded to Sudoku's `Level`)
- [x] Add `src/index.ts` barrel export
- [x] Build the package (`tsc`) and confirm `dist/` output

## 2. Update `apps/sudoku` to consume `@core/utility`

- [x] Add `@core/utility` as a dependency of `apps/sudoku`
- [x] Replace `apps/sudoku/src/util/highscore.ts` internals with a thin wrapper
      around `createHighScoreStore` from `@core/utility` (keep existing call
      sites like `getHighScores()`/`addHighScore()` unchanged)
- [x] Verify `apps/sudoku` still type-checks and lints cleanly

## 3. Scaffold `apps/minesweeper` project files

- [x] `package.json` (name `@app/minesweeper`, same deps/devDeps as sudoku)
- [x] `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json` (copied from sudoku)
- [x] `vite.config.ts` (copied from sudoku)
- [x] `eslint.config.js` (shared config factory, same as sudoku)
- [x] `index.html` (title "Minesweeper")
- [x] `README.md` (copied Vite template readme)
- [x] `public/favicon.svg`, `public/icons.svg` (reused from sudoku)

## 4. Minesweeper app source (landing page only)

- [x] `src/index.css` (Tailwind import + `@core/ui` source scan path)
- [x] `src/App.tsx` — identical shell/theme logic to sudoku's `App.tsx`,
      title changed to "Minesweeper"
- [x] `src/pages/menu.tsx` — identical structure to sudoku's menu (New Game /
      Load Game / Leaderboard buttons + theme switcher `Tabs`), without the
      difficulty dialog (no gameplay logic yet)
- [x] `src/pages/game.tsx` — placeholder "Coming soon" page (no board logic)
- [x] `src/pages/leaderboard.tsx` — placeholder "Coming soon" page (no scores yet)
- [x] `src/main.tsx` — router wiring `/`, `/game`, `/leaderboard` +
      `ThemeProvider`

## 5. Workspace wiring & verification

- [x] Confirm npm workspaces picks up `apps/minesweeper` automatically (glob `apps/*`)
- [x] Add `dev:minesweeper` / `build:minesweeper` scripts to root `package.json`
- [x] `npm install` to link workspace dependencies
- [x] `turbo run build` succeeds for all packages
- [x] `turbo run lint` succeeds for all packages
