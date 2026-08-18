import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";

export const Timer = forwardRef<
  {
    getTime: () => number;
    pause: () => void;
    resume: () => void;
  },
  { startTime: number }
>(({ startTime = 0 }, ref) => {
  const divRef = useRef<HTMLDivElement>(null);
  const elapsedTimeRef = useRef<number>(startTime);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const resume = useCallback(() => {
    intervalRef.current = setInterval(() => {
      if (divRef.current) {
        divRef.current.textContent = `${elapsedTimeRef.current.toFixed(2)} seconds`;
      }
      elapsedTimeRef.current += 0.01;
    }, 10);
  }, []);

  useLayoutEffect(() => {
    resume();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startTime, resume]);

  useImperativeHandle(
    ref,
    () => ({
      getTime: () => elapsedTimeRef.current,
      pause: () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      },
      resume,
    }),
    [elapsedTimeRef, resume],
  );

  return <div ref={divRef}>{startTime.toFixed(2)} seconds</div>;
});
