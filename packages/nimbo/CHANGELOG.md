# @runilib/nimbo

## 1.0.0

### Major Changes

- [#135](https://github.com/runilib/runilib/pull/135) [`51e2e3c`](https://github.com/runilib/runilib/commit/51e2e3cf31cbef0d071cb6a110e23608ef94fe76) Thanks [@akladekouassi](https://github.com/akladekouassi)! - Add `composeStores` for read-only multi-module aggregation.

  `composeStores({ user: userStore, cart: cartStore })` returns a read aggregator
  exposing `getState`, `subscribe`, and `use(selector)` over the combined state of
  several stores. It is the path for projects that want a Redux/MobX-style root
  view without abandoning the per-module mental model — mutations still go
  through each underlying store's `actions`, so ownership of state stays in the
  modules.

- [#133](https://github.com/runilib/runilib/pull/133) [`4dd04bf`](https://github.com/runilib/runilib/commit/4dd04bf0524a0916b04e7f901e5f89ed3e6d28d3) Thanks [@akladekouassi](https://github.com/akladekouassi)! - Add octopus logo to the README header.

  The octopus mirrors the mental model of the library: one body (the store
  definition), many independent tentacles (the `scope(id)` instances). The
  asset lives at `assets/logo.svg` and is referenced from the README the same
  way the rest of the runilib packages do.

### Minor Changes

- [#136](https://github.com/runilib/runilib/pull/136) [`661f9df`](https://github.com/runilib/runilib/commit/661f9dfe5bf12ae75e4255cde0fb8a79553a7a2b) Thanks [@akladekouassi](https://github.com/akladekouassi)! - add computed memoization feature for ations, rename view to selector and some enhancements

- [#191](https://github.com/runilib/runilib/pull/191) [`94fb742`](https://github.com/runilib/runilib/commit/94fb74244990f22f34f23ba62b11b1b1e6a5f3fd) Thanks [@akladekouassi](https://github.com/akladekouassi)! - Add store effects for lifecycle and selected-state reactions outside React components.

  Store definitions can now include an optional `effects` block. Effects start with each
  store instance, including scoped and local stores, and receive a context with `watch`,
  state helpers, and the current `scope`.

  `watch(selector, callback, options)` observes selected state, supports cleanup
  functions, and can be configured with `equality`, `immediate`, `once`, `debounce`,
  `throttle`, and `onError`. Stores also expose `startEffects()` and `stopEffects()` for
  explicit lifecycle control.

  This gives workflows like persistence, logout cleanup, analytics identification,
  cross-store sync, and background work a first-class home without requiring mounted
  React components or scattered manual subscriptions.

## 0.0.0

Initial development package.
