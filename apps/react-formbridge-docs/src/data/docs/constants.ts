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
    alt: 'Desktop preview of a form themed through globalDefaults and local field overrides.',
    caption:
      'Web styling can combine schema defaults, a shared globalDefaults theme, and one-off field overrides without changing the form runtime.',
    maxWidth: 720,
    maxHeight: 420,
  },
  stylingNative: {
    src: '/docs/formbridge/formbridge-overview-native.svg',
    alt: 'Mobile preview of the same form themed for React Native.',
    caption:
      'React Native styling follows the same layered model: schema defaults, shared globalDefaults theme, and local overrides when one screen needs a different look.',
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
      'React Native slot override recipe: one globalDefaults theme plus targeted local overrides is often enough for polished production screens.',
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

export const FENCE = '```';

export type DocsMethodTableRow = readonly [string, string, string];

export function buildMethodsTable(rows: readonly DocsMethodTableRow[]) {
  const escapeCell = (value: string) =>
    value.replaceAll('\\|', '&#124;').replaceAll('|', '&#124;');

  return [
    '| Method | Type | Description |',
    '| --- | --- | --- |',
    ...rows.map(
      ([method, type, description]) =>
        `| ${escapeCell(method)} | ${escapeCell(type)} | ${escapeCell(description)} |`,
    ),
  ].join('\n');
}

export const BASE_FIELD_BUILDER_REFERENCE =
  '- Shared methods: see [Base field builder](/docs/base-field-builder)';

export const STRING_FIELD_BUILDER_REFERENCE =
  '- String builder methods: see [field.text()](/docs/field-text)';

export const SELECT_FIELD_BUILDER_REFERENCE =
  '- Select-field methods: see [field.select()](/docs/field-select)';

export const BASE_BUILDER_METHODS = [
  'Inherited from `BaseFieldBuilder`:',
  '',
  buildMethodsTable([
    [
      '`defaultValue`',
      '`(value) => this`',
      'Overrides the default value set in the constructor.',
    ],
    [
      '`required`',
      '`(message?) => this`',
      'Marks the field as required. A validation error is shown if the field is left empty.',
    ],
    [
      '`optional`',
      '`() => this`',
      'Marks the field as optional (removes the required constraint). Useful when extending a schema where the field was previously required.',
    ],
    ['`label`', '`(text) => this`', 'Overrides the label set in the constructor.'],
    [
      '`placeholder`',
      '`(text?) => this`',
      'Sets the placeholder text displayed inside the field when it is empty.',
    ],
    [
      '`hint`',
      '`(text) => this`',
      'Adds a helper/hint text displayed below the field to guide the user.',
    ],
    [
      '`disabled`',
      '`(value = true) => this`',
      'Disables (or re-enables) the field. A disabled field is rendered but not interactive.',
    ],
    [
      '`hidden`',
      '`(value = true) => this`',
      'Hides (or shows) the field. A hidden field is not rendered at all.',
    ],
    [
      '`debounce`',
      '`(ms) => this`',
      'Sets the debounce delay (in milliseconds) for value changes. Validation and side-effects are deferred until the user stops typing for the specified duration.',
    ],
    [
      '`validate`',
      '`(fn) => this`',
      'Adds a custom validation function to the field. Multiple validators can be chained - they run in order and the first error message returned is displayed.',
    ],
    [
      '`validateAsync`',
      '`(fn) => this`',
      'Alias for `validate()` when the intent is explicitly asynchronous. Useful for username availability checks, server-side uniqueness validation, promo code verification, and other async rules.',
    ],
    [
      '`transform`',
      '`(fn) => this`',
      'Registers a transform function that is applied to the field value before validation and submission (e.g. trimming whitespace, normalizing case).',
    ],
    [
      '`render`',
      '`(fn) => this`',
      "Provides a custom render function to completely override the default field rendering. Use this when the built-in field components don't meet your UI needs.",
    ],
  ]),
  '',
  'Conditional logic helpers:',
  '',
  buildMethodsTable([
    [
      '`visibleWhen`',
      '`(fieldOrFn, value?) => this`',
      "Makes the field conditionally visible based on another field's value or a custom predicate function. Multiple `visibleWhen*` calls are combined with AND logic.",
    ],
    [
      '`visibleAndRequiredWhen`',
      '`(fieldOrFn, value?) => this`',
      'Makes the field both visible **and** required when the condition is met. Shorthand for calling `visibleWhen()` and `requiredWhen()` with the same condition.',
    ],
    [
      '`visibleWhenNot`',
      '`(field, value) => this`',
      'Makes the field visible when the referenced field does **not** equal the given value.',
    ],
    [
      '`visibleWhenTruthy`',
      '`(field) => this`',
      "Makes the field visible when the referenced field has a truthy value (any value that is not `false`, `0`, `''`, `null`, or `undefined`).",
    ],
    [
      '`visibleWhenFalsy`',
      '`(field) => this`',
      "Makes the field visible when the referenced field has a falsy value (`false`, `0`, `''`, `null`, or `undefined`).",
    ],
    [
      '`visibleWhenAny`',
      '`(pairs) => this`',
      'Makes the field visible when **any** of the given field/value pairs match (OR logic).',
    ],
    [
      '`requiredWhen`',
      '`(fieldOrFn, value?) => this`',
      "Makes the field conditionally required based on another field's value or a custom predicate function.",
    ],
    [
      '`requiredWhenAny`',
      '`(pairs) => this`',
      'Makes the field required when **any** of the given field/value pairs match (OR logic).',
    ],
    [
      '`disabledWhen`',
      '`(fieldOrFn, value?) => this`',
      "Conditionally disables the field based on another field's value or a custom predicate function.",
    ],
    [
      '`resetOnHide`',
      '`() => this`',
      'When the field becomes hidden (via a `visibleWhen*` condition), resets its value back to the default value.',
    ],
    [
      '`keepOnHide`',
      '`() => this`',
      'When the field becomes hidden, keeps its current value intact. The value is preserved and will be included in form submission.',
    ],
    [
      '`clearOnHide`',
      '`() => this`',
      'When the field becomes hidden, clears its value entirely (sets it to an empty/null state).',
    ],
  ]),
].join('\n');

export const STRING_BUILDER_METHODS = [
  'Inherited from `StringFieldBuilder`:',
  '',
  buildMethodsTable([
    ['`min`', '`(length, message?) => this`', 'Minimum string length.'],
    ['`max`', '`(length, message?) => this`', 'Maximum string length.'],
    [
      '`pattern`',
      '`(regex | regex[], message?) => this`',
      'Regex pattern or accepted regex alternatives.',
    ],
    [
      '`patterns`',
      '`(regexes, message?) => this`',
      'Alias for `pattern()` when passing multiple accepted regex alternatives.',
    ],
    [
      '`format`',
      '`(regex, message?) => this`',
      'Internal base format pattern used by built-in field presets like email/url/tel.',
    ],
    ['`trim`', '`() => this`', 'Trim value before validation / submit.'],
    ['`lowercase`', '`() => this`', 'Lowercase the value on every keystroke.'],
    ['`uppercase`', '`() => this`', 'Uppercase the value on every keystroke.'],
    [
      '`nonEmpty`',
      '`(message?) => this`',
      'Rejects empty **and** whitespace-only strings (stricter than `required()`).',
    ],
    [
      '`length`',
      '`(exact, message?) => this`',
      'Requires an exact character count for fixed-size codes.',
    ],
    [
      '`between`',
      '`(min, max, message?) => this`',
      'Shorthand for a combined min+max length check.',
    ],
    [
      '`oneOf`',
      '`(values, message?) => this`',
      'Restricts accepted values to an allow-list.',
    ],
    [
      '`notOneOf`',
      '`(values, message?) => this`',
      'Blocks values from a deny-list (reserved words, forbidden slugs, etc.).',
    ],
    [
      '`matches`',
      '`(fieldName, message?) => this`',
      'Must match the value of another field (e.g. confirm password). Supports `ref()` paths.',
    ],
    [
      '`sameAs`',
      '`(fieldName, message?) => this`',
      'Alias for `matches()` with more explicit semantics.',
    ],
  ]),
].join('\n');

export const BASE_BUILDER_METHOD_EXAMPLES = [
  'Mini examples for the shared base builder methods:',
  "- `defaultValue('FR')` → `field.select('Country').defaultValue('FR')`",
  "- `required('Required')` / `optional()` → `field.text('Middle name').required('Required').optional()`",
  "- `label('Username')` / `placeholder('@alex')` / `hint('Shown publicly')` → `field.text('Handle').label('Username').placeholder('@alex').hint('Shown publicly')`",
  "- `disabled()` / `hidden()` / `debounce(500)` → `field.text('Referral code').disabled().hidden(false).debounce(500)`",
  "- `validate((value) => value ? null : 'Missing')` → `field.text('Company').validate((value) => value.length >= 2 ? null : 'Use at least 2 characters')`",
  "- `transform((value) => value.trim())` → `field.text('Slug').transform((value) => value.trim().toLowerCase().replace(/\\s+/g, '-'))`",
  "- `render(fn)` → `field.custom(0).label('Rating').render(({ value, onChange }) => <Stars value={value} onChange={onChange} />)`",
  "- `visibleWhen('accountType', 'company')` → `field.text('Company name').visibleWhen('accountType', 'company')`",
  "- `visibleAndRequiredWhen('accountType', 'company')` → `field.text('Company name').visibleAndRequiredWhen('accountType', 'company')`",
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
  '',
  buildMethodsTable([
    [
      '`validateOn?`',
      "`'onChange' \\| 'onBlur' \\| 'onSubmit' \\| 'onTouched'`",
      "First validation trigger. Default `'onBlur'`",
    ],
    [
      '`revalidateOn?`',
      "`'onChange' \\| 'onBlur' \\| 'onSubmit' \\| 'onTouched'`",
      "Follow-up trigger after first interaction. Default `'onChange'`",
    ],
    [
      '`resolver?`',
      '`SchemaValidatorResolver`',
      'Async `(values) => ({ values, errors })`. When present, becomes the validation source of truth',
    ],
    [
      '`persist?`',
      '`PersistOptions`',
      'Enables draft save/restore with storage, TTL, debounce, exclusion, restore/save callbacks, and versioning',
    ],
    [
      '`formKey?`',
      '`string`',
      'Recreates the runtime when the surrounding context changes',
    ],
    [
      '`initialValues?`',
      '`Partial<SchemaValues<typeof schema>>`',
      'Seeds the runtime with existing values',
    ],
    [
      '`analytics?`',
      '`AnalyticsOptions`',
      'Wires analytics without changing the field components',
    ],
    [
      '`globalDefaults?`',
      '`(state) => FormBridgeUiOptions`',
      'Shared theming layer for generated fields, form wrapper, and submit button; reactive to submit/dirty/error state',
    ],
  ]),
].join('\n');

export const USE_FORM_BRIDGE_RETURN_SURFACE = [
  'Complete hook return surface. Every value listed below is returned by `useFormBridge()` in the exact order shown in the code snippet above, with a link to its dedicated reference section:',
  '',
  buildMethodsTable([
    [
      '[FormProvider](/docs/useformbridgecontext)',
      '`ComponentType`',
      'Advanced context wrapper for consumers rendered outside `<Form>`',
    ],
    [
      '[Form](/docs/form-component)',
      '`ComponentType & { Submit }`',
      'Generated wrapper component with submit lifecycle (includes `Form.Submit`)',
    ],
    [
      '[fields](/docs/generated-fields)',
      '`Record<name, Component>`',
      'Typed generated field components keyed by schema name',
    ],
    [
      '[FieldError](/docs/fielderror-component)',
      '`ComponentType<{ name }>`',
      'Standalone error renderer for one field name',
    ],
    [
      '[FieldLabel](/docs/fieldlabel-component)',
      '`ComponentType<{ name }>`',
      'Standalone label renderer for one field name',
    ],
    [
      '[fieldController](/docs/fieldcontroller)',
      '`(name) => Controller`',
      'Field-scoped runtime for fully custom UI while keeping the schema contract',
    ],
    [
      '[state](/docs/state)',
      '`FormState`',
      'Reactive `FormState` object (values, errors, touched, dirty, isValid, isSubmitting, …)',
    ],
    [
      '[visibility](/docs/conditional-logic)',
      '`Record<name, Flags>`',
      'Per-field visibility / required / disabled state computed from conditional rules',
    ],
    [
      '[isLoadingDraft](/docs/draft-persistence)',
      '`boolean`',
      '`true` while a persisted draft is being restored',
    ],
    [
      '[hasDraft](/docs/draft-persistence)',
      '`boolean`',
      '`true` once a draft was found and restored',
    ],
    ['[clearDraft](/docs/draft-persistence)', '`() => void`', 'Delete the saved draft'],
    [
      '[saveDraftNow](/docs/draft-persistence)',
      '`() => void`',
      'Persist immediately without waiting for debounce',
    ],
    [
      '[setValue](/docs/actions-and-helpers)',
      '`(name, value) => void`',
      'Set one field value programmatically',
    ],
    [
      '[getValue](/docs/actions-and-helpers)',
      '`(name) => value`',
      'Read one field value',
    ],
    [
      '[getValues](/docs/actions-and-helpers)',
      '`() => Values`',
      'Read the full value object',
    ],
    [
      '[validate](/docs/actions-and-helpers)',
      '`(names?) => Promise<boolean>`',
      'Validate one field, several fields, or the full form',
    ],
    [
      '[resetFields](/docs/actions-and-helpers)',
      '`(values?) => void`',
      'Reset to schema defaults or a provided partial value object',
    ],
    [
      '[setError](/docs/actions-and-helpers)',
      '`(name, message) => void`',
      'Push a manual field error',
    ],
    [
      '[clearErrors](/docs/actions-and-helpers)',
      '`(name?) => void`',
      'Clear one field, many fields, or all errors',
    ],
    [
      '[watch](/docs/actions-and-helpers)',
      '`(name) => value`',
      'Reactive single-field read',
    ],
    [
      '[watchAll](/docs/actions-and-helpers)',
      '`() => Values`',
      'Reactive full-value read',
    ],
    [
      '[submit](/docs/actions-and-helpers)',
      '`() => Promise<void>`',
      'Imperative submit using the same submit pipeline as `Form.Submit`',
    ],
  ]),
].join('\n');

export const FIELD_CONTROLLER_SURFACE = [
  'Complete `fieldController(name)` surface:',
  '',
  buildMethodsTable([
    ['`name`', '`string`', 'Field name as declared in the schema'],
    ['`value`', '`unknown`', 'Current field value (reactive)'],
    [
      '`label` / `placeholder` / `hint`',
      '`string`',
      'Copy strings resolved from the schema',
    ],
    ['`error`', '`string \\| undefined`', 'Current error message for this field'],
    [
      '`touched` / `dirty` / `validating`',
      '`boolean`',
      'Per-field interaction + validation flags',
    ],
    ['`disabled` / `required` / `visible`', '`boolean`', 'Computed conditional flags'],
    ['`options?`', '`SelectOption[]`', 'Options (select/radio/async) when applicable'],
    ['`otpLength?`', '`number`', 'OTP length (OTP fields only)'],
    ['`allValues`', '`Record<string, unknown>`', 'Snapshot of every current form value'],
    ['`descriptor`', '`FieldDescriptor`', 'Raw descriptor produced by the builder'],
    [
      '`renderProps`',
      '`RenderContext`',
      'Context object passed to custom `render(fn)` hooks',
    ],
    [
      '`setValue`',
      '`(value) => void`',
      'Imperative value write (goes through change pipeline)',
    ],
    [
      '`onChange`',
      '`(value) => void`',
      'Change handler expected by most controlled inputs',
    ],
    ['`onBlur` / `onFocus`', '`() => void`', 'Blur / focus event handlers'],
    [
      '`focus` / `blur`',
      '`() => void`',
      'Imperative focus / blur (uses the focus bridge)',
    ],
    ['`validate`', '`() => Promise<boolean>`', 'Run validation for this field only'],
    ['`setError`', '`(message) => void`', 'Push an error on this field'],
    ['`clearError`', '`() => void`', 'Clear this field error'],
    [
      '`registerFocusable`',
      '`(target) => void`',
      'Register a DOM node, `TextInput`, or `{ focus?, blur? }` object for the focus bridge',
    ],
  ]),
].join('\n');

export const FORM_COMPONENT_PROPS_SURFACE = [
  'Complete `Form` props surface:',
  '',
  'Alongside the FormBridge-specific props below, `Form` also extends the native props of the underlying platform wrapper, except for the keys FormBridge already owns (`children`, `onSubmit`, `style`, and `className`).',
  '',
  '- **Web**: native `<form>` attributes like `id`, `name`, `method`, `autoComplete`, `aria-*`, `data-*`, `target`, `noValidate`, …',
  '- **Native**: passthrough wrapper props such as `testID`, `accessibilityLabel`, `pointerEvents`, …',
  '',
  buildMethodsTable([
    ['`children`', '`ReactNode`', 'Form body content'],
    [
      '`onSubmit`',
      '`(values) => void \\| Promise<void>`',
      '**Required** - sync or async submit handler',
    ],
    ['`onError?`', '`(errors) => void`', 'Called when validation fails before submit'],
    [
      '`onSubmitError?`',
      '`(error) => string`',
      'Maps a thrown submit error to the user-facing `state.submitError` string',
    ],
    ['`style?`', '`StyleProp`', 'Cross-platform wrapper style prop'],
    ['`className?`', '`string`', 'Web only'],
  ]),
].join('\n');

export const FORM_SUBMIT_PROPS_SURFACE = [
  'Complete `Form.Submit` props surface:',
  '',
  'Alongside the props below, `Form.Submit` also extends the native props of the underlying platform button / pressable, except for the keys FormBridge already models itself (`children`, `style`, and the managed loading / disabled behavior).',
  '',
  '- **Web**: native `<button>` attributes like `type`, `name`, `value`, `form`, `formAction`, `aria-*`, `data-*`, …',
  '- **Native**: passthrough `TouchableOpacity`-style props such as `testID`, `accessibilityLabel`, `hitSlop`, `activeOpacity`, …',
  '',
  buildMethodsTable([
    ['`children?`', '`ReactNode`', 'Button label / content'],
    ['`style?`', '`StyleProp`', 'Cross-platform button/wrapper style'],
    ['`loadingText?`', '`ReactNode`', 'Replaces the label while submitting'],
    [
      '`disabled?`',
      '`boolean`',
      'Adds an extra disabled condition on top of submit state',
    ],
    ['`className?`', '`string`', 'Web only'],
    ['`containerStyle?`', '`StyleProp`', 'Native only wrapper/button style'],
    ['`textStyle?`', '`StyleProp`', 'Native only label style'],
    ['`indicatorColor?`', '`string`', 'Native only loading indicator color'],
  ]),
].join('\n');

export const GENERATED_FIELD_COMMON_PROPS_SURFACE = [
  'Common generated field props available on every field component:',
  '',
  buildMethodsTable([
    ['`label?`', '`string`', 'Override the schema label for this render only'],
    ['`placeholder?`', '`string`', 'Override placeholder copy for this render only'],
    ['`hint?`', '`string`', 'Override helper copy for this render only'],
    ['`style?`', '`StyleProp`', 'Wrapper style override'],
    [
      '`classNames?`',
      '`SlotClassMap`',
      'Web slot class map (also available as top-level prop)',
    ],
    ['`className?`', '`string`', 'Web only wrapper class override'],
  ]),
].join('\n');

export const GENERATED_FIELD_UI_SURFACE = [
  'Shared field override capabilities:',
  '',
  buildMethodsTable([
    ['`id?` / `testID?`', '`string`', 'Platform id hooks'],
    ['`hideLabel?`', '`boolean`', 'Visually suppress the default label'],
    [
      '`highlightOnError?`',
      '`boolean`',
      'Keep the error message but suppress the default error chrome when `false`',
    ],
    ['`styles?`', '`SlotStyleMap`', 'Slot style map'],
    ['`classNames?`', '`SlotClassMap`', 'Web slot class map'],
    [
      '`wrapperProps?` / `labelProps?` / `hintProps?` / `errorProps?`',
      '`object`',
      'Forward low-level props to the built-in renderer',
    ],
    [
      '`renderLabel?` / `renderHint?` / `renderError?`',
      '`(ctx) => ReactNode`',
      'Render-hook escape hatches',
    ],
    ['`renderRequiredMark?`', '`() => ReactNode`', 'Custom required mark renderer'],
    [
      '`inputProps?`',
      '`object`',
      'Text-like fields - forward props to the underlying input',
    ],
    ['`textareaProps?`', '`object`', '`textarea` on web'],
    ['`selectProps?`', '`object`', '`select` on web'],
    ['`renderPicker?`', '`(ctx) => ReactNode`', 'Select-like fields - custom picker UI'],
    [
      '`renderOption?`',
      '`(option, state) => ReactNode`',
      'Async select/autocomplete - custom option row',
    ],
    [
      '`renderEmpty?` / `renderLoading?`',
      '`() => ReactNode`',
      'Async select/autocomplete - empty/loading states',
    ],
    ['`searchInputProps?`', '`object`', 'Phone fields on web'],
    ['`renderFileIcon?`', '`(file) => ReactNode`', 'File fields on web'],
    ['`pickFiles?`', '`(ctx) => void`', 'File fields on native'],
  ]),
].join('\n');

export const FORM_STATE_SURFACE = [
  'Complete `state` surface:',
  '',
  buildMethodsTable([
    [
      '`values`',
      '`SchemaValues`',
      'Current field values, typed from the schema. Each key matches a schema field; each value is the inferred runtime type (string, number, File, …).',
    ],
    [
      '`errors`',
      '`Record<string, string>`',
      'Per-field error messages. A key is present only when the field currently has an error; absent keys mean the field is valid. Messages are plain strings produced by the validator pipeline (Zod/Yup/Joi/Valibot/built-in).',
    ],
    [
      '`touched`',
      '`Record<string, boolean>`',
      'Per-field "has been touched" flags. A field becomes touched when the user blurs it at least once. Used to gate error visibility so forms don\'t scream red on first render.',
    ],
    [
      '`dirty`',
      '`Record<string, boolean>`',
      'Per-field "has been modified" flags. Set to `true` the first time a field\'s value diverges from its initial value, and cleared if the user reverts it.',
    ],
    [
      '`status`',
      "`'idle' \\| 'validating' \\| 'submitting' \\| 'success' \\| 'error'`",
      'Coarse lifecycle state - see `FormStatus`. Prefer the boolean helpers below (`isSubmitting`, `isSubmitSuccess`, …) for UI conditions.',
    ],
    [
      '`isValid`',
      '`boolean`',
      '`true` when `errors` is empty. Reflects current validation, not whether the user has attempted submit - use with `submitCount` if you only want to show errors after a submit attempt.',
    ],
    [
      '`isDirty`',
      '`boolean`',
      '`true` when at least one field is dirty. Useful for "unsaved changes" prompts and enabling Save buttons.',
    ],
    [
      '`isSubmitting`',
      '`boolean`',
      "`true` while `status` is `'submitting'` or `'validating'`. Use this to disable inputs or show a spinner during submission.",
    ],
    [
      '`isSubmitSuccess`',
      '`boolean`',
      '`true` when the last submission completed successfully.',
    ],
    [
      '`isSubmitError`',
      '`boolean`',
      '`true` when the last submission failed (threw or returned a rejection).',
    ],
    [
      '`submitCount`',
      '`number`',
      'Monotonic counter incremented on every submit attempt (successful or not). Use it as a signal that the user has tried to submit at least once.',
    ],
    [
      '`formLevelError`',
      '`string \\| null`',
      'Form-level validation error produced by cross-field rules (e.g. `refine()` / `superRefine()` in a `createSchema()` pipeline). `null` when there is no form-level validation issue.',
    ],
    [
      '`submitError`',
      '`string \\| null`',
      'Error message produced by the most recent failed `onSubmit` call - for example an API/network error. `null` when the last submission succeeded or no submission has happened yet.',
    ],
  ]),
].join('\n');

export const ACTIONS_HELPERS_SURFACE = [
  'Complete imperative helper surface. Each entry below is exposed on the object returned by `useFormBridge()` and runs through the same pipeline as the built-in UI (validation, analytics, conditional rules, persistence):',
  '',
  buildMethodsTable([
    [
      '`validate`',
      '`(name? \\| name[]) => Promise<boolean>`',
      'Trigger validation imperatively. Pass one name, an array, or nothing for the whole form. Resolves `true` when every targeted field is valid',
    ],
    [
      '`resetFields`',
      '`(partialValues?) => void`',
      'Reset to schema defaults (or merge a partial on top). Clears errors, touched, and dirty flags and re-runs conditional rules',
    ],
    [
      '`setValue`',
      '`(name, value) => void`',
      'Imperatively write into one field. Goes through the normal change pipeline (validation timing, analytics, conditional re-evaluation)',
    ],
    [
      '`getValue`',
      '`(name) => value`',
      'Read one field on demand without subscribing the caller to updates',
    ],
    [
      '`getValues`',
      '`() => Values`',
      'Read the full typed value object without subscribing - ideal for building payloads or logging',
    ],
    [
      '`setError`',
      '`(name, message) => void`',
      'Push a manual error onto one field. Used to project server-side errors back onto the form',
    ],
    [
      '`clearErrors`',
      '`(name? \\| name[]) => void`',
      'Clear errors for one field, a subset, or the whole form',
    ],
    [
      '`watch`',
      '`(name) => value`',
      'Reactive single-field read - subscribes the caller so it re-renders on change',
    ],
    [
      '`watchAll`',
      '`() => Values`',
      'Reactive full-values read - heavier than `watch`, use for summary bars or debug panels',
    ],
    [
      '`submit`',
      '`() => Promise<void>`',
      'Imperatively trigger submission through the same pipeline as `<Form.Submit>` (validation, `onSubmit` / `onError` / `onSubmitError`, analytics)',
    ],
    [
      '`fieldController`',
      '`(name) => Controller`',
      'Returns a headless controller for one field (reactive value, error, touched, visible, change/blur/focus handlers, imperative helpers, focus bridge)',
    ],
    [
      '`saveDraftNow`',
      '`() => void`',
      'When `persist` is configured, flush current values to storage immediately, bypassing the debounce window',
    ],
    [
      '`clearDraft`',
      '`() => void`',
      'When `persist` is configured, delete the saved draft for this form',
    ],
    [
      '`visibility[name]`',
      '`{ visible, required, disabled }`',
      'Computed per-field conditional flags - drive surrounding layout without re-implementing the rule engine',
    ],
  ]),
].join('\n');

export const VALIDATION_RUNTIME_SURFACE = [
  'Validation entry points in the public runtime:',
  '',
  buildMethodsTable([
    [
      'Builder rules',
      '-',
      'Field-level rules live on the builders themselves and are documented in the builder sections',
    ],
    [
      '`validateOn`',
      "`'onBlur' \\| 'onChange' \\| 'onSubmit' \\| 'onTouched'`",
      'First validation trigger',
    ],
    [
      '`revalidateOn`',
      "`'onBlur' \\| 'onChange' \\| 'onSubmit' \\| 'onTouched'`",
      'Follow-up trigger after interaction',
    ],
    ['`validate`', '`(names?) => Promise<boolean>`', 'Trigger validation imperatively'],
    [
      '`setError` / `clearErrors`',
      '`(name, message) => void`',
      'Merge server-side validation into the same runtime',
    ],
    [
      '`resolver`',
      '`(values) => { values, errors }`',
      'Let an external schema engine own the final `{ values, errors }` result',
    ],
  ]),
].join('\n');

export const RESOLVER_SHARED_OPTIONS_SURFACE = [
  'Shared adapter options (`ResolverAdapterOptions`) supported by all built-in resolvers:',
  '',
  buildMethodsTable([
    [
      '`rootKey?`',
      '`string \\| null`',
      "Where pathless errors land. Default `'_root'`. Set `null` to drop them",
    ],
    [
      '`errorMode?`',
      "`'first' \\| 'join' \\| 'last'`",
      'How duplicate field errors are aggregated',
    ],
    ['`joinMessagesWith?`', '`string`', "Separator for `errorMode: 'join'`"],
    ['`formatPath?`', '`(path, issue) => string`', 'Rewrite the final error key'],
    [
      '`mapIssue?`',
      '`(context) => Issue \\| null`',
      'Remap, skip, or rewrite an issue before it hits the error bag',
    ],
    [
      '`normalizeMessage?`',
      '`(message, issue) => string`',
      'Final message normalization hook',
    ],
  ]),
].join('\n');

export const RESOLVER_LIBRARY_OPTIONS_SURFACE = [
  'Library-specific resolver options:',
  '',
  buildMethodsTable([
    [
      '`zodResolver`',
      '`(schema, { mode?, parseOptions?, ...shared })`',
      "`mode?: 'auto' \\| 'sync' \\| 'async'` + Zod `parseOptions`",
    ],
    [
      '`yupResolver`',
      '`(schema, { mode?, validateOptions?, ...shared })`',
      "`mode?: 'auto' \\| 'sync' \\| 'async'` + Yup `validateOptions`",
    ],
    [
      '`joiResolver`',
      '`(schema, { mode?, validateOptions?, stripQuotes?, ...shared })`',
      "`mode?: 'auto' \\| 'sync' \\| 'async'` + Joi `validateOptions` + `stripQuotes`",
    ],
    [
      '`valibotResolver`',
      '`(schema, { mode?, parseOptions?, module?, ...shared })`',
      "`mode?: 'auto' \\| 'sync' \\| 'async'` + Valibot `parseOptions` + `module`",
    ],
  ]),
].join('\n');

export const CONDITIONAL_VISIBILITY_SURFACE = [
  'Visibility helpers live on every builder. Multiple calls compose with **AND** logic - every rule must pass for the field to stay visible. When a field is hidden its value follows the on-hide policy (default: reset to the field default).',
  '',
  buildMethodsTable([
    [
      '`visibleWhen(field, value?)`',
      '`(field: string, value?: unknown)`',
      "Visible when the named field strictly equals `value`. Defaults `value` to `true`, so `visibleWhen('acceptTerms')` is the idiomatic toggle for a boolean gate.",
    ],
    [
      '`visibleWhen(predicate)`',
      '`((values, ctx) => boolean)`',
      'Cross-field predicate with access to the full form values snapshot. Use when the rule depends on more than one field.',
    ],
    [
      '`visibleWhenNot(field, value)`',
      '`(field: string, value: unknown)`',
      'Visible when the named field is **not** strictly equal to `value`. Useful for "hide only on the default option" patterns.',
    ],
    [
      '`visibleWhenTruthy(field)`',
      '`(field: string)`',
      "Visible when the named field is truthy. Matches anything that is not `false`, `0`, `''`, `null` or `undefined`.",
    ],
    [
      '`visibleWhenFalsy(field)`',
      '`(field: string)`',
      'Mirror of `visibleWhenTruthy` - visible when the named field is falsy. Handy for "still empty" hints or reminder blocks.',
    ],
    [
      '`visibleWhenAny(pairs)`',
      '`(pairs: Array<[field: string, value: unknown]>)`',
      'Visible when **at least one** `[field, value]` pair matches (OR logic). Combine with plain `visibleWhen(...)` calls to express "any of A/B/C AND also X".',
    ],
    [
      '`visibleAndRequiredWhen(fieldOrPredicate, value?)`',
      '`(field: string, value?: unknown)` or `((values, ctx) => boolean)`',
      'Shorthand that pushes the same rule into both the visibility **and** required stacks in one call - keeps the two stacks in sync automatically.',
    ],
  ]),
  '',
  `${FENCE}ts
field.text('Company name')
  .visibleAndRequiredWhen('accountType', 'business')
  .clearOnHide()
${FENCE}`,
].join('\n');

export const CONDITIONAL_REQUIRED_SURFACE = [
  'Dynamic required state works like visibility - the rule is evaluated on every form change. A hidden field never raises a required error even if `requiredWhen` would otherwise match.',
  '',
  buildMethodsTable([
    [
      '`requiredWhen(field, value?)`',
      '`(field: string, value?: unknown)`',
      'Required when the named field strictly equals `value` (default `true`). Multiple calls compose with **AND** logic.',
    ],
    [
      '`requiredWhen(predicate)`',
      '`((values, ctx) => boolean)`',
      'Cross-field predicate - use when the decision needs multiple fields.',
    ],
    [
      '`requiredWhenAny(pairs)`',
      '`(pairs: Array<[field: string, value: unknown]>)`',
      'Required when **any** `[field, value]` pair matches (OR logic).',
    ],
  ]),
  '',
  `${FENCE}ts
field.text('Referral code')
  .requiredWhenAny([
    ['source', 'friend'],
    ['source', 'partner'],
  ])
${FENCE}`,
].join('\n');

export const CONDITIONAL_DISABLED_SURFACE = [
  'Disabled rules toggle the field interactivity without removing it from the layout. The field still submits its current value, it just cannot be edited by the user.',
  '',
  buildMethodsTable([
    [
      '`disabledWhen(field, value?)`',
      '`(field: string, value?: unknown)`',
      'Disabled when the named field strictly equals `value` (default `true`). Multiple calls compose with **AND** logic.',
    ],
    [
      '`disabledWhen(predicate)`',
      '`((values, ctx) => boolean)`',
      'Cross-field predicate form. There is intentionally no `disabledWhenAny` - compose a predicate if you need OR logic.',
    ],
  ]),
  '',
  `${FENCE}ts
field.text('Invoice email')
  .disabledWhen((values) => values.billingSameAsContact === true)
${FENCE}`,
].join('\n');

export const CONDITIONAL_ON_HIDE_SURFACE = [
  'On-hide behavior controls what happens to a field value when the field becomes invisible. It only runs on the hide transition - re-showing the field never mutates the value.',
  '',
  buildMethodsTable([
    [
      '`resetOnHide()`',
      '`() => this`',
      'Reset the field to its builder default when it becomes hidden. **This is the default** if you never call any of these helpers.',
    ],
    [
      '`clearOnHide()`',
      '`() => this`',
      'Clear the field on hide (empty string, `null`, or the empty form of the field type). Use it when a stale value would be confusing if the user toggles the gate back open.',
    ],
    [
      '`keepOnHide()`',
      '`() => this`',
      'Keep the value as-is while hidden. Pairs well with persistence so the user never loses input when flipping a branching field back and forth.',
    ],
  ]),
  '',
  `${FENCE}ts
// Default - reset
field.text('Company name').visibleWhen('accountType', 'business')
// Clear the input when the branch is not selected
field.text('VAT').visibleWhen('accountType', 'business').clearOnHide()
// Keep the value across visibility toggles
field.text('Notes').visibleWhen('showNotes').keepOnHide()
${FENCE}`,
].join('\n');

export const CONDITIONAL_SURFACE = [
  CONDITIONAL_VISIBILITY_SURFACE,
  '',
  CONDITIONAL_REQUIRED_SURFACE,
  '',
  CONDITIONAL_DISABLED_SURFACE,
  '',
  CONDITIONAL_ON_HIDE_SURFACE,
].join('\n');

export const PERSIST_OPTIONS_SURFACE = [
  'Complete `PersistOptions` surface:',
  '',
  buildMethodsTable([
    ['`key`', '`string`', '**Required** storage key namespace'],
    [
      '`storage?`',
      "`'local' \\| 'session' \\| 'async' \\| custom`",
      "Storage backend. Default `'local'`",
    ],
    ['`ttl?`', '`number`', 'Seconds before the draft expires. Default `3600`'],
    ['`exclude?`', '`string[]`', 'Field names never written to storage. Default `[]`'],
    ['`debounce?`', '`number`', 'Ms before writes flush to storage. Default `800`'],
    ['`onRestore?`', '`(values) => void`', 'Called after a valid draft is restored'],
    ['`onSaveError?`', '`(error) => void`', 'Called when a draft write fails'],
    [
      '`version?`',
      '`string`',
      "Bump to invalidate previously saved drafts. Default `'1'`",
    ],
  ]),
].join('\n');

export const GLOBAL_UI_SURFACE = [
  'Complete `globalDefaults` surface:',
  '',
  buildMethodsTable([
    [
      '`globalDefaults`',
      '`(state) => FormBridgeUiOptions`',
      'Function invoked on each render - can react to submit/dirty/error state',
    ],
    [
      '`field?`',
      '`{ classNames?, styles?, hideLabel?, highlightOnError?, readOnly?, wrapperProps?, ... }`',
      'Shared defaults for all generated fields',
    ],
    [
      '`form?` (web)',
      '`{ className?, style?, props? }`',
      'Form wrapper overrides on web',
    ],
    ['`form?` (native)', '`{ style?, props? }`', 'Form wrapper overrides on native'],
    [
      '`submit?` (web)',
      '`{ className?, style?, loadingText?, props? }`',
      'Submit button overrides on web',
    ],
    [
      '`submit?` (native)',
      '`{ style?, containerStyle?, textStyle?, indicatorColor?, loadingText?, props?, contentProps? }`',
      'Submit button overrides on native',
    ],
  ]),
].join('\n');

export const WEB_SLOT_SURFACE = [
  'Web field slot names currently exposed through `classNames` / `styles`.',
  'Slot names are prefixed with the field type so it is clear where each override will land.',
  '',
  '| Field | Slot names |',
  '| --- | --- |',
  '| Shared (every field) | `wrapper`, `label`, `hint`, `error`, `requiredMark` |',
  '| Text / email / number / tel / url / date | `textInput` |',
  '| Textarea | `textarea` |',
  '| Select | `select`, `selectValue`, `selectArrow` |',
  '| Checkbox | `checkboxRow`, `checkboxInput`, `checkboxLabel` |',
  '| Radio | `radioGroup`, `radioOption`, `radioInput`, `radioLabel` |',
  '| Switch | `switchRoot`, `switchButton`, `switchTrack`, `switchThumb`, `switchLabel` |',
  '| OTP | `otpContainer`, `otpInput`, `otpSeparator` |',
  '| Password | `passwordInput`, `passwordToggle`, `passwordStrengthRow`, `passwordStrengthBar`, `passwordStrengthMeta`, `passwordStrengthFill`, `passwordStrengthLabel`, `passwordStrengthEntropy`, `passwordRulesList`, `passwordRuleItem`, `passwordRuleBullet`, `passwordRuleText` |',
  '| Phone | `phoneInput`, `phoneRow`, `phoneCountryButton`, `phoneCountryFlag`, `phoneCountryDivider`, `phoneChevron`, `phoneSearchInput`, `phoneSearchWrapper`, `phoneCountryList`, `phoneCountryScroll`, `phoneCountryItem`, `phoneSeparator`, `phoneCountryName`, `phoneCountryDial`, `phoneE164`, `phoneEmptyText` |',
  '| File | `fileDropZone`, `fileDropZoneIcon`, `fileDropZoneText`, `fileDropZoneAccept`, `fileDropZoneMaxSize`, `fileBrowseButton`, `fileList`, `fileListItem`, `filePreviewImage`, `fileIcon`, `fileInfo`, `fileName`, `fileMeta`, `fileRemoveButton`, `fileAddMoreButton` |',
  '| Async autocomplete | `autocompleteInput`, `autocompleteSelect`, `autocompleteSelectValue`, `autocompleteSelectArrow`, `autocompleteListbox`, `autocompleteOption`, `autocompleteOptionActive`, `autocompleteOptionSelected`, `autocompleteEmpty`, `autocompleteLoading` |',
].join('\n');

export const NATIVE_SLOT_SURFACE = [
  'Native field slot names currently exposed through `styles`.',
  'Slot names are prefixed with the field type so it is clear where each override will land.',
  '',
  '| Field | Slot names |',
  '| --- | --- |',
  '| Shared (every field) | `wrapper`, `label`, `error`, `hint`, `requiredMark` |',
  '| Text / email / number / tel / url / date | `textInput` |',
  '| Checkbox | `checkboxRow`, `checkboxBox`, `checkboxLabel` |',
  '| Switch | `switchRow`, `switchLabel` |',
  '| Select / radio | `selectTrigger`, `selectTriggerLabel`, `selectOptionRow`, `selectOptionLabel`, `selectModalBackdrop`, `selectModalCard` |',
  '| OTP | `otpContainer`, `otpInput`, `otpSeparator` |',
  '| Password | `passwordInput`, `passwordToggle`, `passwordToggleText`, `passwordStrengthRow`, `passwordStrengthBar`, `passwordStrengthMeta`, `passwordStrengthFill`, `passwordStrengthLabel`, `passwordStrengthEntropy`, `passwordRulesList`, `passwordRuleItem`, `passwordRuleBullet`, `passwordRuleText` |',
  '| Phone | `phoneInput`, `phoneRow`, `phoneCountryButton`, `phoneCountryFlag`, `phoneCountryDial`, `phoneCountryDivider`, `phoneChevron`, `phoneE164`, `phoneModalBackdrop`, `phoneModalCard`, `phoneSearchInput`, `phoneSeparator`, `phoneCountryRow`, `phoneCountryName`, `phoneEmptyText` |',
  '| File | `filePickButton`, `filePickButtonText`, `fileList`, `fileItem`, `fileIcon`, `fileIconText`, `fileName`, `fileMeta`, `fileRemoveButton`, `fileRemoveText` |',
  '| Async autocomplete | `autocompleteTrigger`, `autocompleteTriggerValue`, `autocompleteTriggerPlaceholder`, `autocompleteModalBackdrop`, `autocompleteModalCard`, `autocompleteSearchInput`, `autocompleteLoadingRow`, `autocompleteLoadingText`, `autocompleteOptionRow`, `autocompleteOptionLabel`, `autocompleteEmptyText` |',
].join('\n');

export const HOST_HELPERS_SURFACE = [
  'Complete host helper exports:',
  '',
  'Each host keeps the full props surface of the runtime component it wraps, including platform-native attributes.',
  '',
  '| Host | Props |',
  '| --- | --- |',
  '| `FieldHost` | generated field props + `field` |',
  '| `SubmitHost` | full submit props (including native button / pressable attrs) + `submit` |',
  '| `FormHost` | full form props (including native form / wrapper attrs) + `form` |',
].join('\n');

export const INFER_AUTODETECTION_SURFACE = [
  'Auto-detection rules used by `field.infer()`:',
  '',
  '| Key / value shape | Inferred type |',
  '| --- | --- |',
  '| Key names containing `email` | `email` |',
  '| Key names containing `password` / `pass` | `password` |',
  '| Key names containing `phone` / `tel` / `mobile` / `cell` / `fax` | `phone` |',
  '| Key names containing `url` / `website` / `link` | `url` |',
  '| Key names containing `bio`, `description`, `note`, `comment` | `textarea` |',
  '| Key names containing `date`, `birthday`, `born` | `date` |',
  '| Key names containing `enabled`, `active`, `toggle`, `visible` | `switch` |',
  '| `boolean` values | `switch` |',
  '| `number` values | `number` |',
  '| array values | `select` |',
  '| Everything else | `text` (fallback) |',
].join('\n');

export const INFER_OPTIONS_SURFACE = [
  'Complete `InferFieldOptions` surface:',
  '',
  buildMethodsTable([
    ['`type?`', '`FieldType`', 'Force a specific field type - overrides auto-detection'],
    ['`label?`', '`string`', 'Override the generated label'],
    ['`placeholder?`', '`string`', 'Override the generated placeholder'],
    ['`hint?`', '`string`', 'Helper text'],
    [
      '`required?`',
      '`boolean \\| string`',
      'Marks the field required (message optional)',
    ],
    ['`min?`', '`number`', 'Minimum length/value'],
    ['`max?`', '`number`', 'Maximum length/value'],
    [
      '`options?`',
      '`SelectOption[] \\| string[]`',
      'Option list for select/radio fields',
    ],
    ['`disabled?`', '`boolean`', 'Disable the field'],
    ['`hidden?`', '`boolean`', 'Hide the field'],
    ['`validate?`', '`(value, allValues) => string \\| null`', 'Custom inline validator'],
  ]),
].join('\n');

export const ANALYTICS_OPTIONS_SURFACE = [
  'Complete `AnalyticsOptions` surface (the first argument of `useFormBridgeAnalytics()`):',
  '',
  buildMethodsTable([
    [
      '`handlers`',
      '`AnalyticsHandlers`',
      '**Required** - set of callbacks the tracker fires on every tracked event. Each handler is individually optional',
    ],
    [
      '`exclude?`',
      '`string[]`',
      "Extra field names to exclude from **every** callback. Merged with the built-in deny-list `['password', 'confirm', 'cvv', 'pin', 'otp', 'ssn', 'secret']`. Stripped from `values` / `errors` payloads passed to `onFormAbandoned` / `onFormLevelError`",
    ],
    [
      '`formId?`',
      '`string`',
      'Optional identifier injected on the tracker instance. Pass-through only - the hook does not read it',
    ],
  ]),
  '',
  'Passing `undefined` as the whole config **disables analytics**: the previous tracker (if any) is destroyed, the hook returns `null`, and no listeners stay attached. Handy for a feature-flagged rollout.',
  '',
  '**Minimal config**',
  '',
  `${FENCE}ts AnalyticsConfig.ts`,
  'const analyticsConfig: AnalyticsOptions = {',
  "  formId: 'signup',",
  "  exclude: ['taxId', 'dateOfBirth'],",
  '  handlers: {',
  "    onFieldComplete: (name, ms) => track('field_complete', { name, ms }),",
  "    onFormCompleted: (ms, submitCount) => track('form_done', { ms, submitCount }),",
  '  },',
  '}',
  FENCE,
].join('\n');

export const ANALYTICS_HANDLERS_SURFACE = [
  '`AnalyticsHandlers` every callback is optional. The tracker skips excluded field names before invoking anything below.',
  '',
  '**Field lifecycle**',
  '',
  buildMethodsTable([
    [
      '`onFieldFocus?`',
      '`(name) => void`',
      'Fires when a tracked field gains focus. Records the focus timestamp (used later for `durationMs`). Does **not** fire for excluded fields',
    ],
    [
      '`onFieldComplete?`',
      '`(name, durationMs) => void`',
      'Fires on blur **only when the blurred value is non-empty**. `durationMs` = elapsed time between matching focus and this blur. Tracker then forgets the focus timestamp',
    ],
    [
      '`onFieldAbandoned?`',
      '`(name, partialValue) => void`',
      'Fires on blur when the value is **empty** after focus. Mutually exclusive with `onFieldComplete` for a given focus/blur pair',
    ],
    [
      '`onFieldChange?`',
      '`(name, changeCount) => void`',
      'Fires on every change. `changeCount` is a per-field counter to detect "hesitant" fields. **No field value is ever passed** (privacy)',
    ],
  ]),
  '',
  '**Field validation**',
  '',
  buildMethodsTable([
    [
      '`onFieldError?`',
      '`(name, error) => void`',
      'Fires when a field enters an error state **and** the message differs from the previous one (dedup)',
    ],
    [
      '`onFieldErrorFixed?`',
      '`(name) => void`',
      'Fires exactly once when a previously-errored field becomes valid again',
    ],
  ]),
  '',
  '**Form lifecycle**',
  '',
  buildMethodsTable([
    [
      '`onFormAbandoned?`',
      '`(completedPercent, lastField, values) => void`',
      'Fires **at most once per tracker** when the user leaves while partially filled (`0 < completedPercent < 100`). `values` is a filtered snapshot. Triggered by `pagehide` / `beforeunload` / `visibilitychange` on web, `AppState` transitions on native',
    ],
    [
      '`onFormCompleted?`',
      '`(durationMs, submitCount, fieldCount) => void`',
      'Fires once on successful submission. After this, the tracker is destroyed and no further events can be emitted',
    ],
    [
      '`onFormLevelError?`',
      '`(errors, submitCount) => void`',
      'Fires on every failed submit attempt. `errors` has excluded fields stripped out',
    ],
  ]),
  '',
  '**Example - wiring every event to a single tracker**',
  '',
  `${FENCE}ts handlers.ts`,
  'const handlers: AnalyticsHandlers = {',
  "  onFieldFocus: (name) => track('field_focus', { name }),",
  "  onFieldComplete: (name, ms) => track('field_complete', { name, ms }),",
  "  onFieldAbandoned: (name) => track('field_abandoned', { name }),",
  "  onFieldChange: (name, count) => track('field_change', { name, count }),",
  "  onFieldError: (name, error) => track('field_error', { name, error }),",
  "  onFieldErrorFixed: (name) => track('field_error_fixed', { name }),",
  '  onFormAbandoned: (pct, lastField, values) =>',
  "    track('form_abandoned', { pct, lastField, fieldCount: Object.keys(values).length }),",
  '  onFormCompleted: (ms, submitCount, fieldCount) =>',
  "    track('form_done', { ms, submitCount, fieldCount }),",
  "  onFormLevelError: (errors, submitCount) => track('form_error', { errors, submitCount }),",
  '}',
  FENCE,
].join('\n');

export const ANALYTICS_TRACKER_SURFACE = [
  '`useFormBridgeAnalytics(opts, getValues)` returns a `FormBridgeAnalyticsTracker | null`:',
  '',
  '- Returns `null` when `opts` is `undefined` (analytics disabled).',
  '- Otherwise returns the live tracker instance so you can drive it imperatively from code that does not live inside `useFormBridge()` - useful when wiring a third-party field component that needs to notify the tracker manually.',
  '',
  '**When you pass `analytics` directly to `useFormBridge(schema, { analytics })`, you never touch this instance - the core wires every handler for you.** The surface below only matters if you call the standalone hook as an escape hatch.',
  '',
  '**Core imperative methods**',
  '',
  buildMethodsTable([
    [
      '`setValuesGetter`',
      '`(getter: () => Record<string, unknown>) => void`',
      'Replaces the function the tracker calls to get latest values (used before `onFormAbandoned`). The hook re-binds this on every render to a ref-backed getter',
    ],
    [
      '`attachLifecycleTracking`',
      '`() => void`',
      'Registers platform listeners (`pagehide` / `beforeunload` / `visibilitychange` on web, `AppState.change` on native). Idempotent',
    ],
    [
      '`destroy`',
      '`() => void`',
      'Removes every listener and marks the tracker detached. Called automatically on unmount and implicitly inside `onFormSubmitSuccess()`',
    ],
  ]),
  '',
  '**Field events - call from a custom field integration**',
  '',
  buildMethodsTable([
    [
      '`onFieldFocus`',
      '`(name) => void`',
      'Records the focus timestamp and fires `handlers.onFieldFocus`',
    ],
    [
      '`onFieldBlur`',
      '`(name, value) => void`',
      'Computes duration and fires `onFieldComplete` or `onFieldAbandoned` depending on emptiness',
    ],
    [
      '`onFieldChange`',
      '`(name) => void`',
      'Bumps per-field change counter and fires `handlers.onFieldChange`',
    ],
    [
      '`onFieldError`',
      '`(name, error) => void`',
      'Fires `handlers.onFieldError` only when the message differs from the previous one (dedup)',
    ],
    [
      '`onFieldErrorFixed`',
      '`(name) => void`',
      'Fires `handlers.onFieldErrorFixed` only if the field had a recorded error',
    ],
  ]),
  '',
  '**Form events**',
  '',
  buildMethodsTable([
    [
      '`onFormSubmitError`',
      '`(errors, submitCount) => void`',
      'Filters excluded keys out of `errors` and fires `handlers.onFormLevelError`',
    ],
    [
      '`onFormSubmitSuccess`',
      '`(submitCount, fieldCount) => void`',
      'Fires `handlers.onFormCompleted` with total duration since tracker start, then auto-destroys the tracker',
    ],
  ]),
  '',
  '**Completion helpers**',
  '',
  buildMethodsTable([
    [
      '`computeCompletion`',
      '`(values) => number`',
      'Returns rounded integer percentage of non-empty, non-excluded fields. Suitable for progress bars',
    ],
    [
      '`reportAbandonmentIfNeeded`',
      '`() => void`',
      'Same logic as lifecycle listeners: if partially filled and not yet reported, fires `handlers.onFormAbandoned`. Fires **at most once per tracker**',
    ],
  ]),
  '',
  '**Example - driving the tracker manually from a third-party field**',
  '',
  `${FENCE}tsx CustomFieldWithAnalytics.tsx`,
  'const analytics = useFormBridgeAnalytics(',
  "  { formId: 'signup', handlers: myHandlers },",
  '  () => state.values,',
  ')',
  '',
  'return (',
  '  <ThirdPartySignaturePad',
  "    onFocus={() => analytics?.onFieldFocus('signature')}",
  "    onBlur={(value) => analytics?.onFieldBlur('signature', value)}",
  "    onChange={() => analytics?.onFieldChange('signature')}",
  '  />',
  ')',
  FENCE,
].join('\n');

export const ASYNC_OPTIONS_CONFIG_SURFACE = [
  'Complete `AsyncOptionsConfig<TDeps>` surface:',
  '',
  buildMethodsTable([
    [
      '`key?`',
      '`string`',
      "Cache namespace. Default `'default'`. Combined with trimmed search + deps fingerprint to form `<key>::<search>::<depsFingerprint>`. **Process-wide** module-level cache. Pick a distinct key per resource",
    ],
    [
      '`fetch`',
      '`(context) => Promise<SelectOption[]>`',
      '**Required** async fetcher. Must return `SelectOption[]` (`{ label, value, ...extras }`). Non-arrays coerced to `[]`. Throwing sets `error` and (unless `preserveOnError: false`) keeps the previous options',
    ],
    [
      '`cacheTtl?`',
      '`number`',
      'Cache lifetime in ms. Default `60_000` (1 min). `0` = no expiration (useful for static lookups)',
    ],
    [
      '`debounce?`',
      '`number`',
      'Debounce in ms applied to **non-empty** search terms. Default `300`. Empty search always fires with 0 ms delay',
    ],
    [
      '`minChars?`',
      '`number`',
      'Minimum non-empty search length before a fetch fires. Default `0`. Below the threshold, options snap back to `initialOptions`',
    ],
    [
      '`dependsOn?`',
      '`readonly (keyof TDeps)[]`',
      'Ordered list of keys from `depValues` that matter. Drives: filtered `deps` in `fetch()`, cache key composition, and refetch on change',
    ],
    [
      '`initialOptions?`',
      '`SelectOption[]`',
      'Options shown before first fetch, when search < `minChars`, and (when `preserveOnError: false`) after an error. Default `[]`',
    ],
    [
      '`fetchOnMount?`',
      '`boolean`',
      'Whether to issue the initial fetch on mount with empty search. Default `true`. Set `false` for classic type-to-search UX',
    ],
    [
      '`keepPreviousOptions?`',
      '`boolean`',
      'Keep displayed options on screen while a new fetch is in flight. Default `true` (avoids empty flash on keystroke)',
    ],
    [
      '`preserveOnError?`',
      '`boolean`',
      'Keep last successful options visible when a fetch throws. Default `true`. Set `false` to collapse back to `initialOptions`',
    ],
  ]),
  '',
  '**Minimal fetcher**',
  '',
  `${FENCE}tsx Minimal.tsx`,
  'const tags = useAsyncOptions({',
  "  key: 'tags',",
  '  fetch: async ({ search, signal }) => {',
  "    const res = await fetch('/api/tags?q=' + encodeURIComponent(search), { signal })",
  '    const data: { id: string; name: string }[] = await res.json()',
  '    return data.map((tag) => ({ value: tag.id, label: tag.name }))',
  '  },',
  '})',
  FENCE,
  '',
  '**Dependency-aware fetcher (city depends on country)**',
  '',
  `${FENCE}tsx CityDependsOnCountry.tsx`,
  'const cities = useAsyncOptions(',
  '  {',
  "    key: 'cities',",
  "    dependsOn: ['country'],",
  '    minChars: 2,',
  '    debounce: 250,',
  '    cacheTtl: 5 * 60_000,',
  '    fetchOnMount: false,',
  '    fetch: async ({ search, deps, signal }) => {',
  "      const url = '/api/cities?country=' + deps.country + '&q=' + encodeURIComponent(search)",
  '      const res = await fetch(url, { signal })',
  '      const data: { id: string; name: string }[] = await res.json()',
  '      return data.map((c) => ({ value: c.id, label: c.name }))',
  '    },',
  '  },',
  '  { country },',
  ')',
  FENCE,
].join('\n');

export const ASYNC_OPTIONS_FETCHER_SURFACE = [
  '`OptionsFetcherContext<TDeps>` - the single argument passed to your `fetch()` callback:',
  '',
  buildMethodsTable([
    [
      '`search`',
      '`string`',
      '**Trimmed** current search term. May be empty on initial load or after `clearSearch()`. Never re-trim',
    ],
    [
      '`deps`',
      '`TDeps`',
      'Snapshot of dependency values, **filtered** to the keys declared in `dependsOn`. Values may be `undefined`',
    ],
    [
      '`signal`',
      '`AbortSignal`',
      'Abort signal wired to the current request. Automatically aborted on new fetch or unmount. **Always forward it to `fetch()`**',
    ],
  ]),
  '',
  '**Abort handling**',
  '',
  `${FENCE}ts SafeFetcher.ts`,
  'fetch: async ({ search, deps, signal }) => {',
  "  const res = await fetch('/api/users?q=' + encodeURIComponent(search), { signal })",
  '  // fetch() rejects with AbortError when signal is aborted - the hook',
  '  // detects it and quietly drops the result, so no try/catch needed here.',
  '  if (!res.ok) {',
  "    throw new Error('Failed to load users (HTTP ' + res.status + ')')",
  '  }',
  '  return (await res.json()).map((u) => ({ value: u.id, label: u.name }))',
  '},',
  FENCE,
].join('\n');

export const ASYNC_OPTIONS_RETURN_SURFACE = [
  'Complete `UseAsyncOptionsReturn` surface:',
  '',
  buildMethodsTable([
    [
      '`options`',
      '`SelectOption[]`',
      'Currently-displayed list. Starts as `initialOptions`, replaced on successful fetch, held on error unless `preserveOnError: false`',
    ],
    [
      '`loading`',
      '`boolean`',
      '`true` between issuing a fetch and receiving its response. Stays `false` for cache hits',
    ],
    [
      '`error`',
      '`string \\| null`',
      "`err.message` from most recent throw, or `'Failed to load options.'` for non-`Error` throws. Aborted requests do not set this",
    ],
    [
      '`search`',
      '`string`',
      'Raw search term (not trimmed). Bind to your input `value` prop',
    ],
    [
      '`setSearch`',
      '`(next: string) => void`',
      'Updates `search` and schedules a debounced fetch. Call from `onChange` / `onChangeText`',
    ],
    [
      '`clearSearch`',
      '`() => void`',
      "Shorthand for `setSearch('')`. Triggers immediate (non-debounced) refetch",
    ],
    [
      '`refresh`',
      '`() => void`',
      'Deletes the current cache entry (`key + search + deps`) and forces a new fetch. Only invalidates **this exact cache slot**',
    ],
  ]),
  '',
  '**Typical wiring**',
  '',
  `${FENCE}tsx UseAsyncOptionsReturn.tsx`,
  'const users = useAsyncOptions({',
  "  key: 'users',",
  '  minChars: 2,',
  '  fetchOnMount: false,',
  '  fetch: fetchUsers,',
  '})',
  '',
  'return (',
  '  <div>',
  '    <input',
  '      value={users.search}',
  '      onChange={(e) => users.setSearch(e.target.value)}',
  '      placeholder="Search users…"',
  '    />',
  '',
  "    {users.search && <button type='button' onClick={users.clearSearch}>Clear</button>}",
  "    <button type='button' onClick={users.refresh}>Refresh</button>",
  '',
  '    {users.loading && <Spinner />}',
  "    {users.error && <p role='alert'>{users.error}</p>}",
  '',
  '    <ul>',
  '      {users.options.map((opt) => (',
  '        <li key={opt.value}>{opt.label}</li>',
  '      ))}',
  '    </ul>',
  '  </div>',
  ')',
  FENCE,
].join('\n');

export const DYNAMIC_JSON_SURFACE = [
  'Supported JSON form definition surface:',
  '',
  buildMethodsTable([
    [
      '`JsonFormDefinition`',
      '`{ id?, title?, submitLabel?, fields }`',
      'Root JSON structure consumed by the parser',
    ],
    [
      '`JsonFieldType`',
      '`text \\| email \\| password \\| number \\| tel \\| url \\| textarea \\| checkbox \\| switch \\| select \\| radio \\| date \\| otp \\| hidden`',
      'Accepted field types',
    ],
    [
      '`JsonFieldDescriptor`',
      '`{ name, type, label, placeholder?, hint?, defaultValue?, required?, min?, max?, pattern?, patternMsg?, options?, otpLength?, disabled?, order?, showWhen?, validate? }`',
      'Per-field descriptor shape',
    ],
    ['`showWhen`', '`{ field, value } \\| { field, notValue }`', 'Visibility rule'],
    [
      '`validate` entries',
      '`required \\| min \\| max \\| pattern \\| email \\| url`',
      'Typed rule list',
    ],
    [
      '`custom`',
      '-',
      'Exists in the JSON rule surface today, but the built-in parser does not execute arbitrary custom JSON validators yet',
    ],
  ]),
].join('\n');

export const DYNAMIC_OPTIONS_SURFACE = [
  'Complete `useDynamicFormBridge()` options surface:',
  '',
  buildMethodsTable([
    [
      '1st argument',
      '`JsonFormDefinition \\| () => Promise<JsonFormDefinition>`',
      'Static definition or async loader',
    ],
    ['2nd argument', '`UseFormBridgeOptions`', 'All normal `useFormBridge()` options'],
    [
      '`defaultValues?`',
      '`Record<string, unknown>`',
      'Injected after parsing the dynamic schema',
    ],
  ]),
].join('\n');

export const DYNAMIC_RETURN_SURFACE = [
  'Complete `useDynamicFormBridge()` return surface:',
  '',
  buildMethodsTable([
    [
      '`form`',
      '`UseFormBridgeReturn \\| null`',
      'Standard `useFormBridge()` return, or `null` while unavailable',
    ],
    ['`fieldOrder`', '`string[]`', 'Parser-declared render order'],
    [
      '`meta`',
      '`{ id?, title?, submitLabel? }`',
      'Metadata extracted from the JSON definition',
    ],
    [
      '`isVisible`',
      '`(name) => boolean`',
      'Evaluates dynamic `showWhen` rules against live values',
    ],
    ['`isLoading`', '`boolean`', '`true` while the async loader resolves'],
    ['`loadError`', '`string \\| null`', 'Error message if the loader rejected'],
  ]),
].join('\n');

export const WIZARD_STEP_SURFACE = [
  'Each entry in the `steps` array is a `WizardStep` with the following shape:',
  '',
  buildMethodsTable([
    [
      '`id`',
      '`string`',
      'Stable identifier - used for URL routing, persistence keys, `goToStep()`, and `WizardStepChangeEvent.step.id`. Keep it URL-safe',
    ],
    [
      '`label`',
      '`string`',
      'Human-readable title rendered in step indicators, breadcrumbs, and accessible names. Safe to translate',
    ],
    [
      '`schema`',
      '`FormSchema`',
      'FormBridge schema owned by this step. Use `{} satisfies FormSchema` for pure review/confirmation screens',
    ],
    [
      '`optional?`',
      '`boolean`',
      'Marks the step as skippable. Required to enable `wizard.skip()`. Does not exclude the step from validation when the user stays on it',
    ],
    [
      '`condition?`',
      '`(allValues) => boolean`',
      'Dynamic visibility rule evaluated against `wizard.allValues` on every render. When `false`, the step is removed from `visibleSteps`',
    ],
    [
      '`formOptions?`',
      '`Partial<UseFormBridgeOptions<S, TPlatform>>`',
      'Per-step overrides forwarded to the underlying `useFormBridge()` - `validateOn`, `revalidateOn`, `validatorResolver`, `analytics`, `globalDefaults`, `persist`, `initialValues` (merged with accumulated wizard values)',
    ],
  ]),
  '',
  '**Example**',
  '',
  `${FENCE}ts WizardSteps.ts`,
  'const steps: WizardStep[] = [',
  "  { id: 'account', label: 'Account', schema: accountSchema },",
  '  {',
  "    id: 'company',",
  "    label: 'Company details',",
  '    schema: companySchema,',
  '    optional: true,',
  "    condition: (v) => v.accountType === 'business',",
  "    formOptions: { validateOn: 'onBlur' },",
  '  },',
  "  { id: 'review', label: 'Review', schema: {} satisfies FormSchema },",
  ']',
  FENCE,
].join('\n');

export const WIZARD_OPTIONS_SURFACE = [
  'Complete `useFormBridgeWizard()` options surface:',
  '',
  buildMethodsTable([
    [
      '`onSubmit`',
      '`(allValues) => void \\| Promise<void>`',
      '**Required** - final submit handler called once after the last step passes validation. Receives merged `allValues`. Throwing routes to `onSubmitError`; resolving flips `isSubmitSuccess` and clears every persisted draft',
    ],
    [
      '`onSubmitError?`',
      '`(error) => string`',
      'Maps a thrown error to the `submitError` string. Defaults to `"An error occurred. Please try again."`',
    ],
    [
      '`persist?`',
      '`Omit<PersistOptions, "key"> & { key: string }`',
      'Enables auto-saving. Persists both the **wizard snapshot** (current step + completed set + merged values) and **per-step drafts** under `<key>:<stepId>`. Supports `storage`, `ttl`, `exclude`, `debounce`, `onRestore`, `onSaveError`, `version`',
    ],
    [
      '`validateOn?`',
      "`'onBlur' \\| 'onChange' \\| 'onTouched' \\| 'onSubmit'`",
      "Default validation trigger for every step. Default `'onTouched'`. Overridden per step via `formOptions.validateOn`",
    ],
    [
      '`revalidateOn?`',
      "`'onBlur' \\| 'onChange' \\| 'onTouched' \\| 'onSubmit'`",
      "Default re-validation trigger. Default `'onChange'`. Overridden per step via `formOptions.revalidateOn`",
    ],
    [
      '`stepId?`',
      '`string`',
      '**Controlled** active step id. When provided, the wizard reads the active step from this prop and never self-advances. Pair with `onStepChange` to drive navigation from a router',
    ],
    [
      '`initialStepId?`',
      '`string`',
      '**Uncontrolled** starting step id. Ignored when `stepId` is controlled or when a persisted snapshot restores a step. Defaults to `steps[0].id`',
    ],
    [
      '`onStepChange?`',
      '`(event: WizardStepChangeEvent) => void`',
      'Fires every time the active step changes. Navigation bridge + analytics/telemetry hook',
    ],
  ]),
  '',
  '**Uncontrolled (default): single-page wizard**',
  '',
  `${FENCE}tsx SignupWizard.tsx`,
  'const wizard = useFormBridgeWizard(steps, {',
  "  persist: { key: 'signup-wizard', storage: 'local' },",
  '  onSubmit: async (allValues) => {',
  '    await api.signup(allValues)',
  '  },',
  "  onSubmitError: (err) => (err instanceof ApiError ? err.message : 'Network error.'),",
  '})',
  FENCE,
  '',
  '**Controlled: route-per-step on the web**',
  '',
  `${FENCE}tsx SignupRoute.tsx`,
  'const { stepId } = useParams()',
  'const navigate = useNavigate()',
  '',
  'const wizard = useFormBridgeWizard(steps, {',
  '  stepId,',
  "  initialStepId: 'account',",
  "  persist: { key: 'signup-wizard' },",
  "  onStepChange: ({ step }) => navigate('/signup/' + step.id),",
  '  onSubmit: api.signup,',
  '})',
  FENCE,
].join('\n');

export const WIZARD_EVENT_SURFACE = [
  '`WizardStepChangeEvent` payload passed to `onStepChange`:',
  '',
  buildMethodsTable([
    [
      '`step`',
      '`WizardStep`',
      'The step the wizard is navigating **to** (always a member of `visibleSteps`)',
    ],
    [
      '`index`',
      '`number`',
      '0-based index of `step` inside `visibleSteps`. Use for "Step N of M" labels',
    ],
    [
      '`previousStep`',
      '`WizardStep \\| null`',
      'The step the user is leaving. `null` only for initial `"restore"` / `"fallback"` events',
    ],
    [
      '`previousIndex`',
      '`number`',
      'Index of `previousStep`, or `-1` when `previousStep` is `null`',
    ],
    [
      '`reason`',
      "`'next' \\| 'prev' \\| 'goTo' \\| 'goToStep' \\| 'skip' \\| 'restore' \\| 'fallback'`",
      'What triggered the transition (see reason table below)',
    ],
  ]),
  '',
  '**`reason` values**',
  '',
  '| Value | Source |',
  '| --- | --- |',
  "| `'next'` / `'prev'` | `wizard.next()` or `wizard.prev()` (standard Back / Continue flow) |",
  "| `'goTo'` / `'goToStep'` | `wizard.goTo(index)` or `wizard.goToStep(id)` (step indicator click, resume flow) |",
  "| `'skip'` | `wizard.skip()` on an `optional` step |",
  "| `'restore'` | Post-hydration resume to the step saved in persistent storage |",
  "| `'fallback'` | Controlled `stepId` did not match any visible step - wizard fell back to the first visible one (tell your router to replace the URL) |",
  '',
  '**Example**',
  '',
  `${FENCE}ts onStepChange.ts`,
  'onStepChange: ({ step, previousStep, reason }) => {',
  "  if (reason === 'fallback') {",
  "    navigate('/signup/' + step.id, { replace: true })",
  '    return',
  '  }',
  '',
  "  if (reason === 'next' || reason === 'prev') {",
  "    analytics.track('wizard_step_change', {",
  '      from: previousStep?.id,',
  '      to: step.id,',
  '    })',
  '  }',
  '',
  "  navigate('/signup/' + step.id)",
  '},',
  FENCE,
].join('\n');

export const WIZARD_RETURN_SURFACE = [
  'Complete `useFormBridgeWizard()` return surface:',
  '',
  '**Active step**',
  '',
  buildMethodsTable([
    [
      '`currentStep`',
      '`UseFormBridgeReturn<FormSchema, TPlatform>`',
      'Full `useFormBridge()` return value for the active step. Destructure `{ Form, fields, state, getValues, validate, … }`. During hydration or empty visibility, points to an empty-schema placeholder so hooks stay stable',
    ],
    [
      '`step`',
      '`WizardStep \\| null`',
      'Active step descriptor, or `null` during `isHydrating` / empty `visibleSteps`. Always guard `if (!wizard.step) return null`',
    ],
    [
      '`currentStepId`',
      '`string \\| null`',
      'Shorthand for `step?.id`. Safe to use as React `key`',
    ],
    [
      '`currentStepIndex`',
      '`number`',
      '0-based index inside `visibleSteps`, or `-1` when `step` is `null`',
    ],
  ]),
  '',
  '**Step catalog**',
  '',
  buildMethodsTable([
    [
      '`totalSteps`',
      '`number`',
      '`visibleSteps.length`. Use for "Step {currentStepIndex + 1} / {totalSteps}"',
    ],
    [
      '`allSteps`',
      '`WizardStep[]`',
      'Raw array you passed in, including steps hidden by `condition`',
    ],
    [
      '`visibleSteps`',
      '`WizardStep[]`',
      "`allSteps` filtered through each step's `condition`. What every index-based API operates on",
    ],
    [
      '`isFirstStep`',
      '`boolean`',
      'No visible step before the active one. Disable your "Back" button',
    ],
    [
      '`isLastStep`',
      '`boolean`',
      'No visible step after the active one. Flip your primary button label to "Finish / Submit"',
    ],
  ]),
  '',
  '**Progress**',
  '',
  buildMethodsTable([
    [
      '`progress`',
      '`number`',
      'Rounded percentage `Math.round(completedSteps.size / visibleSteps.length * 100)`',
    ],
    [
      '`completedSteps`',
      '`Set<string>`',
      'Ids of steps whose validation has passed at least once. Not affected by `prev()` / `goTo()`',
    ],
    [
      '`allValues`',
      '`Record<string, unknown>`',
      'Merged values across the whole wizard: `{ ...accumulatedValues, ...currentStep.state.values }`. Always reflects the live values the user just typed',
    ],
  ]),
  '',
  '**Navigation**',
  '',
  buildMethodsTable([
    [
      '`next`',
      '`() => Promise<boolean>`',
      'Validates the active step, saves its draft, merges values, marks complete, advances. Resolves `false` on validation failure. **Does not call `onSubmit` on the last step** - use `submit()`',
    ],
    [
      '`prev`',
      '`() => void`',
      'Synchronously moves back one visible step. Never validates. No-op on the first step',
    ],
    [
      '`goTo`',
      '`(index, skipValidation?) => Promise<boolean>`',
      'Jumps to `visibleSteps[index]`. Forward jumps validate the current step unless `skipValidation` is `true`; backward jumps always skip',
    ],
    [
      '`goToStep`',
      '`(stepId, skipValidation?) => Promise<boolean>`',
      'Same semantics as `goTo`, addressed by step id. Prefer this when driven by a router',
    ],
    [
      '`skip`',
      '`() => boolean`',
      'Advances one step only when the current step has `optional: true` and is not the last. Does not validate',
    ],
  ]),
  '',
  '**Final submission**',
  '',
  buildMethodsTable([
    [
      '`submit`',
      '`() => Promise<void>`',
      'Validates, merges, calls `options.onSubmit(allValues)`. On success flips `isSubmitSuccess`, clears every persisted draft. Errors route through `onSubmitError`',
    ],
    [
      '`isSubmitting`',
      '`boolean`',
      '`true` between entering `submit()` and resolution. Drive button spinners',
    ],
    [
      '`isSubmitSuccess`',
      '`boolean`',
      '`true` once `onSubmit` has resolved. Stays `true` until unmount - use to render the success screen',
    ],
    [
      '`submitError`',
      '`string \\| null`',
      'Last error message from `onSubmitError` (or default fallback). Cleared on next `submit()`',
    ],
  ]),
  '',
  '**Hydration**',
  '',
  buildMethodsTable([
    [
      '`isHydrating`',
      '`boolean`',
      'First render while reading the saved snapshot from storage. During hydration `step` is `null`. Gate your render with `if (wizard.isHydrating) return <Spinner />`',
    ],
  ]),
  '',
  '**Example - rendering a wizard body**',
  '',
  `${FENCE}tsx WizardBody.tsx`,
  'if (wizard.isHydrating || !wizard.step) return <Spinner />',
  '',
  'const { Form, fields } = wizard.currentStep',
  '',
  'return (',
  '  <>',
  '    <progress value={wizard.progress} max={100} />',
  '    <p>Step {wizard.currentStepIndex + 1} / {wizard.totalSteps}</p>',
  '',
  '    <Form onSubmit={wizard.isLastStep ? wizard.submit : wizard.next}>',
  "      {'email' in fields && <fields.email />}",
  "      {'password' in fields && <fields.password />}",
  "      {'firstName' in fields && <fields.firstName />}",
  '',
  '      <div>',
  '        {!wizard.isFirstStep && (',
  "          <button type='button' onClick={wizard.prev}>Back</button>",
  '        )}',
  '        {wizard.step.optional && !wizard.isLastStep && (',
  "          <button type='button' onClick={wizard.skip}>Skip</button>",
  '        )}',
  '        <Form.Submit>',
  "          {wizard.isSubmitting ? 'Saving…' : wizard.isLastStep ? 'Finish' : 'Next'}",
  '        </Form.Submit>',
  '      </div>',
  '    </Form>',
  '',
  '    {wizard.submitError && <p role="alert">{wizard.submitError}</p>}',
  '  </>',
  ')',
  FENCE,
].join('\n');

export const READONLY_OPTIONS_SURFACE = [
  'Complete `useFormBridgeReadonly()` options surface:',
  '',
  buildMethodsTable([
    [
      '`mode`',
      "`'readonly' \\| 'diff'`",
      "`'readonly'` renders plain read-only rows. `'diff'` highlights fields whose `values[name]` differs from `originalValues[name]` and exposes the before/after pair",
    ],
    [
      '`values`',
      '`SchemaValues<S>`',
      'Current values to render - shape comes directly from your schema, so every key is typed',
    ],
    [
      '`originalValues?`',
      '`Partial<SchemaValues<S>>`',
      'Baseline values used in `diff` mode to compute `changed` / `changedFields`. Ignored in `readonly` mode. Fields absent from this map are never flagged as changed',
    ],
    [
      '`formatters?`',
      '`Partial<Record<keyof S, (value) => string>>`',
      'Per-field display formatter. Overrides the built-in formatting (dates → `toLocaleDateString()`, booleans → `✓ Yes / ✗ No`, passwords → `••••••••`, select/radio → matching option label, empty → `-`)',
    ],
  ]),
].join('\n');

export const READONLY_FIELD_STATE_SURFACE = [
  'Each `fields[name]` entry (`FieldReadonlyState`) contains:',
  '',
  buildMethodsTable([
    ['`name`', '`string`', 'The schema key'],
    [
      '`label`',
      '`string`',
      'Same label as in the editing form (`descriptor._label ?? ""`)',
    ],
    ['`value`', '`unknown`', 'Raw value from `options.values`'],
    [
      '`display`',
      '`string`',
      'Formatted, ready-to-render string (custom formatter wins over the built-in one)',
    ],
    [
      '`changed`',
      '`boolean`',
      '`true` only in `diff` mode when the field has an entry in `originalValues` and it differs from `value` (via `Object.is`)',
    ],
    [
      '`original?`',
      '`unknown`',
      'Raw `originalValues[name]` - present only when `changed` is `true`',
    ],
    [
      '`originalDisplay?`',
      '`string`',
      'Formatted version of `original` - useful for rendering a "before" column. Present only when `changed` is `true`',
    ],
  ]),
].join('\n');

export const READONLY_FIELD_PROPS_SURFACE = [
  'Each generated `ReadonlyFields.name(props?)` component accepts:',
  '',
  buildMethodsTable([
    ['`label?`', '`string`', 'Per-render label override. Falls back to the schema label'],
    [
      '`format?`',
      '`(value) => string`',
      'One-off formatter for this render only. Takes precedence over `options.formatters[name]` and the built-in formatting',
    ],
    [
      '`style?`',
      '`object`',
      "Cross-platform inline style forwarded to the readonly renderer's root element",
    ],
    [
      '`className?`',
      '`string`',
      'Forwarded className for the web readonly renderer (ignored on native)',
    ],
    [
      '`showDiff?`',
      '`boolean`',
      "Force the before/after UI on or off for this render. Defaults to `options.mode === 'diff'`",
    ],
  ]),
].join('\n');

export const READONLY_RETURN_SURFACE = [
  'Complete `useFormBridgeReadonly()` return surface:',
  '',
  buildMethodsTable([
    [
      '`fields`',
      '`Record<keyof S, FieldReadonlyState>`',
      'Computed readonly state for every visible (non-`_hidden`) field - see the field state table above',
    ],
    [
      '`fieldNames`',
      '`Array<keyof S>`',
      'Visible field names in schema iteration order - use this to render rows deterministically instead of `Object.keys(fields)`',
    ],
    [
      '`changedFields`',
      '`Array<keyof S>`',
      'Subset of `fieldNames` whose `changed` flag is `true`. Always empty in `readonly` mode',
    ],
    [
      '`hasChanges`',
      '`boolean`',
      'Shorthand for `changedFields.length > 0`. Handy for "Nothing changed" empty states',
    ],
    [
      '`ReadonlyFields`',
      '`{ [K in keyof S]: (props?) => ReactElement \\| null }`',
      'One ready-to-render component per schema key, reading from `fields[name]`',
    ],
  ]),
].join('\n');
