import type { ActionContext, ActionFactory } from '../types';
import type { StateContainer } from './state';

/**
 * Adapts a {@link StateContainer} into the {@link ActionContext} exposed to
 * action bodies. Both the short (`get`/`set`/`patch`) and explicit
 * (`getState`/`setState`/`patchState`) names point to the same functions —
 * teams can pick whichever convention they prefer without ambiguity.
 */
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

/**
 * Invokes the user-provided {@link ActionFactory} with the bound
 * {@link ActionContext} and returns the resulting actions object.
 *
 * Stores without an `actions` block still get a typed empty object so
 * `store.actions` and `store.useActions()` remain safe to destructure.
 */
export function createActions<TState, TActions>(
  factory: ActionFactory<TState, TActions> | undefined,
  context: ActionContext<TState>,
): TActions {
  return factory?.(context) ?? ({} as TActions);
}
