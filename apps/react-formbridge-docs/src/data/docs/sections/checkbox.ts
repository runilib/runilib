import type { LibraryDoc } from './../../../types/index';
import { BASE_FIELD_BUILDER_REFERENCE, buildMethodsTable, FENCE } from '../constants';

const CHECKBOX_METHODS_TABLE = buildMethodsTable([
  [
    '`mustBeTrue(message?)`',
    '`message?: string`',
    'Blocks submit unless the checkbox is checked.',
  ],
]);

export const checkboxSection: LibraryDoc['sections'][number] = {
  id: 'fb-checkbox',
  title: 'field.checkbox()',
  content: `Boolean builder rendered as a checkbox. Best for agreements, legal acceptance, and opt-in flags.

- \`mustBeTrue()\` turns the checkbox into a hard validation gate - submit is blocked until checked
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
      title: 'Defaults, inheritance & field methods',
      content: `- defaultValue is \`false\`
- type is \`checkbox\`
${BASE_FIELD_BUILDER_REFERENCE}

Checkbox-specific methods:
${CHECKBOX_METHODS_TABLE}`,
    },
    {
      id: 'fb-checkbox-recipes',
      title: 'Recipes',
      content: `Patterns that showcase checkbox-specific use cases.

**Legal gate**

${FENCE}tsx TermsGate.tsx
const schema = {
  terms: field.checkbox('I accept the Terms of Service')
    .mustBeTrue('You must accept the terms to continue.'),
}
${FENCE}

**GDPR consent with hint**

${FENCE}tsx GdprConsent.tsx
const schema = {
  dataProcessing: field.checkbox('Allow data processing')
    .mustBeTrue()
    .hint('Required by EU regulation'),
}
${FENCE}

**Optional newsletter opt-in**

${FENCE}tsx Newsletter.tsx
const schema = {
  productUpdates: field.checkbox('Send me product updates')
    .hint('You can unsubscribe any time'),
}
${FENCE}`,
    },
  ],
};
