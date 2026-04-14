import type { LibraryDoc } from './../../../types/index';
import { BASE_FIELD_BUILDER_REFERENCE, buildMethodsTable } from '../constants';

const SWITCH_METHODS_TABLE = buildMethodsTable([
  [
    '`mustBeTrue(message?)`',
    '`message?: string`',
    'Blocks submit unless the switch is enabled.',
  ],
]);

export const switchSection: LibraryDoc['sections'][number] = {
  id: 'fb-switch',
  title: 'field.switch()',
  content: `Boolean builder rendered as a toggle switch. Prefer it for settings, preferences, and feature flags.

- Same API as \`field.checkbox()\` — only the visual renderer changes
- Use \`defaultValue(true)\` when the toggle should start enabled
- Keep \`field.checkbox()\` for agreements and legal acceptance flows`,
  codeTabs: [
    {
      filename: 'Switch.web.tsx',
      lang: 'tsx',

      code: `const schema = {
  notifications: field.switch('Enable email notifications'),
}`,
    },
    {
      filename: 'Switch.native.tsx',
      lang: 'tsx',
      code: `const schema = {
  publicProfile: field.switch('Public profile').hint('Visible to other members'),
}`,
    },
  ],
  subsections: [
    {
      id: 'fb-switch-props',
      title: 'Defaults, inheritance & field methods',
      content: `- defaultValue is \`false\`
- type is \`switch\`
${BASE_FIELD_BUILDER_REFERENCE}

Switch-specific methods:
${SWITCH_METHODS_TABLE}`,
    },
    {
      id: 'fb-switch-recipes',
      title: 'Recipes',
      content: `Patterns that showcase switch-specific use cases:
- Notifications on by default → \`field.switch('Enable email notifications').defaultValue(true)\`
- Profile visibility toggle → \`field.switch('Public profile').hint('Visible to other members')\`
- Mandatory billing activation → \`field.switch('Enable billing').mustBeTrue('Billing must stay enabled for this plan.')\``,
    },
  ],
};
