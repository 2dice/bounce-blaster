import { useState, useEffect } from 'react';
import { Stage } from '../models/types';
import { generateStage } from '../utils/stageGenerator';

/**
 * ステージ生成ロジックをカプセル化するカスタムフック
 * - `useEffect` を使用して、コンポーネントのマウント時に一度だけステージ生成関数をセットアップします。
 * - `useState` で `generateStage` 関数自体を状態として保持し、準備ができたらそれを返します。
 * - `generateStage` は呼び出されると Promise を返し、10ms の遅延後に固定ステージデータを解決します。
 *
 * 現在は固定のステージデータを返すスタブ実装
 */
import { GenerateStageOptions } from '../utils/stageGenerator'; // Import GenerateStageOptions

export const useStageGenerator = () => {
  const [genFunc, setGenFunc] = useState<
    ((_options?: GenerateStageOptions) => Promise<Stage>) | null
  >(null);

  useEffect(() => {
    // 一度だけ関数をセット
    setGenFunc(
      () => (_options?: GenerateStageOptions) =>
        new Promise<Stage>((resolve, reject) => {
          try {
            // 渡された _options を generateStage に渡す
            // _options が undefined の場合はデフォルトの {} を渡す
            const stage = generateStage(_options ?? {});
            resolve(stage);
          } catch (e) {
            reject(e as Error);
          }
        }),
    );
  }, []);

  return genFunc;
};
