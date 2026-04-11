export const DOC_PREVIEWS = {
  resolver: {
    src: '/docs/formbridge/formbridge-resolver.svg',
    alt: 'Preview representing schema adapter and external validation integration.',
    caption:
      'External schema resolvers let you keep Zod or Yup as the source of truth while still using formbridge renderers.',
    maxWidth: 720,
    maxHeight: 420,
  },
  stylingWeb: {
    src: '/docs/formbridge/formbridge-overview-web.svg',
    alt: 'Desktop preview of a form themed through the global ui layer and local field overrides.',
    caption:
      'Web styling can combine schema defaults, a shared ui theme, and one-off field overrides without changing the form runtime.',
    maxWidth: 720,
    maxHeight: 420,
  },
  stylingNative: {
    src: '/docs/formbridge/formbridge-overview-native.svg',
    alt: 'Mobile preview of the same form themed for React Native.',
    caption:
      'React Native styling follows the same layered model: schema defaults, shared ui theme, and local overrides when one screen needs a different look.',
    maxWidth: 340,
    maxHeight: 620,
  },
  stylingStyledWeb: {
    src: '/docs/formbridge/formbridge-overview-web.svg',
    alt: 'Desktop preview of a form themed with styled-components around generated fields.',
    caption:
      'styled-components recipe: keep a stable styled host around generated fields and submit buttons, then style the built-in slots with normal CSS selectors.',
    maxWidth: 720,
    maxHeight: 420,
  },
  stylingUtilityWeb: {
    src: '/docs/formbridge/formbridge-overview-web.svg',
    alt: 'Desktop preview of a form themed with utility classes and slot class maps.',
    caption:
      'Utility-first recipe: className and classNames slot maps make Tailwind-style theming work without changing the generated field runtime.',
    maxWidth: 720,
    maxHeight: 420,
  },
  stylingSlotWeb: {
    src: '/docs/formbridge/formbridge-overview-web.svg',
    alt: 'Desktop preview of a form themed entirely through inline slot overrides.',
    caption:
      'Slot override recipe: use plain objects, DOM props, and render hooks when you want to stay dependency-free on web.',
    maxWidth: 720,
    maxHeight: 420,
  },
  stylingStyledNative: {
    src: '/docs/formbridge/formbridge-overview-native.svg',
    alt: 'Mobile preview of a form themed with styled-components/native.',
    caption:
      'styled-components/native recipe: wrap generated fields in a stable host and feed native slot styles through attrs or local overrides.',
    maxWidth: 340,
    maxHeight: 620,
  },
  stylingSlotNative: {
    src: '/docs/formbridge/formbridge-overview-native.svg',
    alt: 'Mobile preview of a form themed through native style objects and slot overrides.',
    caption:
      'React Native slot override recipe: one global ui theme plus targeted local overrides is often enough for polished production screens.',
    maxWidth: 340,
    maxHeight: 620,
  },
  asyncWeb: {
    src: '/docs/formbridge/formbridge-async-web.svg',
    alt: 'Desktop preview of an async select or autocomplete flow.',
    caption:
      'Async options support debounce, caching, dependencies, and loading states for remote datasets on web.',
    maxWidth: 720,
    maxHeight: 420,
  },
  asyncNative: {
    src: '/docs/formbridge/formbridge-async-native.svg',
    alt: 'Mobile preview of an async picker flow.',
    caption:
      'The same async options contract can feed native lists, search inputs, or custom pickers.',
    maxWidth: 340,
    maxHeight: 620,
  },
  analyticsWeb: {
    src: '/docs/formbridge/formbridge-lifecycle.svg',
    alt: 'Preview of analytics instrumentation layered on a web form.',
    caption:
      'Analytics stays additive: you keep the same form API and add callbacks for focus, completion, abandonment, and errors.',
    maxWidth: 720,
    maxHeight: 420,
  },
  analyticsNative: {
    src: '/docs/formbridge/formbridge-overview-native.svg',
    alt: 'Preview of analytics instrumentation on a mobile form.',
    caption:
      'On native, the same callbacks can track focus, completion, and abandonment without changing field code.',
    maxWidth: 340,
    maxHeight: 620,
  },
  dynamic: {
    src: '/docs/formbridge/formbridge-dynamic.svg',
    alt: 'Preview of a dynamic form definition rendered at runtime.',
    caption:
      'Dynamic forms let you turn JSON definitions into real formbridge forms while preserving order and visibility rules.',
    maxWidth: 720,
    maxHeight: 420,
  },
  wizard: {
    src: '/docs/formbridge/formbridge-wizard.svg',
    alt: 'Preview of a multi-step wizard flow.',
    caption:
      'Wizard flows accumulate values across steps, apply per-step validation, and keep the same schema-driven building blocks.',
    maxWidth: 720,
    maxHeight: 420,
  },
  readonly: {
    src: '/docs/formbridge/formbridge-readonly.svg',
    alt: 'Preview of a readonly and diff review screen.',
    caption:
      'Readonly and diff rendering are useful for review screens, approval steps, or comparing pending edits to saved data.',
    maxWidth: 720,
    maxHeight: 420,
  },
} as const;

export const BASE_BUILDER_METHODS = [
  'Inherited from `BaseFieldBuilder`:',
  '- `behavior(config)` merges field-owned behavior metadata such as ids, autocomplete, keyboard hints, picker hooks, and error highlighting',
  '- `defaultValue(value)` overrides the initial value',
  '- `required(message?)` marks the field as required',
  '- `optional()` removes the required flag',
  '- `label(text)` overrides the display label',
  '- `placeholder(text?)` sets placeholder copy',
  '- `hint(text)` sets helper text',
  '- `disabled(value = true)` toggles disabled state',
  '- `hidden(value = true)` toggles hidden state',
  '- `debounce(ms)` changes validation/change debounce',
  '- `validate(fn)` adds a sync or async validator',
  '- `transform(fn)` normalizes the value before validation / submit',
  '- `render(fn)` replaces the generated UI while keeping the same form runtime',
  'Conditional logic helpers:',
  '- `visibleWhen(fieldOrFn, value?)` shows the field when another field or predicate matches',
  '- `visibleWhenNot(field, value)` shows the field when another field does not match',
  '- `visibleWhenTruthy(field)` shows the field when another field is truthy',
  '- `visibleWhenFalsy(field)` shows the field when another field is falsy',
  '- `visibleWhenAny(pairs)` OR-combines multiple visibility checks',
  '- `requiredWhen(fieldOrFn, value?)` makes the field conditionally required',
  '- `requiredWhenAny(pairs)` OR-combines multiple required checks',
  '- `disabledWhen(fieldOrFn, value?)` disables the field conditionally',
  '- `resetOnHide()` resets to the default value when hidden',
  '- `keepOnHide()` keeps the current value when hidden',
  '- `clearOnHide()` clears the value when hidden',
].join('\n');

export const STRING_BUILDER_METHODS = [
  'Inherited from `StringFieldBuilder`:',
  '- `min(length, message?)` sets the minimum accepted length',
  '- `max(length, message?)` sets the maximum accepted length',
  '- `pattern(regex | regex[], message?)` appends one or more accepted regex rules',
  '- `patterns(regexes, message?)` alias for passing multiple regex alternatives',
  '- `format(regex, message?)` overrides the low-level built-in format regex used by preset builders such as email, tel, or url',
  '- `trim()` trims the value before validation / submit',
  '- `lowercase()` lowercases the value before storing',
  '- `uppercase()` uppercases the value before storing',
  '- `matches(fieldName, message?)` requires equality with another field value',
  '- `sameAs(fieldName, message?)` alias of `matches()` with more explicit semantics',
].join('\n');

export const BASE_BUILDER_METHOD_EXAMPLES = [
  'Mini examples for the shared base builder methods:',
  "- `behavior({ autoComplete: 'email', inputMode: 'email' })` → `field.email('Work email').behavior({ autoComplete: 'email', inputMode: 'email' })`",
  "- `defaultValue('FR')` → `field.select('Country').defaultValue('FR')`",
  "- `required('Required')` / `optional()` → `field.text('Middle name').required('Required').optional()`",
  "- `label('Username')` / `placeholder('@alex')` / `hint('Shown publicly')` → `field.text('Handle').label('Username').placeholder('@alex').hint('Shown publicly')`",
  "- `disabled()` / `hidden()` / `debounce(500)` → `field.text('Referral code').disabled().hidden(false).debounce(500)`",
  "- `validate((value) => value ? null : 'Missing')` → `field.text('Company').validate((value) => value.length >= 2 ? null : 'Use at least 2 characters')`",
  "- `transform((value) => value.trim())` → `field.text('Slug').transform((value) => value.trim().toLowerCase().replace(/\\s+/g, '-'))`",
  "- `render(fn)` → `field.custom(0).label('Rating').render(({ value, onChange }) => <Stars value={value} onChange={onChange} />)`",
  "- `visibleWhen('accountType', 'company')` → `field.text('Company name').visibleWhen('accountType', 'company')`",
  "- `visibleWhenNot('role', 'guest')` / `visibleWhenTruthy('hasVat')` / `visibleWhenFalsy('sameAsBilling')` → `field.text('VAT number').visibleWhenTruthy('hasVat')`",
  "- `visibleWhenAny([['role', 'admin'], ['role', 'manager']])` → `field.text('Internal note').visibleWhenAny([['role', 'admin'], ['role', 'manager']])`",
  "- `requiredWhen('needsInvoice')` / `requiredWhenAny([['country', 'FR'], ['country', 'DE']])` → `field.text('Tax ID').requiredWhenAny([['country', 'FR'], ['country', 'DE']])`",
  "- `disabledWhen('submitted')` → `field.text('Coupon code').disabledWhen('submitted')`",
  "- `resetOnHide()` / `keepOnHide()` / `clearOnHide()` → `field.text('Other').visibleWhen('reason', 'other').resetOnHide()`",
  "- `_build()` → `const descriptor = field.text('Debug').required()._build()`",
].join('\n');

export const STRING_BUILDER_METHOD_EXAMPLES = [
  'Mini examples for the shared string builder methods:',
  "- `min(3)` / `max(20)` → `field.text('Username').trim().min(3).max(20)`",
  "- `pattern(/^[A-Z]{3}-\\d{4}$/)` → `field.text('Partner code').pattern(/^[A-Z]{3}-\\d{4}$/)`",
  "- `patterns([/^FR-/, /^DE-/], 'Use an EU code')` → `field.text('Region code').patterns([/^FR-/, /^DE-/], 'Use an EU code')`",
  "- `format(/^https:\\/\\/.+$/, 'Use HTTPS')` → `field.url('Webhook URL').format(/^https:\\/\\/.+$/, 'Use HTTPS')`",
  "- `trim()` / `lowercase()` / `uppercase()` → `field.email('Email').trim().lowercase()` and `field.masked('LL-999-LL').label('Plate').uppercase()`",
  "- `matches('password')` / `sameAs('password')` → `field.password('Confirm password').sameAs('password', 'Passwords must match')`",
].join('\n');

export const USE_FORM_BRIDGE_OPTIONS_SURFACE = [
  'Complete hook options:',
  "- `validateOn?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched'`",
  "  Default: `'onBlur'`",
  "- `revalidateOn?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched'`",
  "  Default: `'onChange'`",
  '- `resolver?: SchemaResolver`',
  '  Async contract: `async (values) => ({ values, errors })`',
  '  When present, resolver output becomes the validation source of truth',
  "- `showErrorsOn?: 'submit' | 'always'`",
  '  Public option for inline error display policy; keep validation timing in `validateOn` / `revalidateOn`',
  '- `persist?: PersistOptions`',
  '  Enables draft save/restore with storage, TTL, debounce, exclusion, restore/save callbacks, and versioning',
  '- `formKey?: string`',
  '  Recreates the runtime when the surrounding context changes',
  '- `initialValues?: Partial<SchemaValues<typeof schema>>`',
  '  Seeds the runtime with existing values',
  '- `analytics?: AnalyticsOptions`',
  '  Wires analytics without changing the field components',
  '- `globalStyles?(state): FormBridgeUiOptions`',
  '  Shared theming layer for generated fields, the form wrapper, and submit button; because it is a function, the theme can react to submit, dirty, or error state',
].join('\n');

export const USE_FORM_BRIDGE_RETURN_SURFACE = [
  'Complete hook return surface:',
  '- `FormProvider` — advanced context wrapper for consumers rendered outside `<Form>`',
  '- `Form` — generated wrapper component with submit lifecycle',
  '- `fields` — typed generated field components keyed by schema name',
  '- `FieldError` — standalone error renderer for one field name',
  '- `FieldLabel` — standalone label renderer for one field name',
  '- `fieldController(name)` — field-scoped runtime for fully custom UI while keeping the schema contract',
  '- `state` — reactive `FormState` object',
  '- `setValue(name, value)` — set one field value programmatically',
  '- `getValue(name)` — read one field value',
  '- `getValues()` — read the full value object',
  '- `validate(names?)` — validate one field, several fields, or the full form',
  '- `resetFields(values?)` — resetFields to schema defaults or a provided partial value object',
  '- `setError(name, message)` — push a manual field error',
  '- `clearErrors(name?)` — clear one field, many fields, or all errors',
  '- `watch(name)` — reactive single-field read',
  '- `watchAll()` — reactive full-value read',
  '- `submit()` — imperative submit using the same submit pipeline as `Form.Submit`',
  '- `visibility` — per-field visibility / required / disabled state',
  '- `isLoadingDraft` — true while a persisted draft is being restored',
  '- `hasDraft` — true once a draft was found and restored',
  '- `clearDraft()` — delete the saved draft',
  '- `saveDraftNow()` — persist immediately without waiting for debounce',
].join('\n');

export const FIELD_CONTROLLER_SURFACE = [
  'Complete `fieldController(name)` surface:',
  '- Runtime data: `name`, `value`, `label`, `placeholder`, `hint`, `error`, `touched`, `dirty`, `validating`, `disabled`, `required`, `visible`, `options?`, `otpLength?`, `allValues`, `descriptor`, `renderProps`',
  '- Value APIs: `setValue(value)` and `onChange(value)`',
  '- Interaction APIs: `onBlur()`, `onFocus()`, `focus()`, `blur()`',
  '- Validation / errors: `validate()`, `setError(message)`, `clearError()`',
  '- Focus bridge: `registerFocusable(target)` where `target` is a DOM node, `TextInput`, or any custom object exposing `{ focus?, blur? }`',
].join('\n');

export const FORM_COMPONENT_PROPS_SURFACE = [
  'Complete `Form` props surface:',
  '- `children: ReactNode`',
  '- `onSubmit(values)` — required, sync or async',
  '- `onError?(errors)` — called when validation fails before submit',
  '- `onSubmitError?(error)` — maps a thrown submit error to the user-facing `state.submitError` string',
  '- `style?` — cross-platform wrapper style prop',
  '- `className?` — web only',
].join('\n');

export const FORM_SUBMIT_PROPS_SURFACE = [
  'Complete `Form.Submit` props surface:',
  '- `children?: ReactNode`',
  '- `style?` — cross-platform button/root style',
  '- `loadingText?: string` — replaces the label while submitting',
  '- `disabled?: boolean` — adds an extra disabled condition on top of submit state',
  '- `className?` — web only',
  '- `containerStyle?` — native only wrapper/button style',
  '- `textStyle?` — native only label style',
  '- `indicatorColor?` — native only loading indicator color',
].join('\n');

export const GENERATED_FIELD_COMMON_PROPS_SURFACE = [
  'Common generated field props available on every field component:',
  '- `label?` — override the schema label for this render only',
  '- `placeholder?` — override placeholder copy for this render only',
  '- `hint?` — override helper copy for this render only',
  '- `style?` — root style override',
  '- `ui?` — platform-typed renderer override object',
  '- `className?` — web only root class override',
].join('\n');

export const GENERATED_FIELD_UI_SURFACE = [
  'Shared `ui` capabilities:',
  '- `id?` / `testID?` — platform id hooks',
  '- `hideLabel?` — visually suppress the default label',
  '- `highlightOnError?` — keep the error message but suppress the default error chrome when `false`',
  '- `styles?` — slot style map',
  '- `classNames?` — web slot class map',
  '- `rootProps?`, `labelProps?`, `hintProps?`, `errorProps?` — forward low-level props to the built-in renderer',
  '- `renderLabel?(ctx)`, `renderHint?(ctx)`, `renderError?(ctx)`, `renderRequiredMark?()` — render-hook escape hatches',
  '- Text-like fields: `inputProps?`',
  '- `textarea` on web: `textareaProps?`',
  '- `select` on web: `selectProps?`',
  '- Select-like fields: `renderPicker?(ctx)`',
  '- Async select/autocomplete fields: `renderOption?(option, state)`, `renderEmpty?()`, `renderLoading?()`',
  '- Phone fields on web: `searchInputProps?`',
  '- File fields: `renderFileIcon?(file)` on web, `pickFiles?(ctx)` on native',
].join('\n');

export const FORM_STATE_SURFACE = [
  'Complete `state` surface:',
  '- `values` — current schema-shaped values object',
  '- `errors` — current field error bag',
  '- `touched` — per-field touched flags',
  '- `dirty` — per-field dirty flags',
  "- `status` — `'idle' | 'validating' | 'submitting' | 'success' | 'error'`",
  '- `isValid` — no current validation errors',
  '- `isDirty` — at least one field differs from its initial/default value',
  '- `isSubmitting` — submit handler currently running',
  '- `isSuccess` — last submit completed successfully',
  '- `isError` — last submit ended in error',
  '- `submitCount` — number of submit attempts',
  '- `submitError` — mapped submit error string from `onSubmitError`',
].join('\n');

export const ACTIONS_HELPERS_SURFACE = [
  'Complete imperative helper surface:',
  '- `validate(name?)` or `validate([nameA, nameB])` or `validate()`',
  '- `resetFields()` or `resetFields(partialValues)`',
  '- `setValue(name, value)`',
  '- `getValue(name)`',
  '- `getValues()`',
  '- `setError(name, message)`',
  '- `clearErrors(name?)` or `clearErrors([nameA, nameB])` or `clearErrors()`',
  '- `watch(name)`',
  '- `watchAll()`',
  '- `submit()`',
  '- `fieldController(name)`',
  '- `saveDraftNow()`',
  '- `clearDraft()`',
  '- `visibility[fieldName]?.visible` / `.required` / `.disabled`',
].join('\n');

export const VALIDATION_RUNTIME_SURFACE = [
  'Validation entry points in the public runtime:',
  '- Builder-level field rules live on the builders themselves and are documented in the builder sections',
  '- `validateOn` chooses the first validation trigger',
  '- `revalidateOn` chooses the follow-up trigger after interaction',
  '- `validate(names?)` lets you trigger validation imperatively',
  '- `setError()` / `clearErrors()` let you merge server-side validation into the same runtime',
  '- `resolver(values)` lets an external schema engine own the final `{ values, errors }` result',
].join('\n');

export const RESOLVER_SHARED_OPTIONS_SURFACE = [
  'Shared adapter options (`ResolverAdapterOptions`) supported by all built-in resolvers:',
  "- `rootKey?: string | null` — where pathless errors land; default `'_root'`; set `null` to drop them",
  "- `errorMode?: 'first' | 'join' | 'last'` — how duplicate field errors are aggregated",
  "- `joinMessagesWith?: string` — separator for `errorMode: 'join'`",
  '- `formatPath?(path, issue)` — rewrite the final error key',
  '- `mapIssue?(context)` — remap, skip, or rewrite an issue before it hits the error bag',
  '- `normalizeMessage?(message, issue)` — final message normalization hook',
].join('\n');

export const RESOLVER_LIBRARY_OPTIONS_SURFACE = [
  'Library-specific resolver options:',
  "- `zodResolver(schema, { mode?: 'auto' | 'sync' | 'async', parseOptions?, ...shared })`",
  "- `yupResolver(schema, { mode?: 'auto' | 'sync' | 'async', validateOptions?, ...shared })`",
  "- `joiResolver(schema, { mode?: 'auto' | 'sync' | 'async', validateOptions?, stripQuotes?, ...shared })`",
  "- `valibotResolver(schema, { mode?: 'auto' | 'sync' | 'async', parseOptions?, module?, ...shared })`",
].join('\n');

export const CONDITIONAL_SURFACE = [
  'Complete conditional builder surface shared across builders:',
  '- `visibleWhen(fieldOrPredicate, value?)`',
  '- `visibleWhenNot(field, value)`',
  '- `visibleWhenTruthy(field)`',
  '- `visibleWhenFalsy(field)`',
  '- `visibleWhenAny(pairs)`',
  '- `requiredWhen(fieldOrPredicate, value?)`',
  '- `requiredWhenAny(pairs)`',
  '- `disabledWhen(fieldOrPredicate, value?)`',
  '- `resetOnHide()`',
  '- `clearOnHide()`',
  '- `keepOnHide()`',
].join('\n');

export const PERSIST_OPTIONS_SURFACE = [
  'Complete `PersistOptions` surface:',
  '- `key: string` — required storage key namespace',
  "- `storage?: 'local' | 'session' | 'async' | custom adapter`",
  "  Default: `'local'`",
  '- `ttl?: number` — seconds before the draft expires',
  '  Default: `3600`',
  '- `exclude?: string[]` — field names never written to storage',
  '  Default: `[]`',
  '- `debounce?: number` — ms before writes flush to storage',
  '  Default: `800`',
  '- `onRestore?(values)` — called after a valid draft is restored',
  '- `onSaveError?(error)` — called when a draft write fails',
  '- `version?: string` — bump to invalidate previously saved drafts',
  "  Default: `'1'`",
].join('\n');

export const GLOBAL_UI_SURFACE = [
  'Complete `globalStyles` surface:',
  '- `globalStyles` itself is a function: `(state) => ({ ... })`',
  '- `field?: { className?, style?, ui? }` — shared defaults for all generated fields',
  '- `form?: { className?, style?, props? }` on web or `{ style?, props? }` on native',
  '- `submit?: { className?, style?, loadingText?, props? }` on web',
  '- `submit?: { style?, containerStyle?, textStyle?, indicatorColor?, loadingText?, props?, contentProps? }` on native',
].join('\n');

export const WEB_SLOT_SURFACE = [
  'Web field slot names currently exposed through `ui.classNames` / `ui.styles`:',
  '- Shared: `root`, `label`, `hint`, `error`, `requiredMark`',
  '- Text-like: `input`, `textarea`, `select`',
  '- Checkbox/radio: `checkboxRow`, `checkboxInput`, `checkboxLabel`',
  '- Switch: `switchRoot`, `switchTrack`, `switchThumb`',
  '- OTP: `otpContainer`, `otpInput`',
  '- Password: `toggle`, `strengthRow`, `strengthBar`, `strengthFill`, `strengthLabel`, `strengthEntropy`, `rulesList`, `ruleItem`, `ruleBullet`, `ruleText`',
  '- Phone: `row`, `countryButton`, `countrySearchInput`, `countryList`, `countryItem`, `countryName`, `countryDial`, `e164`',
  '- File: `dropZone`, `dropZoneIcon`, `dropZoneText`, `browseButton`, `list`, `listItem`, `previewImage`, `fileIcon`, `fileName`, `fileMeta`, `removeButton`, `addMoreButton`',
  '- Async autocomplete: `listbox`, `option`, `optionActive`, `optionSelected`, `empty`, `loading`',
].join('\n');

export const NATIVE_SLOT_SURFACE = [
  'Native field slot names currently exposed through `ui.styles`:',
  '- Shared: `root`, `label`, `input`, `error`, `hint`, `requiredMark`',
  '- Checkbox: `checkboxRow`, `checkboxBox`, `checkboxLabel`',
  '- Select/radio: `optionTrigger`, `optionRow`, `optionLabel`, `modalBackdrop`, `modalCard`',
  '- OTP: `otpContainer`, `otpInput`',
  '- Password: `strengthRow`, `strengthBar`, `strengthFill`, `toggle`, `toggleText`, `strengthLabel`',
  '- Phone: `row`, `countryButton`, `countryFlag`, `countryDial`, `chevron`, `e164`, `modalBackdrop`, `modalCard`, `searchInput`, `separator`, `countryRow`, `countryName`',
  '- File: `pickButton`, `pickButtonText`, `fileList`, `fileItem`, `fileIcon`, `fileIconText`, `fileName`, `fileMeta`, `removeButton`, `removeText`',
  '- Async autocomplete: `trigger`, `triggerValue`, `triggerPlaceholder`, `modalBackdrop`, `modalCard`, `searchInput`, `loadingRow`, `loadingText`, `optionRow`, `optionLabel`, `emptyText`',
].join('\n');

export const HOST_HELPERS_SURFACE = [
  'Complete host helper exports:',
  '- `FieldHost` props = generated field props + `field`',
  '- `SubmitHost` props = submit props + `submit`',
  '- `FormHost` props = form props + `form`',
].join('\n');

export const INFER_AUTODETECTION_SURFACE = [
  'Auto-detection rules used by `field.infer()`:',
  '- Key names containing `email` → `email`',
  '- Key names containing `password` / `pass` → `password`',
  '- Key names containing `phone` / `tel` → `tel`',
  '- Key names containing `url` / `website` / `link` → `url`',
  '- Key names containing `bio`, `description`, `note`, `comment` → `textarea`',
  '- Key names containing `date`, `birthday`, `born` → `date`',
  '- Key names containing `enabled`, `active`, `toggle`, `visible` → `switch`',
  '- `boolean` values → `switch`',
  '- `number` values → `number`',
  '- array values → `select`',
  '- Keys matching `phone|tel|mobile|cell|fax` → `phone`',
  '- Everything else falls back to `text`',
].join('\n');

export const INFER_OPTIONS_SURFACE = [
  'Complete `InferFieldOptions` surface:',
  '- `type?: FieldType`',
  '- `label?: string`',
  '- `placeholder?: string`',
  '- `hint?: string`',
  '- `required?: boolean | string`',
  '- `min?: number`',
  '- `max?: number`',
  '- `options?: SelectOption[] | string[]`',
  '- `disabled?: boolean`',
  '- `hidden?: boolean`',
  '- `validate?(value, allValues)`',
].join('\n');

export const ANALYTICS_OPTIONS_SURFACE = [
  'Complete analytics config surface:',
  '- `handlers: AnalyticsHandlers` — required',
  '- `exclude?: string[]`',
  '  Default excluded names: `password`, `confirm`, `cvv`, `pin`, `otp`, `ssn`, `secret`',
  '- `formId?: string`',
].join('\n');

export const ANALYTICS_HANDLERS_SURFACE = [
  'Available analytics handlers:',
  '- `onFieldFocus?(name)`',
  '- `onFieldComplete?(name, durationMs)`',
  '- `onFieldAbandoned?(name, partialValue)`',
  '- `onFieldError?(name, error)`',
  '- `onFieldErrorFixed?(name)`',
  '- `onFormAbandoned?(completedPercent, lastField, values)`',
  '- `onFormCompleted?(durationMs, submitCount, fieldCount)`',
  '- `onFormError?(errors, submitCount)`',
  '- `onFieldChange?(name, changeCount)`',
].join('\n');

export const ANALYTICS_TRACKER_SURFACE = [
  'The hook returns `FormAnalyticsTracker | null`. When analytics is enabled, the tracker exposes:',
  '- `setValuesGetter(getter)`',
  '- `attachLifecycleTracking()`',
  '- `onFieldFocus(name)`',
  '- `onFieldBlur(name, value)`',
  '- `onFieldChange(name)`',
  '- `onFieldError(name, error)`',
  '- `onFieldErrorFixed(name)`',
  '- `onFormSubmitError(errors, submitCount)`',
  '- `onFormSubmitSuccess(submitCount, fieldCount)`',
  '- `computeCompletion(values)`',
  '- `reportAbandonmentIfNeeded()`',
  '- `destroy()`',
].join('\n');

export const ASYNC_OPTIONS_CONFIG_SURFACE = [
  'Complete `AsyncOptionsConfig` surface:',
  "- `key?: string` — cache namespace; default `'default'`",
  '- `fetch(context)` — required async fetcher',
  '- `cacheTtl?: number` — cache lifetime in ms; default `60000`',
  '- `debounce?: number` — debounce in ms; default `300`',
  '- `minChars?: number` — minimum non-empty search length before fetching; default `0`',
  '- `dependsOn?: readonly string[]` — dependency keys included in the cache key',
  '- `initialOptions?: SelectOption[]` — default/fallback options',
  '- `fetchOnMount?: boolean` — default `true`',
  '- `keepPreviousOptions?: boolean` — default `true`',
  '- `preserveOnError?: boolean` — default `true`',
].join('\n');

export const ASYNC_OPTIONS_FETCHER_SURFACE = [
  'Fetcher context passed to `fetch(context)`:',
  '- `search: string`',
  '- `deps: Record<string, unknown>`',
  '- `signal: AbortSignal`',
].join('\n');

export const DYNAMIC_JSON_SURFACE = [
  'Supported JSON form definition surface:',
  '- `JsonFormDefinition`: `id?`, `title?`, `submitLabel?`, `fields`',
  '- `JsonFieldType`: `text`, `email`, `password`, `number`, `tel`, `url`, `textarea`, `checkbox`, `switch`, `select`, `radio`, `date`, `otp`, `hidden`',
  '- `JsonFieldDescriptor`: `name`, `type`, `label`, `placeholder?`, `hint?`, `defaultValue?`, `required?`, `min?`, `max?`, `pattern?`, `patternMsg?`, `options?`, `otpLength?`, `disabled?`, `order?`, `showWhen?`, `validate?`',
  '- `showWhen` supports `{ field, value }` and `{ field, notValue }`',
  '- `validate` entries support typed rules such as `required`, `min`, `max`, `pattern`, `email`, `url`',
  '- `custom` exists in the JSON rule type surface today, but the built-in parser does not execute arbitrary custom JSON validators yet',
].join('\n');

export const DYNAMIC_OPTIONS_SURFACE = [
  'Complete `useDynamicFormBridge()` options surface:',
  '- First argument: `JsonFormDefinition` or `() => Promise<JsonFormDefinition>`',
  '- Second argument: all normal `useFormBridge()` options',
  '- `defaultValues?: Record<string, unknown>` — injected after parsing the dynamic schema',
].join('\n');

export const DYNAMIC_RETURN_SURFACE = [
  'Complete `useDynamicFormBridge()` return surface:',
  '- `form` — standard `useFormBridge()` return or `null` while unavailable',
  '- `fieldOrder: string[]` — parser-declared render order',
  '- `meta: { id?: string; title?: string; submitLabel?: string }`',
  '- `isVisible(name)` — evaluates dynamic `showWhen` rules against live values',
  '- `isLoading: boolean`',
  '- `loadError: string | null`',
].join('\n');

export const WIZARD_STEP_SURFACE = [
  'Complete `WizardStep` surface:',
  '- `id: string`',
  '- `label: string`',
  '- `schema: FormSchema`',
  '- `optional?: boolean`',
  '- `condition?(allValues)` — filters the visible step list',
  '- `formOptions?: Partial<UseFormOptions>` — per-step overrides for validation, resolver, persistence, analytics, ui, etc.',
].join('\n');

export const WIZARD_OPTIONS_SURFACE = [
  'Complete `useFormBridgeWizard()` options surface:',
  '- `onSubmit(allValues)` — required final submit handler',
  '- `onSubmitError?(error)` — maps thrown submit errors to `submitError`',
  '- `persist?: { key, storage?, ttl?, exclude?, debounce?, onRestore?, onSaveError?, version? }`',
  '- `validateOn?` — default step validation trigger',
  '- `revalidateOn?` — default step revalidation trigger',
  '- `stepId?: string` — controlled active step id',
  '- `initialStepId?: string` — uncontrolled initial step id',
  '- `onStepChange?(event)` — navigation bridge callback',
].join('\n');

export const WIZARD_EVENT_SURFACE = [
  'Wizard step change event surface:',
  "- `reason`: `'next' | 'prev' | 'goTo' | 'goToStep' | 'skip' | 'restore' | 'fallback'`",
  '- `step` / `index` — next visible step and its index',
  '- `previousStep` / `previousIndex` — previous visible step snapshot',
].join('\n');

export const WIZARD_RETURN_SURFACE = [
  'Complete `useFormBridgeWizard()` return surface:',
  '- `currentStep` — standard `useFormBridge()` return for the active step',
  '- `step` — active step metadata or `null` during hydration / no visible step',
  '- `currentStepId`',
  '- `currentStepIndex`',
  '- `totalSteps`',
  '- `allSteps`',
  '- `visibleSteps`',
  '- `isFirstStep`',
  '- `isLastStep`',
  '- `progress` — rounded completion percentage based on visible steps',
  '- `completedSteps` — `Set<string>`',
  '- `allValues` — accumulated step values merged with the current step values',
  '- `next()`',
  '- `prev()`',
  '- `goTo(index, skipValidation?)`',
  '- `goToStep(stepId, skipValidation?)`',
  '- `skip()`',
  '- `submit()`',
  '- `isSubmitting`',
  '- `isSuccess`',
  '- `submitError`',
  '- `isHydrating`',
].join('\n');

export const READONLY_OPTIONS_SURFACE = [
  'Complete `useReadonlyFormBridge()` options surface:',
  "- `mode: 'readonly' | 'diff'`",
  '- `values` — current values to display',
  '- `originalValues?` — baseline values used in diff mode',
  '- `formatters?` — per-field formatter map',
].join('\n');

export const READONLY_FIELD_STATE_SURFACE = [
  'Each readonly field state contains:',
  '- `name`',
  '- `label`',
  '- `value`',
  '- `display`',
  '- `changed`',
  '- `original?`',
  '- `originalDisplay?`',
].join('\n');

export const READONLY_FIELD_PROPS_SURFACE = [
  'Each generated `ReadonlyFields.name(props?)` component accepts:',
  '- `label?`',
  '- `format?(value)`',
  '- `style?`',
  '- `className?`',
  '- `showDiff?`',
].join('\n');

export const READONLY_RETURN_SURFACE = [
  'Complete `useReadonlyFormBridge()` return surface:',
  '- `fields` — readonly state map for every visible field',
  '- `fieldNames` — ordered visible field names',
  '- `changedFields` — changed field names in diff mode',
  '- `hasChanges`',
  '- `ReadonlyFields` — generated readonly render components matching the schema keys',
].join('\n');
