# Integration Guide

These files add three unique features to your existing **formbridge** package.
No existing code is modified — you just add files and update the exports.

---

## Files to add

```
Copy these into your formbridge/src/ :

formbridge-extras/src/builders/infer.ts          → formbridge/src/builders/infer.ts
formbridge-extras/src/builders/dynamic.ts         → formbridge/src/builders/dynamic.ts
formbridge-extras/src/hooks/useDynamicForm.ts     → formbridge/src/hooks/useDynamicForm.ts
formbridge-extras/src/hooks/useReadonlyForm.ts    → formbridge/src/hooks/useReadonlyForm.ts
formbridge-extras/src/components/web/WebReadonlyField.tsx   → formbridge/src/components/web/
formbridge-extras/src/components/native/NativeReadonlyField.tsx → formbridge/src/components/native/

Copy tests:
formbridge-extras/__tests__/infer.test.ts    → formbridge/__tests__/
formbridge-extras/__tests__/dynamic.test.ts  → formbridge/__tests__/
formbridge-extras/__tests__/readonly.test.ts → formbridge/__tests__/

Copy examples:
formbridge-extras/examples/infer-example.tsx    → formbridge/examples/
formbridge-extras/examples/dynamic-example.tsx  → formbridge/examples/
formbridge-extras/examples/readonly-example.tsx → formbridge/examples/
```

---

## Update formbridge/src/index.ts

Add these exports at the bottom of your existing `index.ts`:

```ts
// ─── field.infer() & field.inferType() ──────────────────────────────────────
export { inferFromObject, inferFromType }  from './builders/infer';
export type { InferFieldOptions, InferOverrides } from './builders/infer';

// ─── Dynamic / JSON-driven forms ─────────────────────────────────────────────
export { parseDynamicForm, parseJsonSchema } from './builders/dynamic';
export { useDynamicForm }                    from './hooks/useDynamicForm';
export type {
  JsonFormDefinition,
  JsonFieldDescriptor,
  JsonFieldType,
  JsonValidationRule,
} from './builders/dynamic';

// ─── Readonly & diff mode ─────────────────────────────────────────────────────
export { useReadonlyForm }  from './hooks/useReadonlyForm';
export type {
  UseReadonlyFormOptions,
  UseReadonlyFormReturn,
  FieldReadonlyState,
  ReadonlyFieldProps,
  ReadonlyMode,
} from './hooks/useReadonlyForm';
```

---

## Optional: attach infer() to the field namespace

In `formbridge/src/builders/field.ts`, add at the bottom:

```ts
import { inferFromObject, inferFromType } from './infer';

// Extend the field namespace
export const field = {
  // ... existing methods ...
  text, email, password, number, tel, url, textarea,
  checkbox, switch: switchFn, select, radio, date, otp, custom,

  // NEW
  infer:     inferFromObject,
  inferType: inferFromType,
};
```

Then users can write:
```ts
const schema = field.infer(existingUser, { email: { required: true } });
const schema = field.inferType<User>({ name: { label: 'Name', required: true } });
```

---

## That's it

After copying the files and updating the exports, all three features are available:

```ts
import {
  useForm, field,
  inferFromObject, inferFromType,   // feature 1
  parseDynamicForm, useDynamicForm, // feature 2
  useReadonlyForm,                  // feature 3
} from 'formbridge';
```
