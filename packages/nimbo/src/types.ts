import type { ReactNode } from 'react';

/**
 * Callback fired by a store every time its state changes.
 *
 * Listeners receive no arguments — they should re-read state via
 * {@link Store.getState} (or via React's `useSyncExternalStore` snapshot
 * machinery) when they need the new value.
 */
export type Listener = () => void;

/**
 * Identifier accepted by {@link Store.scope}. Each unique value points to a
 * separate state instance built from the same store definition.
 *
 * Typical real-world identifiers: `shopId`, `projectId`, `tabId`,
 * `documentId`, `conversationId`.
 */
export type ListenerTypeAlias = string | number;

/**
 * Concurrency policy applied to an async action when it is invoked while a
 * previous run of the same action is still in flight.
 *
 * - `parallel` (default) — every call runs independently.
 * - `takeLatest` — aborts the previous run via its `AbortSignal` before
 *   starting the new one. Use for searches, autosave, anything where only
 *   the freshest call matters.
 * - `takeFirst` — ignores the new call and returns the in-flight promise.
 *   Use for idempotent fetches you do not want to duplicate.
 */
export type AsyncPolicy = 'parallel' | 'takeLatest' | 'takeFirst';

/**
 * Initial state, either as a value or as a factory invoked once at store
 * creation time. Use the factory form when the initial value is expensive to
 * build or when you want a fresh deep copy on every store instance (scoped
 * stores, local stores, tests).
 */
export type StateInitializer<TState> = TState | (() => TState);

/**
 * Argument accepted by {@link SetState}: either the next state value or a
 * function that derives it from the current one.
 */
export type StateUpdater<TState> = TState | ((state: TState) => TState);

/**
 * Pure read function applied to a state snapshot. Selectors should be cheap
 * and referentially stable for the same input — React subscriptions rely on
 * `Object.is` equality (or a custom equality) to skip re-renders.
 */
export type Selector<TState, TValue> = (state: TState) => TValue;

/**
 * Comparator used to decide whether two selector results are equivalent and
 * therefore should not trigger a re-render. Defaults to `Object.is`.
 */
export type Equality<TValue> = (left: TValue, right: TValue) => boolean;

/**
 * Replaces the entire state. Prefer {@link PatchState} when you only need to
 * change a few fields.
 */
export type SetState<TState> = (updater: StateUpdater<TState>) => void;

/**
 * Shallow-merges the given partial into state. Equivalent to
 * `setState((s) => ({ ...s, ...patch }))` but spelled more naturally.
 */
export type PatchState<TState> = (
  updater: Partial<TState> | ((state: TState) => Partial<TState>),
) => void;

/**
 * The toolbox passed to every action body. It exposes both short (`get`,
 * `set`, `patch`) and explicit (`getState`, `setState`, `patchState`) names
 * so codebases can pick whichever convention they prefer.
 *
 * `reset` reverts the store to the value produced by its initializer at
 * creation time.
 */
export type ActionContext<TState> = {
  get: () => TState;
  getState: () => TState;
  set: SetState<TState>;
  setState: SetState<TState>;
  patch: PatchState<TState>;
  patchState: PatchState<TState>;
  reset: () => void;
};

/**
 * Function that produces the actions object from an {@link ActionContext}.
 * The returned object becomes `store.actions` and `store.useActions()`.
 */
export type ActionFactory<TState, TActions> = (
  context: ActionContext<TState>,
) => TActions;

/**
 * Body of a selector — a pure function `(state, ...args) => result`.
 * Parameterized selectors take their business arguments after `state`.
 */
export type SelectorRun<
  TState,
  TArgs extends unknown[] = unknown[],
  TResult = unknown,
> = (state: TState, ...args: TArgs) => TResult;

/**
 * Definition shape for the `selectors` block of a store. Each entry is a
 * {@link SelectorRun} (or a {@link ComputedSelector} produced by
 * {@link import('./core/selector').computed}).
 */
export type SelectorMap<TState> = Record<
  string,
  // biome-ignore lint/suspicious/noExplicitAny: selector arguments and results must remain inferable from user functions.
  SelectorRun<TState, any[], any>
>;

/**
 * Extracts the business-argument tuple of a selector (everything after
 * `state`). Used to type the variadic call sites of `select` and
 * `useSelector`.
 */
export type SelectorArgs<TSelector> = TSelector extends (
  state: never,
  ...args: infer TArgs
) => unknown
  ? TArgs
  : never;

/**
 * Extracts the return type of a selector. Used to type the result of
 * `select` and `useSelector` from the selector definition.
 */
export type SelectorResult<TSelector> = TSelector extends (
  state: never,
  ...args: unknown[]
) => infer TResult
  ? TResult
  : never;

/**
 * Configuration for {@link ComputedSelector}.
 *
 * `key` controls the cache key for parameterized computed selectors. When
 * omitted, the args are stringified with `JSON.stringify`. Provide your own
 * if your args are not trivially serializable or if you want a tighter key.
 */
export type ComputedSelectorOptions<TArgs extends unknown[]> = {
  key?: (...args: TArgs) => string;
};

/**
 * A memoized selector. The branding fields (`__nimbo*`) let the store
 * runtime detect computed selectors and route their reads through the
 * memoization cache. Build one with
 * {@link import('./core/selector').computed}.
 */
export type ComputedSelector<
  TState,
  TArgs extends unknown[] = unknown[],
  TResult = unknown,
> = SelectorRun<TState, TArgs, TResult> & {
  readonly __nimboComputed: true;
  readonly __nimboComputedOptions: ComputedSelectorOptions<TArgs>;
};

/**
 * Extends {@link ActionContext} with the metadata an async action body needs:
 * a cancellation `signal`, the `scope` id (`null` for the global instance),
 * and the action's own `name`.
 */
export type AsyncActionContext<TState> = ActionContext<TState> & {
  signal: AbortSignal;
  scope: ListenerTypeAlias | null;
  action: string;
};

/**
 * Body of an async action. Receives the {@link AsyncActionContext} and the
 * caller's arguments, returns a promise.
 */
export type AsyncActionRun<
  TState,
  TArgs extends unknown[] = unknown[],
  TResult = unknown,
> = (context: AsyncActionContext<TState>, ...args: TArgs) => Promise<TResult>;

/**
 * Object form of an async action — lets you attach a {@link AsyncPolicy}
 * alongside the body. Use the bare function form when the default
 * `parallel` policy is fine.
 */
export type AsyncActionObject<
  TState,
  TArgs extends unknown[] = unknown[],
  TResult = unknown,
> = {
  policy?: AsyncPolicy;
  run: AsyncActionRun<TState, TArgs, TResult>;
};

/**
 * Either form of an async action definition — bare function or
 * `{ policy, run }`. Both are accepted in the `asyncActions` block of a
 * store definition.
 */
export type AsyncActionDefinition<
  TState,
  TArgs extends unknown[] = unknown[],
  TResult = unknown,
> = AsyncActionRun<TState, TArgs, TResult> | AsyncActionObject<TState, TArgs, TResult>;

/**
 * Definition shape for the `asyncActions` block of a store.
 */
export type AsyncActionMap<TState> = Record<
  string,
  // biome-ignore lint/suspicious/noExplicitAny: async action arguments must remain inferable from user functions.
  AsyncActionDefinition<TState, any[], any>
>;

/**
 * The runtime view of an async-action map: each entry becomes a function
 * the consumer can call directly with the same args as the original `run`,
 * returning the same promise. Internally, every call goes through the
 * policy/abort/status plumbing.
 */
export type BoundAsyncActions<TAsyncActions> = {
  [Key in keyof TAsyncActions]: TAsyncActions[Key] extends {
    run: (context: infer _Context, ...args: infer TArgs) => Promise<infer TResult>;
  }
    ? (...args: TArgs) => Promise<TResult>
    : TAsyncActions[Key] extends (
          context: infer _Context,
          ...args: infer TArgs
        ) => Promise<infer TResult>
      ? (...args: TArgs) => Promise<TResult>
      : never;
};

/**
 * Extracts the resolved value type of a single async action. Used to type
 * `store.useResult(name)`.
 */
export type AsyncResult<
  TAsyncActions,
  Key extends keyof TAsyncActions,
> = TAsyncActions[Key] extends {
  run: (context: infer _Context, ...args: infer _Args) => Promise<infer TResult>;
}
  ? TResult
  : TAsyncActions[Key] extends (
        context: infer _Context,
        ...args: infer _Args
      ) => Promise<infer TResult>
    ? TResult
    : never;

/**
 * Live status of one async action — exposed by `store.usePending`,
 * `store.useError`, `store.useResult`. The runtime keeps one entry per
 * action name and emits to subscribers whenever any of these fields change.
 */
export type AsyncStatus = {
  pending: boolean;
  error: unknown | null;
  result: unknown;
};

/**
 * The full definition object accepted by {@link import('./createStore').createStore}.
 *
 * Only `state` is required. Each optional block contributes a different
 * surface to the resulting store:
 * - `actions` → `store.actions` + `store.useActions()`
 * - `selectors` → `store.select()` + `store.useSelector()`
 * - `asyncActions` → `store.asyncActions` + the `usePending` / `useError` /
 *   `useResult` status hooks
 */
export type StoreDefinition<
  TState,
  TActions,
  TSelectors extends SelectorMap<TState>,
  TAsyncActions extends AsyncActionMap<TState>,
> = {
  state: StateInitializer<TState>;
  actions?: ActionFactory<TState, TActions>;
  selectors?: TSelectors;
  asyncActions?: TAsyncActions;
};

/**
 * Props of `store.Provider`. Pass an explicit `store` instance to swap the
 * one that descendant hooks resolve through context — typically used for
 * scoped or local instances inside a subtree.
 */
export type ProviderProps<
  TState,
  TActions,
  TSelectors extends SelectorMap<TState>,
  TAsyncActions,
> = {
  children: ReactNode;
  store?: Store<TState, TActions, TSelectors, TAsyncActions>;
};

/**
 * The runtime instance returned by
 * {@link import('./createStore').createStore}.
 *
 * Outside of React, use the imperative members (`getState`, `setState`,
 * `patch`, `actions`, `select`, `subscribe`). Inside React, use the
 * subscription hooks (`use`, `useActions`, `useSelector`, plus the async
 * status hooks).
 *
 * Both forms are first-class — the imperative API is not a "fallback"; it is
 * the same store, just consumed without subscribing.
 */
export type Store<
  TState,
  TActions,
  TSelectors extends SelectorMap<TState>,
  TAsyncActions,
> = {
  /** Display name. For scoped instances it is `"<base>:<scopeId>"`. */
  readonly name: string;

  /** The actions object built from the definition's `actions` factory. */
  readonly actions: TActions;

  /**
   * Async actions wrapped with the policy / abort / status pipeline. Calling
   * one returns the same promise as the underlying `run`.
   */
  readonly asyncActions: BoundAsyncActions<TAsyncActions>;

  /** Imperative read. Alias of {@link Store.getState}. */
  get: () => TState;

  /** Imperative read of the current state snapshot. */
  getState: () => TState;

  /** Imperative replace. Alias of {@link Store.setState}. */
  set: SetState<TState>;

  /** Imperative replace of the entire state. */
  setState: SetState<TState>;

  /** Imperative shallow merge. Alias of {@link Store.patchState}. */
  patch: PatchState<TState>;

  /** Imperative shallow merge into the current state. */
  patchState: PatchState<TState>;

  /** Reverts the store to its initial value. */
  reset: () => void;

  /**
   * Subscribes to state changes. Returns an unsubscribe function. Listeners
   * receive no arguments — re-read via {@link Store.getState}.
   */
  subscribe: (listener: Listener) => () => void;

  /**
   * Imperative selector read. Equivalent to looking up the function in the
   * `selectors` block and invoking it with `state` followed by your args.
   * Computed selectors are routed through the memoization cache.
   */
  select: <Key extends keyof TSelectors>(
    name: Key,
    ...args: SelectorArgs<TSelectors[Key]>
  ) => SelectorResult<TSelectors[Key]>;

  /**
   * React hook subscribing the calling component to state changes.
   * - Without arguments → returns the full state.
   * - With a selector → returns the selected slice and only re-renders when
   *   the slice changes (per `equality`, default `Object.is`).
   */
  use: {
    (): TState;
    <TValue>(selector: Selector<TState, TValue>, equality?: Equality<TValue>): TValue;
  };

  /** React hook returning the (referentially stable) actions object. */
  useActions: () => TActions;

  /**
   * React hook reading a named selector. Re-renders the component only when
   * the result changes. For computed selectors, the memoization cache is
   * keyed by `state` reference and the (optional) `key(...args)` function.
   */
  useSelector: <Key extends keyof TSelectors>(
    name: Key,
    ...args: SelectorArgs<TSelectors[Key]>
  ) => SelectorResult<TSelectors[Key]>;

  /** React hook returning a single bound async action. */
  useAsyncAction: <Key extends keyof TAsyncActions>(
    name: Key,
  ) => BoundAsyncActions<TAsyncActions>[Key];

  /**
   * React hook returning whether a given async action (or, when called
   * without a name, any of them) is currently in flight.
   */
  usePending: (name?: keyof TAsyncActions) => boolean;

  /** React hook returning the last error thrown by a named async action. */
  useError: <Key extends keyof TAsyncActions>(name: Key) => unknown | null;

  /** React hook returning the last resolved value of a named async action. */
  useResult: <Key extends keyof TAsyncActions>(
    name: Key,
  ) => AsyncResult<TAsyncActions, Key> | undefined;

  /**
   * Clears the error of a named async action, or of every action when no
   * name is provided.
   */
  clearError: (name?: keyof TAsyncActions) => void;

  /**
   * Returns a separate store instance built from the same definition,
   * keyed by `scopeId`. Two calls with the same id return the same instance.
   *
   * Use this when one logical model needs many isolated state instances —
   * one cart per shop, one form per document, one timer per workspace.
   */
  scope: (
    Listener: ListenerTypeAlias,
  ) => Store<TState, TActions, TSelectors, TAsyncActions>;

  /**
   * React context provider. Components rendered inside it that read this
   * store via the React hooks (`use`, `useSelector`, etc.) will resolve to
   * the `store` passed in props (defaulting to the current instance).
   */
  Provider: (
    props: ProviderProps<TState, TActions, TSelectors, TAsyncActions>,
  ) => ReactNode;
};
