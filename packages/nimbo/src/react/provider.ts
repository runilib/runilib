import { createContext, createElement, useContext } from 'react';

import type { ProviderProps, SelectorMap, Store } from '../types';

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
