// hooks/useLongPress.ts
// Returns event handlers that fire onLongPress after `delay` ms.
// Used for the "long press to copy" contact details feature.

import { useCallback, useRef } from "react";

interface LongPressOptions {
  onLongPress: () => void;
  delay?: number;
}

export function useLongPress({ onLongPress, delay = 500 }: LongPressOptions) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = useCallback(() => {
    timer.current = setTimeout(() => {
      onLongPress();
    }, delay);
  }, [onLongPress, delay]);

  const cancel = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  return {
    onMouseDown: start,
    onMouseUp: cancel,
    onMouseLeave: cancel,
    onTouchStart: start,
    onTouchEnd: cancel,
  };
}
