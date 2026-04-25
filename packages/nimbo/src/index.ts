/**
 * Nimbo
 * Tiny typed state modules for React and React Native.
 *
 * @example
 * import { createStore } from '@runilib/nimbo';
 */

export {
  composeStores,
  type NimboAnyStore,
  type NimboComposedState,
  type NimboComposedStore,
  type NimboStoreMap,
} from './compose/composeStores';
export { createStore } from './createStore';
export { useLocalStore } from './react/useLocalStore';
export type {
  NimboActionContext,
  NimboActionFactory,
  NimboAsyncActionContext,
  NimboAsyncActionDefinition,
  NimboAsyncActionMap,
  NimboAsyncActionObject,
  NimboAsyncActionRun,
  NimboAsyncPolicy,
  NimboAsyncResult,
  NimboAsyncStatus,
  NimboBoundAsyncActions,
  NimboEquality,
  NimboListener,
  NimboPatchState,
  NimboProviderProps,
  NimboScopeId,
  NimboSelector,
  NimboSetState,
  NimboStateInitializer,
  NimboStateUpdater,
  NimboStore,
  NimboStoreDefinition,
  NimboViewFactory,
} from './types';
