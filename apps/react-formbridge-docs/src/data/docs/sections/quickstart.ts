import type { LibraryDoc } from './../../../types/index';

export const quickstartSection: LibraryDoc['sections'][number] = {
  id: 'fb-quickstart',
  title: 'Quick start',
  content: `A form starts with a plain schema object. Keys become field names, and each builder defines the default value, validation, and semantic metadata for that field.

- Web and native can share the same schema.
- \`fieldController(name)\` is typed from the schema key and value.
- The application renders its own inputs and submit button.
- \`state\` exposes submission, validity, dirty, error, and value state.`,
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
  const form = useFormBridge(schema, {
    validateOn: 'onTouched',
    onSubmit: save,
  })
  const fullName = form.fieldController('fullName')
  const email = form.fieldController('email')
  const password = form.fieldController('password')
  const terms = form.fieldController('terms')

  return (
    <form onSubmit={form.handleSubmit} noValidate>
      <input
        value={fullName.value}
        onChange={(event) => fullName.onChange(event.target.value)}
        onBlur={fullName.onBlur}
        aria-invalid={Boolean(fullName.error)}
      />
      <input
        type="email"
        value={email.value}
        onChange={(event) => email.onChange(event.target.value)}
        onBlur={email.onBlur}
      />
      <input
        type="password"
        value={password.value}
        onChange={(event) => password.onChange(event.target.value)}
        onBlur={password.onBlur}
      />
      <label>
        <input
          type="checkbox"
          checked={terms.value}
          onChange={(event) => terms.onChange(event.target.checked)}
        />
        Accept terms
      </label>
      <button disabled={form.state.isSubmitting}>Create account</button>
    </form>
  )
}`,
    },
    {
      filename: 'native.tsx',
      lang: 'tsx',
      code: `import { Button, ScrollView, TextInput, View } from 'react-native'
import type { FormSchema } from '@runilib/react-formbridge'
import { field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  fullName: field.text('Full name').required(),
  email: field.email('Email').required(),
  password: field.password('Password').required().strong(),
} satisfies FormSchema

export function RegistrationScreen() {
  const form = useFormBridge(schema, {
    validateOn: 'onTouched',
    onSubmit: save,
  })
  const fullName = form.fieldController('fullName')
  const email = form.fieldController('email')
  const password = form.fieldController('password')

  return (
    <ScrollView>
      <View style={{ gap: 12, padding: 16 }}>
        <TextInput
          value={fullName.value}
          onChangeText={fullName.onChange}
          onBlur={fullName.onBlur}
        />
        <TextInput
          value={email.value}
          onChangeText={email.onChange}
          onBlur={email.onBlur}
          keyboardType="email-address"
        />
        <TextInput
          value={password.value}
          onChangeText={password.onChange}
          onBlur={password.onBlur}
          secureTextEntry
        />
        <Button
          title={form.state.isSubmitting ? 'Creating…' : 'Create'}
          onPress={form.submit}
          disabled={form.state.isSubmitting}
        />
      </View>
    </ScrollView>
  )
}`,
    },
  ],
};
