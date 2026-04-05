# Add maxTotalSize(bytes) support to field.file()

Repository: `runilib/react-formbridge`  
Suggested labels: `enhancement`, `good first issue`

## Issue Body

## Summary

Add a `maxTotalSize(bytes)` helper to `field.file()` so forms can validate the combined size of all selected files.

## Why this would help

The current file builder supports a per-file size limit, but not a total payload limit. Many upload APIs cap the entire request size rather than each individual file.

Useful examples:

- up to 10 files, but no more than 20 MB total
- multiple images allowed, but total upload must stay below a backend threshold

## Proposed API

```ts
field.file('Attachments').multiple(10).maxTotalSize(20 * 1024 * 1024);
```

## Suggested implementation areas

- `src/core/field-builders/file/FileField.ts`
- file validation tests
- README docs around file constraints

## Acceptance Criteria

- [ ] `maxTotalSize(bytes)` is available on `field.file()`
- [ ] validation sums the size of all selected files
- [ ] validation fails when the combined size exceeds the configured limit
- [ ] existing `maxSize(bytes)` behavior stays unchanged
