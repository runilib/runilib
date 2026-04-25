import type {
  NimboListener,
  NimboPatchState,
  NimboSetState,
  NimboStateInitializer,
  NimboStateUpdater,
} from '../types';

export type NimboStateContainer<TState> = {
  getState: () => TState;
  setState: NimboSetState<TState>;
  patchState: NimboPatchState<TState>;
  resetState: () => void;
  subscribe: (listener: NimboListener) => () => void;
};

export function createStateContainer<TState>(
  initializer: NimboStateInitializer<TState>,
): NimboStateContainer<TState> {
  let state = resolveInitialState(initializer);
  const initialState = cloneState(state);
  const listeners = new Set<NimboListener>();

  const emit = () => {
    for (const listener of listeners) {
      listener();
    }
  };

  const getState = () => state;

  const setState = (updater: NimboStateUpdater<TState>) => {
    const nextState = reduceState(state, updater);

    if (Object.is(state, nextState)) {
      return;
    }

    state = nextState;
    emit();
  };

  const patchState: NimboPatchState<TState> = (updater) => {
    const patch =
      typeof updater === 'function'
        ? (updater as (currentState: TState) => Partial<TState>)(state)
        : updater;

    setState((currentState) => ({ ...(currentState as object), ...patch }) as TState);
  };

  const resetState = () => {
    setState(cloneState(initialState));
  };

  const subscribe = (listener: NimboListener) => {
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

export function resolveInitialState<TState>(
  state: NimboStateInitializer<TState>,
): TState {
  if (typeof state === 'function') {
    return (state as () => TState)();
  }

  return cloneState(state);
}

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

function reduceState<TState>(
  currentState: TState,
  updater: NimboStateUpdater<TState>,
): TState {
  return typeof updater === 'function'
    ? (updater as (state: TState) => TState)(currentState)
    : updater;
}
