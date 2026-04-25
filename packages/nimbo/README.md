<p align="center">
  <img alt="nimbo" src="./assets/logo.svg" width="760" />
</p>

<p align="center">
  <strong>Tiny typed state modules for React and React Native.</strong>
</p>

# Nimbo

Nimbo is a small state management package for cases where you want reusable state
logic without reducers, action strings, providers everywhere, or storage-first
mental models.

```tsx
import { createStore } from "@runilib/nimbo";

const counter = createStore("counter", {
  state: () => ({ count: 0 }),
  actions: ({ patch }) => ({
    increment() {
      patch((state) => ({ count: state.count + 1 }));
    },
    decrement() {
      patch((state) => ({ count: state.count - 1 }));
    },
  }),
  views: {
    isEmpty: (state) => state.count === 0,
  },
});

export function Counter() {
  const count = counter.use((state) => state.count);
  const isEmpty = counter.useView("isEmpty");
  const { increment, decrement } = counter.useActions();

  return (
    <>
      <button onClick={decrement}>-</button>
      <span>{count}</span>
      <button onClick={increment}>+</button>
      {isEmpty ? <small>Empty</small> : null}
    </>
  );
}
```

## Mental Model

A Nimbo store is a typed module with:

- `state`: the source values
- `actions`: the only public way to mutate state
- `views`: derived reads
- `scope(id)`: isolated state instances from the same definition

The same store definition can be used globally, locally, or by scope.

## Scoped State

Scopes let you reuse one state model for many isolated contexts.

```tsx
const cartStore = createStore("cart", {
  state: () => ({ items: [] as string[] }),
  actions: ({ patch }) => ({
    add(item: string) {
      patch((state) => ({ items: [...state.items, item] }));
    },
  }),
});

const nikeCart = cartStore.scope("nike");
const appleCart = cartStore.scope("apple");

nikeCart.actions.add("Air Max");
appleCart.actions.add("iPhone");
```

The parameter passed to `scope()` is the identity of the context:

- `shopId`
- `projectId`
- `workspaceId`
- `tabId`
- `documentId`
- `conversationId`

Same definition, different scope id, different state instance.

## Current Status

This package is initialized for active development. The first implementation
includes the core store API, React subscriptions, views, actions, and scoped
stores.

Current MVP surface:

- `createStore(name, definition)`
- `state`
- `actions`
- `views`
- `asyncActions`
- `store.use(selector)`
- `store.useActions()`
- `store.useView(name)`
- `store.getState()`
- `store.setState()`
- `store.subscribe()`
- `store.scope(id)`
- `store.Provider`
- `useLocalStore`
- `store.useAsyncAction(name)`
- `store.usePending(name?)`
- `store.useError(name)`
- `store.useResult(name)`
- `takeLatest`
- abort signal support
- `composeStores({ user: userStore, cart: cartStore })`

## Composing modules

When a project wants a Redux/MobX-style root view without giving up the
per-module mental model, `composeStores` exposes a read-only composite over
several stores:

```tsx
import { composeStores } from "@runilib/nimbo";

const root = composeStores({
  user: userStore,
  cart: cartStore,
  theme: themeStore,
});

function Header() {
  const summary = root.use(
    (state) => `${state.user.name} · ${state.cart.items.length} items`,
  );

  return <span>{summary}</span>;
}
```

The composed object only exposes `getState`, `subscribe`, and `use`. Mutations
still go through each underlying store's `actions`, so the per-module model
stays intact — `composeStores` is a read aggregator, not a new owner of state.

Planned next areas:

- persistence adapters
- devtools hooks
- middleware
