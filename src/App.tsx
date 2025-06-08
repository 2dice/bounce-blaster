import './index.css';
import { GameProvider } from './contexts/GameProvider';
import { useEffect } from 'react';
import { useGameReducer } from './hooks/useGameReducer';
import { useStageGenerator } from './hooks/useStageGenerator';
import { ActionTypes, Phase } from './models/enums';
import { Stage } from './models/types';
import GameCanvas from './components/GameCanvas';
import { OverlayGenerating } from './components/OverlayGenerating';
import { OverlayError } from './components/OverlayError';

/**
 * メインアプリケーションのコンポーネント
 */
function App() {
  const { state, dispatch } = useGameReducer();
  const generateStage = useStageGenerator();

  // リトライハンドラー
  const handleRetry = () => {
    dispatch({ type: ActionTypes.RETRY_GENERATION });
  };

  // ステージ生成処理
  useEffect(() => {
    if (state.phase === Phase.GENERATING) {
      dispatch({ type: ActionTypes.GENERATING }); // 明示的に生成開始
      if (generateStage) {
        // 進捗更新のコールバック関数
        const onProgress = (progress: number) => {
          dispatch({
            type: ActionTypes.PROGRESS_UPDATE,
            payload: { progress },
          });
        };

        generateStage({}, onProgress)
          .then((stage: Stage) => {
            dispatch({ type: ActionTypes.READY, payload: { stage } });
          })
          .catch((error: Error) => {
            // エラー発生時はERRORフェーズに遷移
            dispatch({
              type: ActionTypes.ERROR,
              payload: {
                error: `ステージ生成に失敗しました: ${error.message}`,
              },
            });
          });
      } else {
        // generateStage が falsy の場合の処理（必要であれば）
      }
    }
  }, [state.phase, generateStage, dispatch]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="mb-8 text-center text-4xl font-bold">
        Hello Bounce Blaster
      </h1>
      <main>
        {/* GameCanvas コンポーネントに切り出し */}
        <GameCanvas width={960} height={720} />
      </main>

      {/* ステージ生成中のオーバーレイ */}
      {state.phase === Phase.GENERATING && (
        <OverlayGenerating progress={state.progress} />
      )}

      {/* エラー時のオーバーレイ */}
      {state.phase === Phase.ERROR && (
        <OverlayError
          error={state.error || 'unknown error'}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
}

/**
 * GameProviderでラップしたアプリケーション
 * これによりアプリ全体でゲーム状態を共有できる
 */
function AppWithProvider() {
  return (
    <GameProvider>
      <App />
    </GameProvider>
  );
}

export default AppWithProvider;
