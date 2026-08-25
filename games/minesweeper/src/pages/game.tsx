import { useRef } from "react";
import { Board } from "../components/board";
import { GameToolbar } from "../components/game-toolbar";
import type { TimerHandle } from "../components/timer";
import { useGameState } from "../hooks/use-game-state";
import { formatTime } from "../util/highscore";

export const Game = () => {
  const timerRef = useRef<TimerHandle | null>(null);
  const {
    isLoading,
    rows,
    cols,
    grid,
    revealed,
    flagged,
    status,
    explodedCell,
    remainingMines,
    finalTime,
    rank,
    startTime,
    handleReveal,
    handleChord,
    handleToggleFlag,
    handleReset,
    handleSave,
    handleBack,
  } = useGameState(timerRef);

  if (isLoading) return <div>Loading...</div>;

  const boardDisabled = status === "won" || status === "lost";

  return (
    <div className="flex flex-col items-center gap-4 min-w-3xl">
      <GameToolbar
        timerRef={timerRef}
        startTime={startTime}
        remainingMines={remainingMines}
        onBack={handleBack}
        onReset={handleReset}
        onSave={handleSave}
      />

      <Board
        rows={rows}
        cols={cols}
        grid={grid}
        revealed={revealed}
        flagged={flagged}
        disabled={boardDisabled}
        explodedCell={explodedCell}
        onReveal={handleReveal}
        onToggleFlag={handleToggleFlag}
        onChord={handleChord}
      />

      {status === "won" && (
        <p className="font-semibold text-green-700">
          🎉 You cleared the field in {formatTime(finalTime ?? 0)}
          {rank !== null ? ` — ranked #${rank}!` : "!"}
        </p>
      )}
      {status === "lost" && (
        <p className="font-semibold text-red-700">💥 Game over.</p>
      )}
    </div>
  );
};
