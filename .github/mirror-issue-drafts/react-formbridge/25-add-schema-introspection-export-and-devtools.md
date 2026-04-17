# Add schema introspection, export, and validation debug tooling

Repository: `runilib/react-formbridge`  
Suggested labels: `enhancement`, `validation-engine`

## Issue Body

## Summary

Add tooling to inspect schemas, export what can be serialized, and debug validation execution more easily during development.

## Why this would help

As the validation engine grows, developers need better observability and interoperability:

- introspect a schema for docs or admin tooling
- export serializable rules
- trace which validators ran
- surface better errors when a rule is misconfigured

These tools also make it easier to build ecosystem features around `react-formbridge`.

## Proposed API

```ts
const description = userSchema.describe();
const snapshot = userSchema.toJSON();
const jsonSchema = userSchema.toJSONSchema();

userSchema.debugValidation({ values });
```

## Suggested implementation areas

- `src/core/validators/schema.ts`
- new schema-introspection helpers
- `src/types/schema.ts`
- validation graph tests / snapshot tests
- docs for export caveats

## Acceptance Criteria

- [ ] `describe()` is available for schema introspection
- [ ] `toJSON()` is available for serializable rule export
- [ ] `toJSONSchema()` is available when representation is possible
- [ ] `debugValidation()` is available to trace executed rules
- [ ] misconfigured rules produce clearer developer-facing errors
- [ ] validation graph snapshot coverage is added

