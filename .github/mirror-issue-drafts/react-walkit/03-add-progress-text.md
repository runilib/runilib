# Add progress text like "Step 2 of 5" to the default Walkit popover

Repository: `runilib/react-walkit`  
Suggested labels: `enhancement`, `good first issue`

## Issue Body

## Summary

Add optional textual progress to the default Walkit popover, for example `Step 2 of 5`.

## Why this would help

The current default popover shows progress dots, but some teams want a clearer textual indicator for user onboarding and completion tracking.

## Proposed API

One possible direction:

```ts
labels: {
  progress: ({ index, total }) => `Step ${index + 1} of ${total}`,
}
```

Or a dedicated option such as `showProgressLabel`.

## Suggested implementation areas

- `src/types/Walkit.types.ts`
- `src/components/walkit/web/Walkit.web.tsx`
- `src/components/walkit/native/Walkit.native.tsx`

## Acceptance Criteria

- [ ] the default popover can optionally show a textual progress label
- [ ] there is a simple way to customize the label format
- [ ] web and native stay aligned in behavior
- [ ] current dot indicators remain functional
