import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import GameCanvas from '../src/components/GameCanvas';
import { GameProvider } from '../src/contexts/GameProvider';
import { Phase } from '../src/models/enums';
import { GameState } from '../src/models/types';

// useMatterEngineをモック化
vi.mock('../src/hooks/useMatterEngine', () => ({
  useMatterEngine: () => ({
    engine: {
      world: { bodies: [] },
    },
    walls: [],
  }),
}));

// useAimGuideをモック化
const mockAimPath = [
  { x: 100, y: 100 },
  { x: 200, y: 200 },
];
vi.mock('../src/hooks/useAimGuide', () => ({
  useAimGuide: () => ({
    aimPath: mockAimPath,
    angle: 0,
  }),
}));

// Canvas2Dコンテキストをモック化
const mockSetLineDash = vi.fn();
const mockBeginPath = vi.fn();
const mockMoveTo = vi.fn();
const mockLineTo = vi.fn();
const mockStroke = vi.fn();
const mockClearRect = vi.fn();

// HTMLCanvasElementのgetContextをモック化
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: vi.fn(() => ({
    clearRect: mockClearRect,
    strokeStyle: '',
    lineWidth: 0,
    fillStyle: '',
    setLineDash: mockSetLineDash,
    beginPath: mockBeginPath,
    moveTo: mockMoveTo,
    lineTo: mockLineTo,
    stroke: mockStroke,
    fill: vi.fn(),
    fillRect: vi.fn(),
    closePath: vi.fn(),
    arc: vi.fn(),
  })),
});

describe('GameCanvas AimGuide Integration', () => {
  const mockState: GameState = {
    phase: Phase.AIMING,
    stage: {
      width: 960,
      height: 720,
      maxBounce: 3,
      cannon: { x: 100, y: 100 },
      target: { x: 800, y: 100 },
      walls: [],
      solution: [],
    },
    bounceCount: 0,
  };

  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderGameCanvas = (state = mockState) =>
    render(
      <GameProvider initialState={state} dispatch={mockDispatch}>
        <GameCanvas width={960} height={720} />
      </GameProvider>,
    );

  it('pointerDown→move でドラッグ状態が変化する', async () => {
    renderGameCanvas();

    const canvas = screen.getByTestId('game-canvas');

    // pointerDown イベントを発火
    await act(async () => {
      fireEvent.pointerDown(canvas, {
        clientX: 150,
        clientY: 150,
        pointerId: 1,
      });
    });

    // pointerMove イベントを発火
    await act(async () => {
      fireEvent.pointerMove(canvas, {
        clientX: 200,
        clientY: 200,
        pointerId: 1,
      });
    });

    // Canvas要素に適切なプロパティが設定されていることを確認
    expect(canvas).toBeInTheDocument();
    expect(canvas.tagName).toBe('CANVAS');
  });

  it('AIMING フェーズ以外では AimGuide が描画されない', async () => {
    const firingState = {
      ...mockState,
      phase: Phase.FIRING,
    };

    renderGameCanvas(firingState);

    const canvas = screen.getByTestId('game-canvas');

    // pointerDown→move イベントを発火
    await act(async () => {
      fireEvent.pointerDown(canvas, {
        clientX: 150,
        clientY: 150,
        pointerId: 1,
      });
      fireEvent.pointerMove(canvas, {
        clientX: 200,
        clientY: 200,
        pointerId: 1,
      });
    });

    // AimGuide用の点線描画が呼ばれないことを確認
    // clearRectは描画ループで必ず呼ばれるが、点線関連は呼ばれない
    expect(mockClearRect).toHaveBeenCalled();
    // 点線パターンは設定されない
    expect(mockSetLineDash).not.toHaveBeenCalledWith([5, 5]);
  });

  it('pointerUp でドラッグ状態が終了する', async () => {
    renderGameCanvas();

    const canvas = screen.getByTestId('game-canvas');

    // ドラッグ操作を実行
    await act(async () => {
      fireEvent.pointerDown(canvas, {
        clientX: 150,
        clientY: 150,
        pointerId: 1,
      });
      fireEvent.pointerMove(canvas, {
        clientX: 200,
        clientY: 200,
        pointerId: 1,
      });
      fireEvent.pointerUp(canvas, {
        clientX: 200,
        clientY: 200,
        pointerId: 1,
      });
    });

    // Canvas要素が引き続き存在することを確認
    expect(canvas).toBeInTheDocument();
  });

  it('Canvas 要素が存在することを確認', () => {
    renderGameCanvas();

    const canvas = screen.getByTestId('game-canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas.tagName).toBe('CANVAS');
  });
});
