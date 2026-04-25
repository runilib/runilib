import { useNimboSelector } from '../react/hooks';
import type {
  NimboAsyncActionMap,
  NimboEquality,
  NimboListener,
  NimboSelector,
  NimboSelectorMap,
  NimboStore,
} from '../types';

// biome-ignore lint/suspicious/noExplicitAny: store map must remain shape-agnostic.
type AnyAsyncMap = NimboAsyncActionMap<any>;

// biome-ignore lint/suspicious/noExplicitAny: store map must remain shape-agnostic.
type AnySelectorMap = NimboSelectorMap<any>;

// biome-ignore lint/suspicious/noExplicitAny: composed stores accept any nimbo store regardless of state, actions, Selectors, or async-action shape.
export type NimboAnyStore = NimboStore<any, any, AnySelectorMap, AnyAsyncMap>;

export type NimboStoreMap = Record<string, NimboAnyStore>;

type ExtractState<S> =
  S extends NimboStore<infer T, unknown, AnySelectorMap, AnyAsyncMap> ? T : never;

export type NimboComposedState<TStores extends NimboStoreMap> = {
  [Key in keyof TStores]: ExtractState<TStores[Key]>;
};

export type NimboComposedStore<TStores extends NimboStoreMap> = {
  readonly stores: TStores;
  getState: () => NimboComposedState<TStores>;
  subscribe: (listener: NimboListener) => () => void;
  use: {
    (): NimboComposedState<TStores>;
    <TValue>(
      selector: NimboSelector<NimboComposedState<TStores>, TValue>,
      equality?: NimboEquality<TValue>,
    ): TValue;
  };
};

export function composeStores<TStores extends NimboStoreMap>(
  stores: TStores,
): NimboComposedStore<TStores> {
  const keys = Object.keys(stores) as Array<keyof TStores>;
  let cached: NimboComposedState<TStores> | null = null;

  const getState = (): NimboComposedState<TStores> => {
    // Reuse the cached composite reference when every per-key state is still
    // the same. Without this, useSyncExternalStore would see a new object on
    // every snapshot read and trigger an infinite render loop.
    const next = {} as NimboComposedState<TStores>;
    let stillSame = cached !== null;

    for (const key of keys) {
      const value = stores[key].getState() as NimboComposedState<TStores>[typeof key];
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

  const subscribe = (listener: NimboListener) => {
    const unsubscribers = keys.map((key) => stores[key].subscribe(listener));

    return () => {
      for (const unsubscribe of unsubscribers) {
        unsubscribe();
      }
    };
  };

  const use = ((
    selector?: NimboSelector<NimboComposedState<TStores>, unknown>,
    equality?: NimboEquality<unknown>,
  ) =>
    useNimboSelector(
      getState,
      subscribe,
      selector,
      equality,
    )) as NimboComposedStore<TStores>['use'];

  return {
    stores,
    getState,
    subscribe,
    use,
  };
}
