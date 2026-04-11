import type { LibraryDoc } from './../../../types/index';
import { BASE_BUILDER_METHODS, STRING_BUILDER_METHODS } from '../constants';

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
<Form onSubmit={save}><fields.email ui={{ inputProps:{ autoComplete:'email' }}} /><Form.Submit>Send</Form.Submit></Form>`,
    },
    {
      filename: 'Email.native.tsx',
      lang: 'tsx',
      code: `const schema = {
  email: field.email('Work email').required().trim(),
}

const { Form, fields } = useFormBridge(schema)

<Form onSubmit={save}>
  <fields.email />
  <Form.Submit>Send</Form.Submit>
</Form>`,
    },
  ],
  subsections: [
    {
      id: 'fb-email-props',
      title: 'Props & defaults',
      content: `- defaultValue is \`''\`
- type is \`email\`
- A built-in email format validator is wired through \`format(...)\` at construction time

Email-specific method:
- \`excludeEmailDomains(domains, message?)\` — rejects a list of blocked domains (e.g. personal inbox providers)

${BASE_BUILDER_METHODS}

${STRING_BUILDER_METHODS}`,
    },
    {
      id: 'fb-email-recipes',
      title: 'Recipes',
      content: `Patterns that showcase email-specific strengths:
- Block personal providers → \`field.email('Work email').trim().lowercase().excludeEmailDomains(['gmail.com', 'yahoo.com', 'hotmail.com'], 'Use your company email.')\`
- Domain-locked guard → \`field.email('Partner email').validate((value) => value.endsWith('@partner.io') ? null : 'Use your @partner.io address.')\`
- Enterprise login with autocomplete → \`field.email('Email').required().behavior({ autoComplete: 'email', inputMode: 'email' }).placeholder('you@company.com')\``,
    },
  ],
};
