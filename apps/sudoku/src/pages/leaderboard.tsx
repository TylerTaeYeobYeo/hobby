import { Button } from "@core/ui";
import { useState } from "react";
import { useNavigate } from "react-router";
import { formatTime, getHighScores } from "../util/highscore";
import type { Level } from "../util/sudoku-generator";

const LEVELS: { level: Level; label: string }[] = [
  { level: "easy", label: "Easy" },
  { level: "medium", label: "Medium" },
  { level: "hard", label: "Hard" },
];

export const Leaderboard = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState<Level>("easy");
  const scores = getHighScores()[difficulty];

  return (
    <div className="flex flex-col gap-4 min-w-sm">
      <div className="flex justify-center gap-2">
        {LEVELS.map(({ level, label }) => (
          <Button
            key={level}
            variant={difficulty === level ? "primary" : "secondary"}
            onClick={() => setDifficulty(level)}
          >
            {label}
          </Button>
        ))}
      </div>
      <div className="flex flex-col gap-1">
        {scores.length === 0 ? (
          <p className="text-center text-gray-500">No scores yet.</p>
        ) : (
          scores.map((entry, index) => (
            <div
              key={`${entry.date}-${index}`}
              className="flex justify-between border-b border-gray-200 py-1 px-2"
            >
              <span className="font-semibold">#{index + 1}</span>
              <span>{formatTime(entry.time)}</span>
              <span className="text-gray-400 text-sm">
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
