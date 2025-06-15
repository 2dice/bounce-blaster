/**
 * ゲーム結果（成功/失敗）を表示するオーバーレイコンポーネント
 */

type OverlayResultProps = {
  type: 'success' | 'fail';
};

/**
 * 結果表示オーバーレイ
 * 成功時は緑色、失敗時は赤色で結果を1秒間表示
 * 背景は透明な黒でオーバーレイ
 */
export const OverlayResult = ({ type }: OverlayResultProps) => {
  const isSuccess = type === 'success';
  const message = isSuccess ? 'SUCCESS!' : 'FAILED!';
  const messageColor = isSuccess ? 'bg-green-600' : 'bg-red-600';

  return (
    <div
      role="dialog"
      className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
    >
      <div className={`rounded-lg px-12 py-8 shadow-lg ${messageColor}`}>
        <h2 className="text-center text-4xl font-bold text-white">{message}</h2>
      </div>
    </div>
  );
};
