import type { LibraryDoc } from './../../../types/index';
import { BASE_BUILDER_METHODS, STRING_BUILDER_METHODS } from '../constants';

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
      title: 'Props & defaults',
      content: `- defaultValue is \`''\`
- type is \`tel\`
- A built-in generic phone regex is wired through \`format(...)\` at construction time
- No tel-specific methods beyond the shared surface — for richer phone UX, use \`field.phone()\`

${BASE_BUILDER_METHODS}

${STRING_BUILDER_METHODS}`,
    },
    {
      id: 'fb-tel-recipes',
      title: 'Recipes',
      content: `Patterns that showcase tel-specific use cases:
- Internal extension number → \`field.tel('Extension').pattern(/^\\d{3,5}$/, 'Enter a 3-5 digit extension.').placeholder('e.g. 4201')\`
- Freeform with country code hint → \`field.tel('Support phone').required().hint('Include country code, e.g. +33 1 23 45 67 89')\`
- Custom format enforcement → \`field.tel('Fax').pattern(/^\\+\\d{1,3}\\s?\\d{4,14}$/, 'Use international format: +XX XXXXXXXXXX')\``,
    },
  ],
};
