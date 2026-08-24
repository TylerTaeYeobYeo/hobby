import type { UiTheme } from "../../theme";

export type DialogThemeClasses = {
  backdrop: string;
  panel: string;
  title: string;
  closeButton: string;
  panelStyle?: { color: string };
};

const glass: DialogThemeClasses = {
  backdrop: "bg-black/30 backdrop-blur-sm",
  panel:
    "bg-white/30 border border-white/50 backdrop-blur-2xl rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.15)] p-8 min-w-[20rem]",
  title: "text-gray-800",
  closeButton: "text-gray-500 hover:text-gray-800",
};

const neumorphism: DialogThemeClasses = {
  backdrop: "bg-gray-400/30",
  panel:
    "bg-gray-200 rounded-2xl border border-gray-200 shadow-[12px_12px_24px_rgba(0,0,0,0.2),-12px_-12px_24px_rgba(255,255,255,0.7)] p-8 min-w-[20rem]",
  title: "text-gray-800",
  closeButton: "text-gray-500 hover:text-gray-800",
};

const material: DialogThemeClasses = {
  backdrop: "bg-black/50",
  panel: "bg-white rounded-lg shadow-2xl p-8 min-w-[20rem]",
  title: "text-gray-800",
  closeButton: "text-gray-500 hover:text-gray-800",
};

const cupertino: DialogThemeClasses = {
  backdrop: "bg-black/40 backdrop-blur-sm",
  panel:
    "bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#E5E5EA] p-8 min-w-[20rem]",
  title: "text-gray-800",
  closeButton: "text-gray-500 hover:text-gray-800",
};

const cyberpunk: DialogThemeClasses = {
  backdrop: "bg-black/75",
  panel:
    "bg-[#0d0d1a] rounded-sm border border-[#00e5ff]/60 shadow-[0_0_40px_rgba(0,229,255,0.15),inset_0_0_40px_rgba(0,229,255,0.03)] p-8 min-w-[20rem]",
  title: "text-[#00e5ff] font-mono tracking-wide",
  closeButton: "text-[#4a4a6a] hover:text-[#00e5ff]",
  panelStyle: { color: "#c0c0d0" },
};

export const dialogThemeClasses: Record<UiTheme, DialogThemeClasses> = {
  glass,
  neumorphism,
  material,
  cupertino,
  cyberpunk,
};
