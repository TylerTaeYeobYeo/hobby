/* eslint-disable react-hooks/refs */
/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  createInitialBoard,
  hasAvailableMoves,
  hasReachedTarget,
  move,
  spawnRandomTile,
  type Board,
  type Direction,
} from "../util/board";
import { addHighScore } from "../util/highscore";

export type GameStatus = "idle" | "playing" | "won" | "lost";

export type TimerHandle = {
  getTime: () => number;
  pause: () => void;
  resume: () => void;
  reset: () => void;
};

type SavedGameState = {
  board: Board;
  score: number;
  status: GameStatus;
  elapsedTime: number;
};

const STORAGE_KEY = "2048GameState";
const SWIPE_THRESHOLD = 30;

const KEY_DIRECTIONS: Record<string, Direction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  a: "left",
  s: "down",
  d: "right",
  W: "up",
  A: "left",
  S: "down",
  D: "right",
};

export const useGameState = (timerRef: React.RefObject<TimerHandle | null>) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [board, setBoard] = useState<Board>(() => createInitialBoard());
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<GameStatus>("idle");
  const [finalTime, setFinalTime] = useState<number | null>(null);
  const [rank, setRank] = useState<number | null>(null);

  const startTimeRef = useRef(0);
  const isNew = searchParams.get("isNew") ?? "true";

  useLayoutEffect(() => {
    if (isNew === "true") {
      setBoard(createInitialBoard());
      setScore(0);
      setStatus("idle");
      setFinalTime(null);
      setRank(null);
      startTimeRef.current = 0;
    } else {
      const raw = localStorage.getItem(STORAGE_KEY);
      const saved = raw ? (JSON.parse(raw) as SavedGameState) : null;
      if (saved) {
        setBoard(saved.board);
        setScore(saved.score);
        setStatus(saved.status);
        startTimeRef.current = saved.elapsedTime;
      } else {
        setBoard(createInitialBoard());
        setScore(0);
        setStatus("idle");
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

  const finishWin = useCallback(() => {
    timerRef.current?.pause();
    const elapsedTime = timerRef.current?.getTime() ?? 0;
    const { rank: earnedRank } = addHighScore(elapsedTime);
    setFinalTime(elapsedTime);
    setRank(earnedRank);
    setStatus("won");
    localStorage.removeItem(STORAGE_KEY);
  }, [timerRef]);

  const finishLose = useCallback(() => {
    timerRef.current?.pause();
    setStatus("lost");
    localStorage.removeItem(STORAGE_KEY);
  }, [timerRef]);

  // The one entry point for applying a move — keyboard and touch input both
  // funnel through this so the two input modes can never behave differently.
  const handleMove = useCallback(
    (direction: Direction) => {
      if (status === "won" || status === "lost") return;

      const { board: moved_board, moved, gained } = move(board, direction);
      if (!moved) return;

      const spawned = spawnRandomTile(moved_board);
      setBoard(spawned);
      setScore((prev) => prev + gained);

      if (status === "idle") {
        setStatus("playing");
        timerRef.current?.resume();
      }

      if (hasReachedTarget(spawned)) {
        finishWin();
      } else if (!hasAvailableMoves(spawned)) {
        finishLose();
      }
    },
    [board, status, timerRef, finishWin, finishLose],
  );

  // Keyboard input: arrow keys / WASD.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const direction = KEY_DIRECTIONS[e.key];
      if (!direction) return;
      e.preventDefault();
      handleMove(direction);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleMove]);

  // Touch input: swipe gesture, mapped to the same `handleMove` as keyboard
  // so mobile behaves identically to desktop.
  useEffect(() => {
    const touchStart = { current: null as { x: number; y: number } | null };

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      touchStart.current = { x: t.clientX, y: t.clientY };
    };
    const onTouchMove = (e: TouchEvent) => {
      // prevent page scroll/bounce while a swipe is in progress
      if (touchStart.current) e.preventDefault();
    };
    const onTouchEnd = (e: TouchEvent) => {
      const start = touchStart.current;
      touchStart.current = null;
      if (!start) return;

      const t = e.changedTouches[0];
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);
      if (Math.max(absDx, absDy) < SWIPE_THRESHOLD) return;

      const direction: Direction =
        absDx > absDy ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up";
      handleMove(direction);
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [handleMove]);

  const handleReset = () => {
    setBoard(createInitialBoard());
    setScore(0);
    setStatus("idle");
    setFinalTime(null);
    setRank(null);
    localStorage.removeItem(STORAGE_KEY);
    timerRef.current?.reset();
  };

  const handleSave = () => {
    const elapsedTime = timerRef.current?.getTime() ?? 0;
    const payload: SavedGameState = { board, score, status, elapsedTime };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  };

  const handleBack = () => navigate("..");

  return {
    isLoading,
    board,
    score,
    status,
    finalTime,
    rank,
    startTime: startTimeRef.current,
    handleReset,
    handleSave,
    handleBack,
  };
};
