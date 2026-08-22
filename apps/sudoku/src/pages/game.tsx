/* eslint-disable react-hooks/refs */
/* eslint-disable react-hooks/set-state-in-effect */
import { Button, Dialog } from "@core/ui";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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

const computeInvalidCells = (
  board: number[][],
  given: boolean[][],
): boolean[][] => {
  const invalid: boolean[][] = Array.from({ length: 9 }, () =>
    Array(9).fill(false),
  );
  if (board.length < 9 || board[0]?.length < 9) return invalid;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = board[r]?.[c];
      if (val === undefined || val === 0 || given[r]?.[c]) continue;
      for (let i = 0; i < 9; i++) {
        if (i !== c && board[r][i] === val) { invalid[r][c] = true; break; }
      }
      if (invalid[r][c]) continue;
      for (let i = 0; i < 9; i++) {
        if (i !== r && board[i][c] === val) { invalid[r][c] = true; break; }
      }
      if (invalid[r][c]) continue;
      const boxR = Math.floor(r / 3) * 3;
      const boxC = Math.floor(c / 3) * 3;
      outer: for (let br = boxR; br < boxR + 3; br++) {
        for (let bc = boxC; bc < boxC + 3; bc++) {
          if ((br !== r || bc !== c) && board[br][bc] === val) {
            invalid[r][c] = true;
            break outer;
          }
        }
      }
    }
  }
  return invalid;
};

const isValidAt = (
  board: number[][],
  r: number,
  c: number,
  num: number,
): boolean => {
  for (let i = 0; i < 9; i++) {
    if (board[r][i] === num || board[i][c] === num) return false;
  }
  const boxR = Math.floor(r / 3) * 3;
  const boxC = Math.floor(c / 3) * 3;
  for (let br = boxR; br < boxR + 3; br++) {
    for (let bc = boxC; bc < boxC + 3; bc++) {
      if (board[br][bc] === num) return false;
    }
  }
  return true;
};

const solveBoard = (grid: number[][]): boolean => {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValidAt(grid, r, c, num)) {
            grid[r][c] = num;
            if (solveBoard(grid)) return true;
            grid[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

const isBoardSolvable = (board: number[][]): boolean => {
  const copy = board.map((row) => [...row]);
  return solveBoard(copy);
};

const HINT_COINS_BY_DIFFICULTY: Record<Level, number> = {
  easy: 3,
  medium: 2,
  hard: 1,
};

const MAX_HISTORY = 40;

type CellSnapshot = {
  row: number;
  col: number;
  value: number;
  memo: string[];
};

type HistoryAction = {
  before: CellSnapshot;
  after: CellSnapshot;
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
  const [showRestartDialog, setShowRestartDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showBackDialog, setShowBackDialog] = useState(false);
  const [showGameOverDialog, setShowGameOverDialog] = useState(false);
  const [historyVersion, setHistoryVersion] = useState(0);

  const isNew = query[0].get("isNew") ?? true;
  const startTimeRef = useRef<number | undefined>(undefined);
  const boardContainerRef = useRef<HTMLDivElement>(null);
  const undoStackRef = useRef<HistoryAction[]>([]);
  const redoStackRef = useRef<HistoryAction[]>([]);
  // historyVersion forces a re-render whenever the undo/redo stacks change,
  // since the stacks themselves live in refs.
  const canUndo = historyVersion >= 0 && undoStackRef.current.length > 0;
  const canRedo = historyVersion >= 0 && redoStackRef.current.length > 0;
  const invalidCells = useMemo(
    () => computeInvalidCells(gameState.board, gameState.given),
    [gameState.board, gameState.given],
  );
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
    skipHistory = false,
  ) => {
    if (gameState.given[row]?.[col]) return;

    setGameState((prevState) => {
      const prevValue = prevState.board[row][col];
      const prevMemo = prevState.memo[row][col];
      const resolvedNewMemo = newMemo ?? prevMemo;

      const newBoard = prevState.board.map((r, rIndex) =>
        r.map((c, cIndex) => (rIndex === row && cIndex === col ? newValue : c)),
      );
      const newMemoState = prevState.memo.map((r, rIndex) =>
        r.map((c, cIndex) =>
          rIndex === row && cIndex === col ? resolvedNewMemo : c,
        ),
      );
      const nextState = {
        ...prevState,
        board: newBoard,
        memo: newMemoState,
      };

      if (!skipHistory) {
        undoStackRef.current.push({
          before: { row, col, value: prevValue, memo: prevMemo },
          after: { row, col, value: newValue, memo: resolvedNewMemo },
        });
        if (undoStackRef.current.length > MAX_HISTORY) {
          undoStackRef.current.shift();
        }
        redoStackRef.current = [];
        setHistoryVersion((v) => v + 1);
      }

      if (!hasCompletedRef.current && isBoardComplete(newBoard)) {
        hasCompletedRef.current = true;
        timerRef.current?.pause();
        const time = timerRef.current?.getTime() ?? 0;
        const { rank: earnedRank } = addHighScore(difficulty, time);
        setFinalTime(time);
        setRank(earnedRank);
        setStatus("completed");
        localStorage.removeItem("sudokuGameState");
      } else if (newValue !== 0 && !hasCompletedRef.current) {
        const newInvalid = computeInvalidCells(newBoard, prevState.given);
        const hasConflict = newInvalid.some((r) => r.some((v) => v));
        if (hasConflict || !isBoardSolvable(newBoard)) {
          setShowGameOverDialog(true);
        }
      }

      return nextState;
    });
  };

  const handleUndo = () => {
    const action = undoStackRef.current.pop();
    if (!action) return;
    redoStackRef.current.push(action);
    handleCellChange(
      action.before.row,
      action.before.col,
      action.before.value,
      action.before.memo,
      true,
    );
    setHistoryVersion((v) => v + 1);
  };

  const handleRedo = () => {
    const action = redoStackRef.current.pop();
    if (!action) return;
    undoStackRef.current.push(action);
    handleCellChange(
      action.after.row,
      action.after.col,
      action.after.value,
      action.after.memo,
      true,
    );
    setHistoryVersion((v) => v + 1);
  };

  const handleRestart = () => {
    setGameState((prevState) => ({
      ...prevState,
      board: prevState.given.map((row, rowIndex) =>
        row.map((isGiven, colIndex) =>
          isGiven ? prevState.board[rowIndex][colIndex] : 0,
        ),
      ),
      memo: Array.from({ length: 9 }, () =>
        Array.from({ length: 9 }, () => []),
      ),
    }));
    undoStackRef.current = [];
    redoStackRef.current = [];
    hasCompletedRef.current = false;
    setSelected(null);
    setHistoryVersion((v) => v + 1);
    setShowRestartDialog(false);
    setShowGameOverDialog(false);
    timerRef.current?.resume();
  };

  const persistGameState = () => {
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
  };

  const handleSaveConfirm = () => {
    setShowSaveDialog(false);
    persistGameState();
    navigate("/");
  };

  const handleBackConfirm = () => {
    setShowBackDialog(false);
    navigate("/");
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
              timerRef.current?.pause();
              setShowBackDialog(true);
            }}
          >
            ← Back
          </Button>
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
            onClick={() => {
              timerRef.current?.pause();
              setShowRestartDialog(true);
            }}
            disabled={status !== "playing"}
          >
            Restart
          </Button>
          <Button
            variant="secondary"
            aria-label="Undo"
            title="Undo"
            onClick={handleUndo}
            disabled={status !== "playing" || !canUndo}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 14 4 9l5-5" />
              <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
            </svg>
          </Button>
          <Button
            variant="secondary"
            aria-label="Redo"
            title="Redo"
            onClick={handleRedo}
            disabled={status !== "playing" || !canRedo}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 14 5-5-5-5" />
              <path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13" />
            </svg>
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              timerRef.current?.pause();
              setStatus("paused");
              setShowSaveDialog(true);
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
          invalidCells={invalidCells}
          status={
            showRestartDialog || showBackDialog
              ? "paused"
              : status === "completed"
                ? "playing"
                : status
          }
          hoveredNumber={hoveredNumber}
          hintNumber={hintModeNumber}
          selected={selected}
          onSelectCell={(row, col) => setSelected({ row, col })}
          onCellChange={handleCellChange}
        />
      </div>
      <div
        className={`flex flex-col items-center gap-2 ${
          status === "paused" ? "invisible" : ""
        }`}
      >
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

      <Dialog
        open={showRestartDialog}
        onClose={() => setShowRestartDialog(false)}
        title="Restart Game?"
      >
        <div className="flex flex-col gap-3 min-w-56">
          <p>
            This will clear all the values and memos you&apos;ve entered. The
            original given numbers will stay. Are you sure?
          </p>
          <div className="flex gap-2 justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setShowRestartDialog(false);
                timerRef.current?.resume();
              }}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleRestart}>
              Restart
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={showSaveDialog}
        onClose={() => {
          setShowSaveDialog(false);
          timerRef.current?.resume();
          setStatus("playing");
        }}
        title="Save Game?"
      >
        <div className="flex flex-col gap-3 min-w-56">
          <p>
            This will save your current progress and return you to the menu.
            Continue?
          </p>
          <div className="flex gap-2 justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setShowSaveDialog(false);
                timerRef.current?.resume();
                setStatus("playing");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveConfirm}>Save</Button>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={showBackDialog}
        onClose={() => {
          setShowBackDialog(false);
          timerRef.current?.resume();
        }}
        title="Leave Game?"
      >
        <div className="flex flex-col gap-3 min-w-56">
          <p>
            Going back to the menu without saving will discard your current
            progress. Are you sure?
          </p>
          <div className="flex gap-2 justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setShowBackDialog(false);
                timerRef.current?.resume();
              }}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleBackConfirm}>
              Leave
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={showGameOverDialog}
        onClose={() => setShowGameOverDialog(false)}
        title="Game Over"
      >
        <div className="flex flex-col gap-3 min-w-56">
          <p>
            The board can no longer be completed with the current values. You
            can restart to try again.
          </p>
          <div className="flex gap-2 justify-end">
            <Button
              variant="secondary"
              onClick={() => setShowGameOverDialog(false)}
            >
              Dismiss
            </Button>
            <Button variant="danger" onClick={handleRestart}>
              Restart
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog open={status === "completed"} title="🎉 Congratulations!">        <div className="flex flex-col gap-3 min-w-56">
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
