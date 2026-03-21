# Integration — formura v1.2 features

This package adds 3 new features to your existing formura package.
No existing files need to be modified except `field.ts`, `useForm.ts`, and `index.ts`.

---

## Step 1 — Copy files

```
formura-v12/src/fields/mask/       → formura/src/fields/mask/
formura-v12/src/fields/password/   → formura/src/fields/password/
formura-v12/src/fields/file/       → formura/src/fields/file/
formura-v12/src/components/web/WebMaskedInput.tsx   → formura/src/components/web/
formura-v12/src/components/web/WebPasswordStrength.tsx → formura/src/components/web/
formura-v12/src/components/web/WebFileField.tsx     → formura/src/components/web/
formura-v12/src/components/native/NativeMaskedInput.tsx → formura/src/components/native/
formura-v12/src/components/native/NativePasswordStrength.tsx → formura/src/components/native/
formura-v12/src/components/native/NativeFileField.tsx → formura/src/components/native/
formura-v12/__tests__/masks.test.ts     → formura/__tests__/
formura-v12/__tests__/strength.test.ts  → formura/__tests__/
```

---

## Step 2 — Update field.ts

Add to the bottom of `formura/src/builders/field.ts`:

```ts
import { MaskedFieldBuilder, MASKS } from './mask/MaskedField';
import { FileFieldBuilder }           from './file/FileField';

// Extend the field namespace
export const field = {
  // ... existing: text, email, password, number, tel, url, textarea,
  //               checkbox, switch, select, radio, date, otp, custom

  // NEW in v1.2
  masked: (label: string, pattern: string) =>
    new MaskedFieldBuilder(label, pattern),

  file: (label: string) =>
    new FileFieldBuilder(label),
};

// Re-export for direct use
export { MaskedFieldBuilder, MASKS, FileFieldBuilder };
```

Also add `.withStrengthIndicator()` to PasswordFieldBuilder:

```ts
import { PasswordStrengthMixin } from './password/PasswordWithStrength';

// Extend PasswordFieldBuilder with the mixin
class PasswordFieldBuilder extends StringFieldBuilder {
  // ... existing: constructor, strong()

  withStrengthIndicator(options: ...) {
    // call PasswordStrengthMixin.withStrengthIndicator()
    // and merge _strength into descriptor on _build()
  }
}
```

---

## Step 3 — Update useForm.ts field renderer

In the `fields` section of `useForm.ts`, add these checks before calling WebField/NativeField:

```ts
// After: if (desc._customRender) ...
// Before: if (isWeb) ...

// Check for masked field
if (isMaskedDescriptor(desc)) {
  if (isWeb) {
    const { WebMaskedInput } = require('../components/web/WebMaskedInput');
    return React.createElement(WebMaskedInput, { descriptor: desc, ...renderProps, extra });
  }
  const { NativeMaskedInput } = require('../components/native/NativeMaskedInput');
  return React.createElement(NativeMaskedInput, { descriptor: desc, ...renderProps, extra });
}

// Check for file field
if (isFileDescriptor(desc)) {
  if (isWeb) {
    const { WebFileField } = require('../components/web/WebFileField');
    return React.createElement(WebFileField, { descriptor: desc, ...renderProps, extra });
  }
  const { NativeFileField } = require('../components/native/NativeFileField');
  return React.createElement(NativeFileField, { descriptor: desc, ...renderProps, extra });
}

// Check for password with strength
if (desc._type === 'password' && isStrengthDescriptor(desc)) {
  if (isWeb) {
    const { WebPasswordStrength } = require('../components/web/WebPasswordStrength');
    return React.createElement(WebPasswordStrength, { strengthMeta: desc, ...renderProps, extra });
  }
  const { NativePasswordStrength } = require('../components/native/NativePasswordStrength');
  return React.createElement(NativePasswordStrength, { strengthMeta: desc, ...renderProps, extra });
}
```

---

## Step 4 — Update index.ts

Append to `formura/src/index.ts`:

```ts
// ─── v1.2 features ────────────────────────────────────────────────────────────
export { MaskedFieldBuilder, MASKS, applyMask, extractRaw, maskCompleteValidator }
  from './fields/mask/MaskedField';
export type { MaskPreset, MaskResult }
  from './fields/mask/masks';

export { scorePassword, STRENGTH_CONFIG_STRICT, STRENGTH_CONFIG_SIMPLE, STRENGTH_CONFIG_FR }
  from './fields/password/strength';
export type { StrengthResult, StrengthConfig, StrengthScoreLevel }
  from './fields/password/strength';

export { FileFieldBuilder }
  from './fields/file/FileField';
export type { FileValue, FileSourceType }
  from './fields/file/FileField';
```

---

## Step 5 — Add peer deps for file upload (optional)

In `package.json` of formura, add to `peerDependenciesMeta`:

```json
{
  "peerDependenciesMeta": {
    "expo-image-picker":     { "optional": true },
    "expo-document-picker":  { "optional": true }
  }
}
```

Users only need these if they use `field.file()` on React Native.
On web, the native File API is used directly — no extra deps.

---

## Usage after integration

```ts
import { useForm, field, MaskedFieldBuilder, FileFieldBuilder, MASKS,
         STRENGTH_CONFIG_FR } from 'formura';

const { Form, fields } = useForm({
  // Masked input
  phone:    new MaskedFieldBuilder('Phone', MASKS.PHONE_FR).required(),
  card:     new MaskedFieldBuilder('Card', MASKS.CARD_16).validateComplete(),
  iban:     new MaskedFieldBuilder('IBAN', MASKS.IBAN_FR).uppercase(),

  // Password with strength indicator
  password: field.password('Password')
              .required()
              .withStrengthIndicator({
                showRules: true,
                config:    STRENGTH_CONFIG_FR,
              }),

  // File upload
  photo:    FileFieldBuilder.profilePhoto().required(),
  docs:     FileFieldBuilder.attachments('Documents', 5),
});
```

That's it. All 3 features are self-contained — they extend the existing
field system without breaking any existing code.
