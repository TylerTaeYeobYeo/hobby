export type Level = "easy" | "medium" | "hard";

export type Coordinate = { row: number; col: number };

export type MinesweeperCell = {
  isMine: boolean;
  adjacentMines: number;
};

export type MinesweeperGrid = MinesweeperCell[][];

export type LevelConfig = { rows: number; cols: number; mines: number };

export const LEVEL_CONFIG: Record<Level, LevelConfig> = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 },
};

// Generates a grid with mines placed randomly, excluding `firstClick`, and
// each non-mine cell annotated with its count of adjacent mines.
export const generateMinesweeperGrid = (
  difficulty: Level,
  firstClick: Coordinate,
): MinesweeperGrid => {
  const { rows, cols, mines } = LEVEL_CONFIG[difficulty];

  if (
    firstClick.row < 0 ||
    firstClick.row >= rows ||
    firstClick.col < 0 ||
    firstClick.col >= cols
  ) {
    throw new Error("First click coordinate is out of bounds");
  }

  const grid: MinesweeperGrid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ isMine: false, adjacentMines: 0 })),
  );

  placeMines(grid, rows, cols, mines, firstClick);
  computeAdjacentCounts(grid, rows, cols);

  return grid;
};

function placeMines(
  grid: MinesweeperGrid,
  rows: number,
  cols: number,
  mines: number,
  firstClick: Coordinate,
): void {
  const totalCells = rows * cols;
  const excludedIndex = firstClick.row * cols + firstClick.col;
  if (mines > totalCells - 1) {
    throw new Error("Too many mines for the grid size");
  }

  const candidates: number[] = [];
  for (let i = 0; i < totalCells; i++) {
    if (i !== excludedIndex) candidates.push(i);
  }

  // Fisher-Yates shuffle, then take the first `mines` positions.
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  for (let i = 0; i < mines; i++) {
    const row = Math.floor(candidates[i] / cols);
    const col = candidates[i] % cols;
    grid[row][col].isMine = true;
  }
}

function computeAdjacentCounts(
  grid: MinesweeperGrid,
  rows: number,
  cols: number,
): void {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (grid[row][col].isMine) continue;
      grid[row][col].adjacentMines = countAdjacentMines(
        grid,
        rows,
        cols,
        row,
        col,
      );
    }
  }
}

function countAdjacentMines(
  grid: MinesweeperGrid,
  rows: number,
  cols: number,
  row: number,
  col: number,
): number {
  let count = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const r = row + dr;
      const c = col + dc;
      if (r >= 0 && r < rows && c >= 0 && c < cols && grid[r][c].isMine) {
        count++;
      }
    }
  }
  return count;
}
