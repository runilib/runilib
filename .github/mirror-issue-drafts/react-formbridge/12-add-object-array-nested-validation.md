# Add `field.object()` / `field.array()` with nested path-aware validation

Repository: `runilib/react-formbridge`  
Suggested labels: `enhancement`, `validation-engine`

## Issue Body

## Summary

Add minimal structural field types with recursive validation so `react-formbridge` can validate nested values without depending on Yup, Zod, or another external validator.

## Why this would help

This is the biggest remaining P0 gap in the validation roadmap. Real-world product forms routinely include nested objects and arrays:

- billing and shipping addresses
- contact lists
- dynamic sections
- nested settings payloads

Until `field.object()` and `field.array()` exist with proper nested paths, the engine cannot fully replace external validators on complex forms.

## Proposed API

```ts
const userSchema = schema({
  profile: field.object({
    firstName: field.text('First name').required(),
    address: field.object({
      city: field.text('City').required(),
      zip: field.text('ZIP').required(),
    }),
  }),
  contacts: field.array(
    field.object({
      email: field.email('Email').required(),
      type: field.select('Type').options(['home', 'work']).required(),
    }),
  ),
});
```

## Suggested implementation areas

- `src/core/field-builders/field.ts`
- new structural builders under `src/core/field-builders/`
- `src/core/validators/engine.ts`
- `src/core/validators/schema.ts`
- `src/types/field.ts`
- `src/types/schema.ts`
- form state / error mapping tests

## Acceptance Criteria

- [ ] `field.object(shape)` is available
- [ ] `field.array(itemSchema)` is available
- [ ] validation walks nested values recursively
- [ ] nested issues expose path segments like `['profile', 'address', 'city']` and `['contacts', 0, 'email']`
- [ ] `errorsByField` exposes stable dotted keys for nested paths
- [ ] nested defaults and nested transforms are applied correctly
- [ ] nested references are documented and tested against schema-level rules

