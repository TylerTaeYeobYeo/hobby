import { createHighScoreStore, formatTime } from "@core/utility";

export type { HighScoreEntry } from "@core/utility";
export { formatTime };

// 2048 has no difficulty levels, but `createHighScoreStore` is keyed by
// difficulty, so we hide a single internal key behind this module's API.
type Bucket = "classic";

const store = createHighScoreStore<Bucket>({
  storageKey: "2048HighScores",
  difficulties: ["classic"],
});

export const getHighScores = () => store.getHighScores().classic;
export const addHighScore = (time: number) => store.addHighScore("classic", time);
