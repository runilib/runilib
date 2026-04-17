# Add advanced structural field types (`tuple`, `union`, `record`, etc.)

Repository: `runilib/react-formbridge`  
Suggested labels: `enhancement`, `validation-engine`

## Issue Body

## Summary

Build on top of nested object/array support by adding the remaining structural types needed for parity with mature validator libraries.

## Why this would help

Once `field.object()` and `field.array()` land, the next gap is advanced structural modeling:

- tuples for fixed-length ordered data
- literals and enums for exact matches
- unions and discriminated unions for dynamic flows
- records and maps for keyed collections

These are common in admin panels, workflow builders, integration settings, and API payload editors.

## Proposed API

```ts
field.tuple([field.text('Label'), field.number('Count')]);
field.literal('draft');
field.enum(['draft', 'published']);
field.union([field.text('Value'), field.number('Value')]);
field.discriminatedUnion('type', {
  email: field.object({ type: field.literal('email'), value: field.email('Email') }),
  sms: field.object({ type: field.literal('sms'), value: field.phone('Phone') }),
});
```

## Suggested implementation areas

- structural builders under `src/core/field-builders/`
- `src/core/validators/engine.ts`
- `src/types/field.ts`
- `src/types/schema.ts`
- validation engine tests and inference tests

## Acceptance Criteria

- [ ] `field.tuple([...items])` is available
- [ ] `field.literal(value)` is available
- [ ] `field.enum(values)` is available
- [ ] `field.union([...schemas])` is available
- [ ] `field.discriminatedUnion(discriminator, mapping)` is available
- [ ] `field.record(valueSchema)` is available
- [ ] `field.map(keySchema, valueSchema)` is available
- [ ] validation results preserve usable paths and branch-specific issues
- [ ] type inference remains stable across structural builders

