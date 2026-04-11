import type { LibraryDoc } from './../../../types/index';
import { BASE_BUILDER_METHODS, STRING_BUILDER_METHODS } from '../constants';

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
      title: 'Props & defaults',
      content: `- defaultValue is \`''\`
- type is \`url\`
- A built-in HTTP/HTTPS validator is wired through \`format(...)\` at construction time
- No url-specific methods beyond the shared surface — the built-in format does the heavy lifting

${BASE_BUILDER_METHODS}

${STRING_BUILDER_METHODS}`,
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
