import { useRef, useSyncExternalStore } from 'react';

import type { NimboEquality, NimboSelector } from '../types';

const identity = <TValue>(value: TValue) => value;

export function useNimboSelector<TState, TValue = TState>(
  getState: () => TState,
  subscribe: (listener: () => void) => () => void,
  selector?: NimboSelector<TState, TValue>,
  equality: NimboEquality<TValue> = Object.is,
) {
  const selectorRef = useRef(selector ?? (identity as NimboSelector<TState, TValue>));
  const equalityRef = useRef(equality);
  const snapshotRef = useRef<() => TValue>();

  selectorRef.current = selector ?? (identity as NimboSelector<TState, TValue>);
  equalityRef.current = equality;

  if (!snapshotRef.current) {
    snapshotRef.current = createSelectorSnapshot(
      getState,
      (currentState) => selectorRef.current(currentState),
      (left, right) => equalityRef.current(left, right),
    );
  }

  return useSyncExternalStore(subscribe, snapshotRef.current, snapshotRef.current);
}

function createSelectorSnapshot<TState, TValue>(
  getState: () => TState,
  selector: NimboSelector<TState, TValue>,
  equality: NimboEquality<TValue>,
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
