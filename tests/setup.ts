import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// globalThis に jest プロパティの型を定義
declare global {
  var jest: {
    advanceTimersByTime: (_ms: number) => void;
  };
}

// Simulate Jest for waitFor()
// see https://github.com/testing-library/dom-testing-library/blob/0ce0c7054dfa64d1cd65053790246aed151bda9d/src/helpers.ts#L5
// and https://github.com/testing-library/dom-testing-library/blob/0ce0c7054dfa64d1cd65053790246aed151bda9d/src/wait-for.js#L53
globalThis.jest = {
  advanceTimersByTime: (_ms: number) => vi.advanceTimersByTime(_ms),
};

// 各テスト後にクリーンアップ（DOMをリセット）
afterEach(() => {
  cleanup();
});
