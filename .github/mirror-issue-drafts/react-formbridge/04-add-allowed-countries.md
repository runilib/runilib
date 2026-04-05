# Add allowedCountries(codes) support to field.phone()

Repository: `runilib/react-formbridge`  
Suggested labels: `enhancement`, `good first issue`

## Issue Body

## Summary

Add an `allowedCountries(codes)` helper to `field.phone()` to restrict the country picker to a specific subset.

## Why this would help

`preferredCountries()` already exists, but it only changes ordering. There is currently no first-class way to restrict the picker to a region-specific set such as:

- EU-only countries
- North America only
- a business-specific supported market list

## Proposed API

```ts
field.phone('Phone').allowedCountries(['FR', 'BE', 'CH']);
```

## Suggested implementation areas

- `src/core/field-builders/phone/PhoneFieldBuilder.ts`
- `src/renderers/web/PhoneInput.tsx`
- `src/renderers/native/PhoneInput.tsx`
- tests around filtering and fallback behavior

## Acceptance Criteria

- [ ] `allowedCountries(codes)` is available on `field.phone()`
- [ ] the picker only shows the allowed countries
- [ ] `preferredCountries()` still works within the allowed subset
- [ ] default-country fallback is handled cleanly when the configured default country is not allowed
