import { bindAsyncActions } from './async/actions';
import { createAsyncStatusRegistry } from './async/status';
import { createActionContext, createActions } from './core/actions';
import { readSelector } from './core/selector';
import { createStateContainer } from './core/state';
import { useSelector } from './react/hooks';
import { createStoreProvider } from './react/provider';
import { createScopeRegistry } from './scope/registry';
import type {
  AsyncActionMap,
  AsyncResult,
  Equality,
  ListenerTypeAlias,
  Selector,
  SelectorMap,
  Store,
  StoreDefinition,
} from './types';

/**
 * Internal builder shared by both the public {@link createStore} and the
 * scope registry. Wires every subsystem (state container, action context,
 * actions, async actions + status, selectors, React provider, scope
 * registry) onto a single {@link Store} object.
 *
 * When called with a non-null `Listener`, the resulting store represents a
 * scoped instance and its `name` becomes `"<base>:<Listener>"`.
 */
function createStoreInstance<
  TState,
  TActions extends object,
  TSelectors extends SelectorMap<TState>,
  TAsyncActions extends AsyncActionMap<TState>,
>(
  name: string,
  definition: StoreDefinition<TState, TActions, TSelectors, TAsyncActions>,
  Listener: ListenerTypeAlias | null = null,
): Store<TState, TActions, TSelectors, TAsyncActions> {
  const storeName = Listener === null ? name : `${name}:${String(Listener)}`;
  const container = createStateContainer(definition.state);
  const actionContext = createActionContext(container);
  const actions = createActions(definition.actions, actionContext);
  const asyncStatuses = createAsyncStatusRegistry();
  const asyncActions = bindAsyncActions(
    definition.asyncActions,
    actionContext,
    asyncStatuses,
    Listener,
  );

  let store: Store<TState, TActions, TSelectors, TAsyncActions>;

  // Lazy registry of scoped children. Keyed by scope id; same id always
  // returns the same instance (memoized below in createScopeRegistry).
  const scopedStores = createScopeRegistry<TState, TActions, TSelectors, TAsyncActions>(
    (nextListener) => createStoreInstance(name, definition, nextListener),
  );

  // The Provider/useStoreInstance pair lets a subtree override which store
  // the React hooks below resolve to (e.g. a scoped or local instance).
  const { Provider, useStoreInstance } = createStoreProvider(() => store);

  /**
   * Implementation backing `store.use()`. Reads the contextual store (via
   * `useStoreInstance`) so the same call site works whether the consumer is
   * inside a `store.Provider` (scoped/local) or not (global).
   */
  const useFromStore = <TValue = TState>(
    selector?: Selector<TState, TValue>,
    equality?: Equality<TValue>,
  ) => {
    const resolvedStore = useStoreInstance();

    return useSelector(
      resolvedStore.getState,
      resolvedStore.subscribe,
      selector,
      equality,
    );
  };

  store = {
    name: storeName,
    actions,
    asyncActions,
    get: container.getState,
    getState: container.getState,
    set: container.setState,
    setState: container.setState,
    patch: container.patchState,
    patchState: container.patchState,
    reset: container.resetState,
    subscribe: container.subscribe,
    select(selectorName, ...args) {
      return readSelector(
        storeName,
        definition.selectors,
        container.getState(),
        selectorName,
        ...args,
      );
    },
    use: useFromStore as Store<TState, TActions, TSelectors, TAsyncActions>['use'],
    useActions() {
      return useStoreInstance().actions;
    },
    useSelector(selectoName, ...args) {
      const resolvedStore = useStoreInstance();

      return useSelector(resolvedStore.getState, resolvedStore.subscribe, () =>
        resolvedStore.select(selectoName, ...args),
      );
    },
    useAsyncAction(actionName) {
      return useStoreInstance().asyncActions[actionName];
    },
    usePending(actionName) {
      // Two read modes: a specific action's `pending` flag, or "is anything
      // running right now?" when no name is passed.
      return useSelector(
        () => asyncStatuses.getStatus(String(actionName ?? '*')),
        asyncStatuses.subscribe,
        () =>
          actionName === undefined
            ? asyncStatuses.getAnyPending()
            : asyncStatuses.getStatus(String(actionName)).pending,
      );
    },
    useError(actionName) {
      return useSelector(
        () => asyncStatuses.getStatus(String(actionName)),
        asyncStatuses.subscribe,
        () => asyncStatuses.getStatus(String(actionName)).error,
      );
    },
    useResult(actionName) {
      return useSelector(
        () => asyncStatuses.getStatus(String(actionName)),
        asyncStatuses.subscribe,
        () =>
          asyncStatuses.getStatus(String(actionName)).result as
            | AsyncResult<TAsyncActions, typeof actionName>
            | undefined,
      );
    },
    clearError(actionName) {
      asyncStatuses.clearError(actionName ? String(actionName) : undefined);
    },
    scope(ListenerValue) {
      return scopedStores.get(ListenerValue);
    },
    Provider(props) {
      return Provider({
        ...props,
        store: props.store ?? store,
      });
    },
  };

  return store;
}

/**
 * Creates a typed store from a {@link StoreDefinition}.
 *
 * The returned {@link Store} can be consumed in three ways:
 *
 * - **Globally** — use the singleton returned by `createStore` directly.
 * - **Scoped** — call `store.scope(id)` to get an isolated instance built
 *   from the same definition (one cart per shop, one form per document, …).
 * - **Locally** — wrap the definition in
 *   {@link import('./react/useLocalStore').useLocalStore} to get a fresh
 *   per-component instance.
 *
 * @param name Display name of the store. Used to label scoped children
 *   (`"<name>:<scopeId>"`) and to format error messages.
 * @param definition The state initializer plus optional `actions`,
 *   `selectors`, and `asyncActions` blocks.
 *
 * @example
 * ```ts
 * import { createStore } from '@runilib/nimbo';
 *
 * const counter = createStore('counter', {
 *   state: () => ({ count: 0 }),
 *   actions: ({ patch }) => ({
 *     increment() { patch((s) => ({ count: s.count + 1 })); },
 *   }),
 *   selectors: {
 *     isEmpty: (state) => state.count === 0,
 *   },
 * });
 *
 * // Outside React:
 * counter.actions.increment();
 * counter.getState();         // { count: 1 }
 * counter.select('isEmpty');  // false
 *
 * // Inside React:
 * const count = counter.use((s) => s.count);
 * const { increment } = counter.useActions();
 * ```
 */
export function createStore<
  TState,
  TActions extends object = object,
  TSelectors extends SelectorMap<TState> = SelectorMap<TState>,
  TAsyncActions extends AsyncActionMap<TState> = AsyncActionMap<TState>,
>(
  name: string,
  definition: StoreDefinition<TState, TActions, TSelectors, TAsyncActions>,
): Store<TState, TActions, TSelectors, TAsyncActions> {
  return createStoreInstance(name, definition);
}
