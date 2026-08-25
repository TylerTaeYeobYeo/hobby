/* eslint-disable react-hooks/refs */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { decodeGameState, encodeGameState } from "../util/game-storage";
import {
  LEVEL_CONFIG,
  generateMinesweeperGrid,
  type Level,
  type MinesweeperGrid,
} from "../util/minesweeper-generator";

export type GameStatus = "idle" | "playing" | "won" | "lost";

export type TimerHandle = {
  getTime: () => number;
  pause: () => void;
  resume: () => void;
  reset: () => void;
};

type SavedGameState = {
  difficulty: Level;
  grid: MinesweeperGrid | null;
  revealed: boolean[][];
  flagged: boolean[][];
  elapsedTime: number;
};

const STORAGE_KEY = "minesweeperGameState";

const emptyMatrix = (rows: number, cols: number): boolean[][] =>
  Array.from({ length: rows }, () => Array.from({ length: cols }, () => false));

const cloneMatrix = (matrix: boolean[][]): boolean[][] =>
  matrix.map((row) => [...row]);

// Reveals `(row, col)` and flood-fills outward through connected
// zero-adjacent-mine cells, mutating `revealed` in place.
const floodFillReveal = (
  grid: MinesweeperGrid,
  revealed: boolean[][],
  flagged: boolean[][],
  row: number,
  col: number,
): void => {
  const rows = grid.length;
  const cols = grid[0].length;
  const stack: [number, number][] = [[row, col]];

  while (stack.length > 0) {
    const [r, c] = stack.pop()!;
    if (r < 0 || r >= rows || c < 0 || c >= cols) continue;
    if (revealed[r][c] || flagged[r][c]) continue;

    revealed[r][c] = true;
    if (!grid[r][c].isMine && grid[r][c].adjacentMines === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr !== 0 || dc !== 0) stack.push([r + dr, c + dc]);
        }
      }
    }
  }
};

const isBoardCleared = (
  grid: MinesweeperGrid,
  revealed: boolean[][],
): boolean =>
  grid.every((row, r) => row.every((cell, c) => cell.isMine || revealed[r][c]));

export const useGameState = (timerRef: React.RefObject<TimerHandle | null>) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [difficulty, setDifficulty] = useState<Level>(
    () => (searchParams.get("difficulty") as Level) ?? "medium",
  );
  const [grid, setGrid] = useState<MinesweeperGrid | null>(null);
  const [revealed, setRevealed] = useState<boolean[][]>([]);
  const [flagged, setFlagged] = useState<boolean[][]>([]);
  const [status, setStatus] = useState<GameStatus>("idle");
  const [explodedCell, setExplodedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const startTimeRef = useRef(0);
  const isNew = searchParams.get("isNew") ?? "true";

  const { rows, cols } = LEVEL_CONFIG[difficulty];

  const remainingMines = useMemo(() => {
    const flaggedCount = flagged.reduce(
      (sum, row) => sum + row.filter(Boolean).length,
      0,
    );
    return LEVEL_CONFIG[difficulty].mines - flaggedCount;
  }, [flagged, difficulty]);

  useLayoutEffect(() => {
    const initNew = (level: Level) => {
      const { rows: r, cols: c } = LEVEL_CONFIG[level];
      setGrid(null);
      setRevealed(emptyMatrix(r, c));
      setFlagged(emptyMatrix(r, c));
      setStatus("idle");
      setExplodedCell(null);
      startTimeRef.current = 0;
    };

    if (isNew === "true") {
      const level: Level =
        (searchParams.get("difficulty") as Level) ?? "medium";
      setDifficulty(level);
      initNew(level);
    } else {
      const raw = localStorage.getItem(STORAGE_KEY);
      const saved = raw ? decodeGameState<SavedGameState>(raw) : null;
      if (saved) {
        setDifficulty(saved.difficulty);
        setGrid(saved.grid);
        setRevealed(saved.revealed);
        setFlagged(saved.flagged);
        setStatus(saved.grid ? "playing" : "idle");
        startTimeRef.current = saved.elapsedTime;
      } else {
        initNew("medium");
      }
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Resume the timer for a game that was saved mid-play.
  useEffect(() => {
    if (!isLoading && status === "playing") {
      timerRef.current?.resume();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleReveal = (row: number, col: number) => {
    if (status === "won" || status === "lost") return;
    if (flagged[row]?.[col] || revealed[row]?.[col]) return;

    if (status === "idle") {
      const newGrid = generateMinesweeperGrid(difficulty, { row, col });
      const newRevealed = emptyMatrix(rows, cols);
      floodFillReveal(newGrid, newRevealed, flagged, row, col);
      setGrid(newGrid);
      setRevealed(newRevealed);
      setStatus(isBoardCleared(newGrid, newRevealed) ? "won" : "playing");
      timerRef.current?.resume();
      return;
    }

    if (!grid) return;

    if (grid[row][col].isMine) {
      const newRevealed = cloneMatrix(revealed);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (grid[r][c].isMine) newRevealed[r][c] = true;
        }
      }
      setRevealed(newRevealed);
      setExplodedCell({ row, col });
      setStatus("lost");
      timerRef.current?.pause();
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    const newRevealed = cloneMatrix(revealed);
    floodFillReveal(grid, newRevealed, flagged, row, col);
    setRevealed(newRevealed);
    if (isBoardCleared(grid, newRevealed)) {
      setStatus("won");
      timerRef.current?.pause();
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleToggleFlag = (row: number, col: number) => {
    if (status !== "playing") return;
    if (revealed[row]?.[col]) return;
    setFlagged((prev) => {
      const next = cloneMatrix(prev);
      next[row][col] = !next[row][col];
      return next;
    });
  };

  const handleReset = () => {
    setGrid(null);
    setRevealed(emptyMatrix(rows, cols));
    setFlagged(emptyMatrix(rows, cols));
    setStatus("idle");
    setExplodedCell(null);
    localStorage.removeItem(STORAGE_KEY);
    timerRef.current?.reset();
  };

  const handleSave = () => {
    const elapsedTime = timerRef.current?.getTime() ?? 0;
    const payload: SavedGameState = {
      difficulty,
      grid,
      revealed,
      flagged,
      elapsedTime,
    };
    localStorage.setItem(STORAGE_KEY, encodeGameState(payload));
  };

  const handleBack = () => navigate("/");

  return {
    isLoading,
    rows,
    cols,
    grid,
    revealed,
    flagged,
    status,
    explodedCell,
    difficulty,
    remainingMines,
    startTime: startTimeRef.current,
    handleReveal,
    handleToggleFlag,
    handleReset,
    handleSave,
    handleBack,
  };
};
