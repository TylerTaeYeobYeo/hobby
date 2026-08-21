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

const isBoardComplete = (board: number[][], solution: number[][]) => {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] !== solution[r][c]) return false;
    }
  }
  return true;
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
  const [difficulty, setDifficulty] = useState<Level>(
    () => (query[0].get("difficulty") as Level) ?? "medium",
  );
  const [finalTime, setFinalTime] = useState<number | null>(null);
  const [rank, setRank] = useState<number | null>(null);

  const isNew = query[0].get("isNew") ?? true;
  const startTimeRef = useRef<number | undefined>(undefined);
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
        setIsLoading(false);
        break;
      }
      case "false": {
        const savedGameState = localStorage.getItem("sudokuGameState");

        if (savedGameState) {
          const parsedState = JSON.parse(savedGameState);
          setDifficulty(parsedState.difficulty ?? "medium");
          setGameState({
            board: parsedState.board,
            solution: parsedState.solution,
            given: parsedState.given,
            memo: parsedState.memo,
          });
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
        }
        break;
      }
      default:
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      if (isBoardComplete(newBoard, prevState.solution)) {
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

  const handleErase = () => {
    if (!selected) return;
    const { row, col } = selected;
    if (gameState.given[row]?.[col]) return;
    handleCellChange(row, col, 0, []);
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
      <div className="flex justify-center items-center mt-4">
        <Board
          board={gameState.board}
          memo={gameState.memo}
          given={gameState.given}
          status={status === "completed" ? "playing" : status}
          hoveredNumber={hoveredNumber}
          selected={selected}
          onSelectCell={(row, col) => setSelected({ row, col })}
          onCellChange={handleCellChange}
        />
      </div>
      {status !== "paused" && <NumberHintBar onHover={setHoveredNumber} />}

      <Dialog open={status === "completed"} title="🎉 Puzzle Complete!">
        <div className="flex flex-col gap-3 min-w-56">
          <p>
            Your time:{" "}
            <span className="font-bold">
              {finalTime !== null ? formatTime(finalTime) : ""}
            </span>
          </p>
          {rank !== null && (
            <p>
              Rank: <span className="font-bold">#{rank}</span> ({difficulty})
            </p>
          )}
          <Button onClick={() => navigate("/")}>Back to Menu</Button>
        </div>
      </Dialog>
    </div>
  );
};
