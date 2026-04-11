# Add beforeStepChange guard support to useFormBridgeWizard()

Repository: `runilib/react-formbridge`  
Suggested labels: `enhancement`, `good first issue`

## Issue Body

## Summary

Add a `beforeStepChange` guard to `useFormBridgeWizard()` so consumers can intercept wizard navigation before the current step changes.

## Why this would help

The wizard already exposes `onStepChange`, but that only runs after the transition happens. Many apps need pre-navigation logic such as:

- async confirmation
- custom business-rule checks
- save-before-leave behavior
- blocking accidental navigation away from a step

## Proposed API

Possible shape:

```ts
useFormBridgeWizard(steps, {
  beforeStepChange: async (event) => {
    return true; // or false to block
  },
});
```

## Suggested implementation areas

- `src/hooks/shared/useFormBridgeWizard.ts`
- wizard types
- tests for blocked and allowed transitions

## Acceptance Criteria

- [ ] a `beforeStepChange` option is supported
- [ ] it can synchronously or asynchronously allow/block navigation
- [ ] it works with `next`, `prev`, `goTo`, `goToStep`, and `skip`
- [ ] existing behavior remains unchanged when the guard is not used
