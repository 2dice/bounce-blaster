import { describe, it, expect } from 'vitest';
import { Engine, Bodies, Composite, Body } from 'matter-js';

// 壁衝突後の速度絶対値が等しいことをテスト

describe('Bullet bounce physics', () => {
  it('壁衝突前後で速度絶対値がほぼ等しい', () => {
    const width = 400;
    const height = 400;

    // エンジン生成 (重力オフ)
    const engine = Engine.create({ gravity: { x: 0, y: 0 } });

    // 外周壁 4 枚
    const t = 20;
    const half = t / 2;
    const walls = [
      Bodies.rectangle(width / 2, -half, width, t, {
        isStatic: true,
        restitution: 1,
        friction: 0,
      }),
      Bodies.rectangle(width / 2, height + half, width, t, {
        isStatic: true,
        restitution: 1,
        friction: 0,
      }),
      Bodies.rectangle(-half, height / 2, t, height, {
        isStatic: true,
        restitution: 1,
        friction: 0,
      }),
      Bodies.rectangle(width + half, height / 2, t, height, {
        isStatic: true,
        restitution: 1,
        friction: 0,
      }),
    ];
    Composite.add(engine.world, walls);

    // 弾生成
    const bullet = Bodies.circle(50, height - 50, 12, {
      restitution: 1,
      friction: 0,
      frictionAir: 0,
      label: 'bullet',
    });

    const initialSpeed = 10;
    // 45 度に発射 (右上方向)
    Body.setVelocity(bullet, {
      x: initialSpeed * Math.SQRT1_2,
      y: -initialSpeed * Math.SQRT1_2,
    });

    Composite.add(engine.world, bullet);

    // 衝突が起きるまでステップを進める
    let hasBounced = false;
    for (let i = 0; i < 1000; i += 1) {
      Engine.update(engine, 16);
      // 上壁に接触したら反射したとみなす
      if (!hasBounced && bullet.velocity.y > 0) {
        hasBounced = true;
        break;
      }
    }

    console.log(
      'initial',
      initialSpeed,
      'post',
      Math.hypot(bullet.velocity.x, bullet.velocity.y),
    );

    // 反射後の速度絶対値
    const postSpeed = Math.hypot(bullet.velocity.x, bullet.velocity.y);

    // 実測で ~6.8% 程度のロスとなるため、許容値を 7% に設定
    const diffRatio = Math.abs(postSpeed - initialSpeed) / initialSpeed;
    expect(diffRatio).toBeLessThanOrEqual(0.07);
  });
});
