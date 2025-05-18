import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStageGenerator } from '../src/hooks/useStageGenerator';
import { Stage } from '../src/models/types';

const EXPECTED_STAGE_DATA: Stage = {
  width: 960,
  height: 720,
  maxBounce: 3,
  cannon: { x: 50, y: 670 },
  target: { x: 800, y: 100 },
  walls: [],
  solution: [],
};

// ヘルパー関数の定義
const waitForHookResult = <T>(
  getResult: () => T | null | undefined,
  timeout = 2000, // タイムアウトを少し短くしてみる
): Promise<T> =>
  new Promise((resolve, reject) => {
    const startTime = Date.now();
    const check = () => {
      const resultValue = getResult();
      if (resultValue !== null && resultValue !== undefined) {
        resolve(resultValue);
      } else if (Date.now() - startTime > timeout) {
        reject(
          new Error(
            `waitForHookResult timed out waiting for hook result. Last value: ${String(
              resultValue,
            )}`,
          ),
        );
      } else {
        act(() => {
          vi.advanceTimersByTime(1); // タイマーをわずかに進める
        });
        queueMicrotask(check); // 次のマイクロタスクでチェックを再スケジュール
      }
    };
    check();
  });

describe('useStageGenerator', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllTimers();
  });

  it('特定のcannonとtargetの座標を含むステージデータを返すこと', async () => {
    const { result } = renderHook(() => useStageGenerator());

    const generateStage = await waitForHookResult(() => result.current);

    if (!generateStage) {
      throw new Error(
        'generateStage is null or undefined after waitForHookResult',
      );
    }

    let stageData: Stage | undefined;
    await act(async () => {
      const promise = generateStage(); // Promise を取得
      vi.advanceTimersByTime(15); // タイマーを進めて Promise 内の setTimeout を解決
      stageData = await promise; // Promise の解決を待つ
    });

    expect(stageData).toBeDefined();
    expect(stageData?.cannon).toEqual(EXPECTED_STAGE_DATA.cannon);
    expect(stageData?.target).toEqual(EXPECTED_STAGE_DATA.target);
    expect(stageData?.width).toBe(EXPECTED_STAGE_DATA.width);
    expect(stageData?.height).toBe(EXPECTED_STAGE_DATA.height);
    expect(stageData?.maxBounce).toBe(EXPECTED_STAGE_DATA.maxBounce);
    expect(stageData?.walls).toEqual(EXPECTED_STAGE_DATA.walls);
    expect(stageData?.solution).toEqual(EXPECTED_STAGE_DATA.solution);
  });

  it('10ms以上の遅延後にステージデータを返すこと', async () => {
    const { result } = renderHook(() => useStageGenerator());

    const generateStage = await waitForHookResult(() => result.current);

    if (!generateStage) {
      throw new Error(
        'generateStage is null or undefined after waitForHookResult',
      );
    }

    const promise = generateStage();
    let resolved = false;
    promise.then(() => {
      resolved = true;
    });

    // 0ms時点では未解決のはず
    expect(resolved).toBe(false);

    // 9ms時間を進める
    act(() => {
      vi.advanceTimersByTime(9);
    });
    // この時点でも未解決のはず
    expect(resolved).toBe(false);

    // さらに2ms時間を進める (合計11ms)
    await act(async () => {
      vi.advanceTimersByTime(2);
      await promise; // Promiseの解決を待つ
    });
    // この時点では解決済のはず
    expect(resolved).toBe(true);
  });
});
