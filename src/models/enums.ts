/**
 * ゲーム状態の列挙型定義
 */

/* eslint-disable no-unused-vars */
/**
 * ゲームのフェーズを表す列挙型
 * 各値は GameState.phase のタイプ定義および reducer.ts で使用されているが、
 * ESLintの静的解析では実行時の参照を検出できないため、未使用警告を無効化する
 */
export enum Phase {
  GENERATING = 'generating',
  AIMING = 'aiming',
  FIRING = 'firing',
  SUCCESS = 'success',
  FAIL = 'fail',
}

/**
 * ゲームアクションの種類を表す列挙型
 * 各値は gameReducer でアクションタイプとして使用されているが、
 * ESLintの静的解析では実行時の参照を検出できないため、未使用警告を無効化する
 */
export enum ActionTypes {
  GENERATING = 'GENERATING',
  READY = 'READY',
  FIRE = 'FIRE',
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
  BOUNCE = 'BOUNCE',
  PROGRESS_UPDATE = 'PROGRESS_UPDATE',
}
/* eslint-enable no-unused-vars */
