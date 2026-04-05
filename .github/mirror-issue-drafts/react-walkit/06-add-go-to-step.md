# Add goToStep(stepId) helper to useWalkit()

Repository: `runilib/react-walkit`  
Suggested labels: `enhancement`, `good first issue`

## Issue Body

## Summary

Add a `goToStep(stepId)` helper to `useWalkit()` so the active tour can jump directly to a step by id.

## Why this would help

The current API reasons partly in terms of step ids and partly in terms of numeric indexes:

- `start(stepId?)`
- `goTo(index)`

For apps that already know the step id, a public `goToStep(stepId)` helper would be more ergonomic and easier to read.

## Suggested implementation areas

- `src/types/Walkit.types.ts`
- `src/hooks/useWalkit.ts`
- `src/context/WalkitContext.tsx`
- tests for valid and invalid ids

## Acceptance Criteria

- [ ] `useWalkit()` exposes `goToStep(stepId: string)`
- [ ] it jumps to the requested registered step
- [ ] invalid step ids fail safely
- [ ] the behavior matches the existing `goTo(index)` semantics
