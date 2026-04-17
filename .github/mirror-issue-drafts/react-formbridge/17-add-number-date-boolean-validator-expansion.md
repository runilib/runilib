# Expand number, date/time, and boolean validator coverage

Repository: `runilib/react-formbridge`  
Suggested labels: `enhancement`, `validation-engine`

## Issue Body

## Summary

Complete the remaining scalar validators for numbers, dates, and booleans so common business constraints can be expressed natively.

## Why this would help

The package already covers the most urgent scalar gaps, but several common constraints are still missing for finance, scheduling, and consent workflows.

## Proposed API

```ts
field.number('Port').port();
field.number('Amount').currency({ scale: 2 }).nonPositive();
field.date('Launch date').afterOrEqual(new Date()).businessDay();
field.checkbox('Archived').mustBeFalse();
```

## Suggested implementation areas

- `src/core/field-builders/number/NumberFieldBuilder.ts`
- `src/core/field-builders/date/DateFieldBuilder.ts`
- `src/core/field-builders/boolean/BooleanFieldBuilder.ts`
- scalar validation tests

## Acceptance Criteria

- [ ] number helpers are available: `negative()`, `nonPositive()`, `finite()`, `safe()`, `precision()`, `scale()`, `coerce()`, `port()`, `currency(options?)`
- [ ] date/time helpers are available: `beforeOrEqual()`, `afterOrEqual()`, `todayOrBefore()`, `todayOrAfter()`, `weekdayOnly()`, `businessDay()`
- [ ] boolean helpers are available: `mustBeFalse()`, `isTrue()`, `isFalse()`
- [ ] the new helpers produce stable validation codes and messages
- [ ] existing scalar helpers remain backward-compatible

