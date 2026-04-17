# Add locale scoping and a message API on top of `errorMap()`

Repository: `runilib/react-formbridge`  
Suggested labels: `enhancement`, `validation-engine`

## Issue Body

## Summary

Build a first-class locale and message system on top of the existing `errorMap()` support so teams can centralize messages instead of wiring translation logic manually in every project.

## Why this would help

`errorMap(issue => message)` already gives a strong foundation, but a production-ready i18n story also needs:

- centralized default messages
- a locale registry
- interpolation helpers
- per-app, per-form, and per-field overrides

This is especially important for shared component libraries and multi-country products.

## Proposed API

```ts
setLocale({
  required: 'Ce champ est requis.',
  too_small: 'Doit contenir au moins {min} caractères.',
});

schema({
  name: field.text('Nom').required(),
}).message('required', { field: 'name' });
```

## Suggested implementation areas

- `src/types/validation.ts`
- `src/core/validators/issues.ts`
- `src/core/validators/schema.ts`
- form context / hook configuration
- i18n tests and docs

## Acceptance Criteria

- [ ] `setLocale(localeMap)` is available
- [ ] `message(code, params)` is available
- [ ] default messages are centralized
- [ ] parameter interpolation is consistent with `ValidationIssue.params`
- [ ] locale can be configured globally
- [ ] locale can be overridden per form
- [ ] locale can be overridden per field
- [ ] existing `errorMap()` support remains backward-compatible

