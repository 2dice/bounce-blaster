import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { useMatterEngine } from '../hooks/useMatterEngine';
import { useGameContext } from '../contexts/GameContext';
import { ActionTypes, Phase } from '../models/enums';
import { useDrag } from '../hooks/useDrag';
import { useAimGuide } from '../hooks/useAimGuide';
import { Point } from '../models/types';
import { ParticleEngine } from '../utils/ParticleEngine';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { calcViewport } from '../utils/calcViewport';
// matter.js 関連
import {
  Bodies,
  Body,
  Composite,
  Events,
  type Engine as MatterEngine,
  type IEventCollision,
  type Pair,
} from 'matter-js';

interface GameCanvasProps {
  className?: string;
}

/**
 * matter.js の世界を Canvas に描画するコンポーネント
 * レスポンシブ対応で4:3アスペクト比を維持
 */
const GameCanvas = ({ className }: GameCanvasProps) => {
  const targetBodyRef = useRef<Body | null>(null);
  const cannonBodyRef = useRef<Body | null>(null);
  const blockBodiesRef = useRef<Body[]>([]);
  const particleEngineRef = useRef<ParticleEngine>(new ParticleEngine());
  const lastFrameTimeRef = useRef<number>(0);
  const trailCounterRef = useRef<number>(0);

  // GameContext から state と dispatch を取得
  const { state, dispatch } = useGameContext();
  const { stage } = state;

  // レスポンシブ対応: 親コンテナのサイズを監視
  const [containerRef, containerSize] = useResizeObserver<HTMLDivElement>();

  // Canvas の実際のサイズを計算（レスポンシブ対応）
  const { width, height } = useMemo(() => {
    if (containerSize.width === 0 || containerSize.height === 0) {
      // 初期値として基準サイズを使用
      return { width: 960, height: 720 };
    }
    return calcViewport(containerSize.width, containerSize.height);
  }, [containerSize]);

  // matter.jsワールドサイズは常に基準サイズ（960x720）を使用
  const worldSize = useMemo(() => ({ width: 960, height: 720 }), []);

  // ワールド座標とCanvas座標のスケールファクター
  const scaleFactor = useMemo(
    () => ({
      x: width / worldSize.width,
      y: height / worldSize.height,
    }),
    [width, height, worldSize.width, worldSize.height],
  );

  // Canvas のレファレンス
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Canvas座標をワールド座標に変換
  const canvasToWorld = useCallback(
    (canvasPoint: Point): Point => ({
      x: canvasPoint.x / scaleFactor.x,
      y: canvasPoint.y / scaleFactor.y,
    }),
    [scaleFactor],
  );

  // ワールド座標をCanvas座標に変換（将来のパーティクル描画最適化用）
  // TODO: パーティクル描画の最適化時に使用予定
  // const worldToCanvas = useCallback(
  //   (worldPoint: Point): Point => ({
  //     x: worldPoint.x * scaleFactor.x,
  //     y: worldPoint.y * scaleFactor.y,
  //   }),
  //   [scaleFactor],
  // );

  // ドラッグ中のマウス座標を管理
  const [currentMousePos, setCurrentMousePos] = useState<Point | null>(null);

  // 衝突時コールバック
  const handleBulletTargetCollision = useCallback(() => {
    // ヒット時火花エフェクト生成
    particleEngineRef.current.createSparkEffect(stage.target, 20);
    dispatch({ type: ActionTypes.SUCCESS });
  }, [dispatch, stage.target]);

  // 自滅用の爆発エフェクト生成
  const createSelfDestructionEffect = useCallback((position: Point) => {
    // 標準の火花エフェクト
    particleEngineRef.current.createSparkEffect(position, 25);

    // 追加の爆発エフェクト（大きな赤い火花）
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const distance = 30 + Math.random() * 20;
      const pos = {
        x: position.x + Math.cos(angle) * distance,
        y: position.y + Math.sin(angle) * distance,
      };
      particleEngineRef.current.addParticle(pos, { x: 0, y: 0 }, 'spark', {
        color: '#ff0000',
        radius: 8,
        alpha: 1.0,
        lifespan: 1.0,
      });
    }
  }, []);

  // 自滅判定コールバック
  const handleBulletCannonCollision = useCallback(() => {
    createSelfDestructionEffect(stage.cannon);
    dispatch({ type: ActionTypes.FAIL });
  }, [createSelfDestructionEffect, dispatch, stage.cannon]);

  // Engine & Walls を取得（常に基準サイズを使用）
  const { engine, walls } = useMatterEngine({
    width: worldSize.width,
    height: worldSize.height,
    onBulletTargetCollision: handleBulletTargetCollision,
    onBulletCannonCollision: handleBulletCannonCollision,
  });

  // 弾の発射処理
  const handleShoot = useCallback(
    (targetPos: Point) => {
      if (!engine) return;

      // 砲台位置
      const cannon = stage.cannon;

      // 方向ベクトルを正規化
      const dx = targetPos.x - cannon.x;
      const dy = targetPos.y - cannon.y;
      const len = Math.hypot(dx, dy);
      if (len === 0) return;

      const speed = 15; // 発射初速(px/step)。暫定値
      const vx = (dx / len) * speed;
      const vy = (dy / len) * speed;

      // Bullet Body 生成 - 砲台の外側から発射
      const bulletRadius = 5;
      const cannonRadius = 20;
      const launchDistance = cannonRadius + bulletRadius + 2; // 砲台半径 + 弾半径 + 余裕
      const launchX = cannon.x + (dx / len) * launchDistance;
      const launchY = cannon.y + (dy / len) * launchDistance;

      const bullet = Bodies.circle(launchX, launchY, bulletRadius, {
        restitution: 1,
        friction: 0,
        frictionAir: 0,
        label: 'bullet',
      });

      Body.setVelocity(bullet, { x: vx, y: vy });

      // World へ追加
      Composite.add(engine.world, bullet);

      // 発射時フラッシュエフェクト生成
      particleEngineRef.current.createFlashEffect(stage.cannon);

      // フェーズを発射中に変更
      dispatch({ type: ActionTypes.FIRE });
    },
    [engine, stage.cannon, dispatch],
  );

  // ドラッグ操作のハンドリング
  const [dragState, dragHandlers] = useDrag(
    (pos: Point) => {
      // ドラッグ開始時
      if (state.phase === Phase.AIMING) {
        const worldPos = canvasToWorld(pos);
        setCurrentMousePos(worldPos);
      }
    },
    (_startPos: Point, currentPos: Point) => {
      // ドラッグ中
      if (state.phase === Phase.AIMING) {
        const worldPos = canvasToWorld(currentPos);
        setCurrentMousePos(worldPos);
      }
    },
    (_startPos: Point, endPos: Point) => {
      // ドラッグ終了時
      setCurrentMousePos(null);
      // 弾を発射
      if (state.phase === Phase.AIMING) {
        const worldPos = canvasToWorld(endPos);
        handleShoot(worldPos);
      }
    },
  );

  // fieldSize をメモ化（基準サイズを使用）
  const fieldSize = useMemo(() => worldSize, [worldSize]);

  // AimGuide フック
  const { aimPath } = useAimGuide(
    stage.cannon,
    currentMousePos || stage.cannon,
    stage.maxBounce,
    fieldSize,
    stage.walls,
  );

  // 描画ループ
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx || typeof ctx.save !== 'function') return undefined; // テスト環境対応

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';

    let animationId: number;

    const draw = (currentTime: number) => {
      // パーティクルシステムの更新
      const deltaTime = lastFrameTimeRef.current
        ? (currentTime - lastFrameTimeRef.current) / 1000
        : 0;
      lastFrameTimeRef.current = currentTime;

      particleEngineRef.current.update(deltaTime);

      ctx.clearRect(0, 0, width, height);

      // スケール変換を適用
      ctx.save();
      ctx.scale(scaleFactor.x, scaleFactor.y);

      // グリッド描画（デバッグ用）
      if (state.showGrid) {
        ctx.save(); // Canvas状態を保存
        const GRID_COUNT = 10;
        const CELL_WIDTH = worldSize.width / GRID_COUNT; // 96px
        const CELL_HEIGHT = worldSize.height / GRID_COUNT; // 72px
        ctx.strokeStyle = '#444444';
        ctx.lineWidth = 1 / scaleFactor.x; // スケールに応じて線幅調整

        // 縦線
        for (let x = 0; x <= worldSize.width; x += CELL_WIDTH) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, worldSize.height);
          ctx.stroke();
        }

        // 横線
        for (let y = 0; y <= worldSize.height; y += CELL_HEIGHT) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(worldSize.width, y);
          ctx.stroke();
        }
        ctx.restore(); // Canvas状態を復元
      }

      // 外周壁描画
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2 / scaleFactor.x; // スケールに応じて線幅調整
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

      // blocks 描画
      ctx.fillStyle = '#999999';
      stage.walls.forEach(block => {
        ctx.fillRect(block.x, block.y, block.w, block.h);
      });

      // 目視テスト用、step12で削除
      // solution path 描画 (黄線)
      /*
      if (stage.solution.length > 1) {
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(stage.solution[0].x, stage.solution[0].y);
        for (let i = 1; i < stage.solution.length; i += 1) {
          ctx.lineTo(stage.solution[i].x, stage.solution[i].y);
        }
        ctx.stroke();
      }
      
      // walls の線色をリセット
      ctx.strokeStyle = '#ffffff';
      */

      // target 描画
      if (stage.target.x !== 0 || stage.target.y !== 0) {
        ctx.beginPath();
        ctx.arc(stage.target.x, stage.target.y, 30, 0, Math.PI * 2);
        ctx.strokeStyle = '#33ff33';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // cannon 描画
      if (stage.cannon.x !== 0 || stage.cannon.y !== 0) {
        ctx.beginPath();
        ctx.arc(stage.cannon.x, stage.cannon.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }

      // bullet 描画 & トレイルエフェクト生成
      engine.world.bodies.forEach(body => {
        if (body.label === 'bullet') {
          const { x, y } = body.position;
          const circleBody = body as Body & { circleRadius?: number };
          const r = circleBody.circleRadius ?? 5;

          // 5フレームごとにトレイルエフェクト生成
          trailCounterRef.current += 1;
          if (trailCounterRef.current >= 5) {
            particleEngineRef.current.createTrailEffect({ x, y });
            trailCounterRef.current = 0;
          }

          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = '#ff3333';
          ctx.fill();
        }
      });

      // AimGuide 描画 (ドラッグ中かつAIMINGフェーズ)
      if (
        state.phase === Phase.AIMING &&
        dragState.isDragging &&
        aimPath.length > 1
      ) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2 / scaleFactor.x; // スケールに応じて線幅調整
        ctx.setLineDash([5, 5]); // 点線パターン
        ctx.beginPath();
        ctx.moveTo(aimPath[0].x, aimPath[0].y);
        //MaxBounce分のバウンド数を描画
        //for (let i = 1; i < aimPath.length; i += 1) {
        //点線の最大バウンド数を指定(1バウンドまで)
        for (let i = 1; i < 3; i += 1) {
          ctx.lineTo(aimPath[i].x, aimPath[i].y);
        }
        ctx.stroke();
        ctx.setLineDash([]); // 点線パターンをリセット
      }

      // パーティクルを描画（ワールド座標系で）
      particleEngineRef.current.render(ctx);

      // スケール変換を解除
      ctx.restore();

      animationId = requestAnimationFrame(draw);
    };

    draw(performance.now());

    // クリーンアップ: アニメーションフレームを停止
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [
    walls,
    width,
    height,
    engine,
    stage,
    state.phase,
    state.showGrid,
    dragState.isDragging,
    aimPath,
    scaleFactor,
    worldSize.width,
    worldSize.height,
  ]);

  useEffect(() => {
    if (!engine) return;
    const listener = (event: IEventCollision<MatterEngine>) => {
      event.pairs.forEach((pair: Pair) => {
        const labels = [pair.bodyA.label, pair.bodyB.label];
        if (
          labels.includes('bullet') &&
          labels.some(
            label => label.startsWith('wall') || label.startsWith('block'),
          )
        ) {
          dispatch({ type: ActionTypes.BOUNCE });
        }
      });
    };
    Events.on(engine, 'collisionStart', listener);
    return () => {
      Events.off(engine, 'collisionStart', listener);
    };
  }, [engine, dispatch]);

  // フェイルフェーズ検知: バウンド超過時
  useEffect(() => {
    if (state.phase === Phase.FAIL) {
      // バレットをワールドから除去
      engine.world.bodies.forEach(body => {
        if (body.label === 'bullet') {
          Composite.remove(engine.world, body, true);
        }
      });
      // パーティクルは自滅エフェクトを表示するためクリアしない
      // トレイルカウンターのみリセット
      trailCounterRef.current = 0;
    }
  }, [state.phase, engine]);

  // 新ステージ開始時のクリーンアップ
  useEffect(() => {
    if (state.phase === Phase.GENERATING) {
      // 新しいステージ生成時にパーティクルをクリア
      particleEngineRef.current.clear();
      trailCounterRef.current = 0;
    }
  }, [state.phase]);

  // レガシークリックハンドラー（ドラッグ未対応時のフォールバック）
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // ドラッグ操作時はクリックイベントを無視
    if (dragState.isDragging) return;

    if (!engine || state.phase !== Phase.AIMING) return;

    // Canvas 座標系を取得し、ワールド座標に変換
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const worldPos = canvasToWorld({ x: clickX, y: clickY });
    handleShoot(worldPos);
  };

  // target Body を World に追加 (一度だけ)
  useEffect(() => {
    if (!engine) return;
    if (!stage || (stage.target.x === 0 && stage.target.y === 0)) return;

    // 前ステージのターゲットを削除
    if (targetBodyRef.current) {
      Composite.remove(engine.world, targetBodyRef.current, true);
      targetBodyRef.current = null;
    }

    const body = Bodies.circle(stage.target.x, stage.target.y, 30, {
      isSensor: true,
      label: 'target',
    });
    Composite.add(engine.world, body);
    targetBodyRef.current = body;
  }, [engine, stage]);

  // cannon Body を World に追加 (一度だけ)
  useEffect(() => {
    if (!engine) return;
    if (!stage || (stage.cannon.x === 0 && stage.cannon.y === 0)) return;

    // 前ステージの砲台を削除
    if (cannonBodyRef.current) {
      Composite.remove(engine.world, cannonBodyRef.current, true);
      cannonBodyRef.current = null;
    }

    const body = Bodies.circle(stage.cannon.x, stage.cannon.y, 20, {
      isSensor: true,
      label: 'cannon',
    });
    Composite.add(engine.world, body);
    cannonBodyRef.current = body;
  }, [engine, stage]);

  // stage.blocks を matter World に追加・更新
  useEffect(() => {
    if (!engine) return;

    // 前ブロックを削除
    blockBodiesRef.current.forEach(b => {
      Composite.remove(engine.world, b, true);
    });
    blockBodiesRef.current = [];

    stage.walls.forEach((rect, idx) => {
      const body = Bodies.rectangle(
        rect.x + rect.w / 2,
        rect.y + rect.h / 2,
        rect.w,
        rect.h,
        {
          isStatic: true,
          restitution: 1,
          friction: 0,
          label: `block-${idx}`,
        },
      );
      Composite.add(engine.world, body);
      blockBodiesRef.current.push(body);
    });
  }, [engine, stage]);

  return (
    <div
      ref={containerRef}
      className={`${className} flex items-center justify-center`}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border bg-zinc-800"
        style={{
          touchAction: 'none',
          width: `${width}px`,
          height: `${height}px`,
        }}
        data-testid="game-canvas"
        onClick={handleClick}
        onPointerDown={dragHandlers.onPointerDown}
        onPointerMove={dragHandlers.onPointerMove}
        onPointerUp={dragHandlers.onPointerUp}
      />
    </div>
  );
};

export default GameCanvas;
