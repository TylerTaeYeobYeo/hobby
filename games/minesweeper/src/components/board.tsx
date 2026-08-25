import { useTheme } from "@core/ui";
import type { MinesweeperGrid } from "../util/minesweeper-generator";
import { BoardCell } from "./board-cell";

export type BoardProps = {
  rows: number;
  cols: number;
  grid: MinesweeperGrid | null;
  revealed: boolean[][];
  flagged: boolean[][];
  disabled?: boolean;
  explodedCell?: { row: number; col: number } | null;
  onReveal: (row: number, col: number) => void;
  onToggleFlag: (row: number, col: number) => void;
  onChord: (row: number, col: number) => void;
};

const CELL_SIZE = 28; // px, matches w-7/h-7

export const Board = ({
  rows,
  cols,
  grid,
  revealed,
  flagged,
  disabled,
  explodedCell,
  onReveal,
  onToggleFlag,
  onChord,
}: BoardProps) => {
  const { theme } = useTheme();
  const isNeu = theme === "neumorphism";
  const isMaterial = theme === "material";
  const isCyberpunk = theme === "cyberpunk";

  return (
    <div
      className={`rounded-2xl p-1.5 gap-px overflow-hidden ${
        isNeu
          ? "bg-gray-200 shadow-[12px_12px_24px_rgba(0,0,0,0.2),-12px_-12px_24px_rgba(255,255,255,0.7)]"
          : isMaterial
            ? "bg-gray-200 shadow-lg"
            : isCyberpunk
              ? "bg-[#0d0d1a] border border-[#00e5ff]/30 shadow-[0_0_30px_rgba(0,229,255,0.1)] rounded-sm"
              : "bg-white/40 border border-white/50 shadow-2xl backdrop-blur-md"
      }`}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, ${CELL_SIZE}px)`,
        gridTemplateRows: `repeat(${rows}, ${CELL_SIZE}px)`,
      }}
    >
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => (
          <BoardCell
            key={`${row}-${col}`}
            isMine={grid?.[row]?.[col]?.isMine ?? false}
            adjacentMines={grid?.[row]?.[col]?.adjacentMines ?? 0}
            isRevealed={revealed[row]?.[col] ?? false}
            isFlagged={flagged[row]?.[col] ?? false}
            isExploded={explodedCell?.row === row && explodedCell?.col === col}
            disabled={disabled}
            onReveal={() => onReveal(row, col)}
            onToggleFlag={() => onToggleFlag(row, col)}
            onChord={() => onChord(row, col)}
          />
        )),
      )}
    </div>
  );
};
