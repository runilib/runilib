# Changelog

## [1.0.0] — 2026-03-17

### Added
- `useForm<T>()` — core form hook with register, handleSubmit, setValue, trigger, reset, watch
- `useField()` — standalone single-field hook
- `useWatch()` — reactive subscription from sibling components
- `Controller` — controlled field component for custom inputs
- `FormProvider` + `useFormContext` — shared form context for deep trees
- `ErrorMessage` — cross-platform error display (web `<p>` / native `<Text>`)
- Built-in rules: `required`, `min`, `max`, `minLength`, `maxLength`, `pattern`, `validate`
- Preset validators: `email`, `url`, `numeric`, `alphanumeric`, `strongPassword`, `phoneFR`, `phoneIntl`, `positiveNumber`, `notBlank`
- Validation modes: `onChange`, `onBlur`, `onSubmit`, `onTouched`, `all`
- Full TypeScript — 100% typed with generics over form shape
- Cross-platform: web returns `onChange`/`value` props; native returns `onChangeText`/`value` props
