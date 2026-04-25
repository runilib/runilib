import { createContext, createElement, useContext } from 'react';

import type { NimboProviderProps, NimboSelectorMap, NimboStore } from '../types';

export function createStoreProvider<
  TState,
  TActions,
  TSelectors extends NimboSelectorMap<TState>,
  TAsyncActions,
>(getFallbackStore: () => NimboStore<TState, TActions, TSelectors, TAsyncActions>) {
  const StoreContext = createContext<NimboStore<
    TState,
    TActions,
    TSelectors,
    TAsyncActions
  > | null>(null);

  const Provider = ({
    children,
    store = getFallbackStore(),
  }: NimboProviderProps<TState, TActions, TSelectors, TAsyncActions>) =>
    createElement(StoreContext.Provider, { value: store }, children);

  const useStoreInstance = () => useContext(StoreContext) ?? getFallbackStore();

  return {
    Provider,
    useStoreInstance,
  };
}
