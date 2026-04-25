---
'@runilib/nimbo': major
---

Add `composeStores` for read-only multi-module aggregation.

`composeStores({ user: userStore, cart: cartStore })` returns a read aggregator
exposing `getState`, `subscribe`, and `use(selector)` over the combined state of
several stores. It is the path for projects that want a Redux/MobX-style root
view without abandoning the per-module mental model — mutations still go
through each underlying store's `actions`, so ownership of state stays in the
modules.
