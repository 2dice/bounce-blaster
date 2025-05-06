/**
 * ゲーム状態を管理するReducer
 */
import { Body } from 'matter-js';
import { ActionTypes, Phase } from './enums';
import { GameState, Stage } from './types';

/**
 * Actionの型定義
 */
export type GameAction = {
  type: ActionTypes;
  payload?: {
    stage?: Stage;
    bullet?: Body;
  };
};

/**
 * 初期状態
 * 最初はステージ生成中の状態からスタート
 */
export const initialState: GameState = {
  phase: Phase.GENERATING,
  stage: {
    width: 0,
    height: 0,
    maxBounce: 3,
    cannon: { x: 0, y: 0 },
    target: { x: 0, y: 0 },
    walls: [],
    solution: [],
  },
  bullet: null,
};

/**
 * ゲーム状態を更新するReducer
 * @param state 現在の状態
 * @param action 実行するアクション
 * @returns 新しい状態
 */
export const gameReducer = (
  state: GameState,
  action: GameAction,
): GameState => {
  switch (action.type) {
    case ActionTypes.GENERATING:
      return {
        ...state,
        phase: Phase.GENERATING,
      };

    case ActionTypes.READY:
      // ステージ生成完了、照準フェーズへ
      return {
        ...state,
        phase: Phase.AIMING,
        stage: action.payload?.stage || state.stage,
      };

    case ActionTypes.FIRE:
      // 弾発射、発射フェーズへ
      return {
        ...state,
        phase: Phase.FIRING,
        bullet: action.payload?.bullet || null,
      };

    case ActionTypes.SUCCESS:
      // ターゲット命中、成功フェーズへ
      return {
        ...state,
        phase: Phase.SUCCESS,
      };

    case ActionTypes.FAIL:
      // 失敗、失敗フェーズへ
      return {
        ...state,
        phase: Phase.FAIL,
      };

    default:
      // 未知のアクションタイプの場合は現在の状態を返す
      return state;
  }
};
