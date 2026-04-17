import type { LibraryDoc } from './../../../types/index';
import { BASE_FIELD_BUILDER_REFERENCE, buildMethodsTable, FENCE } from '../constants';

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
  [
    '`mask(char?)`',
    "`char?: string` (default `'•'`)",
    'Renders each filled cell with a masking character while the real value stays in form state.',
  ],
  [
    '`groups(sizes, separator?)`',
    "`sizes: number[]`, `separator?: string` (default `'-'`)",
    'Splits the code into groups with a non-editable separator between them (e.g. `[3, 2]` renders `___-__`). The total length becomes the sum of the sizes.',
  ],
]);

export const otpSection: LibraryDoc['sections'][number] = {
  id: 'fb-otp',
  title: 'field.otp()',
  content: `One-time-password builder for short verification codes. Renders individual character cells instead of a single input.

- \`length()\` fixes the exact code length and the renderer shows that many cells
- \`digitsOnly()\` restricts to numeric input and hints a numeric keyboard
- \`mask()\` hides the typed value behind a display character (e.g. \`•\`) while keeping the real value in form state
- \`groups()\` splits the code into groups with a non-editable separator between them, like \`___-__\`
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
      content: `Patterns that showcase otp-specific strengths.

**Standard 6-digit verification**

${FENCE}tsx Verification6.tsx
const schema = {
  code: field.otp('Verification code')
    .length(6)
    .digitsOnly()
    .required(),
}
${FENCE}

**Short 4-digit PIN**

${FENCE}tsx Pin4.tsx
const schema = {
  pin: field.otp('PIN')
    .length(4)
    .digitsOnly('Digits only')
    .required(),
}
${FENCE}

**Alphanumeric backup code**

${FENCE}tsx BackupCode.tsx
const schema = {
  backupCode: field.otp('Backup code').length(8).required(),
}
${FENCE}

**Masked verification code**

${FENCE}tsx MaskedOtp.tsx
const schema = {
  code: field.otp('Verification code')
    .length(6)
    .digitsOnly()
    .mask()
    .required(),
}
${FENCE}

**Grouped layout with a separator**

${FENCE}tsx GroupedOtp.tsx
const schema = {
  code: field.otp('Verification code')
    .groups([3, 2], '-')
    .digitsOnly()
    .required(),
}
${FENCE}

**Auto-submit when the code is full**

${FENCE}tsx AutoSubmitOtp.tsx
const schema = {
  code: field.otp('Verification code').length(6).digitsOnly().required(),
}

const { Form, fields, state, submit } = useFormBridge(schema, {
  validateOn: 'onChange',
})

useEffect(() => {
  if (state.values.code?.length === 6 && state.isValid) {
    submit()
  }
}, [state.values.code, state.isValid, submit])

<Form onSubmit={verifyCode}>
  <fields.code />
</Form>
${FENCE}`,
    },
  ],
};
