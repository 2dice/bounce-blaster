/**
 * 最大バウンド数を選択するセレクトボックスコンポーネント
 */
import { useContext } from 'react';
import { GameContext } from '../contexts/GameContext';
import { ActionTypes } from '../models/enums';

/**
 * 最大バウンド数選択コンポーネント
 */
export function MaxBounceSelect() {
  const { state, dispatch } = useContext(GameContext);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value) as 1 | 2 | 3 | 4 | 5;
    dispatch({
      type: ActionTypes.SET_MAX_BOUNCE,
      payload: { maxBounce: value },
    });
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="max-bounce-select" className="text-sm font-medium">
        Max Bounce:
      </label>
      <select
        id="max-bounce-select"
        value={state.stage.maxBounce}
        onChange={handleChange}
        className="h-8 w-20 rounded border border-gray-600 bg-gray-800 px-2 text-white focus:border-blue-500 focus:outline-none"
      >
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={4}>4</option>
        <option value={5}>5</option>
      </select>
    </div>
  );
}
