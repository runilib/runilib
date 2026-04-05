# Add lettersOnly() and alphanumeric() helpers to field.otp()

Repository: `runilib/react-formbridge`  
Suggested labels: `enhancement`, `good first issue`

## Issue Body

## Summary

Add `lettersOnly()` and `alphanumeric()` helpers to `field.otp()` so OTP inputs can support more than numeric codes.

## Why this would help

The OTP builder already supports `digitsOnly()`, but many real-world codes are not numeric-only.

Examples:

- email verification codes with letters and numbers
- invitation codes
- short access tokens

## Proposed API

```ts
field.otp('Invite code').length(6).alphanumeric();
field.otp('Letter code').length(4).lettersOnly();
```

## Suggested implementation areas

- `src/core/field-builders/otp/OtpFieldBuilder.ts`
- `src/renderers/web/Field.tsx`
- `src/renderers/native/Field.tsx`
- tests for validation and renderer behavior

## Acceptance Criteria

- [ ] `lettersOnly()` is available on `field.otp()`
- [ ] `alphanumeric()` is available on `field.otp()`
- [ ] OTP rendering still behaves correctly on web and native
- [ ] the renderer is not hard-coded to numeric-only input behavior for these modes
