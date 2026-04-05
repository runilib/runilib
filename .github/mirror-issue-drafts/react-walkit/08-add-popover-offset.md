# Add configurable popoverOffset support to WalkitProvider and WalkitStep

Repository: `runilib/react-walkit`  
Suggested labels: `enhancement`, `good first issue`

## Issue Body

## Summary

Add configurable `popoverOffset` support so consumers can control the distance between the active target and the walkthrough popover.

## Why this would help

Some apps want more spacing between the spotlighted element and the popover, while others want the popover to sit closer to the target. A configurable offset would improve design-system alignment without requiring a full custom renderer.

## Proposed API

Possible directions:

```ts
<WalkitProvider popoverOffset={16} />
```

and optionally:

```tsx
<WalkitStep id="search" sequence={1} popoverOffset={24} />
```

## Suggested implementation areas

- `src/types/Walkit.types.ts`
- positioning utilities under `src/utils/`
- web/native popover rendering

## Acceptance Criteria

- [ ] `WalkitProvider` can define a default popover offset
- [ ] a step can optionally override that offset
- [ ] web and native stay consistent
- [ ] existing placement fallback logic continues to work
