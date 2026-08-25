import { ThemeToggle, useTheme, type UiTheme } from "@core/ui";
import { useNavigate } from "react-router";
import { GAMES, type Game } from "../config/games";

const titleClasses: Record<UiTheme, string> = {
  glass: "text-gray-800",
  neumorphism: "text-gray-700",
  material: "text-gray-900",
  cupertino: "text-gray-900",
  cyberpunk:
    "text-[#ff2d78] font-mono tracking-wider [text-shadow:0_0_20px_rgba(255,45,120,0.6)]",
};

const cardClasses: Record<UiTheme, string> = {
  glass:
    "bg-white/20 border border-white/30 backdrop-blur-md rounded-2xl shadow-lg hover:bg-white/30 hover:-translate-y-1",
  neumorphism:
    "bg-gray-200 rounded-3xl shadow-[6px_6px_12px_rgba(0,0,0,0.15),-6px_-6px_12px_rgba(255,255,255,0.7)] hover:shadow-[8px_8px_16px_rgba(0,0,0,0.2),-8px_-8px_16px_rgba(255,255,255,0.8)] hover:-translate-y-1",
  material:
    "bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1",
  cupertino:
    "bg-white border border-[#E5E5EA] rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1",
  cyberpunk:
    "bg-[#12121f] border border-[#00e5ff]/30 rounded-sm shadow-[0_0_20px_rgba(0,229,255,0.05)] hover:border-[#00e5ff]/70 hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] hover:-translate-y-1",
};

const cardTitleClasses: Record<UiTheme, string> = {
  glass: "text-gray-800",
  neumorphism: "text-gray-700",
  material: "text-gray-900",
  cupertino: "text-gray-900",
  cyberpunk: "text-[#00e5ff] font-mono uppercase tracking-wider text-sm",
};

const GameCard = ({ game }: { game: Game }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/game/${game.id}`)}
      className={`w-full overflow-hidden transition-all duration-200 cursor-pointer text-left ${cardClasses[theme]}`}
    >
      <img
        src={game.thumbnail}
        alt={`${game.title} thumbnail`}
        className="w-full aspect-video object-cover"
        draggable={false}
      />
      <div className="px-4 py-3">
        <h2 className={`text-base font-semibold ${cardTitleClasses[theme]}`}>
          {game.title}
        </h2>
      </div>
    </button>
  );
};

export const Home = () => {
  const { theme } = useTheme();

  return (
    <div className="relative min-h-screen">
      {/* ThemeToggle pinned to top-right */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="px-6 pt-12 pb-16 max-w-4xl mx-auto">
        <h1 className={`text-4xl font-bold mb-8 ${titleClasses[theme]}`}>
          Games
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GAMES.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </div>
  );
};
