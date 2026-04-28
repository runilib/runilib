import { describe, expect, it, vi } from 'vitest';
import { computed } from '../core/selector';
import { createStore } from '../createStore';

describe('createStore', () => {
  it('creates a typed store with state and actions', () => {
    const counter = createStore('counter', {
      state: () => ({ count: 0 }),
      actions: ({ patch }) => ({
        increment() {
          patch((state) => ({ count: state.count + 1 }));
        },
      }),
    });

    counter.actions.increment();

    expect(counter.get()).toEqual({ count: 1 });
  });

  it('notifies subscribers when state changes', () => {
    const listener = vi.fn();
    const counter = createStore('counter', {
      state: { count: 0 },
    });

    const unsubscribe = counter.subscribe(listener);

    counter.patch({ count: 1 });
    unsubscribe();
    counter.patch({ count: 2 });

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('reads derived selectors', () => {
    const cart = createStore('cart', {
      state: {
        items: [
          { label: 'Keyboard', price: 120 },
          { label: 'Mouse', price: 80 },
        ],
      },
      selectors: {
        total: (state) => state.items.reduce((sum, item) => sum + item.price, 0),
      },
    });

    expect(cart.select('total')).toBe(200);
  });

  it('reads parameterized selectors', () => {
    const cart = createStore('cart', {
      state: {
        items: [
          { label: 'Keyboard', category: 'hardware', price: 120 },
          { label: 'Mouse', category: 'hardware', price: 80 },
          { label: 'Sticker', category: 'merch', price: 5 },
        ],
      },
      selectors: {
        totalWithTax: (state, taxRate: number) =>
          state.items.reduce((sum, item) => sum + item.price, 0) * (1 + taxRate),
        itemsByCategory: (state, category: string) =>
          state.items.filter((item) => item.category === category),
      },
    });

    expect(cart.select('totalWithTax', 0.2)).toBe(246);
    expect(cart.select('itemsByCategory', 'hardware')).toHaveLength(2);
  });

  it('memoizes computed selectors by state reference and arguments', () => {
    const totalByCategory = vi.fn(
      (state: { items: Array<{ category: string; price: number }> }, category: string) =>
        state.items
          .filter((item) => item.category === category)
          .reduce((sum, item) => sum + item.price, 0),
    );

    const cart = createStore('cart', {
      state: {
        items: [
          { category: 'hardware', price: 120 },
          { category: 'hardware', price: 80 },
          { category: 'merch', price: 5 },
        ],
      },
      actions: ({ patch }) => ({
        add(category: string, price: number) {
          patch((state) => ({
            items: [...state.items, { category, price }],
          }));
        },
      }),
      selectors: {
        totalByCategory: computed(totalByCategory),
      },
    });

    expect(cart.select('totalByCategory', 'hardware')).toBe(200);
    expect(cart.select('totalByCategory', 'hardware')).toBe(200);
    expect(totalByCategory).toHaveBeenCalledTimes(1);

    expect(cart.select('totalByCategory', 'merch')).toBe(5);
    expect(totalByCategory).toHaveBeenCalledTimes(2);

    cart.actions.add('hardware', 50);

    expect(cart.select('totalByCategory', 'hardware')).toBe(250);
    expect(totalByCategory).toHaveBeenCalledTimes(3);
  });

  it('creates isolated scoped stores', () => {
    const cartStore = createStore('cart', {
      state: () => ({ items: [] as string[] }),
      actions: ({ patch }) => ({
        add(item: string) {
          patch((state) => ({ items: [...state.items, item] }));
        },
      }),
    });

    const shopA = cartStore.scope('shop-a');
    const shopB = cartStore.scope('shop-b');

    shopA.actions.add('keyboard');
    shopB.actions.add('mouse');

    expect(shopA.get().items).toEqual(['keyboard']);
    expect(shopB.get().items).toEqual(['mouse']);
    expect(cartStore.get().items).toEqual([]);
  });

  it('runs effects without mounting React and watches selected state changes', () => {
    const identify = vi.fn();
    const session = createStore('session', {
      state: () => ({ user: null as { id: string } | null }),
      actions: ({ patch }) => ({
        setUser(user: { id: string } | null) {
          patch({ user });
        },
      }),
      effects: ({ watch }) => ({
        syncUser() {
          return watch(
            (state) => state.user?.id,
            (userId) => {
              identify(userId ?? null);
            },
          );
        },
      }),
    });

    expect(identify).not.toHaveBeenCalled();

    session.actions.setUser({ id: 'u_1' });
    session.actions.setUser({ id: 'u_1' });
    session.actions.setUser(null);

    expect(identify).toHaveBeenCalledTimes(2);
    expect(identify).toHaveBeenNthCalledWith(1, 'u_1');
    expect(identify).toHaveBeenNthCalledWith(2, null);
  });

  it('cleans up effects and watcher callbacks when effects stop', () => {
    const cleanupEffect = vi.fn();
    const cleanupFirstRun = vi.fn();
    const cleanupSecondRun = vi.fn();
    const watched = vi.fn((count: number) =>
      count === 1 ? cleanupFirstRun : cleanupSecondRun,
    );

    const counter = createStore('counter', {
      state: () => ({ count: 0 }),
      effects: ({ watch }) => ({
        trackCount() {
          watch((state) => state.count, watched);

          return cleanupEffect;
        },
      }),
    });

    counter.patch({ count: 1 });
    counter.patch({ count: 2 });

    expect(watched).toHaveBeenCalledTimes(2);
    expect(cleanupFirstRun).toHaveBeenCalledTimes(1);
    expect(cleanupSecondRun).not.toHaveBeenCalled();

    counter.stopEffects();
    counter.patch({ count: 3 });

    expect(cleanupEffect).toHaveBeenCalledTimes(1);
    expect(cleanupSecondRun).toHaveBeenCalledTimes(1);
    expect(watched).toHaveBeenCalledTimes(2);
  });

  it('uses custom watcher equality to skip equal selected values', () => {
    const watcher = vi.fn();
    const points = createStore('points', {
      state: () => ({ point: { x: 0, y: 0 } }),
      effects: ({ watch }) => ({
        trackPoint() {
          return watch((state) => state.point, watcher, {
            equality: (left, right) => left.x === right.x && left.y === right.y,
          });
        },
      }),
    });

    points.patch({ point: { x: 0, y: 0 } });
    points.patch({ point: { x: 1, y: 0 } });

    expect(watcher).toHaveBeenCalledTimes(1);
    expect(watcher).toHaveBeenCalledWith(
      { x: 1, y: 0 },
      { x: 0, y: 0 },
      {
        point: { x: 1, y: 0 },
      },
    );
  });

  it('supports once watchers', () => {
    const watcher = vi.fn();
    const counter = createStore('counter', {
      state: () => ({ count: 0 }),
      effects: ({ watch }) => ({
        trackOnce() {
          return watch((state) => state.count, watcher, { once: true });
        },
      }),
    });

    counter.patch({ count: 1 });
    counter.patch({ count: 2 });

    expect(watcher).toHaveBeenCalledTimes(1);
    expect(watcher).toHaveBeenCalledWith(1, 0, { count: 1 });
  });

  it('debounces watcher callbacks', () => {
    vi.useFakeTimers();

    try {
      const watcher = vi.fn();
      const counter = createStore('counter', {
        state: () => ({ count: 0 }),
        effects: ({ watch }) => ({
          trackDebounced() {
            return watch((state) => state.count, watcher, { debounce: 100 });
          },
        }),
      });

      counter.patch({ count: 1 });
      counter.patch({ count: 2 });

      expect(watcher).not.toHaveBeenCalled();

      vi.advanceTimersByTime(99);
      expect(watcher).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(watcher).toHaveBeenCalledTimes(1);
      expect(watcher).toHaveBeenCalledWith(2, 1, { count: 2 });
    } finally {
      vi.useRealTimers();
    }
  });

  it('throttles watcher callbacks with a trailing run', () => {
    vi.useFakeTimers();

    try {
      const watcher = vi.fn();
      const counter = createStore('counter', {
        state: () => ({ count: 0 }),
        effects: ({ watch }) => ({
          trackThrottled() {
            return watch((state) => state.count, watcher, { throttle: 100 });
          },
        }),
      });

      counter.patch({ count: 1 });
      counter.patch({ count: 2 });
      counter.patch({ count: 3 });

      expect(watcher).toHaveBeenCalledTimes(1);
      expect(watcher).toHaveBeenCalledWith(1, 0, { count: 1 });

      vi.advanceTimersByTime(100);

      expect(watcher).toHaveBeenCalledTimes(2);
      expect(watcher).toHaveBeenLastCalledWith(3, 1, { count: 3 });
    } finally {
      vi.useRealTimers();
    }
  });

  it('reports watcher callback errors through onError', () => {
    const onError = vi.fn();
    const counter = createStore('counter', {
      state: () => ({ count: 0 }),
      effects: ({ watch }) => ({
        trackRiskyCallback() {
          return watch(
            (state) => state.count,
            () => {
              throw new Error('boom');
            },
            { onError },
          );
        },
      }),
    });

    counter.patch({ count: 1 });

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0]?.[0]).toBeInstanceOf(Error);
    expect((onError.mock.calls[0]?.[0] as Error).message).toBe('boom');
  });

  it('starts and stops effects independently for scoped stores', () => {
    const track = vi.fn();
    const scopedStore = createStore('scoped-counter', {
      state: () => ({ count: 0 }),
      effects: ({ scope, watch }) => ({
        trackCount() {
          return watch(
            (state) => state.count,
            (count) => {
              track(scope, count);
            },
          );
        },
      }),
    });

    const scopeA = scopedStore.scope('a');
    const scopeB = scopedStore.scope('b');

    scopeA.patch({ count: 1 });
    scopeB.patch({ count: 1 });
    scopeA.stopEffects();
    scopeA.patch({ count: 2 });
    scopeB.patch({ count: 2 });

    expect(track).toHaveBeenCalledTimes(3);
    expect(track).toHaveBeenNthCalledWith(1, 'a', 1);
    expect(track).toHaveBeenNthCalledWith(2, 'b', 1);
    expect(track).toHaveBeenNthCalledWith(3, 'b', 2);
  });

  it('binds async actions with pending, error, result, and abort support', async () => {
    const searchStore = createStore('search', {
      state: () => ({ query: '', results: [] as string[] }),
      asyncActions: {
        search: {
          policy: 'takeLatest',
          async run({ patch, signal }, query: string) {
            patch({ query });

            if (signal.aborted) {
              throw new DOMException('Aborted', 'AbortError');
            }

            const results = [`${query}:result`];
            patch({ results });

            return results;
          },
        },
      },
    });

    const result = await searchStore.asyncActions.search('nimbo');

    expect(result).toEqual(['nimbo:result']);
    expect(searchStore.getState()).toEqual({
      query: 'nimbo',
      results: ['nimbo:result'],
    });
  });
});
