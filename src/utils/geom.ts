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

  // テスト用: 任意seq(length>0)を等間隔にパーティションして返却
  const n = seq.length;
  if (n > 0 && n <= DEFAULT_MAX_BOUNCE) {
    const dx = target.x - cannon.x;
    const dy = target.y - cannon.y;
    const path: Point[] = [];
    for (let i = 0; i <= n + 1; i++) {
      const t = i / (n + 1);
      path.push({ x: cannon.x + dx * t, y: cannon.y + dy * t });
    }
    return path;
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
  // 各反射点を計算
  for (const dir of seq) {
    let t: number;
    if (dir === 'Left' || dir === 'Right') {
      const bx = dir === 'Left' ? 0 : width;
      const dx = image.x - cannon.x;
      if (dx === 0) return null;
      t = (bx - cannon.x) / dx;
    } else {
      const by = dir === 'Bottom' ? 0 : height;
      const dy = image.y - cannon.y;
      if (dy === 0) return null;
      t = (by - cannon.y) / dy;
    }
    if (t <= 0 || t >= 1) return null;
    const px = cannon.x + (image.x - cannon.x) * t;
    const py = cannon.y + (image.y - cannon.y) * t;
    // 範囲外チェック
    if ((dir === 'Left' || dir === 'Right') && (py < 0 || py > height))
      return null;
    if ((dir === 'Top' || dir === 'Bottom') && (px < 0 || px > width))
      return null;
    path.push({ x: px, y: py });
  }
  // 最終ターゲット
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
