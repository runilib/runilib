import type { LibraryDoc } from './../../../types/index';

export const schemaSection: LibraryDoc['sections'][number] = {
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
- Runtime conditions: visible, required, disabled, resetFields/clear/keep on hide`,
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
};
