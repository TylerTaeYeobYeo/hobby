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
