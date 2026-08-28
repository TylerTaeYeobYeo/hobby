import { useTheme } from "@core/ui";
import { useLayoutEffect, useRef, useState } from "react";
import { BOARD_SIZE, type Board as BoardData } from "../util/board";
import { Tile } from "./tile";

export type BoardProps = {
  board: BoardData;
};

const MAX_CELL = 80;
const MIN_CELL = 48;
// board has p-1.5 (6 px each side = 12 px) + 1 px gap between each pair of cols
const boardOverhead = 12 + (BOARD_SIZE - 1);

export const Board = ({ board }: BoardProps) => {
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
      setCellSize(
        Math.max(
          MIN_CELL,
          Math.min(MAX_CELL, Math.floor((w - boardOverhead) / BOARD_SIZE)),
        ),
      );
    compute(el.clientWidth);
    const ro = new ResizeObserver(([e]) => compute(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className="w-full touch-none">
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
          gridTemplateColumns: `repeat(${BOARD_SIZE}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${BOARD_SIZE}, ${cellSize}px)`,
          justifyContent: "center",
        }}
      >
        {board.map((row, r) =>
          row.map((value, c) => <Tile key={`${r}-${c}`} value={value} />),
        )}
      </div>
    </div>
  );
};
