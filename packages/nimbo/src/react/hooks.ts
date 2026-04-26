import { useRef, useSyncExternalStore } from 'react';

import type { Equality, Selector } from '../types';

const identity = <TValue>(value: TValue) => value;

/**
 * Bridges any external store with React's `useSyncExternalStore`, applying
 * an optional projection (`selector`) and equality check (defaults to
 * `Object.is`).
 *
 * Used by every React hook on a Nimbo store: `store.use`, `store.useSelector`,
 * `store.usePending`, `store.useError`, `store.useResult`, and
 * `composeStores().use`.
 *
 * Why a snapshot wrapper instead of `useSyncExternalStore(subscribe, getState)`?
 *
 * - With a selector, every render-time call of `getState` would project a
 *   fresh value. React then compares the new snapshot to the previous one
 *   to decide whether to re-render. If `equality(prev, new)` returns true
 *   we want to keep returning the *same reference*, not a new equal one,
 *   so the {@link createSelectorSnapshot} closure caches the last accepted
 *   projection. This matches the contract of `useSyncExternalStore`
 *   (`getSnapshot` must be referentially stable when nothing changed).
 * - The `selectorRef` / `equalityRef` indirection lets the latest selector
 *   and equality functions take effect across renders without rebuilding
 *   the snapshot closure.
 */
export function useSelector<TState, TValue = TState>(
  getState: () => TState,
  subscribe: (listener: () => void) => () => void,
  selector?: Selector<TState, TValue>,
  equality: Equality<TValue> = Object.is,
) {
  const selectorRef = useRef(selector ?? (identity as Selector<TState, TValue>));
  const equalityRef = useRef(equality);
  const snapshotRef = useRef<() => TValue>();

  // Keep the refs pointing at the freshest functions; the snapshot closure
  // reads them indirectly so we don't need to rebuild it on every render.
  selectorRef.current = selector ?? (identity as Selector<TState, TValue>);
  equalityRef.current = equality;

  snapshotRef.current ??= createSelectorSnapshot(
    getState,
    (currentState) => selectorRef.current(currentState),
    (left, right) => equalityRef.current(left, right),
  );

  return useSyncExternalStore(subscribe, snapshotRef.current, snapshotRef.current);
}

/**
 * Builds a snapshot function that projects state through `selector` and
 * keeps returning the same reference until `equality` says the projected
 * value has actually changed.
 *
 * This is what makes `useSyncExternalStore` skip re-renders when, for
 * example, a `state.count` selector returns the same number even though
 * `state` was replaced with a structurally-equal object.
 */
function createSelectorSnapshot<TState, TValue>(
  getState: () => TState,
  selector: Selector<TState, TValue>,
  equality: Equality<TValue>,
) {
  let hasSnapshot = false;
  let snapshot: TValue;

  return () => {
    const selected = selector(getState());

    if (!hasSnapshot || !equality(snapshot, selected)) {
      snapshot = selected;
      hasSnapshot = true;
    }

    return snapshot;
  };
}
