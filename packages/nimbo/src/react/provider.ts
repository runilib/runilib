import { createContext, createElement, useContext } from 'react';

import type { NimboProviderProps, NimboStore } from '../types';

export function createStoreProvider<TState, TActions, TViews, TAsyncActions>(
  getFallbackStore: () => NimboStore<TState, TActions, TViews, TAsyncActions>,
) {
  const StoreContext = createContext<NimboStore<
    TState,
    TActions,
    TViews,
    TAsyncActions
  > | null>(null);

  const Provider = ({
    children,
    store = getFallbackStore(),
  }: NimboProviderProps<TState, TActions, TViews, TAsyncActions>) =>
    createElement(StoreContext.Provider, { value: store }, children);

  const useStoreInstance = () => useContext(StoreContext) ?? getFallbackStore();

  return {
    Provider,
    useStoreInstance,
  };
}
