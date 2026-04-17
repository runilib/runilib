# Expand string validator coverage

Repository: `runilib/react-formbridge`  
Suggested labels: `enhancement`, `validation-engine`

## Issue Body

## Summary

Round out the string validation API so common product, networking, and content-format checks can be expressed natively.

## Why this would help

The library now covers core string helpers like `nonEmpty()`, `length()`, `between()`, `oneOf()`, and `notOneOf()`, but many day-to-day rules still require custom validators. This is one of the fastest ways to reduce fallback to external validation libraries.

## Proposed API

```ts
field.text('Slug').trim().slug();
field.text('Display name').trim().normalizeWhitespace().wordCountMax(4);
field.url('Website').url({ protocols: ['https'] });
field.email('Email').email({ allowPlus: true }).emailDomain(['company.com']);
```

## Suggested implementation areas

- `src/core/field-builders/string/StringFieldBuilder.ts`
- `src/core/field-builders/string/EmailFieldBuilder.ts`
- shared string validation tests
- docs examples

## Acceptance Criteria

- [ ] content helpers are available: `startsWith()`, `endsWith()`, `includes()`, `notIncludes()`, `noWhitespace()`, `trimStart()`, `trimEnd()`, `normalizeWhitespace()`, `wordCountMin()`, `wordCountMax()`, `lineCountMax()`
- [ ] generic format helpers are available: `alpha()`, `numeric()`, `alphanumeric()`, `ascii()`, `unicode()`, `slug()`, `uuid()`, `cuid()`, `ulid()`, `hex()`, `hexColor()`, `base64()`, `jsonString()`
- [ ] network and web helpers are available: `hostname()`, `domain()`, `fqdn()`, `ip()`, `ipv4()`, `ipv6()`, `macAddress()`, `url(options)`, `email(options)`, `emailDomain(...)`
- [ ] business-format helpers are available: `creditCard()`, `iban()`, `bic()`, `postalCode()`, `vatNumber()`, `siret()`, `siren()`, `phone(...)`, `semver()`
- [ ] casing helpers are available: `mustBeLowercase()`, `mustBeUppercase()`, `capitalize()`, `titleCase()`
- [ ] existing string helpers remain backward-compatible

