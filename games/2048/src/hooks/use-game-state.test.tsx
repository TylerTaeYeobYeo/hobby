import { StrictMode, type ReactNode, useRef } from "react";
import { MemoryRouter } from "react-router";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Pin the starting board to one where a single left move creates a 2048
// tile, so the win path (and its high-score recording) is deterministic.
vi.mock("../util/board", async (importOriginal) => {
  const orig =
    await importOriginal<typeof import("../util/board")>();
  return {
    ...orig,
    createInitialBoard: () => [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1024, 1024, 0, 0],
    ],
  };
});

import { useGameState, type TimerHandle } from "./use-game-state";

const makeTimer = (elapsed = 7): TimerHandle => ({
  getTime: () => elapsed,
  pause: () => {},
  resume: () => {},
  reset: () => {},
});

const wrapper =
  (props: { children: ReactNode }) =>
  (
    <StrictMode>
      <MemoryRouter initialEntries={["/2048/game?isNew=true"]}>
        {props.children}
      </MemoryRouter>
    </StrictMode>
  );

const render2048 = () =>
  renderHook(() => {
    const timerRef = useRef<TimerHandle | null>(null);
    if (timerRef.current === null) timerRef.current = makeTimer();
    return useGameState(timerRef);
  }, { wrapper });

const pressKey = (key: string) =>
  act(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key }));
  });

describe("useGameState (2048)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts idle with the pinned two-tile board", () => {
    const { result } = render2048();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.status).toBe("idle");
    expect(result.current.board[3]).toEqual([1024, 1024, 0, 0]);
  });

  it("moves a tile with the arrow keys", () => {
    const { result } = render2048();
    pressKey("ArrowLeft");
    expect(result.current.board[3][0]).toBe(2048);
    expect(result.current.score).toBe(2048);
  });

  it("records exactly one high score when the 2048 tile is reached", () => {
    const { result } = render2048();

    pressKey("ArrowLeft");

    expect(result.current.status).toBe("won");
    expect(result.current.rank).toBe(1);

    const raw = localStorage.getItem("2048HighScores");
    expect(raw).not.toBeNull();
    const entries = JSON.parse(raw!) as Array<{ time: number; score: number }>;
    // A side effect that ran twice (e.g. via a StrictMode-double-invoked
    // state updater) would leave two entries here.
    expect(entries).toHaveLength(1);
    expect(entries[0].score).toBe(2048);
    expect(entries[0].time).toBe(7);
    // The saved game is cleared once the game ends.
    expect(localStorage.getItem("2048GameState")).toBeNull();
  });

  it("ignores moves after the game is over", () => {
    const { result } = render2048();
    pressKey("ArrowLeft");
    expect(result.current.status).toBe("won");

    const before = result.current.board;
    pressKey("ArrowRight");
    expect(result.current.board).toEqual(before);
    expect(result.current.status).toBe("won");
  });
});
