# Expand file and media validation helpers

Repository: `runilib/react-formbridge`  
Suggested labels: `enhancement`, `validation-engine`

## Issue Body

## Summary

Expand `field.file()` with the remaining validation helpers needed for production-grade upload workflows, especially media-specific constraints.

## Why this would help

The current file builder already covers `accept()`, `maxSize()`, and `multiple(max)`, but large upload flows typically also need:

- aggregate constraints across multiple files
- filename and MIME-specific rules
- image dimension checks
- media duration checks
- integrity rules such as uniqueness or empty-file protection

This issue intentionally excludes `minFiles(count)`, max total size, and extension support because those already have dedicated drafts.

## Proposed API

```ts
field
  .file('Gallery')
  .multiple(10)
  .imageDimensions({ minWidth: 1200, minHeight: 800 })
  .aspectRatio(16 / 9)
  .forbidEmptyFiles()
  .uniqueFiles('name');
```

## Suggested implementation areas

- `src/core/field-builders/file/FileFieldBuilder.ts`
- `src/core/field-builders/file/types.ts`
- `src/renderers/web/FileField.tsx`
- `src/renderers/native/FileField.tsx`
- file validation tests

## Acceptance Criteria

- [ ] aggregate helpers are available: `totalSizeMin()` and `exactFiles()`
- [ ] filename and type helpers are available: `mimeTypes()`, `fileNamePattern()`
- [ ] media helpers are available: `imageMinWidth()`, `imageMaxWidth()`, `imageMinHeight()`, `imageMaxHeight()`, `imageDimensions()`, `aspectRatio()`, `durationMin()`, `durationMax()`
- [ ] integrity helpers are available: `uniqueFiles()`, `forbidEmptyFiles()`, `customFile()`, `customFileAsync()`
- [ ] single-file and multi-file flows remain backward-compatible

