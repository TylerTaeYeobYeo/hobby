import { describe, expect, it } from "vitest";
import {
  LEVEL_CONFIG,
  generateMinesweeperGrid,
  type Level,
  type MinesweeperGrid,
} from "./minesweeper-generator";

const countMines = (grid: MinesweeperGrid): number =>
  grid.reduce((n, row) => n + row.filter((c) => c.isMine).length, 0);

/** Independently recounts the mines around one cell. */
const recount = (grid: MinesweeperGrid, r: number, c: number): number => {
  let n = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const rr = r + dr;
      const cc = c + dc;
      if (rr >= 0 && rr < grid.length && cc >= 0 && cc < grid[0].length && grid[rr][cc].isMine) {
        n++;
      }
    }
  }
  return n;
};

describe("generateMinesweeperGrid", () => {
  it("matches the level config and places exactly `mines` mines", () => {
    for (const [level, config] of Object.entries(LEVEL_CONFIG)) {
      const grid = generateMinesweeperGrid(level as Level, { row: 4, col: 4 });
      expect(grid).toHaveLength(config.rows);
      expect(grid[0]).toHaveLength(config.cols);
      expect(countMines(grid)).toBe(config.mines);
    }
  });

  it("never places a mine on the first click", () => {
    for (const level of Object.keys(LEVEL_CONFIG) as Level[]) {
      const click = { row: 4, col: 4 };
      const grid = generateMinesweeperGrid(level, click);
      expect(grid[4][4].isMine).toBe(false);
    }
  });

  it("annotates every non-mine cell with its true adjacent mine count", () => {
    for (const [level, config] of Object.entries(LEVEL_CONFIG)) {
      const grid = generateMinesweeperGrid(level as Level, { row: 4, col: 4 });
      for (let r = 0; r < config.rows; r++) {
        for (let c = 0; c < config.cols; c++) {
          if (grid[r][c].isMine) {
            expect(grid[r][c].adjacentMines).toBe(0);
          } else {
            expect(grid[r][c].adjacentMines).toBe(recount(grid, r, c));
          }
        }
      }
    }
  });

  it("throws when the first click is out of bounds", () => {
    expect(() =>
      generateMinesweeperGrid("easy", { row: 9, col: 4 }),
    ).toThrow(/out of bounds/i);
    expect(() =>
      generateMinesweeperGrid("easy", { row: 4, col: -1 }),
    ).toThrow(/out of bounds/i);
  });

  it("produces different layouts across calls (random placement)", () => {
    const a = generateMinesweeperGrid("easy", { row: 0, col: 0 });
    const b = generateMinesweeperGrid("easy", { row: 0, col: 0 });
    const same = a.every((row, r) => row.every((c, cc) => c.isMine === b[r][cc].isMine));
    // Two independent random layouts should (almost certainly) differ.
    expect(same).toBe(false);
  });
});
