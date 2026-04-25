import { useRef } from 'react';

import { createStore } from '../createStore';
import type {
  NimboAsyncActionMap,
  NimboSelectorMap,
  NimboStore,
  NimboStoreDefinition,
} from '../types';

export function useLocalStore<
  TState,
  TActions extends object = object,
  TSelectors extends NimboSelectorMap<TState> = NimboSelectorMap<TState>,
  TAsyncActions extends NimboAsyncActionMap<TState> = NimboAsyncActionMap<TState>,
>(
  name: string,
  definition: NimboStoreDefinition<TState, TActions, TSelectors, TAsyncActions>,
): NimboStore<TState, TActions, TSelectors, TAsyncActions> {
  const storeRef = useRef<NimboStore<TState, TActions, TSelectors, TAsyncActions>>();

  if (!storeRef.current) {
    storeRef.current = createStore(name, definition);
  }

  return storeRef.current;
}
