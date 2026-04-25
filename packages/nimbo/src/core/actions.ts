import type { NimboActionContext, NimboActionFactory } from '../types';
import type { NimboStateContainer } from './state';

export function createActionContext<TState>(
  container: NimboStateContainer<TState>,
): NimboActionContext<TState> {
  return {
    get: container.getState,
    getState: container.getState,
    set: container.setState,
    setState: container.setState,
    patch: container.patchState,
    patchState: container.patchState,
    reset: container.resetState,
  };
}

export function createActions<TState, TActions>(
  factory: NimboActionFactory<TState, TActions> | undefined,
  context: NimboActionContext<TState>,
): TActions {
  return factory?.(context) ?? ({} as TActions);
}
