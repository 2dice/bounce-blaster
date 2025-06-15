import { useEffect, useMemo } from 'react';
import {
  Bodies,
  Composite,
  Engine,
  Runner,
  Events,
  type Body,
  type Engine as MatterEngine,
} from 'matter-js';
import * as Matter from 'matter-js';

export interface UseMatterEngineOptions {
  width: number;
  height: number;
  /**
   * 壁の厚み（ピクセル）
   * @default 20
   */
  wallThickness?: number;
  /**
   * bullet と target の衝突時に呼ばれるコールバック
   */
  onBulletTargetCollision?: () => void;
  /**
   * bullet と cannon の衝突時に呼ばれるコールバック（自滅判定）
   */
  onBulletCannonCollision?: () => void;
}

export interface UseMatterEngineReturn {
  engine: MatterEngine;
  walls: Body[];
  /**
   * 弾の衝突カテゴリ値 (Step7-3 で衝突検知に使用予定)
   * @see design.md 6-3. 衝突カテゴリ
   */
  bulletCategory: number;
}

/**
 * matter.js の `Engine` と外周 4 壁を生成するフック
 *
 * - 重力をオフ (gravity: { x:0, y:0 })
 * - World に 4 辺の Static Body (外周壁) を追加
 * - `Runner` を起動し、React コンポーネントのライフサイクルに合わせてクリーンアップ
 *
 * 戻り値として { engine, walls } を返すため、呼び出し側で描画やデバッグに利用できる。
 */
export const useMatterEngine = (
  options: UseMatterEngineOptions,
): UseMatterEngineReturn => {
  const {
    width,
    height,
    wallThickness = 20,
    onBulletTargetCollision,
    onBulletCannonCollision,
  } = options;

  // Engine の生成は一度だけ行う
  const engine = useMemo(() => {
    const e = Engine.create({ gravity: { x: 0, y: 0 } });
    // 反発精度向上のためイテレーション数を増やす
    e.positionIterations = 20;
    e.velocityIterations = 20;
    e.constraintIterations = 4;
    // 衝突スロップを小さくして反発精度向上
    e.timing.timeScale = 1;
    return e;
  }, []);

  // 外周壁 4 枚をメモ化
  const walls = useMemo(() => {
    const half = wallThickness / 2;
    return [
      // 上
      Bodies.rectangle(width / 2, -half, width, wallThickness, {
        isStatic: true,
        restitution: 1,
        friction: 0,
        frictionStatic: 0,
        label: 'wall-top',
      }),
      // 下
      Bodies.rectangle(width / 2, height + half, width, wallThickness, {
        isStatic: true,
        restitution: 1,
        friction: 0,
        frictionStatic: 0,
        label: 'wall-bottom',
      }),
      // 左
      Bodies.rectangle(-half, height / 2, wallThickness, height, {
        isStatic: true,
        restitution: 1,
        friction: 0,
        frictionStatic: 0,
        label: 'wall-left',
      }),
      // 右
      Bodies.rectangle(width + half, height / 2, wallThickness, height, {
        isStatic: true,
        restitution: 1,
        friction: 0,
        frictionStatic: 0,
        label: 'wall-right',
      }),
    ];
  }, [width, height, wallThickness]);

  // World への追加 & Runner 起動をライフサイクルに合わせ実行
  useEffect(() => {
    // 既に追加済みであればスキップ（二重追加防止）
    if (engine.world.bodies.length === 0) {
      Composite.add(engine.world, walls);
    }

    const runner = Runner.create();
    Runner.run(runner, engine);

    return () => {
      // Runner 停止 & World クリア (必要に応じて)
      Runner.stop(runner);
      Composite.clear(engine.world, false, true);
      // World 全体をクリアすると walls 配列と参照がずれるため注意
    };
  }, [engine, walls]);

  // bullet × target 衝突検知
  useEffect(() => {
    if (!onBulletTargetCollision) return;

    const listener = (event: Matter.IEventCollision<Matter.Engine>) => {
      // event.pairs: Array<Matter.Pair>
      event.pairs.forEach((pair: Matter.Pair) => {
        const { bodyA, bodyB } = pair;
        const labels = [bodyA.label, bodyB.label];
        if (labels.includes('bullet') && labels.includes('target')) {
          // 成功コールバックを先に呼ぶ
          onBulletTargetCollision();

          // bullet Body を World から除去
          const bulletBody = bodyA.label === 'bullet' ? bodyA : bodyB;
          if (bulletBody) {
            Composite.remove(engine.world, bulletBody, true);
          }
        }
      });
    };

    Events.on(engine, 'collisionStart', listener);
    return () => {
      Events.off(engine, 'collisionStart', listener);
    };
  }, [engine, onBulletTargetCollision]);

  // bullet × cannon 衝突検知（自滅判定）
  useEffect(() => {
    if (!onBulletCannonCollision) return;

    const listener = (event: Matter.IEventCollision<Matter.Engine>) => {
      // event.pairs: Array<Matter.Pair>
      event.pairs.forEach((pair: Matter.Pair) => {
        const { bodyA, bodyB } = pair;
        const labels = [bodyA.label, bodyB.label];
        if (labels.includes('bullet') && labels.includes('cannon')) {
          // 自滅コールバックを先に呼ぶ
          onBulletCannonCollision();

          // bullet Body を World から除去
          const bulletBody = bodyA.label === 'bullet' ? bodyA : bodyB;
          if (bulletBody) {
            Composite.remove(engine.world, bulletBody, true);
          }
        }
      });
    };

    Events.on(engine, 'collisionStart', listener);
    return () => {
      Events.off(engine, 'collisionStart', listener);
    };
  }, [engine, onBulletCannonCollision]);

  // 衝突カテゴリ値を設定 (design.md 6-3. 衝突カテゴリに基づく)
  const bulletCategory = 0x0002; // 0x0002 = bullet

  return { engine, walls, bulletCategory };
};
