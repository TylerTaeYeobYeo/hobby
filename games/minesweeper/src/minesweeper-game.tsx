import { GameLayout } from "@core/ui";
import { Route, Routes } from "react-router";
import { Game } from "./pages/game";
import { Leaderboard } from "./pages/leaderboard";
import { Menu } from "./pages/menu";

export const MinesweeperGame = () => (
  <GameLayout title="Minesweeper">
    <Routes>
      <Route index element={<Menu />} />
      <Route path="game" element={<Game />} />
      <Route path="leaderboard" element={<Leaderboard />} />
    </Routes>
  </GameLayout>
);
