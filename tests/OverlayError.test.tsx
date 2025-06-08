import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OverlayError } from '../src/components/OverlayError';

describe('OverlayError', () => {
  it('should display error message and retry button', () => {
    const mockOnRetry = vi.fn();
    const errorMessage = 'ステージ生成に失敗しました';

    render(<OverlayError error={errorMessage} onRetry={mockOnRetry} />);

    expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText('再試行')).toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', () => {
    const mockOnRetry = vi.fn();
    const errorMessage = 'test error';

    render(<OverlayError error={errorMessage} onRetry={mockOnRetry} />);

    const retryButton = screen.getByText('再試行');
    fireEvent.click(retryButton);

    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('should have correct styling classes for overlay and error UI', () => {
    const mockOnRetry = vi.fn();
    const errorMessage = 'test error';

    render(<OverlayError error={errorMessage} onRetry={mockOnRetry} />);

    // オーバーレイの背景要素を確認
    const overlayElements = document.querySelectorAll(
      '.fixed.inset-0.bg-black.bg-opacity-70',
    );
    expect(overlayElements.length).toBeGreaterThan(0);

    // エラーアイコンの確認
    const errorIcon = document.querySelector('svg');
    expect(errorIcon).toBeInTheDocument();

    // リトライボタンの確認
    const retryButton = screen.getByText('再試行');
    expect(retryButton).toHaveClass('bg-blue-600', 'hover:bg-blue-700');
  });
});
