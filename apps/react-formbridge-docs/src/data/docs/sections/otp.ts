import type { LibraryDoc } from './../../../types/index';
import { BASE_FIELD_BUILDER_REFERENCE, buildMethodsTable } from '../constants';

const OTP_METHODS_TABLE = buildMethodsTable([
  [
    '`length(length, message?)`',
    '`length: number`',
    'Fixes the exact expected code length and syncs the descriptor min/max values.',
  ],
  [
    '`digitsOnly(message?)`',
    '`message?: string`',
    'Rejects non-digit characters and hints a numeric keyboard.',
  ],
]);

export const otpSection: LibraryDoc['sections'][number] = {
  id: 'fb-otp',
  title: 'field.otp()',
  content: `One-time-password builder for short verification codes. Renders individual character cells instead of a single input.

- \`length()\` fixes the exact code length and the renderer shows that many cells
- \`digitsOnly()\` restricts to numeric input and hints a numeric keyboard
- Combine with \`validateOn: 'onChange'\` at hook level for instant validation as the user types`,
  codeTabs: [
    {
      filename: 'Otp.tsx',
      lang: 'tsx',
      code: `const schema = {
  code: field.otp('Verification code')
    .length(6)
    .digitsOnly()
    .required(),
}`,
    },
  ],
  subsections: [
    {
      id: 'fb-otp-props',
      title: 'Defaults, inheritance & field methods',
      content: `- defaultValue is \`''\`
- type is \`otp\`
${BASE_FIELD_BUILDER_REFERENCE}

OTP-specific methods:
${OTP_METHODS_TABLE}`,
    },
    {
      id: 'fb-otp-recipes',
      title: 'Recipes',
      content: `Patterns that showcase otp-specific strengths:
- Standard 6-digit verification → \`field.otp('Verification code').length(6).digitsOnly().required()\`
- Short 4-digit PIN → \`field.otp('PIN').length(4).digitsOnly('Digits only')\`
- Alphanumeric backup code → \`field.otp('Backup code').length(8)\` (no \`digitsOnly\` — accepts letters too)
- Auto-submit on complete → use \`validateOn: 'onChange'\` at hook level + \`onSubmit\` to fire when the code is full`,
    },
  ],
};
