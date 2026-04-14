import type { LibraryDoc } from './../../../types/index';

const BASE_FIELD_METHOD_ROWS = [
  [
    '`defaultValue(value)`',
    '`value: field value`',
    'Keeps the builder default',
    'Overrides the initial value used when the form runtime is created.',
  ],
  [
    '`required(message?)`',
    '`message?: string`',
    "Field starts optional; default message is `'This field is required.'`",
    'Marks the field as required and optionally overrides the empty-state error message.',
  ],
  [
    '`optional()`',
    '`() => this`',
    'No-op if the field is already optional',
    'Marks the field as optional (removes the required constraint). Useful when extending a schema where the field was previously required',
  ],
  [
    '`label(text)`',
    '`text: string`',
    'Keeps the current label',
    'Overrides the display label stored in the descriptor.',
  ],
  [
    '`placeholder(text?)`',
    '`text?: string`',
    "Defaults to `''` when omitted",
    'Sets the placeholder text displayed inside the field when it is empty.',
  ],
  [
    '`hint(text)`',
    '`text: string`',
    'No hint by default',
    'Adds a helper/hint text displayed below the field to guide the user.',
  ],
  [
    '`disabled(value = true)`',
    '`value?: boolean`',
    'Field state defaults to `false`',
    'Disables (or re-enables) the field. A disabled field is rendered but not interactive.',
  ],
  [
    '`hidden(value = true)`',
    '`value?: boolean`',
    'Field state defaults to `false`',
    'Hides (or shows) the field. A hidden field is not rendered at all.',
  ],
  [
    '`debounce(ms)`',
    '`ms: number`',
    'Defaults to `300`',
    'Sets the debounce delay (in milliseconds) for value changes. Validation and side-effects are deferred until the user stops typing for the specified duration.',
  ],
  [
    '`validate(fn)`',
    '`fn: Validator<T>`',
    'No custom validators by default',
    'Appends a sync or async custom validator to the field.',
  ],
  [
    '`validateAsync(fn)`',
    '`fn: Validator<T>`',
    'No custom validators by default',
    'Alias for `validate()` when the intent is explicitly asynchronous. Useful for username availability checks, server-side uniqueness validation, promo code verification, and other async rules.',
  ],
  [
    '`transform(fn)`',
    '`fn: (value) => value`',
    'No transform by default',
    'Registers a transform function that is applied to the field value. before validation and submission (e.g. trimming whitespace, normalizing case).',
  ],
  [
    '`render(fn)`',
    '`fn: (props) => ReactNode`',
    'Uses the generated renderer',
    "Provides a custom render function to completely override the default field rendering. Use this when the built-in field components don't meet your UI needs.",
  ],
  [
    '`visibleWhen(fieldOrFn, value?)`',
    '`field name or predicate`',
    'No visibility conditions by default',
    "Makes the field conditionally visible based on another field's value. or a custom predicate function. - When a **string** is passed, the field is visible when the referenced field equals `value` (defaults to `true`). - When a **function** is passed, the field is visible when the predicate returns `true`. Multiple `visibleWhen*` calls are combined with AND logic (all must be satisfied).",
  ],
  [
    '`visibleAndRequiredWhen(fieldOrFn, value?)`',
    '`field name or predicate`',
    'No visibility or required conditions by default',
    'Combines a visibility rule and a required rule in one call.',
  ],
  [
    '`visibleWhenNot(field, value)`',
    '`field: string`',
    'No visibility conditions by default',
    'Makes the field visible when the referenced field does **not** equal the given value.',
  ],
  [
    '`visibleWhenTruthy(field)`',
    '`field: string`',
    'No visibility conditions by default',
    "Makes the field visible when the referenced field has a truthy value (any value that is not `false`, `0`, `''`, `null`, or `undefined`)",
  ],
  [
    '`visibleWhenFalsy(field)`',
    '`field: string`',
    'No visibility conditions by default',
    "Makes the field visible when the referenced field has a falsy value (`false`, `0`, `''`, `null`, or `undefined`)",
  ],
  [
    '`visibleWhenAny(pairs)`',
    '`Array<[field, value]>`',
    'No visibility conditions by default',
    'Adds OR-based visibility rules.',
  ],
  [
    '`requiredWhen(fieldOrFn, value?)`',
    '`field name or predicate`',
    'No conditional required rules by default',
    'Makes the field required only when the condition matches.',
  ],
  [
    '`requiredWhenAny(pairs)`',
    '`Array<[field, value]>`',
    'No conditional required rules by default',
    'Adds OR-based conditional required rules.',
  ],
  [
    '`disabledWhen(fieldOrFn, value?)`',
    '`field name or predicate`',
    'No conditional disabled rules by default',
    'Disables the field only when the condition matches.',
  ],
  [
    '`resetOnHide()`',
    '`() => this`',
    'Already the default hide behavior',
    'Resets the field back to its default value when it becomes hidden.',
  ],
  [
    '`keepOnHide()`',
    '`() => this`',
    'Overrides the default `reset` behavior',
    'Keeps the current value even when the field becomes hidden.',
  ],
  [
    '`clearOnHide()`',
    '`() => this`',
    'Overrides the default `reset` behavior',
    'Clears the value when the field becomes hidden.',
  ],
] as const;

const BASE_FIELD_METHODS_TABLE = [
  '| Method | Type | Default | Description |',
  '| --- | --- | --- | --- |',
  ...BASE_FIELD_METHOD_ROWS.map(
    ([method, type, defaultValue, description]) =>
      `| ${method} | ${type} | ${defaultValue} | ${description} |`,
  ),
].join('\n');

export const baseFieldBuilderSection: LibraryDoc['sections'][number] = {
  id: 'fb-base-field-builder',
  title: 'Base field builder',
  content: `Most field builders inherit from the same shared \`BaseFieldBuilder\` surface.

- This is where labels, placeholders, required state, custom validators, custom renderers, and conditional logic come from
- Builders such as \`field.text()\`, \`field.email()\`, \`field.password()\`, \`field.number()\`, \`field.select()\`, \`field.phone()\`, and \`field.custom()\` all expose this common base surface
- String-like builders then add extra string-specific methods on top of it, while \`field.file()\` is the main exception because it uses its own upload-focused builder
- There is no public \`field.base()\` factory today; this page documents the common methods that the other builders inherit`,
  codeTabs: [
    {
      filename: 'BaseFieldBuilder.web.tsx',
      lang: 'tsx',
      code: `const schema = {
  displayName: field.text('Display name')
    .defaultValue('Ava')
    .required('Choose a display name')
    .placeholder('@ava')
    .hint('Shown publicly')
    .debounce(250),

  companyEmail: field.email('Company email')
    .placeholder('ava@company.com')
    .visibleAndRequiredWhen('accountType', 'company'),

  internalNote: field.custom('')
    .label('Internal note')
    .hidden()
    .clearOnHide(),
}`,
    },
    {
      filename: 'BaseFieldBuilder.native.tsx',
      lang: 'tsx',
      code: `const schema = {
  fullName: field.text('Full name')
    .required()
    .hint('Used on receipts')
    .validate((value) => value.trim().length >= 2 ? null : 'Use at least 2 characters'),

  phone: field.phone('Phone')
    .required()
    .disabledWhen('archived'),

  deliveryNote: field.textarea('Delivery note')
    .visibleWhenTruthy('hasSpecialInstructions')
    .resetOnHide(),
}`,
    },
  ],
  subsections: [
    {
      id: 'fb-base-field-builder-inheritance',
      title: 'How inheritance works',
      content: `The inheritance tree is intentionally shallow:

- \`BaseFieldBuilder\` provides the shared contract for value defaults, validation hooks, rendering escape hatches, and conditional runtime rules
- \`StringFieldBuilder\` extends that base with string-specific methods such as \`min()\`, \`max()\`, \`pattern()\`, and \`trim()\`
- Specialized builders such as \`field.email()\` or \`field.password()\` then add their own narrow behavior on top
- \`field.custom(defaultValue)\` is the cleanest way to get just the base surface with no extra type-specific helpers`,
    },
    {
      id: 'fb-base-field-builder-methods',
      title: 'Common methods reference',
      content: `Every method below is inherited from \`BaseFieldBuilder\`.

${BASE_FIELD_METHODS_TABLE}`,
    },
    {
      id: 'fb-base-field-builder-note',
      title: 'Important exception',
      content: `\`field.file()\` does not inherit the full base builder surface.

- It keeps a few familiar helpers such as \`required()\`, \`hint()\`, \`disabled()\`, and \`hidden()\`
- It does **not** expose \`render()\`, \`transform()\`, or the conditional helpers from \`BaseFieldBuilder\`
- Treat it as a specialized upload builder rather than the generic starting point for every field`,
    },
  ],
};
