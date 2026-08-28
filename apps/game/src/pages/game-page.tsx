import { Button } from "@core/ui";
import { Game2048 } from "@games/2048";
import { MinesweeperGame } from "@games/minesweeper";
import { SudokuGame } from "@games/sudoku";
import { useNavigate } from "react-router";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <div className="fixed top-4 left-4 z-[100]">
      <Button variant="secondary" onClick={() => navigate("/")}>
        ← Back
      </Button>
    </div>
  );
};

export const MinesweeperPage = () => (
  <>
    <BackButton />
    <MinesweeperGame />
  </>
);

export const SudokuPage = () => (
  <>
    <BackButton />
    <SudokuGame />
  </>
);

export const Game2048Page = () => (
  <>
    <BackButton />
    <Game2048 />
  </>
);
