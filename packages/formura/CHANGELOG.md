# Changelog

## [1.0.0] — 2026-03-20

### Added — complete rewrite with schema-first approach

**Core**
- `field` builder namespace — fluent API to define fields declaratively
- `useForm(schema, options)` — returns `Form`, `fields`, `state` and programmatic controls
- `<Form>` component — wraps web `<form>` or RN `<View>` automatically
- `<Form.Submit>` — auto-disabled, shows loading spinner, works on both platforms

**Field types**
- `field.text()` — single-line text with min/max/pattern/trim
- `field.email()` — built-in email format validation
- `field.password()` — with optional `.strong()` enforcing complexity rules
- `field.number()` — with min/max/positive/integer
- `field.tel()` — phone number with built-in format validation
- `field.url()` — URL with built-in format validation
- `field.textarea()` — multi-line text
- `field.checkbox()` — boolean, with `.mustBeTrue()`
- `field.switch()` — toggle switch (same as checkbox, different UI)
- `field.select()` — dropdown (web) / options list (native)
- `field.radio()` — radio group on both platforms
- `field.date()` — date picker
- `field.otp()` — OTP/PIN code with auto-advance between digits
- `field.custom()` — custom value type with `.render()` for UI

**Validation**
- Built-in rules: required, min, max, pattern, minLength, maxLength
- `.matches(fieldName)` — cross-field comparison (confirm password)
- `.validate(fn)` — sync or async custom validator
- `.debounce(ms)` — debounce async validators
- `.transform(fn)` — transform value before storing/validating
- `.strong()` — password strength enforcement
- Resolver adapters: `zodResolver`, `yupResolver`, `joiResolver`, `valibotResolver`

**State machine**
- `status`: `idle` | `validating` | `submitting` | `success` | `error`
- `submitError` — captures errors thrown by `onSubmit`
- `onSubmitError` — map thrown errors to user-facing messages

**Validation modes**: `onBlur` (default) | `onChange` | `onSubmit` | `onTouched`

**Platform renderers**
- Web: `<input>`, `<textarea>`, `<select>`, `<input type="radio">`, `<input type="checkbox">`, custom switch, OTP boxes
- Native: `<TextInput>`, `<Switch>`, options list with radio dots, OTP with auto-focus

**Cross-platform**: same import, same schema, same API — fields render with platform-native primitives automatically

**TypeScript**: 100% typed, schema values inferred — no extra type annotations needed
