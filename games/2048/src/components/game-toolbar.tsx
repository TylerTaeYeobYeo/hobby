import { Button } from "@core/ui";
import type { RefObject } from "react";
import { ScoreCounter } from "./score-counter";
import { Timer, type TimerHandle } from "./timer";

export type GameToolbarProps = {
  timerRef: RefObject<TimerHandle | null>;
  startTime: number;
  score: number;
  onBack: () => void;
  onReset: () => void;
  onSave: () => void;
};

export const GameToolbar = ({
  timerRef,
  startTime,
  score,
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
        <ScoreCounter score={score} />
      </div>
    </div>
    <div className="flex gap-2 items-center justify-end flex-wrap">
      <Button variant="danger" onClick={onReset}>
        Reset
      </Button>
      <Button variant="secondary" onClick={onSave}>
        Save
      </Button>
    </div>
  </div>
);
