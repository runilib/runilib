# Support file extensions like .pdf and .csv in field.file().accept()

Repository: `runilib/react-formbridge`  
Suggested labels: `enhancement`, `good first issue`

## Issue Body

## Summary

Extend `field.file().accept()` so it supports file extensions such as `.pdf`, `.csv`, and `.xlsx` in addition to MIME types and wildcards.

## Why this would help

Many developers naturally expect this API to work:

```ts
field.file('Document').accept(['.pdf', '.csv']);
```

Web file inputs already support extension-based accept values, but library-side validation should also understand them.

## Proposed API

```ts
field.file('Import file').accept(['.csv', '.xlsx']);
field.file('Attachment').accept(['.pdf', 'image/*']);
```

## Suggested implementation areas

- `src/core/field-builders/file/FileField.ts`
- `src/renderers/web/FileField.tsx`
- docs/examples

## Acceptance Criteria

- [ ] `.accept(['.pdf', '.csv'])` works
- [ ] mixed values like `['.pdf', 'image/*']` work
- [ ] validation checks both MIME type and filename extension when relevant
- [ ] web `accept` attribute output remains correct
