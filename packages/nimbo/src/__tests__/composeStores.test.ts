import { describe, expect, it, vi } from 'vitest';
import { composeStores } from '../compose/composeStores';
import { createStore } from '../createStore';

function makeUserStore() {
  return createStore('user', {
    state: () => ({ name: 'Alice', loggedIn: false }),
    actions: ({ patch }) => ({
      setName(name: string) {
        patch({ name });
      },
      login() {
        patch({ loggedIn: true });
      },
    }),
  });
}

function makeCartStore() {
  return createStore('cart', {
    state: () => ({ items: [] as string[] }),
    actions: ({ patch }) => ({
      add(item: string) {
        patch((state) => ({ items: [...state.items, item] }));
      },
    }),
  });
}

describe('composeStores', () => {
  it('merges the state of every underlying store', () => {
    const user = makeUserStore();
    const cart = makeCartStore();
    const root = composeStores({ user, cart });

    expect(root.getState()).toEqual({
      user: { name: 'Alice', loggedIn: false },
      cart: { items: [] },
    });

    user.actions.setName('Bob');
    cart.actions.add('Air Max');

    expect(root.getState()).toEqual({
      user: { name: 'Bob', loggedIn: false },
      cart: { items: ['Air Max'] },
    });
  });

  it('notifies subscribers when any underlying store changes', () => {
    const user = makeUserStore();
    const cart = makeCartStore();
    const root = composeStores({ user, cart });
    const listener = vi.fn();

    const unsubscribe = root.subscribe(listener);

    user.actions.setName('Bob');
    cart.actions.add('Pegasus');

    expect(listener).toHaveBeenCalledTimes(2);

    unsubscribe();

    user.actions.login();

    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('returns the same reference from getState while underlying state is unchanged', () => {
    const user = makeUserStore();
    const cart = makeCartStore();
    const root = composeStores({ user, cart });

    const first = root.getState();
    const second = root.getState();

    expect(second).toBe(first);

    user.actions.setName('Bob');

    const third = root.getState();

    expect(third).not.toBe(first);
    expect(third.user).not.toBe(first.user);
    expect(third.cart).toBe(first.cart);
  });

  it('exposes the original stores for direct access', () => {
    const user = makeUserStore();
    const cart = makeCartStore();
    const root = composeStores({ user, cart });

    expect(root.stores.user).toBe(user);
    expect(root.stores.cart).toBe(cart);
  });

  it('reflects scoped instances when their state changes', () => {
    const cartDefinition = createStore('cart-scoped', {
      state: () => ({ items: [] as string[] }),
      actions: ({ patch }) => ({
        add(item: string) {
          patch((state) => ({ items: [...state.items, item] }));
        },
      }),
    });

    const nikeCart = cartDefinition.scope('nike');
    const appleCart = cartDefinition.scope('apple');
    const root = composeStores({ nike: nikeCart, apple: appleCart });

    nikeCart.actions.add('Air Max');
    appleCart.actions.add('iPhone');

    expect(root.getState()).toEqual({
      nike: { items: ['Air Max'] },
      apple: { items: ['iPhone'] },
    });
  });
});
