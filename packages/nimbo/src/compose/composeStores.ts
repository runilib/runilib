import { useSelector } from '../react/hooks';
import type { Equality, Listener, Selector } from '../types';

/**
 * Minimal structural shape that {@link composeStores} actually needs from
 * each input store: a `getState` and a `subscribe`.
 *
 * Why structural and not `Store<...>`? Because the full {@link import('../types').Store}
 * generic carries `keyof TAsyncActions` / `keyof TSelectors` in
 * contravariant function-parameter positions (`usePending`, `useSelector`).
 * A concrete store with a narrow async map (e.g. `{ manageItems: … }`) is
 * therefore not assignable to `Store<any, any, any, AsyncActionMap<any>>`,
 * which would refuse to accept it inside `composeStores({ ... })`.
 *
 * Constraining only on `{ getState, subscribe }` sidesteps the variance
 * problem entirely while keeping the result fully typed: the per-key state
 * type is recovered by {@link ExtractState} below.
 */
export type AnyStore = {
  readonly getState: () => unknown;
  readonly subscribe: (listener: Listener) => () => void;
};

/**
 * Map of input stores accepted by {@link composeStores}. Each key becomes a
 * field in the composite's state shape; each value must satisfy the
 * minimal {@link AnyStore} contract.
 */
export type StoreMap = Record<string, AnyStore>;

/**
 * Helper conditional that recovers the per-store state type from a
 * structural shape — needed because we constrain on `{ getState: () =>
 * unknown }` rather than the full `Store<TState, …>` generic.
 */
type ExtractState<S> = S extends { getState: () => infer T } ? T : never;

/**
 * The merged state shape of a {@link ComposedStore}: one field per input
 * store, each typed as the underlying store's `getState` return type.
 */
export type ComposedState<TStores extends StoreMap> = {
  [Key in keyof TStores]: ExtractState<TStores[Key]>;
};

/**
 * Read-only composite over several stores. Exposes the same selector / use
 * surface as a single store for the merged shape, but does NOT own state
 * itself — mutations still go through each underlying store's actions.
 *
 * `stores` lets you reach back to the originals when you need to dispatch
 * actions or call async actions (e.g. `root.stores.cart.actions.add(...)`).
 */
export type ComposedStore<TStores extends StoreMap> = {
  /** The original input map, kept as-is for direct access to actions, etc. */
  readonly stores: TStores;

  /** Imperative read of the merged state. */
  getState: () => ComposedState<TStores>;

  /**
   * Subscribes to changes from any underlying store. The returned cleanup
   * unsubscribes from all of them.
   */
  subscribe: (listener: Listener) => () => void;

  /**
   * React hook subscribing to the merged state. Without arguments, returns
   * the full composite snapshot. With a selector, returns only the
   * projected slice (with the usual `equality` short-circuit).
   */
  use: {
    (): ComposedState<TStores>;
    <TValue>(
      selector: Selector<ComposedState<TStores>, TValue>,
      equality?: Equality<TValue>,
    ): TValue;
  };
};

/**
 * Aggregates several stores into a read-only composite, useful when a
 * project wants a Redux/MobX-style root view without abandoning the
 * per-module mental model.
 *
 * The composite:
 * - rebuilds its merged snapshot only when at least one underlying store
 *   actually changes its state reference (otherwise `getState()` returns
 *   the cached object, which is what makes it safe to drive
 *   `useSyncExternalStore`),
 * - fans subscriptions out to every underlying store with one shared
 *   listener,
 * - preserves direct access to the originals via `composite.stores`.
 *
 * Mutations still go through each underlying store's `actions` /
 * `asyncActions`. `composeStores` is a read aggregator, not a new owner of
 * state.
 *
 * @example
 * ```ts
 * import { composeStores } from '@runilib/nimbo';
 *
 * const root = composeStores({
 *   user: userStore,
 *   theme: themeStore,
 *   cart: cartStore.scope('nike'),
 * });
 *
 * function Header() {
 *   const summary = root.use(
 *     (state) => `${state.user.name} · ${state.cart.items.length} items`,
 *   );
 *   return <span>{summary}</span>;
 * }
 *
 * // Mutations stay in their module:
 * root.stores.user.actions.setName('Bob');
 * ```
 */
export function composeStores<TStores extends StoreMap>(
  stores: TStores,
): ComposedStore<TStores> {
  const keys = Object.keys(stores) as Array<keyof TStores>;
  let cached: ComposedState<TStores> | null = null;

  const getState = (): ComposedState<TStores> => {
    // Reuse the cached composite reference when every per-key state is still
    // the same. Without this, useSyncExternalStore would see a new object on
    // every snapshot read and trigger an infinite render loop.
    const next = {} as ComposedState<TStores>;
    let stillSame = cached !== null;

    for (const key of keys) {
      const value = stores[key].getState() as ComposedState<TStores>[typeof key];
      next[key] = value;

      if (stillSame && cached?.[key] !== value) {
        stillSame = false;
      }
    }

    if (stillSame && cached !== null) {
      return cached;
    }

    cached = next;

    return next;
  };

  const subscribe = (listener: Listener) => {
    // Fan-out: one listener turns into N underlying subscriptions. The
    // returned cleanup unsubscribes all of them in one go so callers can
    // treat the composite like a single source of truth.
    const unsubscribers = keys.map((key) => stores[key].subscribe(listener));

    return () => {
      for (const unsubscribe of unsubscribers) {
        unsubscribe();
      }
    };
  };

  const use = ((
    selector?: Selector<ComposedState<TStores>, unknown>,
    equality?: Equality<unknown>,
  ) =>
    useSelector(
      getState,
      subscribe,
      selector,
      equality,
    )) as ComposedStore<TStores>['use'];

  return {
    stores,
    getState,
    subscribe,
    use,
  };
}
