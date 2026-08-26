import { type FC, type ReactNode } from "react";
import { useTheme } from "../../theme";
import { ThemeToggle } from "../theme-toggle";

export type GameLayoutProps = {
  title: string;
  children: ReactNode;
};

export const GameLayout: FC<GameLayoutProps> = ({ title, children }) => {
  const { theme } = useTheme();
  const isNeu = theme === "neumorphism";
  const isMaterial = theme === "material";
  const isCupertino = theme === "cupertino";
  const isCyberpunk = theme === "cyberpunk";

  return (
    <main
      className={`relative min-h-screen w-screen overflow-x-hidden ${
        isNeu
          ? "bg-gray-200"
          : isMaterial
            ? "bg-gray-50"
            : isCupertino
              ? "bg-[#F2F2F7]"
              : isCyberpunk
                ? "bg-[#0d0d1a]"
                : "bg-linear-to-br from-indigo-300 via-sky-200 to-pink-300"
      }`}
    >
      {/* blobs are fixed so they stay in viewport corners while content scrolls */}
      {!isNeu && !isMaterial && !isCupertino && !isCyberpunk && (
        <>
          <div className="fixed -top-24 -left-24 w-96 h-96 rounded-full bg-purple-400/40 blur-3xl pointer-events-none" />
          <div className="fixed -bottom-24 -right-24 w-96 h-96 rounded-full bg-sky-400/40 blur-3xl pointer-events-none" />
        </>
      )}
      {isCyberpunk && (
        <>
          <div className="fixed -top-24 -left-24 w-96 h-96 rounded-full bg-[#ff2d78]/10 blur-3xl pointer-events-none" />
          <div className="fixed -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#00e5ff]/10 blur-3xl pointer-events-none" />
        </>
      )}
      {/* ThemeToggle fixed so it stays accessible during scroll */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      {/* Content: centered when shorter than the viewport, scrollable when taller */}
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 py-12">
        <div
          className={
            isNeu
              ? "flex flex-col items-center gap-4 rounded-3xl bg-gray-200 p-6 shadow-[12px_12px_24px_rgba(0,0,0,0.2),-12px_-12px_24px_rgba(255,255,255,0.7)] w-full max-w-fit"
              : isMaterial
                ? "flex flex-col items-center gap-4 rounded-lg bg-white p-6 shadow-xl w-full max-w-fit"
                : isCupertino
                  ? "flex flex-col items-center gap-4 rounded-2xl bg-white p-6 shadow-sm border border-[#E5E5EA] w-full max-w-fit"
                  : isCyberpunk
                    ? "flex flex-col items-center gap-4 rounded-sm bg-[#12121f] p-6 border border-[#00e5ff]/30 shadow-[0_0_40px_rgba(0,229,255,0.1)] w-full max-w-fit"
                    : "flex flex-col items-center gap-4 rounded-3xl border border-white/40 bg-white/25 p-6 shadow-2xl backdrop-blur-2xl w-full max-w-fit"
          }
        >
          <h1
            className={`text-4xl font-bold drop-shadow-sm ${
              isCyberpunk
                ? "text-[#ff2d78] font-mono tracking-wider [text-shadow:0_0_20px_rgba(255,45,120,0.6)]"
                : "text-gray-800"
            }`}
          >
            {title}
          </h1>
          {children}
        </div>
      </div>
    </main>
  );
};
