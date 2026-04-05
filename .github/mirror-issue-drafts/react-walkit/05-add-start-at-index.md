# Add startAtIndex(index) helper to useWalkit()

Repository: `runilib/react-walkit`  
Suggested labels: `enhancement`, `good first issue`

## Issue Body

## Summary

Add a `startAtIndex(index)` helper to `useWalkit()` so the walkthrough can start directly from a numeric index.

## Why this would help

The public API already supports:

- `start(stepId?)`
- `goTo(index)` after the tour is active

But a dedicated numeric start helper would be more ergonomic when the app already computes the starting step as an index.

## Suggested implementation areas

- `src/types/Walkit.types.ts`
- `src/hooks/useWalkit.ts`
- `src/context/WalkitContext.tsx`
- tests for non-zero starts

## Acceptance Criteria

- [ ] `useWalkit()` exposes `startAtIndex(index: number)`
- [ ] it starts the walkthrough directly from the requested index
- [ ] invalid indexes fail safely
- [ ] the behavior is consistent with existing `start(stepId)` and `goTo(index)` behavior
