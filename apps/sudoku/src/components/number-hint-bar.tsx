export type NumberHintBarProps = {
  onHover?: (num: number | null) => void;
};

const NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const NumberHintBar = ({ onHover }: NumberHintBarProps) => {
  return (
    <div className="flex justify-center gap-2 mt-4">
      {NUMS.map((num) => (
        <button
          key={num}
          className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center font-semibold hover:bg-sky-100 transition-colors cursor-pointer"
          onMouseEnter={() => onHover?.(num)}
          onMouseLeave={() => onHover?.(null)}
        >
          {num}
        </button>
      ))}
    </div>
  );
};
