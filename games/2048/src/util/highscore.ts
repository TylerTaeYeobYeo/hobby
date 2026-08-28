import { formatTime } from "@core/utility";

export { formatTime };

export type HighScoreEntry = {
  time: number; // seconds
  score: number;
  date: string; // ISO string
};

const STORAGE_KEY = "2048HighScores";
const MAX_ENTRIES = 10;

// Higher score ranks first; ties broken by whoever reached it faster.
const compareEntries = (a: HighScoreEntry, b: HighScoreEntry): number =>
  b.score - a.score || a.time - b.time;

const readScores = (): HighScoreEntry[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as HighScoreEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const getHighScores = (): HighScoreEntry[] =>
  readScores().sort(compareEntries);

export const addHighScore = (
  time: number,
  score: number,
): { scores: HighScoreEntry[]; rank: number | null } => {
  const entry: HighScoreEntry = { time, score, date: new Date().toISOString() };
  const updated = [...readScores(), entry]
    .sort(compareEntries)
    .slice(0, MAX_ENTRIES);

  const idx = updated.findIndex(
    (e) =>
      e.time === entry.time && e.score === entry.score && e.date === entry.date,
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  // idx === -1 means the entry was cut off and didn't make the top N
  return { scores: updated, rank: idx === -1 ? null : idx + 1 };
};
