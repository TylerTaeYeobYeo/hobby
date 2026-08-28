export type Game = {
  id: string;
  title: string;
  thumbnail: string;
};

export const GAMES: Game[] = [
  {
    id: "minesweeper",
    title: "Minesweeper",
    thumbnail: "/thumbnails/minesweeper.svg",
  },
  {
    id: "sudoku",
    title: "Sudoku",
    thumbnail: "/thumbnails/sudoku.svg",
  },
  {
    id: "2048",
    title: "2048",
    thumbnail: "/thumbnails/2048.svg",
  },
];
