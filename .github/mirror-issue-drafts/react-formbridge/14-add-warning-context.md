# Add warning-aware validation issues with `ctx.addWarning()` and `ctx.abort()`

Repository: `runilib/react-formbridge`  
Suggested labels: `enhancement`, `validation-engine`

## Issue Body

## Summary

Extend the validation engine so schema refinements and custom validators can emit non-blocking warnings and stop further validation when appropriate.

## Why this would help

The current engine has a solid `ValidationIssue` / `ValidationResult` base, but it only models blocking errors. Product forms often need:

- soft warnings
- suggestions
- expensive validation chains that should stop early
- richer issue severity for UI and analytics

This is also a prerequisite for a more complete UX around i18n, async validation, and form-level feedback.

## Proposed API

```ts
schema({
  password: field.password('Password').required(),
}).superRefine((values, ctx) => {
  if (values.password?.includes('123')) {
    ctx.addWarning({
      path: ['password'],
      code: 'weak_pattern',
      message: 'This password is easy to guess.',
    });
  }

  if (!values.password) {
    ctx.abort();
  }
});
```

## Suggested implementation areas

- `src/types/validation.ts`
- `src/core/validators/issues.ts`
- `src/core/validators/schema.ts`
- `src/core/validators/engine.ts`
- `src/core/validators/schema.test.ts`

## Acceptance Criteria

- [ ] `ValidationIssue` supports severity or an equivalent error-vs-warning distinction
- [ ] `ValidationContext` exposes `addWarning(issue)`
- [ ] `ValidationContext` exposes `abort()`
- [ ] `ValidationResult` includes warnings without breaking existing error flows
- [ ] `safeParse()` can still succeed when only warnings are produced
- [ ] sync and async refinement flows honor `abort()` consistently

