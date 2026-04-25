import { bindAsyncActions } from './async/actions';
import { createAsyncStatusRegistry } from './async/status';
import { createActionContext, createActions } from './core/actions';
import { readSelector } from './core/selector';
import { createStateContainer } from './core/state';
import { useNimboSelector } from './react/hooks';
import { createStoreProvider } from './react/provider';
import { createScopeRegistry } from './scope/registry';
import type {
  NimboAsyncActionMap,
  NimboAsyncResult,
  NimboEquality,
  NimboScopeId,
  NimboSelector,
  NimboSelectorMap,
  NimboStore,
  NimboStoreDefinition,
} from './types';

function createStoreInstance<
  TState,
  TActions extends object,
  TSelectors extends NimboSelectorMap<TState>,
  TAsyncActions extends NimboAsyncActionMap<TState>,
>(
  name: string,
  definition: NimboStoreDefinition<TState, TActions, TSelectors, TAsyncActions>,
  scopeId: NimboScopeId | null = null,
): NimboStore<TState, TActions, TSelectors, TAsyncActions> {
  const storeName = scopeId === null ? name : `${name}:${String(scopeId)}`;
  const container = createStateContainer(definition.state);
  const actionContext = createActionContext(container);
  const actions = createActions(definition.actions, actionContext);
  const asyncStatuses = createAsyncStatusRegistry();
  const asyncActions = bindAsyncActions(
    definition.asyncActions,
    actionContext,
    asyncStatuses,
    scopeId,
  );

  let store: NimboStore<TState, TActions, TSelectors, TAsyncActions>;

  const scopedStores = createScopeRegistry<TState, TActions, TSelectors, TAsyncActions>(
    (nextScopeId) => createStoreInstance(name, definition, nextScopeId),
  );

  const { Provider, useStoreInstance } = createStoreProvider(() => store);

  const useFromStore = <TValue = TState>(
    selector?: NimboSelector<TState, TValue>,
    equality?: NimboEquality<TValue>,
  ) => {
    const resolvedStore = useStoreInstance();

    return useNimboSelector(
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
    use: useFromStore as NimboStore<TState, TActions, TSelectors, TAsyncActions>['use'],
    useActions() {
      return useStoreInstance().actions;
    },
    useSelector(selectoName, ...args) {
      const resolvedStore = useStoreInstance();

      return useNimboSelector(resolvedStore.getState, resolvedStore.subscribe, () =>
        resolvedStore.selector(selectoName, ...args),
      );
    },
    useAsyncAction(actionName) {
      return useStoreInstance().asyncActions[actionName];
    },
    usePending(actionName) {
      return useNimboSelector(
        () => asyncStatuses.getStatus(String(actionName ?? '*')),
        asyncStatuses.subscribe,
        () =>
          actionName === undefined
            ? asyncStatuses.getAnyPending()
            : asyncStatuses.getStatus(String(actionName)).pending,
      );
    },
    useError(actionName) {
      return useNimboSelector(
        () => asyncStatuses.getStatus(String(actionName)),
        asyncStatuses.subscribe,
        () => asyncStatuses.getStatus(String(actionName)).error,
      );
    },
    useResult(actionName) {
      return useNimboSelector(
        () => asyncStatuses.getStatus(String(actionName)),
        asyncStatuses.subscribe,
        () =>
          asyncStatuses.getStatus(String(actionName)).result as
            | NimboAsyncResult<TAsyncActions, typeof actionName>
            | undefined,
      );
    },
    clearError(actionName) {
      asyncStatuses.clearError(actionName ? String(actionName) : undefined);
    },
    scope(scopeIdValue) {
      return scopedStores.get(scopeIdValue);
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
  TSelectors extends NimboSelectorMap<TState> = NimboSelectorMap<TState>,
  TAsyncActions extends NimboAsyncActionMap<TState> = NimboAsyncActionMap<TState>,
>(
  name: string,
  definition: NimboStoreDefinition<TState, TActions, TSelectors, TAsyncActions>,
): NimboStore<TState, TActions, TSelectors, TAsyncActions> {
  return createStoreInstance(name, definition);
}
