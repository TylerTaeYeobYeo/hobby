/* eslint-disable react-hooks/refs */
import { useLayoutEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Board } from "../components/board";
import { Timer } from "../components/timer";
import { generateSudoku } from "../util/sudoku-generator";

export const Game = () => {
  const query = useSearchParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<"playing" | "paused" | "completed">(
    "playing",
  );
  const [gameState, setGameState] = useState<{
    board: number[][];
    memo: string[][][];
  }>({
    board: [[]],
    memo: [[[]]],
  });

  const isNew = query[0].get("isNew") ?? true;
  const startTimeRef = useRef<number | undefined>(undefined);
  const timerRef = useRef<{
    getTime: () => number;
    pause: () => void;
    resume: () => void;
  } | null>(null);

  useLayoutEffect(() => {
    console.log(`Game component mounted. isNew: ${isNew}`);
    switch (isNew) {
      case "true":
        // Initialize a new game
        console.log("Starting a new game...");
        startTimeRef.current = 0;
        console.log(generateSudoku("medium"));
        setGameState({
          board: generateSudoku("medium"),
          memo: Array.from({ length: 9 }, () =>
            Array.from({ length: 9 }, () => []),
          ),
        }); // Replace with your actual board generation logic
        setIsLoading(false);
        break;
      case "false":
        // Load an existing game
        console.log("Loading an existing game...");

        const savedGameState = localStorage.getItem("sudokuGameState");

        if (savedGameState) {
          const parsedState = JSON.parse(savedGameState);
          setGameState({
            board: parsedState.board,
            memo: parsedState.memo,
          });
          startTimeRef.current = parsedState.startTime ?? 0;
        } else {
          console.log(
            "No saved game state found. Starting a new game instead.",
          );
          startTimeRef.current = 0;
          setGameState({
            board: generateSudoku("medium"),
            memo: Array.from({ length: 9 }, () =>
              Array.from({ length: 9 }, () => []),
            ),
          });
        }
        break;
      default:
    }
    setIsLoading(false);
  }, [isNew]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-w-3xl">
      {/* timer */}
      <div className="flex justify-evenly items-center">
        <Timer ref={timerRef} startTime={startTimeRef?.current ?? 0} />
        <div className="flex gap-2 items-center">
          <button>
            {status === "playing" ? (
              <span
                onClick={() => {
                  timerRef.current?.pause();
                  setStatus("paused");
                }}
              >
                Pause
              </span>
            ) : (
              <span
                onClick={() => {
                  timerRef.current?.resume();
                  setStatus("playing");
                }}
              >
                Resume
              </span>
            )}
          </button>
          <button
            onClick={() => {
              timerRef.current?.pause();
              setStatus("paused");
              const currentTime = timerRef.current?.getTime();
              if (currentTime) {
                localStorage.setItem(
                  "sudokuGameState",
                  JSON.stringify({
                    startTime: currentTime,
                    ...gameState,
                  }),
                );
              }
              // Navigate to the home page
              navigate("/");
            }}
          >
            Save
          </button>
        </div>
      </div>
      {/* board */}
      <div className="flex justify-center items-center">
        <Board
          board={gameState.board}
          memo={gameState.memo}
          status={status}
          onCellChange={(row, col, newValue, newMemo) => {
            console.log(
              `Cell at (${row}, ${col}) changed to ${newValue} with memo ${newMemo}`,
            );
            setGameState((prevState) => {
              const newBoard = prevState.board.map((r, rIndex) =>
                r.map((c, cIndex) =>
                  rIndex === row && cIndex === col ? newValue : c,
                ),
              );
              // const newMemo = prevState.memo.map((r, rIndex) =>
              //   r.map((c, cIndex) =>
              //     rIndex === row && cIndex === col ? (newMemo ?? []) : c,
              //   ),
              // );
              return {
                board: newBoard,
                memo: newMemo,
              };
            });
          }}
        />
      </div>
    </div>
  );
};
