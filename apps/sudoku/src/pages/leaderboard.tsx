import { Button, Tabs, useTheme } from "@core/ui";
import { useState } from "react";
import { useNavigate } from "react-router";
import { formatTime, getHighScores } from "../util/highscore";
import type { Level } from "../util/sudoku-generator";

const LEVELS: { value: Level; label: string }[] = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

export const Leaderboard = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState<Level>("easy");
  const scores = getHighScores()[difficulty];
  const { theme } = useTheme();
  const isNeu = theme === "neumorphism";

  return (
    <div className="flex flex-col gap-4 min-w-sm">
      <div className="flex justify-center">
        <Tabs items={LEVELS} value={difficulty} onChange={setDifficulty} />
      </div>
      <div
        className={`flex flex-col gap-1 rounded-2xl p-2 max-h-80 overflow-y-auto ${
          isNeu
            ? "bg-gray-200 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.15),inset_-4px_-4px_8px_rgba(255,255,255,0.7)]"
            : "border border-white/40 bg-white/20 backdrop-blur-md shadow-inner"
        }`}
      >
        {scores.length === 0 ? (
          <p className="text-center text-gray-600 py-4">No scores yet.</p>
        ) : (
          scores.map((entry, index) => (
            <div
              key={`${entry.date}-${index}`}
              className={`flex justify-between rounded-lg transition-colors py-1.5 px-3 ${
                isNeu
                  ? "bg-gray-200 shadow-[3px_3px_6px_rgba(0,0,0,0.1),-3px_-3px_6px_rgba(255,255,255,0.7)]"
                  : "bg-white/20 hover:bg-white/30 border border-white/20"
              }`}
            >
              <span className="font-semibold text-gray-800">#{index + 1}</span>
              <span className="text-gray-800">{formatTime(entry.time)}</span>
              <span className="text-gray-500 text-sm">
                {new Date(entry.date).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </div>
      <Button variant="secondary" onClick={() => navigate("/")}>
        Back to Menu
      </Button>
    </div>
  );
};
