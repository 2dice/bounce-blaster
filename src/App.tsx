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
import { OverlayResult } from './components/OverlayResult';
import { MaxBounceSelect } from './components/MaxBounceSelect';
import { DebugPanel } from './components/DebugPanel';

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

  // グリッド表示切り替えハンドラー
  const handleToggleGrid = () => {
    dispatch({ type: ActionTypes.TOGGLE_GRID });
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

        generateStage({ maxBounce: state.stage.maxBounce }, onProgress)
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
  }, [state.phase, state.stage.maxBounce, generateStage, dispatch]);

  // 成功/失敗後の自動遷移タイマー
  useEffect(() => {
    if (state.phase === Phase.SUCCESS || state.phase === Phase.FAIL) {
      const timer = setTimeout(() => {
        dispatch({ type: ActionTypes.NEXT_STAGE });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [state.phase, dispatch]);

  return (
    <div className="flex min-h-screen w-full bg-black text-white">
      {/* レスポンシブコンテナ - 中央寄せ、最大幅制限、黒帯背景 */}
      <div className="container relative mx-auto flex max-w-none flex-col bg-gray-900">
        {/* コントロールバー - タイトルとMax Bounceを含む */}
        <div className="flex h-12 w-full items-center justify-between border-b border-gray-700 bg-gray-800 px-4">
          <h1 className="text-2xl font-bold">Bounce Blaster</h1>
          <MaxBounceSelect />
        </div>

        {/* ゲームキャンバス エリア - 4:3 アスペクト比維持 */}
        <div className="flex flex-1 items-center justify-center bg-gray-900 p-4">
          <GameCanvas className="h-full w-full" />
        </div>

        {/* オーバーレイ群 */}
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

        {/* 成功時のオーバーレイ */}
        {state.phase === Phase.SUCCESS && <OverlayResult type="success" />}

        {/* 失敗時のオーバーレイ */}
        {state.phase === Phase.FAIL && <OverlayResult type="fail" />}

        {/* デバッグパネル（DEV環境のみ） */}
        {__DEV__ && (
          <DebugPanel
            seed={state.stage.seed?.toString(36) || '0'}
            showGrid={state.showGrid}
            onToggleGrid={handleToggleGrid}
          />
        )}
      </div>
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
