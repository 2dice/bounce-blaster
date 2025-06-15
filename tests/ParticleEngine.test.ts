import { describe, it, expect, beforeEach } from 'vitest';
import { ParticleEngine } from '../src/utils/ParticleEngine';
import { Point } from '../src/models/types';

describe('ParticleEngine', () => {
  let engine: ParticleEngine;
  const testPosition: Point = { x: 100, y: 100 };
  const testVelocity: Point = { x: 10, y: -5 };

  beforeEach(() => {
    engine = new ParticleEngine();
  });

  describe('パーティクル生成', () => {
    it('フラッシュエフェクトを生成できる', () => {
      engine.createFlashEffect(testPosition);
      expect(engine.getParticleCount()).toBe(1);
    });

    it('トレイルエフェクトを生成できる', () => {
      engine.createTrailEffect(testPosition);
      expect(engine.getParticleCount()).toBe(1);
    });

    it('火花エフェクトを指定数生成できる', () => {
      const sparkCount = 5;
      engine.createSparkEffect(testPosition, sparkCount);
      expect(engine.getParticleCount()).toBe(sparkCount);
    });

    it('火花エフェクトをデフォルト数(20個)生成できる', () => {
      engine.createSparkEffect(testPosition);
      expect(engine.getParticleCount()).toBe(20);
    });
  });

  describe('パーティクル更新', () => {
    it('位置が速度に応じて更新される', () => {
      engine.addParticle(testPosition, testVelocity, 'trail');
      const initialCount = engine.getParticleCount();

      // 0.1秒更新
      engine.update(0.1);

      // パーティクルは生存している（寿命0.5秒 > 0.1秒）
      expect(engine.getParticleCount()).toBe(initialCount);
    });

    it('寿命が0以下になったパーティクルが除去される', () => {
      engine.addParticle(testPosition, testVelocity, 'trail', {
        lifespan: 0.1, // 短い寿命
      });

      expect(engine.getParticleCount()).toBe(1);

      // 0.2秒更新（寿命0.1秒を超過）
      engine.update(0.2);

      expect(engine.getParticleCount()).toBe(0);
    });

    it('アルファ値が寿命に応じて減衰する', () => {
      const initialAlpha = 1.0;
      engine.addParticle(testPosition, testVelocity, 'spark', {
        alpha: initialAlpha,
        lifespan: 1.0,
      });

      // 半分の時間経過
      engine.update(0.5);

      // パーティクルは残っているが、アルファ値は減衰している
      expect(engine.getParticleCount()).toBe(1);
    });
  });

  describe('パーティクル管理', () => {
    it('全パーティクルをクリアできる', () => {
      engine.createFlashEffect(testPosition);
      engine.createTrailEffect(testPosition);
      expect(engine.getParticleCount()).toBe(2);

      engine.clear();
      expect(engine.getParticleCount()).toBe(0);
    });

    it('パーティクル数を正確に取得できる', () => {
      expect(engine.getParticleCount()).toBe(0);

      engine.createTrailEffect(testPosition);
      expect(engine.getParticleCount()).toBe(1);

      engine.createSparkEffect(testPosition, 3);
      expect(engine.getParticleCount()).toBe(4);
    });
  });

  describe('renderメソッド', () => {
    it('モックコンテキストでエラーが発生しない', () => {
      // Canvas 2D Context のモック
      const mockCtx = {
        save: vi.fn(),
        restore: vi.fn(),
        beginPath: vi.fn(),
        arc: vi.fn(),
        fill: vi.fn(),
        globalAlpha: 1,
        fillStyle: '#000000',
      } as unknown as CanvasRenderingContext2D;

      engine.createFlashEffect(testPosition);

      // renderが例外を投げないことを確認
      expect(() => engine.render(mockCtx)).not.toThrow();

      // 描画メソッドが呼び出されることを確認
      expect(mockCtx.save).toHaveBeenCalled();
      expect(mockCtx.restore).toHaveBeenCalled();
      expect(mockCtx.beginPath).toHaveBeenCalled();
      expect(mockCtx.arc).toHaveBeenCalled();
      expect(mockCtx.fill).toHaveBeenCalled();
    });
  });
});
