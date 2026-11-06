import { StrictMode, type ReactNode, useRef } from "react";
import { MemoryRouter } from "react-router";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useGameState, type TimerHandle } from "./use-game-state";

const makeTimer = (elapsed = 42): TimerHandle => ({
  getTime: () => elapsed,
  pause: () => {},
  resume: () => {},
  reset: () => {},
});

// StrictMode on purpose: it double-invokes render-phase and updater work in
// development, which is where duplicate side effects would show up.
const wrapper =
  (props: { children: ReactNode }) =>
  (
    <StrictMode>
      <MemoryRouter initialEntries={["/sudoku/game?isNew=true&difficulty=easy"]}>
        {props.children}
      </MemoryRouter>
    </StrictMode>
  );

const renderSudoku = () =>
  renderHook(() => {
    const timerRef = useRef<TimerHandle | null>(null);
    if (timerRef.current === null) timerRef.current = makeTimer();
    return useGameState(timerRef);
  }, { wrapper });

const firstEmptyCell = (
  board: number[][],
  given: boolean[][],
): { r: number; c: number } => {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0 && !given[r][c]) return { r, c };
    }
  }
  throw new Error("test setup error: puzzle has no empty cell");
};

describe("useGameState (sudoku)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("initializes a new easy puzzle in the playing state", () => {
    const { result } = renderSudoku();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.status).toBe("playing");
    expect(result.current.difficulty).toBe("easy");
    expect(result.current.hintCoins).toBe(3);
    expect(result.current.gameState.board).toHaveLength(9);
  });

  it("refuses to modify given cells", () => {
    const { result } = renderSudoku();
    const { board, given } = result.current.gameState;

    const row = given.findIndex((r) => r.some(Boolean));
    const col = given[row].findIndex(Boolean);
    expect(row).toBeGreaterThanOrEqual(0);
    const original = board[row][col];

    act(() => result.current.handleCellChange(row, col, original === 5 ? 6 : 5));

    expect(result.current.gameState.board[row][col]).toBe(original);
  });

  it("fills a cell, then restores it with undo/redo", () => {
    const { result } = renderSudoku();
    const { board, given } = result.current.gameState;
    const { r, c } = firstEmptyCell(board, given);

    act(() => result.current.handleCellChange(r, c, 7));
    expect(result.current.gameState.board[r][c]).toBe(7);
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);

    act(() => result.current.handleUndo());
    expect(result.current.gameState.board[r][c]).toBe(0);
    expect(result.current.canRedo).toBe(true);

    act(() => result.current.handleRedo());
    expect(result.current.gameState.board[r][c]).toBe(7);
  });

  it("stores memos on a cell and restores them with undo", () => {
    const { result } = renderSudoku();
    const { board, given } = result.current.gameState;
    const { r, c } = firstEmptyCell(board, given);

    act(() => result.current.handleCellChange(r, c, 0, ["1", "5"]));
    expect(result.current.gameState.memo[r][c]).toEqual(["1", "5"]);

    act(() => result.current.handleUndo());
    expect(result.current.gameState.memo[r][c]).toEqual([]);
  });

  it("applies many batched moves without losing updates", () => {
    const { result } = renderSudoku();
    const { board, given, solution } = result.current.gameState;

    // Fill up to 5 empty cells inside one act() batch — all of them must
    // survive (functional state updates), not just the last one.
    const empties: Array<{ r: number; c: number }> = [];
    outer: for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 0 && !given[r][c]) empties.push({ r, c });
        if (empties.length === 5) break outer;
      }
    }

    act(() => {
      for (const { r, c } of empties) {
        result.current.handleCellChange(r, c, solution[r][c]);
      }
    });

    for (const { r, c } of empties) {
      expect(result.current.gameState.board[r][c]).toBe(solution[r][c]);
    }
  });

  it("completing the board records exactly one high score", () => {
    const { result } = renderSudoku();
    const { board, solution } = result.current.gameState;

    act(() => {
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (board[r][c] === 0) {
            result.current.handleCellChange(r, c, solution[r][c]);
          }
        }
      }
    });

    expect(result.current.status).toBe("completed");
    expect(result.current.rank).toBe(1);

    const raw = localStorage.getItem("sudokuHighScores");
    expect(raw).not.toBeNull();
    const scores = JSON.parse(raw!) as Record<string, Array<{ time: number }>>;
    // Exactly one entry: a side effect that runs twice (e.g. inside a
    // StrictMode-double-invoked state updater) would leave two.
    expect(scores.easy).toHaveLength(1);
    expect(scores.easy[0].time).toBe(42);
    // The saved game is cleared on completion.
    expect(localStorage.getItem("sudokuGameState")).toBeNull();
  });

  it("opens the game-over dialog when a move duplicates a row value", () => {
    const { result } = renderSudoku();
    const { board } = result.current.gameState;

    // Find a row with at least two filled cells and an empty cell in it;
    // copying an existing row value into the empty cell is always invalid.
    let target: { r: number; c: number; v: number } | null = null;
    outer: for (let r = 0; r < 9; r++) {
      const filled = board[r].filter((v) => v !== 0);
      const empty = board[r].findIndex((v) => v === 0);
      if (filled.length >= 2 && empty !== -1) {
        target = { r, c: empty, v: filled[0] };
        break outer;
      }
    }
    expect(target).not.toBeNull();

    act(() => result.current.handleCellChange(target!.r, target!.c, target!.v));

    expect(result.current.showGameOverDialog).toBe(true);
  });

  it("keeps hint mode when the click target is the number bar", () => {
    const { result } = renderSudoku();

    const board = document.createElement("div");
    const bar = document.createElement("div");
    bar.dataset.hintBar = "";
    const button = document.createElement("button");
    bar.appendChild(button);
    document.body.append(board, bar);
    result.current.boardContainerRef.current = board;

    act(() => result.current.setHintModeNumber(5));
    expect(result.current.hintModeNumber).toBe(5);

    // The outside-click listener runs before the button's onClick, so the
    // bar must be excluded — otherwise toggle-off could never work.
    act(() => button.dispatchEvent(new MouseEvent("click", { bubbles: true })));
    expect(result.current.hintModeNumber).toBe(5);

    bar.remove();
    board.remove();
  });

  it("clears hint mode when clicking outside the board and the bar", () => {
    const { result } = renderSudoku();

    const board = document.createElement("div");
    const outside = document.createElement("div");
    document.body.append(board, outside);
    result.current.boardContainerRef.current = board;

    act(() => result.current.setHintModeNumber(5));
    act(() => outside.dispatchEvent(new MouseEvent("click", { bubbles: true })));

    expect(result.current.hintModeNumber).toBeNull();

    board.remove();
    outside.remove();
  });
});
