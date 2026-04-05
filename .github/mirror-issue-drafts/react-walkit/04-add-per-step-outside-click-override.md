# Add a per-step override for stopOnOutsideClick

Repository: `runilib/react-walkit`  
Suggested labels: `enhancement`, `good first issue`

## Issue Body

## Summary

Allow `WalkitStep` to override the provider-level `stopOnOutsideClick` behavior.

## Why this would help

`stopOnOutsideClick` currently exists at provider level only. Some tours need stricter behavior for one step than for another, especially when a step highlights a critical or destructive action.

## Example use case

- most steps allow outside click to close
- one specific step must force the user to choose Next, Back, or Skip explicitly

## Suggested implementation areas

- `src/types/Walkit.types.ts`
- `src/context/WalkitContext.tsx`
- `src/components/walkit/overlay-bridge/SharedWalkitOverlayBridge.tsx`
- `src/components/walkit/web/Overlay.web.tsx`
- `src/components/walkit/native/Overlay.native.tsx`

## Acceptance Criteria

- [ ] a step can override the provider-level outside-click behavior
- [ ] the current step’s override takes priority over the provider default
- [ ] the provider value remains the fallback when no override is defined
- [ ] both web and native are covered
