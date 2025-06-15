import { useEffect, useRef, useState } from 'react';

/**
 * FPS計測フック - requestAnimationFrame毎に計測し平均値を1秒間隔で更新
 */
export const useFpsMeter = () => {
  const [fps, setFps] = useState<number>(0);
  const frameCountRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());
  const animationIdRef = useRef<number>(0);

  useEffect(() => {
    const measureFps = () => {
      const now = performance.now();
      frameCountRef.current++;

      // 1秒経過したらFPSを更新
      if (now - lastTimeRef.current >= 1000) {
        const elapsedSeconds = (now - lastTimeRef.current) / 1000;
        const currentFps = Math.round(frameCountRef.current / elapsedSeconds);

        setFps(currentFps);
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      animationIdRef.current = requestAnimationFrame(measureFps);
    };

    animationIdRef.current = requestAnimationFrame(measureFps);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  return fps;
};
