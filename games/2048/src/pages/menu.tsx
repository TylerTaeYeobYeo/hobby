import { Button } from "@core/ui";
import { useNavigate } from "react-router";

export const Menu = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center gap-2 min-w-48">
      <Button onClick={() => navigate("game?isNew=true")}>New Game</Button>
      <Button variant="secondary" onClick={() => navigate("game?isNew=false")}>
        Load Game
      </Button>
      <Button variant="secondary" onClick={() => navigate("leaderboard")}>
        Leaderboard
      </Button>
    </div>
  );
};
