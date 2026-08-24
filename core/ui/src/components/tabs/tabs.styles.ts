import type { UiTheme } from "../../theme";

export type TabsThemeClasses = {
  track: string;
  tab: (selected: boolean) => string;
};

const glass: TabsThemeClasses = {
  track:
    "rounded-xl border border-white/40 bg-white/20 p-1 backdrop-blur-md shadow-inner",
  tab: (selected) =>
    selected
      ? "bg-white/70 text-gray-900 shadow-md backdrop-blur-md"
      : "bg-transparent text-gray-600 hover:text-gray-800 hover:bg-white/30",
};

const neumorphism: TabsThemeClasses = {
  track:
    "rounded-xl bg-gray-200 p-1 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.15),inset_-4px_-4px_8px_rgba(255,255,255,0.7)]",
  tab: (selected) =>
    selected
      ? "bg-gray-200 text-gray-900 shadow-[3px_3px_6px_rgba(0,0,0,0.2),-3px_-3px_6px_rgba(255,255,255,0.7)]"
      : "bg-transparent text-gray-500 hover:text-gray-700",
};

const material: TabsThemeClasses = {
  track: "rounded-md bg-gray-100 p-1",
  tab: (selected) =>
    selected
      ? "bg-white text-blue-700 shadow-md"
      : "bg-transparent text-gray-600 hover:bg-white/60 hover:text-gray-800",
};

const cupertino: TabsThemeClasses = {
  track: "rounded-[10px] bg-[#E5E5EA] p-[3px]",
  tab: (selected) =>
    selected
      ? "bg-white text-gray-900 shadow-sm"
      : "bg-transparent text-gray-600 hover:text-gray-800",
};

const cyberpunk: TabsThemeClasses = {
  track: "rounded-sm bg-[#0d0d1a] border border-[#00e5ff]/30 p-[3px]",
  tab: (selected) =>
    selected
      ? "bg-[#00e5ff]/15 text-[#00e5ff] shadow-[0_0_8px_rgba(0,229,255,0.4)]"
      : "bg-transparent text-[#4a4a6a] hover:text-[#00e5ff]",
};

export const tabsThemeClasses: Record<UiTheme, TabsThemeClasses> = {
  glass,
  neumorphism,
  material,
  cupertino,
  cyberpunk,
};
