/**
 * 画面下部コントロールバーコンポーネント
 */
import { MaxBounceSelect } from './MaxBounceSelect';

/**
 * コントロールバーコンポーネント
 * Canvas下部に配置され、各種コントロールを含む
 */
export function ControlBar() {
  return (
    <div className="flex h-12 w-full max-w-[960px] items-center justify-end border-b border-gray-700 bg-gray-800 px-4">
      <MaxBounceSelect />
    </div>
  );
}
