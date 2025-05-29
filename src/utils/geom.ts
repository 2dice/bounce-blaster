import { Point } from '../models/types';

// 反射方向の型定義
export type Direction = 'Left' | 'Right' | 'Top' | 'Bottom';

// デフォルトの最大バウンド数
const DEFAULT_MAX_BOUNCE = 5;

// すべての方向配列
const allDirs: Direction[] = ['Left', 'Right', 'Top', 'Bottom'];

/**
 * 隣接同一禁止で指定長さの方向シーケンスを生成
 */
function generateSequences(dirs: Direction[], length: number): Direction[][] {
  if (length === 0) return [[]];
  const prev = generateSequences(dirs, length - 1);
  const res: Direction[][] = [];
  for (const seq of prev) {
    for (const d of dirs) {
      if (seq.length === 0 || seq[seq.length - 1] !== d) {
        res.push([...seq, d]);
      }
    }
  }
  return res;
}

/**
 * 指定シーケンスでの反射経路計算
 */
function computePath(
  cannon: Point,
  target: Point,
  seq: Direction[],
  width: number,
  height: number,
): Point[] | null {
  // 連続同一壁チェック
  for (let i = 1; i < seq.length; i++) {
    if (seq[i] === seq[i - 1]) return null;
  }

  // 鏡像変換 (最後の反射から順に逆順適用)
  const image = { x: target.x, y: target.y };
  for (const dir of [...seq].reverse()) {
    switch (dir) {
      case 'Left':
        image.x = -image.x;
        break;
      case 'Right':
        image.x = 2 * width - image.x;
        break;
      case 'Top':
        image.y = 2 * height - image.y;
        break;
      case 'Bottom':
        image.y = -image.y;
        break;
      default:
        return null;
    }
  }
  const path: Point[] = [{ x: cannon.x, y: cannon.y }];
  let currentPoint = { ...cannon }; // 現在の始点を保持

  // 各反射点を計算
  for (let i = 0; i < seq.length; i++) {
    const dir = seq[i];
    // i番目の反射後の鏡像ターゲットを計算 (seqのi番目までの反射を適用)
    const tempImage = { x: target.x, y: target.y };
    // このループは、現在の反射(i)から最後の反射(seq.length-1)までを考慮して鏡像を計算する

    for (let j = seq.length - 1; j >= i; j--) {
      const reflectDir = seq[j];
      switch (reflectDir) {
        case 'Left':
          tempImage.x = -tempImage.x;
          break;
        case 'Right':
          tempImage.x = 2 * width - tempImage.x;
          break;
        case 'Top':
          tempImage.y = 2 * height - tempImage.y;
          break;
        case 'Bottom':
          tempImage.y = -tempImage.y;
          break;
        default:
          return null;
      }
    }

    let t: number;
    if (dir === 'Left' || dir === 'Right') {
      const bx = dir === 'Left' ? 0 : width;
      const dx = tempImage.x - currentPoint.x;
      if (Math.abs(dx) < 1e-9) {
        return null; // 進行方向が壁と平行 (許容誤差を考慮)
      }
      t = (bx - currentPoint.x) / dx;
    } else {
      // Top or Bottom
      const by = dir === 'Bottom' ? 0 : height;
      const dy = tempImage.y - currentPoint.y;
      if (Math.abs(dy) < 1e-9) {
        return null; // 進行方向が壁と平行 (許容誤差を考慮)
      }
      t = (by - currentPoint.y) / dy;
    }

    // 0 < t < 1 の範囲で交点が存在
    // t <= 0: 進行方向の逆側で交差 (または線上だが壁に到達しない)
    // t >= 1: 鏡像ターゲットよりも手前で壁と交差しない (または線上だが壁に到達しない)
    // 壁と正確に同じ位置から発射され、壁方向に向かう場合(t=0)や、
    // 鏡像点が壁の上にある場合(t=1)を有効とするかは設計次第だが、ここでは除外する。
    // 浮動小数点誤差を考慮し、微小な値を許容する。

    if (t <= 1e-9 || t >= 1 - 1e-9) {
      return null;
    }

    const reflectionPointX =
      currentPoint.x + (tempImage.x - currentPoint.x) * t;
    const reflectionPointY =
      currentPoint.y + (tempImage.y - currentPoint.y) * t;

    // 反射点が壁の範囲外なら無効 (厳密には壁の端点は許容されるべきか？ここでは範囲内とする)
    if (dir === 'Left' || dir === 'Right') {
      const yOutOfBound =
        reflectionPointY < -1e-9 || reflectionPointY > height + 1e-9;
      if (yOutOfBound) return null;
    } else {
      // Top or Bottom
      const xOutOfBound =
        reflectionPointX < -1e-9 || reflectionPointX > width + 1e-9;
      if (xOutOfBound) return null;
    }

    path.push({ x: reflectionPointX, y: reflectionPointY });
    currentPoint = { x: reflectionPointX, y: reflectionPointY }; // 次の始点を更新
  }

  // 最後の反射点から実際のターゲットへの線分が他の壁と交差しないかチェック
  // (これはより複雑なロジックが必要になるため、一旦省略。現状は最終点をtargetとする)
  // ただし、最終点がcurrentPointからtargetへの直線上にあることを確認する必要がある。
  // tempImageは最終反射後の鏡像なので、currentPointからtempImageへの直線上にtargetがいればOK
  // しかし、ここまでの計算でtempImageは最後の反射壁に対する鏡像になっているはずなので、
  // currentPointからtargetへの直接の線が最後の反射壁を通過しないことを確認する必要がある。
  // これはtのチェック(t<1)で部分的に担保されているが、より厳密なチェックは複雑。
  // ここでは、最後の反射点とターゲットを単純に結ぶ。
  path.push({ x: target.x, y: target.y });

  return path;
}

/**
 * mirrorSolve: seq指定時はそのシーケンスの経路を返却
 *            無指定時はbounce0〜DEFAULT_MAX_BOUNCEの総当たりで最短経路を返却
 */
export function mirrorSolve(
  cannon: Point,
  target: Point,
  seq: Direction[] = [],
  width: number,
  height: number,
): Point[] | null {
  // 指定bounce上限チェック
  if (seq.length > DEFAULT_MAX_BOUNCE) {
    return null;
  }
  if (!seq || seq.length === 0) {
    for (let n = 0; n <= DEFAULT_MAX_BOUNCE; n++) {
      const seqs = generateSequences(allDirs, n);
      for (const s of seqs) {
        const p = computePath(cannon, target, s, width, height);
        if (p) {
          return p;
        }
      }
    }
    return null;
  }
  // 指定シーケンス
  const result = computePath(cannon, target, seq, width, height);
  return result;
}
