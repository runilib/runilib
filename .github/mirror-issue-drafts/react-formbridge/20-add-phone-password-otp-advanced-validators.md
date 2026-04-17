# Add advanced phone, password, and OTP validators

Repository: `runilib/react-formbridge`  
Suggested labels: `enhancement`, `validation-engine`

## Issue Body

## Summary

Fill the remaining advanced validation gaps for phone, password, and OTP fields so auth and onboarding flows can stay fully native to `react-formbridge`.

## Why this would help

These fields are common enough to deserve stronger built-in support:

- phone input restrictions by line type or formatting mode
- password policy requirements beyond `strong()`
- OTP ergonomics and explicit aliases for exact-length constraints

This issue intentionally excludes `allowedCountries()` plus OTP `lettersOnly()` / `alphanumeric()` because those already have dedicated drafts.

## Proposed API

```ts
field.phone('Phone').mobileOnly().e164();

field
  .password('Password')
  .minLowercase(1)
  .minUppercase(1)
  .minDigits(1)
  .minSymbols(1)
  .forbidPersonalInfo(['email', 'firstName']);

field.otp('Code').exactLength(6);
```

## Suggested implementation areas

- `src/core/field-builders/phone/PhoneFieldBuilder.ts`
- `src/core/field-builders/password/PasswordFieldBuilder.ts`
- `src/core/field-builders/otp/OtpFieldBuilder.ts`
- related renderer and validation tests

## Acceptance Criteria

- [ ] phone helpers are available: `blockedCountries()`, `mobileOnly()`, `landlineOnly()`, `e164()`, `national()`
- [ ] password helpers are available: `minLowercase()`, `minUppercase()`, `minDigits()`, `minSymbols()`, `noSpaces()`, `entropy()`, `forbidSequentialChars()`, `forbidRepeatedChars()`, `forbidPersonalInfo()`, `notCompromised()`
- [ ] OTP exposes `exactLength()` or a documented equivalent alias over the existing exact-length behavior
- [ ] the new validators integrate cleanly with existing password strength and phone-format flows

