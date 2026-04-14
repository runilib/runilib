import type { LibraryDoc } from './../../../types/index';
import {
  BASE_FIELD_BUILDER_REFERENCE,
  buildMethodsTable,
  STRING_FIELD_BUILDER_REFERENCE,
} from '../constants';

const PASSWORD_METHODS_TABLE = buildMethodsTable([
  [
    '`strong(message?)`',
    '`message?: string`',
    'Enables the built-in strong-password validator for length, upper, lower, number, and special character rules.',
  ],
  [
    '`withStrengthIndicator(options?)`',
    '`options?: object`',
    'Adds strength UI metadata such as bar, label, rules checklist, entropy display, and weak-password blocking.',
  ],
  [
    '`hideRulesWhenValid(enabled = true)`',
    '`enabled?: boolean`',
    'Hides the strength checklist once the password becomes valid.',
  ],
]);

export const passwordSection: LibraryDoc['sections'][number] = {
  id: 'fb-password',
  title: 'field.password()',
  content: `Password builder for auth and account flows with built-in strength validation and confirmation matching.

- \`strong()\` enables length, upper, lower, number, and special-char rules in one call
- \`withStrengthIndicator()\` adds visual strength feedback (bar, rules checklist, entropy label) without a custom renderer
- \`sameAs('password')\` / \`matches('password')\` wires confirmation fields`,
  codeTabs: [
    {
      filename: 'Password.tsx',
      lang: 'tsx',

      code: `const schema = {
  password: field.password('Password')
    .required()
    .strong()
    .withStrengthIndicator({ showBar:true, showRules:true, blockWeak:true }),
  confirm: field.password('Confirm').required().sameAs('password','Passwords must match.'),
}`,
    },
  ],
  subsections: [
    {
      id: 'fb-password-props',
      title: 'Defaults, inheritance & field methods',
      content: `- defaultValue is \`''\`
- type is \`password\`
${BASE_FIELD_BUILDER_REFERENCE}
${STRING_FIELD_BUILDER_REFERENCE}
- Confirmation helpers such as \`sameAs('password')\` and \`matches('password')\` are inherited from [field.text()](/docs/field-text)

Password-specific methods:
${PASSWORD_METHODS_TABLE}`,
    },
    {
      id: 'fb-password-recipes',
      title: 'Recipes',
      content: `Patterns that showcase password-specific strengths:
- Signup with strength bar → \`field.password('Password').required().strong().withStrengthIndicator({ showBar: true, showRules: true, blockWeak: true })\`
- Confirmation field → \`field.password('Confirm password').required().sameAs('password', 'Passwords must match.')\`
- Password rotation (reject reuse) → \`field.password('New password').required().strong().validate((value, allValues) => value !== allValues.currentPassword ? null : 'Choose a different password.')\``,
    },
  ],
};
