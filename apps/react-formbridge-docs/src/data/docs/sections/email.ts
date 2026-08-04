import type { LibraryDoc } from './../../../types/index';
import {
  BASE_FIELD_BUILDER_REFERENCE,
  buildMethodsTable,
  FENCE,
  STRING_FIELD_BUILDER_REFERENCE,
} from '../constants';

const EMAIL_METHODS_TABLE = buildMethodsTable([
  [
    '`excludeEmailDomains(domains, message?)`',
    '`domains: string[]`',
    'Rejects a list of blocked domains such as personal inbox providers.',
  ],
]);

export const emailSection: LibraryDoc['sections'][number] = {
  id: 'fb-email',
  title: 'field.email()',
  content: `String builder for email inputs with a built-in format validator.

- Same API as \`field.text()\` plus a wired-in email format check
- Usually paired with \`trim()\` and \`lowercase()\` for consistent storage
- Adds \`excludeEmailDomains()\` to block personal inbox providers`,
  codeTabs: [
    {
      filename: 'Email.web.tsx',
      lang: 'tsx',

      code: `const schema = {
  email: field.email('Work email').required().lowercase().trim(),
}
const { Form, fields } = useFormBridge(schema)
<Form onSubmit={save}><AppField form={form} name="email" inputProps={{ autoComplete:'email' }} /><button type="submit">Send</button></Form>`,
    },
    {
      filename: 'Email.native.tsx',
      lang: 'tsx',
      code: `const schema = {
  email: field.email('Work email').required().trim(),
}

const { Form, fields } = useFormBridge(schema)

<Form onSubmit={save}>
  <AppField form={form} name="email" />
  <button type="submit">Send</button>
</Form>`,
    },
  ],
  subsections: [
    {
      id: 'fb-email-props',
      title: 'Defaults, inheritance & field methods',
      content: `- defaultValue is \`''\`
- type is \`email\`
- A built-in email format validator is wired through \`format(...)\` at construction time
${BASE_FIELD_BUILDER_REFERENCE}
${STRING_FIELD_BUILDER_REFERENCE}

Email-specific methods:
${EMAIL_METHODS_TABLE}`,
    },
    {
      id: 'fb-email-recipes',
      title: 'Recipes',
      content: `Patterns that showcase email-specific strengths.

**Block personal providers**

${FENCE}tsx WorkEmail.tsx
const schema = {
  workEmail: field.email('Work email')
    .required()
    .trim()
    .lowercase()
    .excludeEmailDomains(
      ['gmail.com', 'yahoo.com', 'hotmail.com'],
      'Use your company email.',
    ),
}
${FENCE}

**Domain-locked guard**

${FENCE}tsx PartnerEmail.tsx
const schema = {
  partnerEmail: field.email('Partner email')
    .required()
    .trim()
    .lowercase()
    .validate((value) =>
      value.endsWith('@partner.io')
        ? null
        : 'Use your @partner.io address.',
    ),
}
${FENCE}

**Enterprise login with polished field copy**

${FENCE}tsx EnterpriseLogin.tsx
const schema = {
  email: field.email('Email')
    .required()
    .trim()
    .lowercase()
    .placeholder('you@company.com')
    .hint('Use your work address.'),
}
${FENCE}`,
    },
  ],
};
