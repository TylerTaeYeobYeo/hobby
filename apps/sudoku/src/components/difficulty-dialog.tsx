import { Button, Dialog } from "@core/ui";
import type { Level } from "../util/sudoku-generator";

export type DifficultyDialogProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (level: Level) => void;
};

const LEVELS: { level: Level; label: string }[] = [
  { level: "easy", label: "Easy" },
  { level: "medium", label: "Medium" },
  { level: "hard", label: "Hard" },
];

export const DifficultyDialog = ({
  open,
  onClose,
  onSelect,
}: DifficultyDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} title="Select Difficulty">
      <div className="flex flex-col gap-2 min-w-48">
        {LEVELS.map(({ level, label }) => (
          <Button
            key={level}
            variant="secondary"
            onClick={() => onSelect(level)}
          >
            {label}
          </Button>
        ))}
      </div>
    </Dialog>
  );
};
