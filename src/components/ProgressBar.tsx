interface ProgressBarProps {
  progress: number; // 0-100の進捗値
}

/**
 * 進捗バーUIコンポーネント
 * 設計仕様: 240 × 60 px プログレスバー
 */
export const ProgressBar = ({ progress }: ProgressBarProps) => (
  // reducerで既にクランプ済みの値を受け取るため、追加のクランプ処理は不要
  <div className="h-16 w-60 rounded border border-gray-600 bg-gray-800">
    <div className="p-2">
      {/* プログレスバー本体 */}
      <div className="h-8 w-full overflow-hidden rounded bg-gray-700">
        <div
          className="h-full bg-blue-500 transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* 進捗テキスト */}
      <div className="mt-1 text-center text-sm text-white">
        生成中... {Math.round(progress)}%
      </div>
    </div>
  </div>
);
