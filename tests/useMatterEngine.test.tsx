import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useMatterEngine } from '../src/hooks/useMatterEngine';

describe('useMatterEngine', () => {
  it('Engine.world に外周壁4枚が追加される', async () => {
    const { result } = renderHook(() =>
      useMatterEngine({ width: 960, height: 720 }),
    );

    await waitFor(() => {
      expect(result.current.engine.world.bodies.length).toBe(4);
    });
  });
});
