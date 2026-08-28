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
];
