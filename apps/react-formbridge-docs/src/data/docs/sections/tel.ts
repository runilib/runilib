import type { LibraryDoc } from './../../../types/index';
import {
  BASE_FIELD_BUILDER_REFERENCE,
  buildMethodsTable,
  FENCE,
  STRING_FIELD_BUILDER_REFERENCE,
} from '../constants';

const TEL_METHODS_TABLE = buildMethodsTable([
  [
    '`-`',
    '`-`',
    '`field.tel()` does not add methods beyond the shared string-builder surface; it mainly preconfigures a generic phone format validator.',
  ],
]);

export const telSection: LibraryDoc['sections'][number] = {
  id: 'fb-tel',
  title: 'field.tel()',
  content: `Lightweight telephone string builder without country metadata.

- Use it when you only need a basic phone text input with a tel keyboard
- A built-in generic phone regex is wired through \`format(...)\` at construction time
- For country-aware parsing, dial codes, E.164 output, or phone validation, use \`field.phone()\` instead`,
  codeTabs: [
    {
      filename: 'Tel.tsx',
      lang: 'tsx',

      code: `const schema = {
  supportPhone: field.tel('Support phone')
    .pattern(/^[+\\d\\s()-]{6,20}$/, 'Enter a valid phone.')
    .required(),
}`,
    },
  ],
  subsections: [
    {
      id: 'fb-tel-props',
      title: 'Defaults, inheritance & field methods',
      content: `- defaultValue is \`''\`
- type is \`tel\`
- A built-in generic phone regex is wired through \`format(...)\` at construction time
- For richer phone UX, use \`field.phone()\`
${BASE_FIELD_BUILDER_REFERENCE}
${STRING_FIELD_BUILDER_REFERENCE}

Tel-specific methods:
${TEL_METHODS_TABLE}`,
    },
    {
      id: 'fb-tel-recipes',
      title: 'Recipes',
      content: `Patterns that showcase tel-specific use cases.

**Internal extension number**

${FENCE}tsx Extension.tsx
const schema = {
  extension: field.tel('Extension')
    .pattern(/^\\d{3,5}$/, 'Enter a 3-5 digit extension.')
    .placeholder('e.g. 4201'),
}
${FENCE}

**Freeform with country code hint**

${FENCE}tsx SupportPhone.tsx
const schema = {
  supportPhone: field.tel('Support phone')
    .required()
    .hint('Include country code, e.g. +33 1 23 45 67 89'),
}
${FENCE}

**Custom format enforcement**

${FENCE}tsx Fax.tsx
const schema = {
  fax: field.tel('Fax')
    .pattern(
      /^\\+\\d{1,3}\\s?\\d{4,14}$/,
      'Use international format: +XX XXXXXXXXXX',
    ),
}
${FENCE}`,
    },
  ],
};
