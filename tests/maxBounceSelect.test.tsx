/**
 * MaxBounceSelect コンポーネントのテスト
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MaxBounceSelect } from '../src/components/MaxBounceSelect';
import { GameContext } from '../src/contexts/GameContext';
import { ActionTypes } from '../src/models/enums';

describe('MaxBounceSelect', () => {
  let mockDispatch: ReturnType<typeof vi.fn>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockState: any;

  beforeEach(() => {
    mockDispatch = vi.fn();
    mockState = {
      stage: {
        maxBounce: 3,
        width: 960,
        height: 720,
        cannon: { x: 100, y: 100 },
        target: { x: 800, y: 100 },
        walls: [],
        solution: [],
      },
      phase: 'aiming',
      bounceCount: 0,
      progress: 100,
      bullet: null,
      error: null,
    };
  });

  it('現在のmaxBounce値が表示される', () => {
    render(
      <GameContext.Provider
        value={{ state: mockState, dispatch: mockDispatch }}
      >
        <MaxBounceSelect />
      </GameContext.Provider>,
    );

    const select = screen.getByDisplayValue('3');
    expect(select).toBeInTheDocument();
  });

  it('値変更時にSET_MAX_BOUNCEアクションがdispatchされる', () => {
    render(
      <GameContext.Provider
        value={{ state: mockState, dispatch: mockDispatch }}
      >
        <MaxBounceSelect />
      </GameContext.Provider>,
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '2' } });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: ActionTypes.SET_MAX_BOUNCE,
      payload: { maxBounce: 2 },
    });
  });

  it('1から5までの選択肢が表示される', () => {
    render(
      <GameContext.Provider
        value={{ state: mockState, dispatch: mockDispatch }}
      >
        <MaxBounceSelect />
      </GameContext.Provider>,
    );

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(5);
    expect(options[0]).toHaveValue('1');
    expect(options[1]).toHaveValue('2');
    expect(options[2]).toHaveValue('3');
    expect(options[3]).toHaveValue('4');
    expect(options[4]).toHaveValue('5');
  });

  it('ラベルが正しく表示される', () => {
    render(
      <GameContext.Provider
        value={{ state: mockState, dispatch: mockDispatch }}
      >
        <MaxBounceSelect />
      </GameContext.Provider>,
    );

    expect(screen.getByText('Max Bounce:')).toBeInTheDocument();
  });
});
