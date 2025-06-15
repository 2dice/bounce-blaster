import React from 'react';
import { useFpsMeter } from '../hooks/useFpsMeter';

interface DebugPanelProps {
  seed: string;
  showGrid: boolean;
  onToggleGrid: () => void;
}

/**
 * デバッグパネルコンポーネント - DEV環境でのみ表示
 * FPS表示、シード値表示、グリッド表示切り替え機能を提供
 */
export const DebugPanel: React.FC<DebugPanelProps> = ({
  seed,
  showGrid,
  onToggleGrid,
}) => {
  const fps = useFpsMeter();

  return (
    <div className="fixed right-2 top-2 min-w-[120px] rounded-lg border border-gray-600 bg-black bg-opacity-80 p-3 text-sm text-white">
      <div className="space-y-2">
        {/* FPS表示 */}
        <div className="flex items-center justify-between">
          <span>FPS:</span>
          <span className="font-mono text-green-400">{fps}</span>
        </div>

        {/* シード値表示 */}
        <div className="flex items-center justify-between">
          <span>Seed:</span>
          <span
            className="max-w-[60px] truncate font-mono text-xs text-blue-400"
            title={seed}
          >
            {seed}
          </span>
        </div>

        {/* グリッド表示切り替えボタン */}
        <button
          onClick={onToggleGrid}
          className={`w-full rounded px-2 py-1 text-xs font-medium transition-colors ${
            showGrid
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-600 text-gray-200 hover:bg-gray-700'
          }`}
        >
          Grid: {showGrid ? 'ON' : 'OFF'}
        </button>
      </div>
    </div>
  );
};
