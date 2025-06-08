import { ProgressBar } from './ProgressBar';

interface OverlayGeneratingProps {
  progress: number; // 0-100の進捗値
}

/**
 * ステージ生成中の黒半透明オーバーレイコンポーネント
 * 設計仕様: 全面 α0.6 黒 + 中央 240 × 60 px プログレスバー
 */
export const OverlayGenerating = ({ progress }: OverlayGeneratingProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <ProgressBar progress={progress} />
  </div>
);
