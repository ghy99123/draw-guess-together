import { useRef, useState } from "react";

/**
 * @param duration total duration in second
 * @param onFinish callback funciton when the count down finishes
 * @returns a function to start the count down and a stateful value of remaining time in second
 */
export default function useCountDown(
  duration: number,
  onFinish?: () => void
): [() => void, number] {
  const milliDuration = duration * 1000;
  const startRef = useRef<number>();
  const requestRef = useRef<number>();
  const [remain, setRemain] = useState<number>(milliDuration);

  const start = () => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    // Using requestAnimationFrame instead of setInterval to get more smooth user experinece
    requestRef.current = requestAnimationFrame(animate);
  };

  const animate = (time: number) => {
    if (startRef.current === undefined) startRef.current = time;
    const elapsed = time - startRef.current;

    if (elapsed < milliDuration) {
      setRemain(milliDuration - elapsed);
      requestAnimationFrame(animate);
    } else {
      if (typeof onFinish === "function") onFinish();
    }
  };

  return [start, remain / 1000];
}

// export default useCountDown;
