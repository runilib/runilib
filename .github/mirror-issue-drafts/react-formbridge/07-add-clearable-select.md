# Add clearable() support to field.select()

Repository: `runilib/react-formbridge`  
Suggested labels: `enhancement`, `good first issue`

## Issue Body

## Summary

Add a `clearable()` helper to `field.select()` so optional select fields can be reset back to an empty value after a selection is made.

## Why this would help

Optional selects can start empty today, but once a value is selected there is no consistent, explicit clear-selection affordance across platforms.

This would be especially useful in:

- filter forms
- optional profile fields
- multi-step forms where users may want to undo a choice

## Proposed API

```ts
field.select('Country').options([...]).clearable();
```

## Suggested implementation areas

- `src/core/field-builders/select/SelectFieldBuilder.ts`
- `src/renderers/web/Field.tsx`
- `src/renderers/native/Field.tsx`
- tests for clearing back to empty

## Acceptance Criteria

- [ ] `clearable()` is available on `field.select()`
- [ ] optional selects can be reset to empty
- [ ] web and native both expose a clear/reset path
- [ ] required fields still validate correctly after clearing
