/**
 * ゲームの基本的なデータ型定義
 */
import { Body } from 'matter-js';

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
 * パーティクルを表すインターフェース
 */
export interface Particle {
  readonly id: string;
  readonly position: Point;
  readonly velocity: Point;
  readonly color: string;
  readonly radius: number;
  readonly alpha: number;
  readonly lifespan: number; // 残り寿命（秒）
  readonly maxLifespan: number; // 最大寿命（秒）
}

/**
 * パーティクルエフェクトの種類
 */
export type ParticleType = 'flash' | 'trail' | 'spark';

/**
 * ゲーム全体の状態を表すインターフェース
 * React useReducerで使用予定
 */
export interface GameState {
  readonly phase:
    | 'generating'
    | 'aiming'
    | 'firing'
    | 'success'
    | 'fail'
    | 'error';
  readonly stage: Stage;
  readonly bullet?: Body | null;
  readonly bounceCount: number;
  readonly progress: number; // ステージ生成進捗 (0-100)
  readonly error?: string | null; // エラーメッセージ
}
