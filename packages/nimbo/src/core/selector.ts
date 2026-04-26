import type {
  ComputedSelector,
  ComputedSelectorOptions,
  SelectorArgs,
  SelectorMap,
  SelectorResult,
  SelectorRun,
} from '../types';

/**
 * Per-selector memoization cache.
 *
 * Outer key: the computed selector function itself (so two different
 * `computed(...)` definitions never collide).
 * Inner key: the args fingerprint (custom `key(...args)` or
 * `JSON.stringify(args)`), mapped to `{ state, value }` — `state` is kept by
 * reference so we can invalidate via `Object.is` when state changes.
 *
 * `WeakMap` lets selectors that go out of scope get garbage-collected
 * together with their cache entries.
 */
const computedCache = new WeakMap<
  ComputedSelector<unknown, unknown[], unknown>,
  Map<string, { state: unknown; value: unknown }>
>();

/**
 * Wraps a selector body in a memoized variant. The cache is keyed by the
 * `state` reference and (optionally) by `options.key(...args)` — when args
 * are present and `key` is not provided, `JSON.stringify(args)` is used.
 *
 * Use `computed()` for derivations that are non-trivial to compute (filters,
 * reductions, deep walks). Plain selectors are usually cheap enough not to
 * need it.
 *
 * @example
 * ```ts
 * createStore('cart', {
 *   state: () => ({ items: [] as Array<{ category: string; price: number }> }),
 *   selectors: {
 *     totalByCategory: computed(
 *       (state, category: string) =>
 *         state.items
 *           .filter((item) => item.category === category)
 *           .reduce((sum, item) => sum + item.price, 0),
 *       { key: (category) => category },
 *     ),
 *   },
 * });
 * ```
 */
export function computed<TState, TArgs extends unknown[], TResult>(
  run: SelectorRun<TState, TArgs, TResult>,
  options: ComputedSelectorOptions<TArgs> = {},
): ComputedSelector<TState, TArgs, TResult> {
  const computedSelector = ((state: TState, ...args: TArgs) =>
    run(state, ...args)) as ComputedSelector<TState, TArgs, TResult>;

  // Branding fields so `readSelector` can detect computed selectors at
  // read time and route them through the memoization cache.
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

/**
 * Looks up a named selector in `selectors`, runs it against `state` with
 * the supplied args, and returns the result. Throws when the name is
 * missing — better to fail loudly than silently return `undefined`.
 *
 * Used by both `store.select(name, ...args)` and the React
 * `store.useSelector(name, ...args)` hook.
 */
export function readSelector<
  TState,
  TSelectors extends SelectorMap<TState>,
  Key extends keyof TSelectors,
>(
  storeName: string,
  selectors: TSelectors | undefined,
  state: TState,
  name: Key,
  ...args: SelectorArgs<TSelectors[Key]>
): SelectorResult<TSelectors[Key]> {
  const selector = selectors?.[name];

  if (!selector) {
    throw new Error(`Nimbo selector "${String(name)}" does not exist on "${storeName}".`);
  }

  if (isComputedSelector(selector)) {
    return readComputedSelector(selector, state, args) as SelectorResult<TSelectors[Key]>;
  }

  return selector(state, ...args) as SelectorResult<TSelectors[Key]>;
}

/**
 * Cache lookup + recompute for a {@link ComputedSelector}.
 *
 * Cache is hit when both the args key matches AND the cached `state` is
 * referentially identical to the current one (`Object.is`). Any state
 * mutation that produces a new reference (which nimbo's container always
 * does on real changes) invalidates the entry on next read.
 */
function readComputedSelector<TState, TArgs extends unknown[], TResult>(
  selector: ComputedSelector<TState, TArgs, TResult>,
  state: TState,
  args: TArgs,
): TResult {
  const key = selector.__nimboComputedOptions.key?.(...args) ?? JSON.stringify(args);
  let cache = computedCache.get(
    selector as ComputedSelector<unknown, unknown[], unknown>,
  );

  if (!cache) {
    cache = new Map();
    computedCache.set(selector as ComputedSelector<unknown, unknown[], unknown>, cache);
  }

  const cached = cache.get(key);

  if (cached && Object.is(cached.state, state)) {
    return cached.value as TResult;
  }

  const value = selector(state, ...args);
  cache.set(key, { state, value });

  return value;
}

/** Type guard: detects selectors built via {@link computed}. */
function isComputedSelector<TState, TArgs extends unknown[], TResult>(
  selector: SelectorRun<TState, TArgs, TResult>,
): selector is ComputedSelector<TState, TArgs, TResult> {
  return '__nimboComputed' in selector && selector.__nimboComputed === true;
}
