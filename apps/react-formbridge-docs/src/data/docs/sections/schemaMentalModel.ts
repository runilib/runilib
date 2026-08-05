import type { LibraryDoc } from '../../../types/index';

export const schemaMentalModelSection: LibraryDoc['sections'][number] = {
  id: 'fb-schema-mental-model',
  title: 'Schema mental model',
  content: `A schema is a plain object where each key becomes a field name and each value is a builder.

- The builder defines the field type, default value, label, validation, visibility conditions and more.
- \`SchemaValues<typeof schema>\` gives you the submitted values shape automatically.
- Because the schema is just data, the same object can drive editing forms, wizards, readonly reviews, analytics, and even dynamic rendering.
- The practical rule of thumb: if a behavior belongs to the field itself, keep it in the builder instead of scattering it across components.`,
  subsections: [
    {
      id: 'fb-schema-mental-model-shape',
      title: 'What the schema controls',
      content: `| Concern | What the schema controls |
| --- | --- |
| Rendering | Text input, select, radio, phone, file, OTP, custom renderer, and more |
| Validation | Required rules, length/number constraints, async validators, cross-field checks |
| UX metadata | Labels, placeholders, hints, error messages... |
| Runtime conditions | Visible, required, disabled, resetFields/clear/keep on hide |`,
    },
    {
      id: 'fb-schema-mental-model-typing-tip',
      title: 'Typing tip',
      content: `Use \`satisfies FormSchema\` when you want an explicit schema contract without losing the precise field typing.

\`\`\`tsx
import type { FormSchema } from '@runilib/react-formbridge'

const schema = {
  bio: field.textarea('Bio'),
  country: field.select('Country').options(['FR', 'US']),
} satisfies FormSchema
\`\`\`

This keeps \`fieldController('bio')\` aligned with textarea metadata and \`fieldController('country')\` aligned with select metadata.`,
    },
  ],
};
