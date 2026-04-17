# Add advanced cross-field helpers and complete reference comparisons

Repository: `runilib/react-formbridge`  
Suggested labels: `enhancement`, `validation-engine`

## Issue Body

## Summary

Complete the remaining schema-level business rules so cross-field validation can cover more real product workflows without custom refinement code.

## Why this would help

The library already supports `atLeastOne()`, `exactlyOne()`, `allOrNone()`, `dateRange()`, and basic reference comparisons, but several common helpers are still missing:

- “these two fields must differ”
- “at most one of these is allowed”
- “these fields must travel together”
- aggregate numeric comparisons across several fields

This is one of the strongest reasons teams still reach for Yup or Zod in complex forms.

## Proposed API

```ts
schema({
  personalEmail: field.email('Personal email'),
  workEmail: field.email('Work email'),
  budgetA: field.number('Budget A'),
  budgetB: field.number('Budget B'),
})
  .atMostOne(['personalEmail', 'workEmail'])
  .sumMax(['budgetA', 'budgetB'], 1000);
```

## Suggested implementation areas

- `src/core/validators/schema.ts`
- `src/core/validators/reference.ts`
- reference-based builder helpers
- `src/core/validators/schema.test.ts`

## Acceptance Criteria

- [ ] `differentFrom(ref)` is available on relevant field builders
- [ ] `schema.atMostOne([...fields], message?)` is available
- [ ] `schema.requireTogether([...fields], message?)` is available
- [ ] `schema.forbidTogether([...fields], message?)` is available
- [ ] `schema.sumMax(fields, max, message?)` is available
- [ ] `schema.sumMin(fields, min, message?)` is available
- [ ] `schema.compare(left, operator, right, message?)` is available
- [ ] nested references such as `ref('address.city')` are documented and covered by tests

