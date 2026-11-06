import { describe, expect, it } from "vitest";
import {
  BOARD_SIZE,
  createInitialBoard,
  hasAvailableMoves,
  hasReachedTarget,
  move,
  spawnRandomTile,
  type Board,
} from "./board";

const board = (...rows: number[][]): Board => rows.map((r) => [...r]);

const empty = (): Board =>
  Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));

describe("move", () => {
  it("slides and merges to the left", () => {
    const { board: next, moved, gained } = move(
      board([2, 2, 4, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]),
      "left",
    );
    expect(next[0]).toEqual([4, 4, 0, 0]);
    expect(moved).toBe(true);
    expect(gained).toBe(4);
  });

  it("merges each equal pair at most once per move", () => {
    const { board: next, gained } = move(
      board([2, 2, 2, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]),
      "left",
    );
    expect(next[0]).toEqual([4, 4, 0, 0]);
    expect(gained).toBe(8);
  });

  it("slides and merges to the right", () => {
    const { board: next, gained } = move(
      board([0, 0, 2, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]),
      "right",
    );
    expect(next[0]).toEqual([0, 0, 0, 4]);
    expect(gained).toBe(4);
  });

  it("slides and merges upward in a column", () => {
    const { board: next, gained } = move(
      board([0, 0, 0, 0], [0, 0, 0, 0], [4, 0, 0, 0], [4, 0, 0, 0]),
      "up",
    );
    expect(next[0][0]).toBe(8);
    expect(next[1][0]).toBe(0);
    expect(gained).toBe(8);
  });

  it("slides and merges downward in a column", () => {
    const { board: next, gained } = move(
      board([4, 0, 0, 0], [4, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]),
      "down",
    );
    expect(next[3][0]).toBe(8);
    expect(next[2][0]).toBe(0);
    expect(gained).toBe(8);
  });

  it("reports moved=false and gains 0 when nothing changes", () => {
    const start = board([2, 4, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]);
    const { board: next, moved, gained } = move(start, "left");
    expect(next).toEqual(start);
    expect(moved).toBe(false);
    expect(gained).toBe(0);
  });

  it("does not mutate the input board", () => {
    const start = board([2, 2, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]);
    const snapshot = start.map((r) => [...r]);
    move(start, "left");
    expect(start).toEqual(snapshot);
  });
});

describe("spawnRandomTile", () => {
  it("adds exactly one tile with value 2 or 4", () => {
    const start = empty();
    const next = spawnRandomTile(start);
    const tiles = next.flat().filter((v) => v !== 0);
    expect(tiles).toHaveLength(1);
    expect([2, 4]).toContain(tiles[0]);
  });

  it("returns the board unchanged when there is no space", () => {
    const full = board(
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2, 4],
      [8, 16, 32, 64],
    );
    expect(spawnRandomTile(full)).toBe(full);
  });
});

describe("createInitialBoard", () => {
  it("starts with exactly two tiles worth 2 or 4", () => {
    const b = createInitialBoard();
    const tiles = b.flat().filter((v) => v !== 0);
    expect(tiles).toHaveLength(2);
    for (const v of tiles) expect([2, 4]).toContain(v);
  });
});

describe("hasAvailableMoves", () => {
  it("is true when an empty cell exists", () => {
    expect(hasAvailableMoves(empty())).toBe(true);
  });

  it("is true when equal tiles can still merge", () => {
    const b = board(
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 2],
      [4, 2, 4, 2],
    );
    expect(hasAvailableMoves(b)).toBe(true);
  });

  it("is false for a full board with no adjacent equal tiles", () => {
    const dead = board(
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    );
    expect(hasAvailableMoves(dead)).toBe(false);
  });
});

describe("hasReachedTarget", () => {
  it("is true once a tile reaches the target value", () => {
    const b = board(
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2048, 4],
      [8, 16, 32, 64],
    );
    expect(hasReachedTarget(b)).toBe(true);
  });

  it("is false when the max tile is below the target", () => {
    const b = board(
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 512, 4],
      [8, 16, 32, 64],
    );
    expect(hasReachedTarget(b)).toBe(false);
  });
});
