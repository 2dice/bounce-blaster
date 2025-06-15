import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OverlayResult } from '../src/components/OverlayResult';

describe('OverlayResult', () => {
  it('success時に適切なメッセージとスタイルを表示する', () => {
    render(<OverlayResult type="success" />);

    // 成功メッセージが表示される
    expect(screen.getByText('SUCCESS!')).toBeInTheDocument();

    // オーバーレイが表示されている
    const overlay = screen.getByRole('dialog');
    expect(overlay).toBeInTheDocument();

    // 背景は黒色の半透明オーバーレイ
    expect(overlay).toHaveClass('bg-black', 'bg-opacity-60');

    // メッセージボックスが緑色背景を持つ
    const messageBox = overlay.querySelector('div');
    expect(messageBox).toHaveClass('bg-green-600');
  });

  it('fail時に適切なメッセージとスタイルを表示する', () => {
    render(<OverlayResult type="fail" />);

    // 失敗メッセージが表示される
    expect(screen.getByText('FAILED!')).toBeInTheDocument();

    // オーバーレイが表示されている
    const overlay = screen.getByRole('dialog');
    expect(overlay).toBeInTheDocument();

    // 背景は黒色の半透明オーバーレイ
    expect(overlay).toHaveClass('bg-black', 'bg-opacity-60');

    // メッセージボックスが赤色背景を持つ
    const messageBox = overlay.querySelector('div');
    expect(messageBox).toHaveClass('bg-red-600');
  });

  it('オーバーレイが画面全体を覆うスタイルを持つ', () => {
    render(<OverlayResult type="success" />);

    const overlay = screen.getByRole('dialog');

    // 画面全体を覆うスタイル
    expect(overlay).toHaveClass('absolute', 'inset-0', 'z-50');

    // 半透明黒背景
    expect(overlay).toHaveClass('bg-black', 'bg-opacity-60');

    // 中央配置
    expect(overlay).toHaveClass('flex', 'items-center', 'justify-center');
  });
});
