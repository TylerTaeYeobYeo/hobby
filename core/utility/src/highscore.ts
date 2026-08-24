export type HighScoreEntry = {
  time: number; // seconds
  date: string; // ISO string
};

export type HighScores<TDifficulty extends string> = Record<
  TDifficulty,
  HighScoreEntry[]
>;

export type HighScoreStoreOptions<TDifficulty extends string> = {
  /** localStorage key the scores are persisted under. */
  storageKey: string;
  /** All valid difficulty keys tracked by this store. */
  difficulties: readonly TDifficulty[];
  /** Max entries kept per difficulty, sorted ascending by time. Defaults to 10. */
  maxEntries?: number;
};

export type HighScoreStore<TDifficulty extends string> = {
  getHighScores: () => HighScores<TDifficulty>;
  addHighScore: (
    difficulty: TDifficulty,
    time: number,
  ) => { scores: HighScoreEntry[]; rank: number | null };
};

/**
 * Creates a localStorage-backed, per-difficulty high score store.
 * Scores are kept sorted ascending by time (fastest first).
 */
export const createHighScoreStore = <TDifficulty extends string>({
  storageKey,
  difficulties,
  maxEntries = 10,
}: HighScoreStoreOptions<TDifficulty>): HighScoreStore<TDifficulty> => {
  const emptyScores = (): HighScores<TDifficulty> =>
    Object.fromEntries(
      difficulties.map((d) => [d, []]),
    ) as unknown as HighScores<TDifficulty>;

  const getHighScores = (): HighScores<TDifficulty> => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return emptyScores();
    try {
      const parsed = JSON.parse(raw) as Partial<HighScores<TDifficulty>>;
      const scores = emptyScores();
      for (const difficulty of difficulties) {
        scores[difficulty] = parsed[difficulty] ?? [];
      }
      return scores;
    } catch {
      return emptyScores();
    }
  };

  const addHighScore = (
    difficulty: TDifficulty,
    time: number,
  ): { scores: HighScoreEntry[]; rank: number | null } => {
    const scores = getHighScores();
    const entry: HighScoreEntry = { time, date: new Date().toISOString() };
    const updated = [...scores[difficulty], entry]
      .sort((a, b) => a.time - b.time)
      .slice(0, maxEntries);

    const idx = updated.findIndex(
      (e) => e.time === entry.time && e.date === entry.date,
    );

    scores[difficulty] = updated;
    localStorage.setItem(storageKey, JSON.stringify(scores));

    // idx === -1 means the entry was cut off and didn't make the top N
    return { scores: updated, rank: idx === -1 ? null : idx + 1 };
  };

  return { getHighScores, addHighScore };
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(2);
  return `${mins.toString().padStart(2, "0")}:${secs.padStart(5, "0")}`;
};
