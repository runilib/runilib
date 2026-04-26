import type { ListenerTypeAlias, SelectorMap, Store } from '../types';

/**
 * Memoized factory for scoped store instances.
 *
 * Backs `store.scope(id)`. The first call for a given id materializes a
 * fresh {@link Store} via `createScopedStore(id)` and caches it; every
 * subsequent call with the same id returns that exact same instance.
 *
 * Two consequences worth knowing:
 * - `cartStore.scope('nike') === cartStore.scope('nike')` — referential
 *   equality is preserved, so React subscriptions and `composeStores`
 *   behave correctly across renders.
 * - The cache is unbounded for the lifetime of the parent store. Scopes
 *   you stop using stay in memory; if your scope ids are unbounded
 *   (e.g. one per session), you will want a future eviction API.
 */
export function createScopeRegistry<
  TState,
  TActions,
  TSelectors extends SelectorMap<TState>,
  TAsyncActions,
>(
  createScopedStore: (
    Listener: ListenerTypeAlias,
  ) => Store<TState, TActions, TSelectors, TAsyncActions>,
) {
  const stores = new Map<
    ListenerTypeAlias,
    Store<TState, TActions, TSelectors, TAsyncActions>
  >();

  return {
    /**
     * Returns the store for `Listener`, creating it on first access.
     * Same id → same instance.
     */
    get(Listener: ListenerTypeAlias) {
      const existingStore = stores.get(Listener);

      if (existingStore) {
        return existingStore;
      }

      const store = createScopedStore(Listener);
      stores.set(Listener, store);

      return store;
    },
  };
}
