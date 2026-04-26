import { createContext, createElement, useContext } from 'react';

import type { ProviderProps, SelectorMap, Store } from '../types';

/**
 * Builds a React context Provider plus its companion `useStoreInstance`
 * resolver, both bound to a specific {@link Store}.
 *
 * The Provider lets a subtree override which store the React hooks (`use`,
 * `useSelector`, `useActions`, …) resolve to — this is what enables scoped
 * and local instances to be consumed transparently with the same hook call
 * sites as the global singleton.
 *
 * `useStoreInstance` returns the store from context when one is set,
 * otherwise falls back to the singleton produced by `getFallbackStore`.
 * The fallback is read lazily so the Provider works even before the
 * surrounding `createStore` has finished wiring its return value.
 */
export function createStoreProvider<
  TState,
  TActions,
  TSelectors extends SelectorMap<TState>,
  TAsyncActions,
>(getFallbackStore: () => Store<TState, TActions, TSelectors, TAsyncActions>) {
  const StoreContext = createContext<Store<
    TState,
    TActions,
    TSelectors,
    TAsyncActions
  > | null>(null);

  const Provider = ({
    children,
    store = getFallbackStore(),
  }: ProviderProps<TState, TActions, TSelectors, TAsyncActions>) =>
    createElement(StoreContext.Provider, { value: store }, children);

  const useStoreInstance = () => useContext(StoreContext) ?? getFallbackStore();

  return {
    Provider,
    useStoreInstance,
  };
}
