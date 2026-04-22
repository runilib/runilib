import type { LibraryDoc } from './../../../types/index';
import { BASE_FIELD_BUILDER_REFERENCE, buildMethodsTable, FENCE } from '../constants';

const PHONE_METHODS_TABLE = buildMethodsTable([
  ['`defaultCountry(code)`', '`code: string`', 'Sets the initial selected country.'],
  [
    '`preferredCountries(codes)`',
    '`codes: string[]`',
    'Shortlists countries shown at the top of the picker.',
  ],
  [
    '`searchable(value = true)`',
    '`value?: boolean`',
    'Enables country search inside the picker.',
  ],
  ['`showFlag(value = true)`', '`value?: boolean`', 'Shows or hides the country flag.'],
  [
    '`showDialCode(value = true)`',
    '`value?: boolean`',
    'Shows or hides the dial code prefix.',
  ],
  [
    '`countryLayout(layout)`',
    "`'integrated' | 'detached'`",
    'Chooses whether the country selector sits **inside** the same bordered shell as the input (`integrated`, default) or as a **separate** button before it (`detached`). Drives both the default styling and a `data-fb-layout` attribute you can target in CSS.',
  ],
  [
    '`storeE164()`',
    '`() => this`',
    'Stores a normalized E.164 string (e.g. `+33612345678`) instead of the richer `{ country, national, e164 }` phone payload. Use this when the backend expects a flat string.',
  ],
  [
    '`validateFormat(value = true)`',
    '`value?: boolean`',
    'Enables libphonenumber-based format validation. Adds three sequential checks: `isPossible()`, `isValid()`, and a format parse - each with its own error message. Disable with `validateFormat(false)` if you need lenient input.',
  ],
]);

export const phoneSection: LibraryDoc['sections'][number] = {
  id: 'fb-phone',
  title: 'field.phone()',
  content: `Country-aware phone builder with flag selector, dial codes, format validation, and E.164 storage.

- For a basic phone text input without country metadata, use \`field.tel()\` instead
- The renderer shows a country picker with flags, dial codes, and optional search
- \`storeE164()\` normalizes the output to \`+33612345678\` format for API consumption`,
  codeTabs: [
    {
      filename: 'Phone.web.tsx',
      label: 'Web',
      interactive: true,
      lang: 'tsx',
      code: `import { useState } from 'react'
import { field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  phone: field.phone('Phone')
    .defaultCountry('FR')
    .preferredCountries(['FR', 'US', 'GB'])
    .searchable()
    .showFlag(true)
    .showDialCode(true)
    .storeE164()
    .required(),
}

export function PhonePlaygroundWeb() {
  const [submitted, setSubmitted] = useState<Record<string, unknown> | null>(null)
  const { Form, fields, state } = useFormBridge(schema, {
    validateOn: 'onBlur',
  })

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
        <h3 style={{ margin: '0 0 8px' }}>Interactive phone field</h3>
        <p style={{ margin: 0, color: '#4b5563' }}>
          Switch country, type a number, then submit to inspect the E.164 payload.
        </p>
      </div>

      <Form
        onSubmit={async (values) => {
          setSubmitted(values)
        }}
      >
        <div style={{ display: 'grid', gap: 12 }}>
          <fields.phone />
          <Form.Submit>Save phone</Form.Submit>
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
      filename: 'Phone.native.tsx',
      label: 'App',
      interactive: true,
      lang: 'tsx',
      code: `import { useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  phone: field.phone('Phone')
    .defaultCountry('FR')
    .preferredCountries(['FR', 'US', 'GB'])
    .searchable()
    .showFlag(true)
    .showDialCode(true)
    .storeE164()
    .required(),
}

export function PhonePlaygroundApp() {
  const [submitted, setSubmitted] = useState<Record<string, unknown> | null>(null)
  const { Form, fields, state } = useFormBridge(schema, {
    validateOn: 'onBlur',
  })

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f7fb' }}>
      <View style={{ padding: 16, gap: 16 }}>
        <View style={{ gap: 6 }}>
          <Text style={{ fontSize: 18, fontWeight: '600' }}>Interactive phone field</Text>
          <Text style={{ color: '#4b5563' }}>
            Change country, enter a number, then submit to inspect the E.164 value.
          </Text>
        </View>

        <Form
          onSubmit={async (values) => {
            setSubmitted(values)
          }}
        >
          <View style={{ gap: 12 }}>
            <fields.phone />
            <Form.Submit>Save phone</Form.Submit>
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
      id: 'fb-phone-props',
      title: 'Defaults, inheritance & field methods',
      content: `- defaultValue is \`null\`
- type is \`phone\`
- placeholder defaults to \`'Enter phone number'\`
- debounce defaults to \`0\` for immediate formatting feedback
- default country is \`'FR'\`, preferred countries default to \`['FR', 'US', 'GB', 'DE', 'ES']\`
${BASE_FIELD_BUILDER_REFERENCE}

Phone-specific methods:
${PHONE_METHODS_TABLE}`,
    },
    {
      id: 'fb-phone-recipes',
      title: 'Recipes',
      content: `Patterns that showcase phone-specific strengths.

**International signup**

${FENCE}tsx InternationalSignup.tsx
const schema = {
  phone: field.phone('Phone')
    .defaultCountry('FR')
    .preferredCountries(['FR', 'US', 'GB'])
    .searchable()
    .showFlag(true)
    .showDialCode(true),
}
${FENCE}

**API-ready E.164 output**

${FENCE}tsx E164Phone.tsx
const schema = {
  phone: field.phone('Phone')
    .storeE164()
    .required()
    .validateFormat(true),
}
${FENCE}

**US-only customer support**

${FENCE}tsx UsSupport.tsx
const schema = {
  phone: field.phone('Phone')
    .defaultCountry('US')
    .preferredCountries(['US'])
    .showDialCode(false)
    .validateFormat(),
}
${FENCE}

**Disabled display field**

${FENCE}tsx SupportLine.tsx
const schema = {
  supportLine: field.phone('Support line')
    .defaultCountry('US')
    .disabled()
    .hint('Managed by your account team'),
}
${FENCE}`,
    },
  ],
};
