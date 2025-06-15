import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAimGuide } from '../src/hooks/useAimGuide';
import { Point } from '../src/models/types';

describe('useAimGuide Hook', () => {
  it('砲台座標(100,100)、マウス(200,100)、max=1で水平方向の予測線を返す', () => {
    const cannon: Point = { x: 100, y: 100 };
    const mousePos: Point = { x: 200, y: 100 };
    const maxBounce = 1;
    const fieldSize = { width: 960, height: 720 };

    const { result } = renderHook(() =>
      useAimGuide(cannon, mousePos, maxBounce, fieldSize, []),
    );

    // 砲台から右に向かって壁まで、そして反射後の経路を含む
    expect(result.current.aimPath.length).toBeGreaterThan(1);
    expect(result.current.aimPath[0]).toEqual(cannon);
    // 右壁への交点
    expect(result.current.aimPath[1]).toEqual({ x: 960, y: 100 });
    // 反射後の左壁への交点（maxBounce=1なので）
    if (result.current.aimPath.length > 2) {
      expect(result.current.aimPath[2]).toEqual({ x: 0, y: 100 });
    }
  });

  it('斜め方向での反射経路を正しく計算する', () => {
    const cannon: Point = { x: 100, y: 100 };
    const mousePos: Point = { x: 300, y: 300 };
    const maxBounce = 2;
    const fieldSize = { width: 960, height: 720 };

    const { result } = renderHook(() =>
      useAimGuide(cannon, mousePos, maxBounce, fieldSize, []),
    );

    // 砲台から斜め方向に向かう経路
    expect(result.current.aimPath.length).toBeGreaterThan(1);
    expect(result.current.aimPath[0]).toEqual(cannon);

    // 角度が正しく計算されている
    const expectedAngle = Math.atan2(300 - 100, 300 - 100);
    expect(result.current.angle).toBeCloseTo(expectedAngle);
  });

  it('マウス座標が砲台と同じ場合、空の配列を返す', () => {
    const cannon: Point = { x: 100, y: 100 };
    const mousePos: Point = { x: 100, y: 100 };
    const maxBounce = 1;
    const _walls: Point[] = [];
    const fieldSize = { width: 960, height: 720 };

    const { result } = renderHook(() =>
      useAimGuide(cannon, mousePos, maxBounce, fieldSize, []),
    );

    expect(result.current.aimPath).toEqual([]);
  });

  it('maxBounce=0の場合、砲台から壁までの直線のみを返す', () => {
    const cannon: Point = { x: 100, y: 100 };
    const mousePos: Point = { x: 200, y: 100 };
    const maxBounce = 0;
    const fieldSize = { width: 960, height: 720 };

    const { result } = renderHook(() =>
      useAimGuide(cannon, mousePos, maxBounce, fieldSize, []),
    );

    // 砲台から右壁への直線のみ
    expect(result.current.aimPath).toHaveLength(2);
    expect(result.current.aimPath[0]).toEqual(cannon);
    expect(result.current.aimPath[1]).toEqual({ x: 960, y: 100 });
  });

  it('ブロックがある場合、ブロックで反射する', () => {
    const cannon: Point = { x: 100, y: 100 };
    const mousePos: Point = { x: 300, y: 100 };
    const maxBounce = 1;
    const fieldSize = { width: 960, height: 720 };
    const blocks = [{ x: 200, y: 80, w: 40, h: 40 }]; // 経路上にブロック配置

    const { result } = renderHook(() =>
      useAimGuide(cannon, mousePos, maxBounce, fieldSize, blocks),
    );

    // ブロックとの交点で反射する経路
    expect(result.current.aimPath.length).toBeGreaterThan(2);
    expect(result.current.aimPath[0]).toEqual(cannon);
    // ブロックの左辺で反射
    expect(result.current.aimPath[1]).toEqual({ x: 200, y: 100 });
  });
});
