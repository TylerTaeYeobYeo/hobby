import { Button, Tabs } from "@core/ui";
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

  return (
    <div className="flex flex-col gap-4 min-w-sm">
      <div className="flex justify-center">
        <Tabs items={LEVELS} value={difficulty} onChange={setDifficulty} />
      </div>
      <div className="flex flex-col gap-1 rounded-2xl border border-white/40 bg-white/20 p-2 backdrop-blur-md shadow-inner max-h-80 overflow-y-auto">
        {scores.length === 0 ? (
          <p className="text-center text-gray-600 py-4">No scores yet.</p>
        ) : (
          scores.map((entry, index) => (
            <div
              key={`${entry.date}-${index}`}
              className="flex justify-between rounded-lg bg-white/20 hover:bg-white/30 transition-colors border border-white/20 py-1.5 px-3"
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
