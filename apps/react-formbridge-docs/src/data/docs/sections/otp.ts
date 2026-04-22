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
      filename: 'Otp.web.tsx',
      label: 'Web',
      interactive: true,
      lang: 'tsx',
      code: `import { useState } from 'react'
import { field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  code: field.otp('Verification code')
    .groups([3, 3], '-')
    .digitsOnly()
    .required(),
  plainCode: field.otp('Verification code without groups')
    .length(6)
    .digitsOnly()
    .required(),
}

export function OtpPlaygroundWeb() {
  const [submitted, setSubmitted] = useState<Record<string, unknown> | null>(null)
  const { Form, fields, state } = useFormBridge(schema, {
    validateOn: 'onChange',
  })
  const code = String(state.values.code ?? '')
  const plainCode = String(state.values.plainCode ?? '')

  return (
    <div
      style={{
        fontFamily: 'sans-serif',
        padding: 20,
        background: '#f5f7fb',
        display: 'grid',
        gap: 16,
      }}
    >
      <div>
        <h3 style={{ margin: '0 0 8px' }}>Interactive OTP field</h3>
        <p style={{ margin: 0, color: '#4b5563' }}>
          Type a 6-digit code to see grouped cells, live validation, and the submitted payload.
        </p>
      </div>

      <Form
        onSubmit={async (values) => {
          setSubmitted(values)
        }}
      >
        <div style={{ display: 'grid', gap: 12 }}>
          <fields.code />
          <p style={{ margin: 0, color: '#4b5563' }}>
            Grouped progress: <strong>{code.length}</strong> / 6
          </p>
          <fields.plainCode />
          <p style={{ margin: 0, color: '#4b5563' }}>
            Plain progress: <strong>{plainCode.length}</strong> / 6
          </p>
          <Form.Submit>Verify code</Form.Submit>
        </div>
      </Form>

      <div style={{ display: 'grid', gap: 12 }}>
        <div
          style={{
            border: '1px solid #d6d9e0',
            borderRadius: 12,
            padding: 12,
            background: '#fff',
          }}
        >
          <strong>Live values</strong>
          <pre style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(state.values, null, 2)}
          </pre>
        </div>

        <div
          style={{
            border: '1px solid #d6d9e0',
            borderRadius: 12,
            padding: 12,
            background: '#fff',
          }}
        >
          <strong>Last submit</strong>
          <pre style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(submitted, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}`,
    },
    {
      filename: 'Otp.native.tsx',
      label: 'App',
      interactive: true,
      lang: 'tsx',
      code: `import { useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  code: field.otp('Verification code')
    .groups([3, 3], '-')
    .digitsOnly()
    .required(),
  plainCode: field.otp('Verification code without groups')
    .length(6)
    .digitsOnly()
    .required(),
}

export function OtpPlaygroundApp() {
  const [submitted, setSubmitted] = useState<Record<string, unknown> | null>(null)
  const { Form, fields, state } = useFormBridge(schema, {
    validateOn: 'onChange',
  })
  const code = String(state.values.code ?? '')
  const plainCode = String(state.values.plainCode ?? '')

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f7fb' }}>
      <View style={{ padding: 16, gap: 16 }}>
        <View style={{ gap: 6 }}>
          <Text style={{ fontSize: 18, fontWeight: '600' }}>Interactive OTP field</Text>
          <Text style={{ color: '#4b5563' }}>
            Type a 6-digit code to inspect grouped cells and the form payload in real time.
          </Text>
        </View>

        <Form
          onSubmit={async (values) => {
            setSubmitted(values)
          }}
        >
          <View style={{ gap: 12 }}>
            <fields.code />
            <Text style={{ color: '#4b5563' }}>
              Grouped progress: <Text style={{ fontWeight: '600' }}>{code.length}</Text> / 6
            </Text>
            <fields.plainCode />
            <Text style={{ color: '#4b5563' }}>
              Plain progress: <Text style={{ fontWeight: '600' }}>{plainCode.length}</Text> / 6
            </Text>
            <Form.Submit>Verify code</Form.Submit>
          </View>
        </Form>

        <View
          style={{
            borderWidth: 1,
            borderColor: '#d6d9e0',
            borderRadius: 12,
            padding: 12,
            backgroundColor: '#fff',
            gap: 8,
          }}
        >
          <Text style={{ fontWeight: '600' }}>Live values</Text>
          <Text>{JSON.stringify(state.values, null, 2)}</Text>
        </View>

        <View
          style={{
            borderWidth: 1,
            borderColor: '#d6d9e0',
            borderRadius: 12,
            padding: 12,
            backgroundColor: '#fff',
            gap: 8,
          }}
        >
          <Text style={{ fontWeight: '600' }}>Last submit</Text>
          <Text>{JSON.stringify(submitted, null, 2)}</Text>
        </View>
      </View>
    </ScrollView>
  )
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
