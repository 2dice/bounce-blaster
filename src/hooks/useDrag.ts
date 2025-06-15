import { useCallback, useRef, useState } from 'react';
import { Point } from '../models/types';

export interface DragState {
  isDragging: boolean;
  startPos: Point | null;
  currentPos: Point | null;
}

export interface DragHandlers {
  onPointerDown: (_event: React.PointerEvent) => void;
  onPointerMove: (_event: React.PointerEvent) => void;
  onPointerUp: (_event: React.PointerEvent) => void;
}

/**
 * ドラッグ操作を抽象化するフック
 * pointerdown / move / up イベントをラップし、ドラッグ状態を管理
 */
export const useDrag = (
  onDragStart?: (_pos: Point) => void,
  onDragMove?: (_startPos: Point, _currentPos: Point) => void,
  onDragEnd?: (_startPos: Point, _endPos: Point) => void,
): [DragState, DragHandlers] => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startPos: null,
    currentPos: null,
  });

  const isPointerCapturedRef = useRef(false);

  // Canvas要素内でのマウス座標を取得
  const getCanvasPosition = useCallback((event: React.PointerEvent): Point => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }, []);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent) => {
      const pos = getCanvasPosition(event);

      // ポインターをキャプチャ（ブラウザでのみ実行）
      if (
        'setPointerCapture' in event.currentTarget &&
        typeof event.currentTarget.setPointerCapture === 'function'
      ) {
        event.currentTarget.setPointerCapture(event.pointerId);
        isPointerCapturedRef.current = true;
      }

      setDragState({
        isDragging: true,
        startPos: pos,
        currentPos: pos,
      });

      onDragStart?.(pos);
    },
    [getCanvasPosition, onDragStart],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent) => {
      if (!dragState.isDragging || !dragState.startPos) return;

      const pos = getCanvasPosition(event);

      setDragState(prev => ({
        ...prev,
        currentPos: pos,
      }));

      onDragMove?.(dragState.startPos, pos);
    },
    [dragState.isDragging, dragState.startPos, getCanvasPosition, onDragMove],
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent) => {
      if (!dragState.isDragging || !dragState.startPos) return;

      const pos = getCanvasPosition(event);

      // ポインターキャプチャを解放（ブラウザでのみ実行）
      if (
        isPointerCapturedRef.current &&
        'releasePointerCapture' in event.currentTarget &&
        typeof event.currentTarget.releasePointerCapture === 'function'
      ) {
        event.currentTarget.releasePointerCapture(event.pointerId);
        isPointerCapturedRef.current = false;
      }

      setDragState({
        isDragging: false,
        startPos: null,
        currentPos: null,
      });

      onDragEnd?.(dragState.startPos, pos);
    },
    [dragState.isDragging, dragState.startPos, getCanvasPosition, onDragEnd],
  );

  return [
    dragState,
    {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
    },
  ];
};
