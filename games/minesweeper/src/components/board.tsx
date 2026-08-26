import { useTheme } from "@core/ui";
import { useLayoutEffect, useRef, useState } from "react";
import type { MinesweeperGrid } from "../util/minesweeper-generator";
import { BoardCell } from "./board-cell";

export type BoardProps = {
  rows: number;
  cols: number;
  grid: MinesweeperGrid | null;
  revealed: boolean[][];
  flagged: boolean[][];
  disabled?: boolean;
  flagMode?: boolean;
  explodedCell?: { row: number; col: number } | null;
  onReveal: (row: number, col: number) => void;
  onToggleFlag: (row: number, col: number) => void;
  onChord: (row: number, col: number) => void;
};

const MAX_CELL = 28;
const MIN_CELL = 16;
// board has p-1.5 (6 px each side = 12 px) + 1 px gap between each pair of cols
const boardOverhead = (cols: number) => 12 + (cols - 1);

export const Board = ({
  rows,
  cols,
  grid,
  revealed,
  flagged,
  disabled,
  flagMode,
  explodedCell,
  onReveal,
  onToggleFlag,
  onChord,
}: BoardProps) => {
  const { theme } = useTheme();
  const isNeu = theme === "neumorphism";
  const isMaterial = theme === "material";
  const isCyberpunk = theme === "cyberpunk";

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(MAX_CELL);

  useLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const compute = (w: number) =>
      setCellSize(Math.max(MIN_CELL, Math.min(MAX_CELL, Math.floor((w - boardOverhead(cols)) / cols))));
    compute(el.clientWidth);
    const ro = new ResizeObserver(([e]) => compute(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [cols]);

  return (
    <div ref={wrapperRef} className="w-full">
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
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
          justifyContent: "center",
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
              flagMode={flagMode}
              onReveal={() => onReveal(row, col)}
              onToggleFlag={() => onToggleFlag(row, col)}
              onChord={() => onChord(row, col)}
            />
          )),
      )}
      </div>
    </div>
  );
};
