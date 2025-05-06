/**
 * ゲーム状態を管理するContext（非コンポーネント部分）
 */
import { createContext, Dispatch, useContext } from 'react';
import { GameAction, initialState } from '../models/reducer';
import { GameState } from '../models/types';

// GameState型とdispatch関数を含むコンテキスト型
interface GameContextType {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

// デフォルト値（実際に使われることはないが型要件を満たす必要がある）
const defaultContextValue: GameContextType = {
  state: initialState,
  dispatch: () => null,
};

// Contextの作成
export const GameContext = createContext<GameContextType>(defaultContextValue);

// Context使用のためのカスタムフック
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
