/**
 *
 * Tiny typed state modules for React and React Native.
 *
 * @example
 * import { createStore } from '@runilib/nimbo';
 */

export {
  type AnyStore,
  type ComposedState,
  type ComposedStore,
  composeStores,
  type StoreMap,
} from './compose/composeStores';
export { computed } from './core/selector';
export { createStore } from './createStore';
export { useLocalStore } from './react/useLocalStore';
export type {
  ActionContext,
  ActionFactory,
  AsyncActionContext,
  AsyncActionDefinition,
  AsyncActionMap,
  AsyncActionObject,
  AsyncActionRun,
  AsyncResult,
  AsyncStatus,
  BoundAsyncActions,
  ComputedSelector,
  ComputedSelectorOptions,
  Equality,
  Listener,
  ListenerTypeAlias,
  PatchState,
  ProviderProps,
  Selector,
  SelectorArgs,
  SelectorMap,
  SelectorResult,
  SelectorRun,
  SetState,
  StateInitializer,
  StateUpdater,
  Store,
  StoreDefinition,
} from './types';
