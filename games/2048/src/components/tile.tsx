import { useTheme, type UiTheme } from "@core/ui";

export type TileProps = {
  value: number;
};

// Value -> palette index; each theme gets its own 11-color progression so
// every tile value is visually distinct while staying on that theme's palette.
const VALUE_ORDER = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];

// Shared visual treatment applied to every filled tile within a theme (the
// per-value colors below only vary background/text/accent).
const TILE_WRAPPER: Record<UiTheme, string> = {
  glass: "border border-white/40 shadow-md backdrop-blur-sm",
  neumorphism:
    "shadow-[3px_3px_6px_rgba(0,0,0,0.15),-3px_-3px_6px_rgba(255,255,255,0.7)]",
  material: "shadow-md",
  cupertino: "shadow-sm",
  cyberpunk: "",
};

const TILE_COLORS: Record<UiTheme, string[]> = {
  glass: [
    "bg-indigo-200/70 text-indigo-900",
    "bg-indigo-300/70 text-indigo-900",
    "bg-sky-300/70 text-sky-950",
    "bg-sky-400/70 text-white",
    "bg-teal-400/70 text-white",
    "bg-emerald-400/70 text-white",
    "bg-amber-400/80 text-amber-950",
    "bg-orange-400/80 text-white",
    "bg-rose-400/80 text-white",
    "bg-pink-500/80 text-white",
    "bg-fuchsia-600/85 text-white",
  ],
  neumorphism: [
    "bg-blue-100 text-gray-800",
    "bg-blue-200 text-gray-800",
    "bg-teal-200 text-gray-800",
    "bg-teal-300 text-gray-800",
    "bg-emerald-300 text-gray-800",
    "bg-lime-300 text-gray-800",
    "bg-amber-300 text-gray-800",
    "bg-orange-300 text-white",
    "bg-rose-300 text-white",
    "bg-pink-400 text-white",
    "bg-purple-400 text-white",
  ],
  material: [
    "bg-blue-100 text-blue-900",
    "bg-blue-300 text-blue-900",
    "bg-cyan-500 text-white",
    "bg-teal-500 text-white",
    "bg-green-500 text-white",
    "bg-lime-500 text-gray-900",
    "bg-yellow-500 text-gray-900",
    "bg-amber-600 text-white",
    "bg-orange-600 text-white",
    "bg-red-600 text-white",
    "bg-purple-700 text-white",
  ],
  cupertino: [
    "bg-[#E8F0FE] text-[#007AFF]",
    "bg-[#CFE4FF] text-[#007AFF]",
    "bg-[#34C759] text-white",
    "bg-[#30B0C7] text-white",
    "bg-[#5AC8FA] text-white",
    "bg-[#FFD60A] text-[#3a2f00]",
    "bg-[#FF9F0A] text-white",
    "bg-[#FF453A] text-white",
    "bg-[#BF5AF2] text-white",
    "bg-[#FF375F] text-white",
    "bg-[#5E5CE6] text-white",
  ],
  cyberpunk: [
    "bg-[#0d0d1a] text-[#00e5ff] border border-[#00e5ff]/50 shadow-[0_0_8px_rgba(0,229,255,0.3)]",
    "bg-[#0d0d1a] text-[#00e5ff] border border-[#00e5ff]/70 shadow-[0_0_10px_rgba(0,229,255,0.4)]",
    "bg-[#150d1a] text-[#ff2d78] border border-[#ff2d78]/50 shadow-[0_0_8px_rgba(255,45,120,0.3)]",
    "bg-[#150d1a] text-[#ff2d78] border border-[#ff2d78]/70 shadow-[0_0_10px_rgba(255,45,120,0.4)]",
    "bg-[#0d1a12] text-[#00ffab] border border-[#00ffab]/50 shadow-[0_0_8px_rgba(0,255,171,0.3)]",
    "bg-[#0d1a12] text-[#00ffab] border border-[#00ffab]/70 shadow-[0_0_10px_rgba(0,255,171,0.4)]",
    "bg-[#1a170d] text-[#ffd60a] border border-[#ffd60a]/50 shadow-[0_0_8px_rgba(255,214,10,0.3)]",
    "bg-[#1a170d] text-[#ffd60a] border border-[#ffd60a]/70 shadow-[0_0_10px_rgba(255,214,10,0.4)]",
    "bg-[#1a0d17] text-[#ff00e5] border border-[#ff00e5]/50 shadow-[0_0_8px_rgba(255,0,229,0.3)]",
    "bg-[#1a0d17] text-[#ff00e5] border border-[#ff00e5]/70 shadow-[0_0_10px_rgba(255,0,229,0.4)]",
    "bg-black text-[#00e5ff] border-2 border-[#00e5ff] shadow-[0_0_20px_rgba(0,229,255,0.8)]",
  ],
};

const TILE_FALLBACK: Record<UiTheme, string> = {
  glass: "bg-violet-700/85 text-white",
  neumorphism: "bg-indigo-500 text-white",
  material: "bg-gray-900 text-white",
  cupertino: "bg-[#1C1C1E] text-white",
  cyberpunk:
    "bg-black text-[#ff2d78] border-2 border-[#ff2d78] shadow-[0_0_20px_rgba(255,45,120,0.8)]",
};

export const Tile = ({ value }: TileProps) => {
  const { theme } = useTheme();
  const isNeu = theme === "neumorphism";
  const isMaterial = theme === "material";
  const isCupertino = theme === "cupertino";
  const isCyberpunk = theme === "cyberpunk";

  if (value === 0) {
    return (
      <div
        className={`w-full h-full rounded-lg ${
          isNeu
            ? "bg-gray-200 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15),inset_-2px_-2px_4px_rgba(255,255,255,0.7)]"
            : isMaterial
              ? "bg-gray-100"
              : isCupertino
                ? "bg-[#F2F2F7] border border-[#E5E5EA]"
                : isCyberpunk
                  ? "bg-[#1a1a2e] border border-[#00e5ff]/10"
                  : "bg-white/20 border border-black/10"
        }`}
      />
    );
  }

  const index = VALUE_ORDER.indexOf(value);
  const colorClass =
    index >= 0 ? TILE_COLORS[theme][index] : TILE_FALLBACK[theme];
  const fontSizeClass = value >= 1000 ? "text-lg" : "text-2xl";

  return (
    <div
      className={`w-full h-full flex items-center justify-center rounded-lg font-bold select-none ${fontSizeClass} ${TILE_WRAPPER[theme]} ${colorClass}`}
    >
      {value}
    </div>
  );
};
