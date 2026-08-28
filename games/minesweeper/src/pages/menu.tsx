import { Button } from "@core/ui";
import { useState } from "react";
import { useNavigate } from "react-router";
import { DifficultyDialog } from "../components/difficulty-dialog";
import type { Level } from "../util/minesweeper-generator";

export const Menu = () => {
  const navigate = useNavigate();
  const [showDifficultyDialog, setShowDifficultyDialog] = useState(false);

  const handleSelectDifficulty = (level: Level) => {
    setShowDifficultyDialog(false);
    navigate(`game?isNew=true&difficulty=${level}`);
  };

  return (
    <div className="flex flex-col justify-center gap-2 min-w-48">
      <Button onClick={() => setShowDifficultyDialog(true)}>New Game</Button>
      <Button variant="secondary" onClick={() => navigate("game?isNew=false")}>
        Load Game
      </Button>
      <Button variant="secondary" onClick={() => navigate("leaderboard")}>
        Leaderboard
      </Button>
      <DifficultyDialog
        open={showDifficultyDialog}
        onClose={() => setShowDifficultyDialog(false)}
        onSelect={handleSelectDifficulty}
      />
    </div>
  );
};
