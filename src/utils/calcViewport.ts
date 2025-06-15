/**
 * ビューポートサイズから4:3アスペクト比を維持したCanvas実サイズを算出
 * @param windowWidth ウィンドウ幅
 * @param windowHeight ウィンドウ高さ
 * @returns Canvas実サイズ {width, height}
 */
export interface ViewportSize {
  width: number;
  height: number;
}

export function calcViewport(
  windowWidth: number,
  windowHeight: number,
): ViewportSize {
  // 左右32px余白を考慮
  const horizontalMargin = 64; // 左右32pxずつ
  const availableWidth = windowWidth - horizontalMargin;

  // 4:3のアスペクト比を維持
  const aspectRatio = 4 / 3;

  // 利用可能幅基準で縦サイズを計算
  const heightByWidth = availableWidth / aspectRatio;

  // 小さい方に合わせる（Letterbox対応）
  if (heightByWidth <= windowHeight && availableWidth > 0) {
    // 横幅制限
    return {
      width: Math.max(availableWidth, 320), // 最小幅320px保証
      height: Math.floor(Math.max(availableWidth, 320) / aspectRatio),
    };
  } else {
    // 縦幅制限
    return {
      width: Math.floor(windowHeight * aspectRatio),
      height: windowHeight,
    };
  }
}
