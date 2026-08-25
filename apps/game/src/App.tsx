import { useTheme } from "@core/ui";
import { Outlet } from "react-router";

const bgClasses = {
  glass: "bg-linear-to-br from-indigo-300 via-sky-200 to-pink-300",
  neumorphism: "bg-gray-200",
  material: "bg-gray-50",
  cupertino: "bg-[#F2F2F7]",
  cyberpunk: "bg-[#0d0d1a]",
};

export const App = () => {
  const { theme } = useTheme();

  return (
    <main className={`min-h-screen w-screen relative overflow-x-hidden ${bgClasses[theme]}`}>
      {theme === "glass" && (
        <>
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-purple-400/40 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-sky-400/40 blur-3xl pointer-events-none" />
        </>
      )}
      {theme === "cyberpunk" && (
        <>
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#ff2d78]/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#00e5ff]/10 blur-3xl pointer-events-none" />
        </>
      )}
      <Outlet />
    </main>
  );
};
