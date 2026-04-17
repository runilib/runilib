# Complete select, radio, and multi-select validation helpers

Repository: `runilib/react-formbridge`  
Suggested labels: `enhancement`, `validation-engine`

## Issue Body

## Summary

Fill the remaining gaps for option-based inputs, especially multi-select flows and selection-count validation.

## Why this would help

Choice inputs are already in a good place for single-select validation, but several product-level use cases are still missing:

- optional chips / tag pickers
- checkbox-like multi-select groups
- “pick at least N options” onboarding flows
- “pick exactly one category” style constraints

This issue intentionally excludes grouped options and clearable select support, which already have dedicated drafts.

## Proposed API

```ts
field.multiSelect('Roles')
  .options(['viewer', 'editor', 'admin'])
  .minSelected(1)
  .maxSelected(2);
```

## Suggested implementation areas

- `src/core/field-builders/select/SelectFieldBuilder.ts`
- `src/core/field-builders/field.ts`
- `src/types/field.ts`
- `src/renderers/web/Field.tsx`
- `src/renderers/native/Field.tsx`

## Acceptance Criteria

- [ ] `field.multiSelect()` is available with typed values
- [ ] `allowEmpty()` is available for choice-based builders
- [ ] `minSelected(count)` is available
- [ ] `maxSelected(count)` is available
- [ ] `exactSelected(count)` is available
- [ ] web and native renderers support the new multi-select shape
- [ ] existing single-select APIs remain unchanged
