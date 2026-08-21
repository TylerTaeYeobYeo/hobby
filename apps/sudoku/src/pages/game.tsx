/* eslint-disable react-hooks/refs */
/* eslint-disable react-hooks/set-state-in-effect */
import { Button, Dialog } from "@core/ui";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Board } from "../components/board";
import { NumberHintBar } from "../components/number-hint-bar";
import { Timer } from "../components/timer";
import { addHighScore, formatTime } from "../util/highscore";
import { generateSudoku, type Level } from "../util/sudoku-generator";

const isBoardFull = (board: number[][]) => {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) return false;
    }
  }
  return true;
};

const isBoardValid = (board: number[][]) => {
  const isValidGroup = (values: number[]) => {
    const seen = new Set<number>();
    for (const value of values) {
      if (value < 1 || value > 9 || seen.has(value)) return false;
      seen.add(value);
    }
    return true;
  };

  for (let i = 0; i < 9; i++) {
    const row = board[i];
    const col = board.map((r) => r[i]);
    if (!isValidGroup(row) || !isValidGroup(col)) return false;
  }

  for (let boxRow = 0; boxRow < 9; boxRow += 3) {
    for (let boxCol = 0; boxCol < 9; boxCol += 3) {
      const box: number[] = [];
      for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
          box.push(board[r][c]);
        }
      }
      if (!isValidGroup(box)) return false;
    }
  }

  return true;
};

const isBoardComplete = (board: number[][]) =>
  isBoardFull(board) && isBoardValid(board);

const HINT_COINS_BY_DIFFICULTY: Record<Level, number> = {
  easy: 3,
  medium: 2,
  hard: 1,
};

export const Game = () => {
  const query = useSearchParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<"playing" | "paused" | "completed">(
    "playing",
  );
  const [gameState, setGameState] = useState<{
    board: number[][];
    solution: number[][];
    given: boolean[][];
    memo: string[][][];
  }>({
    board: [[]],
    solution: [[]],
    given: [[]],
    memo: [[[]]],
  });
  const [selected, setSelected] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [hoveredNumber, setHoveredNumber] = useState<number | null>(null);
  const [hintModeNumber, setHintModeNumber] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<Level>(
    () => (query[0].get("difficulty") as Level) ?? "medium",
  );
  const [hintCoins, setHintCoins] = useState<number>(0);
  const [finalTime, setFinalTime] = useState<number | null>(null);
  const [rank, setRank] = useState<number | null>(null);

  const isNew = query[0].get("isNew") ?? true;
  const startTimeRef = useRef<number | undefined>(undefined);
  const boardContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<{
    getTime: () => number;
    pause: () => void;
    resume: () => void;
  } | null>(null);

  useLayoutEffect(() => {
    switch (isNew) {
      case "true": {
        const level = (query[0].get("difficulty") as Level) ?? "medium";
        startTimeRef.current = 0;
        const generated = generateSudoku(level);
        setGameState({
          board: generated.board,
          solution: generated.solution,
          given: generated.given,
          memo: Array.from({ length: 9 }, () =>
            Array.from({ length: 9 }, () => []),
          ),
        });
        setHintCoins(HINT_COINS_BY_DIFFICULTY[level]);
        setIsLoading(false);
        break;
      }
      case "false": {
        const savedGameState = localStorage.getItem("sudokuGameState");

        if (savedGameState) {
          const parsedState = JSON.parse(savedGameState);
          const level: Level = parsedState.difficulty ?? "medium";
          setDifficulty(level);
          setGameState({
            board: parsedState.board,
            solution: parsedState.solution,
            given: parsedState.given,
            memo: parsedState.memo,
          });
          setHintCoins(
            parsedState.hintCoins ?? HINT_COINS_BY_DIFFICULTY[level],
          );
          startTimeRef.current = parsedState.startTime ?? 0;
        } else {
          const level = "medium" as Level;
          setDifficulty(level);
          startTimeRef.current = 0;
          const generated = generateSudoku(level);
          setGameState({
            board: generated.board,
            solution: generated.solution,
            given: generated.given,
            memo: Array.from({ length: 9 }, () =>
              Array.from({ length: 9 }, () => []),
            ),
          });
          setHintCoins(HINT_COINS_BY_DIFFICULTY[level]);
        }
        break;
      }
      default:
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasCompletedRef = useRef(false);

  const handleCellChange = (
    row: number,
    col: number,
    newValue: number,
    newMemo?: string[],
  ) => {
    if (gameState.given[row]?.[col]) return;

    setGameState((prevState) => {
      const newBoard = prevState.board.map((r, rIndex) =>
        r.map((c, cIndex) => (rIndex === row && cIndex === col ? newValue : c)),
      );
      const newMemoState = prevState.memo.map((r, rIndex) =>
        r.map((c, cIndex) =>
          rIndex === row && cIndex === col ? (newMemo ?? []) : c,
        ),
      );
      const nextState = {
        ...prevState,
        board: newBoard,
        memo: newMemoState,
      };

      if (!hasCompletedRef.current && isBoardComplete(newBoard)) {
        hasCompletedRef.current = true;
        timerRef.current?.pause();
        const time = timerRef.current?.getTime() ?? 0;
        const { rank: earnedRank } = addHighScore(difficulty, time);
        setFinalTime(time);
        setRank(earnedRank);
        setStatus("completed");
        localStorage.removeItem("sudokuGameState");
      }

      return nextState;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selected || status !== "playing") return;
      const { row, col } = selected;
      if (gameState.given[row]?.[col]) return;

      if (e.key === "Backspace" || e.key === "Delete") {
        handleCellChange(row, col, 0, []);
      } else if (/^[1-9]$/.test(e.key)) {
        handleCellChange(row, col, parseInt(e.key, 10));
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, status, gameState]);

  useEffect(() => {
    if (!hintModeNumber) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (
        boardContainerRef.current &&
        !boardContainerRef.current.contains(e.target as Node)
      ) {
        setHintModeNumber(null);
      }
    };
    document.addEventListener("click", handleOutsideClick, true);
    return () =>
      document.removeEventListener("click", handleOutsideClick, true);
  }, [hintModeNumber]);

  const handleErase = () => {
    if (!selected) return;
    const { row, col } = selected;
    if (gameState.given[row]?.[col]) return;
    handleCellChange(row, col, 0, []);
  };

  const handleHint = () => {
    if (hintCoins <= 0 || status !== "playing") return;

    const emptyCells: { row: number; col: number }[] = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (gameState.board[r][c] === 0) {
          emptyCells.push({ row: r, col: c });
        }
      }
    }
    if (emptyCells.length === 0) return;

    const { row, col } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const revealedValue = gameState.solution[row][col];
    setHintCoins((prev) => prev - 1);
    handleCellChange(row, col, revealedValue, []);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-w-3xl">
      {/* timer */}
      <div className="flex justify-evenly items-center">
        <Timer ref={timerRef} startTime={startTimeRef?.current ?? 0} />
        <div className="flex gap-2 items-center">
          <Button
            variant="secondary"
            onClick={() => {
              if (status === "playing") {
                timerRef.current?.pause();
                setStatus("paused");
              } else if (status === "paused") {
                timerRef.current?.resume();
                setStatus("playing");
              }
            }}
          >
            {status === "playing" ? "Pause" : "Resume"}
          </Button>
          <Button
            variant="danger"
            onClick={handleErase}
            disabled={status !== "playing" || !selected}
          >
            Erase
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              timerRef.current?.pause();
              setStatus("paused");
              const currentTime = timerRef.current?.getTime();
              if (currentTime !== undefined) {
                localStorage.setItem(
                  "sudokuGameState",
                  JSON.stringify({
                    startTime: currentTime,
                    difficulty,
                    hintCoins,
                    ...gameState,
                  }),
                );
              }
              navigate("/");
            }}
          >
            Save
          </Button>
        </div>
      </div>
      {/* board */}
      <div
        className="flex justify-center items-center mt-4"
        ref={boardContainerRef}
      >
        <Board
          board={gameState.board}
          memo={gameState.memo}
          given={gameState.given}
          status={status === "completed" ? "playing" : status}
          hoveredNumber={hoveredNumber}
          hintNumber={hintModeNumber}
          selected={selected}
          onSelectCell={(row, col) => setSelected({ row, col })}
          onCellChange={handleCellChange}
        />
      </div>
      {status !== "paused" && (
        <div className="flex flex-col items-center gap-2">
          <NumberHintBar
            board={gameState.board}
            activeNumber={hintModeNumber}
            onHover={setHoveredNumber}
            onClickNumber={(num) =>
              setHintModeNumber((prev) => (prev === num ? null : num))
            }
          />
          <Button
            variant="secondary"
            onClick={handleHint}
            disabled={status !== "playing" || hintCoins <= 0}
          >
            💡 Hint ({hintCoins})
          </Button>
        </div>
      )}

      <Dialog open={status === "completed"} title="🎉 Congratulations!">
        <div className="flex flex-col gap-3 min-w-56">
          <p>You solved the puzzle!</p>
          <p>
            Your time:{" "}
            <span className="font-bold">
              {finalTime !== null ? formatTime(finalTime) : ""}
            </span>
          </p>
          {rank !== null && (
            <p>
              You ranked <span className="font-bold">#{rank}</span> on the{" "}
              {difficulty} leaderboard!
            </p>
          )}
          <Button onClick={() => navigate("/")}>Back to Menu</Button>
        </div>
      </Dialog>
    </div>
  );
};
