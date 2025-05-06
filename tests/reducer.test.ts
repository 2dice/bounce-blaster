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
    expect(newState.stage).toEqual(mockStage);
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
});
