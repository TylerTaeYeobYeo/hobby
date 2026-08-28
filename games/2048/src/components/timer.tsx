import { useTheme } from "@core/ui";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

export type TimerHandle = {
  getTime: () => number;
  pause: () => void;
  resume: () => void;
  reset: () => void;
};

const formatDisplay = (seconds: number) => `${seconds.toFixed(2)} seconds`;

// Unlike a typical stopwatch, this timer does not start on mount — callers
// decide when to `resume()` it (e.g. on the player's first move).
export const Timer = forwardRef<TimerHandle, { startTime?: number }>(
  ({ startTime = 0 }, ref) => {
    const divRef = useRef<HTMLDivElement>(null);
    const elapsedTimeRef = useRef<number>(startTime);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const { theme } = useTheme();
    const isNeu = theme === "neumorphism";
    const isMaterial = theme === "material";
    const isCupertino = theme === "cupertino";
    const isCyberpunk = theme === "cyberpunk";

    const pause = useCallback(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, []);

    const resume = useCallback(() => {
      if (intervalRef.current) return;
      intervalRef.current = setInterval(() => {
        elapsedTimeRef.current += 0.01;
        if (divRef.current) {
          divRef.current.textContent = formatDisplay(elapsedTimeRef.current);
        }
      }, 10);
    }, []);

    useEffect(() => () => pause(), [pause]);

    useImperativeHandle(
      ref,
      () => ({
        getTime: () => elapsedTimeRef.current,
        pause,
        resume,
        reset: () => {
          pause();
          elapsedTimeRef.current = 0;
          if (divRef.current) divRef.current.textContent = formatDisplay(0);
        },
      }),
      [pause, resume],
    );

    return (
      <div
        ref={divRef}
        className={`text-xl font-mono font-semibold rounded-xl px-4 py-2 ${
          isCyberpunk
            ? "text-[#00e5ff] bg-[#12121f] border border-[#00e5ff]/30 shadow-[0_0_10px_rgba(0,229,255,0.2)] rounded-sm"
            : "text-gray-800"
        } ${
          isNeu
            ? "bg-gray-200 shadow-[6px_6px_12px_rgba(0,0,0,0.15),-6px_-6px_12px_rgba(255,255,255,0.7)]"
            : isMaterial
              ? "bg-white shadow-md"
              : isCupertino
                ? "bg-white border border-[#E5E5EA] shadow-sm"
                : isCyberpunk
                  ? ""
                  : "bg-white/30 border border-white/40 backdrop-blur-md shadow-md"
        }`}
      >
        {formatDisplay(startTime)}
      </div>
    );
  },
);
