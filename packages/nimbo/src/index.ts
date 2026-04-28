/**
 * Nimbo — tiny typed state modules for React and React Native.
 *
 * One body, many tentacles. The same store definition can be used as a
 * global singleton, instantiated locally per component with
 * {@link useLocalStore}, or split into isolated state instances with
 * `store.scope(id)`. {@link composeStores} aggregates several stores into a
 * read-only composite when a project wants a Redux/MobX-style root view
 * without giving up the per-module mental model.
 *
 * @example Global singleton
 * ```ts
 * import { createStore } from '@runilib/nimbo';
 *
 * export const counter = createStore('counter', {
 *   state: () => ({ count: 0 }),
 *   actions: ({ patch }) => ({
 *     increment() { patch((s) => ({ count: s.count + 1 })); },
 *   }),
 * });
 * ```
 *
 * @example Scoped instances from the same definition
 * ```ts
 * const nikeCart = cartStore.scope('nike');
 * const appleCart = cartStore.scope('apple');
 * ```
 *
 * @example Composed read view
 * ```ts
 * import { composeStores } from '@runilib/nimbo';
 *
 * const root = composeStores({ user: userStore, cart: cartStore });
 * const summary = root.use((state) => `${state.user.name} · ${state.cart.items.length}`);
 * ```
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
  EffectCleanup,
  EffectContext,
  EffectFactory,
  EffectMap,
  EffectResult,
  EffectRun,
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
  WatchCallback,
  WatchOptions,
} from './types';
