export type BoardProps = {
  board: number[][];
  memo?: string[][][];
  status?: "playing" | "paused" | "completed";
  onCellChange?: (
    row: number,
    col: number,
    newValue: number,
    newMemo?: string[],
  ) => void;
};

export const BoardCell = ({
  value,
  memo,
  onChange,
}: {
  value: number;
  memo?: string[];
  onChange?: (newValue: number, newMemo?: string[]) => void;
}) => {
  return (
    <div className="border border-gray-300 w-12 h-12 flex flex-col items-center justify-center">
      <input
        style={{ width: "100%", height: "100%", textAlign: "center" }}
        type="text"
        value={value === 0 ? "" : value}
        onChange={(e) => {
          const newValue = parseInt(e.target.value, 10);
          if (!isNaN(newValue) && newValue >= 1 && newValue <= 9) {
            onChange?.(newValue, memo);
          } else {
            onChange?.(0, memo); // Reset to 0 if invalid input
          }
        }}
      />
    </div>
  );
};

export const Board = ({ board, memo, status, onCellChange }: BoardProps) => {
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
            onChange={(newValue, newMemo) => {
              // Handle cell value change here
              console.log(
                `Cell at (${rowIndex}, ${colIndex}) changed to ${newValue} with memo ${newMemo}`,
              );
              onCellChange?.(rowIndex, colIndex, newValue, newMemo);
            }}
          />
        )),
      )}
    </div>
  );
};
