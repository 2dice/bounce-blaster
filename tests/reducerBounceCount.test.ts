import { describe, it, expect } from 'vitest';
import { gameReducer, initialState } from '../src/models/reducer';
import { ActionTypes, Phase } from '../src/models/enums';

describe('gameReducer bounceCount', () => {
  it('increments bounceCount and changes phase to fail when exceeding maxBounce', () => {
    // 初期ステートからREADYでbounceCountリセット
    let state = gameReducer(initialState, { type: ActionTypes.READY });
    expect(state.bounceCount).toBe(0);
    expect(state.phase).toBe(Phase.AIMING);

    // maxBounce=initialState.stage.maxBounce=3 として3回まではfailにならない
    for (let i = 1; i <= state.stage.maxBounce; i++) {
      state = gameReducer(state, { type: ActionTypes.BOUNCE });
      expect(state.bounceCount).toBe(i);
      expect(state.phase).not.toBe(Phase.FAIL);
    }

    // 4回目(超過)でフェイルフェーズに遷移
    state = gameReducer(state, { type: ActionTypes.BOUNCE });
    expect(state.bounceCount).toBe(state.stage.maxBounce + 1);
    expect(state.phase).toBe(Phase.FAIL);
  });

  it('resets bounceCount to 0 on READY action', () => {
    // 任意のbounceCountを持つステートを準備
    const modified = { ...initialState, bounceCount: 2 };
    const resetState = gameReducer(modified, { type: ActionTypes.READY });
    expect(resetState.bounceCount).toBe(0);
    expect(resetState.phase).toBe(Phase.AIMING);
  });
});
