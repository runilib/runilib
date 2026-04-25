import type { NimboScopeId, NimboSelectorMap, NimboStore } from '../types';

export function createScopeRegistry<
  TState,
  TActions,
  TSelectors extends NimboSelectorMap<TState>,
  TAsyncActions,
>(
  createScopedStore: (
    scopeId: NimboScopeId,
  ) => NimboStore<TState, TActions, TSelectors, TAsyncActions>,
) {
  const stores = new Map<
    NimboScopeId,
    NimboStore<TState, TActions, TSelectors, TAsyncActions>
  >();

  return {
    get(scopeId: NimboScopeId) {
      const existingStore = stores.get(scopeId);

      if (existingStore) {
        return existingStore;
      }

      const store = createScopedStore(scopeId);
      stores.set(scopeId, store);

      return store;
    },
  };
}
