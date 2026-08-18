export type Level = "easy" | "medium" | "hard";

// generate a sudoku puzzle with a given difficulty level
export const generateSudoku = (difficulty: Level): number[][] => {
  const baseBoard = createBaseBoard();
  const filledBoard = fillBoard(baseBoard);
  const puzzle = createPuzzle(filledBoard, difficulty);
  return puzzle;
};

function createBaseBoard() {
  const board: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));
  return board;
}

function fillBoard(board: number[][]): number[][] {
  // Fill the board with a valid Sudoku solution using backtracking
  if (solveSudoku(board)) {
    return board;
  }
  throw new Error("Failed to generate a valid Sudoku board");
}

function solveSudoku(board: number[][]): boolean {
  const emptyCell = findEmptyCell(board);
  if (!emptyCell) return true; // Solved

  const [row, col] = emptyCell;
  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;
      if (solveSudoku(board)) return true;
      board[row][col] = 0; // Backtrack
    }
  }
  return false; // Trigger backtracking
}

function findEmptyCell(board: number[][]): [number, number] | null {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) return [row, col];
    }
  }
  return null;
}

function isValid(
  board: number[][],
  row: number,
  col: number,
  num: number,
): boolean {
  // Check row and column
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) return false;
  }

  // Check 3x3 box
  const boxRowStart = Math.floor(row / 3) * 3;
  const boxColStart = Math.floor(col / 3) * 3;
  for (let r = boxRowStart; r < boxRowStart + 3; r++) {
    for (let c = boxColStart; c < boxColStart + 3; c++) {
      if (board[r][c] === num) return false;
    }
  }
  return true;
}

function createPuzzle(board: number[][], difficulty: Level): number[][] {
  const puzzle = board.map((row) => [...row]);
  let cellsToRemove: number;

  switch (difficulty) {
    case "easy":
      cellsToRemove = 40; // Remove 40 cells for easy difficulty
      break;
    case "medium":
      cellsToRemove = 50; // Remove 50 cells for medium difficulty
      break;
    case "hard":
      cellsToRemove = 60; // Remove 60 cells for hard difficulty
      break;
    default:
      throw new Error("Invalid difficulty level");
  }

  while (cellsToRemove > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      cellsToRemove--;
    }
  }

  return puzzle;
}
