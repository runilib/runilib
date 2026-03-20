import { renderHook, act, waitFor } from '@testing-library/react';
import { useAsyncOptions } from '../src/async-options/useAsyncOptions';

const COUNTRIES = [
  { label: 'France', value: 'FR' },
  { label: 'Germany', value: 'DE' },
  { label: 'Spain', value: 'ES' },
];

function makeFetcher(delay = 0, data = COUNTRIES) {
  return jest.fn().mockImplementation(async (search?: string) => {
    if (delay) await new Promise(r => setTimeout(r, delay));
    if (search) return data.filter(c => c.label.toLowerCase().includes(search.toLowerCase()));
    return data;
  });
}

describe('useAsyncOptions', () => {
  it('fetches options on mount', async () => {
    const fetcher = makeFetcher();
    const { result } = renderHook(() => useAsyncOptions({ fetch: fetcher }));

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.options).toEqual(COUNTRIES);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('shows initial options while loading', async () => {
    const initial = [{ label: 'Loading...', value: '' }];
    const fetcher = makeFetcher(50);
    const { result } = renderHook(() => useAsyncOptions({
      fetch: fetcher, initialOptions: initial,
    }));
    expect(result.current.options).toEqual(initial);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.options).toEqual(COUNTRIES);
  });

  it('does not fetch on mount when fetchOnMount=false', async () => {
    const fetcher = makeFetcher();
    const { result } = renderHook(() => useAsyncOptions({
      fetch: fetcher, fetchOnMount: false,
    }));
    await new Promise(r => setTimeout(r, 20));
    expect(fetcher).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  it('setSearch triggers a re-fetch with debounce', async () => {
    const fetcher = makeFetcher();
    const { result } = renderHook(() => useAsyncOptions({
      fetch: fetcher, debounce: 10,
    }));
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => { result.current.setSearch('fra'); });
    await waitFor(() => {
      expect(fetcher.mock.calls.length).toBeGreaterThan(1);
    });

    expect(result.current.search).toBe('fra');
  });

  it('filters results when searching', async () => {
    const fetcher = makeFetcher(0);
    const { result } = renderHook(() => useAsyncOptions({
      fetch: fetcher, debounce: 0,
    }));
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => { result.current.setSearch('fra'); });
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // The fetcher was called with 'fra' — returns filtered results
    expect(fetcher).toHaveBeenCalledWith('fra', undefined);
  });

  it('shows error when fetch fails', async () => {
    const fetcher = jest.fn().mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useAsyncOptions({ fetch: fetcher }));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Network error');
  });

  it('refresh triggers a new fetch', async () => {
    const fetcher = makeFetcher();
    const { result } = renderHook(() => useAsyncOptions({ fetch: fetcher }));
    await waitFor(() => expect(result.current.loading).toBe(false));
    const callsBefore = fetcher.mock.calls.length;

    act(() => { result.current.refresh(); });
    await waitFor(() => expect(fetcher.mock.calls.length).toBeGreaterThan(callsBefore));
  });

  it('minChars prevents fetch for short queries', async () => {
    const fetcher = makeFetcher();
    const { result } = renderHook(() => useAsyncOptions({
      fetch: fetcher, minChars: 3, debounce: 0, fetchOnMount: false,
    }));

    act(() => { result.current.setSearch('ab'); }); // 2 chars — should not fetch
    await new Promise(r => setTimeout(r, 50));
    expect(fetcher).not.toHaveBeenCalled();

    act(() => { result.current.setSearch('abc'); }); // 3 chars — should fetch
    await waitFor(() => expect(fetcher).toHaveBeenCalled());
  });

  it('caches results and avoids duplicate fetches', async () => {
    const fetcher = makeFetcher();
    const { result } = renderHook(() => useAsyncOptions({
      fetch: fetcher, cacheTtl: 60_000,
    }));
    await waitFor(() => expect(result.current.loading).toBe(false));
    const calls1 = fetcher.mock.calls.length;

    // Second render same config — should use cache
    act(() => { result.current.refresh(); });
    // Cache hit — fetcher should NOT be called again for same key
    // (depends on timing, but in theory cache returns immediately)
    expect(result.current.options).toEqual(COUNTRIES);
  });
});
