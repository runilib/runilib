import type { LibraryDoc } from './../../../types/index';

export const quickstartSection: LibraryDoc['sections'][number] = {
  id: 'fb-quickstart',
  title: 'Quick start',
  content: `A form starts with a plain schema object. Keys become field names, and each builder defines the renderer, default value, validation, and UI metadata for that field.

- Web and native can share the same schema.
- The generated \`fields\` map is fully typed from the schema keys.
- The generated \`field\` prop is also typed from the exact field type, so text fields, textareas, or selects for example do not expose the same override surface.
- \`Form.Submit\` automatically follows submit state.`,
  codeTabs: [
    {
      filename: 'web.tsx',
      lang: 'tsx',
      code: `import type { FormSchema } from '@runilib/react-formbridge'
import { field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  fullName: field.text('Full name').required().trim(),
  email: field.email('Email').required(),
  password: field.password('Password').required().strong(),
  terms: field.checkbox('Accept terms').mustBeTrue(),
} satisfies FormSchema

export function RegistrationForm() {
  const { Form, fields, state } = useFormBridge(schema, { validateOn: 'onTouched' })

  return (
    <Form onSubmit={save}>
      <fields.fullName />
      <fields.email />
      <fields.password />
      <fields.terms />
      <Form.Submit disabled={!state.isValid}>Create account</Form.Submit>
    </Form>
  )
}`,
    },
    {
      filename: 'native.tsx',
      lang: 'tsx',
      code: `import { ScrollView, View } from 'react-native'
import type { FormSchema } from '@runilib/react-formbridge'
import { field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  fullName: field.text('Full name').required(),
  email: field.email('Email').required(),
  password: field.password('Password').required().strong(),
} satisfies FormSchema

export function RegistrationScreen() {
  const { Form, fields, state } = useFormBridge(schema, { validateOn: 'onTouched' })
  return (
    <ScrollView>
      <Form onSubmit={save}>
        <View style={{ gap: 12, padding: 16 }}>
          <fields.fullName />
          <fields.email />
          <fields.password />
          <Form.Submit disabled={!state.isValid}>Create</Form.Submit>
        </View>
      </Form>
    </ScrollView>
  )
}`,
    },
  ],
};
