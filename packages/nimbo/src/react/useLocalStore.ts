import { useRef } from 'react';

import { createStore } from '../createStore';
import type {
  AsyncActionMap,
  EffectMap,
  SelectorMap,
  Store,
  StoreDefinition,
} from '../types';

/**
 * Per-component store. Builds a fresh {@link Store} the first time the
 * component renders and reuses the same instance for every subsequent
 * render of the same component instance.
 *
 * Each call site gets its own state — two `<Notepad />` siblings calling
 * `useLocalStore('notepad', …)` do not share anything, even though they
 * pass the same definition.
 *
 * Use this when:
 * - the state is genuinely tied to the lifecycle of one component instance
 *   (a wizard step, a draft form, a self-contained widget),
 * - and you want the same definition (`actions`, `selectors`,
 *   `asyncActions`) you would write for a global store, without the global
 *   sharing.
 *
 * For state that should be shared across components but split by some
 * identity, prefer a global `createStore` + `store.scope(id)` instead.
 *
 * Note: the `definition` argument is captured on the first render only.
 * Mutating it on subsequent renders (e.g. closing over a changing prop)
 * will not rebuild the store. Read the changing value out of state via
 * `setState`/`patch` from a `useEffect` if you need to react to it.
 */
export function useLocalStore<
  TState,
  TActions extends object = object,
  TSelectors extends SelectorMap<TState> = SelectorMap<TState>,
  TAsyncActions extends AsyncActionMap<TState> = AsyncActionMap<TState>,
  TEffects extends EffectMap = EffectMap,
>(
  name: string,
  definition: StoreDefinition<TState, TActions, TSelectors, TAsyncActions, TEffects>,
): Store<TState, TActions, TSelectors, TAsyncActions> {
  const storeRef = useRef<Store<TState, TActions, TSelectors, TAsyncActions>>();

  // Lazy-init: pay the createStore cost once per component instance.
  storeRef.current ??= createStore(name, definition);

  return storeRef.current;
}
