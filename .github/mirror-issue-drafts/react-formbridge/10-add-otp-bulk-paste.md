# Add bulk paste support for OTP inputs on web and native

Repository: `runilib/react-formbridge`  
Suggested labels: `enhancement`, `good first issue`

## Issue Body

## Summary

Add bulk paste support so users can paste an entire OTP code and have it fill the individual slots automatically.

## Why this would help

OTP fields already support per-character typing, but many users copy/paste verification codes from SMS or email. This would noticeably improve the UX of login and verification flows.

## Expected behavior

Examples:

- pasting `123456` into a 6-digit OTP fills all slots
- extra characters are ignored
- current single-character typing behavior still works

## Suggested implementation areas

- `src/renderers/web/Field.tsx`
- `src/renderers/native/Field.tsx`
- OTP-related tests

## Acceptance Criteria

- [ ] pasting a full code fills multiple OTP slots automatically
- [ ] overflow is truncated to the configured OTP length
- [ ] single-character typing still behaves as it does now
- [ ] the feature works for both numeric and non-numeric OTP configurations
