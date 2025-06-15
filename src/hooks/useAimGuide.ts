import { useMemo } from 'react';
import { Point, Rect } from '../models/types';

/**
 * フィールドサイズの型定義
 */
export interface FieldSize {
  width: number;
  height: number;
}

/**
 * useAimGuideの戻り値型定義
 */
export interface AimGuideResult {
  aimPath: Point[];
  angle: number;
}

/**
 * 直線と矩形の境界との交点を求める（外周壁用）
 */
function findLineRectIntersection(
  start: Point,
  direction: { x: number; y: number },
  rect: { width: number; height: number },
): { point: Point; t: number } | null {
  const { x: sx, y: sy } = start;
  const { x: dx, y: dy } = direction;

  // 壁との交点を計算
  const intersections: Array<{ point: Point; t: number }> = [];

  // 左壁 (x = 0)
  if (dx !== 0) {
    const t = -sx / dx;
    if (t > 0) {
      const y = sy + t * dy;
      if (y >= 0 && y <= rect.height) {
        intersections.push({ point: { x: 0, y }, t });
      }
    }
  }

  // 右壁 (x = width)
  if (dx !== 0) {
    const t = (rect.width - sx) / dx;
    if (t > 0) {
      const y = sy + t * dy;
      if (y >= 0 && y <= rect.height) {
        intersections.push({ point: { x: rect.width, y }, t });
      }
    }
  }

  // 上壁 (y = 0)
  if (dy !== 0) {
    const t = -sy / dy;
    if (t > 0) {
      const x = sx + t * dx;
      if (x >= 0 && x <= rect.width) {
        intersections.push({ point: { x, y: 0 }, t });
      }
    }
  }

  // 下壁 (y = height)
  if (dy !== 0) {
    const t = (rect.height - sy) / dy;
    if (t > 0) {
      const x = sx + t * dx;
      if (x >= 0 && x <= rect.width) {
        intersections.push({ point: { x, y: rect.height }, t });
      }
    }
  }

  // 最も近い交点を返す
  if (intersections.length === 0) return null;

  intersections.sort((a, b) => a.t - b.t);
  return { point: intersections[0].point, t: intersections[0].t };
}

/**
 * 直線と矩形ブロックとの交点を求める
 */
function findLineBlockIntersection(
  start: Point,
  direction: { x: number; y: number },
  block: Rect,
): { point: Point; normal: { x: number; y: number }; t: number } | null {
  const { x: sx, y: sy } = start;
  const { x: dx, y: dy } = direction;
  const { x: bx, y: by, w: bw, h: bh } = block;

  const intersections: Array<{
    point: Point;
    normal: { x: number; y: number };
    t: number;
  }> = [];

  // 左辺 (x = bx)
  if (dx !== 0) {
    const t = (bx - sx) / dx;
    if (t > 1e-9) {
      const y = sy + t * dy;
      if (y >= by && y <= by + bh) {
        intersections.push({
          point: { x: bx, y },
          normal: { x: -1, y: 0 },
          t,
        });
      }
    }
  }

  // 右辺 (x = bx + bw)
  if (dx !== 0) {
    const t = (bx + bw - sx) / dx;
    if (t > 1e-9) {
      const y = sy + t * dy;
      if (y >= by && y <= by + bh) {
        intersections.push({
          point: { x: bx + bw, y },
          normal: { x: 1, y: 0 },
          t,
        });
      }
    }
  }

  // 上辺 (y = by)
  if (dy !== 0) {
    const t = (by - sy) / dy;
    if (t > 1e-9) {
      const x = sx + t * dx;
      if (x >= bx && x <= bx + bw) {
        intersections.push({
          point: { x, y: by },
          normal: { x: 0, y: -1 },
          t,
        });
      }
    }
  }

  // 下辺 (y = by + bh)
  if (dy !== 0) {
    const t = (by + bh - sy) / dy;
    if (t > 1e-9) {
      const x = sx + t * dx;
      if (x >= bx && x <= bx + bw) {
        intersections.push({
          point: { x, y: by + bh },
          normal: { x: 0, y: 1 },
          t,
        });
      }
    }
  }

  // 最も近い交点を返す
  if (intersections.length === 0) return null;

  intersections.sort((a, b) => a.t - b.t);
  return intersections[0];
}

/**
 * 反射方向を計算する
 */
function reflect(
  direction: { x: number; y: number },
  normal: { x: number; y: number },
): { x: number; y: number } {
  // reflection = direction - 2 * (direction · normal) * normal
  const dot = direction.x * normal.x + direction.y * normal.y;
  return {
    x: direction.x - 2 * dot * normal.x,
    y: direction.y - 2 * dot * normal.y,
  };
}

/**
 * 壁の法線ベクトルを取得する
 */
function getWallNormal(
  point: Point,
  fieldSize: FieldSize,
): { x: number; y: number } {
  const tolerance = 1e-6;

  if (Math.abs(point.x) < tolerance) {
    // 左壁
    return { x: 1, y: 0 };
  } else if (Math.abs(point.x - fieldSize.width) < tolerance) {
    // 右壁
    return { x: -1, y: 0 };
  } else if (Math.abs(point.y) < tolerance) {
    // 上壁
    return { x: 0, y: 1 };
  } else if (Math.abs(point.y - fieldSize.height) < tolerance) {
    // 下壁
    return { x: 0, y: -1 };
  }

  // デフォルト（上壁）
  return { x: 0, y: 1 };
}

/**
 * 外周壁とブロック両方を考慮して最近接交点を見つける
 */
function findNearestIntersection(
  start: Point,
  direction: { x: number; y: number },
  fieldSize: FieldSize,
  blocks: Rect[],
): { point: Point; normal: { x: number; y: number } } | null {
  const candidates: Array<{
    point: Point;
    normal: { x: number; y: number };
    t: number;
  }> = [];

  // 外周壁との交点
  const wallIntersection = findLineRectIntersection(
    start,
    direction,
    fieldSize,
  );
  if (wallIntersection) {
    const normal = getWallNormal(wallIntersection.point, fieldSize);
    candidates.push({
      point: wallIntersection.point,
      normal,
      t: wallIntersection.t,
    });
  }

  // ブロックとの交点
  for (const block of blocks) {
    const blockIntersection = findLineBlockIntersection(
      start,
      direction,
      block,
    );
    if (blockIntersection) {
      candidates.push(blockIntersection);
    }
  }

  // 最も近い交点を返す
  if (candidates.length === 0) return null;

  candidates.sort((a, b) => a.t - b.t);
  return { point: candidates[0].point, normal: candidates[0].normal };
}

/**
 * 砲台からマウス方向への予測経路を計算する
 */
function calculateAimPath(
  cannon: Point,
  mousePos: Point,
  maxBounce: number,
  fieldSize: FieldSize,
  blocks: Rect[],
): Point[] {
  const path: Point[] = [cannon];

  // 初期方向ベクトルを正規化
  const dx = mousePos.x - cannon.x;
  const dy = mousePos.y - cannon.y;
  const length = Math.sqrt(dx * dx + dy * dy);

  if (length === 0) return path;

  let currentPos = { ...cannon };
  let currentDirection = { x: dx / length, y: dy / length };

  // 最大バウンド数まで経路を計算
  for (let bounce = 0; bounce <= maxBounce; bounce++) {
    const intersection = findNearestIntersection(
      currentPos,
      currentDirection,
      fieldSize,
      blocks,
    );

    if (!intersection) break;

    path.push(intersection.point);

    // 最大バウンド数に達したら終了
    if (bounce >= maxBounce) break;

    // 反射方向を計算
    currentDirection = reflect(currentDirection, intersection.normal);
    currentPos = { ...intersection.point };
  }

  return path;
}

/**
 * 砲台からマウス座標への方向を、最大バウンド数を考慮して反射経路を計算するフック
 */
export const useAimGuide = (
  cannon: Point,
  mousePos: Point,
  maxBounce: number,
  fieldSize: FieldSize,
  blocks: Rect[],
): AimGuideResult =>
  useMemo(() => {
    // マウス座標が砲台と同じ場合は何も描画しない
    if (cannon.x === mousePos.x && cannon.y === mousePos.y) {
      return { aimPath: [], angle: 0 };
    }

    // 砲台からマウス座標への角度を計算
    const dx = mousePos.x - cannon.x;
    const dy = mousePos.y - cannon.y;
    const angle = Math.atan2(dy, dx);

    // 砲台から方向ベクトルに沿って反射経路を計算
    const path = calculateAimPath(
      cannon,
      mousePos,
      maxBounce,
      fieldSize,
      blocks,
    );

    return { aimPath: path, angle };
  }, [cannon, mousePos, maxBounce, fieldSize, blocks]);
