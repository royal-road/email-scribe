import { useState, useEffect, useCallback } from 'react';

export default function useLongPress(callback = () => {}, ms = 300) {
  const [startLongPress, setStartLongPress] = useState(false);
  const [longPressTriggered, setLongPressTriggered] = useState(false);

  useEffect(() => {
    let timerId: number | Timer | undefined;
    if (startLongPress && !longPressTriggered) {
      timerId = setTimeout(() => {
        callback();
        setLongPressTriggered(true);
      }, ms);
    } else {
      clearTimeout(timerId);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [callback, ms, startLongPress, longPressTriggered]);

  const start = useCallback(() => {
    setStartLongPress(true);
    setLongPressTriggered(false);
  }, []);

  const stop = useCallback(() => {
    setStartLongPress(false);
    setLongPressTriggered(false);
  }, []);

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: start,
    onTouchEnd: stop,
  };
}
