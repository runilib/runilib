import type { ReactNode } from 'react';

export type NimboListener = () => void;

export type NimboScopeId = string | number;

export type NimboAsyncPolicy = 'parallel' | 'takeLatest' | 'takeFirst';

export type NimboStateInitializer<TState> = TState | (() => TState);

export type NimboStateUpdater<TState> = TState | ((state: TState) => TState);

export type NimboSelector<TState, TValue> = (state: TState) => TValue;

export type NimboEquality<TValue> = (left: TValue, right: TValue) => boolean;

export type NimboSetState<TState> = (updater: NimboStateUpdater<TState>) => void;

export type NimboPatchState<TState> = (
  updater: Partial<TState> | ((state: TState) => Partial<TState>),
) => void;

export type NimboActionContext<TState> = {
  get: () => TState;
  getState: () => TState;
  set: NimboSetState<TState>;
  setState: NimboSetState<TState>;
  patch: NimboPatchState<TState>;
  patchState: NimboPatchState<TState>;
  reset: () => void;
};

export type NimboActionFactory<TState, TActions> = (
  context: NimboActionContext<TState>,
) => TActions;

export type NimboSelectorRun<
  TState,
  TArgs extends unknown[] = unknown[],
  TResult = unknown,
> = (state: TState, ...args: TArgs) => TResult;

export type NimboSelectorMap<TState> = Record<
  string,
  // biome-ignore lint/suspicious/noExplicitAny: selector arguments and results must remain inferable from user functions.
  NimboSelectorRun<TState, any[], any>
>;

export type NimboSelectorArgs<TSelector> = TSelector extends (
  state: never,
  ...args: infer TArgs
) => unknown
  ? TArgs
  : never;

export type NimboSelectorResult<TSelector> = TSelector extends (
  state: never,
  ...args: unknown[]
) => infer TResult
  ? TResult
  : never;

export type NimboComputedSelectorOptions<TArgs extends unknown[]> = {
  key?: (...args: TArgs) => string;
};

export type NimboComputedSelector<
  TState,
  TArgs extends unknown[] = unknown[],
  TResult = unknown,
> = NimboSelectorRun<TState, TArgs, TResult> & {
  readonly __nimboComputed: true;
  readonly __nimboComputedOptions: NimboComputedSelectorOptions<TArgs>;
};

export type NimboAsyncActionContext<TState> = NimboActionContext<TState> & {
  signal: AbortSignal;
  scope: NimboScopeId | null;
  action: string;
};

export type NimboAsyncActionRun<
  TState,
  TArgs extends unknown[] = unknown[],
  TResult = unknown,
> = (context: NimboAsyncActionContext<TState>, ...args: TArgs) => Promise<TResult>;

export type NimboAsyncActionObject<
  TState,
  TArgs extends unknown[] = unknown[],
  TResult = unknown,
> = {
  policy?: NimboAsyncPolicy;
  run: NimboAsyncActionRun<TState, TArgs, TResult>;
};

export type NimboAsyncActionDefinition<
  TState,
  TArgs extends unknown[] = unknown[],
  TResult = unknown,
> =
  | NimboAsyncActionRun<TState, TArgs, TResult>
  | NimboAsyncActionObject<TState, TArgs, TResult>;

export type NimboAsyncActionMap<TState> = Record<
  string,
  // biome-ignore lint/suspicious/noExplicitAny: async action arguments must remain inferable from user functions.
  NimboAsyncActionDefinition<TState, any[], any>
>;

export type NimboBoundAsyncActions<TAsyncActions> = {
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

export type NimboAsyncResult<
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

export type NimboAsyncStatus = {
  pending: boolean;
  error: unknown | null;
  result: unknown;
};

export type NimboStoreDefinition<
  TState,
  TActions,
  TSelectors extends NimboSelectorMap<TState>,
  TAsyncActions extends NimboAsyncActionMap<TState>,
> = {
  state: NimboStateInitializer<TState>;
  actions?: NimboActionFactory<TState, TActions>;
  selectors?: TSelectors;
  asyncActions?: TAsyncActions;
};

export type NimboProviderProps<
  TState,
  TActions,
  TSelectors extends NimboSelectorMap<TState>,
  TAsyncActions,
> = {
  children: ReactNode;
  store?: NimboStore<TState, TActions, TSelectors, TAsyncActions>;
};

export type NimboStore<
  TState,
  TActions,
  TSelectors extends NimboSelectorMap<TState>,
  TAsyncActions,
> = {
  readonly name: string;
  readonly actions: TActions;
  readonly asyncActions: NimboBoundAsyncActions<TAsyncActions>;
  get: () => TState;
  getState: () => TState;
  set: NimboSetState<TState>;
  setState: NimboSetState<TState>;
  patch: NimboPatchState<TState>;
  patchState: NimboPatchState<TState>;
  reset: () => void;
  subscribe: (listener: NimboListener) => () => void;
  selector: <Key extends keyof TSelectors>(
    name: Key,
    ...args: NimboSelectorArgs<TSelectors[Key]>
  ) => NimboSelectorResult<TSelectors[Key]>;
  use: {
    (): TState;
    <TValue>(
      selector: NimboSelector<TState, TValue>,
      equality?: NimboEquality<TValue>,
    ): TValue;
  };
  useActions: () => TActions;
  useSelector: <Key extends keyof TSelectors>(
    name: Key,
    ...args: NimboSelectorArgs<TSelectors[Key]>
  ) => NimboSelectorResult<TSelectors[Key]>;
  useAsyncAction: <Key extends keyof TAsyncActions>(
    name: Key,
  ) => NimboBoundAsyncActions<TAsyncActions>[Key];
  usePending: (name?: keyof TAsyncActions) => boolean;
  useError: <Key extends keyof TAsyncActions>(name: Key) => unknown | null;
  useResult: <Key extends keyof TAsyncActions>(
    name: Key,
  ) => NimboAsyncResult<TAsyncActions, Key> | undefined;
  clearError: (name?: keyof TAsyncActions) => void;
  scope: (
    scopeId: NimboScopeId,
  ) => NimboStore<TState, TActions, TSelectors, TAsyncActions>;
  Provider: (
    props: NimboProviderProps<TState, TActions, TSelectors, TAsyncActions>,
  ) => ReactNode;
};
