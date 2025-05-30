import { Point, Rect } from '../models/types';

/**
 * 点が矩形内部にあるか判定
 */
function pointInRect(p: Point, r: Rect): boolean {
  return p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;
}

/**
 * 線分 p1-p2 と p3-p4 が交差するか判定 (排他的: 端点含むと true)
 */
function segmentIntersect(p1: Point, p2: Point, p3: Point, p4: Point): boolean {
  // 2D クロス積の符号で判定 (向き)
  const cross = (a: Point, b: Point, c: Point) =>
    (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);

  const d1 = cross(p1, p2, p3);
  const d2 = cross(p1, p2, p4);
  const d3 = cross(p3, p4, p1);
  const d4 = cross(p3, p4, p2);

  return d1 * d2 <= 0 && d3 * d4 <= 0;
}

/**
 * 線分と AABB(Rect) の交差判定
 *
 * - 端点が矩形内なら交差とみなす
 * - いずれかの辺と交差していれば交差とみなす
 */
export function segmentIntersectsRect(p1: Point, p2: Point, r: Rect): boolean {
  if (pointInRect(p1, r) || pointInRect(p2, r)) return true;

  const tl: Point = { x: r.x, y: r.y };
  const tr: Point = { x: r.x + r.w, y: r.y };
  const br: Point = { x: r.x + r.w, y: r.y + r.h };
  const bl: Point = { x: r.x, y: r.y + r.h };

  return (
    segmentIntersect(p1, p2, tl, tr) ||
    segmentIntersect(p1, p2, tr, br) ||
    segmentIntersect(p1, p2, br, bl) ||
    segmentIntersect(p1, p2, bl, tl)
  );
}
