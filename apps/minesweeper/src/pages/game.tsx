import { Button } from "@core/ui";
import { useNavigate } from "react-router";

// Placeholder page — Minesweeper gameplay is not implemented yet.
export const Game = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-4 min-w-3xl">
      <p className="text-gray-600">Coming soon.</p>
      <Button variant="secondary" onClick={() => navigate("/")}>
        Back to Menu
      </Button>
    </div>
  );
};
