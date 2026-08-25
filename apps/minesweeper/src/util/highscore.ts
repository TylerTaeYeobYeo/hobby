import { createHighScoreStore, formatTime } from "@core/utility";
import type { Level } from "./minesweeper-generator";

export type { HighScoreEntry, HighScores } from "@core/utility";
export { formatTime };

const store = createHighScoreStore<Level>({
  storageKey: "minesweeperHighScores",
  difficulties: ["easy", "medium", "hard"],
});

export const getHighScores = store.getHighScores;
export const addHighScore = store.addHighScore;
