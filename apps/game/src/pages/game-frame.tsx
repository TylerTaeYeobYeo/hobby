import { Button } from "@core/ui";
import { Navigate, useNavigate, useParams } from "react-router";
import { GAMES } from "../config/games";

export const GameFrame = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const game = GAMES.find((g) => g.id === id);

  if (!game) return <Navigate to="/" replace />;

  return (
    <>
      <iframe
        src={game.url}
        title={game.title}
        className="fixed inset-0 w-full h-full border-0"
        allow="fullscreen"
      />
      <div className="fixed top-4 left-4 z-50">
        <Button variant="secondary" onClick={() => navigate("/")}>
          ← Back
        </Button>
      </div>
    </>
  );
};
