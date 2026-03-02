import type { MouseEvent, TouchEvent } from 'react';
import { useRef } from 'react';

interface Props {
  threshold?: number;
  onClick?: (event: MouseEvent | TouchEvent) => void;
  onLongClick?: (event: MouseEvent | TouchEvent) => void;
}

export function useLongClick({ threshold = 500, onClick, onLongClick }: Props) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const isLongClickRef = useRef(false);
  const isScrollingRef = useRef(false);

  function onMouseDown(event: MouseEvent | TouchEvent) {
    start(event);
  }

  function start(event: MouseEvent | TouchEvent) {
    isLongClickRef.current = false;
    isScrollingRef.current = false;
    timerRef.current = setTimeout(() => {
      isLongClickRef.current = true;
      onLongClick?.(event);
    }, threshold);
  }

  function onMouseUp(event: MouseEvent | TouchEvent) {
    cancel();
    if (!isLongClickRef.current && !isScrollingRef.current) {
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

  function onTouchMove() {
    cancel();
    isScrollingRef.current = true;
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
    onTouchMove,
    stopPropagationHandlers: {
      onMouseDown: stopPropagation,
      onMouseUp: stopPropagation,
      onMouseLeave: stopPropagation,
      onTouchStart: stopPropagation,
      onTouchEnd: stopPropagation,
      onTouchMove: stopPropagation,
    },
  };
}
