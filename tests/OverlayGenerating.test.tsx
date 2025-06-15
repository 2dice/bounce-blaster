import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { GameProvider } from '../src/contexts/GameProvider';
import { OverlayGenerating } from '../src/components/OverlayGenerating';
import App from '../src/App';

// GameCanvasをモック化してCanvas関連エラーを回避
vi.mock('../src/components/GameCanvas', () => ({
  default: () => <div data-testid="mock-game-canvas">Mock Game Canvas</div>,
}));

describe('OverlayGenerating Progress Tests', () => {
  beforeEach(() => {
    // タイマーをモック化
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render with initial progress value', () => {
    render(<OverlayGenerating progress={25} />);

    expect(screen.getByText('生成中... 25%')).toBeInTheDocument();
  });

  it('should update progress display when progress prop changes', () => {
    const { rerender } = render(<OverlayGenerating progress={0} />);

    expect(screen.getByText('生成中... 0%')).toBeInTheDocument();

    rerender(<OverlayGenerating progress={50} />);
    expect(screen.getByText('生成中... 50%')).toBeInTheDocument();

    rerender(<OverlayGenerating progress={100} />);
    expect(screen.getByText('生成中... 100%')).toBeInTheDocument();
  });

  it('should display progress values as provided by reducer', () => {
    const { rerender } = render(<OverlayGenerating progress={0} />);
    expect(screen.getByText('生成中... 0%')).toBeInTheDocument();

    rerender(<OverlayGenerating progress={50} />);
    expect(screen.getByText('生成中... 50%')).toBeInTheDocument();

    rerender(<OverlayGenerating progress={100} />);
    expect(screen.getByText('生成中... 100%')).toBeInTheDocument();
  });

  it('should display overlay during generating phase and hide when phase changes', async () => {
    render(
      <GameProvider>
        <App />
      </GameProvider>,
    );

    // 初期状態でGENERATINGフェーズなのでオーバーレイが表示されているはず
    expect(screen.getByText(/生成中/)).toBeInTheDocument();

    // プログレスバーの要素が存在することを確認
    const progressText = screen.getByText(/生成中... \d+%/);
    expect(progressText).toBeInTheDocument();

    // 時間を進めてステージ生成完了を待つ
    await act(async () => {
      vi.advanceTimersByTime(5000); // 5秒進める
    });

    // ステージ生成完了後、オーバーレイが消えることを確認
    expect(screen.queryByText(/生成中... \d+%/)).toBeNull();
  });

  it('should show progress bar with correct styling classes', () => {
    render(<OverlayGenerating progress={50} />);

    // 進捗テキストが表示されることを確認
    expect(screen.getByText('生成中... 50%')).toBeInTheDocument();

    // オーバーレイの背景要素を確認
    const overlayElements = document.querySelectorAll(
      '.absolute.inset-0.bg-black.bg-opacity-60',
    );
    expect(overlayElements.length).toBeGreaterThan(0);

    // ProgressBarのクラスを確認
    const progressBarElement = document.querySelector('.h-16.w-60.bg-gray-800');
    expect(progressBarElement).toBeInTheDocument();
  });
});
