import { Center, useTheme } from "@core/ui";
import { Outlet } from "react-router";

export const App = () => {
  const { theme } = useTheme();
  const isNeu = theme === "neumorphism";

  return (
    <main
      className={`flex h-screen w-screen flex-col items-center justify-between relative overflow-hidden ${
        isNeu
          ? "bg-gray-200"
          : "bg-linear-to-br from-indigo-300 via-sky-200 to-pink-300"
      }`}
    >
      {!isNeu && (
        <>
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-purple-400/40 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-sky-400/40 blur-3xl pointer-events-none" />
        </>
      )}
      <Center className="flex flex-col gap-4">
        <div
          className={
            isNeu
              ? "flex flex-col items-center gap-4 rounded-3xl bg-gray-200 p-8 shadow-[12px_12px_24px_rgba(0,0,0,0.2),-12px_-12px_24px_rgba(255,255,255,0.7)]"
              : "flex flex-col items-center gap-4 rounded-3xl border border-white/40 bg-white/25 p-8 shadow-2xl backdrop-blur-2xl"
          }
        >
          <h1 className="text-4xl font-bold text-gray-800 drop-shadow-sm">
            Sudoku
          </h1>
          <Outlet />
        </div>
      </Center>
    </main>
  );
};
