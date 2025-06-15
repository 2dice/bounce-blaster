import { describe, it, expect, vi } from 'vitest';
import { useMatterEngine } from '../src/hooks/useMatterEngine';
import { renderHook } from '@testing-library/react';
import { Bodies, Composite, Events } from 'matter-js';

describe('弾と砲台の衝突検知（自滅判定）', () => {
  it('弾が砲台に衝突した時にコールバックが呼ばれる', () => {
    const mockCallback = vi.fn();

    const { result } = renderHook(() =>
      useMatterEngine({
        width: 800,
        height: 600,
        onBulletCannonCollision: mockCallback,
      }),
    );

    const { engine } = result.current;

    // 砲台Bodyを作成
    const cannonBody = Bodies.circle(100, 100, 20, {
      isSensor: true,
      label: 'cannon',
    });
    Composite.add(engine.world, cannonBody);

    // 弾Bodyを作成
    const bulletBody = Bodies.circle(100, 100, 5, {
      label: 'bullet',
    });
    Composite.add(engine.world, bulletBody);

    // 衝突イベントを手動で発火
    const mockEvent = {
      pairs: [
        {
          bodyA: bulletBody,
          bodyB: cannonBody,
        },
      ],
    };

    Events.trigger(engine, 'collisionStart', mockEvent);

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('砲台以外との衝突では自滅コールバックが呼ばれない', () => {
    const mockCallback = vi.fn();

    const { result } = renderHook(() =>
      useMatterEngine({
        width: 800,
        height: 600,
        onBulletCannonCollision: mockCallback,
      }),
    );

    const { engine } = result.current;

    // 壁Bodyを作成
    const wallBody = Bodies.rectangle(0, 0, 10, 600, {
      isStatic: true,
      label: 'wall-left',
    });
    Composite.add(engine.world, wallBody);

    // 弾Bodyを作成
    const bulletBody = Bodies.circle(100, 100, 5, {
      label: 'bullet',
    });
    Composite.add(engine.world, bulletBody);

    // 衝突イベントを手動で発火
    const mockEvent = {
      pairs: [
        {
          bodyA: bulletBody,
          bodyB: wallBody,
        },
      ],
    };

    Events.trigger(engine, 'collisionStart', mockEvent);

    // 砲台以外の衝突では自滅コールバックは呼ばれない
    expect(mockCallback).not.toHaveBeenCalled();
  });
});
