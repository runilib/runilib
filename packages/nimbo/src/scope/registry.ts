import type { NimboScopeId, NimboStore } from '../types';

export function createScopeRegistry<TState, TActions, TViews, TAsyncActions>(
  createScopedStore: (
    scopeId: NimboScopeId,
  ) => NimboStore<TState, TActions, TViews, TAsyncActions>,
) {
  const stores = new Map<
    NimboScopeId,
    NimboStore<TState, TActions, TViews, TAsyncActions>
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
