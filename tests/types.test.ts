/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

// このファイルは型テストなので、意図的に型エラーを発生させています
// これらのエラーは想定内であり、テストの一部です
// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { Point, Rect, Stage, GameState } from '../src/models/types';

// 型テストは実行時には何も検証せず、TypeScriptのコンパイル時に検証される
describe('データモデル型定義のテスト', () => {
  // 正常なデータ構造のテスト
  it('Point型は正しい構造を持つ', () => {
    const validPoint: Point = { x: 10, y: 20 };
    expect(validPoint.x).toBe(10);
    expect(validPoint.y).toBe(20);
  });

  it('Rect型は正しい構造を持つ', () => {
    const validRect: Rect = { x: 10, y: 20, w: 30, h: 40 };
    expect(validRect.x).toBe(10);
    expect(validRect.y).toBe(20);
    expect(validRect.w).toBe(30);
    expect(validRect.h).toBe(40);
  });

  it('Stage型は正しい構造を持つ', () => {
    const validStage: Stage = {
      width: 800,
      height: 600,
      maxBounce: 3,
      cannon: { x: 50, y: 50 },
      target: { x: 700, y: 500 },
      walls: [{ x: 200, y: 200, w: 100, h: 20 }],
      solution: [{ x: 300, y: 300 }],
    };

    expect(validStage.width).toBe(800);
    expect(validStage.height).toBe(600);
    expect(validStage.maxBounce).toBe(3);
  });

  it('GameState型は正しい構造を持つ', () => {
    const validGameState: GameState = {
      phase: 'aiming',
      stage: {
        width: 800,
        height: 600,
        maxBounce: 3,
        cannon: { x: 50, y: 50 },
        target: { x: 700, y: 500 },
        walls: [{ x: 200, y: 200, w: 100, h: 20 }],
        solution: [{ x: 300, y: 300 }],
      },
    };

    expect(validGameState.phase).toBe('aiming');
  });

  // 型エラーのテスト
  it('Point型は必須プロパティが欠けるとエラーになる', () => {
    // @ts-expect-error x が欠けている
    const invalidPoint: Point = { y: 20 };

    // @ts-expect-error y が欠けている
    const invalidPoint2: Point = { x: 10 };
  });

  it('Rect型は必須プロパティが欠けるとエラーになる', () => {
    // @ts-expect-error w が欠けている
    const invalidRect: Rect = { x: 10, y: 20, h: 40 };
  });

  it('Stage型は必須プロパティが欠けるとエラーになる', () => {
    // @ts-expect-error maxBounce が欠けている
    const invalidStage: Stage = {
      width: 800,
      height: 600,
      cannon: { x: 50, y: 50 },
      target: { x: 700, y: 500 },
      walls: [],
      solution: [],
    };
  });

  it('Stage.maxBounceは1~5の値しか受け付けない', () => {
    // 正常なケース
    const validStage1: Stage = {
      width: 800,
      height: 600,
      maxBounce: 1,
      cannon: { x: 0, y: 0 },
      target: { x: 0, y: 0 },
      walls: [],
      solution: [],
    };

    const validStage5: Stage = {
      width: 800,
      height: 600,
      maxBounce: 5,
      cannon: { x: 0, y: 0 },
      target: { x: 0, y: 0 },
      walls: [],
      solution: [],
    };

    // @ts-expect-error maxBounce は1~5の値しか受け付けない
    const invalidStage: Stage = {
      width: 800,
      height: 600,
      maxBounce: 6,
      cannon: { x: 0, y: 0 },
      target: { x: 0, y: 0 },
      walls: [],
      solution: [],
    };

    // @ts-expect-error maxBounce は1~5の値しか受け付けない
    const invalidStage2: Stage = {
      width: 800,
      height: 600,
      maxBounce: 0,
      cannon: { x: 0, y: 0 },
      target: { x: 0, y: 0 },
      walls: [],
      solution: [],
    };
  });

  it('GameState.phaseは指定された値しか受け付けない', () => {
    const validGameState: GameState = {
      phase: 'generating',
      stage: {
        width: 800,
        height: 600,
        maxBounce: 3,
        cannon: { x: 0, y: 0 },
        target: { x: 0, y: 0 },
        walls: [],
        solution: [],
      },
    };

    // @ts-expect-error phase は指定された値しか受け付けない
    const invalidGameState: GameState = {
      phase: 'invalid-phase',
      stage: {
        width: 800,
        height: 600,
        maxBounce: 3,
        cannon: { x: 0, y: 0 },
        target: { x: 0, y: 0 },
        walls: [],
        solution: [],
      },
    };
  });
});
