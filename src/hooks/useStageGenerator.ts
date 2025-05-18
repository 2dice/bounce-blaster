import { useState, useEffect } from 'react';
import { Stage } from '../models/types';

// 固定ステージのデータ
const STUB_STAGE_DATA: Stage = {
  width: 960,
  height: 720,
  maxBounce: 3,
  cannon: { x: 50, y: 670 },
  target: { x: 800, y: 100 },
  walls: [],
  solution: [],
};

/**
 * ステージ生成ロジックをカプセル化するカスタムフック
 * - `useEffect` を使用して、コンポーネントのマウント時に一度だけステージ生成関数をセットアップします。
 * - `useState` で `generateStage` 関数自体を状態として保持し、準備ができたらそれを返します。
 * - `generateStage` は呼び出されると Promise を返し、10ms の遅延後に固定ステージデータを解決します。
 *
 * 現在は固定のステージデータを返すスタブ実装
 */
export const useStageGenerator = () => {
  const [generateStage, setGenerateStage] = useState<
    (() => Promise<Stage>) | null
  >(null);

  useEffect(() => {
    setGenerateStage(
      () => () =>
        new Promise<Stage>(resolve => {
          setTimeout(() => {
            resolve(STUB_STAGE_DATA);
          }, 10);
        }),
    );
  }, []);

  return generateStage;
};
