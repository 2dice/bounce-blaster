/**
 * gameReducerのテスト
 */
import { describe, it, expect } from 'vitest';
import { gameReducer, initialState } from '../src/models/reducer';
import { ActionTypes, Phase } from '../src/models/enums';

describe('gameReducer', () => {
  it('初期状態を返す', () => {
    const state = initialState;
    expect(state.phase).toBe(Phase.GENERATING);
  });

  it('READY アクションで aiming フェーズに移行する', () => {
    const state = initialState;
    const action = { type: ActionTypes.READY };
    const newState = gameReducer(state, action);
    expect(newState.phase).toBe(Phase.AIMING);
  });

  it('FIRE アクションで firing フェーズに移行する', () => {
    const state = { ...initialState, phase: Phase.AIMING };
    const action = { type: ActionTypes.FIRE };
    const newState = gameReducer(state, action);
    expect(newState.phase).toBe(Phase.FIRING);
  });

  it('SUCCESS アクションで success フェーズに移行する', () => {
    const state = { ...initialState, phase: Phase.FIRING };
    const action = { type: ActionTypes.SUCCESS };
    const newState = gameReducer(state, action);
    expect(newState.phase).toBe(Phase.SUCCESS);
  });

  it('FAIL アクションで fail フェーズに移行する', () => {
    const state = { ...initialState, phase: Phase.FIRING };
    const action = { type: ActionTypes.FAIL };
    const newState = gameReducer(state, action);
    expect(newState.phase).toBe(Phase.FAIL);
  });

  it('payload でステージ情報を更新する', () => {
    const state = initialState;
    const mockStage = {
      ...initialState.stage,
      width: 800,
      height: 600,
      maxBounce: 4 as 1 | 2 | 3 | 4 | 5,
    };
    const action = {
      type: ActionTypes.READY,
      payload: { stage: mockStage },
    };
    const newState = gameReducer(state, action);
    // maxBounceは元の値が保持され、他のプロパティは更新される
    expect(newState.stage).toEqual({
      ...mockStage,
      maxBounce: initialState.stage.maxBounce, // 元の値(3)が保持される
    });
  });

  it('payload で bullet 情報を更新する', () => {
    const state = { ...initialState, phase: Phase.AIMING };
    // matter.js Body型のモック
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockBullet = {} as any;
    const action = {
      type: ActionTypes.FIRE,
      payload: { bullet: mockBullet },
    };
    const newState = gameReducer(state, action);
    expect(newState.bullet).toBe(mockBullet);
  });

  it('PROGRESS_UPDATE アクションで progress を更新し、0-100 の範囲にクランプする', () => {
    const state = initialState;

    // 正常値のテスト
    const validAction = {
      type: ActionTypes.PROGRESS_UPDATE,
      payload: { progress: 50 },
    };
    const validState = gameReducer(state, validAction);
    expect(validState.progress).toBe(50);

    // 下限値のテスト
    const underAction = {
      type: ActionTypes.PROGRESS_UPDATE,
      payload: { progress: -10 },
    };
    const underState = gameReducer(state, underAction);
    expect(underState.progress).toBe(0);

    // 上限値のテスト
    const overAction = {
      type: ActionTypes.PROGRESS_UPDATE,
      payload: { progress: 150 },
    };
    const overState = gameReducer(state, overAction);
    expect(overState.progress).toBe(100);
  });

  it('ERROR アクションで error フェーズに移行し、エラーメッセージを設定する', () => {
    const state = { ...initialState, phase: Phase.GENERATING };
    const errorMessage = 'ステージ生成に失敗しました';
    const action = {
      type: ActionTypes.ERROR,
      payload: { error: errorMessage },
    };
    const newState = gameReducer(state, action);
    expect(newState.phase).toBe(Phase.ERROR);
    expect(newState.error).toBe(errorMessage);
  });

  it('RETRY_GENERATION アクションで generating フェーズに戻り、エラー状態をリセットする', () => {
    const state = {
      ...initialState,
      phase: Phase.ERROR,
      error: 'some error',
      progress: 50,
    };
    const action = { type: ActionTypes.RETRY_GENERATION };
    const newState = gameReducer(state, action);
    expect(newState.phase).toBe(Phase.GENERATING);
    expect(newState.error).toBeNull();
    expect(newState.progress).toBe(0);
  });

  it('NEXT_STAGE アクションで generating フェーズに戻り、ゲーム状態をリセットする', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockBullet = {} as any;
    const state = {
      ...initialState,
      phase: Phase.SUCCESS,
      bullet: mockBullet,
      bounceCount: 3,
      progress: 100,
      error: 'some error',
    };
    const action = { type: ActionTypes.NEXT_STAGE };
    const newState = gameReducer(state, action);

    expect(newState.phase).toBe(Phase.GENERATING);
    expect(newState.bullet).toBeNull();
    expect(newState.bounceCount).toBe(0);
    expect(newState.progress).toBe(0);
    expect(newState.error).toBeNull();
  });

  it('NEXT_STAGE アクションはFAIL状態からも正常に動作する', () => {
    const state = {
      ...initialState,
      phase: Phase.FAIL,
      bounceCount: 5,
      progress: 100,
    };
    const action = { type: ActionTypes.NEXT_STAGE };
    const newState = gameReducer(state, action);

    expect(newState.phase).toBe(Phase.GENERATING);
    expect(newState.bounceCount).toBe(0);
    expect(newState.progress).toBe(0);
    expect(newState.error).toBeNull();
  });

  it('SET_MAX_BOUNCE アクションでmaxBounce値を更新し、GENERATINGフェーズに遷移する', () => {
    const state = {
      ...initialState,
      phase: Phase.AIMING,
      stage: {
        ...initialState.stage,
        maxBounce: 3 as 1 | 2 | 3 | 4 | 5,
      },
      progress: 100,
      bounceCount: 2,
    };
    const action = {
      type: ActionTypes.SET_MAX_BOUNCE,
      payload: { maxBounce: 2 as 1 | 2 | 3 | 4 | 5 },
    };
    const newState = gameReducer(state, action);

    expect(newState.stage.maxBounce).toBe(2);
    expect(newState.phase).toBe(Phase.GENERATING); // GENERATINGフェーズに遷移
    expect(newState.progress).toBe(0); // 進捗リセット
    expect(newState.bounceCount).toBe(0); // バウンド回数リセット
    expect(newState.bullet).toBeNull(); // 弾をリセット
    expect(newState.error).toBeNull(); // エラー状態をクリア
  });

  it('SET_MAX_BOUNCE アクションでpayloadがない場合は現在の値を保持し、GENERATINGフェーズに遷移する', () => {
    const state = {
      ...initialState,
      phase: Phase.AIMING,
      stage: {
        ...initialState.stage,
        maxBounce: 4 as 1 | 2 | 3 | 4 | 5,
      },
    };
    const action = {
      type: ActionTypes.SET_MAX_BOUNCE,
      payload: {},
    };
    const newState = gameReducer(state, action);

    expect(newState.stage.maxBounce).toBe(4);
    expect(newState.phase).toBe(Phase.GENERATING); // GENERATINGフェーズに遷移
  });

  it('READY アクションで新しいステージを受け取る際にmaxBounceを保持する', () => {
    const state = {
      ...initialState,
      stage: {
        ...initialState.stage,
        maxBounce: 2 as 1 | 2 | 3 | 4 | 5,
      },
    };
    const newStage = {
      width: 800,
      height: 600,
      maxBounce: 5 as 1 | 2 | 3 | 4 | 5, // 新しいステージではmaxBounce=5だが、現在の設定値2が保持されるべき
      cannon: { x: 100, y: 100 },
      target: { x: 700, y: 100 },
      walls: [],
      solution: [],
    };
    const action = {
      type: ActionTypes.READY,
      payload: { stage: newStage },
    };
    const newState = gameReducer(state, action);

    expect(newState.stage.maxBounce).toBe(2); // 元の設定値が保持される
    expect(newState.stage.width).toBe(800); // 他のプロパティは新しい値
    expect(newState.phase).toBe(Phase.AIMING);
  });
});
