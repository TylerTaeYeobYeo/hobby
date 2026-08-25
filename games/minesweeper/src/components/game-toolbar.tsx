import { Button } from "@core/ui";
import type { RefObject } from "react";
import { MineCounter } from "./mine-counter";
import { Timer, type TimerHandle } from "./timer";

export type GameToolbarProps = {
  timerRef: RefObject<TimerHandle | null>;
  startTime: number;
  remainingMines: number;
  onBack: () => void;
  onReset: () => void;
  onSave: () => void;
};

export const GameToolbar = ({
  timerRef,
  startTime,
  remainingMines,
  onBack,
  onReset,
  onSave,
}: GameToolbarProps) => (
  <div className="flex justify-between items-center gap-4">
    <Button variant="secondary" onClick={onBack}>
      ← Back
    </Button>
    <div className="flex gap-2 items-center">
      <Timer ref={timerRef} startTime={startTime} />
      <MineCounter remainingMines={remainingMines} />
    </div>
    <div className="flex gap-2 items-center">
      <Button variant="danger" onClick={onReset}>
        Reset
      </Button>
      <Button variant="secondary" onClick={onSave}>
        Save
      </Button>
    </div>
  </div>
);
