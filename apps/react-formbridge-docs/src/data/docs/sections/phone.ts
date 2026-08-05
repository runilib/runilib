import type { LibraryDoc } from './../../../types/index';
import { BASE_FIELD_BUILDER_REFERENCE, buildMethodsTable, FENCE } from '../constants';

const PHONE_METHODS_TABLE = buildMethodsTable([
  ['`defaultCountry(code)`', '`code: string`', 'Sets the initial selected country.'],
  [
    '`preferredCountries(codes)`',
    '`codes: string[]`',
    'Stores the preferred-country configuration for a country-aware phone experience.',
  ],
  [
    '`searchable(value = true)`',
    '`value?: boolean`',
    'Stores whether the application-owned country picker should offer search.',
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
    'Describes whether your country selector should sit inside the input shell (`integrated`, default) or as a separate control (`detached`).',
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
  content: `Country-aware phone value and validation builder. Your application owns the country picker and input UI.

- For a basic phone text input without country metadata, use \`field.tel()\` instead
- Build a web/native \`PhoneField\` from \`form.fieldController(name)\` and your country data
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

const COUNTRIES = [
  { code: 'FR', flag: '🇫🇷', dial: '+33', name: 'France' },
  { code: 'US', flag: '🇺🇸', dial: '+1', name: 'United States' },
  { code: 'GB', flag: '🇬🇧', dial: '+44', name: 'United Kingdom' },
]

function PhoneField({ form, name }) {
  const phone = form.fieldController(name)
  const [countryCode, setCountryCode] = useState('FR')
  const country = COUNTRIES.find((item) => item.code === countryCode) ?? COUNTRIES[0]
  const storedValue = String(phone.value ?? '')
  const national = storedValue.startsWith(country.dial)
    ? storedValue.slice(country.dial.length)
    : storedValue.replace(/^\\+\\d{1,3}/, '')

  if (!phone.visible) return null

  const updateValue = (dial, value) => {
    const digits = value.replace(/\\D/g, '')
    phone.onChange(digits ? dial + digits : '')
  }

  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <span>{phone.label}{phone.required ? ' *' : ''}</span>
      <span style={{ display: 'flex' }}>
        <select
          aria-label="Country"
          value={country.code}
          disabled={phone.disabled}
          onChange={(event) => {
            const next = COUNTRIES.find((item) => item.code === event.target.value)
            if (!next) return
            setCountryCode(next.code)
            updateValue(next.dial, national)
          }}
          style={{ borderRadius: '8px 0 0 8px', padding: 10 }}
        >
          {COUNTRIES.map((item) => (
            <option key={item.code} value={item.code}>
              {item.flag} {item.name} ({item.dial})
            </option>
          ))}
        </select>
        <input
          aria-label={phone.label}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          value={national}
          placeholder="6 12 34 56 78"
          disabled={phone.disabled}
          onChange={(event) => updateValue(country.dial, event.target.value)}
          onFocus={phone.onFocus}
          onBlur={phone.onBlur}
          style={{
            minWidth: 0,
            flex: 1,
            padding: 10,
            border: \`1px solid \${phone.error ? '#dc2626' : '#9ca3af'}\`,
            borderRadius: '0 8px 8px 0',
          }}
        />
      </span>
      {storedValue ? <small>Stored as {storedValue}</small> : null}
      {phone.error ? <span role="alert" style={{ color: '#dc2626' }}>{phone.error}</span> : null}
    </label>
  )
}

export function PhonePlaygroundWeb() {
  const [submitted, setSubmitted] = useState<Record<string, unknown> | null>(null)
  const form = useFormBridge(schema, {
    validateOn: 'onBlur',
  })
  const { Form, fieldController, state } = form

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
          <PhoneField form={form} name="phone" />
          <button type="submit">Save phone</button>
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
import { Button, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
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

const COUNTRIES = [
  { code: 'FR', flag: '🇫🇷', dial: '+33', name: 'France' },
  { code: 'US', flag: '🇺🇸', dial: '+1', name: 'United States' },
  { code: 'GB', flag: '🇬🇧', dial: '+44', name: 'United Kingdom' },
]

function PhoneField({ form, name }) {
  const phone = form.fieldController(name)
  const [countryIndex, setCountryIndex] = useState(0)
  const country = COUNTRIES[countryIndex]
  const storedValue = String(phone.value ?? '')
  const national = storedValue.startsWith(country.dial)
    ? storedValue.slice(country.dial.length)
    : storedValue.replace(/^\\+\\d{1,3}/, '')

  if (!phone.visible) return null

  const updateValue = (dial, value) => {
    const digits = value.replace(/\\D/g, '')
    phone.onChange(digits ? dial + digits : '')
  }

  const selectNextCountry = () => {
    const nextIndex = (countryIndex + 1) % COUNTRIES.length
    const next = COUNTRIES[nextIndex]
    setCountryIndex(nextIndex)
    updateValue(next.dial, national)
  }

  return (
    <View style={{ gap: 6 }}>
      <Text>{phone.label}{phone.required ? ' *' : ''}</Text>
      <View style={{ flexDirection: 'row' }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Change country"
          disabled={phone.disabled}
          onPress={selectNextCountry}
          style={{
            justifyContent: 'center',
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: '#9ca3af',
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
          }}
        >
          <Text>{country.flag} {country.dial} ▾</Text>
        </Pressable>
        <TextInput
          accessibilityLabel={phone.label}
          value={national}
          placeholder="6 12 34 56 78"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          editable={!phone.disabled}
          onChangeText={(value) => updateValue(country.dial, value)}
          onFocus={phone.onFocus}
          onBlur={phone.onBlur}
          style={{
            minWidth: 0,
            flex: 1,
            padding: 10,
            borderWidth: 1,
            borderLeftWidth: 0,
            borderColor: phone.error ? '#dc2626' : '#9ca3af',
            borderTopRightRadius: 8,
            borderBottomRightRadius: 8,
          }}
        />
      </View>
      {storedValue ? <Text>Stored as {storedValue}</Text> : null}
      {phone.error ? <Text style={{ color: '#dc2626' }}>{phone.error}</Text> : null}
    </View>
  )
}

export function PhonePlaygroundApp() {
  const [submitted, setSubmitted] = useState<Record<string, unknown> | null>(null)
  const form = useFormBridge(schema, {
    validateOn: 'onBlur',
  })
  const { Form, fieldController, state } = form

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
            <PhoneField form={form} name="phone" />
            <Button title="Save phone" onPress={() => void form.submit()} />
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
      id: 'fb-phone-headless-ui',
      title: 'Render a country-aware input',
      content: `FormBridge no longer renders a country picker. Keep the schema responsible for the phone value, required state, E.164 storage, and format validation; keep flags, country search, modal/popover behavior, and styling in an application-owned \`PhoneField\`.

The interactive examples above use a small local country list. In production, that list can come from your localization layer or phone-input package. Forward the resulting E.164 string to \`controller.onChange()\` when using \`storeE164()\`. Without \`storeE164()\`, forward the \`PhoneValue\` shape expected by the schema.`,
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
