import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useAsyncOptions } from '../hooks/shared/useAsyncOptions';

async function flushAsyncCycles(iterations = 4) {
  for (let index = 0; index < iterations; index += 1) {
    await act(async () => {
      vi.runOnlyPendingTimers();
      await Promise.resolve();
      await Promise.resolve();
    });
  }
}

describe('useAsyncOptions', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('does not refetch when dependency values and dependsOn arrays are recreated with the same content', async () => {
    vi.useFakeTimers();

    const fetcher = vi.fn(async () => []);

    renderHook(() =>
      useAsyncOptions(
        {
          key: 'cities',
          fetch: fetcher,
          dependsOn: ['country'],
          debounce: 0,
        },
        { country: 'FR' },
      ),
    );

    await flushAsyncCycles();

    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});
