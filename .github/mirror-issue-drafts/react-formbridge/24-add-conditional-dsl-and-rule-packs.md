# Expose the advanced conditional DSL and reusable rule packs

Repository: `runilib/react-formbridge`  
Suggested labels: `enhancement`, `validation-engine`

## Issue Body

## Summary

Expose the richer conditional capabilities already hinted at internally, and pair them with reusable rule-pack APIs so validation and visibility logic can be shared cleanly across schemas.

## Why this would help

The builder API already supports several conditional helpers, but the roadmap calls out more expressive variants plus reusable rule packs. Together these would make it much easier to share product-specific logic such as:

- complex onboarding visibility rules
- country- or role-specific requirements
- reusable presets across apps

## Proposed API

```ts
const billingPack = createRulePack('billing', () => ({
  country: field.select('Country').required(),
  vatNumber: field.text('VAT').requiredWhenIn('country', ['FR', 'DE']),
}));

schema({
  role: field.select('Role').options(['user', 'admin']),
  quota: field.number('Quota').visibleWhenGt('roleLevel', 2),
}).use(billingPack);
```

## Suggested implementation areas

- `src/core/conditions/conditions.ts`
- `src/core/field-builders/base/BaseFieldBuilder.ts`
- `src/core/field-builders/file/FileFieldBuilder.ts`
- new rule-pack helpers under `src/core/validators/`
- types and docs

## Acceptance Criteria

- [ ] conditional helpers are available: `visibleWhenIn()`, `visibleWhenNotIn()`, `visibleWhenGt()`, `visibleWhenGte()`, `visibleWhenLt()`, `visibleWhenLte()`, `requiredWhenIn()`, `disabledWhenIn()`, `when(condition, cb)`
- [ ] reusable pack helpers are available: `validator.pack(name, rules)`, `schema.use(rulePack)`, `field.use(rulePack)`
- [ ] `createRulePack(name, factory)` is available
- [ ] existing conditional helpers remain backward-compatible
- [ ] conditions and rule packs work across web and native builders

