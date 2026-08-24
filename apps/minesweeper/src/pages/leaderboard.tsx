import { Button } from "@core/ui";
import { useNavigate } from "react-router";

// Placeholder page — no scores exist until Minesweeper gameplay is implemented.
export const Leaderboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-4 min-w-sm">
      <p className="text-gray-600">Coming soon.</p>
      <Button variant="secondary" onClick={() => navigate("/")}>
        Back to Menu
      </Button>
    </div>
  );
};
