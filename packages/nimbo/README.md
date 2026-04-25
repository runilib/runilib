<p align="center">
  <img alt="nimbo" src="./assets/logo.svg" width="760" />
</p>

<p align="center">
  <strong>Tiny typed state modules for React and React Native.</strong>
</p>

# Nimbo

> [!WARNING]
> **Nimbo is currently in active development.**
>
> The package is not published yet, the API may change quickly, and it should not
> be used in production applications until the first public release is announced.

Nimbo is a small state management package for cases where you want reusable state
logic without reducers, action strings, providers everywhere, or storage-first
mental models.

```tsx
import { computed, createStore } from "@runilib/nimbo";

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
  selectors: {
    isEmpty: (state) => state.count === 0,
  },
});

export function Counter() {
  const count = counter.use((state) => state.count);
  const isEmpty = counter.useSelector("isEmpty");
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

## Parameterized Selectors

Selectors can receive business parameters.

```tsx
const cartStore = createStore("cart", {
  state: () => ({
    items: [] as Array<{
      id: string;
      category: "hardware" | "merch";
      price: number;
    }>,
  }),
  selectors: {
    total: (state) => state.items.reduce((sum, item) => sum + item.price, 0),
    totalWithTax: (state, taxRate: number) =>
      state.items.reduce((sum, item) => sum + item.price, 0) * (1 + taxRate),
    itemsByCategory: (state, category: "hardware" | "merch") =>
      state.items.filter((item) => item.category === category),
  },
});

const total = cartStore.selector("total");
const totalWithTax = cartStore.selector("totalWithTax", 0.2);
const hardwareItems = cartStore.selector("itemsByCategory", "hardware");
```

The same API works in React:

```tsx
function CartSummary() {
  const totalWithTax = cartStore.useSelector("totalWithTax", 0.2);
  const hardwareItems = cartStore.useSelector("itemsByCategory", "hardware");

  return (
    <p>
      {hardwareItems.length} hardware items · {totalWithTax}
    </p>
  );
}
```

## Computed Selectors

Use `computed()` when a derived read is expensive and should be memoized by
state reference and selector arguments.

```tsx
const cartStore = createStore("cart", {
  state: () => ({
    items: [] as Array<{ category: string; price: number }>,
  }),
  selectors: {
    totalByCategory: computed((state, category: string) =>
      state.items
        .filter((item) => item.category === category)
        .reduce((sum, item) => sum + item.price, 0),
    ),
  },
});

const hardwareTotal = cartStore.selector("totalByCategory", "hardware");
```

You can provide a custom cache key for parameterized computed selectors:

```tsx
selectors: {
  totalByCategory: computed(
    (state, category: string) =>
      state.items
        .filter((item) => item.category === category)
        .reduce((sum, item) => sum + item.price, 0),
    {
      key: (category) => category,
    },
  ),
}
```

## Mental Model

A Nimbo store is a typed module with:

- `state`: the source values
- `actions`: the only public way to mutate state
- `selectors`: derived reads
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
includes the core store API, React subscriptions, selectors, actions, and scoped
stores.

Current MVP surface:

- `createStore(name, definition)`
- `state`
- `actions`
- `selectors`
- parameterized selectors
- `computed()` memoized selectors
- `asyncActions`
- `store.use(selector)`
- `store.useActions()`
- `store.useSelector(name)`
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

When a project wants a Redux/MobX-style root selector without giving up the
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
