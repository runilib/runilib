import type { ReactNode } from 'react';

export type Listener = () => void;

export type ListenerTypeAlias = string | number;

export type AsyncPolicy = 'parallel' | 'takeLatest' | 'takeFirst';

export type StateInitializer<TState> = TState | (() => TState);

export type StateUpdater<TState> = TState | ((state: TState) => TState);

export type Selector<TState, TValue> = (state: TState) => TValue;

export type Equality<TValue> = (left: TValue, right: TValue) => boolean;

export type SetState<TState> = (updater: StateUpdater<TState>) => void;

export type PatchState<TState> = (
  updater: Partial<TState> | ((state: TState) => Partial<TState>),
) => void;

export type ActionContext<TState> = {
  get: () => TState;
  getState: () => TState;
  set: SetState<TState>;
  setState: SetState<TState>;
  patch: PatchState<TState>;
  patchState: PatchState<TState>;
  reset: () => void;
};

export type ActionFactory<TState, TActions> = (
  context: ActionContext<TState>,
) => TActions;

export type SelectorRun<
  TState,
  TArgs extends unknown[] = unknown[],
  TResult = unknown,
> = (state: TState, ...args: TArgs) => TResult;

export type SelectorMap<TState> = Record<
  string,
  // biome-ignore lint/suspicious/noExplicitAny: selector arguments and results must remain inferable from user functions.
  SelectorRun<TState, any[], any>
>;

export type SelectorArgs<TSelector> = TSelector extends (
  state: never,
  ...args: infer TArgs
) => unknown
  ? TArgs
  : never;

export type SelectorResult<TSelector> = TSelector extends (
  state: never,
  ...args: unknown[]
) => infer TResult
  ? TResult
  : never;

export type ComputedSelectorOptions<TArgs extends unknown[]> = {
  key?: (...args: TArgs) => string;
};

export type ComputedSelector<
  TState,
  TArgs extends unknown[] = unknown[],
  TResult = unknown,
> = SelectorRun<TState, TArgs, TResult> & {
  readonly __nimboComputed: true;
  readonly __nimboComputedOptions: ComputedSelectorOptions<TArgs>;
};

export type AsyncActionContext<TState> = ActionContext<TState> & {
  signal: AbortSignal;
  scope: ListenerTypeAlias | null;
  action: string;
};

export type AsyncActionRun<
  TState,
  TArgs extends unknown[] = unknown[],
  TResult = unknown,
> = (context: AsyncActionContext<TState>, ...args: TArgs) => Promise<TResult>;

export type AsyncActionObject<
  TState,
  TArgs extends unknown[] = unknown[],
  TResult = unknown,
> = {
  policy?: AsyncPolicy;
  run: AsyncActionRun<TState, TArgs, TResult>;
};

export type AsyncActionDefinition<
  TState,
  TArgs extends unknown[] = unknown[],
  TResult = unknown,
> = AsyncActionRun<TState, TArgs, TResult> | AsyncActionObject<TState, TArgs, TResult>;

export type AsyncActionMap<TState> = Record<
  string,
  // biome-ignore lint/suspicious/noExplicitAny: async action arguments must remain inferable from user functions.
  AsyncActionDefinition<TState, any[], any>
>;

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

export type AsyncStatus = {
  pending: boolean;
  error: unknown | null;
  result: unknown;
};

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

export type ProviderProps<
  TState,
  TActions,
  TSelectors extends SelectorMap<TState>,
  TAsyncActions,
> = {
  children: ReactNode;
  store?: Store<TState, TActions, TSelectors, TAsyncActions>;
};

export type Store<
  TState,
  TActions,
  TSelectors extends SelectorMap<TState>,
  TAsyncActions,
> = {
  readonly name: string;
  readonly actions: TActions;
  readonly asyncActions: BoundAsyncActions<TAsyncActions>;
  get: () => TState;
  getState: () => TState;
  set: SetState<TState>;
  setState: SetState<TState>;
  patch: PatchState<TState>;
  patchState: PatchState<TState>;
  reset: () => void;
  subscribe: (listener: Listener) => () => void;
  select: <Key extends keyof TSelectors>(
    name: Key,
    ...args: SelectorArgs<TSelectors[Key]>
  ) => SelectorResult<TSelectors[Key]>;
  use: {
    (): TState;
    <TValue>(selector: Selector<TState, TValue>, equality?: Equality<TValue>): TValue;
  };
  useActions: () => TActions;
  useSelector: <Key extends keyof TSelectors>(
    name: Key,
    ...args: SelectorArgs<TSelectors[Key]>
  ) => SelectorResult<TSelectors[Key]>;
  useAsyncAction: <Key extends keyof TAsyncActions>(
    name: Key,
  ) => BoundAsyncActions<TAsyncActions>[Key];
  usePending: (name?: keyof TAsyncActions) => boolean;
  useError: <Key extends keyof TAsyncActions>(name: Key) => unknown | null;
  useResult: <Key extends keyof TAsyncActions>(
    name: Key,
  ) => AsyncResult<TAsyncActions, Key> | undefined;
  clearError: (name?: keyof TAsyncActions) => void;
  scope: (
    Listener: ListenerTypeAlias,
  ) => Store<TState, TActions, TSelectors, TAsyncActions>;
  Provider: (
    props: ProviderProps<TState, TActions, TSelectors, TAsyncActions>,
  ) => ReactNode;
};
