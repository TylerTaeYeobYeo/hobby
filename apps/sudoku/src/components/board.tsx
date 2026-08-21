import { useState } from "react";

export type BoardProps = {
  board: number[][];
  memo?: string[][][];
  given?: boolean[][];
  status?: "playing" | "paused" | "completed";
  hoveredNumber?: number | null;
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
  onSelect,
  onChange,
}: {
  value: number;
  memo?: string[];
  isGiven?: boolean;
  isSelected?: boolean;
  isHighlighted?: boolean;
  onSelect?: () => void;
  onChange?: (newValue: number, newMemo?: string[]) => void;
}) => {
  const [showMemoPopup, setShowMemoPopup] = useState<{
    x: number;
    y: number;
  }>();

  const bgClass = isGiven
    ? "bg-gray-100"
    : isSelected
      ? "bg-blue-100"
      : isHighlighted
        ? "bg-sky-200"
        : "bg-white";

  return (
    <div
      className={`border border-gray-300 w-12 h-12 flex flex-col items-center justify-center relative ${bgClass}`}
      onContextMenu={(e) => e.preventDefault()}
      onClick={() => onSelect?.()}
    >
      {isGiven ? (
        <span className="font-bold text-gray-800 select-none">{value}</span>
      ) : (
        <input
          style={{ width: "100%", height: "100%", textAlign: "center" }}
          className="bg-transparent relative z-10"
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
          onContextMenu={(e) => {
            e.preventDefault();
            setShowMemoPopup({ x: e.clientX, y: e.clientY });
          }}
        />
      )}
      {value === 0 && memo && memo.length > 0 && (
        <div className="grid grid-cols-3 grid-rows-3 w-full h-full pointer-events-none text-[0.55rem] leading-none text-gray-500 absolute inset-0">
          {MEMO_NUMS.map((num) => (
            <div key={num} className="flex items-center justify-center">
              {memo.includes(num.toString()) ? num : ""}
            </div>
          ))}
        </div>
      )}
      {/* memo popover with 9 grid - click each grid cell to memo that number - should close when other parts are clicked */}
      {showMemoPopup && !isGiven && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => setShowMemoPopup(undefined)}
          />
          <dialog
            open={!!showMemoPopup}
            className="absolute bg-white border border-gray-300 p-2 z-30 w-fit h-fit top-full left-1/2 -translate-x-1/2"
          >
            <div className="grid grid-cols-3 gap-1 w-max h-max">
              {MEMO_NUMS.map((num) => (
                <button
                  key={num}
                  className={`border border-gray-300 w-8 h-8 flex items-center justify-center ${
                    memo?.includes(num.toString()) ? "bg-gray-300" : ""
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
              ))}
            </div>
          </dialog>
        </>
      )}
    </div>
  );
};

export const Board = ({
  board,
  memo,
  given,
  status,
  hoveredNumber,
  selected,
  onSelectCell,
  onCellChange,
}: BoardProps) => {
  if (status === "paused") {
    return <div>Game paused</div>;
  }
  return (
    <div className="grid grid-cols-9 gap-1">
      {board?.map((row, rowIndex) =>
        row?.map((cell, colIndex) => (
          <BoardCell
            key={`${rowIndex}-${colIndex}`}
            value={cell}
            memo={memo?.[rowIndex]?.[colIndex]}
            isGiven={given?.[rowIndex]?.[colIndex]}
            isSelected={
              selected?.row === rowIndex && selected?.col === colIndex
            }
            isHighlighted={
              !!hoveredNumber &&
              shouldHighlight(board, rowIndex, colIndex, hoveredNumber)
            }
            onSelect={() => onSelectCell?.(rowIndex, colIndex)}
            onChange={(newValue, newMemo) => {
              onCellChange?.(rowIndex, colIndex, newValue, newMemo);
            }}
          />
        )),
      )}
    </div>
  );
};
