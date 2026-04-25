import type { ListenerTypeAlias, SelectorMap, Store } from '../types';

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
