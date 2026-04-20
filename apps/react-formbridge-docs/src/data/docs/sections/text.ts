import type { LibraryDoc } from './../../../types/index';
import { buildMethodsTable, FENCE } from '../constants';

const TEXT_METHODS_TABLE = buildMethodsTable([
  [
    '`min(length, message?)`',
    '`length: number`',
    'Sets the minimum accepted string length.',
  ],
  [
    '`max(length, message?)`',
    '`length: number`',
    'Sets the maximum accepted string length.',
  ],
  [
    '`pattern(regex | regex[], message?)`',
    '`RegExp | RegExp[]`',
    'Appends one or more accepted regex rules.',
  ],
  [
    '`patterns(regexes, message?)`',
    '`RegExp[]`',
    'Alias for passing multiple accepted regex alternatives.',
  ],
  [
    '`format(regex, message?)`',
    '`regex: RegExp`',
    'Overrides the low-level format regex used by preset string builders.',
  ],
  ['`trim()`', '`() => this`', 'Trims whitespace before validation and submit.'],
  ['`lowercase()`', '`() => this`', 'Lowercases the value before storing it.'],
  ['`uppercase()`', '`() => this`', 'Uppercases the value before storing it.'],
  [
    '`nonEmpty(message?)`',
    '`message?: string`',
    'Rejects empty strings **and** whitespace-only input (stricter than `required()`, which only checks for presence).',
  ],
  [
    '`length(exact, message?)`',
    '`exact: number`',
    'Requires an exact character count - handy for fixed-size codes like tax IDs, IBAN fragments, or reference numbers.',
  ],
  [
    '`between(min, max, message?)`',
    '`min: number, max: number`',
    'Shorthand for `min(min).max(max)` expressed as a single predicate with a combined message.',
  ],
  [
    '`oneOf(values, message?)`',
    '`values: string[]`',
    'Accepts only values present in the allow-list. Useful for free-form inputs that must resolve to a known enum.',
  ],
  [
    '`notOneOf(values, message?)`',
    '`values: string[]`',
    'Rejects values from a deny-list (reserved words, blocked usernames, forbidden slugs, etc.).',
  ],
  [
    '`matches(fieldName, message?)`',
    '`fieldName: string | FieldReference`',
    'Requires equality with another field value (supports `ref()` for nested paths). Classic use: confirm-password.',
  ],
  [
    '`sameAs(fieldName, message?)`',
    '`fieldName: string | FieldReference`',
    'Alias for `matches()` with more explicit confirmation semantics.',
  ],
]);

export const textSection: LibraryDoc['sections'][number] = {
  id: 'fb-text',
  title: 'field.text()',
  content: `The base builder for free-form strings. Use it for names, titles, slugs, comments, usernames, or any value that does not need a specialized builder.

- Inherits all shared methods from [Base field builder](/docs/base-field-builder)
- This page is also the reference for the shared string-builder methods reused by \`field.email()\`, \`field.password()\`, \`field.tel()\`, \`field.url()\`, \`field.textarea()\`, \`field.date()\`, and \`field.masked()\`
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
      title: 'Defaults, inheritance & field methods',
      content: `- defaultValue is \`''\`
- type is \`text\`
- Shared methods: see [Base field builder](/docs/base-field-builder)
- This page documents the string-specific layer added on top of the base builder

String builder methods:
${TEXT_METHODS_TABLE}`,
    },
    {
      id: 'fb-text-recipes',
      title: 'Recipes',
      content: `Patterns that showcase text-specific strengths.

**Username with character constraints**

${FENCE}tsx Username.tsx
const schema = {
  username: field.text('Username')
    .required()
    .trim()
    .min(3)
    .max(20)
    .pattern(/^[a-z0-9_]+$/i, 'Letters, numbers, and underscores only.'),
}
${FENCE}

**SEO slug with transform**

${FENCE}tsx Slug.tsx
const schema = {
  slug: field.text('Slug')
    .transform((value) => value.trim().toLowerCase().replace(/\\s+/g, '-'))
    .pattern(/^[a-z0-9-]+$/, 'Letters, numbers, and dashes only.'),
}
${FENCE}

**Display name with whitespace cleanup**

${FENCE}tsx DisplayName.tsx
const schema = {
  displayName: field.text('Display name')
    .trim()
    .min(1)
    .max(50)
    .transform((value) => value.replace(/\\s{2,}/g, ' ')),
}
${FENCE}`,
    },
  ],
};
