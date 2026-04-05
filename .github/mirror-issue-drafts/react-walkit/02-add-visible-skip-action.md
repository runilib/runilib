# Add a visible Skip action to the default Walkit popover

Repository: `runilib/react-walkit`  
Suggested labels: `enhancement`, `good first issue`

## Issue Body

## Summary

Add a visible `Skip` action to the default Walkit popover UI.

## Why this would help

The default UI currently provides a close icon, but not a visible Skip action. For onboarding flows, a dedicated Skip button is often clearer and more user-friendly.

## Proposed API

This could be exposed through the existing labels system, for example:

```ts
labels: {
  skip: 'Skip tour',
}
```

## Suggested implementation areas

- `src/types/Walkit.types.ts`
- `src/components/walkit/web/Walkit.web.tsx`
- `src/components/walkit/native/Walkit.native.tsx`
- tests for rendering and behavior

## Acceptance Criteria

- [ ] the default popover can render a visible Skip button
- [ ] `labels.skip` is supported
- [ ] Skip triggers the same stop flow as the close action
- [ ] existing default popover behavior remains backward-compatible
