import { useEffect, useRef } from 'react';
import { useMatterEngine } from '../hooks/useMatterEngine';

interface GameCanvasProps {
  width: number;
  height: number;
}

/**
 * matter.js の世界を Canvas に描画するコンポーネント
 * 現状は外周壁のみを白線で描画するシンプルな実装
 */
const GameCanvas = ({ width, height }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Engine & Walls を取得
  const { walls } = useMatterEngine({ width, height });

  // 描画ループ
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';

    let animationId: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      walls.forEach(wall => {
        const { vertices } = wall;
        ctx.beginPath();
        ctx.moveTo(vertices[0].x, vertices[0].y);
        for (let i = 1; i < vertices.length; i += 1) {
          ctx.lineTo(vertices[i].x, vertices[i].y);
        }
        ctx.closePath();
        ctx.stroke();
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    // クリーンアップ: アニメーションフレームを停止
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [walls, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="h-[720px] w-[960px] border bg-zinc-800"
      data-testid="game-canvas"
    />
  );
};

export default GameCanvas;
