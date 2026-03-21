# Integration Guide

These files add three unique features to your existing **formura** package.
No existing code is modified — you just add files and update the exports.

---

## Files to add

```
Copy these into your formura/src/ :

formura-extras/src/builders/infer.ts          → formura/src/builders/infer.ts
formura-extras/src/builders/dynamic.ts         → formura/src/builders/dynamic.ts
formura-extras/src/hooks/useDynamicForm.ts     → formura/src/hooks/useDynamicForm.ts
formura-extras/src/hooks/useReadonlyForm.ts    → formura/src/hooks/useReadonlyForm.ts
formura-extras/src/components/web/WebReadonlyField.tsx   → formura/src/components/web/
formura-extras/src/components/native/NativeReadonlyField.tsx → formura/src/components/native/

Copy tests:
formura-extras/__tests__/infer.test.ts    → formura/__tests__/
formura-extras/__tests__/dynamic.test.ts  → formura/__tests__/
formura-extras/__tests__/readonly.test.ts → formura/__tests__/

Copy examples:
formura-extras/examples/infer-example.tsx    → formura/examples/
formura-extras/examples/dynamic-example.tsx  → formura/examples/
formura-extras/examples/readonly-example.tsx → formura/examples/
```

---

## Update formura/src/index.ts

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

In `formura/src/builders/field.ts`, add at the bottom:

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
} from 'formura';
```
