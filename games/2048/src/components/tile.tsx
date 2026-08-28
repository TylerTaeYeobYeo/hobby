import { useTheme } from "@core/ui";

export type TileProps = {
  value: number;
};

// Classic 2048 value -> color scale; darker/brighter as tiles grow.
const TILE_COLORS: Record<number, string> = {
  2: "bg-[#eee4da] text-[#776e65]",
  4: "bg-[#ede0c8] text-[#776e65]",
  8: "bg-[#f2b179] text-white",
  16: "bg-[#f59563] text-white",
  32: "bg-[#f67c5f] text-white",
  64: "bg-[#f65e3b] text-white",
  128: "bg-[#edcf72] text-white",
  256: "bg-[#edcc61] text-white",
  512: "bg-[#edc850] text-white",
  1024: "bg-[#edc53f] text-white",
  2048: "bg-[#edc22e] text-white",
};

const FALLBACK_COLOR = "bg-[#3c3a32] text-white";

export const Tile = ({ value }: TileProps) => {
  const { theme } = useTheme();
  const isNeu = theme === "neumorphism";
  const isMaterial = theme === "material";
  const isCyberpunk = theme === "cyberpunk";

  if (value === 0) {
    return (
      <div
        className={`w-full h-full rounded-lg ${
          isNeu
            ? "bg-gray-200 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15),inset_-2px_-2px_4px_rgba(255,255,255,0.7)]"
            : isMaterial
              ? "bg-gray-100"
              : isCyberpunk
                ? "bg-[#1a1a2e] border border-[#00e5ff]/10"
                : "bg-white/20 border border-black/10"
        }`}
      />
    );
  }

  const colorClass = TILE_COLORS[value] ?? FALLBACK_COLOR;
  const fontSizeClass = value >= 1000 ? "text-lg" : "text-2xl";

  return (
    <div
      className={`w-full h-full flex items-center justify-center rounded-lg font-bold select-none ${fontSizeClass} ${
        isCyberpunk
          ? "border border-[#00e5ff]/40 shadow-[0_0_10px_rgba(0,229,255,0.15)]"
          : ""
      } ${colorClass}`}
    >
      {value}
    </div>
  );
};
