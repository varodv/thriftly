import type { MouseEvent, TouchEvent } from 'react';
import { useRef } from 'react';

interface Props {
  threshold?: number;
  onClick?: (event: MouseEvent | TouchEvent) => void;
  onLongClick?: (event: MouseEvent | TouchEvent) => void;
}

export function useLongClick({
  threshold = 500,
  onClick,
  onLongClick,
}: Props) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const isLongClickRef = useRef(false);

  function onMouseDown(event: MouseEvent | TouchEvent) {
    start(event);
  }

  function start(event: MouseEvent | TouchEvent) {
    isLongClickRef.current = false;
    timerRef.current = setTimeout(() => {
      isLongClickRef.current = true;
      onLongClick?.(event);
    }, threshold);
  }

  function onMouseUp(event: MouseEvent | TouchEvent) {
    cancel();
    if (!isLongClickRef.current) {
      onClick?.(event);
    }
  }

  function cancel() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
  }

  function onMouseLeave() {
    cancel();
  }

  function stopPropagation(event: MouseEvent | TouchEvent) {
    event.stopPropagation();
  }

  return {
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    onTouchStart: onMouseDown,
    onTouchEnd: onMouseUp,
    stopPropagationHandlers: {
      onMouseDown: stopPropagation,
      onMouseUp: stopPropagation,
      onMouseLeave: stopPropagation,
      onTouchStart: stopPropagation,
      onTouchEnd: stopPropagation,
    },
  };
}
