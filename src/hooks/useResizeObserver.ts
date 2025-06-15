import { useEffect, useRef, useState } from 'react';

/**
 * ResizeObserver を使用してDOM要素のサイズ変更を監視するフック
 * @param callback サイズ変更時に呼び出されるコールバック
 * @returns [ref, { width, height }] リファレンスオブジェクトと現在のサイズ
 */
export function useResizeObserver<T extends HTMLElement>(
  callback?: (_entry: ResizeObserverEntry) => void,
): [React.RefObject<T | null>, { width: number; height: number }] {
  const elementRef = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const observerRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // ResizeObserver がサポートされていない場合は何もしない
    if (typeof ResizeObserver === 'undefined') {
      // eslint-disable-next-line no-console
      console.warn('ResizeObserver is not supported in this browser');
      return;
    }

    observerRef.current = new ResizeObserver(entries => {
      if (entries.length === 0) return;

      const entry = entries[0];
      const { width, height } = entry.contentRect;

      setSize({ width, height });

      if (callback) {
        callback(entry);
      }
    });

    observerRef.current.observe(element);

    // 初期サイズを設定
    const rect = element.getBoundingClientRect();
    setSize({ width: rect.width, height: rect.height });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [callback]);

  return [elementRef, size];
}
