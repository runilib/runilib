import type { LibraryDoc } from './../../../types/index';
import { BASE_BUILDER_METHODS, DOC_PREVIEWS, STRING_BUILDER_METHODS } from '../constants';

export const textSection: LibraryDoc['sections'][number] = {
  id: 'fb-text',
  title: 'field.text()',
  content: `The base builder for free-form strings. Use it for names, titles, slugs, comments, usernames, or any value that does not need a specialized builder.

- Inherits the full base builder surface and all string builder methods (see Builder basics)
- \`trim()\`, \`min()\`, \`max()\`, \`pattern()\`, and \`transform()\` are the most used methods on text fields
- The same schema works on web and React Native without changes`,
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
      content: `- defaultValue is \`''\`
- type is \`text\`
- No text-specific methods beyond the shared surface

${BASE_BUILDER_METHODS}

${STRING_BUILDER_METHODS}`,
    },
    {
      id: 'fb-text-recipes',
      title: 'Recipes',
      content: `Patterns that showcase text-specific strengths:
- Username with character constraints → \`field.text('Username').trim().min(3).max(20).pattern(/^[a-z0-9_]+$/i, 'Letters, numbers, and underscores only.')\`
- SEO slug with transform → \`field.text('Slug').transform((value) => value.trim().toLowerCase().replace(/\\s+/g, '-')).pattern(/^[a-z0-9-]+$/)\`
- Display name with whitespace cleanup → \`field.text('Display name').trim().min(1).max(50).transform((v) => v.replace(/\\s{2,}/g, ' '))\``,
    },
  ],
};
