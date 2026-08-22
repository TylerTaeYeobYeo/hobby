import { useTheme } from "@core/ui";
import { useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";

export type BoardProps = {
  board: number[][];
  memo?: string[][][];
  given?: boolean[][];
  invalidCells?: boolean[][];
  status?: "playing" | "paused" | "completed";
  hoveredNumber?: number | null;
  hintNumber?: number | null;
  selected?: { row: number; col: number } | null;
  onSelectCell?: (row: number, col: number) => void;
  onCellChange?: (
    row: number,
    col: number,
    newValue: number,
    newMemo?: string[],
  ) => void;
};

const MEMO_NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// A cell should be highlighted (as "can't place hovered number here") when:
// - it already contains that number, OR
// - it shares a row/col/box with a cell that contains that number
const shouldHighlight = (
  board: number[][],
  row: number,
  col: number,
  hoveredNumber: number,
): boolean => {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === hoveredNumber) return true;
    if (board[i][col] === hoveredNumber) return true;
  }
  const boxRowStart = Math.floor(row / 3) * 3;
  const boxColStart = Math.floor(col / 3) * 3;
  for (let r = boxRowStart; r < boxRowStart + 3; r++) {
    for (let c = boxColStart; c < boxColStart + 3; c++) {
      if (board[r][c] === hoveredNumber) return true;
    }
  }
  return false;
};

export const BoardCell = ({
  value,
  memo,
  isGiven,
  isSelected,
  isHighlighted,
  isInvalid,
  hintNumber,
  onSelect,
  onChange,
}: {
  value: number;
  memo?: string[];
  isGiven?: boolean;
  isSelected?: boolean;
  isHighlighted?: boolean;
  isInvalid?: boolean;
  hintNumber?: number | null;
  onSelect?: () => void;
  onChange?: (newValue: number, newMemo?: string[]) => void;
}) => {
  const cellRef = useRef<HTMLDivElement>(null);
  const [memoPopupRect, setMemoPopupRect] = useState<{
    top: number;
    bottom: number;
    left: number;
    width: number;
  } | null>(null);
  const { theme } = useTheme();
  const isNeu = theme === "neumorphism";
  const isMaterial = theme === "material";
  const isCupertino = theme === "cupertino";

  const bgClass = isInvalid
    ? isNeu
      ? "bg-red-100 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]"
      : isCupertino
        ? "bg-red-50"
        : "bg-red-100"
    : isNeu
      ? isGiven
        ? "bg-gray-200 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15),inset_-2px_-2px_4px_rgba(255,255,255,0.7)]"
        : isSelected
          ? "bg-blue-100 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15),inset_-3px_-3px_6px_rgba(255,255,255,0.6)]"
          : isHighlighted
            ? "bg-sky-100 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.6)]"
            : "bg-gray-200 hover:brightness-105"
      : isMaterial
        ? isGiven
          ? "bg-gray-100"
          : isSelected
            ? "bg-blue-100"
            : isHighlighted
              ? "bg-sky-100"
              : "bg-white hover:bg-gray-50"
        : isCupertino
          ? isGiven
            ? "bg-[#F2F2F7]"
            : isSelected
              ? "bg-[#007AFF]/15"
              : isHighlighted
                ? "bg-[#007AFF]/10"
                : "bg-white hover:bg-[#F2F2F7]"
          : isGiven
            ? "bg-white/40"
            : isSelected
              ? "bg-blue-300/50"
              : isHighlighted
                ? "bg-sky-300/40"
                : "bg-white/15 hover:bg-white/25";

  const handleCellClick = () => {
    onSelect?.();
    if (hintNumber && !isGiven && value === 0) {
      onChange?.(hintNumber, memo);
    }
  };

  const handleCellRightClick = (e: MouseEvent) => {
    e.preventDefault();
    if (isGiven) return;

    if (hintNumber && value === 0) {
      const newMemo = memo?.includes(hintNumber.toString())
        ? memo.filter((m) => m !== hintNumber.toString())
        : [...(memo || []), hintNumber.toString()];
      onChange?.(value, newMemo);
      return;
    }

    const rect = cellRef.current?.getBoundingClientRect();
    if (rect) {
      setMemoPopupRect({ top: rect.top, bottom: rect.bottom, left: rect.left, width: rect.width });
    }
  };

  return (
    <div
      ref={cellRef}
      className={`w-12 h-12 flex flex-col items-center justify-center relative transition-colors duration-150 ${
        isNeu || isMaterial || isCupertino ? "" : "backdrop-blur-md"
      } ${bgClass}`}
      onContextMenu={handleCellRightClick}
      onClick={handleCellClick}
    >
      {isGiven ? (
        <span className="font-bold text-gray-800 select-none">{value}</span>
      ) : (
        <input
          style={{ width: "100%", height: "100%", textAlign: "center" }}
          className={`bg-transparent relative z-10 font-semibold outline-none ${isInvalid ? "text-red-500" : "text-gray-900"}`}
          type="text"
          value={value === 0 ? "" : value}
          onChange={(e) => {
            const newValue = parseInt(e.target.value, 10);
            if (!isNaN(newValue) && newValue >= 1 && newValue <= 9) {
              onChange?.(newValue, memo);
            } else if (e.target.value === "") {
              onChange?.(0, memo);
            }
          }}
        />
      )}
      {value === 0 && memo && memo.length > 0 && (
        <div className="grid grid-cols-3 grid-rows-3 w-full h-full pointer-events-none text-[0.55rem] leading-none text-gray-600 absolute inset-0">
          {MEMO_NUMS.map((num) => (
            <div key={num} className="flex items-center justify-center">
              {memo.includes(num.toString()) ? num : ""}
            </div>
          ))}
        </div>
      )}
      {/* memo popover rendered into body via portal to escape overflow-hidden */}
      {memoPopupRect && !isGiven &&
        createPortal(
          (() => {
            const POPUP_HEIGHT = 124; // approx height of 3-row grid + padding
            const spaceBelow = window.innerHeight - memoPopupRect.bottom;
            const top =
              spaceBelow >= POPUP_HEIGHT + 6
                ? memoPopupRect.bottom + 6
                : memoPopupRect.top - POPUP_HEIGHT - 6;
            return (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMemoPopupRect(null)}
                />
                <dialog
                  open
                  className={`fixed p-2 z-50 w-fit h-fit rounded-xl ${
                    isNeu
                      ? "bg-gray-200 shadow-[8px_8px_16px_rgba(0,0,0,0.25),-8px_-8px_16px_rgba(255,255,255,0.7)]"
                      : isMaterial
                        ? "bg-white shadow-xl"
                        : isCupertino
                          ? "bg-white/95 backdrop-blur-xl border border-[#E5E5EA] shadow-lg"
                          : "bg-white/40 backdrop-blur-2xl border border-white/50 shadow-xl"
                  }`}
                  style={{
                    top,
                    left: memoPopupRect.left + memoPopupRect.width / 2,
                    transform: "translateX(-50%)",
                  }}
                >
                  <div className="grid grid-cols-3 gap-1 w-max h-max">
                    {MEMO_NUMS.map((num) => {
                      const selected = memo?.includes(num.toString());
                      return (
                        <button
                          key={num}
                          className={`rounded-md w-8 h-8 flex items-center justify-center font-medium text-gray-800 transition-colors cursor-pointer ${
                            isNeu
                              ? selected
                                ? "bg-gray-200 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2),inset_-2px_-2px_4px_rgba(255,255,255,0.7)]"
                                : "bg-gray-200 shadow-[2px_2px_4px_rgba(0,0,0,0.15),-2px_-2px_4px_rgba(255,255,255,0.7)] hover:brightness-105"
                              : isMaterial
                                ? selected
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-50 hover:bg-gray-100"
                                : isCupertino
                                  ? selected
                                    ? "bg-[#007AFF] text-white"
                                    : "bg-[#F2F2F7] hover:bg-[#E5E5EA]"
                                  : selected
                                    ? "border border-white/40 bg-blue-300/50"
                                    : "border border-white/40 bg-white/20 hover:bg-white/40"
                          }`}
                          onClick={() => {
                            const newMemo = memo?.includes(num.toString())
                              ? memo.filter((m) => m !== num.toString())
                              : [...(memo || []), num.toString()];
                            onChange?.(value, newMemo);
                          }}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                </dialog>
              </>
            );
          })(),
          document.body,
        )}
    </div>
  );
};

export const Board = ({
  board,
  memo,
  given,
  invalidCells,
  status,
  hoveredNumber,
  hintNumber,
  selected,
  onSelectCell,
  onCellChange,
}: BoardProps) => {
  const { theme } = useTheme();
  const isNeu = theme === "neumorphism";
  const isMaterial = theme === "material";

  const CELL_SIZE = 48; // px, matches w-12/h-12
  const DIVIDER_SIZE = 6; // px
  const BOARD_PADDING = 6; // px, matches p-1.5
  const BOARD_SIZE = CELL_SIZE * 9 + DIVIDER_SIZE * 2 + BOARD_PADDING * 2;

  if (status === "paused") {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl text-gray-700 font-semibold text-lg ${
          isNeu
            ? "bg-gray-200 shadow-[12px_12px_24px_rgba(0,0,0,0.2),-12px_-12px_24px_rgba(255,255,255,0.7)]"
            : isMaterial
              ? "bg-white shadow-lg"
              : "border border-white/50 bg-white/30 backdrop-blur-md shadow-2xl"
        }`}
        style={{ width: BOARD_SIZE, height: BOARD_SIZE }}
      >
        Game paused
      </div>
    );
  }

  const trackSizes = Array.from({ length: 11 }, (_, i) =>
    i === 3 || i === 7 ? `${DIVIDER_SIZE}px` : `${CELL_SIZE}px`,
  ).join(" ");

  const trackPosition = (i: number) => i + 1 + Math.floor(i / 3);

  const displayedNumber = hintNumber ?? hoveredNumber;

  return (
    <div
      className={`rounded-2xl p-1.5 overflow-hidden ${
        isNeu
          ? "bg-gray-200 shadow-[12px_12px_24px_rgba(0,0,0,0.2),-12px_-12px_24px_rgba(255,255,255,0.7)]"
          : isMaterial
            ? "bg-white shadow-lg"
            : "bg-white/40 border border-white/50 shadow-2xl backdrop-blur-md"
      }`}
      style={{
        display: "grid",
        gridTemplateColumns: trackSizes,
        gridTemplateRows: trackSizes,
      }}
    >
      {board?.map((row, rowIndex) =>
        row?.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            style={{
              gridColumn: trackPosition(colIndex),
              gridRow: trackPosition(rowIndex),
            }}
          >
            <BoardCell
              value={cell}
              memo={memo?.[rowIndex]?.[colIndex]}
              isGiven={given?.[rowIndex]?.[colIndex]}
              isInvalid={invalidCells?.[rowIndex]?.[colIndex]}
              isSelected={
                selected?.row === rowIndex && selected?.col === colIndex
              }
              isHighlighted={
                !!displayedNumber &&
                shouldHighlight(board, rowIndex, colIndex, displayedNumber)
              }
              hintNumber={hintNumber}
              onSelect={() => onSelectCell?.(rowIndex, colIndex)}
              onChange={(newValue, newMemo) => {
                onCellChange?.(rowIndex, colIndex, newValue, newMemo);
              }}
            />
          </div>
        )),
      )}
    </div>
  );
};
