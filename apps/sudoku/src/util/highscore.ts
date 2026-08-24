import { createHighScoreStore, formatTime } from "@core/utility";
import type { Level } from "./sudoku-generator";

export type { HighScoreEntry, HighScores } from "@core/utility";
export { formatTime };

const store = createHighScoreStore<Level>({
  storageKey: "sudokuHighScores",
  difficulties: ["easy", "medium", "hard"],
});

export const getHighScores = store.getHighScores;
export const addHighScore = store.addHighScore;
