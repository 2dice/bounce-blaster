import { describe, it, expect } from 'vitest';
import { calcViewport } from '../src/utils/calcViewport';

describe('calcViewport', () => {
  it('1280x720の画面で4:3アスペクト比を維持してCanvas実サイズを算出', () => {
    // 1280x720 の画面において、4:3 アスペクト比のCanvas寸法を算出
    // 期待値: 横960px, 縦720px (横幅制限で縦に合わせる)
    const result = calcViewport(1280, 720);
    expect(result.width).toBe(960);
    expect(result.height).toBe(720);
  });

  it('iPad横向き1024x768で4:3アスペクト比を維持', () => {
    // iPad横向き基準サイズでは左右32px余白を考慮して960x720
    const result = calcViewport(1024, 768);
    expect(result.width).toBe(960);
    expect(result.height).toBe(720);
  });

  it('縦長画面1080x1920では縦制限でアスペクト比維持', () => {
    // 縦長画面では左右余白64px考慮後の1016pxが使用可能
    // 1016 / 4 * 3 = 762 が縦幅だが、縦が十分あるので横幅制限
    const result = calcViewport(1080, 1920);
    expect(result.width).toBe(1016);
    expect(result.height).toBe(762);
  });

  it('横長画面1920x1080では縦制限でアスペクト比維持', () => {
    // 横長画面では縦サイズに制限される
    // 4:3 なので 1080 / 3 * 4 = 1440 が横幅
    const result = calcViewport(1920, 1080);
    expect(result.width).toBe(1440);
    expect(result.height).toBe(1080);
  });

  it('小さな画面800x600でも4:3を維持', () => {
    // 800x600では左右余白64px考慮後の736pxが使用可能
    // 736 / 4 * 3 = 552 が縦幅
    const result = calcViewport(800, 600);
    expect(result.width).toBe(736);
    expect(result.height).toBe(552);
  });

  it('超横長画面2560x1080では縦制限', () => {
    // ウルトラワイド画面では縦に制限される
    // 1080 / 3 * 4 = 1440
    const result = calcViewport(2560, 1080);
    expect(result.width).toBe(1440);
    expect(result.height).toBe(1080);
  });
});
