import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { Bodies, Composite, Engine } from 'matter-js';
import { useMatterEngine } from '../src/hooks/useMatterEngine';

/**
 * bullet と target が衝突したときに onBulletTargetCollision コールバックが
 * 1 回だけ発火することをテストする
 */
describe('bullet × target 衝突コールバック', () => {
  it('bullet と target が重なったらコールバックが 1 回呼ばれる', async () => {
    const collisionSpy = vi.fn();

    const { result } = renderHook(() =>
      useMatterEngine({
        width: 200,
        height: 200,
        onBulletTargetCollision: collisionSpy,
      }),
    );

    // bullet と target を同じ座標に配置
    act(() => {
      const bullet = Bodies.circle(100, 100, 10, {
        label: 'bullet',
        isStatic: false,
      });
      const target = Bodies.circle(100, 100, 18, {
        label: 'target',
        isSensor: true,
      });
      Composite.add(result.current.engine.world, [bullet, target]);

      // 1 ステップ進めて衝突判定させる
      Engine.update(result.current.engine, 16);
    });

    await waitFor(() => {
      expect(collisionSpy).toHaveBeenCalledTimes(1);
    });
  });
});
