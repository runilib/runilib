# Integration — formura v1.3 features

Two features: **Draft persistence** and **Reactive conditional fields**.

---

## Files to copy

```
formura-v13/src/persist/draft.ts        → formura/src/persist/draft.ts
formura-v13/src/persist/storage.ts      → formura/src/persist/storage.ts
formura-v13/src/conditions/conditions.ts → formura/src/conditions/conditions.ts
formura-v13/src/hooks/useForm.ts        → replace formura/src/hooks/useForm.ts
formura-v13/src/hooks/useFormWizard.ts  → formura/src/hooks/useFormWizard.ts

formura-v13/__tests__/persist.test.ts    → formura/__tests__/
formura-v13/__tests__/conditions.test.ts → formura/__tests__/
```

---

## Update formura/src/index.ts

Add to the exports:

```ts
// Persistence
export { usePersist, DraftManager }  from './persist/draft';
export { resolveAdapter }            from './persist/storage';
export type { PersistOptions }       from './persist/draft';
export type { StorageAdapter, StorageType } from './persist/storage';

// Conditions
export { ConditionMixin, evaluateAllConditions } from './conditions/conditions';
export type { FieldConditions, VisibilityMap }   from './conditions/conditions';

// Wizard
export { useFormWizard } from './hooks/useFormWizard';
export type { WizardStep, UseFormWizardOptions } from './hooks/useFormWizard';
```

---

## Update field.ts — add ConditionMixin to all builders

```ts
import { ConditionMixin } from '../conditions/conditions';

// Extend every field builder class with the ConditionMixin:
class StringFieldBuilder extends FieldBuilder<string> {
  // ... existing methods ...

  // Add all ConditionMixin methods:
  visibleWhen    = ConditionMixin.prototype.visibleWhen.bind(this);
  visibleWhenNot = ConditionMixin.prototype.visibleWhenNot.bind(this);
  visibleWhenAny = ConditionMixin.prototype.visibleWhenAny.bind(this);
  visibleWhenIn  = ConditionMixin.prototype.visibleWhenIn.bind(this);
  visibleWhenGte = ConditionMixin.prototype.visibleWhenGte.bind(this);
  requiredWhen   = ConditionMixin.prototype.requiredWhen.bind(this);
  requiredWhenAny = ConditionMixin.prototype.requiredWhenAny.bind(this);
  disabledWhen   = ConditionMixin.prototype.disabledWhen.bind(this);
  keepOnHide     = ConditionMixin.prototype.keepOnHide.bind(this);
  resetOnHide    = ConditionMixin.prototype.resetOnHide.bind(this);
  clearOnHide    = ConditionMixin.prototype.clearOnHide.bind(this);
  _conditions    = new ConditionMixin()._conditions;
}

// Or use a class mixin pattern:
function withConditions<T extends new(...args: any[]) => FieldBuilder<any>>(Base: T) {
  return class extends Base {
    _conditions = { visible: [], required: [], disabled: [], onHide: 'reset' as const };
    visibleWhen    = ConditionMixin.prototype.visibleWhen;
    // ... etc
  };
}
```

---

## Usage after integration

```ts
import { useForm, field, useFormWizard } from 'formura';

// Conditions — available on all field builders
const { Form, fields, visibility, hasDraft, clearDraft } = useForm(
  {
    accountType: field.select('Type').options(['personal','business']).required(),

    companyName: field.text('Company')
      .requiredWhen('accountType', 'business')
      .visibleWhen('accountType', 'business'),

    vatNumber: field.text('VAT')
      .visibleWhen('accountType', 'business')
      .visibleWhen('country', 'FR'),      // AND: both must pass

    teamSize: field.number('Team size')
      .visibleWhenIn('plan', ['pro', 'enterprise'])
      .visibleWhenGte('age', 18),         // AND: age >= 18

    bonusOffer: field.switch('Bonus offer')
      .visibleWhenAny([['plan', 'pro'], ['plan', 'enterprise']]),  // OR
  },
  {
    persist: {
      key:     'signup',
      storage: 'local',       // or 'session' or 'async' (RN)
      ttl:     3600,
      exclude: ['password'],
    },
  }
);

// Access visibility state
const { companyName: cn } = visibility;
// cn.visible   → true/false
// cn.required  → true/false (reactive)
// cn.disabled  → true/false

// Draft management
if (hasDraft) console.log('Restored from draft');
await clearDraft(); // after successful submission

// Wizard
const wizard = useFormWizard(steps, {
  onSubmit: async (allValues) => api.submit(allValues),
  persist:  { key: 'onboarding', storage: 'local', ttl: 86400 },
});
```

---

## Condition methods reference

| Method | Description |
|--------|-------------|
| `.visibleWhen(field, value)` | Show when `field === value` |
| `.visibleWhen(fn)` | Show when predicate returns true |
| `.visibleWhenNot(field, value)` | Show when `field !== value` |
| `.visibleWhenTruthy(field)` | Show when field is truthy |
| `.visibleWhenAny([[f,v], ...])` | Show when ANY pair matches (OR) |
| `.visibleWhenIn(field, values)` | Show when field value is in list |
| `.visibleWhenNotIn(field, values)` | Show when field value is NOT in list |
| `.visibleWhenGt(field, n)` | Show when field > n |
| `.visibleWhenGte(field, n)` | Show when field >= n |
| `.requiredWhen(field, value)` | Required when `field === value` |
| `.requiredWhenAny([[f,v], ...])` | Required when ANY pair matches |
| `.requiredWhenIn(field, values)` | Required when field is in list |
| `.disabledWhen(field, value)` | Disabled when `field === value` |
| `.disabledWhenIn(field, values)` | Disabled when field is in list |
| `.resetOnHide()` | Reset to default when hidden (default) |
| `.keepOnHide()` | Keep value when hidden |
| `.clearOnHide()` | Set to empty when hidden |

Chain `.visibleWhen()` multiple times for **AND** logic.
Use `.visibleWhenAny()` for **OR** logic.

---

## Persist options reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `key` | `string` | required | Storage key (namespaced automatically) |
| `storage` | `'local' \| 'session' \| 'async' \| StorageAdapter` | `'local'` | Storage backend |
| `ttl` | `number` | `3600` | Seconds before draft expires (0 = no expiry) |
| `exclude` | `string[]` | `[]` | Field names never saved (passwords, CVV...) |
| `debounce` | `number` | `800` | ms between value change and save |
| `version` | `string` | `'1'` | Bump to invalidate old drafts on schema change |
| `onRestore` | `(values) => void` | — | Called when draft is loaded |
| `onSaveError` | `(error) => void` | — | Called when storage write fails |
