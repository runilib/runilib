import type { LibraryDoc } from './../../../types/index';
import { DOC_PREVIEWS } from '../constants';

export const tutorialSignupSection: LibraryDoc['sections'][number] = {
  id: 'fb-tutorial-signup',
  title: 'Tutorial: signup form',
  content: `Build a real account-creation form with typed fields, conditional company fields, inline validation, and the same schema on web and native.

- One schema defines labels, rules, defaults, and platform hints
- \`useFormBridge()\` gives you the wrapper, generated fields, submit lifecycle, and reactive state
- Conditional company fields stay in the builder instead of leaking into component branches`,
  codeTabs: [
    {
      filename: 'SignupFlow.web.tsx',
      lang: 'tsx',
      code: `import type { FormSchema } from '@runilib/react-formbridge'
import { field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  firstName: field.text('First name').required().trim(),
  lastName: field.text('Last name').required().trim(),
  email: field.email('Work email').required().trim().lowercase(),
  password: field.password('Password').required().strong(),
  accountType: field.select('Account type').options([
    { label: 'Personal', value: 'personal' },
    { label: 'Company', value: 'company' },
  ]).required(),
  companyName: field
    .text('Company name')
    .visibleWhen('accountType', 'company')
    .requiredWhen('accountType', 'company')
    .clearOnHide(),
  terms: field.checkbox('Accept terms').mustBeTrue(),
} satisfies FormSchema

export function SignupForm() {
  const { Form, fields, state } = useFormBridge(schema, {
    validateOn: 'onTouched',
    revalidateOn: 'onChange',
  })

  return (
    <Form onSubmit={async (values) => api.signup(values)}>
      <fields.firstName />
      <fields.lastName />
      <fields.email />
      <fields.password />
      <fields.accountType />
      <fields.companyName />
      <fields.terms />
      <Form.Submit disabled={!state.isValid}>Create account</Form.Submit>
    </Form>
  )
}`,
    },
    {
      filename: 'SignupFlow.native.tsx',
      lang: 'tsx',
      code: `import { ScrollView, View } from 'react-native'
import type { FormSchema } from '@runilib/react-formbridge'
import { field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  firstName: field.text('First name').required().trim(),
  lastName: field.text('Last name').required().trim(),
  email: field.email('Work email').required().trim().lowercase(),
  password: field.password('Password').required().strong(),
  accountType: field.select('Account type').options([
    { label: 'Personal', value: 'personal' },
    { label: 'Company', value: 'company' },
  ]).required(),
  companyName: field
    .text('Company name')
    .visibleWhen('accountType', 'company')
    .requiredWhen('accountType', 'company')
    .clearOnHide(),
  terms: field.checkbox('Accept terms').mustBeTrue(),
} satisfies FormSchema

export function SignupScreen() {
  const { Form, fields, state } = useFormBridge(schema, {
    validateOn: 'onTouched',
    revalidateOn: 'onChange',
  })

  return (
    <ScrollView>
      <Form onSubmit={async (values) => api.signup(values)}>
        <View style={{ gap: 12, padding: 16 }}>
          <fields.firstName />
          <fields.lastName />
          <fields.email />
          <fields.password />
          <fields.accountType />
          <fields.companyName />
          <fields.terms />
          <Form.Submit disabled={!state.isValid}>Create account</Form.Submit>
        </View>
      </Form>
    </ScrollView>
  )
}`,
    },
  ],
  subsections: [
    {
      id: 'fb-tutorial-signup-state',
      title: 'Track state and submit lifecycle',
      content: `You rarely need custom local state for the form itself. The hook already exposes the pieces most product flows care about.

- \`state.isValid\`, \`state.isDirty\`, and \`state.isSubmitting\` drive button states and shell feedback
- \`watchAll()\` is useful for live previews or summary cards
- \`submit()\` lets you trigger the same submit pipeline from an outer button or wizard shell`,
      code: {
        filename: 'SignupState.tsx',
        lang: 'tsx',
        code: `const form = useFormBridge(schema, {
  validateOn: 'onTouched',
  revalidateOn: 'onChange',
})

const { Form, fields, state, watchAll, submit } = form
const liveValues = watchAll()
const canContinue = state.isValid && !state.isSubmitting

return (
  <>
    <aside>{liveValues.email || 'No email yet'}</aside>
    <Form onSubmit={async (values) => api.signup(values)}>
      <fields.email />
      <fields.password />
      <Form.Submit disabled={!canContinue}>Create account</Form.Submit>
    </Form>
    <button type="button" onClick={() => void submit()}>
      Submit from outer shell
    </button>
  </>
)`,
      },
    },
    {
      id: 'fb-tutorial-signup-disclosure',
      title: 'Progressive disclosure stays in the schema',
      content: `Conditional fields are one of the first places where ad hoc forms become noisy. Keep them in the builders instead.

- \`visibleWhen(...)\` controls whether the field renders
- \`requiredWhen(...)\` keeps the validation rule aligned with visibility
- \`clearOnHide()\` or \`resetOnHide()\` prevents stale hidden values from leaking into submit payloads`,
      code: {
        filename: 'SignupDisclosure.ts',
        lang: 'ts',
        code: `const schema = {
  accountType: field.select('Account type').options([
    { label: 'Personal', value: 'personal' },
    { label: 'Company', value: 'company' },
  ]).required(),
  companyName: field
    .text('Company name')
    .visibleWhen('accountType', 'company')
    .requiredWhen('accountType', 'company')
    .clearOnHide(),
  vatNumber: field
    .text('VAT number')
    .visibleWhen('accountType', 'company')
    .requiredWhen('accountType', 'company')
    .clearOnHide(),
}`,
      },
    },
  ],
};
