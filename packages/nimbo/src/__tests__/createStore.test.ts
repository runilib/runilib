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
