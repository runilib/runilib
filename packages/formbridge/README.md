# formbridge

> Cross-platform form state management for **React** and **React Native** — same API on both.

[![npm](https://img.shields.io/npm/v/formbridge)](https://npmjs.com/package/formbridge)
[![license](https://img.shields.io/npm/l/formbridge)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6)](https://www.typescriptlang.org/)

---

## Features

| | |
|---|---|
| ✅ | **Same API** — `useForm`, `register`, `handleSubmit` work identically on web and native |
| 🔷 | **TypeScript-first** — 100% typed, generic over your form shape |
| 🧪 | **Built-in validators** — required, min, max, minLength, maxLength, pattern, custom async |
| 🎯 | **Preset validators** — email, url, strongPassword, phoneFR, numeric... |
| 🧩 | **Controller** — for custom inputs (pickers, sliders, date pickers) |
| 🌳 | **FormProvider** — share form context in deeply nested components |
| ⚡ | **Validation modes** — `onChange` · `onBlur` · `onSubmit` · `onTouched` · `all` |

---

## Install

```bash
npm install formbridge
```

**React Native:** no extra peer deps needed beyond `react-native` itself.

---

## Quick Start

### React (web)

```tsx
import { useForm, ErrorMessage } from 'formbridge';

export default function LoginForm() {
  const form = useForm({
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  });

  const onSubmit = form.handleSubmit((values) => {
    console.log('✅', values);
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      <input {...form.register('email', { required: true, pattern: /^[^\s@]+@[^\s@]+$/ })} />
      <ErrorMessage error={form.formState.errors.email} />

      <input {...form.register('password', { required: true, minLength: 8 })} type="password" />
      <ErrorMessage error={form.formState.errors.password} />

      <button type="submit">Log in</button>
    </form>
  );
}
```

### React Native (exact same logic, just different elements)

```tsx
import { useForm, ErrorMessage } from 'formbridge';
import type { NativeFieldProps } from 'formbridge';

export default function LoginForm() {
  const form = useForm({
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  });

  return (
    <View>
      <TextInput {...form.register('email', { required: true }) as NativeFieldProps} />
      <ErrorMessage error={form.formState.errors.email} />

      <TextInput {...form.register('password', { required: true, minLength: 8 }) as NativeFieldProps} secureTextEntry />
      <ErrorMessage error={form.formState.errors.password} />

      <TouchableOpacity onPress={form.handleSubmit((v) => console.log(v))}>
        <Text>Log in</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## API Reference

### `useForm<T>(options?)`

```ts
const {
  register,      // (name, rules?) => web input props | native TextInput props
  handleSubmit,  // (onValid, onInvalid?) => () => Promise<void>
  setValue,      // (name, value, opts?) => void
  getValue,      // (name) => value
  getValues,     // () => all values
  trigger,       // (name?) => Promise<boolean>
  setError,      // (name, { message }) => void
  clearErrors,   // (name?) => void
  reset,         // (values?) => void
  watch,         // (name) => value
  watchAll,      // () => all values
  formState,     // { values, errors, touched, dirty, isValid, isDirty, isSubmitting, ... }
  Controller,    // controlled field component
} = useForm({ defaultValues, mode, reValidateMode });
```

### Validation modes

| Mode | When validation runs |
|------|----------------------|
| `onSubmit` | Only when form is submitted *(default)* |
| `onBlur` | When a field loses focus |
| `onChange` | On every keystroke |
| `onTouched` | After the first blur, then on every change |
| `all` | On every change and blur |

### Built-in rules

```ts
register('name', {
  required:  true | 'Custom message',
  min:       18   | { value: 18, message: 'Must be 18+' },
  max:       99,
  minLength: 3    | { value: 3, message: 'Too short' },
  maxLength: 50,
  pattern:   /^\d+$/ | { value: /^\d+$/, message: 'Digits only' },
  validate:  (value, allValues) => value !== 'admin' ? null : 'Username taken',
  // Multiple named validators:
  validate: {
    notAdmin:  (v) => v !== 'admin'    ? null : 'Username taken',
    notEmpty:  (v) => v.trim().length > 0 ? null : 'Cannot be blank',
  },
})
```

### Preset validators

```ts
import { validators } from 'formbridge';

register('email',    validators.email)
register('website',  validators.url)
register('phone',    validators.phoneFR)
register('code',     validators.numeric)
register('password', validators.strongPassword)
register('username', validators.alphanumeric)
```

### Controller (for custom inputs)

```tsx
<form.Controller
  name="country"
  rules={{ required: 'Please select a country.' }}
  defaultValue=""
  render={({ field, fieldState }) => (
    <CountryPicker
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={fieldState.error}
      invalid={fieldState.invalid}
    />
  )}
/>
```

### FormProvider + useFormContext

```tsx
// Wrap
<FormProvider form={form}>
  <DeepChildComponent />
</FormProvider>

// Consume anywhere in the tree
function DeepChildComponent() {
  const { register, formState } = useFormContext<MyForm>();
  return <input {...register('email')} />;
}
```

### ErrorMessage

```tsx
// Web → renders a <p> with role="alert"
// Native → renders a <Text> with accessibilityRole="alert"
<ErrorMessage error={formState.errors.email} />

// Custom renderer
<ErrorMessage
  error={formState.errors.email}
  render={(msg) => <MyErrorText>{msg}</MyErrorText>}
/>
```

### useField (standalone, no form)

```tsx
const { value, error, touched, inputProps, textInputProps, setValue, validate } = useField({
  defaultValue: '',
  rules: { required: true, minLength: 3 },
});

// Web
<input {...inputProps} />

// Native
<TextInput {...textInputProps} />
```

---

## TypeScript

```ts
import type {
  FormValues,           // { [key: string]: FieldValue }
  FieldRules,           // built-in rule shapes
  FormState,            // { values, errors, touched, dirty, isValid, ... }
  UseFormReturn,        // full return type of useForm()
  ControllerRenderProps,// field + onChange + onBlur
  ControllerFieldState, // error + touched + dirty + invalid
  NativeFieldProps,     // for casting register() on RN
  WebFieldProps,        // for casting register() on web
} from 'formbridge';
```

---

## License

MIT © AKS
