# Mobile-Friendly Gameplay – Plan

## Checklist

### 🔴 Critical

- [x] **[Minesweeper] Flag-mode toggle button**
  Add a flag/reveal mode toggle to the toolbar so mobile users can flag cells without
  right-clicking. Tap the toggle to switch modes; a tap on an unrevealed cell either
  reveals or flags depending on the active mode.

- [x] **[Minesweeper] Responsive board scaling**
  Replace the fixed `CELL_SIZE = 28px` grid with a dynamically computed cell size that
  fits the board inside the available viewport width. Use a `ResizeObserver` (or a
  container ref + `useLayoutEffect`) on a wrapper div and derive cell size from it.

- [x] **[Sudoku] Responsive board scaling**
  Replace the hardcoded `BOARD_SIZE = 444px` / `CELL_SIZE = 48px` constants with a
  computed size so the 9×9 grid always fits within the viewport width.

- [x] **[GameLayout] Fix `overflow-hidden` clipping content on small screens**
  Change `h-screen overflow-hidden` to `min-h-screen overflow-auto` so game content
  that is taller than the phone viewport is reachable by scrolling rather than
  silently clipped.

### 🟡 Medium

- [x] **[Minesweeper] Remove `min-w-3xl` from the game page container**
  The hardcoded `min-w-3xl` (48 rem) in `games/minesweeper/src/pages/game.tsx` forces
  horizontal overflow on every phone. Remove it; the board width is already controlled
  by the responsive cell-size fix above.

- [x] **[Minesweeper] Responsive toolbar layout**
  Wrap the toolbar buttons so they stack or wrap gracefully on narrow screens instead
  of overflowing. Use `flex-wrap` or break into two rows with responsive classes.

- [x] **[Sudoku] Responsive toolbar layout**
  The 6-button row (Back, Pause, Restart, Undo, Redo, Save) clips on phones. Collapse
  less-critical actions (Undo/Redo/Save) into a compact row or use icon-only buttons
  on small screens.

- [x] **[Sudoku] Number-hint bar touch targets**
  Ensure each digit button is at least 44 × 44 px (Apple HIG minimum tap target) on
  small screens by adding `min-h-11 min-w-11` or equivalent.

### 🟢 Nice to have

- [x] **[Minesweeper] Long-press to flag**
  As an alternative / complement to the toggle button, implement a `~400 ms`
  long-press gesture on mobile: `touchstart` starts a timer, `touchmove` / `touchend`
  cancel it; if the timer fires, the cell is flagged.

- [x] **[Sudoku] Memo popup edge detection**
  The memo popup is positioned relative to the tapped cell. Near screen edges it goes
  off-screen. Detect viewport boundaries and flip the popup's position accordingly.

---

# Mobile-Friendly Gameplay – Pass 2 (2026-11-06)

## Checklist

### 🔴 Critical

- [x] **[Sudoku] Long-press to open memo popup on touch devices**
  Memos were only reachable via right-click, which phones cannot do. Added a
  ~400 ms long-press on board cells (same pattern as Minesweeper's flag long-press)
  that opens the same memo popup used by right-click.

- [x] **[Sudoku] Number entry and clearing on touch devices**
  Mobiles had no way to clear or change a number (hint-mode only fills empty
  cells). Tapping a number now fills the *selected* cell directly (and can
  replace its value); a 🧹 Clear button next to the Hint button erases the
  selected cell. Desktop right-click / typing flows are unchanged.

### 🟡 Medium

- [x] **[Minesweeper] Expert board overflow on narrow screens**
  The 30-column Expert board (min cell 16 px ≈ 500 px wide) exceeded phone
  widths and was clipped by the centered grid. Board wrapper is now
  `overflow-x-auto` with the grid `w-fit mx-auto`, so wide boards scroll
  horizontally instead of clipping.

- [x] **[Sudoku] Fixed `min-w-[278px]` board minimum on tiny screens**
  Replaced the hardcoded minimum (larger than the computed cell minimum) with
  `w-fit mx-auto` + a horizontally scrollable wrapper, matching the 2048 /
  Minesweeper approach.

- [x] **[2048] Window-level `touchmove` preventDefault blocked page scrolling**
  Any touch that moved anywhere on the page cancelled scrolling. Removed the
  global `touchmove` handler; the board already sets `touch-action: none`
  (`touch-none`), so swipes on the board still never scroll while the rest of
  the page can.

- [x] **[Core UI] 44 px minimum touch targets for `Button`**
  Buttons were ~38 px tall (below Apple HIG's 44 px). Added `min-h-11` to the
  base classes of all five themes.

- [x] **[Core UI] Dialog overflow on narrow screens**
  The panel's `min-w-[20rem]` (320 px) filled 320 px phones edge-to-edge with
  heavy `p-8` padding. Panels are now `p-4 sm:p-8`, `min-w-[16rem]
  sm:min-w-[20rem]`, capped by `max-w-[calc(100vw-2rem)]`.

### 🟢 Nice to have

- [x] **[Layout] `w-screen` → `w-full` on Home and GameLayout**
  `100vw` ignores vertical scrollbars and can create phantom horizontal
  overflow; `w-full` is the correct fit. GameLayout title also steps down to
  `text-3xl` on small screens so it clears the fixed Back button.

- [x] **[Dev server] LAN access for phones**
  `vite` now runs with `host: true` in the shared base config, so
  `npm run dev:game` prints a Network URL (e.g. `http://192.168.1.2:5173`)
  that a phone on the same Wi-Fi can open directly.
