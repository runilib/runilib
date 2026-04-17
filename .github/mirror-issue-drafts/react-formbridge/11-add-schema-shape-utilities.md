# Add schema shape utilities: `partial()`, `pick()`, `omit()`, `extend()`, `merge()`

Repository: `runilib/react-formbridge`  
Suggested labels: `enhancement`, `validation-engine`

## Issue Body

## Summary

Add first-class schema transformation helpers so teams can derive variants of an existing schema without rebuilding the whole shape by hand.

## Why this would help

The new validation engine already exposes `schema()`, `safeParse()`, `refine()`, and schema-level rules, but real products also need ergonomic ways to derive:

- create vs edit schemas
- patch/update schemas
- public vs internal payload variants
- shared base schemas extended by feature-specific fields

Without `partial()`, `pick()`, `omit()`, `extend()`, and `merge()`, consumers either duplicate schemas or fall back to external validators for common composition workflows.

## Proposed API

```ts
const base = schema({
  firstName: field.text('First name').required(),
  lastName: field.text('Last name').required(),
  email: field.email('Email').required(),
});

const patch = base.partial();
const contactOnly = base.pick(['email']);
const internal = base.extend({
  role: field.select('Role').options(['admin', 'editor']),
});
```

## Suggested implementation areas

- `src/core/validators/schema.ts`
- `src/types/schema.ts`
- `src/core/validators/schema.test.ts`
- type-level inference tests

## Acceptance Criteria

- [ ] `schema.partial()` returns a schema where fields become optional without losing field definitions
- [ ] `schema.pick(keys)` returns a typed schema limited to the selected keys
- [ ] `schema.omit(keys)` returns a typed schema without the omitted keys
- [ ] `schema.extend(shape)` adds or overrides fields while preserving schema-level APIs
- [ ] `schema.merge(otherSchema)` combines two schemas with deterministic conflict behavior
- [ ] derived schemas still support `safeParse()`, `safeParseAsync()`, `refine()`, and `errorMap()`

