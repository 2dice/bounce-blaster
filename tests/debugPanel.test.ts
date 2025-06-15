import { describe, it, expect } from 'vitest';
import { gameReducer, initialState } from '../src/models/reducer';
import { ActionTypes } from '../src/models/enums';

describe('DebugPanel機能テスト', () => {
  it('TOGGLE_GRIDアクションでshowGridが切り替わる', () => {
    // 初期状態ではshowGridはfalse
    expect(initialState.showGrid).toBe(false);

    // TOGGLE_GRIDアクションでtrueになる
    const stateAfterToggle = gameReducer(initialState, {
      type: ActionTypes.TOGGLE_GRID,
    });

    expect(stateAfterToggle.showGrid).toBe(true);
    expect(stateAfterToggle.phase).toBe(initialState.phase); // 他の状態は変更されない

    // 再度TOGGLE_GRIDアクションでfalseに戻る
    const stateAfterSecondToggle = gameReducer(stateAfterToggle, {
      type: ActionTypes.TOGGLE_GRID,
    });

    expect(stateAfterSecondToggle.showGrid).toBe(false);
  });

  it('TOGGLE_GRID以外のアクションではshowGridが変更されない', () => {
    const stateWithGridOn = gameReducer(initialState, {
      type: ActionTypes.TOGGLE_GRID,
    });

    expect(stateWithGridOn.showGrid).toBe(true);

    // 他のアクションではshowGridが維持される
    const stateAfterOtherAction = gameReducer(stateWithGridOn, {
      type: ActionTypes.GENERATING,
    });

    expect(stateAfterOtherAction.showGrid).toBe(true);
  });
});
