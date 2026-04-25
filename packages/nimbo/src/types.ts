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

export type NimboViewFactory<TState, TViews> = {
  [Key in keyof TViews]: (state: TState) => TViews[Key];
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
  TViews,
  TAsyncActions extends NimboAsyncActionMap<TState>,
> = {
  state: NimboStateInitializer<TState>;
  actions?: NimboActionFactory<TState, TActions>;
  views?: NimboViewFactory<TState, TViews>;
  asyncActions?: TAsyncActions;
};

export type NimboProviderProps<TState, TActions, TViews, TAsyncActions> = {
  children: ReactNode;
  store?: NimboStore<TState, TActions, TViews, TAsyncActions>;
};

export type NimboStore<TState, TActions, TViews, TAsyncActions> = {
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
  view: <Key extends keyof TViews>(name: Key) => TViews[Key];
  use: {
    (): TState;
    <TValue>(
      selector: NimboSelector<TState, TValue>,
      equality?: NimboEquality<TValue>,
    ): TValue;
  };
  useActions: () => TActions;
  useView: <Key extends keyof TViews>(name: Key) => TViews[Key];
  useAsyncAction: <Key extends keyof TAsyncActions>(
    name: Key,
  ) => NimboBoundAsyncActions<TAsyncActions>[Key];
  usePending: (name?: keyof TAsyncActions) => boolean;
  useError: <Key extends keyof TAsyncActions>(name: Key) => unknown | null;
  useResult: <Key extends keyof TAsyncActions>(
    name: Key,
  ) => NimboAsyncResult<TAsyncActions, Key> | undefined;
  clearError: (name?: keyof TAsyncActions) => void;
  scope: (scopeId: NimboScopeId) => NimboStore<TState, TActions, TViews, TAsyncActions>;
  Provider: (
    props: NimboProviderProps<TState, TActions, TViews, TAsyncActions>,
  ) => ReactNode;
};
