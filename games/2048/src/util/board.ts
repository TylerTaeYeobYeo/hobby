export const BOARD_SIZE = 4;

export type Board = number[][];

export type Direction = "up" | "down" | "left" | "right";

const cloneBoard = (board: Board): Board => board.map((row) => [...row]);

const boardsEqual = (a: Board, b: Board): boolean =>
  a.every((row, r) => row.every((v, c) => v === b[r][c]));

export const createEmptyBoard = (): Board =>
  Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));

// Fills one random empty cell with a 2 (90%) or a 4 (10%).
export const spawnRandomTile = (board: Board): Board => {
  const empties: [number, number][] = [];
  board.forEach((row, r) =>
    row.forEach((cell, c) => {
      if (cell === 0) empties.push([r, c]);
    }),
  );
  if (empties.length === 0) return board;

  const [r, c] = empties[Math.floor(Math.random() * empties.length)];
  const next = cloneBoard(board);
  next[r][c] = Math.random() < 0.9 ? 2 : 4;
  return next;
};

export const createInitialBoard = (): Board =>
  spawnRandomTile(spawnRandomTile(createEmptyBoard()));

const transpose = (board: Board): Board =>
  board[0].map((_, c) => board.map((row) => row[c]));

const reverseRows = (board: Board): Board =>
  board.map((row) => [...row].reverse());

// Slides non-zero values to the front of a line, merging adjacent equal
// pairs once each (e.g. [2,2,2,2] -> [4,4], not [8]).
const slideAndMergeLine = (
  line: number[],
): { line: number[]; gained: number } => {
  const values = line.filter((v) => v !== 0);
  const merged: number[] = [];
  let gained = 0;
  let i = 0;
  while (i < values.length) {
    if (values[i] === values[i + 1]) {
      const mergedValue = values[i] * 2;
      merged.push(mergedValue);
      gained += mergedValue;
      i += 2;
    } else {
      merged.push(values[i]);
      i += 1;
    }
  }
  while (merged.length < line.length) merged.push(0);
  return { line: merged, gained };
};

// Applies a slide+merge in `direction` by normalizing the board so the move
// is always a "slide left", then undoing the normalization.
export const move = (
  board: Board,
  direction: Direction,
): { board: Board; moved: boolean; gained: number } => {
  let working = cloneBoard(board);
  if (direction === "up" || direction === "down") working = transpose(working);
  if (direction === "right" || direction === "down")
    working = reverseRows(working);

  let gained = 0;
  let result = working.map((row) => {
    const { line, gained: rowGained } = slideAndMergeLine(row);
    gained += rowGained;
    return line;
  });

  if (direction === "right" || direction === "down")
    result = reverseRows(result);
  if (direction === "up" || direction === "down") result = transpose(result);

  return { board: result, moved: !boardsEqual(result, board), gained };
};

export const hasAvailableMoves = (board: Board): boolean => {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === 0) return true;
      if (c + 1 < BOARD_SIZE && board[r][c] === board[r][c + 1]) return true;
      if (r + 1 < BOARD_SIZE && board[r][c] === board[r + 1][c]) return true;
    }
  }
  return false;
};

export const hasReachedTarget = (board: Board, target = 2048): boolean =>
  board.some((row) => row.some((v) => v >= target));
