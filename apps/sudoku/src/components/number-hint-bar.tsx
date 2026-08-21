export type NumberHintBarProps = {
  board?: number[][];
  activeNumber?: number | null;
  onHover?: (num: number | null) => void;
  onClickNumber?: (num: number) => void;
};

const NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const isNumberComplete = (board: number[][] | undefined, num: number) => {
  if (!board) return false;
  let count = 0;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r]?.[c] === num) count++;
    }
  }
  return count >= 9;
};

export const NumberHintBar = ({
  board,
  activeNumber,
  onHover,
  onClickNumber,
}: NumberHintBarProps) => {
  return (
    <div className="flex justify-center gap-2 mt-4">
      {NUMS.map((num) => {
        const complete = isNumberComplete(board, num);
        const isActive = activeNumber === num;
        return (
          <button
            key={num}
            className={`w-10 h-10 border rounded-md flex items-center justify-center font-semibold transition-colors ${
              complete
                ? "text-gray-300 bg-gray-50 border-gray-300 cursor-default"
                : isActive
                  ? "bg-blue-200 border-blue-500 cursor-pointer"
                  : "border-gray-300 hover:bg-sky-100 cursor-pointer"
            }`}
            onMouseEnter={() => !complete && onHover?.(num)}
            onMouseLeave={() => onHover?.(null)}
            onClick={() => !complete && onClickNumber?.(num)}
          >
            {num}
          </button>
        );
      })}
    </div>
  );
};
