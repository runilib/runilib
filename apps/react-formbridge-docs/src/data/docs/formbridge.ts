import type { LibraryDoc } from '../../types';

const DOC_PREVIEWS = {
  overviewWeb: {
    src: '/docs/formbridge/formbridge-overview-web.svg',
    alt: 'Desktop preview of a schema-first signup form rendered with react-formbridge.',
    caption:
      'Web preview: a complete signup form generated from a schema with typed fields, inline errors, and submit state.',
    maxWidth: 720,
    maxHeight: 420,
  },
  overviewNative: {
    src: '/docs/formbridge/formbridge-overview-native.svg',
    alt: 'Mobile preview of the same signup form rendered on React Native.',
    caption:
      'React Native preview: the same schema rendered as native inputs, pickers, switches, and a submit button.',
    maxWidth: 340,
    maxHeight: 620,
  },
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

const BASE_BUILDER_METHODS = [
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

const STRING_BUILDER_METHODS = [
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

const BASE_BUILDER_METHOD_EXAMPLES = [
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

const STRING_BUILDER_METHOD_EXAMPLES = [
  'Mini examples for the shared string builder methods:',
  "- `min(3)` / `max(20)` → `field.text('Username').trim().min(3).max(20)`",
  "- `pattern(/^[A-Z]{3}-\\d{4}$/)` → `field.text('Partner code').pattern(/^[A-Z]{3}-\\d{4}$/)`",
  "- `patterns([/^FR-/, /^DE-/], 'Use an EU code')` → `field.text('Region code').patterns([/^FR-/, /^DE-/], 'Use an EU code')`",
  "- `format(/^https:\\/\\/.+$/, 'Use HTTPS')` → `field.url('Webhook URL').format(/^https:\\/\\/.+$/, 'Use HTTPS')`",
  "- `trim()` / `lowercase()` / `uppercase()` → `field.email('Email').trim().lowercase()` and `field.masked('LL-999-LL').label('Plate').uppercase()`",
  "- `matches('password')` / `sameAs('password')` → `field.password('Confirm password').sameAs('password', 'Passwords must match')`",
].join('\n');

const USE_FORM_BRIDGE_OPTIONS_SURFACE = [
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

const USE_FORM_BRIDGE_RETURN_SURFACE = [
  'Complete hook return surface:',
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
  '- `reset(values?)` — reset to schema defaults or a provided partial value object',
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

const FIELD_CONTROLLER_SURFACE = [
  'Complete `fieldController(name)` surface:',
  '- Runtime data: `name`, `value`, `label`, `placeholder`, `hint`, `error`, `touched`, `dirty`, `validating`, `disabled`, `required`, `visible`, `options?`, `otpLength?`, `allValues`, `descriptor`, `renderProps`',
  '- Value APIs: `setValue(value)` and `onChange(value)`',
  '- Interaction APIs: `onBlur()`, `onFocus()`, `focus()`, `blur()`',
  '- Validation / errors: `validate()`, `setError(message)`, `clearError()`',
  '- Focus bridge: `registerFocusable(target)` where `target` is a DOM node, `TextInput`, or any custom object exposing `{ focus?, blur? }`',
].join('\n');

const FORM_COMPONENT_PROPS_SURFACE = [
  'Complete `Form` props surface:',
  '- `children: ReactNode`',
  '- `onSubmit(values)` — required, sync or async',
  '- `onError?(errors)` — called when validation fails before submit',
  '- `onSubmitError?(error)` — maps a thrown submit error to the user-facing `state.submitError` string',
  '- `style?` — cross-platform wrapper style prop',
  '- `className?` — web only',
].join('\n');

const FORM_SUBMIT_PROPS_SURFACE = [
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

const GENERATED_FIELD_COMMON_PROPS_SURFACE = [
  'Common generated field props available on every field component:',
  '- `label?` — override the schema label for this render only',
  '- `placeholder?` — override placeholder copy for this render only',
  '- `hint?` — override helper copy for this render only',
  '- `style?` — root style override',
  '- `ui?` — platform-typed renderer override object',
  '- `className?` — web only root class override',
].join('\n');

const GENERATED_FIELD_UI_SURFACE = [
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

const FORM_STATE_SURFACE = [
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

const ACTIONS_HELPERS_SURFACE = [
  'Complete imperative helper surface:',
  '- `validate(name?)` or `validate([nameA, nameB])` or `validate()`',
  '- `reset()` or `reset(partialValues)`',
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

const VALIDATION_RUNTIME_SURFACE = [
  'Validation entry points in the public runtime:',
  '- Builder-level field rules live on the builders themselves and are documented in the builder sections',
  '- `validateOn` chooses the first validation trigger',
  '- `revalidateOn` chooses the follow-up trigger after interaction',
  '- `validate(names?)` lets you trigger validation imperatively',
  '- `setError()` / `clearErrors()` let you merge server-side validation into the same runtime',
  '- `resolver(values)` lets an external schema engine own the final `{ values, errors }` result',
].join('\n');

const RESOLVER_SHARED_OPTIONS_SURFACE = [
  'Shared adapter options (`ResolverAdapterOptions`) supported by all built-in resolvers:',
  "- `rootKey?: string | null` — where pathless errors land; default `'_root'`; set `null` to drop them",
  "- `errorMode?: 'first' | 'join' | 'last'` — how duplicate field errors are aggregated",
  "- `joinMessagesWith?: string` — separator for `errorMode: 'join'`",
  '- `formatPath?(path, issue)` — rewrite the final error key',
  '- `mapIssue?(context)` — remap, skip, or rewrite an issue before it hits the error bag',
  '- `normalizeMessage?(message, issue)` — final message normalization hook',
].join('\n');

const RESOLVER_LIBRARY_OPTIONS_SURFACE = [
  'Library-specific resolver options:',
  "- `zodResolver(schema, { mode?: 'auto' | 'sync' | 'async', parseOptions?, ...shared })`",
  "- `yupResolver(schema, { mode?: 'auto' | 'sync' | 'async', validateOptions?, ...shared })`",
  "- `joiResolver(schema, { mode?: 'auto' | 'sync' | 'async', validateOptions?, stripQuotes?, ...shared })`",
  "- `valibotResolver(schema, { mode?: 'auto' | 'sync' | 'async', parseOptions?, module?, ...shared })`",
].join('\n');

const CONDITIONAL_SURFACE = [
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

const PERSIST_OPTIONS_SURFACE = [
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

const GLOBAL_UI_SURFACE = [
  'Complete `globalStyles` surface:',
  '- `globalStyles` itself is a function: `(state) => ({ ... })`',
  '- `field?: { className?, style?, ui? }` — shared defaults for all generated fields',
  '- `form?: { className?, style?, props? }` on web or `{ style?, props? }` on native',
  '- `submit?: { className?, style?, loadingText?, props? }` on web',
  '- `submit?: { style?, containerStyle?, textStyle?, indicatorColor?, loadingText?, props?, contentProps? }` on native',
].join('\n');

const WEB_SLOT_SURFACE = [
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

const NATIVE_SLOT_SURFACE = [
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

const HOST_HELPERS_SURFACE = [
  'Complete host helper exports:',
  '- `FieldHost` props = generated field props + `field`',
  '- `SubmitHost` props = submit props + `submit`',
  '- `FormHost` props = form props + `form`',
].join('\n');

const INFER_AUTODETECTION_SURFACE = [
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

const INFER_OPTIONS_SURFACE = [
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

const ANALYTICS_OPTIONS_SURFACE = [
  'Complete analytics config surface:',
  '- `handlers: AnalyticsHandlers` — required',
  '- `exclude?: string[]`',
  '  Default excluded names: `password`, `confirm`, `cvv`, `pin`, `otp`, `ssn`, `secret`',
  '- `formId?: string`',
].join('\n');

const ANALYTICS_HANDLERS_SURFACE = [
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

const ANALYTICS_TRACKER_SURFACE = [
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

const ASYNC_OPTIONS_CONFIG_SURFACE = [
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

const ASYNC_OPTIONS_FETCHER_SURFACE = [
  'Fetcher context passed to `fetch(context)`:',
  '- `search: string`',
  '- `deps: Record<string, unknown>`',
  '- `signal: AbortSignal`',
].join('\n');

const DYNAMIC_JSON_SURFACE = [
  'Supported JSON form definition surface:',
  '- `JsonFormDefinition`: `id?`, `title?`, `submitLabel?`, `fields`',
  '- `JsonFieldType`: `text`, `email`, `password`, `number`, `tel`, `url`, `textarea`, `checkbox`, `switch`, `select`, `radio`, `date`, `otp`, `hidden`',
  '- `JsonFieldDescriptor`: `name`, `type`, `label`, `placeholder?`, `hint?`, `defaultValue?`, `required?`, `min?`, `max?`, `pattern?`, `patternMsg?`, `options?`, `otpLength?`, `disabled?`, `order?`, `showWhen?`, `validate?`',
  '- `showWhen` supports `{ field, value }` and `{ field, notValue }`',
  '- `validate` entries support typed rules such as `required`, `min`, `max`, `pattern`, `email`, `url`',
  '- `custom` exists in the JSON rule type surface today, but the built-in parser does not execute arbitrary custom JSON validators yet',
].join('\n');

const DYNAMIC_OPTIONS_SURFACE = [
  'Complete `useDynamicForm()` options surface:',
  '- First argument: `JsonFormDefinition` or `() => Promise<JsonFormDefinition>`',
  '- Second argument: all normal `useFormBridge()` options',
  '- `defaultValues?: Record<string, unknown>` — injected after parsing the dynamic schema',
].join('\n');

const DYNAMIC_RETURN_SURFACE = [
  'Complete `useDynamicForm()` return surface:',
  '- `form` — standard `useFormBridge()` return or `null` while unavailable',
  '- `fieldOrder: string[]` — parser-declared render order',
  '- `meta: { id?: string; title?: string; submitLabel?: string }`',
  '- `isVisible(name)` — evaluates dynamic `showWhen` rules against live values',
  '- `isLoading: boolean`',
  '- `loadError: string | null`',
].join('\n');

const WIZARD_STEP_SURFACE = [
  'Complete `WizardStep` surface:',
  '- `id: string`',
  '- `label: string`',
  '- `schema: FormSchema`',
  '- `optional?: boolean`',
  '- `condition?(allValues)` — filters the visible step list',
  '- `formOptions?: Partial<UseFormOptions>` — per-step overrides for validation, resolver, persistence, analytics, ui, etc.',
].join('\n');

const WIZARD_OPTIONS_SURFACE = [
  'Complete `useFormWizard()` options surface:',
  '- `onSubmit(allValues)` — required final submit handler',
  '- `onSubmitError?(error)` — maps thrown submit errors to `submitError`',
  '- `persist?: { key, storage?, ttl?, exclude?, debounce?, onRestore?, onSaveError?, version? }`',
  '- `validateOn?` — default step validation trigger',
  '- `revalidateOn?` — default step revalidation trigger',
  '- `stepId?: string` — controlled active step id',
  '- `initialStepId?: string` — uncontrolled initial step id',
  '- `onStepChange?(event)` — navigation bridge callback',
].join('\n');

const WIZARD_EVENT_SURFACE = [
  'Wizard step change event surface:',
  "- `reason`: `'next' | 'prev' | 'goTo' | 'goToStep' | 'skip' | 'restore' | 'fallback'`",
  '- `step` / `index` — next visible step and its index',
  '- `previousStep` / `previousIndex` — previous visible step snapshot',
].join('\n');

const WIZARD_RETURN_SURFACE = [
  'Complete `useFormWizard()` return surface:',
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

const READONLY_OPTIONS_SURFACE = [
  'Complete `useReadonlyFormBridge()` options surface:',
  "- `mode: 'readonly' | 'diff'`",
  '- `values` — current values to display',
  '- `originalValues?` — baseline values used in diff mode',
  '- `formatters?` — per-field formatter map',
].join('\n');

const READONLY_FIELD_STATE_SURFACE = [
  'Each readonly field state contains:',
  '- `name`',
  '- `label`',
  '- `value`',
  '- `display`',
  '- `changed`',
  '- `original?`',
  '- `originalDisplay?`',
].join('\n');

const READONLY_FIELD_PROPS_SURFACE = [
  'Each generated `ReadonlyFields.name(props?)` component accepts:',
  '- `label?`',
  '- `format?(value)`',
  '- `style?`',
  '- `className?`',
  '- `showDiff?`',
].join('\n');

const READONLY_RETURN_SURFACE = [
  'Complete `useReadonlyFormBridge()` return surface:',
  '- `fields` — readonly state map for every visible field',
  '- `fieldNames` — ordered visible field names',
  '- `changedFields` — changed field names in diff mode',
  '- `hasChanges`',
  '- `ReadonlyFields` — generated readonly render components matching the schema keys',
].join('\n');

export const formbridgeDocs: LibraryDoc = {
  libId: 'formbridge',
  versions: ['1.0.0'],
  sidebar: [
    {
      group: 'Getting started',
      items: [
        { id: 'fb-overview', label: 'Overview' },
        { id: 'fb-install', label: 'Installation' },
        { id: 'fb-quickstart', label: 'Quick start' },
        { id: 'fb-schema', label: 'Schema mental model' },
      ],
    },
    {
      group: 'Tutorials',
      color: 'blue',
      items: [
        { id: 'fb-tutorial', label: 'Tutorial' },
        { id: 'fb-tutorial-signup', label: 'Signup form' },
        { id: 'fb-tutorial-checkout', label: 'Checkout flow' },
        { id: 'fb-tutorial-validation', label: 'Validation & resolvers' },
        { id: 'fb-tutorial-custom-ui', label: 'Custom UI & styling' },
        { id: 'fb-tutorial-production', label: 'Advanced flows' },
      ],
    },
    {
      group: 'Core API',
      color: 'blue',
      items: [
        { id: 'fb-use-form-bridge', label: 'useFormBridge()' },
        { id: 'fb-form', label: 'Form component' },
        { id: 'fb-fields', label: 'Generated fields' },
        { id: 'fb-field-controller', label: 'fieldController()' },
        { id: 'fb-state', label: 'State' },
        { id: 'fb-actions', label: 'Actions & helpers' },
        { id: 'fb-validation', label: 'Validation' },
        { id: 'fb-builder-basics', label: 'Builder basics' },
      ],
    },
    {
      group: 'Available Field builders',
      color: 'blue',
      items: [
        { id: 'fb-text', label: 'field.text()' },
        { id: 'fb-email', label: 'field.email()' },
        { id: 'fb-password', label: 'field.password()' },
        { id: 'fb-tel', label: 'field.tel()' },
        { id: 'fb-url', label: 'field.url()' },
        { id: 'fb-textarea', label: 'field.textarea()' },
        { id: 'fb-number', label: 'field.number()' },
        { id: 'fb-checkbox', label: 'field.checkbox()' },
        { id: 'fb-switch', label: 'field.switch()' },
        { id: 'fb-select', label: 'field.select()' },
        { id: 'fb-radio', label: 'field.radio()' },
        { id: 'fb-date', label: 'field.date()' },
        { id: 'fb-phone', label: 'field.phone()' },
        { id: 'fb-masked', label: 'field.masked()' },
        { id: 'fb-file', label: 'field.file()' },
        { id: 'fb-otp', label: 'field.otp()' },
        { id: 'fb-custom', label: 'field.custom()' },
      ],
    },
    {
      group: 'Advanced',
      color: 'blue',
      items: [
        { id: 'fb-adapters', label: 'Schema adapters' },
        { id: 'fb-conditional', label: 'Conditional logic' },
        { id: 'fb-persistence', label: 'Draft persistence' },
        { id: 'fb-web-ui', label: 'Styling' },
        { id: 'fb-infer', label: 'field.infer()' },
        { id: 'fb-infer-type', label: 'field.inferType()' },
        { id: 'fb-analytics', label: 'useFormBridgeAnalytics()' },
        { id: 'fb-use-async-options', label: 'useAsyncOptions()' },
        { id: 'fb-dynamic', label: 'useDynamicForm()' },
        { id: 'fb-wizard', label: 'useFormWizard()' },
        { id: 'fb-readonly', label: 'useReadonlyFormBridge()' },
      ],
    },
  ],
  sections: [
    {
      id: 'fb-overview',
      title: 'Overview',
      content: `REACT FORMBRIDGE is a schema-driven form builder/runtime for React and React Native.

- You describe the form once with fluent \`field.*\` builders and keep the schema as the source of truth.
- \`useFormBridge()\` returns a ready-to-use \`Form\`, generated \`fields\`, reactive \`state\`, visibility rules, draft helpers, and imperative actions.
- The same schema drives rendering, validation, conditional logic, persistence, analytics, and advanced flows such as wizards or dynamic forms.
- No provider, registry, or field-level wiring is required: the builder/runtime takes care of the form lifecycle for you.`,
      codeTabs: [
        {
          filename: 'Overview.web.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.overviewWeb,
          code: `import { field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  email: field.email('Email').required(),
  password: field.password('Password').required().strong(),
  plan: field.select('Plan').options(['starter','pro']).required(),
  terms: field.checkbox('Accept terms').mustBeTrue(),
}

export function SignupForm() {
  const { Form, fields, state } = useFormBridge(schema, { validateOn: 'onTouched' })

  return (
    <Form onSubmit={async (values) => api.signup(values)}>
      <fields.email />
      <fields.password />
      <fields.plan />
      <fields.terms />
      <Form.Submit loadingText="Creating..." disabled={!state.isValid}>
        Create account
      </Form.Submit>
    </Form>
  )
}`,
        },
        {
          filename: 'ReactNative.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.overviewNative,
          code: `import { ScrollView, View } from 'react-native'
import { field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  email: field.email('Email').required(),
  password: field.password('Password').required().strong(),
  phone: field.phone('Phone').defaultCountry('FR').storeE164(),
}

export function SignupScreen() {
  const { Form, fields, state } = useFormBridge(schema, { validateOn: 'onTouched' })

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Form onSubmit={(values) => api.signup(values)}>
        <View style={{ gap: 12, padding: 16 }}>
          <fields.email />
          <fields.password />
          <fields.phone />
          <Form.Submit disabled={!state.isValid} loadingText="Creating...">
            Create account
          </Form.Submit>
        </View>
      </Form>
    </ScrollView>
  )
}`,
        },
      ],
    },
    {
      id: 'fb-install',
      title: 'Installation',
      content: `Install the scoped package, then let the package exports map resolve the web or native entrypoint automatically.

- Web peers: \`react\` and \`react-dom\`
- Native peers: \`react-native\`
- In React Native TypeScript projects, add \`"customConditions": ["react-native"]\` so the IDE picks the native type surface
- Some field renderers can rely on extra ecosystem packages in your app, such as phone or file-picker helpers, but the form API itself stays the same.`,
      code: {
        filename: 'terminal',
        lang: 'bash',
        code: `npm install @runilib/react-formbridge
# or
yarn add @runilib/react-formbridge
# or
pnpm add @runilib/react-formbridge
`,
      },
      subsections: [
        {
          id: 'fb-install-native-ts',
          title: 'React Native TypeScript note',
          content: `If your editor still shows web-only props in a React Native app, make sure TypeScript resolves the \`react-native\` export condition.

\`\`\`json
{
  "compilerOptions": {
    "customConditions": ["react-native"]
  }
}
\`\`\``,
        },
      ],
    },
    {
      id: 'fb-quickstart',
      title: 'Quick start',
      content: `A form starts with a plain schema object. Keys become field names, and each builder defines the renderer, default value, validation, and UI metadata for that field.

- Web and native can share the same schema.
- The generated \`fields\` map is fully typed from the schema keys.
- The generated \`ui\` prop is also typed from the exact field type, so text fields, textareas, and selects do not expose the same override surface.
- \`Form.Submit\` automatically follows submit state and can be disabled from \`state.isValid\`.`,
      codeTabs: [
        {
          filename: 'RegistrationForm.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.overviewWeb,
          code: `import type { FormSchema } from '@runilib/react-formbridge'
import { field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  fullName: field.text('Full name').required().trim(),
  email: field.email('Email').required(),
  password: field.password('Password').required().strong(),
  terms: field.checkbox('Accept terms').mustBeTrue(),
} satisfies FormSchema

export function RegistrationForm() {
  const { Form, fields, state } = useFormBridge(schema, { validateOn: 'onTouched' })

  return (
    <Form onSubmit={save}>
      <fields.fullName />
      <fields.email />
      <fields.password />
      <fields.terms />
      <Form.Submit disabled={!state.isValid}>Create account</Form.Submit>
    </Form>
  )
}`,
        },
        {
          filename: 'Registration.native.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.overviewNative,
          code: `import { ScrollView, View } from 'react-native'
import type { FormSchema } from '@runilib/react-formbridge'
import { field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  fullName: field.text('Full name').required(),
  email: field.email('Email').required(),
  password: field.password('Password').required().strong(),
} satisfies FormSchema

export function RegistrationScreen() {
  const { Form, fields, state } = useFormBridge(schema, { validateOn: 'onTouched' })
  return (
    <ScrollView>
      <Form onSubmit={save}>
        <View style={{ gap: 12, padding: 16 }}>
          <fields.fullName />
          <fields.email />
          <fields.password />
          <Form.Submit disabled={!state.isValid}>Create</Form.Submit>
        </View>
      </Form>
    </ScrollView>
  )
}`,
        },
      ],
    },
    {
      id: 'fb-schema',
      title: 'Schema mental model',
      content: `A schema is a plain object where each key becomes a field name and each value is a builder.

- The builder defines the field type, default value, label, validation, visibility conditions, and platform hints.
- \`SchemaValues<typeof schema>\` gives you the submitted values shape automatically.
- If you need to annotate the schema, prefer \`satisfies FormSchema\` over \`: FormSchema\` so TypeScript keeps the exact field type for each generated field.
- Because the schema is just data, the same object can drive editing forms, wizards, readonly reviews, analytics, and even dynamic rendering.
- The practical rule of thumb: if a behavior belongs to the field itself, keep it in the builder instead of scattering it across components.`,
      subsections: [
        {
          id: 'fb-schema-shape',
          title: 'What the schema controls',
          content: `- Rendering: text input, select, radio, phone, file, OTP, custom renderer, and more
- Validation: required rules, length/number constraints, async validators, cross-field checks
- UX metadata: labels, placeholders, hints, web overrides
- Runtime conditions: visible, required, disabled, reset/clear/keep on hide`,
        },
        {
          id: 'fb-schema-typing-tip',
          title: 'Typing tip',
          content: `Use \`satisfies FormSchema\` when you want an explicit schema contract without losing the precise field typing.

\`\`\`tsx
import type { FormSchema } from '@runilib/react-formbridge'

const schema = {
  bio: field.textarea('Bio'),
  country: field.select('Country').options(['FR', 'US']),
} satisfies FormSchema
\`\`\`

This keeps \`fields.bio\` aligned with textarea-only overrides and \`fields.country\` aligned with select-only overrides.`,
        },
      ],
    },

    // ── Tutorials ──────────────────────────────────────────────
    {
      id: 'fb-tutorial',
      title: 'Tutorial',
      content: `This tutorial is the guided path through react-formbridge. The goal is not to show every API in one sitting. The goal is to help you understand the schema-first mental model well enough that simple and complex forms both feel predictable.

- If you want the shortest route, start with \`Quick start\`
- If you want the deeper mental model, stay on this page and build the tutorial flow step by step
- The same ideas apply to React web and React Native, so each milestone shows both render targets`,
      codeTabs: [
        {
          filename: 'TutorialResult.web.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.overviewWeb,
          code: `import type { FormSchema } from '@runilib/react-formbridge'
import { field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  firstName: field.text('First name').required().trim(),
  lastName: field.text('Last name').required().trim(),
  email: field.email('Work email').required().trim().lowercase(),
  accountType: field.select('Account type').options([
    { label: 'Personal', value: 'personal' },
    { label: 'Company', value: 'company' },
  ]).required(),
  companyName: field
    .text('Company name')
    .visibleWhen('accountType', 'company')
    .requiredWhen('accountType', 'company')
    .clearOnHide(),
  terms: field.checkbox('Accept terms').mustBeTrue(),
} satisfies FormSchema

export function TutorialResult() {
  const { Form, fields, state } = useFormBridge(schema, {
    validateOn: 'onTouched',
    revalidateOn: 'onChange',
  })

  return (
    <Form onSubmit={async (values) => api.createAccount(values)}>
      <fields.firstName />
      <fields.lastName />
      <fields.email />
      <fields.accountType />
      <fields.companyName />
      <fields.terms />
      <Form.Submit disabled={!state.isValid}>Create account</Form.Submit>
    </Form>
  )
}`,
        },
        {
          filename: 'TutorialResult.native.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.overviewNative,
          code: `import { ScrollView, View } from 'react-native'
import type { FormSchema } from '@runilib/react-formbridge'
import { field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  firstName: field.text('First name').required().trim(),
  lastName: field.text('Last name').required().trim(),
  email: field.email('Work email').required().trim().lowercase(),
  accountType: field.select('Account type').options([
    { label: 'Personal', value: 'personal' },
    { label: 'Company', value: 'company' },
  ]).required(),
  companyName: field
    .text('Company name')
    .visibleWhen('accountType', 'company')
    .requiredWhen('accountType', 'company')
    .clearOnHide(),
  terms: field.checkbox('Accept terms').mustBeTrue(),
} satisfies FormSchema

export function TutorialResultScreen() {
  const { Form, fields, state } = useFormBridge(schema, {
    validateOn: 'onTouched',
    revalidateOn: 'onChange',
  })

  return (
    <ScrollView>
      <Form onSubmit={async (values) => api.createAccount(values)}>
        <View style={{ gap: 12, padding: 16 }}>
          <fields.firstName />
          <fields.lastName />
          <fields.email />
          <fields.accountType />
          <fields.companyName />
          <fields.terms />
          <Form.Submit disabled={!state.isValid}>Create account</Form.Submit>
        </View>
      </Form>
    </ScrollView>
  )
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-tutorial-before',
          title: 'Before you begin',
          content: `You do not need to memorize the full API before starting. This tutorial assumes you already know basic React and JSX, and that you are comfortable reading TypeScript examples even if your app uses JavaScript.

- Familiarity with React components and hooks will help
- Familiarity with HTML inputs or React Native inputs will help
- You do not need prior experience with react-formbridge itself`,
        },
        {
          id: 'fb-tutorial-build',
          title: 'What we are building',
          content: `We will build an account signup flow that starts small and grows into a realistic product form.

- We begin with a tiny newsletter-style form
- Then we add more fields and reactive state
- Then we add conditional business fields, stronger validation, and better submit behavior
- Finally, the later tutorial pages branch into checkout, custom UI, resolvers, wizard flows, and native screens

The preview above is the kind of final form we are aiming for on both web and mobile.`,
        },
        {
          id: 'fb-tutorial-prerequisites',
          title: 'Prerequisites',
          content: `To get the most out of this page, you should already be comfortable with:

- React components and props
- React hooks
- Modern JavaScript or TypeScript syntax such as \`const\`, arrow functions, destructuring, and async / await
- Basic form concepts like submit handlers, validation errors, and controlled inputs`,
        },
        {
          id: 'fb-tutorial-setup-browser',
          title: 'Setup option 1: stay inside the docs',
          content: `This is the fastest path.

- Read the code tabs on this page and on the follow-up tutorial pages
- Use the visual previews to compare the web and native render targets
- Open the reference pages whenever you want the full surface of one hook or one builder

This option is enough if your goal is to understand the runtime before you wire it into a real product.`,
        },
        {
          id: 'fb-tutorial-setup-local',
          title: 'Setup option 2: run the examples locally',
          content: `If you want to follow along in a real workspace, the monorepo already includes a docs app, a web example app, and a mobile example app.`,
          code: {
            filename: 'tutorial-setup.sh',
            lang: 'bash',
            code: `yarn install

# Documentation site
yarn dev:docs:formbridge

# Web examples (Vite)
yarn dev:ex:web

# Expo / React Native examples
yarn dev:ex:mobile`,
          },
        },
        {
          id: 'fb-tutorial-help',
          title: 'If you get stuck',
          content: `A tutorial only works if you can recover when something feels fuzzy.

- Use the GitHub issue tracker when you think you found an API, typing, or runtime bug
- Use the Feedback page in this docs site when a guide is confusing, incomplete, or missing an example
- When in doubt, compare the tutorial pages with the reference pages for \`useFormBridge()\`, \`fieldController()\`, and the specific builder you are using`,
        },
        {
          id: 'fb-tutorial-overview',
          title: 'What react-formbridge solves',
          content: `react-formbridge is a schema-driven form runtime for React and React Native. It helps with the parts of forms that usually get duplicated or scattered:

- Defining the value shape and keeping it typed
- Rendering fields from one source of truth
- Running validation and showing errors at the right time
- Expressing conditional logic without hiding it in component branches
- Keeping web and native behavior aligned without rewriting the same form twice`,
        },
        {
          id: 'fb-tutorial-basics',
          title: 'The core mental model',
          content: `The basic loop is simple:

1. Define a schema with \`field.*\` builders
2. Pass that schema to \`useFormBridge()\`
3. Render \`Form\` and the generated \`fields\`
4. Use \`state\`, \`watch()\`, or \`fieldController(name)\` only when the screen needs more control

The important idea is that the schema owns the field behavior, while the component tree owns layout and product chrome.`,
        },
        {
          id: 'fb-tutorial-newsletter',
          title: 'A small newsletter signup form',
          content: `We always start with the smallest useful form. A one-field newsletter signup is enough to learn the relationship between the schema, the generated field, and the submit wrapper.`,
          codeTabs: [
            {
              filename: 'NewsletterSignup.web.tsx',
              lang: 'tsx',
              preview: DOC_PREVIEWS.overviewWeb,
              code: `import type { FormSchema } from '@runilib/react-formbridge'
import { field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  email: field.email('Email address').required().trim().lowercase(),
} satisfies FormSchema

export function NewsletterSignup() {
  const { Form, fields } = useFormBridge(schema, {
    validateOn: 'onSubmit',
  })

  return (
    <Form onSubmit={async (values) => api.subscribe(values)}>
      <fields.email />
      <Form.Submit>Join newsletter</Form.Submit>
    </Form>
  )
}`,
            },
            {
              filename: 'NewsletterSignup.native.tsx',
              lang: 'tsx',
              preview: DOC_PREVIEWS.overviewNative,
              code: `import { ScrollView, View } from 'react-native'
import type { FormSchema } from '@runilib/react-formbridge'
import { field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  email: field.email('Email address').required().trim().lowercase(),
} satisfies FormSchema

export function NewsletterSignupScreen() {
  const { Form, fields } = useFormBridge(schema, {
    validateOn: 'onSubmit',
  })

  return (
    <ScrollView>
      <Form onSubmit={async (values) => api.subscribe(values)}>
        <View style={{ gap: 12, padding: 16 }}>
          <fields.email />
          <Form.Submit>Join newsletter</Form.Submit>
        </View>
      </Form>
    </ScrollView>
  )
}`,
            },
          ],
        },
        {
          id: 'fb-tutorial-next',
          title: 'Where to go next',
          content: `Once the tiny form feels clear, continue in this order:

1. \`Tutorial: signup form\` for multi-field schemas, conditional sections, and live state
2. \`Tutorial: checkout flow\` for masks, persistence, denser layouts, and previews
3. \`Tutorial: validation & resolvers\` for Zod, Yup, Joi, Valibot, and async options
4. \`Tutorial: custom UI & styling\` for \`fieldController(name)\`, \`field.custom()\`, and styling systems
5. \`Tutorial: advanced flows\` for wizards, dynamic forms, readonly review screens, analytics, and route-driven mobile flows`,
        },
      ],
    },
    {
      id: 'fb-tutorial-signup',
      title: 'Tutorial: signup form',
      content: `Build a real account-creation form with typed fields, conditional company fields, inline validation, and the same schema on web and native.

- One schema defines labels, rules, defaults, and platform hints
- \`useFormBridge()\` gives you the wrapper, generated fields, submit lifecycle, and reactive state
- Conditional company fields stay in the builder instead of leaking into component branches`,
      codeTabs: [
        {
          filename: 'SignupFlow.web.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.overviewWeb,
          code: `import type { FormSchema } from '@runilib/react-formbridge'
import { field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  firstName: field.text('First name').required().trim(),
  lastName: field.text('Last name').required().trim(),
  email: field.email('Work email').required().trim().lowercase(),
  password: field.password('Password').required().strong(),
  accountType: field.select('Account type').options([
    { label: 'Personal', value: 'personal' },
    { label: 'Company', value: 'company' },
  ]).required(),
  companyName: field
    .text('Company name')
    .visibleWhen('accountType', 'company')
    .requiredWhen('accountType', 'company')
    .clearOnHide(),
  terms: field.checkbox('Accept terms').mustBeTrue(),
} satisfies FormSchema

export function SignupForm() {
  const { Form, fields, state } = useFormBridge(schema, {
    validateOn: 'onTouched',
    revalidateOn: 'onChange',
  })

  return (
    <Form onSubmit={async (values) => api.signup(values)}>
      <fields.firstName />
      <fields.lastName />
      <fields.email />
      <fields.password />
      <fields.accountType />
      <fields.companyName />
      <fields.terms />
      <Form.Submit disabled={!state.isValid}>Create account</Form.Submit>
    </Form>
  )
}`,
        },
        {
          filename: 'SignupFlow.native.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.overviewNative,
          code: `import { ScrollView, View } from 'react-native'
import type { FormSchema } from '@runilib/react-formbridge'
import { field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  firstName: field.text('First name').required().trim(),
  lastName: field.text('Last name').required().trim(),
  email: field.email('Work email').required().trim().lowercase(),
  password: field.password('Password').required().strong(),
  accountType: field.select('Account type').options([
    { label: 'Personal', value: 'personal' },
    { label: 'Company', value: 'company' },
  ]).required(),
  companyName: field
    .text('Company name')
    .visibleWhen('accountType', 'company')
    .requiredWhen('accountType', 'company')
    .clearOnHide(),
  terms: field.checkbox('Accept terms').mustBeTrue(),
} satisfies FormSchema

export function SignupScreen() {
  const { Form, fields, state } = useFormBridge(schema, {
    validateOn: 'onTouched',
    revalidateOn: 'onChange',
  })

  return (
    <ScrollView>
      <Form onSubmit={async (values) => api.signup(values)}>
        <View style={{ gap: 12, padding: 16 }}>
          <fields.firstName />
          <fields.lastName />
          <fields.email />
          <fields.password />
          <fields.accountType />
          <fields.companyName />
          <fields.terms />
          <Form.Submit disabled={!state.isValid}>Create account</Form.Submit>
        </View>
      </Form>
    </ScrollView>
  )
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-tutorial-signup-state',
          title: 'Track state and submit lifecycle',
          content: `You rarely need custom local state for the form itself. The hook already exposes the pieces most product flows care about.

- \`state.isValid\`, \`state.isDirty\`, and \`state.isSubmitting\` drive button states and shell feedback
- \`watchAll()\` is useful for live previews or summary cards
- \`submit()\` lets you trigger the same submit pipeline from an outer button or wizard shell`,
          code: {
            filename: 'SignupState.tsx',
            lang: 'tsx',
            code: `const form = useFormBridge(schema, {
  validateOn: 'onTouched',
  revalidateOn: 'onChange',
})

const { Form, fields, state, watchAll, submit } = form
const liveValues = watchAll()
const canContinue = state.isValid && !state.isSubmitting

return (
  <>
    <aside>{liveValues.email || 'No email yet'}</aside>
    <Form onSubmit={async (values) => api.signup(values)}>
      <fields.email />
      <fields.password />
      <Form.Submit disabled={!canContinue}>Create account</Form.Submit>
    </Form>
    <button type="button" onClick={() => void submit()}>
      Submit from outer shell
    </button>
  </>
)`,
          },
        },
        {
          id: 'fb-tutorial-signup-disclosure',
          title: 'Progressive disclosure stays in the schema',
          content: `Conditional fields are one of the first places where ad hoc forms become noisy. Keep them in the builders instead.

- \`visibleWhen(...)\` controls whether the field renders
- \`requiredWhen(...)\` keeps the validation rule aligned with visibility
- \`clearOnHide()\` or \`resetOnHide()\` prevents stale hidden values from leaking into submit payloads`,
          code: {
            filename: 'SignupDisclosure.ts',
            lang: 'ts',
            code: `const schema = {
  accountType: field.select('Account type').options([
    { label: 'Personal', value: 'personal' },
    { label: 'Company', value: 'company' },
  ]).required(),
  companyName: field
    .text('Company name')
    .visibleWhen('accountType', 'company')
    .requiredWhen('accountType', 'company')
    .clearOnHide(),
  vatNumber: field
    .text('VAT number')
    .visibleWhen('accountType', 'company')
    .requiredWhen('accountType', 'company')
    .clearOnHide(),
}`,
          },
        },
      ],
    },
    {
      id: 'fb-tutorial-checkout',
      title: 'Tutorial: checkout flow',
      content: `Use checkout when a form has to prove it can handle real business density: contact details, masks, selects, live previews, and saved progress.

- Masked fields cover card number, expiry, CVV, and internal business codes
- \`select()\` keeps option metadata in the schema for both web and native
- Draft persistence helps longer flows survive reloads or app restarts`,
      codeTabs: [
        {
          filename: 'CheckoutFlow.web.tsx',
          lang: 'tsx',
          code: `import { field, MASKS, useFormBridge } from '@runilib/react-formbridge'

const checkoutSchema = {
  firstName: field.text('First name').required().trim(),
  lastName: field.text('Last name').required().trim(),
  email: field.email('Email').required().trim().lowercase(),
  phone: field.tel('Phone').required(),
  department: field.select('Department').options([
    { label: 'Sales', value: 'sales' },
    { label: 'Finance', value: 'finance' },
    { label: 'Operations', value: 'ops' },
  ]).required(),
  customerCode: field
    .masked('LL-9999')
    .tokens({ L: /[A-Z]/ })
    .required()
    .showMaskInPlaceholder()
    .uppercase()
    .validateComplete('Complete the customer code.'),
  cardNumber: field.masked(MASKS.CARD_16).required().showMaskInPlaceholder(),
  expiry: field.masked(MASKS.EXPIRY).required().showMaskInPlaceholder(),
  cvv: field.masked(MASKS.CVV).required().showMaskInPlaceholder(),
}

export function CustomerCheckout() {
  const { Form, fields, watchAll } = useFormBridge(checkoutSchema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
    persist: { key: 'customer-checkout', storage: 'local' },
  })

  const liveValues = watchAll()

  return (
    <Form onSubmit={async (values) => api.saveCustomer(values)}>
      <fields.firstName />
      <fields.lastName />
      <fields.email />
      <fields.phone />
      <fields.department />
      <fields.customerCode />
      <fields.cardNumber />
      <fields.expiry />
      <fields.cvv />
      <aside>Preview •••• {String(liveValues.cardNumber ?? '').slice(-4)}</aside>
      <Form.Submit>Save customer</Form.Submit>
    </Form>
  )
}`,
        },
        {
          filename: 'CheckoutFlow.native.tsx',
          lang: 'tsx',
          code: `import { Text, View } from 'react-native'
import { field, MASKS, useFormBridge } from '@runilib/react-formbridge'

const checkoutSchema = {
  firstName: field.text('First name').required().trim(),
  lastName: field.text('Last name').required().trim(),
  email: field.email('Email').required().trim().lowercase(),
  phone: field.tel('Phone').required(),
  department: field.select('Department').options([
    { label: 'Sales', value: 'sales' },
    { label: 'Finance', value: 'finance' },
    { label: 'Operations', value: 'ops' },
  ]).required(),
  customerCode: field
    .masked('LL-9999')
    .tokens({ L: /[A-Z]/ })
    .required()
    .showMaskInPlaceholder()
    .uppercase()
    .validateComplete('Complete the customer code.'),
  cardNumber: field.masked(MASKS.CARD_16).required().showMaskInPlaceholder(),
  expiry: field.masked(MASKS.EXPIRY).required().showMaskInPlaceholder(),
  cvv: field.masked(MASKS.CVV).required().showMaskInPlaceholder(),
}

export function CustomerCheckoutScreen() {
  const { Form, fields, watchAll } = useFormBridge(checkoutSchema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
    persist: { key: 'customer-checkout-native', storage: 'async' },
  })

  const liveValues = watchAll()

  return (
    <Form onSubmit={async (values) => api.saveCustomer(values)}>
      <View style={{ gap: 12, padding: 16 }}>
        <fields.firstName />
        <fields.lastName />
        <fields.email />
        <fields.phone />
        <fields.department />
        <fields.customerCode />
        <fields.cardNumber />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <fields.expiry />
          </View>
          <View style={{ flex: 1 }}>
            <fields.cvv />
          </View>
        </View>
        <Text>Preview •••• {String(liveValues.cardNumber ?? '').slice(-4)}</Text>
        <Form.Submit>Save customer</Form.Submit>
      </View>
    </Form>
  )
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-tutorial-checkout-persist',
          title: 'Persist the draft',
          content: `Checkout, onboarding, and support forms are much safer when the user can leave and come back.

- Use \`persist.key\` to scope the draft to the business flow
- Pick the storage target that matches the platform: local storage on web, async storage on native
- Add \`exclude\` when some values should never be cached locally, such as ephemeral tokens`,
          code: {
            filename: 'CheckoutPersistence.ts',
            lang: 'ts',
            code: `const form = useFormBridge(checkoutSchema, {
  persist: {
    key: 'customer-checkout',
    storage: 'local',
    debounce: 250,
    exclude: ['cvv'],
  },
})`,
          },
        },
        {
          id: 'fb-tutorial-checkout-layout',
          title: 'Layout without forking the runtime',
          content: `The shape of the form can change a lot between screens, but the schema does not have to.

- Put layout concerns in your host components and field wrappers
- Keep the field semantics in the builders
- Use generated fields for most inputs, then style or group them in rows, cards, or side panels as needed`,
        },
      ],
    },
    {
      id: 'fb-tutorial-validation',
      title: 'Tutorial: validation & resolvers',
      content: `Validation is usually a mix of fast local UX rules and one stronger source of truth for business constraints.

- Start with fluent builder rules when the rule clearly belongs to one field
- Add conditional required or visibility rules in the schema instead of scattering conditions through JSX
- Use a resolver when Zod, Yup, Joi, or Valibot already owns the canonical validation contract
- Use async options when a field depends on remote search or lookup data`,
      subsections: [
        {
          id: 'fb-tutorial-validation-builder-rules',
          title: 'Builder rules and cross-field logic',
          content: `This is the fastest path for forms whose rules live mostly in the frontend or belong to one field at a time.`,
          code: {
            filename: 'ValidationRules.tsx',
            lang: 'tsx',
            code: `const schema = {
  email: field.email('Work email').required().trim().lowercase(),
  password: field.password('Password').required().strong(),
  confirmPassword: field
    .password('Confirm password')
    .required()
    .sameAs('password', 'Passwords must match'),
  accountType: field.select('Account type').options([
    { label: 'Personal', value: 'personal' },
    { label: 'Company', value: 'company' },
  ]).required(),
  companyName: field
    .text('Company name')
    .visibleWhen('accountType', 'company')
    .requiredWhen('accountType', 'company')
    .clearOnHide(),
}

const form = useFormBridge(schema, {
  validateOn: 'onBlur',
  revalidateOn: 'onChange',
})`,
          },
        },
        {
          id: 'fb-tutorial-validation-adapters',
          title: 'Schema adapters',
          content: `Use a resolver when the backend or another package already shares a validation schema with the frontend.`,
          codeTabs: [
            {
              filename: 'zod-resolver.ts',
              lang: 'ts',
              preview: DOC_PREVIEWS.resolver,
              code: `import { z } from 'zod'
import { field, useFormBridge, zodResolver } from '@runilib/react-formbridge'

const schema = {
  email: field.email('Email').required(),
  password: field.password('Password').required(),
}

const zodSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const form = useFormBridge(schema, {
  resolver: zodResolver(zodSchema),
})`,
            },
            {
              filename: 'yup-resolver.ts',
              lang: 'ts',
              preview: DOC_PREVIEWS.resolver,
              code: `import * as yup from 'yup'
import { field, useFormBridge, yupResolver } from '@runilib/react-formbridge'

const schema = {
  fullName: field.text('Full name').required(),
  age: field.number('Age').required(),
}

const yupSchema = yup.object({
  fullName: yup.string().min(2).required(),
  age: yup.number().min(18).required(),
})

const form = useFormBridge(schema, {
  resolver: yupResolver(yupSchema),
})`,
            },
            {
              filename: 'joi-resolver.ts',
              lang: 'ts',
              preview: DOC_PREVIEWS.resolver,
              code: `import Joi from 'joi'
import { field, joiResolver, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  email: field.email('Email').required(),
  seats: field.number('Seats').required(),
}

const joiSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  seats: Joi.number().min(1).max(500).required(),
})

const form = useFormBridge(schema, {
  resolver: joiResolver(joiSchema),
})`,
            },
            {
              filename: 'valibot-resolver.ts',
              lang: 'ts',
              preview: DOC_PREVIEWS.resolver,
              code: `import * as v from 'valibot'
import { field, useFormBridge, valibotResolver } from '@runilib/react-formbridge'

const schema = {
  handle: field.text('Handle').required(),
  email: field.email('Email').required(),
}

const valibotSchema = v.object({
  handle: v.pipe(v.string(), v.minLength(3)),
  email: v.pipe(v.string(), v.email()),
})

const form = useFormBridge(schema, {
  resolver: valibotResolver(valibotSchema),
})`,
            },
          ],
        },
        {
          id: 'fb-tutorial-validation-async',
          title: 'Async lookups and remote options',
          content: `Remote search belongs in a different lane than validation, but in real products they often meet in the same field.`,
          codeTabs: [
            {
              filename: 'AsyncCity.web.tsx',
              lang: 'tsx',
              preview: DOC_PREVIEWS.asyncWeb,
              code: `import { useAsyncOptions } from '@runilib/react-formbridge'

const cityFetcher = async ({ search, deps, signal }) => {
  const res = await fetch('/api/cities?country=' + deps.country + '&q=' + encodeURIComponent(search), { signal })
  const data = await res.json()
  return data.map((city: { id: string; name: string }) => ({ value: city.id, label: city.name }))
}

export function CitySelect({ country }: { country: string }) {
  const cities = useAsyncOptions({
    key: 'cities',
    fetch: cityFetcher,
    dependsOn: ['country'],
    debounce: 250,
    minChars: 2,
    cacheTtl: 5 * 60_000,
  }, { country })

  return (
    <div>
      <input value={cities.search} onChange={(e) => cities.setSearch(e.target.value)} />
      {cities.loading ? <p>Loading...</p> : null}
      <ul>{cities.options.map((option) => <li key={option.value}>{option.label}</li>)}</ul>
    </div>
  )
}`,
            },
            {
              filename: 'AsyncCity.native.tsx',
              lang: 'tsx',
              preview: DOC_PREVIEWS.asyncNative,
              code: `import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useAsyncOptions } from '@runilib/react-formbridge'

export function CityPicker({ country }: { country: string }) {
  const cities = useAsyncOptions({
    key: 'cities',
    fetch: async ({ search, deps }) => {
      const res = await fetch('https://example.com/cities?country=' + deps.country + '&q=' + search)
      const data = await res.json()
      return data.map((city: any) => ({ value: city.id, label: city.name }))
    },
    dependsOn: ['country'],
    minChars: 1,
  }, { country })

  return (
    <View style={{ gap: 8 }}>
      <TextInput value={cities.search} onChangeText={cities.setSearch} />
      {cities.loading ? <Text>Loading…</Text> : null}
      <FlatList
        data={cities.options}
        keyExtractor={(item) => String(item.value)}
        renderItem={({ item }) => (
          <TouchableOpacity>
            <Text>{item.label}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}`,
            },
          ],
        },
      ],
    },
    {
      id: 'fb-tutorial-custom-ui',
      title: 'Tutorial: custom UI & styling',
      content: `Generated fields are the default path, but the runtime still leaves room for design-system wrappers and fully bespoke inputs.

- Use \`fieldController(name)\` when the value model is still one of the built-in field types and you only want custom UI
- Use \`field.custom(defaultValue)\` when the field needs a new value model
- Keep styling in global ui overrides, local field overrides, or host components so the schema stays focused on behavior`,
      codeTabs: [
        {
          filename: 'CustomRenderedMask.web.tsx',
          lang: 'tsx',
          code: `const schema = {
  workspaceName: field.text('Workspace').required(),
  launchAccessCode: field
    .masked('OPS-9999-LL')
    .label('Launch access code')
    .placeholder('2048-QA')
    .hint('Rendered manually through form.fieldController(...).')
    .required()
    .validateComplete('Complete the launch access code.'),
}

export function MissionControlForm() {
  const form = useFormBridge(schema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
  })

  const accessCode = form.fieldController('launchAccessCode')

  return (
    <form.Form onSubmit={async (values) => api.save(values)}>
      <form.fields.workspaceName />
      <label htmlFor="access-code">{accessCode.label}</label>
      <input
        id="access-code"
        ref={(node) => accessCode.registerFocusable(node)}
        value={String(accessCode.value ?? '').replace(/^OPS-/, '')}
        placeholder="2048-QA"
        disabled={accessCode.disabled}
        onChange={(event) => accessCode.onChange('OPS-' + event.target.value.toUpperCase())}
        onBlur={accessCode.onBlur}
        onFocus={accessCode.onFocus}
      />
      {accessCode.error ? <p>{accessCode.error}</p> : null}
      <button type="button" onClick={() => accessCode.focus()}>Focus code field</button>
      <form.Form.Submit>Save</form.Form.Submit>
    </form.Form>
  )
}`,
        },
        {
          filename: 'CustomRenderedMask.native.tsx',
          lang: 'tsx',
          code: `import { Text, TextInput, TouchableOpacity, View } from 'react-native'

const schema = {
  workspaceName: field.text('Workspace').required(),
  launchAccessCode: field
    .masked('OPS-9999-LL')
    .label('Launch access code')
    .placeholder('2048-QA')
    .hint('Rendered manually through form.fieldController(...).')
    .required()
    .validateComplete('Complete the launch access code.'),
}

export function MissionControlScreen() {
  const form = useFormBridge(schema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
  })

  const accessCode = form.fieldController('launchAccessCode')

  return (
    <form.Form onSubmit={async (values) => api.save(values)}>
      <View style={{ gap: 12, padding: 16 }}>
        <form.fields.workspaceName />
        <Text>{accessCode.label}</Text>
        <TextInput
          ref={(node) => accessCode.registerFocusable(node)}
          value={String(accessCode.value ?? '').replace(/^OPS-/, '')}
          placeholder="2048-QA"
          editable={!accessCode.disabled}
          onChangeText={(text) => accessCode.onChange('OPS-' + text.toUpperCase())}
          onBlur={accessCode.onBlur}
          onFocus={accessCode.onFocus}
        />
        {accessCode.error ? <Text>{accessCode.error}</Text> : null}
        <TouchableOpacity onPress={() => accessCode.focus()}>
          <Text>Focus code field</Text>
        </TouchableOpacity>
        <form.Form.Submit>Save</form.Form.Submit>
      </View>
    </form.Form>
  )
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-tutorial-custom-field',
          title: 'Use field.custom() for new value models',
          content: `If the built-in field families are close but not quite right, keep the new value model typed in the schema and replace the renderer completely.`,
          code: {
            filename: 'CustomRating.tsx',
            lang: 'tsx',
            code: `const schema = {
  rating: field
    .custom(0)
    .label('Rating')
    .render(({ label, value, onChange, error }) => (
      <div>
        <p>{label}</p>
        {[1, 2, 3, 4, 5].map((step) => (
          <button key={step} type="button" onClick={() => onChange(step)}>
            {value >= step ? '★' : '☆'}
          </button>
        ))}
        {error ? <p>{error}</p> : null}
      </div>
    ))
    .validate((value) => (value > 0 ? null : 'Pick a rating')),
}`,
          },
        },
        {
          id: 'fb-tutorial-custom-styling',
          title: 'Style the same runtime in different ways',
          content: `The product shell can evolve without rewriting the field semantics. Keep styling in the UI layer and keep behavior in the schema.`,
          codeTabs: [
            {
              filename: 'StyledRecipe.web.tsx',
              lang: 'tsx',
              preview: DOC_PREVIEWS.stylingStyledWeb,
              code: `import styled from 'styled-components'
import {
  FieldHost,
  FormHost,
  SubmitHost,
  field,
  useFormBridge,
} from '@runilib/react-formbridge'

const Shell = styled(FormHost)\`
  display: grid;
  gap: 14px;
\`

const EmailField = styled(FieldHost).attrs({
  ui: {
    inputProps: { autoComplete: 'email', inputMode: 'email' },
  },
})\`
  & input {
    border-radius: 8px;
    border: 1px solid #cbd5e1;
  }
\`

const SubmitButton = styled(SubmitHost)\`
  border-radius: 8px;
  background: #2563eb;
  color: white;
\`

const form = useFormBridge({
  email: field.email('Email').required(),
  password: field.password('Password').required(),
})

<Shell form={form.Form} onSubmit={async (values) => api.save(values)}>
  <EmailField field={form.fields.email} />
  <FieldHost field={form.fields.password} />
  <SubmitButton submit={form.Form.Submit}>Sign in</SubmitButton>
</Shell>`,
            },
            {
              filename: 'StyledRecipe.native.tsx',
              lang: 'tsx',
              preview: DOC_PREVIEWS.stylingStyledNative,
              code: `import styled from 'styled-components/native'
import {
  FieldHost,
  FormHost,
  SubmitHost,
  field,
  useFormBridge,
} from '@runilib/react-formbridge'

const StyledForm = styled(FormHost)\`
  gap: 16px;
\`

const EmailField = styled(FieldHost).attrs({
  ui: {
    inputProps: {
      autoComplete: 'email',
      keyboardType: 'email-address',
    },
    styles: {
      root: { gap: 6 },
      input: {
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
      },
    },
  },
})\`\`

const SubmitButton = styled(SubmitHost)\`
  border-radius: 8px;
  background: #2563eb;
\`

const form = useFormBridge({
  email: field.email('Email').required(),
  password: field.password('Password').required(),
})

<StyledForm form={form.Form} onSubmit={async (values) => api.save(values)}>
  <EmailField field={form.fields.email} />
  <FieldHost field={form.fields.password} />
  <SubmitButton submit={form.Form.Submit}>Sign in</SubmitButton>
</StyledForm>`,
            },
          ],
        },
      ],
    },
    {
      id: 'fb-tutorial-production',
      title: 'Tutorial: advanced flows',
      content: `Once simple forms work, the next problems are usually navigation, partial saves, remote step definitions, review screens, and instrumentation.

- \`useFormWizard()\` is the client-owned path for multi-step flows
- \`useDynamicForm()\` is the backend-owned path when a remote definition controls the fields
- \`useReadonlyFormBridge()\` keeps review screens aligned with edit screens
- \`useFormBridgeAnalytics()\` makes lifecycle instrumentation additive instead of invasive`,
      codeTabs: [
        {
          filename: 'WizardRoute.web.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.wizard,
          code: `import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { FormSchema } from '@runilib/react-formbridge'
import { field, useFormWizard } from '@runilib/react-formbridge'

const steps = [
  {
    id: 'account',
    label: 'Account',
    schema: {
      email: field.email('Email').required(),
      password: field.password('Password').required(),
    } satisfies FormSchema,
  },
  {
    id: 'company',
    label: 'Company',
    schema: {
      companyName: field.text('Company name').required(),
    } satisfies FormSchema,
  },
  { id: 'review', label: 'Review', schema: {} satisfies FormSchema },
]

export function SignupWizardRoute() {
  const navigate = useNavigate()
  const { stepId } = useParams()

  const wizard = useFormWizard(steps, {
    stepId,
    initialStepId: 'account',
    persist: { key: 'signup-wizard', storage: 'local' },
    onStepChange: ({ step }) => navigate('/signup/' + step.id),
    onSubmit: (allValues) => api.save(allValues),
  })

  useEffect(() => {
    if (!wizard.isHydrating && wizard.currentStepId && stepId !== wizard.currentStepId) {
      navigate('/signup/' + wizard.currentStepId, { replace: true })
    }
  }, [navigate, stepId, wizard.currentStepId, wizard.isHydrating])

  if (wizard.isHydrating || !wizard.step) return null

  const { Form, fields } = wizard.currentStep

  return (
    <Form onSubmit={async () => {
      if (wizard.isLastStep) await wizard.submit()
      else await wizard.next()
    }}>
      {'email' in fields && <fields.email />}
      {'password' in fields && <fields.password />}
      {'companyName' in fields && <fields.companyName />}
      <Form.Submit>{wizard.isLastStep ? 'Finish' : 'Next'}</Form.Submit>
    </Form>
  )
}`,
        },
        {
          filename: 'WizardRoute.native.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.wizard,
          code: `import { useEffect } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import type { FormSchema } from '@runilib/react-formbridge'
import { field, useFormWizard } from '@runilib/react-formbridge'

const steps = [
  {
    id: 'personal',
    label: 'Personal info',
    schema: {
      firstName: field.text('First name').required(),
      lastName: field.text('Last name').required(),
      email: field.email('Email').required(),
    } satisfies FormSchema,
  },
  {
    id: 'company',
    label: 'Company info',
    schema: {
      companyName: field.text('Company name').required(),
      role: field.text('Role').required(),
    } satisfies FormSchema,
  },
  { id: 'review', label: 'Review', schema: {} satisfies FormSchema },
]

export function SignupWizardScreen() {
  const router = useRouter()
  const { stepId } = useLocalSearchParams<{ stepId?: string }>()

  const wizard = useFormWizard(steps, {
    stepId,
    initialStepId: 'personal',
    persist: { key: 'mobile-signup-wizard', storage: 'async' },
    onStepChange: ({ step }) => router.replace('/signup/' + step.id),
    onSubmit: (allValues) => api.save(allValues),
  })

  useEffect(() => {
    if (!wizard.isHydrating && wizard.currentStepId && stepId !== wizard.currentStepId) {
      router.replace('/signup/' + wizard.currentStepId)
    }
  }, [router, stepId, wizard.currentStepId, wizard.isHydrating])
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-tutorial-production-dynamic',
          title: 'Dynamic forms from a backend definition',
          content: `Use \`useDynamicForm()\` when a remote definition controls the field order or even the field set itself.`,
          codeTabs: [
            {
              filename: 'DynamicForm.web.tsx',
              lang: 'tsx',
              preview: DOC_PREVIEWS.dynamic,
              code: `import { useDynamicForm } from '@runilib/react-formbridge'

const definition = {
  title: 'Feedback',
  fields: [
    { type: 'text', name: 'fullName', label: 'Full name', required: true },
    { type: 'email', name: 'email', label: 'Email', required: true },
    { type: 'textarea', name: 'comment', label: 'Comment', max: 400 },
  ],
}

export function DynamicFeedback() {
  const { form, fieldOrder, isLoading, loadError } = useDynamicForm(definition, {
    validateOn: 'onSubmit',
    defaultValues: { fullName: 'Ava Stone' },
  })

  if (!form) return isLoading ? <p>Loading…</p> : <p>Error: {loadError}</p>

  const { Form, fields } = form
  return (
    <Form onSubmit={(values) => api.send(values)}>
      {fieldOrder.map((name) => {
        const Field = fields[name]
        return <Field key={name} />
      })}
      <Form.Submit>Send</Form.Submit>
    </Form>
  )
}`,
            },
            {
              filename: 'DynamicForm.native.tsx',
              lang: 'tsx',
              preview: DOC_PREVIEWS.dynamic,
              code: `import { ScrollView, Text, View } from 'react-native'
import { useDynamicForm } from '@runilib/react-formbridge'

export function RemoteDynamic({ url }: { url: string }) {
  const { form, fieldOrder, isLoading, loadError } = useDynamicForm(
    async () => {
      const res = await fetch(url)
      return res.json()
    },
    { persist: { key: 'remote-form' } },
  )

  if (!form) return <View><Text>{loadError ?? (isLoading ? 'Loading…' : 'No form')}</Text></View>

  const { Form, fields } = form
  return (
    <ScrollView>
      <Form onSubmit={(values) => console.log(values)}>
        <View style={{ gap: 10, padding: 16 }}>
          {fieldOrder.map((name) => {
            const Field = fields[name]
            return <Field key={name} />
          })}
          <Form.Submit>Submit</Form.Submit>
        </View>
      </Form>
    </ScrollView>
  )
}`,
            },
          ],
        },
        {
          id: 'fb-tutorial-production-review',
          title: 'Readonly reviews before submit or approval',
          content: `Review screens become much easier to keep in sync when they reuse the same schema labels and option metadata.`,
          code: {
            filename: 'ReadonlyReview.tsx',
            lang: 'tsx',
            preview: DOC_PREVIEWS.readonly,
            code: `import { field, useReadonlyFormBridge } from '@runilib/react-formbridge'

const schema = {
  fullName: field.text('Full name'),
  email: field.email('Email'),
  country: field.select('Country').options(['FR', 'US', 'GB']),
}

export function ReviewCard({ values, original }: { values: any; original?: any }) {
  const readonly = useReadonlyFormBridge(schema, {
    values,
    originalValues: original,
    mode: original ? 'diff' : 'readonly',
  })

  const { ReadonlyFields, changedFields, hasChanges } = readonly

  return (
    <section>
      <ReadonlyFields.fullName />
      <ReadonlyFields.email />
      <ReadonlyFields.country />
      {hasChanges ? <p>{changedFields.length} fields changed.</p> : null}
    </section>
  )
}`,
          },
        },
        {
          id: 'fb-tutorial-production-analytics',
          title: 'Add analytics without rewriting the form',
          content: `Analytics hooks are most useful when they stay additive. Keep the same form API and plug in lifecycle tracking next to it.`,
          code: {
            filename: 'AnalyticsTutorial.tsx',
            lang: 'tsx',
            preview: DOC_PREVIEWS.analyticsWeb,
            code: `import {
  field,
  useFormBridge,
  useFormBridgeAnalytics,
} from '@runilib/react-formbridge'

const schema = {
  email: field.email('Email').required(),
  role: field.select('Role').options(['admin', 'editor', 'viewer']).required(),
}

export function InstrumentedSignup() {
  const form = useFormBridge(schema)

  useFormBridgeAnalytics(
    {
      formId: 'signup',
      exclude: ['password'],
      handlers: {
        onFieldFocus: (name) => analytics.track('field_focus', { name }),
        onFieldComplete: (name, ms) => analytics.track('field_complete', { name, ms }),
        onFormCompleted: (durationMs, submitCount, fieldCount) =>
          analytics.track('signup_success', { durationMs, submitCount, fieldCount }),
        onFormAbandoned: (pct, lastField, values) =>
          analytics.track('signup_abandon', { pct, lastField, values }),
      },
    },
    () => form.state.values,
  )

  return (
    <form.Form onSubmit={async (values) => api.signup(values)}>
      <form.fields.email />
      <form.fields.role />
      <form.Form.Submit>Create account</form.Form.Submit>
    </form.Form>
  )
}`,
          },
        },
      ],
    },

    // ── Core API ───────────────────────────────────────────────
    {
      id: 'fb-use-form-bridge',
      title: 'useFormBridge()',
      content: `Primary hook that turns a schema into a working form runtime.

- Use it when the schema is known in code and you want the main cross-platform API.
- It returns everything needed to render the form, read live state, run validation, persist drafts, and control the form imperatively.
- This is the foundation that the higher-level helpers build on top of.`,
      codeTabs: [
        {
          filename: 'useFormBridge.tsx',
          lang: 'tsx',
          code: `const {
  Form,
  fields,
  FieldError,
  FieldLabel,
  fieldController,
  state,
  visibility,
  isLoadingDraft,
  hasDraft,
  clearDraft,
  saveDraftNow,
  setValue,
  getValue,
  getValues,
  validate,
  reset,
  setError,
  clearErrors,
  watch,
  watchAll,
  submit,
} = useFormBridge(schema, {
  validateOn: 'onBlur',
  revalidateOn: 'onChange',
  resolver,
  persist,
  formKey: 'checkout-step-1',
  initialValues: { quantity: 2 },
  analytics,
  globalStyles: (state) => ({
    submit: {
      loadingText: state.isSubmitting ? 'Saving...' : 'Save',
    },
  }),
})`,
        },
      ],
      subsections: [
        {
          id: 'fb-use-form-bridge-options',
          title: 'Options',
          content: `${USE_FORM_BRIDGE_OPTIONS_SURFACE}`,
        },
        {
          id: 'fb-use-form-bridge-return',
          title: 'Return value',
          content: `${USE_FORM_BRIDGE_RETURN_SURFACE}`,
        },
      ],
    },
    {
      id: 'fb-form',
      title: 'Form component',
      content: `Wrapper component returned by the hook. It connects submit, validation, async loading state, and submit error handling to the generated field runtime.

- On web, it behaves like a smart \`<form>\`
- On native, it behaves like a smart wrapper you can place inside your layout
- \`Form.Submit\` is coupled to the same runtime, so loading and disabled states stay aligned with the form`,
      codeTabs: [
        {
          filename: 'Form.tsx',
          lang: 'tsx',
          code: `<Form
  onSubmit={saveProfile}
  onError={(errors) => console.log(errors)}
  onSubmitError={(error) => console.log(error)}
>
  {/* fields... */}
  <Form.Submit loadingText="Saving...">Save</Form.Submit>
</Form>`,
        },
      ],
      subsections: [
        {
          id: 'fb-form-props',
          title: 'Props',
          content: `${FORM_COMPONENT_PROPS_SURFACE}`,
        },
        {
          id: 'fb-submit-props',
          title: 'Form.Submit',
          content: `${FORM_SUBMIT_PROPS_SURFACE}`,
        },
      ],
    },
    {
      id: 'fb-fields',
      title: 'Generated fields',
      content: `\`fields.name\` renders the correct platform field for each schema key.

- You never manually register inputs or bind value/error state for standard fields
- Each generated component already knows its validation, current value, hidden/disabled state, and platform renderer
- Per-render overrides stay possible for labels, hints, placeholders, and presentation without mutating the original schema
- When you need a fully custom DOM/native tree but still want the same schema field, move to \`form.fieldController(name)\` instead of rewriting the field as \`field.custom()\``,
      subsections: [
        {
          id: 'fb-field-props',
          title: 'Props',
          content: `${GENERATED_FIELD_COMMON_PROPS_SURFACE}

${GENERATED_FIELD_UI_SURFACE}`,
        },
        {
          id: 'fb-field-behavior',
          title: 'How overrides behave',
          content: `- Schema-level builder methods define the default contract for every render of that field
- Component props are useful for one-off copy or presentation overrides in a specific screen or section
- Field components do not accept value/state overrides directly; validation, visibility, disabled rules, and submit lifecycle stay owned by the form runtime`,
        },
        {
          id: 'fb-field-strategy',
          title: 'Which customization path to pick',
          content: `- Start with \`<fields.name />\` when the built-in renderer already matches the input type
- Stay in \`ui\` / \`globalStyles\` when the structure is fine and you only need visual changes
- Use \`renderPicker\` for select-like fields when only the picker/modal/sheet needs to be custom
- Use \`fieldController(name)\` when the schema field type is still right, but you want to own the trigger, shell, modal, helper row, or extra surrounding UI
- Use \`field.custom(defaultValue)\` when the value shape or interaction model itself is not one of the built-in field types`,
        },
      ],
    },
    {
      id: 'fb-field-controller',
      title: 'fieldController()',
      content: `Use \`form.fieldController(name)\` when the schema field type is still correct, but the rendered UI should be entirely yours.

- Great for custom masked inputs, custom select triggers and sheets, design-system wrappers, composite widgets, or imperative focus flows
- Unlike \`field.custom()\`, the field keeps its original builder semantics: masked fields keep mask validation, selects keep options, phones keep phone metadata, and so on
- Unlike builder-level \`.render(fn)\`, the controller can be consumed anywhere in your component tree and plays nicely with surrounding layout, modals, previews, and extra buttons`,
      codeTabs: [
        {
          filename: 'FieldController.web.tsx',
          lang: 'tsx',
          code: `const form = useFormBridge({
  workspaceName: field.text('Workspace').required(),
  launchAccessCode: field
    .masked('OPS-9999-LL')
    .label('Launch access code')
    .required()
    .validateComplete('Complete the launch access code.'),
})

const accessCode = form.fieldController('launchAccessCode')

<input
  ref={(node) => accessCode.registerFocusable(node)}
  value={String(accessCode.value ?? '')}
  onChange={(event) => accessCode.onChange(event.target.value)}
  onBlur={accessCode.onBlur}
  onFocus={accessCode.onFocus}
/>

<button type="button" onClick={() => accessCode.focus()}>
  Focus custom field
</button>`,
        },
        {
          filename: 'FieldController.native.tsx',
          lang: 'tsx',
          code: `const form = useFormBridge({
  routingMode: field
    .select('Routing mode')
    .options([
      { label: 'Auto assign', value: 'auto' },
      { label: 'Manual review', value: 'review' },
      { label: 'Priority route', value: 'priority' },
    ])
    .defaultSelected('review')
    .required(),
})

const routingMode = form.fieldController('routingMode')

useEffect(() => {
  routingMode.registerFocusable({
    focus: () => setPickerOpen(true),
    blur: () => setPickerOpen(false),
  })

  return () => routingMode.registerFocusable(null)
}, [routingMode])

<Pressable onPress={() => routingMode.focus()}>
  <Text>
    {routingMode.options?.find((option) => option.value === routingMode.value)?.label}
  </Text>
</Pressable>`,
        },
      ],
      subsections: [
        {
          id: 'fb-field-controller-surface',
          title: 'Surface',
          content: `${FIELD_CONTROLLER_SURFACE}`,
        },
        {
          id: 'fb-field-controller-notes',
          title: 'How it compares to other escape hatches',
          content: `- Prefer \`fieldController(name)\` over \`field.custom()\` when you still want a built-in field type such as \`select\`, \`masked\`, \`phone\`, or \`otp\`
- Prefer \`fieldController(name)\` over \`.render(fn)\` when the custom UI needs surrounding layout, external buttons, modal state, or imperative focus control
- Prefer \`renderPicker\` over \`fieldController(name)\` when only the picker surface changes and the built-in field trigger is already good enough`,
        },
      ],
    },
    {
      id: 'fb-state',
      title: 'State',
      content: `Current reactive state returned by \`useFormBridge()\`.

- Read from it to disable buttons, show summaries, build progress UI, or inspect submit lifecycle
- It is already derived from the schema and the current user interactions`,
      code: {
        filename: 'State.ts',
        lang: 'ts',

        code: `form.state.values
form.state.errors
form.state.touched
form.state.dirty
form.state.status // 'idle' | 'validating' | 'submitting' | 'success' | 'error'
form.state.isValid
form.state.isDirty
form.state.isSubmitting
form.state.isSuccess
form.state.isError
form.state.submitCount`,
      },
      subsections: [
        {
          id: 'fb-state-surface',
          title: 'Complete state shape',
          content: `${FORM_STATE_SURFACE}`,
        },
      ],
    },
    {
      id: 'fb-actions',
      title: 'Actions & helpers',
      content: `Imperative helpers are useful when the form participates in a bigger flow: wizard steps, route changes, modal close guards, inline autosave, custom field chrome, or external events.`,
      code: {
        filename: 'Actions.ts',
        lang: 'ts',

        code: `await form.validate(names?)
form.reset(values?)
form.setValue('firstName', 'Ava')
form.getValue('firstName')
form.getValues()
form.setError('email', 'Already used')
form.clearErrors(['email'])
form.watch('email')
form.watchAll()
await form.submit()
const email = form.fieldController('email')
email.onChange('ops@runilib.dev')
email.focus()
await form.saveDraftNow()
await form.clearDraft()
form.visibility.company?.visible`,
      },
      subsections: [
        {
          id: 'fb-actions-surface',
          title: 'Complete helper surface',
          content: `${ACTIONS_HELPERS_SURFACE}`,
        },
        {
          id: 'fb-actions-field-controller',
          title: 'Field-scoped imperative control',
          content: `Use \`form.fieldController(name)\` when the action belongs to one field rather than the whole form.

- Examples: opening a custom picker, focusing a masked input from another button, mapping server validation back to a single custom field, or building your own review shell around one schema key

${FIELD_CONTROLLER_SURFACE}`,
        },
      ],
    },
    {
      id: 'fb-validation',
      title: 'Validation',
      content: `Validation in react-formbridge happens in two layers.

- Field builders cover most everyday rules directly in the schema: \`required\`, \`min\`, \`max\`, \`pattern/patterns\`, cross-field equality with \`matches/sameAs\`, number helpers, \`mustBeTrue\`, \`validate(fn)\`, and more.
- A schema-level \`resolver\` lets an external validator such as Zod or Yup own the final result shape.
- Defaults today: \`validateOn='onBlur'\`, \`revalidateOn='onChange'\`.`,
      subsections: [
        {
          id: 'fb-validation-field-level',
          title: 'Field-level validation',
          content: `Use builder methods when the rule belongs to the field itself: required inputs, length or numeric constraints, agreement toggles, file limits, phone formatting, and cross-field checks such as confirm password.

${VALIDATION_RUNTIME_SURFACE}`,
        },
        {
          id: 'fb-validation-resolver',
          title: 'Resolver validation',
          content: `Use a resolver when you already own a domain schema elsewhere in the app. The resolver returns \`{ values, errors }\` and becomes the validation source of truth for the form runtime.

${RESOLVER_SHARED_OPTIONS_SURFACE}`,
        },
        {
          id: 'fb-validation-triggers',
          title: 'Trigger matrix',
          content: `Accepted validation trigger values:
- \`'onBlur'\` — validate after blur
- \`'onChange'\` — validate on every change
- \`'onSubmit'\` — validate only on submit
- \`'onTouched'\` — validate after blur, then on every subsequent change

Runtime defaults:
- \`validateOn = 'onBlur'\`
- \`revalidateOn = 'onChange'\``,
        },
      ],
    },

    {
      id: 'fb-builder-basics',
      title: 'Builder basics',
      content: `Most builders share the same fluent inheritance tree, so the quickest way to read the API is to start with the common base surface and then add the builder-specific methods.

${BASE_BUILDER_METHODS}

${STRING_BUILDER_METHODS}

Special cases:
- \`field.select()\` and \`field.radio()\` extend the base builder with \`options(...)\`, \`optionsFrom(...)\`, and \`searchable(...)\`
- \`field.phone()\` extends the base builder directly with country-aware phone helpers such as \`defaultCountry()\` and \`storeE164()\`
- \`field.file()\` is the main exception: it uses its own upload-focused builder surface and does not expose \`behavior()\`, \`render()\`, or the conditional helpers from \`BaseFieldBuilder\``,
      subsections: [
        {
          id: 'fb-builder-basics-behavior',
          title: 'Behavior vs styling',
          content: `- Put business rules and reusable field behavior in the builder
- Put shared visual theme in \`useFormBridge(schema, { globalStyles })\`
- Put one-off styling exceptions on the rendered field component via \`className\`, \`style\`, and \`ui\` on web, or \`style\` and \`ui\` on native`,
        },
        {
          id: 'fb-builder-basics-recipes',
          title: 'Shared method examples',
          content: `${BASE_BUILDER_METHOD_EXAMPLES}

${STRING_BUILDER_METHOD_EXAMPLES}`,
        },
      ],
    },

    // ── Field builders per builder ────────────────────────────
    {
      id: 'fb-text',
      title: 'field.text()',
      content: `The base builder for free-form strings.

- Use it for names, titles, slugs, comments, usernames, or any string that does not deserve a more specialized builder.
- Most string-oriented builders build on top of the same mental model: label, default value, validation, transform, hint, and platform rendering.`,
      codeTabs: [
        {
          filename: 'Text.web.tsx',
          lang: 'tsx',

          code: `const schema = {
  fullName: field.text('Full name')
    .required('Name is required')
    .trim()
    .min(2)
    .max(80)
    .pattern(/^[a-z\\s'-]+$/i, 'Only letters and spaces.'),
}
const { Form, fields } = useFormBridge(schema)
<Form onSubmit={save}><fields.fullName /><Form.Submit>Save</Form.Submit></Form>`,
        },
        {
          filename: 'Text.native.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.overviewNative,
          code: `const schema = {
  fullName: field.text('Full name').required().trim(),
}
const { Form, fields } = useFormBridge(schema)
<Form onSubmit={save}><fields.fullName /><Form.Submit>Save</Form.Submit></Form>`,
        },
      ],
      subsections: [
        {
          id: 'fb-text-props',
          title: 'Props & defaults',
          content: `Defaults and shape:
- label is required
- defaultValue is \`''\`
- type is \`text\`

Complete builder surface:
${BASE_BUILDER_METHODS}

${STRING_BUILDER_METHODS}`,
        },
        {
          id: 'fb-text-recipes',
          title: 'Mini recipes',
          content: `Common text-builder combos:
- Username rules → \`field.text('Username').trim().min(3).max(20).pattern(/^[a-z0-9_]+$/i, 'Letters, numbers, and underscores only.')\`
- SEO-friendly slug → \`field.text('Slug').transform((value) => value.trim().toLowerCase().replace(/\\s+/g, '-')).pattern(/^[a-z0-9-]+$/)\`
- Conditional company field → \`field.text('Company').visibleWhen('accountType', 'company').requiredWhen('accountType', 'company').resetOnHide()\`

Shared method examples:
${BASE_BUILDER_METHOD_EXAMPLES}

${STRING_BUILDER_METHOD_EXAMPLES}`,
        },
      ],
    },
    {
      id: 'fb-email',
      title: 'field.email()',
      content: `Specialized string builder for email inputs.

- It keeps the same API as \`field.text()\`
- It adds a built-in email format validator
- It is usually paired with \`trim()\`, \`lowercase()\`, and web autocomplete hints`,
      codeTabs: [
        {
          filename: 'Email.web.tsx',
          lang: 'tsx',

          code: `const schema = {
  email: field.email('Work email').required().lowercase().trim(),
}
const { Form, fields } = useFormBridge(schema)
<Form onSubmit={save}><fields.email ui={{ inputProps:{ autoComplete:'email' }}} /><Form.Submit>Send</Form.Submit></Form>`,
        },
        {
          filename: 'Email.native.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.overviewNative,
          code: `const schema = {
  email: field.email('Work email').required().trim(),
}

const { Form, fields } = useFormBridge(schema)

<Form onSubmit={save}>
  <fields.email />
  <Form.Submit>Send</Form.Submit>
</Form>`,
        },
      ],
      subsections: [
        {
          id: 'fb-email-props',
          title: 'Props & defaults',
          content: `Defaults and built-in behavior:
- defaultValue is \`''\`
- type is \`email\`
- \`field.email()\` starts with a built-in email format validator wired through \`format(...)\`

Complete builder surface:
${BASE_BUILDER_METHODS}

${STRING_BUILDER_METHODS}

Email-specific method:
- \`excludeEmailDomains(domains, message?)\` rejects a list of blocked domains such as personal inbox providers`,
        },
        {
          id: 'fb-email-recipes',
          title: 'Mini recipes',
          content: `Common email-builder combos:
- Work-only email → \`field.email('Work email').trim().lowercase().excludeEmailDomains(['gmail.com', 'yahoo.com'], 'Use your company email.')\`
- Enterprise login field → \`field.email('Email').required().behavior({ autoComplete: 'email', inputMode: 'email' }).placeholder('you@company.com')\`
- Domain-specific guard → \`field.email('Partner email').validate((value) => value.endsWith('@partner.io') ? null : 'Use your @partner.io address.')\`

Shared method examples:
${BASE_BUILDER_METHOD_EXAMPLES}

${STRING_BUILDER_METHOD_EXAMPLES}`,
        },
      ],
    },
    {
      id: 'fb-password',
      title: 'field.password()',
      content: `Password-specialized builder for auth and account flows.

- Use \`strong()\` for built-in strength rules
- Use \`sameAs('password')\` or \`matches('password')\` for confirmation fields
- Use \`withStrengthIndicator()\` when you want richer UI feedback without switching to a custom renderer`,
      codeTabs: [
        {
          filename: 'Password.tsx',
          lang: 'tsx',

          code: `const schema = {
  password: field.password('Password')
    .required()
    .strong()
    .withStrengthIndicator({ showBar:true, showRules:true, blockWeak:true }),
  confirm: field.password('Confirm').required().sameAs('password','Passwords must match.'),
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-password-props',
          title: 'Props & defaults',
          content: `Defaults and shape:
- defaultValue is \`''\`
- type is \`password\`

Complete builder surface:
${BASE_BUILDER_METHODS}

${STRING_BUILDER_METHODS}

Password-specific methods:
- \`strong(message?)\` enables the built-in strong-password validator (length, upper, lower, number, special char)
- \`withStrengthIndicator(options?)\` adds strength UI metadata with \`showBar?\`, \`showLabel?\`, \`showRules?\`, \`showEntropy?\`, \`barHeight?\`, \`barRadius?\`, \`config?\`, \`levels?\`, \`blockWeak?\`, and \`blockMsg?\`
- The inherited \`sameAs(...)\` / \`matches(...)\` methods are especially useful for confirmation fields`,
        },
        {
          id: 'fb-password-recipes',
          title: 'Mini recipes',
          content: `Common password-builder combos:
- Signup password → \`field.password('Password').required().strong().withStrengthIndicator({ showBar: true, showRules: true, blockWeak: true })\`
- Confirm password → \`field.password('Confirm password').required().sameAs('password', 'Passwords must match.')\`
- Rotation flow → \`field.password('New password').required().strong().validate((value, allValues) => value !== allValues.currentPassword ? null : 'Choose a different password.')\`

Shared method examples:
${BASE_BUILDER_METHOD_EXAMPLES}

${STRING_BUILDER_METHOD_EXAMPLES}`,
        },
      ],
    },
    {
      id: 'fb-tel',
      title: 'field.tel()',
      content: `Generic telephone string builder without country metadata.

- Use it when you only need a basic phone text input
- Use \`field.phone()\` instead when you need country-aware parsing, dial codes, E.164 output, or built-in phone validation`,
      codeTabs: [
        {
          filename: 'Tel.tsx',
          lang: 'tsx',

          code: `const schema = {
  supportPhone: field.tel('Support phone')
    .pattern(/^[+\\d\\s()-]{6,20}$/, 'Enter a valid phone.')
    .required(),
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-tel-props',
          title: 'Props & defaults',
          content: `Defaults and built-in behavior:
- defaultValue is \`''\`
- type is \`tel\`
- \`field.tel()\` starts with a built-in generic phone regex wired through \`format(...)\`

Complete builder surface:
${BASE_BUILDER_METHODS}

${STRING_BUILDER_METHODS}`,
        },
        {
          id: 'fb-tel-recipes',
          title: 'Mini recipes',
          content: `Common tel-builder combos:
- Support phone field → \`field.tel('Support phone').required().pattern(/^[+\\d\\s()-]{6,20}$/, 'Enter a valid phone number.').hint('Include country code if needed')\`
- Optional callback number → \`field.tel('Callback number').optional().trim().placeholder('+33 6 12 34 56 78')\`
- Conditional phone contact → \`field.tel('Phone').visibleWhen('contactMethod', 'phone').requiredWhen('contactMethod', 'phone').clearOnHide()\`

Shared method examples:
${BASE_BUILDER_METHOD_EXAMPLES}

${STRING_BUILDER_METHOD_EXAMPLES}`,
        },
      ],
    },
    {
      id: 'fb-url',
      title: 'field.url()',
      content: `String builder for URLs with an HTTP/HTTPS format check out of the box.

- Good for profile websites, callback URLs, portfolio links, or support links
- Use \`hint()\` to reinforce the expected shape, for example \`https://...\``,
      codeTabs: [
        {
          filename: 'Url.tsx',
          lang: 'tsx',

          code: `const schema = { website: field.url('Website').optional().trim() }`,
        },
      ],
      subsections: [
        {
          id: 'fb-url-props',
          title: 'Props & defaults',
          content: `Defaults and built-in behavior:
- defaultValue is \`''\`
- type is \`url\`
- \`field.url()\` starts with a built-in HTTP/HTTPS validator wired through \`format(...)\`

Complete builder surface:
${BASE_BUILDER_METHODS}

${STRING_BUILDER_METHODS}`,
        },
        {
          id: 'fb-url-recipes',
          title: 'Mini recipes',
          content: `Common url-builder combos:
- Optional portfolio → \`field.url('Portfolio').optional().trim().hint('Use a full https:// URL')\`
- HTTPS-only webhook → \`field.url('Webhook URL').required().format(/^https:\\/\\/.+$/, 'Use an HTTPS URL.')\`
- Profile website with fallback label → \`field.url('Website').placeholder('https://example.com').label('Public website')\`

Shared method examples:
${BASE_BUILDER_METHOD_EXAMPLES}

${STRING_BUILDER_METHOD_EXAMPLES}`,
        },
      ],
    },
    {
      id: 'fb-textarea',
      title: 'field.textarea()',
      content: `Multiline version of the string builder.

- Useful for bios, comments, notes, issue descriptions, support tickets, or feedback boxes
- Usually paired with \`max()\` and \`hint()\` to keep user expectations clear`,
      codeTabs: [
        {
          filename: 'Bio.tsx',
          lang: 'tsx',

          code: `const schema = { bio: field.textarea('Bio').max(400) }`,
        },
      ],
      subsections: [
        {
          id: 'fb-textarea-props',
          title: 'Props & defaults',
          content: `Defaults and shape:
- defaultValue is \`''\`
- type is \`textarea\`

Complete builder surface:
${BASE_BUILDER_METHODS}

${STRING_BUILDER_METHODS}`,
        },
        {
          id: 'fb-textarea-recipes',
          title: 'Mini recipes',
          content: `Common textarea-builder combos:
- Support message → \`field.textarea('Message').required().min(20).max(1000).hint('Describe the issue with as much detail as possible.')\`
- Public bio → \`field.textarea('Bio').max(280).trim().placeholder('Tell the community a bit about yourself')\`
- Conditional note → \`field.textarea('Additional notes').visibleWhenTruthy('hasNotes').keepOnHide()\`

Shared method examples:
${BASE_BUILDER_METHOD_EXAMPLES}

${STRING_BUILDER_METHOD_EXAMPLES}`,
        },
      ],
    },
    {
      id: 'fb-number',
      title: 'field.number()',
      content: `Numeric builder for quantities, prices, ratings, ages, and thresholds.

- The stored value is numeric, not string-based
- Numeric helpers live directly on the builder: \`positive()\`, \`nonNegative()\`, \`integer()\`, and \`step()\``,
      codeTabs: [
        {
          filename: 'Number.tsx',
          lang: 'tsx',

          code: `const schema = {
  quantity: field.number('Quantity')
    .required()
    .positive()
    .integer()
    .step(5, 'Order in increments of 5'),
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-number-props',
          title: 'Props & defaults',
          content: `Defaults and shape:
- defaultValue is \`0\`
- type is \`number\`

Complete builder surface:
${BASE_BUILDER_METHODS}

Number-specific methods:
- \`min(value, message?)\` sets the minimum accepted numeric value
- \`max(value, message?)\` sets the maximum accepted numeric value
- \`positive(message?)\` requires a strictly positive value
- \`nonNegative(message?)\` allows zero but rejects negative numbers
- \`integer(message?)\` requires a whole number
- \`step(stepValue, message?)\` requires the value to be a clean multiple of the provided step`,
        },
        {
          id: 'fb-number-recipes',
          title: 'Mini recipes',
          content: `Common number-builder combos:
- Order quantity → \`field.number('Quantity').required().integer().positive().step(5, 'Use increments of 5')\`
- Discount percent → \`field.number('Discount').min(0).max(100).nonNegative()\`
- Seat limit with business guard → \`field.number('Seats').integer().validate((value) => value <= 500 ? null : 'Maximum 500 seats per workspace.')\`

Shared method examples:
${BASE_BUILDER_METHOD_EXAMPLES}`,
        },
      ],
    },
    {
      id: 'fb-checkbox',
      title: 'field.checkbox()',
      content: `Boolean builder rendered as a checkbox.

- Best for agreements, acceptance of terms, and optional boolean choices
- Use \`mustBeTrue()\` when the field is legally or functionally required before submit`,
      codeTabs: [
        {
          filename: 'Checkbox.web.tsx',
          lang: 'tsx',

          code: `const schema = {
  terms: field.checkbox('I accept the Terms of Service')
    .mustBeTrue('Please accept the terms to continue.'),
}`,
        },
        {
          filename: 'Checkbox.native.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.overviewNative,
          code: `const schema = {
  marketing: field.checkbox('Receive product updates'),
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-checkbox-props',
          title: 'Props & defaults',
          content: `Defaults and shape:
- defaultValue is \`false\`
- type is \`checkbox\`

Complete builder surface:
${BASE_BUILDER_METHODS}

Boolean-specific method:
- \`mustBeTrue(message?)\` turns the checkbox into a hard validation rule

Notes:
- Because it inherits from \`BaseFieldBuilder\`, methods such as \`placeholder()\`, \`transform()\`, and \`render()\` still exist even if the default checkbox renderer mostly cares about boolean-oriented props`,
        },
        {
          id: 'fb-checkbox-recipes',
          title: 'Mini recipes',
          content: `Common checkbox-builder combos:
- Terms acceptance → \`field.checkbox('I accept the Terms').mustBeTrue('Please accept the terms to continue.')\`
- Optional marketing opt-in → \`field.checkbox('Receive updates').hint('You can unsubscribe any time')\`
- Conditional legal consent → \`field.checkbox('Accept partner sharing').visibleWhen('plan', 'enterprise').clearOnHide()\`

Shared method examples:
${BASE_BUILDER_METHOD_EXAMPLES}`,
        },
      ],
    },
    {
      id: 'fb-switch',
      title: 'field.switch()',
      content: `Boolean builder rendered as a switch or toggle.

- Prefer it for settings, preferences, feature flags, and on/off states
- Keep \`field.checkbox()\` for agreements and legal acceptance flows`,
      codeTabs: [
        {
          filename: 'Switch.web.tsx',
          lang: 'tsx',

          code: `const schema = {
  notifications: field.switch('Enable email notifications'),
}`,
        },
        {
          filename: 'Switch.native.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.overviewNative,
          code: `const schema = {
  publicProfile: field.switch('Public profile').hint('Visible to other members'),
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-switch-props',
          title: 'Props & defaults',
          content: `Defaults and shape:
- defaultValue is \`false\`
- type is \`switch\`

Complete builder surface:
${BASE_BUILDER_METHODS}

Boolean-specific method:
- \`mustBeTrue(message?)\` requires the switch to be enabled

Notes:
- As with \`field.checkbox()\`, inherited methods such as \`placeholder()\`, \`transform()\`, and \`render()\` are still part of the fluent surface because the builder extends \`BaseFieldBuilder\``,
        },
        {
          id: 'fb-switch-recipes',
          title: 'Mini recipes',
          content: `Common switch-builder combos:
- User preference → \`field.switch('Enable notifications').defaultValue(true)\`
- Publish toggle → \`field.switch('Public profile').hint('Visible to other members')\`
- Required product activation → \`field.switch('Enable billing').mustBeTrue('Billing must stay enabled for this plan.')\`

Shared method examples:
${BASE_BUILDER_METHOD_EXAMPLES}`,
        },
      ],
    },
    {
      id: 'fb-select',
      title: 'field.select()',
      content: `Single-choice picker for finite option lists.

- Use \`options(list)\` for local options
- Use \`optionsFrom(fetcher, config)\` for remote datasets
- Add \`searchable()\` when a richer lookup experience is needed
- Use \`defaultSelected(...)\` / \`selected(...)\` when the form should open on a meaningful choice instead of an empty placeholder`,
      codeTabs: [
        {
          filename: 'Select.web.tsx',
          lang: 'tsx',

          code: `const schema = {
  workspace: field.select('Workspace')
    .options([
      { label: 'Operations workspace', value: 'ops' },
      { label: 'Revenue cockpit', value: 'revenue' },
      { label: 'Support command center', value: 'support' },
    ])
    .defaultSelected('revenue')
    .required(),
}`,
        },
        {
          filename: 'Select.native.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.overviewNative,
          code: `const schema = {
  seatPack: field.select('Seat pack')
    .options([
      { label: 'Starter · 5 seats', value: 5 },
      { label: 'Growth · 12 seats', value: 12 },
      { label: 'Scale · 25 seats', value: 25 },
    ])
    .defaultSelected(12),
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-select-async-config',
          title: 'optionsFrom config',
          content: `- \`key\`
- \`cacheTtl\` (default \`60000\`)
- \`debounce\` (default \`300\`)
- \`minChars\` (default \`0\`)
- \`dependsOn\` (default \`[]\`)
- \`initialOptions\` (default \`[]\`)
- \`fetchOnMount\` (default \`true\`)
- \`keepPreviousOptions\` (default \`true\`)
- \`preserveOnError\` (default \`true\`)`,
        },
        {
          id: 'fb-select-custom-picker',
          title: 'Custom picker modal',
          content: `Need a custom modal, bottom sheet, command palette, or searchable dialog instead of the built-in picker? Pass \`renderPicker\`.

- Works for local options and \`optionsFrom(...)\`
- Works globally through \`useFormBridge(schema, { globalStyles })\`
- Works per schema field through \`behavior(...)\`
- Works per rendered field through \`<fields.city ui={{ renderPicker }} />\`
- If the built-in trigger itself should disappear too, keep the same select schema field and move to \`form.fieldController(name)\`

\`\`\`tsx
const schema = {
  city: field
    .select('City')
    .optionsFrom(fetchCities, {
      key: 'city-search',
      debounce: 250,
      minChars: 2,
    })
    .searchable()
    .behavior({
      renderPicker: ({
        open,
        search,
        setSearch,
        options,
        loading,
        error,
        triggerLabel,
        closePicker,
        selectOption,
      }) =>
        open ? (
          <CityLookupModal
            title={triggerLabel}
            query={search}
            loading={loading}
            error={error}
            items={options}
            onQueryChange={setSearch}
            onClose={closePicker}
            onSelect={(option) => selectOption(option)}
          />
        ) : null,
    }),
}
\`\`\`

The \`renderPicker\` context gives you: \`open\`, \`search\`, \`setSearch\`, \`clearSearch\`, \`options\`, \`loading\`, \`error\`, \`selectedOption\`, \`triggerLabel\`, \`openPicker\`, \`closePicker\`, and \`selectOption\`. That makes it easy to plug the same field into a design-system modal on web, a native sheet on mobile, or a fully custom async search experience without replacing the rest of the field API.`,
        },
        {
          id: 'fb-select-props',
          title: 'Props & defaults',
          content: `Defaults and shape:
- defaultValue is \`''\`
- type is \`select\`
- selected values are stored as the option \`value\`, so both \`string\` and \`number\` are supported

Complete builder surface:
${BASE_BUILDER_METHODS}

Select-specific methods:
- \`defaultValue(valueOrOption)\` sets the initially selected option and accepts either a raw option value or the full \`{ label, value }\` object
- \`defaultSelected(valueOrOption)\` alias for \`defaultValue(...)\` with more explicit naming for choice fields
- \`selected(valueOrOption)\` another alias when you prefer read-like wording in the builder chain
- \`options(list)\` registers local options from \`string[]\` or \`{ label, value }[]\`
- \`optionsFrom(fetcher, config)\` registers remote / async options with debounce, cache, and dependency support
- \`searchable(value = true)\` enables search-oriented picker UX

Notes:
- \`placeholder()\`, \`hint()\`, \`render()\`, and all conditional helpers are inherited from \`BaseFieldBuilder\`
- Custom picker UIs are usually wired through \`behavior({ renderPicker })\` or field-level \`ui.renderPicker\` rather than a dedicated builder method`,
        },
        {
          id: 'fb-select-recipes',
          title: 'Mini recipes',
          content: `Common select-builder combos:
- Preselected workspace → \`field.select('Workspace').options(WORKSPACE_OPTIONS).defaultSelected('revenue').required()\`
- Numeric seat packs → \`field.select('Seat pack').options([{ label: 'Growth · 12 seats', value: 12 }]).defaultSelected(12)\`
- Async city search → \`field.select('City').optionsFrom(fetchCities, { key: 'city-search', debounce: 250, minChars: 2 }).searchable()\`
- Country-dependent region picker → \`field.select('Region').optionsFrom(fetchRegions, { key: 'regions', dependsOn: ['country'] }).visibleWhenTruthy('country').resetOnHide()\`
- Fully custom select trigger → keep \`field.select(...)\` in the schema, then drive your own trigger and modal from \`form.fieldController('routingMode')\`

Shared method examples:
${BASE_BUILDER_METHOD_EXAMPLES}`,
        },
      ],
    },
    {
      id: 'fb-radio',
      title: 'field.radio()',
      content: `Radio-group version of the select builder.

- Best when the number of options is small and each choice should stay visible
- It shares the same option shape as \`field.select()\``,
      codeTabs: [
        {
          filename: 'Radio.tsx',
          lang: 'tsx',

          code: `const schema = {
  role: field.radio('Role')
    .options(['Admin','Editor','Viewer'])
    .required(),
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-radio-props',
          title: 'Props & defaults',
          content: `Defaults and shape:
- defaultValue is \`''\`
- type is \`radio\`
- selected values are stored as the option \`value\`, so both \`string\` and \`number\` are supported

Complete builder surface:
${BASE_BUILDER_METHODS}

Radio-specific methods:
- \`defaultValue(valueOrOption)\`, \`defaultSelected(valueOrOption)\`, and \`selected(valueOrOption)\` all work here too because radio reuses the same \`SelectFieldBuilder\`
- \`options(list)\` registers local visible choices from \`string[]\` or \`{ label, value }[]\`
- \`optionsFrom(fetcher, config)\` is available here too because radio reuses the same \`SelectFieldBuilder\`
- \`searchable(value = true)\` also exists, even though radio groups are most often used for short visible lists

Notes:
- Choose radio when all choices should remain visible at once, and select when a picker / dropdown is a better fit`,
        },
        {
          id: 'fb-radio-recipes',
          title: 'Mini recipes',
          content: `Common radio-builder combos:
- Role choice → \`field.radio('Role').options(['Admin', 'Editor', 'Viewer']).required()\`
- Billing cadence → \`field.radio('Billing cadence').options([{ label: 'Monthly', value: 'month' }, { label: 'Yearly', value: 'year' }]).defaultValue('month')\`
- Conditional shipping method → \`field.radio('Delivery type').options(['Home', 'Pickup']).visibleWhenTruthy('canShip')\`

Shared method examples:
${BASE_BUILDER_METHOD_EXAMPLES}`,
        },
      ],
    },
    {
      id: 'fb-date',
      title: 'field.date()',
      content: `Date-specialized builder with min/max date helpers.

- Use it for booking windows, deadlines, birth dates, subscription start dates, or any date constrained by business rules
- It keeps the same string-field ergonomics while adding semantic date validation`,
      codeTabs: [
        {
          filename: 'Date.web.tsx',
          lang: 'tsx',

          code: `const schema = {
  startDate: field.date('Start date')
    .required()
    .minDate(new Date(), 'Choose a future date.'),
}`,
        },
        {
          filename: 'Date.native.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.overviewNative,
          code: `const schema = {
  dateOfBirth: field.date('Date of birth')
    .maxDate('2008-01-01', 'You must be at least 18 years old.'),
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-date-props',
          title: 'Props & defaults',
          content: `Defaults and shape:
- defaultValue is \`''\`
- type is \`date\`

Complete builder surface:
${BASE_BUILDER_METHODS}

${STRING_BUILDER_METHODS}

Date-specific methods:
- \`minDate(Date | string, message?)\` validates the date against a lower bound
- \`maxDate(Date | string, message?)\` validates the date against an upper bound`,
        },
        {
          id: 'fb-date-recipes',
          title: 'Mini recipes',
          content: `Common date-builder combos:
- Future booking date → \`field.date('Booking date').required().minDate(new Date(), 'Choose a future date.')\`
- Adult-only signup → \`field.date('Date of birth').maxDate('2008-01-01', 'You must be at least 18 years old.')\`
- Windowed promotion → \`field.date('Campaign end').minDate('2026-04-01').maxDate('2026-12-31')\`

Shared method examples:
${BASE_BUILDER_METHOD_EXAMPLES}

${STRING_BUILDER_METHOD_EXAMPLES}`,
        },
      ],
    },
    {
      id: 'fb-phone',
      title: 'field.phone()',
      content: `Country-aware phone builder with parsing and validation built in.

- Use it when you need real phone UX rather than a free-form telephone string
- It supports country defaults, preferred countries, dial code display, E.164 storage, and format validation`,
      codeTabs: [
        {
          filename: 'Phone.tsx',
          lang: 'ts',

          code: `const schema = {
  phone: field.phone('Phone')
    .defaultCountry('FR')
    .preferredCountries(['FR','US','GB'])
    .searchable()
    .showFlag(true)
    .showDialCode(true)
    .storeE164()
    .required(),
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-phone-props',
          title: 'Props & defaults',
          content: `Defaults and shape:
- defaultValue is \`null\`
- type is \`phone\`
- placeholder defaults to \`'Enter phone number'\`
- debounce defaults to \`0\` for immediate formatting feedback
- default country is \`'FR'\`
- preferred countries default to \`['FR', 'US', 'GB', 'DE', 'ES']\`

Complete builder surface:
${BASE_BUILDER_METHODS}

Phone-specific methods:
- \`defaultCountry(code)\` changes the initial selected country
- \`preferredCountries(codes)\` reorders the country shortlist shown first
- \`searchable(value = true)\` toggles country search
- \`showFlag(value = true)\` toggles flag rendering
- \`showDialCode(value = true)\` toggles dial code rendering
- \`storeE164()\` stores E.164 output instead of the richer phone payload
- \`validateFormat(value = true)\` turns libphonenumber format validation on or off

Phone-specific overrides of shared methods:
- \`required(message?)\` keeps the same signature as the base builder but defaults the message to \`'Please enter a phone number.'\`
- \`placeholder(text?)\` keeps the same signature as the base builder but defaults to \`'Enter phone number'\`
- \`hint(text)\` and \`disabled(value = true)\` are also explicitly overridden while keeping the same fluent API`,
        },
        {
          id: 'fb-phone-recipes',
          title: 'Mini recipes',
          content: `Common phone-builder combos:
- International signup field → \`field.phone('Phone').defaultCountry('FR').preferredCountries(['FR', 'US', 'GB']).searchable().showFlag(true).showDialCode(true)\`
- API-ready storage → \`field.phone('Phone').storeE164().required().validateFormat(true)\`
- Minimal disabled contact field → \`field.phone('Support line').defaultCountry('US').disabled().hint('Managed by your account team')\`

Shared method examples:
${BASE_BUILDER_METHOD_EXAMPLES}`,
        },
      ],
    },
    {
      id: 'fb-masked',
      title: 'field.masked()',
      content: `String input constrained by a mask pattern or preset.

- Use it for credit cards, expiry dates, ZIP codes, formatted identifiers, or short structured values
- Pass a built-in preset from \`MASKS\`, a raw pattern string, or a \`{ pattern, tokens }\` object as the first argument
- Label the field separately with \`label(...)\` when you need display copy
- Masking keeps input readable while preserving normal schema-level validation, and the renderer now adapts its width and input mode to the mask profile`,
      codeTabs: [
        {
          filename: 'Masked.tsx',
          lang: 'tsx',

          code: `import { MASKS } from '@runilib/react-formbridge'

const schema = {
  cardNumber: field
    .masked(MASKS.CARD_16)
    .label('Card number')
    .required()
    .showMaskInPlaceholder()
    .validateComplete('Card is incomplete.'),

  licensePlate: field
    .masked('LL-999-LL')
    .label('License plate')
    .tokens({
      L: /[A-Z]/,
    })
    .uppercase(),
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-masked-props',
          title: 'Props & defaults',
          content: `Defaults and shape:
- the first argument is required and can be a preset from \`MASKS\`, a custom pattern string, or a \`{ pattern, tokens }\` object
- defaultValue is \`''\`
- masked values are stored by default, so separators such as \`/\`, \`-\`, and spaces are preserved

Complete builder surface:
${BASE_BUILDER_METHODS}

${STRING_BUILDER_METHODS}

Mask-specific methods:
- \`storeRaw()\` stores the unformatted raw payload instead of the masked value
- \`storeMasked()\` explicitly keeps the formatted value
- \`showPlaceholder(char?)\` renders placeholder characters directly inside the current value
- \`showMaskInPlaceholder(char?)\` renders the mask as placeholder text while keeping the underlying value empty
- \`tokens(map)\` adds or overrides token characters for advanced masks
- \`validateComplete(message?)\` requires the entire mask to be filled before submit`,
        },
        {
          id: 'fb-masked-runtime',
          title: 'Adaptive mask runtime',
          content: `The built-in masked renderers now adapt to the mask instead of treating every mask like the same numeric field.

- Numeric-only masks keep numeric-friendly keyboard / input mode hints
- Alphanumeric masks stop behaving like numeric-only inputs when the token map accepts letters
- \`maxLength\` follows the visible mask length, including separators
- Short masks stay compact while longer masks can claim the width they need, which makes side-by-side layouts easier without hand-tuned widths

If you want the mask behavior but your own shell, prefix badge, trigger row, or fully custom layout, keep the field as \`field.masked(...)\` in the schema and drive the UI through \`form.fieldController(name)\`.`,
        },
        {
          id: 'fb-masked-recipes',
          title: 'Mini recipes',
          content: `Common masked-builder combos:
- Credit card → \`field.masked(MASKS.CARD_16).label('Card number').required().showMaskInPlaceholder().validateComplete('Card number is incomplete.')\`
- Raw backup code → \`field.masked('9999-9999').label('Backup code').storeRaw().validateComplete()\`
- Custom plate format → \`field.masked('LL-999-LL').label('Plate').tokens({ L: /[A-Z]/ }).uppercase().storeMasked()\`
- Fully custom masked shell → keep \`field.masked('OPS-9999-LL')\` in the schema, then render your own UI with \`form.fieldController('launchAccessCode')\`

Shared method examples:
${BASE_BUILDER_METHOD_EXAMPLES}

${STRING_BUILDER_METHOD_EXAMPLES}`,
        },
        {
          id: 'fb-masked-tokens',
          title: 'Pattern syntax',
          content: `- \`9\` = digit
- \`a\` = letter
- \`*\` = any character
- Any other character is treated as a visible separator
- Use \`tokens({...})\` to add custom mask characters such as \`L\` for uppercase-only letters`,
        },
        {
          id: 'fb-masked-presets',
          title: 'Built-in MASKS presets',
          content: `Pass any of these presets as \`field.masked(MASKS.X).label('Label')\`.

Cards
- \`CARD_16\` → \`9999 9999 9999 9999\`
- \`CARD_AMEX\` → \`9999 999999 99999\`
- \`CARD_19\` → \`9999 9999 9999 9999 999\`

Security / expiry
- \`CVV\` → \`999\`
- \`CVV_AMEX\` → \`9999\`
- \`EXPIRY\` → \`99/99\`

Date / time
- \`DATE_DMY\` → \`99/99/9999\`
- \`DATE_MDY\` → \`99/99/9999\`
- \`DATE_ISO\` → \`9999-99-99\`
- \`TIME_HM\` → \`99:99\`
- \`TIME_HMS\` → \`99:99:99\`
- \`DATETIME\` → \`99/99/9999 99:99\`

Bank / finance
- \`IBAN_FR\` → \`aa99 9999 9999 9999 9999 9999 999\`
- \`IBAN_DE\` → \`aa99 9999 9999 9999 9999 99\`
- \`IBAN_GB\` → \`aa99 aaaa 9999 9999 9999 99\`
- \`IBAN\` → \`aa99 9999 9999 9999 9999 9999 9999 99\`
- \`BANK_NZ\` → \`99-9999-9999999-99\`
- \`SIREN\` → \`999 999 999\`
- \`SIRET\` → \`999 999 999 99999\`

Postal / identity
- \`ZIP_FR\` → \`99999\`
- \`ZIP_US\` → \`99999\`
- \`ZIP_US_PLUS4\` → \`99999-9999\`
- \`POSTCODE_UK\` → \`aa9 9aa\`
- \`SSN\` → \`999-99-9999\`
- \`NIR_FR\` → \`9 99 99 99 999 999 99\`

Other
- \`IP_ADDRESS\` → \`999.999.999.999\`
- \`DURATION\` → \`99:99:99.999\`
- \`NUMBER_FR\` → \`9 999 999\``,
        },
      ],
    },
    {
      id: 'fb-file',
      title: 'field.file()',
      content: `File upload builder for documents, media, and attachments.

- It covers validation, previews, accepted types, max size, multiple upload, and source behavior
- Platform differences are handled by the renderer, while the schema keeps the business contract`,
      codeTabs: [
        {
          filename: 'File.web.tsx',
          lang: 'tsx',

          code: `const schema = {
  avatar: field.file('Avatar')
    .accept(['image/jpeg','image/png'])
    .maxSize(5 * 1024 * 1024)
    .preview(120)
    .required('Please upload a photo.'),
}`,
        },
        {
          filename: 'File.native.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.overviewNative,
          code: `const schema = {
  identityCard: field.file('Identity card')
    .accept(['image/jpeg', 'image/png', 'application/pdf'])
    .source('documents')
    .withBase64()
    .maxSize(10 * 1024 * 1024),
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-file-props',
          title: 'Props & defaults',
          content: `This builder has its own upload-focused fluent API rather than the full \`BaseFieldBuilder\` surface.

Available methods on the file builder:
- \`required(message?)\` marks file selection as mandatory
- \`hint(text)\` sets helper copy
- \`disabled(value = true)\` disables the uploader
- \`hidden(value = true)\` hides the uploader
- \`accept(types)\` restricts accepted MIME types
- \`maxSize(bytes)\` limits file size
- \`multiple(max = 10)\` enables multi-file mode and sets the maximum file count
- \`preview(height = 160)\` enables image previews and sets preview height
- \`source(type)\` chooses \`'gallery'\`, \`'camera'\`, \`'documents'\`, or \`'all'\`
- \`withBase64()\` requests base64 output
- \`resize(maxWidth, maxHeight, quality = 0.9)\` resizes images before storage
- \`allowVideo()\` allows video files
- \`noDragDrop()\` disables drag and drop on web
- \`dragLabel(label)\` customizes the web dropzone label
- \`_build()\` returns the final upload descriptor; it is public today but normally consumed by the runtime

Defaults:
- defaultValue is \`null\` for single-file mode, or \`[]\` after calling \`multiple()\`
- accepted types default to any file type
- drag & drop is enabled on web by default
- file previews are off by default

Not part of this builder:
- \`behavior()\`, \`render()\`, \`transform()\`, and the conditional helpers are not exposed here because \`field.file()\` does not extend \`BaseFieldBuilder\``,
        },
        {
          id: 'fb-file-recipes',
          title: 'Mini recipes',
          content: `Common file-builder combos:
- Avatar upload → \`field.file('Avatar').accept(['image/jpeg', 'image/png']).maxSize(5 * 1024 * 1024).preview(120).required('Please upload a photo.')\`
- Document capture on mobile → \`field.file('Identity card').accept(['image/jpeg', 'image/png', 'application/pdf']).source('documents').withBase64().maxSize(10 * 1024 * 1024)\`
- Multi-attachment inbox → \`field.file('Attachments').multiple(5).accept(['application/pdf', 'image/png']).dragLabel('Drop files here or click to browse')\`
- Click-only uploader → \`field.file('Attachments').accept(['application/pdf', 'image/png']).noDragDrop()\`
- Optimized media flow → \`field.file('Product media').accept(['image/jpeg', 'image/png', 'video/mp4']).resize(1600, 1600, 0.85).allowVideo()\``,
        },
      ],
    },
    {
      id: 'fb-otp',
      title: 'field.otp()',
      content: `One-time-password builder for short verification codes.
- It is a good fit for email verification, sign-in confirmation, payment confirmation, or device pairing
- Combine \`length()\`, \`digitsOnly()\`, and \`validateOn: 'onChange'\` for the smoothest UX`,
      codeTabs: [
        {
          filename: 'Otp.tsx',
          lang: 'tsx',
          code: `const schema = {
  code: field.otp('Verification code')
    .length(6)
    .digitsOnly()
    .required(),
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-otp-props',
          title: 'Props & defaults',
          content: `Defaults and shape:
- defaultValue is \`''\`
- type is \`otp\`

Complete builder surface:
${BASE_BUILDER_METHODS}

OTP-specific methods:
- \`length(length, message?)\` fixes the exact expected code length and syncs min/max descriptor values
- \`digitsOnly(message?)\` rejects non-digit characters`,
        },
        {
          id: 'fb-otp-recipes',
          title: 'Mini recipes',
          content: `Common otp-builder combos:
- Standard 6-digit code → \`field.otp('Verification code').length(6).digitsOnly().required()\`
- Short 4-digit PIN → \`field.otp('PIN').length(4).digitsOnly('Use numbers only')\`
- Conditional verification step → \`field.otp('SMS code').visibleWhenTruthy('requires2fa').requiredWhen('requires2fa').clearOnHide()\`

Shared method examples:
${BASE_BUILDER_METHOD_EXAMPLES}`,
        },
      ],
    },
    {
      id: 'fb-custom',
      title: 'field.custom()',
      content: `Escape hatch for UI that deserves a custom renderer while keeping the rest of the form runtime.

- Use it when the built-in field types are not enough
- You still keep schema typing, validation, state, submit lifecycle, and the same generated field map
- If the value model is already one of the built-in field types and you only want to replace the UI, prefer \`form.fieldController(name)\` before reaching for \`field.custom()\``,
      codeTabs: [
        {
          filename: 'Custom.tsx',
          lang: 'tsx',

          code: `const schema = {
  rating: field.custom(0)
    .label('Rating')
    .render(({ label, value, onChange, error }) => (
      <div>
        <p>{label}</p>
        {[1,2,3,4,5].map((n) => (
          <button key={n} type="button" onClick={() => onChange(n)}>
            {value >= n ? '★' : '☆'}
          </button>
        ))}
        {error ? <p>{error}</p> : null}
      </div>
    ))
    .validate((value) => (value > 0 ? null : 'Pick a rating')),
}

const { Form, fields } = useFormBridge(schema)

<Form onSubmit={save}>
  <fields.rating />
  <Form.Submit>Send</Form.Submit>
</Form>`,
        },
      ],
      subsections: [
        {
          id: 'fb-custom-props',
          title: 'Props & defaults',
          content: `\`field.custom(defaultValue)\` returns a typed \`BaseFieldBuilder\`, so its full fluent surface is the shared base API.

Complete builder surface:
${BASE_BUILDER_METHODS}

Constructor-level requirements:
- defaultValue is required and stays typed all the way through the generated field
- label is optional at construction time and is usually added with \`label('...')\`

Why this builder exists:
- there are no extra fluent methods beyond the base API; the main escape hatch is \`render(fn)\`, which keeps the form runtime while replacing the UI completely
- if you need a fully custom UI for a built-in field type such as \`select\`, \`masked\`, or \`phone\`, prefer \`form.fieldController(name)\` so you keep the original field semantics

\`render(fn)\` receives
- name
- label
- value
- placeholder
- error
- touched
- dirty
- validating
- disabled
- hint
- options
- otpLength
- onChange
- onBlur
- onFocus
- allValues
`,
        },
        {
          id: 'fb-custom-recipes',
          title: 'Mini recipes',
          content: `Common custom-builder combos:
- Star rating widget → \`field.custom(0).label('Rating').render(({ value, onChange }) => <Stars value={value} onChange={onChange} />).validate((value) => value > 0 ? null : 'Pick a rating')\`
- Design-system date chip → \`field.custom({ start: null, end: null }).label('Date range').render((props) => <DateRangePicker {...props} />)\`
- Conditional custom step → \`field.custom({}).label('Advanced settings').render((props) => <AdvancedSettings {...props} />).visibleWhenTruthy('showAdvanced')\`
- Built-in field with custom shell → use \`field.masked(...)\` or \`field.select(...)\` in the schema, then reach for \`form.fieldController(name)\` instead of changing the field into \`field.custom()\`

Shared method examples:
${BASE_BUILDER_METHOD_EXAMPLES}`,
        },
      ],
    },

    // ── Advanced ──────────────────────────────────────────────
    {
      id: 'fb-adapters',

      title: 'Schema adapters (zod, yup, joi, valibot)',
      content: `Use the \`resolver\` option when your real validation source of truth already lives in Zod, Yup, Valibot, Joi, or another schema library.

- The schema builders still drive rendering and UX metadata
- The external schema owns the final values/errors decision
- Successful parsed/coerced values are now forwarded to submit handlers
- This is often the cleanest path in domains that already share validation with the backend`,
      codeTabs: [
        {
          filename: 'zod-resolver.ts',
          lang: 'ts',
          preview: DOC_PREVIEWS.resolver,
          code: `import { z } from 'zod'
import { field, useFormBridge, zodResolver } from '@runilib/react-formbridge'

const schema = {
  email: field.email('Email').required(),
  password: field.password('Password').required(),
}

const zodSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const form = useFormBridge(schema, {
  resolver: zodResolver(zodSchema),
})`,
        },
        {
          filename: 'yup-resolver.ts',
          lang: 'ts',
          preview: DOC_PREVIEWS.resolver,
          code: `import * as yup from 'yup'
import { field, useFormBridge, yupResolver } from '@runilib/react-formbridge'

const schema = {
  name: field.text('Full name').required(),
  age: field.number('Age').required(),
}

const yupSchema = yup.object({
  name: yup.string().min(2).required(),
  age: yup.number().min(18).required(),
})

const form = useFormBridge(schema, {
  resolver: yupResolver(yupSchema),
})`,
        },
        {
          filename: 'joi-resolver.ts',
          lang: 'ts',
          preview: DOC_PREVIEWS.resolver,
          code: `import Joi from 'joi'
import { field, joiResolver, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  email: field.email('Email').required(),
  age: field.number('Age').required().min(18),
}

const joiSchema = Joi.object({
  email: Joi.string().email({ tlds: false }).required(),
  age: Joi.number().min(18).required(),
})

const form = useFormBridge(schema, {
  resolver: joiResolver(joiSchema),
})`,
        },
        {
          filename: 'valibot-resolver.ts',
          lang: 'ts',
          preview: DOC_PREVIEWS.resolver,
          code: `import * as v from 'valibot'
import {
  field,
  useFormBridge,
  valibotResolver,
} from '@runilib/react-formbridge'

const schema = {
  email: field.email('Email').required(),
  password: field.password('Password').required(),
}

const valibotSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(8)),
})

const form = useFormBridge(schema, {
  resolver: valibotResolver(valibotSchema),
})`,
        },
      ],
      subsections: [
        {
          id: 'fb-adapter-options',
          title: 'Shared customization options',
          content: `All four built-in adapters share the same customization surface, so you can keep the same mental model even if the schema library changes later.

${RESOLVER_SHARED_OPTIONS_SURFACE}`,
          code: {
            filename: 'resolver-options.ts',
            lang: 'ts',
            preview: DOC_PREVIEWS.resolver,
            code: `import { field, joiResolver, useFormBridge } from '@runilib/react-formbridge'
import Joi from 'joi'

const schema = {
  email: field.email('Email').required(),
  plan: field.select('Plan').required(),
}

const joiSchema = Joi.object({
  email: Joi.string().email({ tlds: false }).required(),
  plan: Joi.string().required(),
})

const form = useFormBridge(schema, {
  resolver: joiResolver(joiSchema, {
    rootKey: 'form',
    errorMode: 'join',
    joinMessagesWith: ' · ',
    formatPath: (path) => path.map(String).join('.'),
    normalizeMessage: (message) => message.trim(),
    mapIssue: ({ defaultMessage, defaultPathKey }) => {
      if (defaultPathKey === 'plan') {
        return { message: \`Billing: \${defaultMessage}\` }
      }

      return undefined
    },
  }),
})`,
          },
        },
        {
          id: 'fb-adapter-library-options',
          title: 'Library-specific options',
          content: `Each adapter also exposes the options you usually need from its schema engine.

${RESOLVER_LIBRARY_OPTIONS_SURFACE}

\`mode\` accepts \`'auto'\`, \`'sync'\`, or \`'async'\`. The default \`'auto'\` picks the async method when available, then falls back to sync. For Valibot, pass \`module: v\` if you want to avoid relying on runtime \`require()\`, especially in stricter ESM/browser setups.`,
        },
        {
          id: 'fb-adapter-tips',
          title: 'Tips',
          content: `- The resolver must return \`{ values, errors }\`
- The built-in adapters already handle this contract for you; customize them before writing a custom resolver from scratch
- Root errors default to \`'_root'\`, which is useful for banner-level or submit-level failures
- A resolver works with the same \`useFormBridge()\` API on web and native
- Prefer resolvers when business validation already exists elsewhere; prefer builder rules when the validation belongs to the field itself
- \`valibotResolver\` expects \`valibot\` to be installed in the consumer app, or passed explicitly via \`module: v\``,
        },
      ],
    },
    {
      id: 'fb-conditional',

      title: 'Conditional logic',
      content: `Conditional logic lives on the builders themselves, not in ad-hoc component branches.

- This keeps business rules close to the field contract
- The evaluated result is exposed through \`visibility\`, so the UI can still react outside the field renderer when needed`,
      code: {
        filename: 'Conditional.tsx',
        lang: 'tsx',

        code: `const schema = {
  accountType: field.radio('Account type')
    .options(['personal', 'business'])
    .required(),
  companyName: field.text('Company name')
    .visibleWhen('accountType', 'business')
    .requiredWhen('accountType', 'business')
    .clearOnHide(),
  vatNumber: field.text('VAT number')
    .visibleWhen('accountType', 'business')
    .disabledWhen('accountType', 'personal'),
}`,
      },
      subsections: [
        {
          id: 'fb-conditional-rules',
          title: 'Visibility',
          content: `${CONDITIONAL_SURFACE}`,
        },
        {
          id: 'fb-conditional-required',
          title: 'Required',
          content: `Required-state helpers inside the same surface:
- \`requiredWhen(fieldOrPredicate, value?)\`
- \`requiredWhenAny(pairs)\``,
        },
        {
          id: 'fb-conditional-disabled',
          title: 'Disabled',
          content: `Disabled-state helper inside the same surface:
- \`disabledWhen(fieldOrPredicate, value?)\``,
        },
        {
          id: 'fb-conditional-reset',
          title: 'Reset on hide',
          content: `- \`resetOnHide()\`
- \`clearOnHide()\`
- \`keepOnHide()\`

Default behavior: hidden fields reset to their default value unless you opt into \`clearOnHide()\` or \`keepOnHide()\`.`,
        },
      ],
    },
    {
      id: 'fb-persistence',

      title: 'Draft persistence',
      content: `Draft persistence lets a form survive refreshes, tab changes, route changes, or interrupted sessions.

- Great for checkout flows, onboarding, long settings screens, or mobile forms that may be backgrounded
- The runtime restores saved values on mount and exposes helpers to manage that lifecycle`,
      code: {
        filename: 'Persist.tsx',
        lang: 'tsx',

        code: `const form = useFormBridge(schema, {
  persist: {
    key: 'checkout-step-1',
    storage: 'local',
    ttl: 60 * 60,
    debounce: 800,
    exclude: ['password', 'cvv'],
    version: '2',
  },
})

if (form.isLoadingDraft) return <Spinner />

await form.saveDraftNow()
await form.clearDraft()`,
      },
      subsections: [
        {
          id: 'fb-persistence-notes',
          title: 'When to enable it',
          content: `Use persistence for long or interruption-prone flows. Exclude secrets such as passwords, PINs, OTPs, CVV, or any field you would not want stored locally.

${PERSIST_OPTIONS_SURFACE}

Draft helpers exposed through \`useFormBridge()\`:
- \`isLoadingDraft\`
- \`hasDraft\`
- \`saveDraftNow()\`
- \`clearDraft()\``,
        },
      ],
    },
    {
      id: 'fb-web-ui',

      title: 'Styling',
      content: `react-formbridge is intentionally styling-framework agnostic. The form runtime owns value, validation, visibility, and submit lifecycle. Your app stays free to style that runtime with CSS Modules, styled-components, Tailwind-style utilities, inline objects, React Native StyleSheet, NativeWind-friendly wrappers, or an in-house design system.

- Put field-owned behavior metadata in the schema when it should travel with the field everywhere the schema is reused
- Put styling in \`useFormBridge(schema, { globalStyles })\` when one screen, one route, or one product area needs a shared visual language
- Put styling on \`<fields.name ui={...} />\` when a single field needs a local exception, and let the generated field type decide which \`ui\` keys are available
- Reach for \`form.fieldController(name)\` when a built-in field needs fully custom chrome; reach for \`field.custom(...).render(...)\` only when the value model itself is no longer one of the built-in field types`,
      codeTabs: [
        {
          filename: 'SharedTheme.web.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.stylingWeb,
          code: `import { field, useFormBridge } from '@runilib/react-formbridge'
import styles from './Checkout.module.css'

const schema = {
  projectName: field
    .text('Project name')
    .required()
    .placeholder('Billing redesign'),
  ownerEmail: field
    .email('Owner email')
    .required()
    .behavior({ autoComplete: 'email', inputMode: 'email' }),
  launchNotes: field
    .textarea('Launch notes')
    .hint('Textarea inherits the same ui theme.'),
}

export function CheckoutForm() {
  const form = useFormBridge(schema, {
    validateOn: 'onTouched',
    globalStyles: () => ({
      form: { className: styles.form },
      submit: {
        className: styles.submit,
        loadingText: 'Saving...',
      },
      field: {
        ui: {
          classNames: {
            root: styles.field,
            label: styles.label,
            input: styles.input,
            textarea: styles.input,
            error: styles.error,
            hint: styles.hint,
          },
        },
      },
    }),
  })

  return (
    <form.Form onSubmit={saveCheckout}>
      <form.fields.projectName />
      <form.fields.ownerEmail
        ui={{
          styles: {
            input: { borderColor: '#38bdf8' },
          },
        }}
      />
      <form.fields.launchNotes />
      <form.Form.Submit>Save theme</form.Form.Submit>
    </form.Form>
  )
}`,
        },
        {
          filename: 'SharedTheme.native.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.stylingNative,
          code: `import { ScrollView, StyleSheet, View } from 'react-native'
import { field, useFormBridge } from '@runilib/react-formbridge'

const checkoutUi = StyleSheet.create({
  stack: { gap: 14, padding: 16 },
  fieldRoot: { marginBottom: 0, gap: 8 },
  fieldLabel: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  fieldInput: {
    minHeight: 52,
    borderWidth: 1.5,
    borderColor: 'rgba(125, 211, 252, 0.18)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#f8fafc',
    backgroundColor: 'rgba(15, 23, 42, 0.62)',
  },
  fieldHint: { color: '#94a3b8', fontSize: 12 },
  fieldError: { color: '#fda4af', fontSize: 12, fontWeight: '700' },
  submitButton: { minHeight: 52, borderRadius: 18, backgroundColor: '#38bdf8' },
  submitText: { color: '#06202f', fontWeight: '800' },
})

const schema = {
  projectName: field.text('Project name')
    .required()
    .behavior({
      autoComplete: 'organization',
    }),
  ownerEmail: field
    .email('Owner email')
    .required()
    .behavior({ keyboardType: 'email-address', autoComplete: 'email' }),
  launchNotes: field
    .textarea('Launch notes')
    .hint('Textarea inherits the same ui theme.'),
}

export function CheckoutScreen() {
  const form = useFormBridge(schema, {
    globalStyles: () => ({
      submit: {
        containerStyle: checkoutUi.submitButton,
        textStyle: checkoutUi.submitText,
        loadingText: 'Saving...',
      },
      field: {
        ui: {
          styles: {
            root: checkoutUi.fieldRoot,
            label: checkoutUi.fieldLabel,
            input: checkoutUi.fieldInput,
            hint: checkoutUi.fieldHint,
            error: checkoutUi.fieldError,
          },
        },
      },
    }),
  })

  return (
    <ScrollView>
      <form.Form onSubmit={saveCheckout}>
        <View style={checkoutUi.stack}>
          <form.fields.projectName />
          <form.fields.ownerEmail />
          <form.fields.launchNotes
            ui={{
              styles: {
                input: { minHeight: 112 },
              },
            }}
          />
          <form.Form.Submit>Save theme</form.Form.Submit>
        </View>
      </form.Form>
    </ScrollView>
  )
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-web-ui-layers',
          title: 'Choose the right layer',
          content: `1. Use \`field.text(...).behavior(...)\` for defaults that belong to the field contract itself: autocomplete, keyboard type, ids, error highlighting, or custom picker rendering that should follow the schema everywhere.
2. Use \`useFormBridge(schema, { globalStyles })\` when a whole screen or product area needs the same theme. This is the default recommendation for CSS Modules, StyleSheet, utility-class maps, or design-system-wide field chrome.
3. Use local \`ui\` props on \`<fields.name />\` when one field needs a special variant without mutating the shared schema.
4. Use \`form.fieldController(name)\` when a built-in field needs a fully custom trigger, shell, or modal while keeping the same schema contract. Use \`field.custom(defaultValue).render(...)\` only when the value model itself is custom.

The public type surface guards these layers too: a text field does not expose textarea-only or select-only \`ui\` props, and native fields do not expose web-only props such as \`className\`.

Merge order is predictable: builder \`behavior\` -> \`globalStyles\` theme ui -> local field ui -> field controller or custom render layer.`,
        },
        {
          id: 'fb-web-ui-global-ui',
          title: 'globalStyles surface',
          content: `${GLOBAL_UI_SURFACE}`,
        },
        {
          id: 'fb-web-ui-typing',
          title: 'Typing rules',
          content: `- Text-like fields use \`ui.inputProps\`
- \`textarea\` fields use \`ui.textareaProps\` on web
- \`select\` fields use \`ui.selectProps\` on web
- Web fields can use root-level \`className\`
- Native fields intentionally do not expose \`className\`, \`ui.textareaProps\`, or \`ui.selectProps\``,
        },
        {
          id: 'fb-web-ui-css-modules',
          title: 'Recipe: shared theme with CSS Modules or StyleSheet',
          content: `This is the most common production setup.

- One \`ui\` object themes the form wrapper, every generated field, and the submit button
- The schema stays reusable across pages because the visual system lives at the screen level
- You still keep an escape hatch for one field with local \`ui\` overrides`,
          codeTabs: [
            {
              filename: 'CssModulesTheme.web.tsx',
              lang: 'tsx',
              preview: DOC_PREVIEWS.stylingWeb,
              code: `const form = useFormBridge(schema, {
  globalStyles: () => ({
    form: { className: styles.formShell },
    submit: {
      className: styles.submitButton,
      loadingText: 'Applying CSS Modules theme...',
    },
    field: {
      ui: {
        classNames: {
          root: styles.formField,
          label: styles.formLabel,
          input: styles.formInput,
          textarea: styles.formInput,
          select: styles.formInput,
          hint: styles.helperText,
          error: styles.errorBox,
        },
      },
    },
  }),
})

<form.Form onSubmit={save}>
  <form.fields.projectName />
  <form.fields.ownerEmail
    ui={{
      styles: {
        input: { borderColor: '#38bdf8' },
      },
    }}
  />
  <form.fields.department />
  <form.Form.Submit>Save CSS recipe</form.Form.Submit>
</form.Form>`,
            },
            {
              filename: 'StyleSheetTheme.native.tsx',
              lang: 'tsx',
              preview: DOC_PREVIEWS.stylingNative,
              code: `const form = useFormBridge(schema, {
  globalStyles: () => ({
    field: {
      ui: {
        styles: {
          root: s.fieldRoot,
          label: s.fieldLabel,
          input: s.fieldInput,
          hint: s.fieldHint,
          error: s.fieldError,
          optionTrigger: s.fieldInput,
        },
      },
    },
    submit: {
      containerStyle: s.submitButton,
      textStyle: s.submitText,
      loadingText: 'Applying StyleSheet theme...',
    },
  }),
})

<form.Form onSubmit={save}>
  <View style={s.stack}>
    <form.fields.projectName />
    <form.fields.ownerEmail />
    <form.fields.department />
    <form.Form.Submit>Save native recipe</form.Form.Submit>
  </View>
</form.Form>`,
            },
          ],
        },
        {
          id: 'fb-web-ui-hosts',
          title: 'Host helpers: FieldHost, SubmitHost, FormHost',
          content: `react-formbridge now exports official host components for styling libraries that want a stable component reference.

- \`FieldHost\` renders any generated field component passed through its \`field\` prop
- \`SubmitHost\` renders \`Form.Submit\` through a stable \`submit\` prop
- \`FormHost\` renders the generated \`Form\` component through a stable \`form\` prop

These helpers are especially useful with \`styled-components\`, \`styled-components/native\`, or any wrapper-based styling system that works better with stable host components than with runtime-generated field references.`,
          codeTabs: [
            {
              filename: 'Hosts.web.tsx',
              lang: 'tsx',
              preview: DOC_PREVIEWS.stylingStyledWeb,
              code: `import {
  FieldHost,
  FormHost,
  field,
  SubmitHost,
  useFormBridge,
} from '@runilib/react-formbridge'
import styled from 'styled-components'

const StyledForm = styled(FormHost)\`
  display: flex;
  flex-direction: column;
  gap: 16px;
\`

const EmailField = styled(FieldHost).attrs({
  ui: {
    inputProps: { autoComplete: 'email', inputMode: 'email' },
  },
})\`
  & input {
    border-radius: 16px;
    border: 1px solid rgba(56, 189, 248, 0.28);
    background: rgba(15, 23, 42, 0.74);
    color: #f8fafc;
  }
\`

const SubmitButton = styled(SubmitHost)\`
  min-width: 196px;
  border-radius: 16px;
  background: linear-gradient(135deg, #38bdf8, #22c55e);
  color: #04121c;
  font-weight: 800;
\`

const form = useFormBridge({
  contactEmail: field.email('Contact email').required(),
})

<StyledForm form={form.Form} onSubmit={save}>
  <EmailField field={form.fields.contactEmail} />
  <SubmitButton submit={form.Form.Submit}>Save styled recipe</SubmitButton>
</StyledForm>`,
            },
            {
              filename: 'Hosts.native.tsx',
              lang: 'tsx',
              preview: DOC_PREVIEWS.stylingStyledNative,
              code: `import {
  FieldHost,
  FormHost,
  field,
  SubmitHost,
  useFormBridge,
} from '@runilib/react-formbridge'
import styled from 'styled-components/native'

const StyledForm = styled(FormHost)\`
  gap: 16px;
\`

const EmailField = styled(FieldHost).attrs({
  ui: {
    inputProps: {
      autoComplete: 'email',
      keyboardType: 'email-address',
    },
    styles: {
      root: { marginBottom: 0, gap: 8 },
      input: {
        minHeight: 52,
        borderWidth: 1.5,
        borderColor: 'rgba(56, 189, 248, 0.28)',
        borderRadius: 16,
        paddingHorizontal: 14,
        color: '#f8fafc',
        backgroundColor: 'rgba(15, 23, 42, 0.74)',
      },
    },
  },
})\`
  margin-bottom: 0px;
\`

const SubmitButton = styled(SubmitHost).attrs({
  textStyle: { color: '#04121c', fontWeight: '800' },
})\`
  min-height: 52px;
  border-radius: 18px;
  background-color: #38bdf8;
\`

const form = useFormBridge({
  contactEmail: field.email('Contact email').required(),
})

<StyledForm form={form.Form} onSubmit={save}>
  <EmailField field={form.fields.contactEmail} />
  <SubmitButton submit={form.Form.Submit}>Save styled recipe</SubmitButton>
</StyledForm>`,
            },
          ],
        },
        {
          id: 'fb-web-ui-styled-components',
          title: 'Recipe: styled-components on web and native',
          content: `Choose this pattern when the app already uses \`styled-components\` or \`styled-components/native\`.

- Use the exported host helpers instead of rebuilding your own wrappers
- Keep the styled shell stable and pass the generated field, submit button, or form through props
- On web, normal CSS selectors can target \`label\`, \`input\`, \`textarea\`, and the other built-in elements
- On native, use \`.attrs({ ui: { styles: ... } })\` to feed slot styles into the generated field

This stable-host pattern is the safest documented recipe because generated field components are runtime artifacts. It keeps styling ergonomic without forcing users to hand-build every field.`,
          codeTabs: [
            {
              filename: 'StyledComponents.web.tsx',
              lang: 'tsx',
              preview: DOC_PREVIEWS.stylingStyledWeb,
              code: `import {
  FieldHost,
  FormHost,
  field,
  SubmitHost,
  useFormBridge,
} from '@runilib/react-formbridge'
import styled from 'styled-components'

const StudioForm = styled(FormHost)\`
  display: flex;
  flex-direction: column;
  gap: 18px;
\`

const EmailShell = styled(FieldHost).attrs({
  ui: {
    inputProps: { autoComplete: 'email', inputMode: 'email' },
  },
})\`
  display: flex;
  flex-direction: column;
  gap: 8px;

  & label { color: #dbeafe; font-size: 12px; font-weight: 700; }
  & input {
    border-radius: 16px;
    border: 1px solid rgba(56, 189, 248, 0.28);
    background: rgba(15, 23, 42, 0.74);
    color: #f8fafc;
    padding: 14px 16px;
  }
  & span { color: #94a3b8; font-size: 12px; }
\`

const SubmitShell = styled(SubmitHost)\`
  min-width: 196px;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, #38bdf8, #22c55e);
  color: #04121c;
  font-weight: 800;
\`

const form = useFormBridge({
  studioName: field.text('Studio name').required(),
  contactEmail: field.email('Contact email').required(),
})

<StudioForm form={form.Form} onSubmit={save}>
  <EmailShell field={form.fields.contactEmail} hint="Used for invoices only" />
  <SubmitShell submit={form.Form.Submit}>Save styled recipe</SubmitShell>
</StudioForm>`,
            },
            {
              filename: 'StyledComponents.native.tsx',
              lang: 'tsx',
              preview: DOC_PREVIEWS.stylingStyledNative,
              code: `import {
  FieldHost,
  FormHost,
  field,
  SubmitHost,
  useFormBridge,
} from '@runilib/react-formbridge'
import styled from 'styled-components/native'

const StudioForm = styled(FormHost)\`
  gap: 18px;
\`

const EmailShell = styled(FieldHost).attrs({
  ui: {
    inputProps: {
      autoComplete: 'email',
      keyboardType: 'email-address',
    },
    styles: {
      root: { marginBottom: 0, gap: 8 },
      label: { color: '#dbeafe', fontSize: 12, fontWeight: '800' },
      input: {
        minHeight: 52,
        borderWidth: 1.5,
        borderColor: 'rgba(56, 189, 248, 0.28)',
        borderRadius: 16,
        paddingHorizontal: 14,
        color: '#f8fafc',
        backgroundColor: 'rgba(15, 23, 42, 0.74)',
      },
      hint: { color: '#94a3b8', fontSize: 12 },
    },
  },
})\`
  margin-bottom: 0px;
\`

const SubmitShell = styled(SubmitHost).attrs({
  loadingText: 'Applying styled system...',
  textStyle: { color: '#04121c', fontWeight: '800' },
})\`
  min-height: 52px;
  border-radius: 18px;
  background-color: #38bdf8;
\`

const form = useFormBridge({
  studioName: field.text('Studio name').required(),
  contactEmail: field.email('Contact email').required(),
})

<StudioForm form={form.Form} onSubmit={save}>
  <EmailShell field={form.fields.contactEmail} hint="Used for invoices only" />
  <SubmitShell submit={form.Form.Submit}>Save styled recipe</SubmitShell>
</StudioForm>`,
            },
          ],
        },
        {
          id: 'fb-web-ui-utility',
          title: 'Recipe: utility classes on web',
          content: `This recipe is a strong fit for Tailwind, UnoCSS, Windi, or any class-based utility stack.

- The global \`classNames\` map gives most of the form its look
- Local \`ui.classNames\` and \`ui.inputProps\` cover one-off field variations
- The runtime stays the same because the generated field still owns value, validation, and events`,
          code: {
            filename: 'UtilityClasses.web.tsx',
            lang: 'tsx',
            preview: DOC_PREVIEWS.stylingUtilityWeb,
            code: `const form = useFormBridge(schema, {
  globalStyles: () => ({
    form: { className: 'space-y-4' },
    submit: {
      className:
        'inline-flex min-h-12 items-center justify-center rounded-2xl bg-cyan-400 px-5 font-semibold text-slate-950',
    },
    field: {
      ui: {
        classNames: {
          root: 'space-y-2',
          label:
            'text-xs font-semibold uppercase tracking-[0.14em] text-slate-200',
          input:
            'w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none',
          textarea:
            'min-h-28 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none',
          select:
            'w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none',
          hint: 'text-xs text-slate-400',
          error: 'text-sm text-rose-300',
        },
      },
    },
  }),
})

<form.Form onSubmit={save}>
  <form.fields.ownerEmail
    ui={{
      classNames: {
        input: 'border-cyan-400 focus:ring-2 focus:ring-cyan-400/30',
      },
      inputProps: {
        autoComplete: 'email',
        inputMode: 'email',
      },
    }}
  />
  <form.fields.launchNotes />
  <form.Form.Submit>Save utility recipe</form.Form.Submit>
</form.Form>`,
          },
        },
        {
          id: 'fb-web-ui-local-overrides',
          title: 'Recipe: local slot overrides with no extra styling library',
          content: `Use this when you want to prove the styling API quickly, or when one form needs a polished custom look without introducing a new styling dependency.

- \`ui.styles\` targets the built-in slots directly on both web and native
- \`renderHint\`, \`renderError\`, and \`renderRequiredMark\` cover the cases where plain styles are not enough
- This is also a good recipe for incrementally migrating an existing screen to react-formbridge`,
          codeTabs: [
            {
              filename: 'SlotOverrides.web.tsx',
              lang: 'tsx',
              preview: DOC_PREVIEWS.stylingSlotWeb,
              code: `const form = useFormBridge(schema, {
  validateOn: 'onTouched',
  globalStyles: () => ({
    submit: {
      loadingText: 'Saving inline theme...',
      style: {
        minWidth: 196,
        borderRadius: 16,
        background: 'rgba(245, 158, 11, 0.14)',
        color: '#fde68a',
      },
    },
    field: {
      ui: {
        styles: {
          root: { marginBottom: 0, gap: 8 },
          label: {
            color: '#f8fafc',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          },
          input: {
            background: 'rgba(15, 23, 42, 0.5)',
            border: '1px solid rgba(251, 191, 36, 0.18)',
            borderRadius: 16,
            color: '#f8fafc',
            padding: '14px 16px',
          },
          textarea: {
            minHeight: 108,
            background: 'rgba(15, 23, 42, 0.5)',
            border: '1px solid rgba(251, 191, 36, 0.18)',
            borderRadius: 16,
            color: '#f8fafc',
            padding: '14px 16px',
          },
          hint: { color: '#fde68a' },
          error: { color: '#fca5a5' },
        },
        renderRequiredMark: () => <span style={{ color: '#f59e0b' }}>•</span>,
      },
    },
  }),
})

<form.fields.receiptEmail
  ui={{
    highlightOnError: false,
    renderHint: () => (
      <span style={{ color: '#cbd5e1', fontSize: 12 }}>
        We only use it for invoices and receipts.
      </span>
    ),
  }}
/>

<form.fields.postalCode
  ui={{
    styles: {
      input: { textAlign: 'center', letterSpacing: '0.14em' },
    },
  }}
/>`,
            },
            {
              filename: 'FieldOverrides.native.tsx',
              lang: 'tsx',
              preview: DOC_PREVIEWS.stylingSlotNative,
              code: `const form = useFormBridge(schema, {
  validateOn: 'onTouched',
  globalStyles: () => ({
    submit: {
      loadingText: 'Saving inline theme...',
      containerStyle: {
        minHeight: 52,
        borderRadius: 18,
        backgroundColor: '#f59e0b',
      },
      textStyle: {
        color: '#2a1602',
        fontWeight: '800',
      },
    },
    field: {
      ui: {
        styles: {
          root: { marginBottom: 0, gap: 8 },
          label: {
            color: '#f8fafc',
            fontSize: 12,
            fontWeight: '800',
            letterSpacing: 0.7,
            textTransform: 'uppercase',
          },
          input: {
            minHeight: 52,
            borderWidth: 1.5,
            borderColor: 'rgba(251, 191, 36, 0.18)',
            borderRadius: 16,
            paddingHorizontal: 14,
            paddingVertical: 12,
            color: '#f8fafc',
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
          },
          hint: { color: '#fde68a' },
          error: { color: '#fca5a5' },
        },
        renderRequiredMark: () => <Text style={{ color: '#f59e0b' }}>•</Text>,
      },
    },
  }),
})

<form.fields.receiptEmail
  ui={{
    highlightOnError: false,
    renderHint: () => (
      <Text style={{ color: '#cbd5e1', fontSize: 12 }}>
        We only use it for invoices and receipts.
      </Text>
    ),
  }}
/>

<form.fields.postalCode
  ui={{
    styles: {
      input: { textAlign: 'center', letterSpacing: 2 },
    },
  }}
/>`,
            },
          ],
        },
        {
          id: 'fb-web-ui-web-surface',
          title: 'Web styling surface',
          content: `On web, the API is broad enough to work with CSS Modules, utility classes, styled-components, Emotion, or plain objects.

- Root-level \`className\` and \`style\` theme the field container directly
- \`globalStyles.form\` and \`globalStyles.submit\` style the generated form wrapper and submit button
- \`ui.highlightOnError\` lets you opt out of the built-in red field chrome while keeping the error message
- \`ui.rootProps\`, \`ui.labelProps\`, \`ui.hintProps\`, and \`ui.errorProps\` let you push DOM attributes without losing the generated renderer
- \`ui.inputProps\` is available on text-like web fields, \`ui.textareaProps\` on textarea fields, and \`ui.selectProps\` on select fields
- \`ui.renderLabel\`, \`ui.renderHint\`, \`ui.renderError\`, and \`ui.renderRequiredMark\` cover the cases where styling alone is not enough
- Builder-level \`.behavior(...)\` stays focused on field-owned behavior metadata such as ids, autocomplete, or picker behavior rather than visual theme

${WEB_SLOT_SURFACE}`,
        },
        {
          id: 'fb-web-ui-native-surface',
          title: 'Native styling surface',
          content: `On React Native, the same layering applies, but the override points stay React Native-friendly instead of DOM-specific.

- Root-level \`style\` themes the field wrapper, while \`globalStyles.form\` and \`globalStyles.submit\` theme the form container and submit button
- \`ui.highlightOnError\` lets you opt out of the built-in red field chrome while keeping the error message
- Renderer-specific extra keys are also supported in \`ui.styles\`, which is especially useful for inputs such as checkboxes, async selectors, or modal option lists
- \`ui.rootProps\`, \`ui.labelProps\`, \`ui.inputProps\`, \`ui.hintProps\`, and \`ui.errorProps\` help with test IDs, accessibility, or integration with surrounding layout primitives
- Native fields do not expose web-only props such as \`className\`, \`ui.textareaProps\`, or \`ui.selectProps\`
- \`ui.renderLabel\`, \`ui.renderHint\`, \`ui.renderError\`, and \`ui.renderRequiredMark\` cover the cases where a simple style object is not enough
- Builder-level \`.behavior(...)\` stays focused on field-owned behavior metadata such as keyboard hints, test IDs, or picker behavior rather than visual theme

${NATIVE_SLOT_SURFACE}`,
        },
        {
          id: 'fb-web-ui-guidance',
          title: 'Use-case guide',
          content: `- Use \`ui\` when a whole route, modal, onboarding flow, or checkout screen should share one visual system
- Use builder-level \`.behavior()\` when behavior metadata belongs to the field definition and should follow the schema everywhere it is reused
- Keep platform-specific differences inside the same \`ui\` object or at the screen-level \`globalStyles\` theme
- Use local \`ui\` props when one field needs a variant, a special helper text, or a different accent color on one screen
- Use the stable host recipe for \`styled-components\` and \`styled-components/native\`
- Use \`className\` and \`classNames\` slot maps for Tailwind-style utility frameworks on web
- Use \`style\`, \`ui.styles\`, wrappers, or the stable host recipe for React Native styling systems such as StyleSheet, NativeWind-friendly wrappers, or in-house component kits
- Let the field type guide the override point: \`inputProps\` for text-like fields, \`textareaProps\` for textareas, \`selectProps\` for selects
- The API stays agnostic on purpose, so the same schema can power web and native without forcing the same styling stack on both platforms

${HOST_HELPERS_SURFACE}`,
        },
      ],
    },
    {
      id: 'fb-infer',

      title: 'field.infer()',
      content: `\`field.infer(obj, overrides?)\` generates a complete form schema from an existing JavaScript object. It auto-detects field types based on key names and value types, so you can go from a plain object to a working form in one line.

The same helper is also exported as \`inferFromObject(obj, overrides?)\` when you prefer a direct utility import.

**How auto-detection works:**
- **Key-based** — keys containing \`email\`, \`password\`, \`phone\`, \`url\`, \`bio\`, \`description\`, \`date\`, \`active\`, \`enabled\`, \`toggle\` etc. are mapped to their matching field type
- **Value-based** — \`boolean\` → switch, \`number\` → number, \`Array\` → select, everything else → text
- **Labels** — keys are prettified automatically (\`firstName\` → "First name", \`phone_number\` → "Phone number")

The returned schema can be spread and selectively overridden with explicit builders — inferred fields and hand-written fields mix freely.`,
      code: {
        filename: 'InferBasic.ts',
        lang: 'ts',

        code: `import { field } from '@runilib/react-formbridge'

// Pass any object — field.infer reads keys + values to build the schema
const user = {
  firstName: 'Ava',
  email: 'ava@example.com',
  age: 32,
  active: true,
}

const schema = {
  // Infer all fields automatically
  ...field.infer(user),
  // Override a specific field with an explicit builder
  email: field.email('Email').required(),
}

// Result: firstName → text, email → email (overridden),
//         age → number, active → switch`,
      },
      subsections: [
        {
          id: 'fb-infer-overrides',
          title: 'Per-field overrides',
          content: `The second argument lets you customise individual inferred fields without replacing them entirely.

${INFER_OPTIONS_SURFACE}`,
          code: {
            filename: 'InferOverrides.ts',
            lang: 'ts',

            code: `import { field } from '@runilib/react-formbridge'

const product = {
  name: '',
  description: '',
  price: 0,
  category: '',
  inStock: true,
}

const schema = field.infer(product, {
  name:        { required: true, min: 2, max: 100 },
  description: { type: 'textarea', placeholder: 'Describe the product...' },
  price:       { required: true, min: 0, hint: 'Price in euros' },
  category:    { type: 'select', options: ['Electronics', 'Clothing', 'Books'] },
  inStock:     { label: 'Available in stock' },
})`,
          },
        },
        {
          id: 'fb-infer-edit-form',
          title: 'Edit form pattern',
          content: `\`field.infer()\` is ideal for edit/update forms where you already have the entity data. The object values become the default values of each field, so the form is pre-filled automatically.`,
          code: {
            filename: 'InferEditForm.tsx',
            lang: 'tsx',

            code: `import { field, useFormBridge } from '@runilib/react-formbridge'

function EditUserForm({ user }: { user: User }) {
  // Schema is generated from the existing user — form is pre-filled
  const schema = field.infer(user, {
    email:    { required: 'Email is required' },
    password: { hidden: true },
    role:     { type: 'select', options: ['admin', 'user', 'viewer'] },
  })

  const { Form, fields } = useFormBridge(schema)

  return (
    <Form onSubmit={(values) => updateUser(user.id, values)}>
      <fields.email />
      <fields.role />
      <Form.Submit>Save user</Form.Submit>
    </Form>
  )
}`,
          },
        },
        {
          id: 'fb-infer-notes',
          title: 'When to use inference vs explicit builders',
          content: `Inference shines for rapid scaffolding — admin panels, CRUD tools, internal dashboards, prototypes. For production user-facing forms, explicit builders give you full control over labels, validation messages, conditional logic, and UX polish.

${INFER_AUTODETECTION_SURFACE}

**Tip:** start with \`field.infer()\` to bootstrap quickly, then progressively replace inferred fields with explicit builders as your form requirements grow.`,
        },
      ],
    },
    {
      id: 'fb-infer-type',

      title: 'field.inferType()',
      content: `\`field.inferType<T>(fields)\` generates a schema purely from a TypeScript type — no object instance needed. You describe each property with its configuration, and the schema is fully typed against \`T\`.

The same helper is also exported as \`inferFromType<T>(fields)\` when you prefer a direct utility import.

This is useful when:
- You don't have an existing object to infer from (e.g. a creation form)
- You want the schema to be statically typed against a specific interface
- You need to define default values explicitly per field`,
      code: {
        filename: 'InferType.ts',
        lang: 'ts',

        code: `import { field } from '@runilib/react-formbridge'

type User = {
  name: string
  email: string
  age: number
  active: boolean
}

// Schema is typed as Record<keyof User, FieldDescriptor>
const schema = field.inferType<User>({
  name:   { label: 'Full name', required: true, min: 2 },
  email:  { label: 'Email', required: true },
  age:    { label: 'Age', min: 18, defaultValue: 18 },
  active: { label: 'Active', type: 'switch' },
})`,
      },
      subsections: [
        {
          id: 'fb-infer-type-defaults',
          title: 'Default values',
          content: `Each field entry accepts an optional \`defaultValue\`. The rest of the field entry surface is the same \`InferFieldOptions\` contract used by \`field.infer()\`.

${INFER_OPTIONS_SURFACE}

If \`defaultValue\` is omitted, a sensible default is derived from the field type:

- \`number\` → \`0\`
- \`checkbox\` / \`switch\` → \`false\`
- Everything else → \`''\` (empty string)`,
          code: {
            filename: 'InferTypeDefaults.ts',
            lang: 'ts',

            code: `import { field } from '@runilib/react-formbridge'

type Settings = {
  theme: string
  fontSize: number
  notifications: boolean
}

const schema = field.inferType<Settings>({
  theme:         { label: 'Theme', type: 'select',
                   options: ['light', 'dark', 'auto'], defaultValue: 'auto' },
  fontSize:      { label: 'Font size', min: 10, max: 32, defaultValue: 16 },
  notifications: { label: 'Enable notifications', type: 'switch' },
  // notifications defaults to false (switch type)
})`,
          },
        },
        {
          id: 'fb-infer-type-vs-infer',
          title: 'field.infer() vs field.inferType()',
          content: `| | \`field.infer(obj)\` | \`field.inferType<T>(fields)\` |
|---|---|---|
| **Input** | A runtime object with values | A type + field config map |
| **Default values** | Taken from the object values | Explicit \`defaultValue\` or auto-derived |
| **Type detection** | Automatic from keys & values | You specify \`type\` manually |
| **Best for** | Edit forms, pre-filled data | Creation forms, type-first schemas |
| **Typing** | Inferred from the object shape | Explicit generic \`<T>\` |`,
        },
      ],
    },
    {
      id: 'fb-analytics',

      title: 'useFormBridgeAnalytics()',
      content: `Add analytics to a form without rewriting any field component.

- Track focus, completion time, change counts, abandonment, errors, and successful completion
- Keep callbacks metadata-oriented so analytics stays safe and privacy-conscious
- Works best when paired with a stable getter for current values
- For most forms, passing \`analytics\` directly to \`useFormBridge(schema, { analytics })\` is the simplest path; the standalone hook is the lower-level escape hatch`,
      codeTabs: [
        {
          filename: 'Analytics.web.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.analyticsWeb,
          code: `import {
  field,
  useFormBridge,
  useFormBridgeAnalytics,
} from '@runilib/react-formbridge'

const schema = {
  email: field.email('Email').required(),
  password: field.password('Password').required(),
}

export function SignupWithAnalytics() {
  const { Form, fields, state } = useFormBridge(schema)

  useFormBridgeAnalytics(
    {
      formId: 'signup',
      exclude: ['password'],
      handlers: {
        onFieldComplete: (name, ms) => analytics.track('field_complete', { name, ms }),
        onFormCompleted: (durationMs, submitCount, fieldCount) =>
          analytics.track('form_done', { durationMs, submitCount, fieldCount }),
        onFormAbandoned: (pct, last, values) =>
          analytics.track('form_abandoned', { pct, last, values }),
      },
    },
    () => state.values,
  )

  return (
    <Form onSubmit={(values) => api.signup(values)}>
      <fields.email />
      <fields.password />
      <Form.Submit>Sign up</Form.Submit>
    </Form>
  )
}`,
        },
        {
          filename: 'Analytics.native.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.analyticsNative,
          code: `import { ScrollView, View } from 'react-native'
import {
  field,
  useFormBridge,
  useFormBridgeAnalytics,
} from '@runilib/react-formbridge'

const schema = { phone: field.phone('Phone').required() }

export function PhoneCapture() {
  const { Form, fields, state } = useFormBridge(schema)

  useFormBridgeAnalytics(
    {
      handlers: {
        onFieldFocus: (name) => console.log('focus', name),
        onFieldChange: (name, count) => console.log('changes', name, count),
        onFormCompleted: (ms) => console.log('done in', ms),
      },
    },
    () => state.values,
  )

  return (
    <ScrollView>
      <Form onSubmit={(values) => console.log(values)}>
        <View style={{ gap: 12, padding: 16 }}>
          <fields.phone />
          <Form.Submit>Continue</Form.Submit>
        </View>
      </Form>
    </ScrollView>
  )
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-analytics-config',
          title: 'Config & defaults',
          content: `${ANALYTICS_OPTIONS_SURFACE}

${ANALYTICS_HANDLERS_SURFACE}`,
        },
        {
          id: 'fb-analytics-tracker',
          title: 'Returned tracker',
          content: `${ANALYTICS_TRACKER_SURFACE}`,
        },
        {
          id: 'fb-analytics-notes',
          title: 'Usage notes',
          content: `- Pass a stable getter for current values, e.g. () => state.values
- No field values are sent in onFieldChange; keep events metadata-only
- Works on web (pagehide/beforeunload/visibilitychange) and React Native (AppState)`,
        },
      ],
    },
    {
      id: 'fb-use-async-options',

      title: 'useAsyncOptions()',
      content: `Standalone hook for remote option lists.

- Use it directly when you want to build your own async autocomplete or picker UI
- Use it indirectly through \`field.select().optionsFrom(...)\` when a generated field is enough
- The hook handles debounce, caching, cancellation, dependency keys, and refreshes for you`,
      codeTabs: [
        {
          filename: 'AsyncCity.web.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.asyncWeb,
          code: `import { field, useAsyncOptions } from '@runilib/react-formbridge'

const cityFetcher = async ({ search, deps, signal }) => {
  const res = await fetch('/api/cities?country=' + deps.country + '&q=' + encodeURIComponent(search), { signal })
  const data = await res.json()
  return data.map((city: { id: string; name: string }) => ({ value: city.id, label: city.name }))
}

export function CitySelect({ country }: { country: string }) {
  const asyncCity = useAsyncOptions({
    key: 'cities',
    fetch: cityFetcher,
    dependsOn: ['country'],
    cacheTtl: 5 * 60_000,
    debounce: 250,
    minChars: 2,
    keepPreviousOptions: true,
  }, { country })

  return (
    <div>
      <input
        placeholder="Type a city"
        value={asyncCity.search}
        onChange={(e) => asyncCity.setSearch(e.target.value)}
      />
      {asyncCity.loading ? <p>Loading...</p> : null}
      {asyncCity.error ? <p>{asyncCity.error}</p> : null}
      <ul>
        {asyncCity.options.map((opt) => (
          <li key={opt.value}>{opt.label}</li>
        ))}
      </ul>
    </div>
  )
}`,
        },
        {
          filename: 'AsyncSelect.native.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.asyncNative,
          code: `import { useAsyncOptions } from '@runilib/react-formbridge'
import { FlatList, TextInput, TouchableOpacity, Text, View } from 'react-native'

export function CityPickerNative({ country }: { country: string }) {
  const cities = useAsyncOptions({
    key: 'cities',
    fetch: async ({ search, deps }) => {
      const res = await fetch('https://example.com/cities?country=' + deps.country + '&q=' + search)
      const data = await res.json()
      return data.map((c: any) => ({ value: c.id, label: c.name }))
    },
    dependsOn: ['country'],
    minChars: 1,
  }, { country })

  return (
    <View style={{ gap: 8 }}>
      <TextInput
        placeholder="Search city"
        value={cities.search}
        onChangeText={cities.setSearch}
      />
      {cities.loading ? <Text>Loading…</Text> : null}
      <FlatList
        data={cities.options}
        keyExtractor={(item) => String(item.value)}
        renderItem={({ item }) => (
          <TouchableOpacity><Text>{item.label}</Text></TouchableOpacity>
        )}
      />
    </View>
  )
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-async-config',
          title: 'Config',
          content: `${ASYNC_OPTIONS_CONFIG_SURFACE}

${ASYNC_OPTIONS_FETCHER_SURFACE}

\`key + search + deps\` compose the internal cache key.`,
        },
        {
          id: 'fb-async-return',
          title: 'Return',
          content: `Complete return surface:
- \`options: SelectOption[]\`
- \`loading: boolean\`
- \`error: string | null\`
- \`search: string\`
- \`setSearch(next: string)\`
- \`clearSearch()\`
- \`refresh()\` — clears the current cache entry and refetches`,
        },
      ],
    },
    {
      id: 'fb-dynamic',

      title: 'useDynamicForm()',
      content: `Turn a JSON form definition into a real formbridge runtime.

- Useful for CMS-driven forms, experiments, back-office builders, or remote configuration
- The hook parses the definition, preserves field order, and gives you a normal formbridge instance back
- This helper is most compelling when the form shape changes outside the deployed frontend code
- A very practical pattern is “one dynamic step per route” for cross-page wizards whose step definitions come from a backend`,
      codeTabs: [
        {
          filename: 'DynamicForm.web.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.dynamic,
          code: `import { useDynamicForm } from '@runilib/react-formbridge'

const definition = {
  title: 'Feedback',
  fields: [
    { type: 'text', name: 'fullName', label: 'Full name', required: true },
    { type: 'email', name: 'email', label: 'Email', required: true },
    { type: 'textarea', name: 'comment', label: 'Comment', max: 400 },
  ],
}

export function DynamicFeedback() {
  const { form, fieldOrder, isLoading, loadError } = useDynamicForm(definition, {
    validateOn: 'onSubmit',
    defaultValues: { fullName: 'Ava Stone' },
  })

  if (!form) return isLoading ? <p>Loading…</p> : <p>Error: {loadError}</p>

  const { Form, fields } = form
  return (
    <Form onSubmit={(values) => api.send(values)}>
      {fieldOrder.map((name) => {
        const Field = fields[name]
        return <Field key={name} />
      })}
      <Form.Submit>Send</Form.Submit>
    </Form>
  )
}`,
        },
        {
          filename: 'Dynamic.native.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.dynamic,
          code: `import { ScrollView, View, Text } from 'react-native'
import { useDynamicForm } from '@runilib/react-formbridge'

export function RemoteDynamic({ url }: { url: string }) {
  const { form, fieldOrder, isLoading, loadError } = useDynamicForm(
    async () => {
      const res = await fetch(url)
      return res.json()
    },
    { persist: { key: 'remote-form' } },
  )

  if (!form) return <View><Text>{loadError ?? 'Loading…'}</Text></View>

  const { Form, fields } = form
  return (
    <ScrollView>
      <Form onSubmit={(values) => console.log(values)}>
        <View style={{ gap: 10, padding: 16 }}>
          {fieldOrder.map((name) => {
            const Field = fields[name]
            return <Field key={name} />
          })}
          <Form.Submit>Submit</Form.Submit>
        </View>
      </Form>
    </ScrollView>
  )
}`,
        },
        {
          filename: 'DynamicWizardStep.web.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.dynamic,
          code: `import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDynamicForm } from '@runilib/react-formbridge'

const NEXT_STEP_BY_ID = {
  personal: 'company',
  company: 'review',
} as const

export function DynamicSignupStepRoute() {
  const navigate = useNavigate()
  const { stepId = 'personal' } = useParams<{ stepId?: string }>()

  const loadDefinition = useMemo(
    () => async () => {
      const response = await fetch('/api/forms/signup/' + stepId)
      if (!response.ok) throw new Error('Failed to load step definition')
      return response.json()
    },
    [stepId],
  )

  const { form, fieldOrder, meta, isLoading, loadError } = useDynamicForm(
    loadDefinition,
    {
      formKey: stepId,
      validateOn: 'onBlur',
      persist: {
        key: 'signup-step:' + stepId,
        storage: 'local',
      },
    },
  )

  if (!form) {
    return isLoading ? <p>Loading…</p> : <p>Error: {loadError}</p>
  }

  const nextStepId = NEXT_STEP_BY_ID[stepId as keyof typeof NEXT_STEP_BY_ID]
  const { Form, fields } = form

  return (
    <Form
      onSubmit={async (values) => {
        await api.saveStep(stepId, values)

        if (nextStepId) navigate('/signup/' + nextStepId)
        else navigate('/signup/review')
      }}
    >
      <h1>{meta.title ?? 'Signup'}</h1>

      {fieldOrder.map((name) => {
        const Field = fields[name]
        return <Field key={name} />
      })}

      <Form.Submit>
        {meta.submitLabel ?? (nextStepId ? 'Continue' : 'Finish')}
      </Form.Submit>
    </Form>
  )
}`,
        },
        {
          filename: 'DynamicWizardStep.native.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.dynamic,
          code: `import { ScrollView, Text, View } from 'react-native'
import { useMemo } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useDynamicForm } from '@runilib/react-formbridge'

const NEXT_STEP_BY_ID = {
  personal: 'company',
  company: 'review',
} as const

export function DynamicSignupStepScreen() {
  const router = useRouter()
  const { stepId = 'personal' } = useLocalSearchParams<{ stepId?: string }>()

  const loadDefinition = useMemo(
    () => async () => {
      const response = await fetch('https://api.example.com/forms/signup/' + stepId)
      if (!response.ok) throw new Error('Failed to load step definition')
      return response.json()
    },
    [stepId],
  )

  const { form, fieldOrder, meta, isLoading, loadError } = useDynamicForm(
    loadDefinition,
    {
      formKey: stepId,
      validateOn: 'onBlur',
      persist: {
        key: 'signup-step:' + stepId,
        storage: 'async',
      },
    },
  )

  if (!form) {
    return (
      <View>
        <Text>{isLoading ? 'Loading…' : loadError}</Text>
      </View>
    )
  }

  const nextStepId = NEXT_STEP_BY_ID[stepId as keyof typeof NEXT_STEP_BY_ID]
  const { Form, fields } = form

  return (
    <ScrollView>
      <Form
        onSubmit={async (values) => {
          await api.saveStep(stepId, values)

          if (nextStepId) router.replace('/signup/' + nextStepId)
          else router.replace('/signup/review')
        }}
      >
        <View style={{ gap: 12, padding: 16 }}>
          <Text>{meta.title ?? 'Signup'}</Text>

          {fieldOrder.map((name) => {
            const Field = fields[name]
            return <Field key={name} />
          })}

          <Form.Submit>
            {meta.submitLabel ?? (nextStepId ? 'Continue' : 'Finish')}
          </Form.Submit>
        </View>
      </Form>
    </ScrollView>
  )
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-dynamic-options',
          title: 'Options',
          content: `${DYNAMIC_OPTIONS_SURFACE}

${DYNAMIC_JSON_SURFACE}

Because the returned \`form\` is a standard bridge instance, submit/error handlers still live on \`<Form>\`.`,
        },
        {
          id: 'fb-dynamic-wizard',
          title: 'Cross-page / cross-screen wizard pattern',
          content: `Use \`useDynamicForm()\` for cross-page or cross-screen wizards when the backend already decides the fields for each step and the router or navigator already decides which page is active.

- Put the route param in the dynamic loader so each page fetches only its own step definition
- On native, treat the screen param the same way and fetch one step definition per screen
- Set \`formKey: stepId\` so the form runtime resets cleanly when the route changes
- Include the step id in \`persist.key\` to avoid draft collisions between pages
- Submit the current step to your API, then let the router navigate to the next page
- This pattern is ideal when the server owns the canonical onboarding session or partial payload`,
        },
        {
          id: 'fb-dynamic-return',
          title: 'Return',
          content: `${DYNAMIC_RETURN_SURFACE}`,
        },
        {
          id: 'fb-dynamic-notes',
          title: 'Platform note',
          content: `Dynamic forms are easiest to adopt in web dashboards first. If you target native too, validate the exact field set and renderer combination you plan to ship, because dynamic helpers tend to surface edge cases later than static schemas.

- \`useDynamicForm()\` is excellent for one dynamic step per route
- If you also want a client-owned wizard state machine with \`progress\`, \`completedSteps\`, \`allValues\`, \`goToStep()\`, and route-driven restoration, prefer \`useFormWizard({ stepId, onStepChange })\` once the step schemas are known in the client`,
        },
      ],
    },
    {
      id: 'fb-wizard',

      title: 'useFormWizard()',
      content: `Compose multiple formbridge schemas into a step-by-step flow.

- Each step owns its own schema
- Values are accumulated across steps automatically
- The hook gives you navigation, progress, skip, and final submission helpers without introducing a separate mental model
- Pass \`stepId\` + \`onStepChange\` to let a router or native navigator own cross-page / cross-screen navigation while the wizard keeps the state machine`,
      codeTabs: [
        {
          filename: 'Wizard.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.wizard,
          code: `import type { FormSchema } from '@runilib/react-formbridge'
import { field, useFormWizard } from '@runilib/react-formbridge'

const steps = [
  {
    id: 'account',
    label: 'Account',
    schema: {
      email: field.email('Email').required(),
      password: field.password('Password').required(),
    } satisfies FormSchema,
  },
  {
    id: 'profile',
    label: 'Profile',
    schema: {
      firstName: field.text('First name').required(),
      country: field.select('Country').options(['FR','US','GB']).required(),
    } satisfies FormSchema,
    condition: (values) => values.email?.endsWith('@company.com'),
    optional: true,
  },
  {
    id: 'review',
    label: 'Review',
    schema: {} satisfies FormSchema,
  },
]

export function SignupWizard() {
  const wizard = useFormWizard(steps, {
    persist: { key: 'signup-wizard' },
    onSubmit: (allValues) => api.save(allValues),
  })

  if (!wizard.step) return null

  const { Form, fields } = wizard.currentStep

  return (
    <div>
      <p>Step {wizard.currentStepIndex + 1} / {wizard.totalSteps}</p>
      <Form onSubmit={wizard.next}>
        {'email' in fields && <fields.email />}
        {'password' in fields && <fields.password />}
        {'firstName' in fields && <fields.firstName />}
        {'country' in fields && <fields.country />}
        <Form.Submit>{wizard.isLastStep ? 'Finish' : 'Next'}</Form.Submit>
      </Form>
      {!wizard.isFirstStep && <button onClick={wizard.prev}>Back</button>}
      {wizard.isLastStep && <button onClick={wizard.submit}>Submit</button>}
    </div>
  )
}`,
        },
        {
          filename: 'WizardRoute.web.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.wizard,
          code: `import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { FormSchema } from '@runilib/react-formbridge'
import { field, useFormWizard } from '@runilib/react-formbridge'

const steps = [
  {
    id: 'account',
    label: 'Account',
    schema: {
      email: field.email('Email').required(),
      password: field.password('Password').required(),
    } satisfies FormSchema,
  },
  {
    id: 'company',
    label: 'Company',
    schema: {
      companyName: field.text('Company name').required(),
    } satisfies FormSchema,
  },
  { id: 'review', label: 'Review', schema: {} satisfies FormSchema },
]

export function SignupWizardRoute() {
  const navigate = useNavigate()
  const { stepId } = useParams()

  const wizard = useFormWizard(steps, {
    stepId,
    initialStepId: 'account',
    persist: { key: 'signup-wizard', storage: 'local' },
    onStepChange: ({ step }) => navigate('/signup/' + step.id),
    onSubmit: (allValues) => api.save(allValues),
  })

  useEffect(() => {
    if (!wizard.isHydrating && wizard.currentStepId && stepId !== wizard.currentStepId) {
      navigate('/signup/' + wizard.currentStepId, { replace: true })
    }
  }, [navigate, stepId, wizard.currentStepId, wizard.isHydrating])

  if (wizard.isHydrating || !wizard.step) return null

  const { Form, fields } = wizard.currentStep

  return (
    <Form onSubmit={async () => {
      if (wizard.isLastStep) await wizard.submit()
      else await wizard.next()
    }}>
      {'email' in fields && <fields.email />}
      {'password' in fields && <fields.password />}
      {'companyName' in fields && <fields.companyName />}
      <Form.Submit>{wizard.isLastStep ? 'Finish' : 'Next'}</Form.Submit>
    </Form>
  )
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-wizard-step',
          title: 'Step shape',
          content: `${WIZARD_STEP_SURFACE}`,
        },
        {
          id: 'fb-wizard-options',
          title: 'Options',
          content: `${WIZARD_OPTIONS_SURFACE}

${WIZARD_EVENT_SURFACE}`,
        },
        {
          id: 'fb-wizard-return',
          title: 'Return',
          content: `${WIZARD_RETURN_SURFACE}`,
        },
        {
          id: 'fb-wizard-notes',
          title: 'Why it matters',
          content: `Use the wizard hook when one large form would feel heavy or fragile. It keeps the same schema-first API while making multi-step onboarding, checkout, or settings flows much easier to maintain.

- Same-page usage still works great for classic steppers
- Controlled mode lets the same hook power route-based web flows and screen-based native flows without rewriting validation or persistence`,
        },
      ],
    },
    {
      id: 'fb-readonly',

      title: 'useReadonlyFormBridge()',
      content: `Render schema-driven values as readonly rows or as a diff against original values.

- Useful for review steps before submission, audit views, change approval screens, or before/after comparisons
- It reuses the schema labels and option metadata, so your review UI stays aligned with your editing UI`,
      codeTabs: [
        {
          filename: 'Readonly.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.readonly,
          code: `import { field, useReadonlyFormBridge } from '@runilib/react-formbridge'

const schema = {
  fullName: field.text('Full name'),
  email: field.email('Email'),
  country: field.select('Country').options(['FR','US','GB']),
}

export function ReviewCard({ values, original }: { values: any; original?: any }) {
  const readonly = useReadonlyFormBridge(schema, {
    values,
    originalValues: original,
    mode: original ? 'diff' : 'readonly',
  })

  const { ReadonlyFields, changedFields, hasChanges } = readonly

  return (
    <section>
      <ReadonlyFields.fullName />
      <ReadonlyFields.email />
      <ReadonlyFields.country />
      {hasChanges ? <p>{changedFields.length} fields changed.</p> : null}
    </section>
  )
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-readonly-options',
          title: 'Options',
          content: `- First argument: the schema

${READONLY_OPTIONS_SURFACE}`,
        },
        {
          id: 'fb-readonly-return',
          title: 'Return',
          content: `${READONLY_FIELD_STATE_SURFACE}

${READONLY_FIELD_PROPS_SURFACE}

${READONLY_RETURN_SURFACE}`,
        },
        {
          id: 'fb-readonly-notes',
          title: 'Platform note',
          content: `Readonly review flows are currently most battle-tested on web. If you plan to rely on this API in native screens too, validate the exact renderer behavior you need before rolling it out broadly.`,
        },
      ],
    },
  ],
};
