# formura

> **Schema-first, cross-platform forms for React and React Native.**
> One schema. One API. Every platform. No duplicated logic ever.

[![npm](https://img.shields.io/npm/v/formura)](https://npmjs.com/package/formura)
[![license](https://img.shields.io/npm/l/formura)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6)](https://www.typescriptlang.org/)

---

## Why formura?

Most form libraries make you wire things up manually — `register()`, spread props, write `onChange`, track errors yourself. **formura flips this completely.**

You describe your form **once** using a fluent schema. formura generates:
- The right input component for each field type
- Labels, placeholders, hints and error messages
- Validation (sync + async)
- A submit button with loading state

The same schema works identically on **React web** and **React Native** — no platform-specific code needed.

```tsx
// ✅ This is your ENTIRE form on both web and native:
const { Form, fields } = useForm({
  email:    field.email('Email').required(),
  password: field.password('Password').required().strong(),
  terms:    field.checkbox('I accept the terms').mustBeTrue(),
});

return (
  <Form onSubmit={handleSignUp}>
    <fields.email />       {/* auto-renders <input type="email"> or <TextInput> */}
    <fields.password />    {/* auto-renders secure input with strength validation */}
    <fields.terms />       {/* auto-renders checkbox or Switch */}
    <Form.Submit>Sign up</Form.Submit>
  </Form>
);
```

---

## Install

```bash
npm install formura
```

**React Native** — no extra deps beyond `react-native` itself.

---

## Core concept — the schema

A schema is a plain object mapping field names to field descriptors created by the `field` builder.

```ts
import { useForm, field } from 'formura';

const { Form, fields, state } = useForm({
  name:    field.text('Full name'),
  email:   field.email('Email'),
  age:     field.number('Age'),
  country: field.select('Country').options(['FR','US','UK']),
  terms:   field.checkbox('Accept terms'),
});
```

That's it. No interfaces, no generics, no register calls.

---

## `field` — the builder API

Every method is chainable. Chain as many as you need.

### Text fields

```ts
field.text('Label')
  .required('This field is required.')   // mark required
  .min(3)                                // min length
  .max(80)                               // max length
  .trim()                                // trim whitespace before validation
  .placeholder('Enter your name')
  .hint('Helper text shown below the field')
  .disabled()
  .hidden()
```

### Email

```ts
field.email('Email address')
  .required()
  // Email format validation is built-in automatically
```

### Password

```ts
field.password('Password')
  .required()
  .strong()        // enforces: 8+ chars, uppercase, lowercase, number, special char
  .min(8)          // or set your own minimum
```

### Confirm password

```ts
field.password('Confirm password')
  .required()
  .matches('password', 'Passwords do not match.')   // cross-field validation
```

### Number

```ts
field.number('Age')
  .required()
  .min(18, 'Must be 18 or older.')
  .max(120)
  .positive()         // shorthand for min(0.001)
  .integer()          // must be a whole number
```

### Phone & URL

```ts
field.tel('Phone')    // built-in format validation
field.url('Website')  // enforces https:// or http://
```

### Textarea

```ts
field.textarea('Bio')
  .max(500)
  .hint('Max 500 characters.')
```

### Checkbox & Switch

```ts
field.checkbox('Accept Terms').mustBeTrue('You must accept.')
field.switch('Push notifications')   // renders as a toggle switch
```

### Select & Radio

```ts
field.select('Country')
  .options([
    { label: 'France',         value: 'FR' },
    { label: 'United States',  value: 'US' },
  ])
  .required()

field.radio('Role')
  .options(['Developer', 'Designer', 'Manager'])   // simple string array also works
  .required()
```

### OTP / PIN code

```ts
field.otp('Verification code')
  .required()
  .length(6)                   // renders 6 separate input boxes
  .hint('Check your SMS.')
```

### Date

```ts
field.date('Date of birth')
  .required()
```

### Custom renderer

Override the platform renderer entirely:

```tsx
field.number('Rating')
  .render(({ value, onChange, error, label }) => (
    <View>
      <Text>{label}</Text>
      {[1,2,3,4,5].map(n => (
        <TouchableOpacity key={n} onPress={() => onChange(n)}>
          <Text style={{ opacity: value >= n ? 1 : 0.3 }}>★</Text>
        </TouchableOpacity>
      ))}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
    </View>
  ))
```

### Async validation with debounce

```ts
field.text('Username')
  .required()
  .validate(async (value) => {
    const taken = await api.checkUsername(value);
    return taken ? 'Username already taken.' : null;
  })
  .debounce(400)    // waits 400ms after last keystroke before calling
  .hint('Checking availability…')
```

### Multiple validators

```ts
field.text('Code')
  .validate((v) => v.startsWith('UC-') ? null : 'Must start with UC-')
  .validate(async (v) => {
    const valid = await api.validateCode(v);
    return valid ? null : 'Invalid code.';
  })
```

### Transform

```ts
field.text('Username')
  .transform(v => v.toLowerCase().trim())   // stored and validated as lowercase
```

---

## `useForm()` — full return API

```ts
const {
  Form,        // <Form onSubmit={fn}> wrapper + <Form.Submit>
  fields,      // { [fieldName]: () => JSX.Element }
  state,       // reactive form state
  setValue,    // (name, value) => void
  getValue,    // (name) => value
  getValues,   // () => all values
  validate,    // (name?) => Promise<boolean>
  reset,       // (values?) => void
  setError,    // (name, message) => void
  clearErrors, // (name?) => void
  watch,       // (name) => reactive value
  submit,      // () => Promise<void>  — programmatic submit
} = useForm(schema, options);
```

### `state` — form state object

```ts
state.values        // { [fieldName]: value }
state.errors        // { [fieldName]: errorMessage }
state.touched       // { [fieldName]: boolean }
state.dirty         // { [fieldName]: boolean }
state.status        // 'idle' | 'validating' | 'submitting' | 'success' | 'error'
state.isValid
state.isDirty
state.isSubmitting
state.isSuccess
state.isError
state.submitCount
state.submitError   // string | null — error thrown by onSubmit
```

### `useForm` options

```ts
useForm(schema, {
  validateOn:    'onBlur',    // 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched'
  revalidateOn:  'onChange',  // after first submit, when to re-validate
  resolver:      zodResolver(schema),  // optional schema-level resolver
})
```

### Validation modes

| Mode | When validation runs |
|------|----------------------|
| `onBlur` *(default)* | After a field loses focus |
| `onChange` | On every keystroke |
| `onSubmit` | Only when the form is submitted |
| `onTouched` | After first blur, then on every change |

---

## `<Form>` component

```tsx
<Form
  onSubmit={(values) => api.createUser(values)}
  onError={(errors) => console.warn(errors)}
  onSubmitError={(err) => 'Server error. Please try again.'}
  className="my-form"   // web only
  style={{ padding: 20 }}
>
  {/* fields */}
  <Form.Submit loadingText="Submitting…">Submit</Form.Submit>
</Form>
```

`<Form.Submit>` is automatically:
- Disabled while submitting or validating
- Shows `loadingText` with a loading indicator
- A `<button type="submit">` on web, a `<TouchableOpacity>` on native

---

## Schema-level resolvers

Use Zod, Yup, Joi or Valibot for full schema validation. The resolver replaces field-level validators.

```ts
import { z }           from 'zod';
import { zodResolver } from 'formura';

const schema = z.object({
  email:    z.string().email('Invalid email.'),
  password: z.string().min(8, 'Min 8 characters.'),
  age:      z.coerce.number().min(18, 'Must be 18+.'),
});

const { Form, fields } = useForm(
  {
    email:    field.email('Email').required(),
    password: field.password('Password').required(),
    age:      field.number('Age').required(),
  },
  { resolver: zodResolver(schema) }
);
```

Available resolvers: `zodResolver`, `yupResolver`, `joiResolver`, `valibotResolver`.

---

## Programmatic control

```tsx
// Set a value externally (e.g., from a map picker)
setValue('city', 'Paris');

// Trigger validation on specific fields
const isEmailValid = await validate('email');

// Validate all fields before a custom action
const isAllValid = await validate();

// Set API errors manually
setError('email', 'This email is already registered.');

// Reset to defaults (or new values)
reset();
reset({ email: 'prefill@example.com' });

// Watch a value reactively (renders on change)
const password = watch('password');

// Programmatic submit
await submit();
```

---

## Prefilling values

```tsx
const { reset } = useForm({ ... });

useEffect(() => {
  reset({
    name:  user.name,
    email: user.email,
    role:  user.role,
  });
}, [user]);
```

---

## Conditional fields

```tsx
// Use field.hidden() based on a watched value
const plan = watch('plan');

const { Form, fields } = useForm({
  plan:       field.select('Plan').options(['free','pro']).required(),
  teamSize:   field.number('Team size').min(1).hidden(plan !== 'pro'),
  couponCode: field.text('Coupon code').hidden(plan !== 'pro'),
});
```

---

## Override labels / placeholder per-render

```tsx
// Schema defines the default, render can override
<fields.email label="Work email" placeholder="you@company.com" />
```

---

## TypeScript

formura infers types from your schema — no extra type annotations needed.

```ts
const { Form, fields, state } = useForm({
  age: field.number('Age').required().min(18),
});

// state.values.age is inferred as `number`
// state.errors.age is inferred as `string | undefined`
```

If you need the values type:

```ts
import type { SchemaValues } from 'formura';

type MyValues = SchemaValues<typeof mySchema>;
// { email: string; age: number; terms: boolean; ... }
```

---

## Full example — Sign-up form

### React (web)

```tsx
import { useForm, field } from 'formura';

export function SignUpForm() {
  const { Form, fields, state } = useForm(
    {
      name:     field.text('Full name').required().trim().max(80),
      email:    field.email('Email').required(),
      password: field.password('Password').required().strong(),
      confirm:  field.password('Confirm password').required()
                    .matches('password', 'Passwords must match.'),
      country:  field.select('Country')
                    .options([
                      { label: 'France',        value: 'FR' },
                      { label: 'United States', value: 'US' },
                    ])
                    .required(),
      terms:    field.checkbox('I accept the terms').mustBeTrue(),
    },
    { validateOn: 'onTouched' }
  );

  return (
    <Form onSubmit={(values) => api.signUp(values)}>
      <fields.name />
      <fields.email />
      <fields.password />
      <fields.confirm />
      <fields.country />
      <fields.terms />
      <Form.Submit loadingText="Creating account…">Sign up →</Form.Submit>
    </Form>
  );
}
```

### React Native (exact same schema)

```tsx
import { useForm, field } from 'formura';
import { View, ScrollView } from 'react-native';

export function SignUpScreen() {
  const { Form, fields } = useForm(
    {
      // ← Exact same schema as the web form above
      name:     field.text('Full name').required().trim().max(80),
      email:    field.email('Email').required(),
      password: field.password('Password').required().strong(),
      confirm:  field.password('Confirm password').required()
                    .matches('password', 'Passwords must match.'),
      country:  field.select('Country')
                    .options([{ label: 'France', value: 'FR' }, { label: 'US', value: 'US' }])
                    .required(),
      terms:    field.checkbox('I accept the terms').mustBeTrue(),
    },
    { validateOn: 'onTouched' }
  );

  return (
    <ScrollView>
      <Form onSubmit={(values) => api.signUp(values)}>
        <fields.name />       {/* TextInput */}
        <fields.email />      {/* TextInput, email keyboard */}
        <fields.password />   {/* TextInput, secureTextEntry */}
        <fields.confirm />
        <fields.country />    {/* Options list */}
        <fields.terms />      {/* Switch */}
        <Form.Submit>Sign up →</Form.Submit>
      </Form>
    </ScrollView>
  );
}
```

---

## License

MIT © AKS
