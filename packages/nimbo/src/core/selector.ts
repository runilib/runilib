import type {
  NimboComputedSelector,
  NimboComputedSelectorOptions,
  NimboSelectorArgs,
  NimboSelectorMap,
  NimboSelectorResult,
  NimboSelectorRun,
} from '../types';

const computedCache = new WeakMap<
  NimboComputedSelector<unknown, unknown[], unknown>,
  Map<string, { state: unknown; value: unknown }>
>();

export function computed<TState, TArgs extends unknown[], TResult>(
  run: NimboSelectorRun<TState, TArgs, TResult>,
  options: NimboComputedSelectorOptions<TArgs> = {},
): NimboComputedSelector<TState, TArgs, TResult> {
  const computedSelector = ((state: TState, ...args: TArgs) =>
    run(state, ...args)) as NimboComputedSelector<TState, TArgs, TResult>;

  Object.defineProperties(computedSelector, {
    __nimboComputed: {
      value: true,
    },
    __nimboComputedOptions: {
      value: options,
    },
  });

  return computedSelector;
}

export function readSelector<
  TState,
  TSelectors extends NimboSelectorMap<TState>,
  Key extends keyof TSelectors,
>(
  storeName: string,
  selectors: TSelectors | undefined,
  state: TState,
  name: Key,
  ...args: NimboSelectorArgs<TSelectors[Key]>
): NimboSelectorResult<TSelectors[Key]> {
  const selector = selectors?.[name];

  if (!selector) {
    throw new Error(`Nimbo selector "${String(name)}" does not exist on "${storeName}".`);
  }

  if (isComputedSelector(selector)) {
    return readComputedSelector(selector, state, args) as NimboSelectorResult<
      TSelectors[Key]
    >;
  }

  return selector(state, ...args) as NimboSelectorResult<TSelectors[Key]>;
}

function readComputedSelector<TState, TArgs extends unknown[], TResult>(
  selector: NimboComputedSelector<TState, TArgs, TResult>,
  state: TState,
  args: TArgs,
): TResult {
  const key = selector.__nimboComputedOptions.key?.(...args) ?? JSON.stringify(args);
  let cache = computedCache.get(
    selector as NimboComputedSelector<unknown, unknown[], unknown>,
  );

  if (!cache) {
    cache = new Map();
    computedCache.set(
      selector as NimboComputedSelector<unknown, unknown[], unknown>,
      cache,
    );
  }

  const cached = cache.get(key);

  if (cached && Object.is(cached.state, state)) {
    return cached.value as TResult;
  }

  const value = selector(state, ...args);
  cache.set(key, { state, value });

  return value;
}

function isComputedSelector<TState, TArgs extends unknown[], TResult>(
  selector: NimboSelectorRun<TState, TArgs, TResult>,
): selector is NimboComputedSelector<TState, TArgs, TResult> {
  return '__nimboComputed' in selector && selector.__nimboComputed === true;
}
