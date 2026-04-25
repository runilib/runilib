import { useRef, useSyncExternalStore } from 'react';

import type { Equality, Selector } from '../types';

const identity = <TValue>(value: TValue) => value;

export function useSelector<TState, TValue = TState>(
  getState: () => TState,
  subscribe: (listener: () => void) => () => void,
  selector?: Selector<TState, TValue>,
  equality: Equality<TValue> = Object.is,
) {
  const selectorRef = useRef(selector ?? (identity as Selector<TState, TValue>));
  const equalityRef = useRef(equality);
  const snapshotRef = useRef<() => TValue>();

  selectorRef.current = selector ?? (identity as Selector<TState, TValue>);
  equalityRef.current = equality;

  snapshotRef.current ??= createSelectorSnapshot(
    getState,
    (currentState) => selectorRef.current(currentState),
    (left, right) => equalityRef.current(left, right),
  );

  return useSyncExternalStore(subscribe, snapshotRef.current, snapshotRef.current);
}

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
