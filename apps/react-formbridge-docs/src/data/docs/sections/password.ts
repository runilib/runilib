import type { LibraryDoc } from './../../../types/index';
import { BASE_BUILDER_METHODS, STRING_BUILDER_METHODS } from '../constants';

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
      title: 'Props & defaults',
      content: `- defaultValue is \`''\`
- type is \`password\`

Password-specific methods:
- \`strong(message?)\` — built-in strong-password validator (length, upper, lower, number, special char)
- \`withStrengthIndicator(options?)\` — adds strength UI metadata: \`showBar?\`, \`showLabel?\`, \`showRules?\`, \`showEntropy?\`, \`barHeight?\`, \`barRadius?\`, \`config?\`, \`levels?\`, \`blockWeak?\`, \`blockMsg?\`
- \`sameAs(fieldName, message?)\` / \`matches(fieldName, message?)\` — inherited but especially relevant here for confirmation fields

${BASE_BUILDER_METHODS}

${STRING_BUILDER_METHODS}`,
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
