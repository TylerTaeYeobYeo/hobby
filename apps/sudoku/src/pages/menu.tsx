import { useNavigate } from "react-router";

export const Menu = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center gap-2">
      <button onClick={() => navigate("/game?isNew=true")}>New Game</button>
      <button onClick={() => navigate("/game?isNew=false")}>Load Game</button>
      <button>Leaderboard</button>
    </div>
  );
};
