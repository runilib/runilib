import type { LibraryDoc } from './../../../types/index';
import { BASE_BUILDER_METHODS } from '../constants';

export const customSection: LibraryDoc['sections'][number] = {
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
      content: `\`field.custom(defaultValue)\` returns a typed \`BaseFieldBuilder\` — no extra methods, just the shared base surface (see Builder basics).

- defaultValue is required and stays typed through the generated field
- label is optional at construction and is usually added with \`label('...')\`
- The main escape hatch is \`render(fn)\`, which keeps the form runtime while replacing the UI
- If you need custom UI for a built-in field type (\`select\`, \`masked\`, \`phone\`), prefer \`form.fieldController(name)\` instead

\`render(fn)\` receives: \`name\`, \`label\`, \`value\`, \`placeholder\`, \`error\`, \`touched\`, \`dirty\`, \`validating\`, \`disabled\`, \`hint\`, \`options\`, \`otpLength\`, \`onChange\`, \`onBlur\`, \`onFocus\`, \`allValues\`

${BASE_BUILDER_METHODS}`,
    },
    {
      id: 'fb-custom-recipes',
      title: 'Recipes',
      content: `Patterns that showcase custom-specific strengths:
- Star rating widget → \`field.custom(0).label('Rating').render(({ value, onChange }) => <Stars value={value} onChange={onChange} />).validate((v) => v > 0 ? null : 'Pick a rating')\`
- Date range picker → \`field.custom({ start: null, end: null }).label('Date range').render((props) => <DateRangePicker {...props} />)\`
- Color picker → \`field.custom('#000000').label('Brand color').render(({ value, onChange }) => <ColorWheel value={value} onChange={onChange} />)\`
- When to use fieldController instead → if the value model is a built-in type (select, masked, phone) and you only need different UI, use \`form.fieldController(name)\` to keep original field semantics`,
    },
  ],
};
