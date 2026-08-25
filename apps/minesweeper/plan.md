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

## 6. Grid generator

- [x] `src/util/minesweeper-generator.ts`: `Level` type (`easy`/`medium`/`hard`)
      with configs — easy 9×9/10 mines, medium 16×16/40 mines, hard 30×16/99 mines
- [x] `generateMinesweeperGrid(difficulty, firstClick)` returns a 2D grid of
      cells (`isMine`, `adjacentMines`), guaranteeing no mine at `firstClick`
- [x] Verify `apps/minesweeper` type-checks and lints cleanly

## 7. Gameplay UI (game page + menu wiring)

- [x] `src/util/game-storage.ts` — `encodeGameState`/`decodeGameState` obfuscate
      saved game JSON with an XOR + base64 cipher so `localStorage` doesn't
      expose mine locations at a glance (not cryptographic security, just
      anti-hint obfuscation of the player's own data)
- [x] `src/components/timer.tsx` — stopwatch `Timer` (`getTime`/`pause`/`resume`/`reset`
      via ref) that does **not** auto-start on mount; stays at 0 until explicitly resumed
- [x] `src/components/mine-counter.tsx` — `MineCounter` showing `mines - flaggedCount`
- [x] `src/components/board-cell.tsx` — single cell: left-click reveals, right-click
      toggles flag, shows number/mine/flag with theme-aware styling
- [x] `src/components/board.tsx` — CSS-grid board rendering `rows x cols` cells from
      `MinesweeperGrid | null` (null until first click) + `revealed`/`flagged` matrices
- [x] `src/components/difficulty-dialog.tsx` — `DifficultyDialog` (Easy/Medium/Hard),
      mirrors sudoku's dialog
- [x] `src/components/game-toolbar.tsx` — `GameToolbar` with Back button, `Timer`,
      `MineCounter`, Reset button, Save button
- [x] `src/hooks/use-game-state.ts` — `useGameState` hook: - grid stays `null` (status `idle`) until the first reveal, which generates
      the grid via `generateMinesweeperGrid` and starts the timer - flood-fills zero-adjacent-mine cells on reveal - clicking a mine reveals all mines and sets status `lost`; revealing every
      non-mine cell sets status `won` (both pause the timer and clear the save) - Reset regenerates (grid → `null`, matrices cleared, timer reset to 0) - Save writes `{ difficulty, grid, revealed, flagged, elapsedTime }` to
      `localStorage` via `encodeGameState` - `isNew=false` (Load Game) reads and decodes the saved state and resumes
      the timer if the loaded status is `playing`
- [x] `src/pages/menu.tsx` — "New Game" opens `DifficultyDialog`; selecting a level
      navigates to `/game?isNew=true&difficulty=<level>`
- [x] `src/pages/game.tsx` — renders `GameToolbar` then `Board` below it, plus a
      simple won/lost status line
- [x] Verified in-browser: difficulty popup → board render, timer starts on first
      click, flagging updates the mine counter, Reset clears the board/timer, and
      Save + Load Game round-trips the obfuscated state correctly
- [x] `turbo run lint build --filter=@app/minesweeper` passes cleanly

## 8. High scores & chording

- [x] `src/util/highscore.ts` — thin wrapper around `createHighScoreStore` from
      `@core/utility` (storage key `minesweeperHighScores`, per-difficulty
      easy/medium/hard leaderboards, ranked ascending by time)
- [x] `src/pages/leaderboard.tsx` — mirrors sudoku's leaderboard: difficulty
      `Tabs` + ranked list (rank, formatted time, date) sourced from `getHighScores()`
- [x] `use-game-state`'s `finishWin` calls `addHighScore(difficulty, elapsedTime)`
      on a win and stores `finalTime`/`rank`, surfaced on the game page's win message
- [x] Chording: `BoardCell` fires `onChord` on `mousedown` when both mouse buttons
      are held (`e.buttons === 3`) over a revealed numbered cell; `useGameState`'s
      `handleChord` reveals the cell's remaining unflagged neighbors once the
      flagged-neighbor count matches its `adjacentMines` (losing if one is an
      unflagged mine, winning if it completes the board)
- [x] Verified in-browser: seeded `minesweeperHighScores` renders correctly on the
      leaderboard; with `Math.random` pinned for deterministic mine placement,
      flagging a revealed cell's known mine-neighbors and chord-clicking it
      correctly revealed the remaining neighbor
- [x] `turbo run lint build --filter=@app/minesweeper` passes cleanly
