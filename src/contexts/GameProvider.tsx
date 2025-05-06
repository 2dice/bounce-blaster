/**
 * ゲーム状態を管理するProvider（コンポーネント部分）
 */
import { ReactNode, useReducer } from 'react';
import { gameReducer, initialState } from '../models/reducer';
import { GameContext } from './GameContext';

// GameProviderコンポーネント（Contextのプロバイダー）
interface GameProviderProps {
  children: ReactNode;
}

/**
 * ゲーム状態をアプリ全体で共有するためのProviderコンポーネント
 */
export const GameProvider = ({ children }: GameProviderProps) => {
  // useReducerを使ってゲーム状態とdispatch関数を取得
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // コンテキスト値
  const value = { state, dispatch };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
