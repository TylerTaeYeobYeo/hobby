import { useTheme } from "@core/ui";
import type { MouseEvent } from "react";

export type BoardCellProps = {
  isMine: boolean;
  adjacentMines: number;
  isRevealed: boolean;
  isFlagged: boolean;
  isExploded?: boolean;
  disabled?: boolean;
  onReveal: () => void;
  onToggleFlag: () => void;
  onChord: () => void;
};

const NUMBER_COLORS: Record<number, string> = {
  1: "text-blue-600",
  2: "text-green-600",
  3: "text-red-600",
  4: "text-indigo-800",
  5: "text-rose-800",
  6: "text-teal-600",
  7: "text-gray-900",
  8: "text-gray-500",
};

export const BoardCell = ({
  isMine,
  adjacentMines,
  isRevealed,
  isFlagged,
  isExploded,
  disabled,
  onReveal,
  onToggleFlag,
  onChord,
}: BoardCellProps) => {
  const { theme } = useTheme();
  const isNeu = theme === "neumorphism";
  const isMaterial = theme === "material";
  const isCupertino = theme === "cupertino";
  const isCyberpunk = theme === "cyberpunk";

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    if (disabled || isRevealed) return;
    onToggleFlag();
  };

  const handleClick = () => {
    if (disabled || isRevealed || isFlagged) return;
    onReveal();
  };

  // Chording: holding both mouse buttons on a revealed number reveals its
  // unflagged neighbors once enough adjacent mines are flagged.
  const handleMouseDown = (e: MouseEvent) => {
    if (disabled || !isRevealed || adjacentMines === 0) return;
    if (e.buttons === 3) onChord();
  };

  const bgClass = isExploded
    ? "bg-red-500"
    : isRevealed
      ? isNeu
        ? "bg-gray-200 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15),inset_-2px_-2px_4px_rgba(255,255,255,0.7)]"
        : isMaterial
          ? "bg-gray-100"
          : isCupertino
            ? "bg-[#F2F2F7]"
            : isCyberpunk
              ? "bg-[#1a1a2e]"
              : "bg-white/35 border border-black/15"
      : isNeu
        ? "bg-gray-200 shadow-[3px_3px_6px_rgba(0,0,0,0.2),-3px_-3px_6px_rgba(255,255,255,0.7)] hover:brightness-105"
        : isMaterial
          ? "bg-white shadow hover:bg-gray-50"
          : isCupertino
            ? "bg-white border border-[#E5E5EA] hover:bg-[#F2F2F7]"
            : isCyberpunk
              ? "bg-[#12121f] border border-[#00e5ff]/20 hover:border-[#00e5ff]/50"
              : "bg-white/50 border border-black/25 hover:bg-white/65 hover:border-black/35";

  return (
    <div
      className={`w-7 h-7 flex items-center justify-center select-none text-sm font-bold cursor-pointer ${
        disabled ? "cursor-not-allowed" : ""
      } ${bgClass}`}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onMouseDown={handleMouseDown}
    >
      {isRevealed ? (
        isMine ? (
          <span aria-label="mine">💣</span>
        ) : adjacentMines > 0 ? (
          <span
            className={
              isCyberpunk ? "text-[#00e5ff]" : NUMBER_COLORS[adjacentMines]
            }
          >
            {adjacentMines}
          </span>
        ) : null
      ) : isFlagged ? (
        <span aria-label="flag">🚩</span>
      ) : null}
    </div>
  );
};
