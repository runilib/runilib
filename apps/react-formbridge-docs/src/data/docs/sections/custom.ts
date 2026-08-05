import type { LibraryDoc } from './../../../types/index';
import { BASE_FIELD_BUILDER_REFERENCE, buildMethodsTable, FENCE } from '../constants';

const CUSTOM_METHODS_TABLE = buildMethodsTable([
  [
    '`-`',
    '`-`',
    '`field.custom(defaultValue)` does not add methods on top of the base builder; it is the raw BaseFieldBuilder escape hatch.',
  ],
]);

export const customSection: LibraryDoc['sections'][number] = {
  id: 'fb-custom',
  title: 'field.custom()',
  content: `Escape hatch for UI that deserves a custom renderer while keeping the rest of the form runtime.

- Use it when the built-in field types are not enough
- You still keep schema typing, validation, state, and the submit lifecycle
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

const form = useFormBridge(schema)
  const { Form, fieldController } = form

<Form onSubmit={save}>
  <AppField form={form} name="rating" />
  <button type="submit">Send</button>
</Form>`,
    },
  ],
  subsections: [
    {
      id: 'fb-custom-props',
      title: 'Defaults, inheritance & field methods',
      content: `\`field.custom(defaultValue)\` returns a typed \`BaseFieldBuilder\` - no extra methods, just the shared base surface (see Builder basics).

| Key | Description |
| --- | --- |
| \`defaultValue\` | Required - stays typed through the field controller |
| \`label\` | Optional at construction, usually added with \`label('...')\` |
| \`render(fn)\` | Main escape hatch - keeps the form runtime while replacing the UI |
| \`fieldController\` | If you need custom UI for a built-in field type (\`select\`, \`masked\`, \`phone\`), prefer \`form.fieldController(name)\` instead |

\`render(fn)\` receives: \`name\`, \`label\`, \`value\`, \`placeholder\`, \`error\`, \`touched\`, \`dirty\`, \`validating\`, \`disabled\`, \`hint\`, \`options\`, \`otpLength\`, \`onChange\`, \`onBlur\`, \`onFocus\`, \`allValues\`

${BASE_FIELD_BUILDER_REFERENCE}

Custom-field methods:
${CUSTOM_METHODS_TABLE}`,
    },
    {
      id: 'fb-custom-recipes',
      title: 'Recipes',
      content: `Patterns that showcase custom-specific strengths.

**Star rating widget**

${FENCE}tsx StarRating.tsx
const schema = {
  rating: field.custom(0)
    .label('Rating')
    .render(({ value, onChange }) => (
      <Stars value={value} onChange={onChange} />
    ))
    .validate((value) => (value > 0 ? null : 'Pick a rating')),
}
${FENCE}

**Trip window picker**

${FENCE}tsx TripWindow.tsx
const schema = {
  travelWindow: field
    .custom<{ start: Date | null; end: Date | null }>({
      start: null,
      end: null,
    })
    .label('Date range')
    .render((props) => <DateRangePicker {...props} />),
}
${FENCE}

**Color picker**

${FENCE}tsx ColorPicker.tsx
const schema = {
  brandColor: field.custom('#000000')
    .label('Brand color')
    .render(({ value, onChange }) => (
      <ColorWheel value={value} onChange={onChange} />
    )),
}
${FENCE}

**When to use fieldController instead**

If the value model is already a built-in type (\`select\`, \`masked\`, \`phone\`, …) and you only need a different UI, keep the schema field as-is and drive the UI through \`form.fieldController(name)\`:

${FENCE}tsx FieldControllerAlternative.tsx
const schema = {
  plan: field.select('Plan').options(PLAN_OPTIONS).required(),
}

const form = useFormBridge(schema)
const plan = form.fieldController('plan')

<MyCustomSegmentedControl
  value={plan.value}
  options={plan.options}
  onChange={plan.setValue}
/>
${FENCE}`,
    },
  ],
};
