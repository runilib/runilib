import { useSelector } from '../react/hooks';
import type {
  AsyncActionMap,
  Equality,
  Listener,
  Selector,
  SelectorMap,
  Store,
} from '../types';

// biome-ignore lint/suspicious/noExplicitAny: store map must remain shape-agnostic.
type AnyAsyncMap = AsyncActionMap<any>;

// biome-ignore lint/suspicious/noExplicitAny: store map must remain shape-agnostic.
type AnySelectorMap = SelectorMap<any>;

// biome-ignore lint/suspicious/noExplicitAny: composed stores accept any nimbo store regardless of state, actions, Selectors, or async-action shape.
export type AnyStore = Store<any, any, AnySelectorMap, AnyAsyncMap>;

export type StoreMap = Record<string, AnyStore>;

type ExtractState<S> =
  S extends Store<infer T, unknown, AnySelectorMap, AnyAsyncMap> ? T : never;

export type ComposedState<TStores extends StoreMap> = {
  [Key in keyof TStores]: ExtractState<TStores[Key]>;
};

export type ComposedStore<TStores extends StoreMap> = {
  readonly stores: TStores;
  getState: () => ComposedState<TStores>;
  subscribe: (listener: Listener) => () => void;
  use: {
    (): ComposedState<TStores>;
    <TValue>(
      selector: Selector<ComposedState<TStores>, TValue>,
      equality?: Equality<TValue>,
    ): TValue;
  };
};

export function composeStores<TStores extends StoreMap>(
  stores: TStores,
): ComposedStore<TStores> {
  const keys = Object.keys(stores) as Array<keyof TStores>;
  let cached: ComposedState<TStores> | null = null;

  const getState = (): ComposedState<TStores> => {
    // Reuse the cached composite reference when every per-key state is still
    // the same. Without this, useSyncExternalStore would see a new object on
    // every snapshot read and trigger an infinite render loop.
    const next = {} as ComposedState<TStores>;
    let stillSame = cached !== null;

    for (const key of keys) {
      const value = stores[key].getState() as ComposedState<TStores>[typeof key];
      next[key] = value;

      if (stillSame && cached?.[key] !== value) {
        stillSame = false;
      }
    }

    if (stillSame && cached !== null) {
      return cached;
    }

    cached = next;

    return next;
  };

  const subscribe = (listener: Listener) => {
    const unsubscribers = keys.map((key) => stores[key].subscribe(listener));

    return () => {
      for (const unsubscribe of unsubscribers) {
        unsubscribe();
      }
    };
  };

  const use = ((
    selector?: Selector<ComposedState<TStores>, unknown>,
    equality?: Equality<unknown>,
  ) =>
    useSelector(
      getState,
      subscribe,
      selector,
      equality,
    )) as ComposedStore<TStores>['use'];

  return {
    stores,
    getState,
    subscribe,
    use,
  };
}
