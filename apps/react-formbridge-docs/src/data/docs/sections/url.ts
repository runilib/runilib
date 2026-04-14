import type { LibraryDoc } from './../../../types/index';
import {
  BASE_FIELD_BUILDER_REFERENCE,
  buildMethodsTable,
  STRING_FIELD_BUILDER_REFERENCE,
} from '../constants';

const URL_METHODS_TABLE = buildMethodsTable([
  [
    '`—`',
    '`—`',
    '`field.url()` does not add methods beyond the shared string-builder surface; it mainly preconfigures an HTTP/HTTPS format validator.',
  ],
]);

export const urlSection: LibraryDoc['sections'][number] = {
  id: 'fb-url',
  title: 'field.url()',
  content: `String builder for URLs with a built-in HTTP/HTTPS format check.

- A built-in URL format validator is wired through \`format(...)\` at construction time
- Good for profile websites, callback URLs, portfolio links, or webhook endpoints
- Override the built-in format with \`format()\` when you need stricter rules (e.g. HTTPS-only)`,
  codeTabs: [
    {
      filename: 'Url.tsx',
      lang: 'tsx',

      code: `const schema = { website: field.url('Website').optional().trim() }`,
    },
  ],
  subsections: [
    {
      id: 'fb-url-props',
      title: 'Defaults, inheritance & field methods',
      content: `- defaultValue is \`''\`
- type is \`url\`
- A built-in HTTP/HTTPS validator is wired through \`format(...)\` at construction time
- The built-in format does the heavy lifting for the default case
${BASE_FIELD_BUILDER_REFERENCE}
${STRING_FIELD_BUILDER_REFERENCE}

URL-specific methods:
${URL_METHODS_TABLE}`,
    },
    {
      id: 'fb-url-recipes',
      title: 'Recipes',
      content: `Patterns that showcase url-specific strengths:
- HTTPS-only webhook → \`field.url('Webhook URL').required().format(/^https:\\/\\/.+$/, 'Use an HTTPS URL.')\`
- OAuth callback with path check → \`field.url('Redirect URI').required().validate((v) => v.includes('/callback') ? null : 'URL must contain /callback path.')\`
- Portfolio with hint → \`field.url('Portfolio').optional().trim().hint('Full URL including https://')\``,
    },
  ],
};
