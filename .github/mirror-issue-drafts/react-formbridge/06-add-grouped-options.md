# Add grouped options support to field.select()

Repository: `runilib/react-formbridge`  
Suggested labels: `enhancement`, `good first issue`

## Issue Body

## Summary

Add grouped options support to `field.select()` so consumers can define categorized dropdowns instead of flat option lists only.

## Why this would help

Grouped options are useful in cases like:

- billing countries vs shipping countries
- personal roles vs admin roles
- fruits vs vegetables in a long list

This would improve clarity for large selects without requiring a fully custom picker.

## Proposed API

One possible shape:

```ts
field.select('Role').groupedOptions([
  {
    label: 'Core roles',
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'Editor', value: 'editor' },
    ],
  },
  {
    label: 'Read-only roles',
    options: [{ label: 'Viewer', value: 'viewer' }],
  },
]);
```

## Suggested implementation areas

- `src/types.ts`
- `src/core/field-builders/select/SelectFieldBuilder.ts`
- `src/renderers/web/Field.tsx`
- `src/renderers/native/Field.tsx`

## Acceptance Criteria

- [ ] grouped options can be expressed in a typed way
- [ ] web renders option groups or a clear grouped equivalent
- [ ] native renders visible group separators or headers
- [ ] existing flat `options()` support remains unchanged
