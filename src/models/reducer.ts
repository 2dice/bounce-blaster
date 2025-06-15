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
    progress?: number;
    error?: string;
    maxBounce?: 1 | 2 | 3 | 4 | 5;
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
    seed: 0,
  },
  bullet: null,
  bounceCount: 0,
  progress: 0,
  error: null,
  showGrid: false,
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
        progress: 0,
        error: null, // エラー状態をクリア
      };

    case ActionTypes.READY:
      // ステージ生成完了、照準フェーズへ
      return {
        ...state,
        phase: Phase.AIMING,
        stage: action.payload?.stage
          ? { ...action.payload.stage, maxBounce: state.stage.maxBounce }
          : state.stage,
        bounceCount: 0, // バウンド回数リセット
        progress: 100, // 生成完了
        error: null, // エラー状態をクリア
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

    case ActionTypes.BOUNCE: {
      // 壁衝突ごとにバウンド回数をインクリメントし、最大バウンド超過でFAIL
      const newCount = state.bounceCount + 1;
      if (newCount > state.stage.maxBounce) {
        return { ...state, bounceCount: newCount, phase: Phase.FAIL };
      }
      return { ...state, bounceCount: newCount };
    }

    case ActionTypes.PROGRESS_UPDATE:
      // ステージ生成の進捗更新
      return {
        ...state,
        progress: Math.max(0, Math.min(100, action.payload?.progress ?? 0)),
      };

    case ActionTypes.ERROR:
      // エラー発生時、エラーフェーズに遷移
      return {
        ...state,
        phase: Phase.ERROR,
        error: action.payload?.error || 'ステージ生成中にエラーが発生しました',
      };

    case ActionTypes.RETRY_GENERATION:
      // エラー状態からリトライ、生成フェーズに戻る
      return {
        ...state,
        phase: Phase.GENERATING,
        progress: 0,
        error: null,
      };

    case ActionTypes.NEXT_STAGE:
      // 次のステージへ進む（成功/失敗後の自動遷移）
      return {
        ...state,
        phase: Phase.GENERATING,
        progress: 0,
        bullet: null, // 弾をリセット
        bounceCount: 0, // バウンド回数リセット
        error: null, // エラー状態をクリア
      };

    case ActionTypes.SET_MAX_BOUNCE:
      // 最大バウンド数設定と同時にステージ再生成を開始
      return {
        ...state,
        phase: Phase.GENERATING,
        progress: 0,
        bullet: null, // 弾をリセット
        bounceCount: 0, // バウンド回数リセット
        error: null, // エラー状態をクリア
        stage: {
          ...state.stage,
          maxBounce: action.payload?.maxBounce || state.stage.maxBounce,
        },
      };

    case ActionTypes.TOGGLE_GRID:
      // デバッグ用グリッド表示切り替え
      return {
        ...state,
        showGrid: !state.showGrid,
      };

    default:
      // 未知のアクションタイプの場合は現在の状態を返す
      return state;
  }
};
