# Add onExpire callbacks for persisted drafts and wizard state

Repository: `runilib/react-formbridge`  
Suggested labels: `enhancement`, `good first issue`

## Issue Body

## Summary

Add optional `onExpire` callbacks for persisted form drafts and wizard state when TTL-based persisted data expires.

## Why this would help

Persistence already supports TTL, but expired data is currently dropped silently. Some apps may want to:

- notify the user that a saved draft expired
- refresh dynamic defaults
- record analytics when an old draft is discarded

## Proposed API

Possible direction:

```ts
persist: {
  key: 'checkout',
  ttl: 3600,
  onExpire: () => {
    // notify user or log analytics
  },
}
```

## Suggested implementation areas

- `src/core/persist/draft.ts`
- `src/core/persist/wizard.ts`
- `src/hooks/shared/useFormBridgeWizard.ts`
- typings for persist options

## Acceptance Criteria

- [ ] draft expiration can trigger an optional callback
- [ ] wizard-state expiration can trigger an optional callback
- [ ] expired storage is still cleared
- [ ] current behavior remains unchanged when no callback is configured
