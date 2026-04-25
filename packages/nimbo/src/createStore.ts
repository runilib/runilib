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

  const scopedStores = createScopeRegistry<TState, TActions, TSelectors, TAsyncActions>(
    (nextListener) => createStoreInstance(name, definition, nextListener),
  );

  const { Provider, useStoreInstance } = createStoreProvider(() => store);

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
    selector(selectorName, ...args) {
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
        resolvedStore.selector(selectoName, ...args),
      );
    },
    useAsyncAction(actionName) {
      return useStoreInstance().asyncActions[actionName];
    },
    usePending(actionName) {
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
