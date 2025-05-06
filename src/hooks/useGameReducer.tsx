/**
 * ゲーム状態を管理するカスタムフック
 */
import { useGameContext } from '../contexts/GameContext';

/**
 * ゲーム状態と更新関数を提供するカスタムフック
 * @returns {Object} stateとdispatchを含むオブジェクト
 */
export const useGameReducer = () => {
  const { state, dispatch } = useGameContext();
  return { state, dispatch };
};
