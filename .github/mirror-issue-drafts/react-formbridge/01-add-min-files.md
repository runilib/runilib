# Add minFiles(count) support to field.file()

Repository: `runilib/react-formbridge`  
Suggested labels: `enhancement`, `good first issue`

## Issue Body

## Summary

Add a `minFiles(count)` helper to `field.file()` so forms can require a minimum number of uploaded files.

## Why this would help

`field.file()` already supports `multiple(max)` and `maxSize(bytes)`, but there is no first-class way to express requirements like:

- upload at least 2 screenshots
- attach at least 1 supporting document

Right now this requires custom validation for a very common file-upload use case.

## Proposed API

```ts
field.file('Attachments').multiple(5).minFiles(2);
```

## Suggested implementation areas

- `src/core/field-builders/file/FileField.ts`
- file validation tests
- README examples if needed

## Acceptance Criteria

- [ ] `minFiles(count)` is available on `field.file()`
- [ ] validation fails when fewer than `count` files are selected
- [ ] validation passes when the minimum is reached
- [ ] the feature remains backward-compatible with existing single-file and multi-file flows
