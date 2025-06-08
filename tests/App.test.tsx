// vitest から必要なものをまとめてインポート
import { describe, it, expect, vi, beforeEach } from 'vitest';
// testing-library/react から必要なものをまとめてインポート
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import App from '../src/App';

// GameCanvasをモック化してCanvas関連エラーを回避
vi.mock('../src/components/GameCanvas', () => ({
  default: () => <canvas data-testid="game-canvas">Mock Game Canvas</canvas>,
}));

// useStageGeneratorをモック化
const mockGenerateStage = vi.fn();
vi.mock('../src/hooks/useStageGenerator', () => ({
  useStageGenerator: () => mockGenerateStage,
}));

describe('App', () => {
  beforeEach(() => {
    // 各テスト前にモックをリセット
    vi.clearAllMocks();
    // デフォルトで成功するモックを設定
    mockGenerateStage.mockResolvedValue({
      width: 960,
      height: 720,
      maxBounce: 3,
      cannon: { x: 100, y: 100 },
      target: { x: 200, y: 200 },
      walls: [],
      solution: [],
    });
  });

  it('should render the title text', () => {
    // Appコンポーネントをレンダリング
    render(<App />);

    // 「Hello Bounce Blaster」というテキストが含まれるか確認
    const titleElement = screen.getByText(/Hello Bounce Blaster/i);

    // テキストが存在するか確認
    expect(titleElement).toBeInTheDocument();

    // h1タグであることを確認
    expect(titleElement.tagName).toBe('H1');
  });

  it('should render the game canvas', () => {
    // Appコンポーネントをレンダリング
    render(<App />);

    // canvasが存在するか確認（data-testid属性で特定）
    const canvasElement = screen.getByTestId('game-canvas');

    // canvasが存在するか確認
    expect(canvasElement).toBeInTheDocument();

    // canvasタグであることを確認
    expect(canvasElement.tagName).toBe('CANVAS');
  });

  it('should display error overlay when stage generation fails', async () => {
    // ステージ生成が失敗するようにモック設定
    const errorMessage = 'Stage generation failed';
    mockGenerateStage.mockRejectedValue(new Error(errorMessage));

    render(<App />);

    // エラーオーバーレイが表示されることを確認
    await screen.findByText('エラーが発生しました');
    expect(screen.getByText(/ステージ生成に失敗しました/)).toBeInTheDocument();
    expect(screen.getByText('再試行')).toBeInTheDocument();
  });

  it('should retry stage generation when retry button is clicked', async () => {
    // 最初は失敗、2回目は成功するようにモック設定
    mockGenerateStage
      .mockRejectedValueOnce(new Error('First failure'))
      .mockResolvedValueOnce({
        width: 960,
        height: 720,
        maxBounce: 3,
        cannon: { x: 100, y: 100 },
        target: { x: 200, y: 200 },
        walls: [],
        solution: [],
      });

    render(<App />);

    // エラーオーバーレイが表示されることを確認
    await screen.findByText('エラーが発生しました');

    // 再試行ボタンをクリック
    const retryButton = screen.getByText('再試行');
    await act(async () => {
      fireEvent.click(retryButton);
    });

    // 2回目のgenerateStageが呼ばれることを確認
    expect(mockGenerateStage).toHaveBeenCalledTimes(2);
  });
});
