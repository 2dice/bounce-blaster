import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useStageGenerator } from '../src/hooks/useStageGenerator';
import { segmentIntersectsRect } from '../src/utils/intersect';

describe('useStageGenerator fully implemented', () => {
  it('should generate valid stages repeatedly', async () => {
    const { result } = renderHook(() => useStageGenerator());

    // wait for effect to set the generator
    const generateStage = await waitFor(() => {
      if (result.current === null) throw new Error('not ready');
      return result.current;
    });

    const start = performance.now();
    const numGenerations = 5; // 繰り返し生成する回数

    for (let i = 0; i < numGenerations; i += 1) {
      let onProgressCallCount = 0; // Reset for each generation
      const progressValues: number[] = []; // Reset progressValues array at the beginning of each iteration

      const handleProgress = (value: number) => {
        onProgressCallCount += 1;
        progressValues.push(value);
      };

      const stage = await generateStage!({ onProgress: handleProgress });
      expect(stage.solution).not.toBeNull();
      expect(stage.walls.length).toBeLessThanOrEqual(20);

      // solution path does not intersect walls
      const intersects = stage.solution.some((p, idx) => {
        if (idx === stage.solution.length - 1) return false;
        const p1 = p;
        const p2 = stage.solution[idx + 1];
        return stage.walls.some(w => segmentIntersectsRect(p1, p2, w));
      });
      expect(intersects).toBe(false);

      // Check onProgress calls
      expect(onProgressCallCount).toBeGreaterThan(0);
      expect(progressValues[0]).toBe(0); // Starts with 0
      expect(progressValues[progressValues.length - 1]).toBe(100); // Ends with 100
      for (let j = 1; j < progressValues.length; j += 1) {
        expect(progressValues[j]).toBeGreaterThanOrEqual(progressValues[j - 1]); // Monotonically increasing
      }
    }

    const duration = performance.now() - start;
    expect(duration).toBeLessThan(3000);
  }, 10000); // Increase timeout to 10000ms
});
