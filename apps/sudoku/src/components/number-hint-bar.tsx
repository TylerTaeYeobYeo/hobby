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
    <div className="flex justify-center gap-2 mt-4 rounded-2xl border border-white/40 bg-white/20 p-2 backdrop-blur-md shadow-lg">
      {NUMS.map((num) => {
        const complete = isNumberComplete(board, num);
        const isActive = activeNumber === num;
        return (
          <button
            key={num}
            className={`w-10 h-10 border rounded-lg flex items-center justify-center font-semibold transition-all duration-150 backdrop-blur-md ${
              complete
                ? "text-gray-400 bg-gray-200/30 border-white/20 cursor-default"
                : isActive
                  ? "bg-blue-400/60 border-white/50 text-white shadow-md cursor-pointer"
                  : "bg-white/20 border-white/30 hover:bg-sky-200/50 text-gray-800 cursor-pointer"
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
