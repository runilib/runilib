---
"@runilib/nimbo": minor
---

Add store effects for lifecycle and selected-state reactions outside React components.

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
