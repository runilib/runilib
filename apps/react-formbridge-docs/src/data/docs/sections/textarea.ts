import type { LibraryDoc } from './../../../types/index';
import {
  BASE_FIELD_BUILDER_REFERENCE,
  buildMethodsTable,
  STRING_FIELD_BUILDER_REFERENCE,
} from '../constants';

const TEXTAREA_METHODS_TABLE = buildMethodsTable([
  [
    '`—`',
    '`—`',
    '`field.textarea()` does not add methods beyond the shared string-builder surface; it mainly swaps the renderer to a multiline input.',
  ],
]);

export const textareaSection: LibraryDoc['sections'][number] = {
  id: 'fb-textarea',
  title: 'field.textarea()',
  content: `Multiline string builder. Renders a resizable text area instead of a single-line input.

- Same API as \`field.text()\` — only the rendered input type changes
- Best suited for bios, comments, issue descriptions, feedback, and any input where line breaks matter
- Pair with \`min()\` / \`max()\` to set clear length boundaries`,
  codeTabs: [
    {
      filename: 'Bio.tsx',
      lang: 'tsx',

      code: `const schema = { bio: field.textarea('Bio').max(400) }`,
    },
  ],
  subsections: [
    {
      id: 'fb-textarea-props',
      title: 'Defaults, inheritance & field methods',
      content: `- defaultValue is \`''\`
- type is \`textarea\`
${BASE_FIELD_BUILDER_REFERENCE}
${STRING_FIELD_BUILDER_REFERENCE}

Textarea-specific methods:
${TEXTAREA_METHODS_TABLE}`,
    },
    {
      id: 'fb-textarea-recipes',
      title: 'Recipes',
      content: `Patterns that showcase textarea-specific use cases:
- Support ticket with minimum detail → \`field.textarea('Description').required().min(20).max(2000).hint('Describe the issue with as much detail as possible.')\`
- Bio with character budget → \`field.textarea('Bio').max(280).trim().placeholder('Tell the community a bit about yourself')\`
- Markdown-friendly notes → \`field.textarea('Release notes').max(5000).hint('Markdown is supported')\``,
    },
  ],
};
