import type {
  Listener,
  PatchState,
  SetState,
  StateInitializer,
  StateUpdater,
} from '../types';

/**
 * The persistent state holder backing every {@link import('../types').Store}.
 *
 * Owns:
 * - the live state value (mutated by `setState`/`patchState`/`resetState`)
 * - the listener set fired on every real change
 * - the initial-state snapshot used by `resetState`
 *
 * `Object.is` is used to short-circuit no-op updates: if the next state is
 * referentially identical to the current one, listeners are not notified.
 */
export type StateContainer<TState> = {
  getState: () => TState;
  setState: SetState<TState>;
  patchState: PatchState<TState>;
  resetState: () => void;
  subscribe: (listener: Listener) => () => void;
};

/**
 * Builds a fresh {@link StateContainer} from an initializer (value or
 * factory). The initializer is resolved once; the resulting value is also
 * cloned and kept aside so `resetState` can restore it without retaining a
 * reference to user-mutable input.
 */
export function createStateContainer<TState>(
  initializer: StateInitializer<TState>,
): StateContainer<TState> {
  let state = resolveInitialState(initializer);
  // Cloned snapshot so a later `resetState` cannot be polluted by external
  // mutations to the original value.
  const initialState = cloneState(state);
  const listeners = new Set<Listener>();

  const emit = () => {
    for (const listener of listeners) {
      listener();
    }
  };

  const getState = () => state;

  const setState = (updater: StateUpdater<TState>) => {
    const nextState = reduceState(state, updater);

    // No-op guard: identical reference → no listeners fired. This is what
    // lets composeStores cache its merged snapshot safely (see
    // useSyncExternalStore semantics).
    if (Object.is(state, nextState)) {
      return;
    }

    state = nextState;
    emit();
  };

  const patchState: PatchState<TState> = (updater) => {
    const patch =
      typeof updater === 'function'
        ? (updater as (currentState: TState) => Partial<TState>)(state)
        : updater;

    setState((currentState) => ({ ...(currentState as object), ...patch }) as TState);
  };

  const resetState = () => {
    setState(cloneState(initialState));
  };

  const subscribe = (listener: Listener) => {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  };

  return {
    getState,
    setState,
    patchState,
    resetState,
    subscribe,
  };
}

/**
 * Resolves a {@link StateInitializer} to a concrete value. Factory form is
 * called once; value form is deep-cloned so the store does not share its
 * private state reference with whatever the caller passed in.
 */
export function resolveInitialState<TState>(state: StateInitializer<TState>): TState {
  if (typeof state === 'function') {
    return (state as () => TState)();
  }

  return cloneState(state);
}

/**
 * Best-effort deep clone used by {@link resolveInitialState} and
 * `resetState`. Uses `structuredClone` when available (modern runtimes),
 * falls back to a shallow copy for arrays and plain objects, and returns
 * primitives untouched. Not a general-purpose deep clone — it is only
 * meant to defend against the most common reset-state aliasing bugs.
 */
export function cloneState<TState>(state: TState): TState {
  if (typeof globalThis.structuredClone === 'function') {
    return globalThis.structuredClone(state);
  }

  if (Array.isArray(state)) {
    return [...state] as TState;
  }

  if (state && typeof state === 'object') {
    return { ...state };
  }

  return state;
}

/** Applies a {@link StateUpdater} (value or function) against the current state. */
function reduceState<TState>(
  currentState: TState,
  updater: StateUpdater<TState>,
): TState {
  return typeof updater === 'function'
    ? (updater as (state: TState) => TState)(currentState)
    : updater;
}
