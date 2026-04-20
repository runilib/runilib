import type { LibraryDoc } from './../../../types/index';
import { buildMethodsTable } from '../constants';

const FIELD_LABEL_PROPS_TABLE = buildMethodsTable([
  [
    '`name`',
    '`keyof Schema`',
    '**Required.** Typed field name. Autocompletes from the schema keys so renaming a field surfaces a type error at the usage site.',
  ],
  [
    '`children`',
    '`ReactNode`',
    'Optional label override. When omitted, the component pulls `label(...)` straight from the schema descriptor - keep the text in one place instead of duplicating it in JSX.',
  ],
  [
    '`render`',
    '`(ctx) => ReactNode`',
    'Custom render function. Receives `{ name, label, required, htmlFor }` so you can build accessible labels with tooltips, icons, help popovers, etc.',
  ],
  [
    '`renderRequiredMark`',
    '`() => ReactNode`',
    'Replaces the default red asterisk. Useful to swap for a localized `(required)` string or a design-system badge.',
  ],
  [
    '`htmlFor`',
    '`string` *(web only)*',
    'Explicit `for` attribute. Defaults to the field `name`, which already matches the input id emitted by the generated fields.',
  ],
  [
    '`className`',
    '`string` *(web only)*',
    'Class applied to the default `<label>` element.',
  ],
  [
    '`style`',
    '`CSSProperties | StyleProp<TextStyle>`',
    'Inline style - `CSSProperties` on web, `StyleProp<TextStyle>` on native.',
  ],
  [
    '`render(...)` for extra native attrs',
    '`(ctx) => ReactNode`',
    'If you need custom DOM/native attributes beyond the focused built-in surface, render the label element yourself via `render` and attach whatever your platform needs there.',
  ],
]);

export const fieldLabelSection: LibraryDoc['sections'][number] = {
  id: 'fb-field-label',
  title: 'FieldLabel component',
  content: `Standalone label component returned by \`useFormBridge\`. Renders a field's label and required mark, reading both directly from the schema descriptor.

- Label text comes from \`field.x('Label text')\` in the schema - the component stays in sync automatically, so you don't duplicate strings in JSX
- Required mark is driven by \`.required()\` on the builder. Flip the schema and the asterisk appears/disappears everywhere
- \`htmlFor\` defaults to the field \`name\`, which matches the id emitted by the generated fields - click the label, the input focuses, accessibility wired for free
- Use it when you render inputs through \`form.fieldController(name)\` or when your design-system row layout keeps label / input / error as separate slots
- Unlike \`Form\` and \`Form.Submit\`, \`FieldLabel\` keeps a deliberately focused API today instead of mirroring every native label attribute; if you need total control over the wrapper element, use \`render\``,
  codeTabs: [
    {
      filename: 'FieldLabel.web.tsx',
      lang: 'tsx',
      code: `const schema = {
  email: field.email('Email address').required(),
}

const form = useFormBridge(schema)

<form.Form onSubmit={save}>
  <div className="form-row">
    <form.FieldLabel name="email" />
    <input
      id="email"
      name="email"
      value={form.state.values.email}
      onChange={(e) => form.setFieldValue('email', e.target.value)}
      onBlur={() => form.setFieldTouched('email', true)}
    />
    <form.FieldError name="email" />
  </div>
  <form.Form.Submit>Save</form.Form.Submit>
</form.Form>`,
    },
    {
      filename: 'FieldLabel.override.tsx',
      lang: 'tsx',
      code: `// Override the schema label ad-hoc (same required-mark logic still applies)
<form.FieldLabel name="email">Work email</form.FieldLabel>

// Replace the required mark with a localized badge
<form.FieldLabel
  name="email"
  renderRequiredMark={() => <span className="badge">required</span>}
/>`,
    },
    {
      filename: 'FieldLabel.render.tsx',
      lang: 'tsx',
      code: `// Full control - build a label with an inline help tooltip
<form.FieldLabel
  name="taxId"
  render={({ label, required, htmlFor }) => (
    <label htmlFor={htmlFor} className="fancy-label">
      {label}
      {required && <span className="required">*</span>}
      <Tooltip content="Your VAT or national tax identifier">
        <InfoIcon />
      </Tooltip>
    </label>
  )}
/>`,
    },
  ],
  subsections: [
    {
      id: 'fb-field-label-why',
      title: 'Why it exists',
      content: `The generated \`<form.fields.email />\` component already renders its own label inline. \`<FieldLabel />\` exists for the cases where that isn't enough:

- **Custom layouts** - you render the input yourself via \`form.fieldController('email')\` and want a drop-in label slot without re-implementing the required-mark logic
- **Design-system rows** - your form grid keeps label / input / error in separate columns, and each slot is its own component
- **Single source of truth** - the label text lives once in the schema; flipping a field between optional and required automatically updates every place \`<FieldLabel />\` is mounted
- **Tooltips, icons, help popovers** - use \`render\` to wrap the label in richer UI without giving up the typed \`name\` binding or the required-mark automation`,
    },
    {
      id: 'fb-field-label-props',
      title: 'Props',
      content: `${FIELD_LABEL_PROPS_TABLE}`,
    },
    {
      id: 'fb-field-label-recipes',
      title: 'Recipes',
      content: `- **Schema-driven label** → just \`<form.FieldLabel name="email" />\`. The text comes from \`field.email('Email address')\` in the schema
- **Ad-hoc override** → pass children: \`<form.FieldLabel name="email">Work email</form.FieldLabel>\`
- **Localized required mark** → \`renderRequiredMark={() => <span>({t('required')})</span>}\`
- **Label with tooltip/help icon** → use the \`render\` prop to wrap the label in your design-system tooltip
- **Shared row component** → build a \`<FormRow name="email" />\` wrapper that internally mounts \`FieldLabel\`, \`fieldController\`, and \`FieldError\` - the typed \`name\` flows through all three`,
    },
  ],
};
