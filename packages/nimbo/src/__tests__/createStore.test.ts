import { describe, expect, it, vi } from 'vitest';
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

  it('reads derived views', () => {
    const cart = createStore('cart', {
      state: {
        items: [
          { label: 'Keyboard', price: 120 },
          { label: 'Mouse', price: 80 },
        ],
      },
      views: {
        total: (state) => state.items.reduce((sum, item) => sum + item.price, 0),
      },
    });

    expect(cart.view('total')).toBe(200);
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
