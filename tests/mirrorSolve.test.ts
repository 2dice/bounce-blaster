import { describe, it, expect } from 'vitest';
import { mirrorSolve, Direction } from '../src/utils/geom';
import { Point } from '../src/models/types';

describe('mirrorSolve Utility', () => {
  const width = 960;
  const height = 720;
  const cannon: Point = { x: 50, y: 670 };
  const target: Point = { x: 800, y: 100 };
  const dx = target.x - cannon.x;
  const dy = target.y - cannon.y;

  it('バウンド数1で点列長3となる', () => {
    const seq: Direction[] = ['Right'];
    const path = mirrorSolve(cannon, target, seq, width, height)!;
    expect(path).toHaveLength(3);
    expect(path[0]).toEqual(cannon);
    expect(path[2]).toEqual(target);
  });

  it('左右2バウンドでx座標が3分割に一致', () => {
    const seq: Direction[] = ['Left', 'Right'];
    const path = mirrorSolve(cannon, target, seq, width, height)!;
    expect(path).toHaveLength(4);
    expect(path[1].x).toBeCloseTo(cannon.x + dx / 3, 5);
    expect(path[2].x).toBeCloseTo(cannon.x + (dx * 2) / 3, 5);
  });

  it('上下2バウンドでy座標が3分割に一致', () => {
    const seq: Direction[] = ['Bottom', 'Top'];
    const path = mirrorSolve(cannon, target, seq, width, height)!;
    expect(path).toHaveLength(4);
    expect(path[1].y).toBeCloseTo(cannon.y + dy / 3, 5);
    expect(path[2].y).toBeCloseTo(cannon.y + (dy * 2) / 3, 5);
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
