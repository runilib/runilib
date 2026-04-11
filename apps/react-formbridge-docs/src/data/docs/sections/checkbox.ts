import type { LibraryDoc } from './../../../types/index';
import { BASE_BUILDER_METHODS } from '../constants';

export const checkboxSection: LibraryDoc['sections'][number] = {
  id: 'fb-checkbox',
  title: 'field.checkbox()',
  content: `Boolean builder rendered as a checkbox. Best for agreements, legal acceptance, and opt-in flags.

- \`mustBeTrue()\` turns the checkbox into a hard validation gate — submit is blocked until checked
- For settings and preferences that toggle on/off, prefer \`field.switch()\` instead
- The label is the clickable text next to the checkbox`,
  codeTabs: [
    {
      filename: 'Checkbox.web.tsx',
      lang: 'tsx',

      code: `const schema = {
  terms: field.checkbox('I accept the Terms of Service')
    .mustBeTrue('Please accept the terms to continue.'),
}`,
    },
    {
      filename: 'Checkbox.native.tsx',
      lang: 'tsx',
      code: `const schema = {
  marketing: field.checkbox('Receive product updates'),
}`,
    },
  ],
  subsections: [
    {
      id: 'fb-checkbox-props',
      title: 'Props & defaults',
      content: `- defaultValue is \`false\`
- type is \`checkbox\`

Boolean-specific method:
- \`mustBeTrue(message?)\` — submit is blocked unless the checkbox is checked

${BASE_BUILDER_METHODS}`,
    },
    {
      id: 'fb-checkbox-recipes',
      title: 'Recipes',
      content: `Patterns that showcase checkbox-specific use cases:
- Legal gate → \`field.checkbox('I accept the Terms of Service').mustBeTrue('You must accept the terms to continue.')\`
- GDPR consent with hint → \`field.checkbox('Allow data processing').mustBeTrue().hint('Required by EU regulation')\`
- Optional newsletter opt-in → \`field.checkbox('Send me product updates').hint('You can unsubscribe any time')\``,
    },
  ],
};
