import type { LibraryDoc } from './../../../types/index';
import { buildMethodsTable } from '../constants';

const FIELD_ERROR_PROPS_TABLE = buildMethodsTable([
  [
    '`name`',
    '`keyof Schema`',
    '**Required.** Typed field name. Autocompletes from the schema keys, so renaming a field causes a type error at the usage site.',
  ],
  [
    '`render`',
    '`(ctx) => ReactNode`',
    'Custom render function. Only called when there *is* an error to show — no null checks needed inside. The context exposes `{ name, error }`.',
  ],
  [
    '`className`',
    '`string` *(web only)*',
    'Class applied to the default `<span role="alert">` wrapper.',
  ],
  [
    '`style`',
    '`CSSProperties | StyleProp<TextStyle>`',
    'Inline style — `CSSProperties` on web, `StyleProp<TextStyle>` on native. Merged on top of the default error color.',
  ],
  [
    '`render(...)` for extra native attrs',
    '`(ctx) => ReactNode`',
    'If you need custom DOM/native attributes beyond the focused built-in surface, render the error element yourself via `render` and attach the attributes there.',
  ],
]);

export const fieldErrorSection: LibraryDoc['sections'][number] = {
  id: 'fb-field-error',
  title: 'FieldError component',
  content: `Standalone error component returned by \`useFormBridge\`. Renders the validation error for a single field anywhere in the tree, with the same visibility rules the auto-rendered fields already follow.

- Returns \`null\` when there is nothing to show, so it's safe to mount unconditionally — no \`{error && ...}\` boilerplate at the call site
- Visibility follows the standard FormBridge rule: \`touched || submitCount > 0\`. The message stays hidden until the user has interacted with the field or tried to submit
- Fully typed: the \`name\` prop autocompletes from your schema keys, so renaming a field breaks the usage site at compile time instead of at runtime
- Use it when you render fields through \`form.fieldController(name)\` or a fully custom UI and want FormBridge to keep driving the error rendering
- Unlike \`Form\` and \`Form.Submit\`, \`FieldError\` keeps a focused API instead of exposing every native wrapper attribute; if you need full control over the alert element, use \`render\``,
  codeTabs: [
    {
      filename: 'FieldError.web.tsx',
      lang: 'tsx',
      code: `const schema = {
  email: field.email('Email').required(),
}

const form = useFormBridge(schema)

<form.Form onSubmit={save}>
  <input
    name="email"
    value={form.state.values.email}
    onChange={(e) => form.setFieldValue('email', e.target.value)}
    onBlur={() => form.setFieldTouched('email', true)}
  />
  <form.FieldError name="email" />
  <form.Form.Submit>Save</form.Form.Submit>
</form.Form>`,
    },
    {
      filename: 'FieldError.custom.tsx',
      lang: 'tsx',
      code: `// Custom error UI — inline icon + text
<form.FieldError
  name="email"
  render={({ error }) => (
    <div className="form-error">
      <AlertIcon /> {error}
    </div>
  )}
/>`,
    },
    {
      filename: 'FieldError.native.tsx',
      lang: 'tsx',
      code: `<form.FieldError
  name="email"
  style={{ color: '#dc2626', marginTop: 4 }}
/>`,
    },
  ],
  subsections: [
    {
      id: 'fb-field-error-why',
      title: 'Why it exists',
      content: `The auto-rendered \`<form.fields.email />\` component already shows its own error inline. \`<FieldError />\` exists for the cases where that isn't enough:

- **Custom layouts** — you're rendering the input yourself via \`form.fieldController('email')\` and need a drop-in error slot without re-implementing the \`touched || submitCount > 0\` rule
- **Design-system integration** — your form rows have a fixed label/input/error grid and each slot is its own React component
- **Multi-placement errors** — you want to show the error both inline *and* in a summary bar at the top of the form (mount \`<FieldError />\` twice, it stays in sync)
- **Render-prop wrappers** — you need to wrap the error in a tooltip, toast, animation, or icon that the default \`<span>\` can't express`,
    },
    {
      id: 'fb-field-error-props',
      title: 'Props',
      content: `${FIELD_ERROR_PROPS_TABLE}`,
    },
    {
      id: 'fb-field-error-recipes',
      title: 'Recipes',
      content: `- **Summary error bar** → mount one \`<form.FieldError name="email" />\` near the top of the form and another next to the input; both track the same state automatically
- **Icon + message row** → use \`render={({ error }) => <ErrorRow icon={<Alert />} text={error} />}\`
- **Accessible live region** → the default renderer already emits \`role="alert"\`; wrap your custom \`render\` output in \`<div role="alert" aria-live="polite">\` if you need extra polish
- **Hide until submit** → FormBridge already enforces this. If you want to *always* hide errors until the first submit attempt, set \`validateOn: 'onSubmit'\` on the hook instead of touching \`<FieldError />\``,
    },
  ],
};
