# Add a remote validation runtime with abort, dedupe, debounce, and TTL caching

Repository: `runilib/react-formbridge`  
Suggested labels: `enhancement`, `validation-engine`

## Issue Body

## Summary

Standardize async and server-backed validation so common workflows like uniqueness checks, availability checks, and remote business rules no longer require ad-hoc app-level orchestration.

## Why this would help

`validateAsync()` and `refineAsync()` exist, but there is still no standardized runtime for:

- cancellation
- stale-response protection
- in-flight deduplication
- TTL caching
- dependency-aware revalidation

Without this, every app ends up reinventing its own async validation layer.

## Proposed API

```ts
field.text('Username').remote({
  key: 'username-availability',
  debounce: 400,
  ttl: 30_000,
  dependsOn: ['tenantId'],
  fetch: async ({ value, values, signal }) => {
    const result = await api.checkUsername({ value, tenantId: values.tenantId, signal });
    return result.available ? null : 'Username is already taken.';
  },
});
```

## Suggested implementation areas

- `src/core/field-builders/base/BaseFieldBuilder.ts`
- `src/core/validators/engine.ts`
- `src/core/utils/debounce.ts`
- `src/hooks/shared/useFormBridgeCore.ts`
- `src/types/field.ts`
- async validation tests

## Acceptance Criteria

- [ ] public helpers are available: `remote(...)`, `unique(...)`, `availability(...)`
- [ ] `AbortSignal` is passed into remote validators
- [ ] identical in-flight requests are deduplicated
- [ ] stale responses are ignored safely
- [ ] TTL caching is available and configurable
- [ ] debounce is configurable at the remote-validation level
- [ ] dependency-based partial revalidation is supported
- [ ] validation mode can differentiate `validateFirst` vs `collectAll`

