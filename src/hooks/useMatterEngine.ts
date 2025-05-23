import { useEffect, useMemo } from 'react';
import {
  Bodies,
  Composite,
  Engine,
  Runner,
  type Body,
  type Engine as MatterEngine,
} from 'matter-js';

export interface UseMatterEngineOptions {
  width: number;
  height: number;
  /**
   * 壁の厚み（ピクセル）
   * @default 20
   */
  wallThickness?: number;
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
  const { width, height, wallThickness = 20 } = options;

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

  // 衝突カテゴリ値を設定 (design.md 6-3. 衝突カテゴリに基づく)
  const bulletCategory = 0x0002; // 0x0002 = bullet

  return { engine, walls, bulletCategory };
};
