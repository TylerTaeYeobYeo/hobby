import { useTheme } from "@core/ui";

export type MineCounterProps = {
  remainingMines: number;
};

// Displays remaining (unflagged) mines; classic Minesweeper allows this to go
// negative when the player over-flags.
export const MineCounter = ({ remainingMines }: MineCounterProps) => {
  const { theme } = useTheme();
  const isNeu = theme === "neumorphism";
  const isMaterial = theme === "material";
  const isCupertino = theme === "cupertino";
  const isCyberpunk = theme === "cyberpunk";

  return (
    <div
      className={`flex items-center gap-1.5 text-xl font-mono font-semibold rounded-xl px-4 py-2 ${
        isCyberpunk
          ? "text-[#ff2d78] bg-[#12121f] border border-[#00e5ff]/30 shadow-[0_0_10px_rgba(0,229,255,0.2)] rounded-sm"
          : "text-gray-800"
      } ${
        isNeu
          ? "bg-gray-200 shadow-[6px_6px_12px_rgba(0,0,0,0.15),-6px_-6px_12px_rgba(255,255,255,0.7)]"
          : isMaterial
            ? "bg-white shadow-md"
            : isCupertino
              ? "bg-white border border-[#E5E5EA] shadow-sm"
              : isCyberpunk
                ? ""
                : "bg-white/30 border border-white/40 backdrop-blur-md shadow-md"
      }`}
    >
      <span aria-hidden>🚩</span>
      {remainingMines}
    </div>
  );
};
