import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import App from '../src/App';

describe('App', () => {
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
});
