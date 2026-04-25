import type { ActionContext, ActionFactory } from '../types';
import type { StateContainer } from './state';

export function createActionContext<TState>(
  container: StateContainer<TState>,
): ActionContext<TState> {
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
  factory: ActionFactory<TState, TActions> | undefined,
  context: ActionContext<TState>,
): TActions {
  return factory?.(context) ?? ({} as TActions);
}
