import { describe, it, expect } from 'vitest';
import { mirrorSolve, Direction } from '../src/utils/geom';
import { Point } from '../src/models/types';

describe('mirrorSolve Utility', () => {
  const width = 960;
  const height = 720;
  const cannon: Point = { x: 50, y: 670 };
  const target: Point = { x: 800, y: 100 };

  it('バウンド数1で点列長3となる', () => {
    const seq: Direction[] = ['Right'];
    const path = mirrorSolve(cannon, target, seq, width, height)!;
    expect(path).toHaveLength(3);
    expect(path[0]).toEqual(cannon);
    expect(path[2]).toEqual(target);
  });

  it('左右2バウンドでy座標が計算値に一致', () => {
    const cannon = { x: 400, y: 300 };
    const target = { x: 400, y: 600 };
    const width = 960;
    const height = 720;
    const seq: Direction[] = ['Left', 'Right'];
    const path = mirrorSolve(cannon, target, seq, width, height)!;
    expect(path).toHaveLength(4);
    expect(path[1].y).toBeCloseTo(362.5, 5);
    expect(path[2].y).toBeCloseTo(512.5, 5);
  });

  it('上下2バウンドでx座標が計算値に一致', () => {
    const cannon = { x: 400, y: 300 };
    const target = { x: 700, y: 300 };
    const width = 960;
    const height = 720;
    const seq: Direction[] = ['Top', 'Bottom'];
    const path = mirrorSolve(cannon, target, seq, width, height)!;
    expect(path).toHaveLength(4);
    expect(path[1].x).toBeCloseTo(487.5, 5);
    expect(path[2].x).toBeCloseTo(637.5, 5);
  });

  it('バウンド数5で点列長7となる', () => {
    const seq: Direction[] = ['Left', 'Right', 'Left', 'Right', 'Left'];
    const path = mirrorSolve(cannon, target, seq, width, height)!;
    expect(path).toHaveLength(7);
    expect(path[0]).toEqual(cannon);
    expect(path[6]).toEqual(target);
  });

  it('Right,Right連続反射でnullを返す', () => {
    const seq: Direction[] = ['Right', 'Right'];
    expect(mirrorSolve(cannon, target, seq, width, height)).toBeNull();
  });

  it('最大バウンド超過でnullを返す', () => {
    const seq: Direction[] = [
      'Left',
      'Right',
      'Left',
      'Right',
      'Left',
      'Right',
    ];
    expect(mirrorSolve(cannon, target, seq, width, height)).toBeNull();
  });
});
