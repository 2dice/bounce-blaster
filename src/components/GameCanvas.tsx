import { useEffect, useRef } from 'react';
import { useMatterEngine } from '../hooks/useMatterEngine';
// matter.js 関連
import { Bodies, Body, Composite } from 'matter-js';

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
  const { engine, walls } = useMatterEngine({ width, height });

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

      // bullet 描画
      engine.world.bodies.forEach(body => {
        if (body.label === 'bullet') {
          const { x, y } = body.position;
          const circleBody = body as Body & { circleRadius?: number };
          const r = circleBody.circleRadius ?? 12;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = '#ff3333';
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    // クリーンアップ: アニメーションフレームを停止
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [walls, width, height, engine]);

  // クリックで弾を生成して発射
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!engine) return;

    // Canvas 座標系へ変換
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // 仮の砲台位置（左下の固定座標）
    const cannon = { x: 50, y: height - 50 };

    // 方向ベクトルを正規化
    const dx = clickX - cannon.x;
    const dy = clickY - cannon.y;
    const len = Math.hypot(dx, dy);
    if (len === 0) return;

    const speed = 10; // 発射初速(px/step)。暫定値
    const vx = (dx / len) * speed;
    const vy = (dy / len) * speed;

    // Bullet Body 生成
    const bulletRadius = 12;
    const bullet = Bodies.circle(cannon.x, cannon.y, bulletRadius, {
      restitution: 1,
      friction: 0,
      frictionAir: 0,
      label: 'bullet',
    });

    Body.setVelocity(bullet, { x: vx, y: vy });

    // World へ追加
    Composite.add(engine.world, bullet);
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="h-[720px] w-[960px] border bg-zinc-800"
      data-testid="game-canvas"
      onClick={handleClick}
    />
  );
};

export default GameCanvas;
