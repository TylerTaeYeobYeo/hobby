# 2048 Game Plan

Goal: scaffold `games/2048` as a `@games/2048` workspace package (mirroring
`games/minesweeper`'s structure/conventions) that implements classic 2048 —
slide/merge tiles on a fixed 4×4 grid with arrow keys or swipe, reach the 2048
tile to win. No difficulty levels — one board size for everyone. Consumed by
`apps/game` alongside Minesweeper and Sudoku.

## 1. Package scaffold

- [x] `package.json` (name `@games/2048`, same deps as `@games/minesweeper`:
      `@core/ui`, `@core/utility`, `react`, `react-dom`, `react-router`;
      `exports["."]` pointing at `./src/index.ts`; `lint` script only, no build)
- [x] `tsconfig.json` (extends `../../tsconfig.app.base.json`, `include: ["src"]`)
- [x] `eslint.config.js` (shared `createConfig` factory, same as other `games/*`)
- [x] `src/index.ts` — barrel export `export { Game2048 } from "./game-2048"`
- [x] `src/game-2048.tsx` — `GameLayout title="2048"` wrapping `Routes` for
      `index` (Menu), `game` (Game), `leaderboard` (Leaderboard)
- [x] Confirm npm workspaces picks up `games/2048` automatically (glob `games/*`)
      and `npm install` links it

## 2. Board & merge logic (`src/util/board.ts`)

- [x] `BOARD_SIZE = 4` constant (classic 2048 grid, no difficulty levels)
- [x] `Board = number[][]` (`0` = empty cell)
- [x] `createEmptyBoard()` and `spawnRandomTile(board)` — fills one random
      empty cell with `2` (90%) or `4` (10%); `createInitialBoard()` spawns
      two starting tiles
- [x] `type Direction = "up" | "down" | "left" | "right"`; `move(board, direction)`
      → `{ board: Board; moved: boolean; gained: number }` via per-row/column
      compress → merge-adjacent-equal → compress algorithm (`gained` = sum of
      merged tile values, for scoring)
- [x] `hasAvailableMoves(board)` — true if any empty cell exists or any two
      adjacent cells (row or column) share a value (used for loss detection)
- [x] `hasReachedTarget(board, target = 2048)` — true if any cell `>= target`
- [x] Unit-style sanity checks (manual or lightweight test) for merge edge
      cases: double-merge in one slide (`[2,2,2,2]` → `[4,4]` not `[8]`),
      merge direction correctness for all four directions

## 3. Shared components

- [x] `src/components/timer.tsx` — copy of Minesweeper's `Timer`
      (`getTime`/`pause`/`resume`/`reset` via ref, does not auto-start)
- [x] `src/components/score-counter.tsx` — `ScoreCounter` showing current
      running score (mirrors `MineCounter`'s layout/theming)
- [x] `src/components/tile.tsx` — single tile: value-based background color
      scale (2→2048+), theme-aware styling (neumorphism/material/cupertino/
      cyberpunk, matching `board-cell.tsx` conventions), empty cell when `0`
- [x] `src/components/board.tsx` — CSS-grid `4 × 4` board rendering `Tile`s
      from a `Board`, responsive cell sizing via `ResizeObserver` (same pattern
      as Minesweeper's `board.tsx`)
- [x] `src/components/game-toolbar.tsx` — `GameToolbar` with Back button,
      `Timer`, `ScoreCounter`, Reset button, Save button

## 4. Game state hook (`src/hooks/use-game-state.ts`)

- [x] `GameStatus = "idle" | "playing" | "won" | "lost"`; board stays freshly
      initialized (status `idle`) until the first move, which starts the timer
- [x] A single `handleMove(direction: Direction)` is the one entry point for
      applying a move (apply `move()`, spawn a random tile if `moved`, add
      `gained` to running `score`, then check win/loss) — both keyboard and
      touch input call into it so the two input modes are always in sync,
      never duplicated or drifting behavior
- [x] Keyboard input: `keydown` listener for arrow keys / WASD, calls
      `handleMove`, ignored when `status` is `won`/`lost` or no tiles moved
      (no wasted render/save)
- [x] Touch input: swipe gesture via `touchstart`/`touchend` delta comparison
      (≥ ~30px threshold, picking the dominant axis) mapped to a `Direction`
      and passed to the same `handleMove`, so mobile behaves identically to
      keyboard — same move/merge/scoring/win-loss outcome for an equivalent
      swipe vs. arrow press
- [x] `touchmove` calls `preventDefault()` on the board while a swipe is in
      progress so the page doesn't scroll/bounce during a swipe (mirrors the
      repo's existing mobile-friendly long-press handling in Minesweeper)
- [x] Reaching the 2048 tile → pause timer, `addHighScore(elapsedTime)`, set
      `finalTime`/`rank`, status `won`
- [x] No available moves after a spawn → pause timer, status `lost`
- [x] Reset regenerates a fresh board (status → `idle`, score → 0, timer → 0)
- [x] Save writes `{ board, score, elapsedTime }` as plain JSON to
      `localStorage` (no XOR obfuscation needed — unlike Minesweeper, there's no
      hidden info to protect from the player)
- [x] `isNew=false` (Load Game) reads the saved state and resumes the timer if
      the loaded status is `playing`

## 5. Pages

- [x] `src/pages/menu.tsx` — "New Game" navigates straight to
      `/game?isNew=true` (no dialog); "Load Game" and "Leaderboard" buttons
      mirror Minesweeper's menu
- [x] `src/pages/game.tsx` — renders `GameToolbar` then `Board`, plus a
      won/lost status line (won: final time + rank; lost: final score)
- [x] `src/pages/leaderboard.tsx` — mirrors Minesweeper's leaderboard minus the
      difficulty `Tabs`: a single ranked list of fastest times to reach 2048,
      sourced from `getHighScores()`

## 6. High scores (`src/util/highscore.ts`)

- [x] Thin wrapper around `createHighScoreStore` from `@core/utility`, using a
      single internal difficulty key (storage key `2048HighScores`,
      `difficulties: ["classic"]`) so the shared store needs no changes; the
      public API hides that param — `getHighScores(): HighScoreEntry[]` and
      `addHighScore(time): { scores, rank }`

## 7. Wiring into `apps/game`

- [x] Add `@games/2048` as a dependency of `apps/game/package.json`
- [x] `apps/game/src/pages/game-page.tsx` — add `Game2048Page` (Back button +
      `Game2048`), mirroring `MinesweeperPage`/`SudokuPage`
- [x] `apps/game/src/main.tsx` — add route `{ path: "2048/*", Component:
Game2048Page }`
- [x] `apps/game/src/config/games.ts` — add `{ id: "2048", title: "2048",
thumbnail: "/thumbnails/2048.svg" }` entry
- [x] `apps/game/public/thumbnails/2048.svg` — new thumbnail icon

## 8. Verification

- [x] `turbo run lint build --filter=@games/2048` (and `--filter=@app/game`)
      passes cleanly
- [x] Verified in-browser: arrow keys/swipe slide and merge tiles correctly on
      all four directions, score updates on merges, reaching 2048 shows the win
      message with time + rank, a full unmergeable board shows the loss
      message, Reset clears the board/score/timer, Save + Load Game round-trips
      state correctly, and the leaderboard renders seeded scores per difficulty
- [x] Verified on a touch device / mobile emulation: swiping in each of the
      four directions produces the exact same move/merge/score/win-loss result
      as the equivalent arrow key on desktop, swiping doesn't scroll or bounce
      the page, and small/ambiguous swipes below the threshold are ignored
      rather than misfiring a random direction
