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
    '`lettersOnly(message?)`',
    '`message?: string`',
    'Restricts the value to ASCII letters (`A-Z`, `a-z`). Disallowed keystrokes are dropped before reaching form state.',
  ],
  [
    '`alphanumeric(message?)`',
    '`message?: string`',
    'Allows letters and digits (`A-Z`, `a-z`, `0-9`). Useful for invitation codes mixing both.',
  ],
  [
    '`mask(char?)`',
    "`char?: string` (default `'•'`)",
    'Configures the masking character your application-owned OTP component should display while the real value stays in form state.',
  ],
  [
    '`groups(sizes, separator?)`',
    "`sizes: number[]`, `separator?: string` (default `'-'`)",
    'Configures logical groups (e.g. `[3, 2]` for `___-__`). The total length becomes the sum of the sizes; your UI renders the separator.',
  ],
]);

export const otpSection: LibraryDoc['sections'][number] = {
  id: 'fb-otp',
  title: 'field.otp()',
  content: `One-time-password builder for short verification codes. Use its headless controller to render individual character cells.

- \`length()\` fixes the exact code length; \`controller.otpLength\` tells your UI how many cells to show
- \`digitsOnly()\`, \`lettersOnly()\` and \`alphanumeric()\` restrict the accepted character set; your UI chooses the matching keyboard hint
- \`mask()\` hides the typed value behind a display character (e.g. \`•\`) while keeping the real value in form state
- \`groups()\` defines the value length; pass the same visual grouping to your application-owned component
- Manage cell refs in your UI to move focus forward after input, backward on Backspace, and distribute pasted codes
- Combine with \`validateOn: 'onChange'\` at hook level for instant validation as the user types`,
  codeTabs: [
    {
      filename: 'Otp.web.tsx',
      label: 'Web',
      interactive: true,
      lang: 'tsx',
      code: `import { useRef, useState } from 'react'
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

function OtpField({ form, name, groups = [6], separator = '-' }) {
  const otp = form.fieldController(name)
  const inputRefs = useRef([])

  if (!otp.visible) return null

  let offset = 0

  const setCharacters = (startIndex, input) => {
    const characters = input.replace(/\\D/g, '').slice(0, otp.otpLength - startIndex)

    characters.split('').forEach((character, localIndex) => {
      otp.setDigit(startIndex + localIndex, character)
    })

    if (characters.length > 0) {
      const nextIndex = Math.min(startIndex + characters.length, otp.otpLength - 1)
      queueMicrotask(() => inputRefs.current[nextIndex]?.focus())
    }
  }

  return (
    <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
      <legend style={{ marginBottom: 8 }}>
        {otp.label}{otp.required ? ' *' : ''}
      </legend>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {groups.map((size, groupIndex) => {
          const start = offset
          offset += size

          return (
            <div key={groupIndex} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {groupIndex > 0 ? <span aria-hidden>{separator}</span> : null}
              {Array.from({ length: size }, (_, localIndex) => {
                const index = start + localIndex

                return (
                  <input
                    key={index}
                    ref={(node) => {
                      inputRefs.current[index] = node
                      if (index === 0) otp.registerFocusable(node)
                    }}
                    aria-label={\`Character \${index + 1} of \${otp.otpLength}\`}
                    value={otp.digits[index] ?? ''}
                    inputMode="numeric"
                    autoComplete={index === 0 ? 'one-time-code' : 'off'}
                    maxLength={1}
                    disabled={otp.disabled}
                    onChange={(event) => setCharacters(index, event.target.value)}
                    onKeyDown={(event) => {
                      if (
                        event.key === 'Backspace' &&
                        !otp.digits[index] &&
                        index > 0
                      ) {
                        inputRefs.current[index - 1]?.focus()
                      }
                    }}
                    onPaste={(event) => {
                      event.preventDefault()
                      setCharacters(index, event.clipboardData.getData('text'))
                    }}
                    onBlur={otp.onBlur}
                    style={{
                      width: 42,
                      height: 48,
                      boxSizing: 'border-box',
                      textAlign: 'center',
                      fontSize: 20,
                      border: \`1px solid \${otp.error ? '#dc2626' : '#9ca3af'}\`,
                      borderRadius: 8,
                    }}
                  />
                )
              })}
            </div>
          )
        })}
      </div>
      {otp.error ? <p role="alert" style={{ color: '#dc2626' }}>{otp.error}</p> : null}
    </fieldset>
  )
}

export function OtpPlaygroundWeb() {
  const [submitted, setSubmitted] = useState<Record<string, unknown> | null>(null)
  const form = useFormBridge(schema, {
    validateOn: 'onChange',
  })
  const { Form, fieldController, state } = form
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
          <OtpField form={form} name="code" groups={[3, 3]} />
          <p style={{ margin: 0, color: '#4b5563' }}>
            Grouped progress: <strong>{code.length}</strong> / 6
          </p>
          <OtpField form={form} name="plainCode" />
          <p style={{ margin: 0, color: '#4b5563' }}>
            Plain progress: <strong>{plainCode.length}</strong> / 6
          </p>
          <button type="submit">Verify code</button>
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
      code: `import { useRef, useState } from 'react'
import { Button, ScrollView, Text, TextInput, View } from 'react-native'
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

function OtpField({ form, name, groups = [6], separator = '-' }) {
  const otp = form.fieldController(name)
  const inputRefs = useRef([])

  if (!otp.visible) return null

  let offset = 0

  const setCharacters = (startIndex, input) => {
    const characters = input.replace(/\\D/g, '').slice(0, otp.otpLength - startIndex)

    characters.split('').forEach((character, localIndex) => {
      otp.setDigit(startIndex + localIndex, character)
    })

    if (characters.length > 0) {
      const nextIndex = Math.min(startIndex + characters.length, otp.otpLength - 1)
      requestAnimationFrame(() => inputRefs.current[nextIndex]?.focus())
    }
  }

  return (
    <View style={{ gap: 8 }}>
      <Text>
        {otp.label}{otp.required ? ' *' : ''}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {groups.map((size, groupIndex) => {
          const start = offset
          offset += size

          return (
            <View
              key={groupIndex}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
            >
              {groupIndex > 0 ? <Text>{separator}</Text> : null}
              {Array.from({ length: size }, (_, localIndex) => {
                const index = start + localIndex

                return (
                  <TextInput
                    key={index}
                    ref={(node) => {
                      inputRefs.current[index] = node
                      if (index === 0) otp.registerFocusable(node)
                    }}
                    accessibilityLabel={\`Character \${index + 1} of \${otp.otpLength}\`}
                    value={otp.digits[index] ?? ''}
                    keyboardType="number-pad"
                    textContentType={index === 0 ? 'oneTimeCode' : 'none'}
                    editable={!otp.disabled}
                    onChangeText={(value) => setCharacters(index, value)}
                    onKeyPress={({ nativeEvent }) => {
                      if (
                        nativeEvent.key === 'Backspace' &&
                        !otp.digits[index] &&
                        index > 0
                      ) {
                        inputRefs.current[index - 1]?.focus()
                      }
                    }}
                    onBlur={otp.onBlur}
                    style={{
                      width: 42,
                      height: 48,
                      textAlign: 'center',
                      fontSize: 20,
                      borderWidth: 1,
                      borderColor: otp.error ? '#dc2626' : '#9ca3af',
                      borderRadius: 8,
                    }}
                  />
                )
              })}
            </View>
          )
        })}
      </View>
      {otp.error ? <Text style={{ color: '#dc2626' }}>{otp.error}</Text> : null}
    </View>
  )
}

export function OtpPlaygroundApp() {
  const [submitted, setSubmitted] = useState<Record<string, unknown> | null>(null)
  const form = useFormBridge(schema, {
    validateOn: 'onChange',
  })
  const { Form, fieldController, state } = form
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
            <OtpField form={form} name="code" groups={[3, 3]} />
            <Text style={{ color: '#4b5563' }}>
              Grouped progress: <Text style={{ fontWeight: '600' }}>{code.length}</Text> / 6
            </Text>
            <OtpField form={form} name="plainCode" />
            <Text style={{ color: '#4b5563' }}>
              Plain progress: <Text style={{ fontWeight: '600' }}>{plainCode.length}</Text> / 6
            </Text>
            <Button title="Verify code" onPress={() => void form.submit()} />
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

**Alphanumeric invitation code**

${FENCE}tsx InviteCode.tsx
const schema = {
  inviteCode: field.otp('Invitation code')
    .length(6)
    .alphanumeric()
    .required(),
}
${FENCE}

**Letters-only access code**

${FENCE}tsx AccessCode.tsx
const schema = {
  accessCode: field.otp('Access code')
    .length(4)
    .lettersOnly()
    .required(),
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

const form = useFormBridge(schema, {
  validateOn: 'onChange',
})
  const { Form, fieldController, state, submit } = form

useEffect(() => {
  if (state.values.code?.length === 6 && state.isValid) {
    submit()
  }
}, [state.values.code, state.isValid, submit])

<Form onSubmit={verifyCode}>
  <OtpField form={form} name="code" />
</Form>
${FENCE}`,
    },
  ],
};
