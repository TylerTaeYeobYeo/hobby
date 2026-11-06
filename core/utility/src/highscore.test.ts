import { beforeEach, describe, expect, it } from "vitest";
import {
  createHighScoreStore,
  formatTime,
  type HighScores,
} from "./highscore";

const KEY = "test-high-scores";
const DIFFICULTIES = ["easy", "hard"] as const;
type Difficulty = (typeof DIFFICULTIES)[number];

const makeStore = (maxEntries?: number) =>
  createHighScoreStore<Difficulty>({
    storageKey: KEY,
    difficulties: DIFFICULTIES,
    maxEntries,
  });

describe("createHighScoreStore", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns empty score lists for every difficulty", () => {
    const store = makeStore();
    expect(store.getHighScores()).toEqual({ easy: [], hard: [] });
  });

  it("adds scores per difficulty and ranks the fastest first", () => {
    const store = makeStore();

    expect(store.addHighScore("easy", 120).rank).toBe(1);
    // A faster time takes rank 1, pushing the previous one down.
    expect(store.addHighScore("easy", 90).rank).toBe(1);
    // Other difficulties are tracked independently.
    expect(store.addHighScore("hard", 300).rank).toBe(1);

    const scores = store.getHighScores();
    expect(scores.easy.map((e) => e.time)).toEqual([90, 120]);
    expect(scores.hard).toHaveLength(1);
  });

  it("keeps only the fastest `maxEntries` scores", () => {
    const store = makeStore(3);
    for (const t of [100, 200, 300, 400]) {
      store.addHighScore("easy", t);
    }
    const scores = store.getHighScores();
    expect(scores.easy.map((e) => e.time)).toEqual([100, 200, 300]);
  });

  it("returns rank null when the entry does not make the top list", () => {
    const store = makeStore(2);
    store.addHighScore("easy", 100);
    store.addHighScore("easy", 200);
    expect(store.addHighScore("easy", 300).rank).toBeNull();
    expect(store.getHighScores().easy).toHaveLength(2);
  });

  it("recovers from corrupted storage instead of throwing", () => {
    localStorage.setItem(KEY, "{not json");
    const store = makeStore();
    expect(store.getHighScores()).toEqual({ easy: [], hard: [] });
    // The store must still be usable after a bad read.
    expect(store.addHighScore("easy", 50).rank).toBe(1);
  });

  it("ignores unknown difficulties found in storage", () => {
    const stored: HighScores<Difficulty> = {
      easy: [{ time: 10, date: "2026-01-01T00:00:00.000Z" }],
      hard: [],
    };
    localStorage.setItem(KEY, JSON.stringify({ ...stored, insane: [{ time: 1 }] }));
    const store = makeStore();
    expect(store.getHighScores().easy).toHaveLength(1);
    expect(store.getHighScores().hard).toHaveLength(0);
  });
});

describe("formatTime", () => {
  it("formats seconds as mm:ss.ss", () => {
    expect(formatTime(0)).toBe("00:00.00");
    expect(formatTime(65)).toBe("01:05.00");
    expect(formatTime(5.5)).toBe("00:05.50");
    expect(formatTime(3661)).toBe("61:01.00");
  });
});
