export type Game = {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
};

export const GAMES: Game[] = [
  {
    id: "minesweeper",
    title: "Minesweeper",
    thumbnail: "/thumbnails/minesweeper.svg",
    url: import.meta.env.VITE_MINESWEEPER_URL || "http://localhost:5174",
  },
  {
    id: "sudoku",
    title: "Sudoku",
    thumbnail: "/thumbnails/sudoku.svg",
    url: import.meta.env.VITE_SUDOKU_URL || "http://localhost:5175",
  },
];
