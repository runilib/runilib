import { useRef } from 'react';

import { createStore } from '../createStore';
import type { AsyncActionMap, SelectorMap, Store, StoreDefinition } from '../types';

export function useLocalStore<
  TState,
  TActions extends object = object,
  TSelectors extends SelectorMap<TState> = SelectorMap<TState>,
  TAsyncActions extends AsyncActionMap<TState> = AsyncActionMap<TState>,
>(
  name: string,
  definition: StoreDefinition<TState, TActions, TSelectors, TAsyncActions>,
): Store<TState, TActions, TSelectors, TAsyncActions> {
  const storeRef = useRef<Store<TState, TActions, TSelectors, TAsyncActions>>();

  storeRef.current ??= createStore(name, definition);

  return storeRef.current;
}
