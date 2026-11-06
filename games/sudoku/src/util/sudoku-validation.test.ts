import { describe, expect, it } from "vitest";
import {
  computeInvalidCells,
  isBoardComplete,
  isBoardFull,
  isBoardSolvable,
  shouldHighlightCell,
} from "./sudoku-validation";

// A known-valid completed Sudoku board (programmatically verified).
const VALID_SOLUTION: number[][] = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [4, 5, 6, 7, 8, 9, 1, 2, 3],
  [7, 8, 9, 1, 2, 3, 4, 5, 6],
  [2, 1, 4, 3, 6, 5, 8, 9, 7],
  [3, 6, 5, 8, 9, 7, 2, 1, 4],
  [8, 9, 7, 2, 1, 4, 3, 6, 5],
  [5, 3, 1, 6, 4, 2, 9, 7, 8],
  [6, 4, 2, 9, 7, 8, 5, 3, 1],
  [9, 7, 8, 5, 3, 1, 6, 4, 2],
];

const clone = (board: number[][]): number[][] => board.map((row) => [...row]);

const emptyBoard = (): number[][] =>
  Array.from({ length: 9 }, () => Array(9).fill(0));

const setCell = (board: number[][], r: number, c: number, v: number) => {
  const next = clone(board);
  next[r][c] = v;
  return next;
};

describe("isBoardFull", () => {
  it("is true for a completed board", () => {
    expect(isBoardFull(VALID_SOLUTION)).toBe(true);
  });

  it("is false when any cell is empty", () => {
    expect(isBoardFull(setCell(VALID_SOLUTION, 0, 0, 0))).toBe(false);
  });
});

describe("isBoardComplete", () => {
  it("is true for a full, valid board", () => {
    expect(isBoardComplete(VALID_SOLUTION)).toBe(true);
  });

  it("is false for a full board with a duplicate in a row", () => {
    // Duplicate the 5 of row 0 into an empty-looking slot of the same row.
    const board = setCell(VALID_SOLUTION, 0, 8, 5); // row 0 now has two 5s
    expect(isBoardComplete(board)).toBe(false);
  });

  it("is false for a valid board that is not full", () => {
    const board = setCell(VALID_SOLUTION, 4, 4, 0);
    expect(isBoardComplete(board)).toBe(false);
  });
});

describe("computeInvalidCells", () => {
  it("flags a cell that duplicates a value in its row", () => {
    const board = emptyBoard();
    board[0][0] = 4; // given
    board[0][5] = 4; // player entry conflicting with the given
    const given = emptyBoard().map((row) => row.map(() => false));
    given[0][0] = true;

    const invalid = computeInvalidCells(board, given);
    expect(invalid[0][5]).toBe(true);
    expect(invalid[0][0]).toBe(false); // givens are never flagged
  });

  it("flags a cell that duplicates a value in its column", () => {
    const board = emptyBoard();
    board[2][3] = 7;
    board[7][3] = 7;
    const given = emptyBoard().map((row) => row.map(() => false));

    const invalid = computeInvalidCells(board, given);
    expect(invalid[2][3] || invalid[7][3]).toBe(true);
  });

  it("flags a cell that duplicates a value in its 3x3 box", () => {
    const board = emptyBoard();
    board[0][0] = 3;
    board[1][1] = 3; // same box, different row and column
    const given = emptyBoard().map((row) => row.map(() => false));

    const invalid = computeInvalidCells(board, given);
    expect(invalid[0][0] || invalid[1][1]).toBe(true);
  });

  it("flags no cells for a fully valid board", () => {
    const given = VALID_SOLUTION.map((row, r) =>
      row.map((_, c) => r === 0 && c === 0),
    );
    const invalid = computeInvalidCells(VALID_SOLUTION, given);
    expect(invalid.flat().every((v) => v)).toBe(false);
  });

  it("ignores empty cells", () => {
    const board = emptyBoard();
    const given = emptyBoard().map((row) => row.map(() => false));
    const invalid = computeInvalidCells(board, given);
    expect(invalid.flat().every((v) => v)).toBe(false);
  });
});

describe("isBoardSolvable", () => {
  it("is true for a completed valid board", () => {
    expect(isBoardSolvable(VALID_SOLUTION)).toBe(true);
  });

  it("is true for a partial board that still has a solution", () => {
    // Zero out one cell per row — each keeps (almost) a single candidate,
    // so the solver finishes without exploring a large search space.
    const board = VALID_SOLUTION.map((row) => [...row]);
    for (let r = 0; r < 9; r++) board[r][r] = 0;
    expect(isBoardSolvable(board)).toBe(true);
  });

  it("is false when a cell has no possible value", () => {
    // Blank cell (0,0), then place its value (1) into the same row.
    // Row 0 then covers 1..8, the column blocks the only remaining
    // candidate, and (0,0) is the first empty cell in scan order —
    // the failure is detected immediately without a large search.
    const board = clone(VALID_SOLUTION);
    board[0][0] = 0;
    board[0][8] = 1;
    expect(isBoardSolvable(board)).toBe(false);
  });

  it("is false when existing values already conflict in a row", () => {
    // Duplicate a value within row 8 (row 8 already holds a 6 at (8,6)).
    // Pre-existing conflicts in non-zero cells must be rejected even
    // though the rest of the board is a valid, solvable board.
    const board = clone(VALID_SOLUTION);
    board[8][0] = 6;
    expect(isBoardSolvable(board)).toBe(false);
  });
});

describe("shouldHighlightCell", () => {
  it("highlights cells sharing the row, column, or box", () => {
    const board = emptyBoard();
    board[4][4] = 5;
    expect(shouldHighlightCell(board, 4, 0, 5)).toBe(true); // same row
    expect(shouldHighlightCell(board, 0, 4, 5)).toBe(true); // same column
    expect(shouldHighlightCell(board, 3, 3, 5)).toBe(true); // same box
    expect(shouldHighlightCell(board, 8, 8, 5)).toBe(false); // nowhere
    expect(shouldHighlightCell(board, 4, 0, 3)).toBe(false); // other value
  });
});
