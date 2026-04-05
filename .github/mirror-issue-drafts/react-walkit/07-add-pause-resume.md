# Add pause() and resume() controls to useWalkit()

Repository: `runilib/react-walkit`  
Suggested labels: `enhancement`, `good first issue`

## Issue Body

## Summary

Add `pause()` and `resume()` controls to `useWalkit()` so the walkthrough can be temporarily hidden and then resumed on the same step.

## Why this would help

Some apps need to temporarily interrupt a walkthrough without fully stopping it, for example:

- opening a modal
- waiting for a short app transition
- hiding the overlay while the user completes an intermediate action

## Suggested implementation areas

- `src/types/Walkit.types.ts`
- `src/hooks/useWalkit.ts`
- `src/context/WalkitContext.tsx`
- tests for paused and resumed state

## Acceptance Criteria

- [ ] `useWalkit()` exposes `pause()` and `resume()`
- [ ] `pause()` hides the overlay without forgetting the current step
- [ ] `resume()` reopens the tour on the paused step
- [ ] existing `stop()` behavior remains unchanged
