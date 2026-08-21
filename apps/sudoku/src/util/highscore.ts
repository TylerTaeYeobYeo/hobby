import type { Level } from "./sudoku-generator";

export type HighScoreEntry = {
  time: number; // seconds
  date: string; // ISO string
};

export type HighScores = Record<Level, HighScoreEntry[]>;

const STORAGE_KEY = "sudokuHighScores";
const MAX_ENTRIES = 10;

const emptyScores = (): HighScores => ({
  easy: [],
  medium: [],
  hard: [],
});

export const getHighScores = (): HighScores => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return emptyScores();
  try {
    const parsed = JSON.parse(raw) as Partial<HighScores>;
    return {
      easy: parsed.easy ?? [],
      medium: parsed.medium ?? [],
      hard: parsed.hard ?? [],
    };
  } catch {
    return emptyScores();
  }
};

export const addHighScore = (
  difficulty: Level,
  time: number,
): { scores: HighScoreEntry[]; rank: number } => {
  const scores = getHighScores();
  const entry: HighScoreEntry = { time, date: new Date().toISOString() };
  const updated = [...scores[difficulty], entry]
    .sort((a, b) => a.time - b.time)
    .slice(0, MAX_ENTRIES);

  const rank = updated.findIndex(
    (e) => e.time === entry.time && e.date === entry.date,
  );

  scores[difficulty] = updated;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));

  return { scores: updated, rank: rank === -1 ? updated.length : rank + 1 };
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(2);
  return `${mins.toString().padStart(2, "0")}:${secs.padStart(5, "0")}`;
};
