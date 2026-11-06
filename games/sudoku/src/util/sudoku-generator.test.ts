import { describe, expect, it } from "vitest";
import { generateSudoku, type Level } from "./sudoku-generator";
import { isBoardComplete, isBoardSolvable } from "./sudoku-validation";

const LEVELS: Level[] = ["easy", "medium", "hard"];

// createPuzzle removes exactly this many cells per level.
const EXPECTED_EMPTY: Record<Level, number> = {
  easy: 40,
  medium: 50,
  hard: 60,
};

const countZeros = (board: number[][]): number =>
  board.reduce((n, row) => n + row.filter((v) => v === 0).length, 0);

/** A board with no repeated non-zero value in any row, column, or box. */
const hasNoConflicts = (board: number[][]): boolean => {
  for (let i = 0; i < 9; i++) {
    const row = board[i].filter((v) => v !== 0);
    const col = board.map((r) => r[i]).filter((v) => v !== 0);
    if (new Set(row).size !== row.length) return false;
    if (new Set(col).size !== col.length) return false;
  }
  for (let br = 0; br < 9; br += 3) {
    for (let bc = 0; bc < 9; bc += 3) {
      const box: number[] = [];
      for (let r = br; r < br + 3; r++)
        for (let c = bc; c < bc + 3; c++)
          if (board[r][c] !== 0) box.push(board[r][c]);
      if (new Set(box).size !== box.length) return false;
    }
  }
  return true;
};

for (const level of LEVELS) {
  describe(`generateSudoku(${level})`, () => {
    it("produces a consistent puzzle", () => {
      for (let i = 0; i < 3; i++) {
        const { board, solution, given } = generateSudoku(level);

        // Shape.
        expect(board).toHaveLength(9);
        expect(board[0]).toHaveLength(9);
        expect(solution).toHaveLength(9);
        expect(given).toHaveLength(9);

        // Difficulty-specific number of clues.
        expect(countZeros(board)).toBe(EXPECTED_EMPTY[level]);

        // The solution is a completed, valid board and the puzzle is solvable.
        expect(isBoardComplete(solution)).toBe(true);
        expect(isBoardSolvable(board)).toBe(true);
        expect(hasNoConflicts(board)).toBe(true);

        // Givens line up exactly with the non-zero cells of the puzzle and
        // always agree with the solution.
        for (let r = 0; r < 9; r++) {
          for (let c = 0; c < 9; c++) {
            expect(given[r][c]).toBe(board[r][c] !== 0);
            if (given[r][c]) expect(board[r][c]).toBe(solution[r][c]);
          }
        }
      }
    }, 20000);
  });
}
