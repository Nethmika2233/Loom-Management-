import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";

export function AnimatedCounter({ value, duration = 0.8 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const prevValue = useRef(0);

  useEffect(() => {
    const controls = animate(prevValue.current, value, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    prevValue.current = value;
    return () => controls.stop();
  }, [value, duration]);

  return <>{display.toLocaleString()}</>;
}
