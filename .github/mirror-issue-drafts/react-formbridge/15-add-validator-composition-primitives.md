# Add validator composition primitives and custom validator factories

Repository: `runilib/react-formbridge`  
Suggested labels: `enhancement`, `validation-engine`

## Issue Body

## Summary

Add a public composition layer for validators so consumers can express reusable logic without falling back to ad-hoc inline callbacks everywhere.

## Why this would help

`validate(fn)` is flexible, but it does not scale well for shared validation logic across apps and field builders. A public composition API would make it easier to build:

- reusable rule chains
- optional / nullable wrappers
- short-circuiting logic
- conditional validators
- custom validators and transforms with names and metadata

## Proposed API

```ts
const slugValidator = createValidator('slug', (value: string) =>
  /^[a-z0-9-]+$/.test(value) ? null : 'Invalid slug.',
);

field
  .text('Slug')
  .validate(
    validator.and(
      validator.optional(slugValidator),
      validator.bail(),
    ),
  );
```

## Suggested implementation areas

- new helpers under `src/core/validators/`
- `src/core/field-builders/base/BaseFieldBuilder.ts`
- `src/types/field.ts`
- validation engine tests

## Acceptance Criteria

- [ ] `validator.custom(fn)` is available
- [ ] `validator.async(fn)` is available
- [ ] `validator.and(...rules)` is available
- [ ] `validator.or(...rules)` is available
- [ ] `validator.not(rule)` is available
- [ ] `validator.pipe(...rules)` is available
- [ ] `validator.when(predicate, rule)` is available
- [ ] `validator.bail()` is available
- [ ] `validator.optional(rule)`, `validator.nullable(rule)`, and `validator.nullish(rule)` are available
- [ ] `createValidator(name, fn)` is available
- [ ] `createTransform(name, fn)` is available

