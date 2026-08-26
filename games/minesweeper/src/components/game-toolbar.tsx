import { Button } from "@core/ui";
import type { RefObject } from "react";
import { MineCounter } from "./mine-counter";
import { Timer, type TimerHandle } from "./timer";

export type GameToolbarProps = {
  timerRef: RefObject<TimerHandle | null>;
  startTime: number;
  remainingMines: number;
  flagMode: boolean;
  onToggleFlagMode: () => void;
  onBack: () => void;
  onReset: () => void;
  onSave: () => void;
};

export const GameToolbar = ({
  timerRef,
  startTime,
  remainingMines,
  flagMode,
  onToggleFlagMode,
  onBack,
  onReset,
  onSave,
}: GameToolbarProps) => (
  <div className="flex flex-col gap-2 w-full">
    <div className="flex items-center justify-between gap-2">
      <Button variant="secondary" onClick={onBack}>
        ← Back
      </Button>
      <div className="flex gap-2 items-center">
        <Timer ref={timerRef} startTime={startTime} />
        <MineCounter remainingMines={remainingMines} />
      </div>
    </div>
    <div className="flex gap-2 items-center justify-end flex-wrap">
      {/* Flag-mode toggle — primary tap action on mobile instead of right-click */}
      <Button
        variant={flagMode ? "primary" : "secondary"}
        onClick={onToggleFlagMode}
        aria-label={flagMode ? "Switch to reveal mode" : "Switch to flag mode"}
        aria-pressed={flagMode}
      >
        🚩 {flagMode ? "Flagging" : "Flag"}
      </Button>
      <Button variant="danger" onClick={onReset}>
        Reset
      </Button>
      <Button variant="secondary" onClick={onSave}>
        Save
      </Button>
    </div>
  </div>
);
