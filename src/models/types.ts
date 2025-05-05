/**
 * ゲームの基本的なデータ型定義
 */

/**
 * 2D上の点を表す型
 */
export type Point = {
  readonly x: number;
  readonly y: number;
};

/**
 * 2D上の矩形を表す型
 */
export type Rect = {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
};

/**
 * ゲームステージの情報を表すインターフェース
 */
export interface Stage {
  readonly width: number;
  readonly height: number;
  readonly maxBounce: 1 | 2 | 3 | 4 | 5;
  readonly cannon: Point; // 砲台中心
  readonly target: Point; // ターゲット中心
  readonly walls: Rect[]; // Static blocks
  readonly solution: Point[]; // バウンド点列 (内部デバッグ用)
}

/**
 * ゲーム全体の状態を表すインターフェース
 * React useReducerで使用予定
 */
export interface GameState {
  readonly phase: 'generating' | 'aiming' | 'firing' | 'success' | 'fail';
  readonly stage: Stage;
  readonly bullet?: Matter.Body;
}
