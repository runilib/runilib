import { useRef } from 'react';

import { createStore } from '../createStore';
import type { NimboAsyncActionMap, NimboStore, NimboStoreDefinition } from '../types';

export function useLocalStore<
  TState,
  TActions extends object = object,
  TViews extends object = object,
  TAsyncActions extends NimboAsyncActionMap<TState> = NimboAsyncActionMap<TState>,
>(
  name: string,
  definition: NimboStoreDefinition<TState, TActions, TViews, TAsyncActions>,
): NimboStore<TState, TActions, TViews, TAsyncActions> {
  const storeRef = useRef<NimboStore<TState, TActions, TViews, TAsyncActions>>();

  if (!storeRef.current) {
    storeRef.current = createStore(name, definition);
  }

  return storeRef.current;
}
