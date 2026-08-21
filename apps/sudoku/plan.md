# Sudoku Feature Plan

## Shared / Reusable (core/ui)

- [x] Add `Button` component to `core/ui` (basic reusable styled button)
- [x] Add `Dialog` (modal) component to `core/ui` (reusable overlay dialog with backdrop, close on backdrop click)
- [x] Export new components from `core/ui/src/components/index.tsx`

## Sudoku Generator

- [x] Update `sudoku-generator.ts` to also return the full `solution` board and a `given` mask (boolean[][]) marking pre-filled cells
- [x] Keep difficulty levels (easy/medium/hard)

## Board / Cell (app-specific)

- [x] Track `given` cells; given cells are rendered read-only (not editable, no memo, distinct styling) — "don't let user fix what is given"
- [x] Render memo numbers inside empty cells as a 3x3 mini-grid of small digits
- [x] Support "erase" - clear value & memo of the selected (non-given) cell
- [x] Support selecting a cell (for erase / keyboard entry)
- [x] Highlight prop: given a hovered number, highlight (light sky blue) all cells in the row/column/box of every existing occurrence of that number (cells where that number cannot be placed)
- [x] Prevent editing given cells entirely (no input, no memo popup, no highlight-as-selected)

## Hint Bar

- [x] New `NumberHintBar` component: horizontal list of 1-9 buttons under the board
- [x] On hover of a number, notify board to compute/apply "can't place" highlight in light sky blue
- [x] Clear highlight on mouse leave

## Erase Feature

- [x] Add "Erase" button in game UI (or keyboard Delete/Backspace) to clear selected non-given cell's value + memo

## Difficulty Selection Dialog

- [x] New `DifficultyDialog` component (uses core/ui `Dialog` + `Button`)
- [x] Menu "New Game" button opens dialog instead of navigating directly
- [x] Dialog offers Easy / Medium / Hard; selecting navigates to `/game?isNew=true&difficulty=<level>`
- [x] Game page reads `difficulty` from query params and generates puzzle accordingly

## High Score Feature

- [x] `util/highscore.ts`: read/write high scores to localStorage, keyed per difficulty
- [x] Sorted ascending by time (fastest = rank #1), capped to top N (e.g. 10)
- [x] On board completion (filled board matches solution), stop timer, record score, show completion state
- [x] New `Leaderboard` page listing high scores grouped/tabbed by difficulty
- [x] Menu "Leaderboard" button navigates to leaderboard page
- [x] Add leaderboard route in `main.tsx`

## Game Page Wiring

- [x] Update `Game` page: pass `given`, `solution`, selected cell, erase handler, hint hover state to `Board`
- [x] Detect win condition, pause timer, persist high score, show a completion dialog with result + link back to menu
- [x] Persist `given` + `solution` in saved game state (localStorage) for "Load Game" continuation

## Routing

- [x] Add `/leaderboard` route
- [x] Ensure query params (`isNew`, `difficulty`) flow correctly

## Polish

- [x] Verify no TypeScript/lint errors across changed files

## Hint Coins Feature

- [x] Determine coin count per difficulty (easy: 3, medium: 2, hard: 1) and initialize on new game start (persist in saved game state for Load Game)
- [x] Add "Hint" button next to `NumberHintBar` showing remaining coin count, disabled when 0 remain or game not playing
- [x] Clicking Hint reveals one random cell that currently has no value (empty, non-given) by setting it to the solution value and clearing its memo
- [x] Decrement remaining coins on each hint use
- [x] Persist hint coins in `sudokuGameState` localStorage save/load

## Hint Bar Number Graying

- [x] In `NumberHintBar`, compute per-number completion (all 9 placed on board) and gray out / disable hover highlight for completed numbers

## Board Block Dividers

- [x] Add visual divider lines between each 3x3 box in `Board` (thicker, centered, light gray, single continuous lines using a dedicated CSS Grid divider track)

## Hint Mode Feature

- [x] `NumberHintBar`: clicking a number toggles "hint mode" for that number (visually indicated as active); clicking again or clicking outside the board exits hint mode
- [x] While in hint mode, the row/column/box highlight for that number stays displayed regardless of hover
- [x] `Board`/`BoardCell`: left-click on an empty, non-given cell while in hint mode fills it with the hint-mode number
- [x] `Board`/`BoardCell`: right-click on an empty, non-given cell while in hint mode toggles a memo of that number instead of opening the memo popup
- [x] Clicking outside the board container exits hint mode (document click-outside listener)

## Win Detection Fix

- [x] Fixed win detection: previously compared filled board to the exact generated `solution` array, which failed for alternate valid solutions; now validates the board is full and satisfies Sudoku rules (no duplicates in any row/column/box)
- [x] Guarded against duplicate completion triggers (e.g. rapid updates) with a `hasCompletedRef`
- [x] Completion `Dialog` now shows a clear congratulations message, final time, and the player's rank on the difficulty's leaderboard
