interface OverlayErrorProps {
  error: string;
  onRetry: () => void;
}

/**
 * エラー表示オーバーレイコンポーネント
 * ステージ生成エラー時にエラーメッセージとリトライボタンを表示
 */
export const OverlayError = ({ error, onRetry }: OverlayErrorProps) => (
  <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
    <div className="rounded border border-red-600 bg-gray-800 p-6 text-center">
      <div className="mb-4 text-red-400">
        <svg
          className="mx-auto h-12 w-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>

      <h2 className="mb-2 text-lg font-bold text-white">
        エラーが発生しました
      </h2>

      <p className="mb-6 text-sm text-gray-300">{error}</p>

      <button
        onClick={onRetry}
        className="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        再試行
      </button>
    </div>
  </div>
);
