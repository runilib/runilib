import type { LibraryDoc } from './../../../types/index';
import {
  BASE_FIELD_BUILDER_REFERENCE,
  buildMethodsTable,
  FENCE,
  STRING_FIELD_BUILDER_REFERENCE,
} from '../constants';

const MASKED_METHODS_TABLE = buildMethodsTable([
  [
    '`storeRaw()`',
    '`() => this`',
    'Stores the unformatted raw payload instead of the masked value.',
  ],
  [
    '`storeMasked()`',
    '`() => this`',
    'Explicitly keeps the formatted masked value, which is the default behavior.',
  ],
  [
    '`showPlaceholder(char?)`',
    '`char?: string`',
    'Renders placeholder characters inside the current value.',
  ],
  [
    '`showMaskInPlaceholder(charOrText?)`',
    '`charOrText?: string`',
    'Renders the mask as placeholder text while keeping the actual value empty.',
  ],
  [
    '`tokens(map)`',
    '`map: Record<string, RegExp>`',
    'Adds or overrides token characters for advanced masks.',
  ],
  [
    '`validateComplete(message?)`',
    '`message?: string`',
    'Requires the entire mask to be filled before submit.',
  ],
]);

export const maskedSection: LibraryDoc['sections'][number] = {
  id: 'fb-masked',
  title: 'field.masked()',
  content: `String input constrained by a mask pattern or preset. Ideal for credit cards, expiry dates, ZIP codes, and formatted identifiers.

- First argument is required: a built-in \`MASKS\` preset, a raw pattern string, or a \`{ pattern, tokens }\` object
- Label the field separately with \`label(...)\` since the constructor takes the mask, not the label
- Your application-owned input chooses its width and input mode, while the controller formats and unmasks the value`,
  codeTabs: [
    {
      filename: 'Masked.web.tsx',
      label: 'Web',
      interactive: true,
      lang: 'tsx',
      code: `import { useState } from 'react'
import { MASKS, field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  cardNumber: field
    .masked(MASKS.CARD_16)
    .label('Card number')
    .required()
    .showMaskInPlaceholder()
    .validateComplete('Card is incomplete.'),

  licensePlate: field
    .masked('LL-999-LL')
    .label('License plate')
    .tokens({
      L: /[A-Z]/,
    })
    .uppercase(),
}

function MaskedField({ form, name, inputMode = 'text' }) {
  const masked = form.fieldController(name)

  if (!masked.visible) return null

  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <span>{masked.label}{masked.required ? ' *' : ''}</span>
      <input
        value={masked.displayValue}
        placeholder={masked.mask.placeholderText ?? masked.placeholder}
        inputMode={inputMode}
        disabled={masked.disabled}
        onChange={(event) => masked.onChange(event.target.value)}
        onFocus={masked.onFocus}
        onBlur={masked.onBlur}
        style={{
          padding: 10,
          border: \`1px solid \${masked.error ? '#dc2626' : '#9ca3af'}\`,
          borderRadius: 8,
          fontFamily: 'monospace',
          letterSpacing: 1,
        }}
      />
      <small style={{ color: masked.maskComplete ? '#15803d' : '#4b5563' }}>
        {masked.maskComplete ? 'Complete' : \`Expected format: \${masked.mask.placeholder}\`}
      </small>
      {masked.error ? <span role="alert" style={{ color: '#dc2626' }}>{masked.error}</span> : null}
    </label>
  )
}

export function MaskedPlaygroundWeb() {
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
        <h3 style={{ margin: '0 0 8px' }}>Interactive masked fields</h3>
        <p style={{ margin: 0, color: '#4b5563' }}>
          Try the card mask and the custom plate mask, then inspect the stored values.
        </p>
      </div>

      <Form
        onSubmit={async (values) => {
          setSubmitted(values)
        }}
      >
        <div style={{ display: 'grid', gap: 12 }}>
          <MaskedField form={form} name="cardNumber" inputMode="numeric" />
          <MaskedField form={form} name="licensePlate" />
          <button type="submit">Save values</button>
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
      filename: 'Masked.native.tsx',
      label: 'App',
      interactive: true,
      lang: 'tsx',
      code: `import { useState } from 'react'
import { Button, ScrollView, Text, TextInput, View } from 'react-native'
import { MASKS, field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  cardNumber: field
    .masked(MASKS.CARD_16)
    .label('Card number')
    .required()
    .showMaskInPlaceholder()
    .validateComplete('Card is incomplete.'),

  licensePlate: field
    .masked('LL-999-LL')
    .label('License plate')
    .tokens({
      L: /[A-Z]/,
    })
    .uppercase(),
}

function MaskedField({ form, name, keyboardType = 'default' }) {
  const masked = form.fieldController(name)

  if (!masked.visible) return null

  return (
    <View style={{ gap: 6 }}>
      <Text>{masked.label}{masked.required ? ' *' : ''}</Text>
      <TextInput
        value={masked.displayValue}
        placeholder={masked.mask.placeholderText ?? masked.placeholder}
        keyboardType={keyboardType}
        editable={!masked.disabled}
        onChangeText={masked.onChange}
        onFocus={masked.onFocus}
        onBlur={masked.onBlur}
        style={{
          padding: 10,
          borderWidth: 1,
          borderColor: masked.error ? '#dc2626' : '#9ca3af',
          borderRadius: 8,
          fontFamily: 'monospace',
          letterSpacing: 1,
        }}
      />
      <Text style={{ color: masked.maskComplete ? '#15803d' : '#4b5563' }}>
        {masked.maskComplete ? 'Complete' : \`Expected format: \${masked.mask.placeholder}\`}
      </Text>
      {masked.error ? <Text style={{ color: '#dc2626' }}>{masked.error}</Text> : null}
    </View>
  )
}

export function MaskedPlaygroundApp() {
  const [submitted, setSubmitted] = useState<Record<string, unknown> | null>(null)
  const form = useFormBridge(schema, {
    validateOn: 'onBlur',
  })
  const { Form, fieldController, state } = form

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f7fb' }}>
      <View style={{ padding: 16, gap: 16 }}>
        <View style={{ gap: 6 }}>
          <Text style={{ fontSize: 18, fontWeight: '600' }}>Interactive masked fields</Text>
          <Text style={{ color: '#4b5563' }}>
            Try the built-in card mask and the custom license-plate mask.
          </Text>
        </View>

        <Form
          onSubmit={async (values) => {
            setSubmitted(values)
          }}
        >
          <View style={{ gap: 12 }}>
            <MaskedField form={form} name="cardNumber" keyboardType="number-pad" />
            <MaskedField form={form} name="licensePlate" />
            <Button title="Save values" onPress={() => void form.submit()} />
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
      id: 'fb-masked-props',
      title: 'Defaults, inheritance & field methods',
      content: `- First argument is required: a \`MASKS\` preset, a custom pattern string, or a \`{ pattern, tokens }\` object
- defaultValue is \`''\`
- Masked values are stored by default (separators like \`/\`, \`-\`, spaces are preserved)
${BASE_FIELD_BUILDER_REFERENCE}
${STRING_FIELD_BUILDER_REFERENCE}

Mask-specific methods:
${MASKED_METHODS_TABLE}`,
    },
    {
      id: 'fb-masked-runtime',
      title: 'Adaptive mask runtime',
      content: `FormBridge exposes mask state and operations through \`form.fieldController(name)\`; your application renders the input.

- Bind the input to \`displayValue\` and forward changes to \`onChange()\`
- Use \`mask.placeholder\` / \`mask.placeholderText\` to describe the expected shape
- \`rawValue\`, \`maskComplete\`, \`format()\`, and \`unmask()\` are available for custom feedback
- Choose \`inputMode\`, keyboard type, width, and visual treatment in your own component

The examples above define a reusable application-owned \`MaskedField\`; no UI component is imported from FormBridge.`,
    },
    {
      id: 'fb-masked-recipes',
      title: 'Recipes',
      content: `Patterns that showcase mask-specific strengths.

**Credit card with placeholder**

${FENCE}tsx CardNumber.tsx
import { MASKS } from '@runilib/react-formbridge'

const schema = {
  cardNumber: field.masked(MASKS.CARD_16)
    .label('Card number')
    .required()
    .showMaskInPlaceholder()
    .validateComplete('Card number is incomplete.'),
}
${FENCE}

**Expiry + CVV side by side**

${FENCE}tsx ExpiryCvv.tsx
import { MASKS } from '@runilib/react-formbridge'

const schema = {
  expiry: field.masked(MASKS.EXPIRY).label('Expiry').required(),
  cvv: field.masked(MASKS.CVV).label('CVV').required(),
}
${FENCE}

**Raw backup code (strip separators)**

${FENCE}tsx BackupCode.tsx
const schema = {
  backupCode: field.masked('9999-9999')
    .label('Backup code')
    .storeRaw()
    .validateComplete(),
}
${FENCE}

**Custom plate with uppercase token**

${FENCE}tsx LicensePlate.tsx
const schema = {
  plate: field.masked('LL-999-LL')
    .label('Plate')
    .tokens({ L: /[A-Z]/ })
    .uppercase(),
}
${FENCE}

**French IBAN**

${FENCE}tsx IbanFr.tsx
import { MASKS } from '@runilib/react-formbridge'

const schema = {
  iban: field.masked(MASKS.IBAN_FR)
    .label('IBAN')
    .required()
    .validateComplete('IBAN is incomplete.'),
}
${FENCE}`,
    },
    {
      id: 'fb-masked-tokens',
      title: 'Pattern syntax',
      content: `- \`9\` = digit
- \`a\` = letter
- \`*\` = any character
- Any other character is treated as a visible separator
- Use \`tokens({...})\` to add custom mask characters such as \`L\` for uppercase-only letters`,
    },
    {
      id: 'fb-masked-presets',
      title: 'Built-in MASKS presets',
      content: `Pass any of these presets as \`field.masked(MASKS.X).label('Label')\`.

Cards
- \`CARD_16\` → \`9999 9999 9999 9999\`
- \`CARD_AMEX\` → \`9999 999999 99999\`
- \`CARD_19\` → \`9999 9999 9999 9999 999\`

Security / expiry
- \`CVV\` → \`999\`
- \`CVV_AMEX\` → \`9999\`
- \`EXPIRY\` → \`99/99\`

Date / time
- \`DATE_DMY\` → \`99/99/9999\`
- \`DATE_MDY\` → \`99/99/9999\`
- \`DATE_ISO\` → \`9999-99-99\`
- \`TIME_HM\` → \`99:99\`
- \`TIME_HMS\` → \`99:99:99\`
- \`DATETIME\` → \`99/99/9999 99:99\`

Bank / finance
- \`IBAN_FR\` → \`aa99 9999 9999 9999 9999 9999 999\`
- \`IBAN_DE\` → \`aa99 9999 9999 9999 9999 99\`
- \`IBAN_GB\` → \`aa99 aaaa 9999 9999 9999 99\`
- \`IBAN\` → \`aa99 9999 9999 9999 9999 9999 9999 99\`
- \`BANK_NZ\` → \`99-9999-9999999-99\`
- \`SIREN\` → \`999 999 999\`
- \`SIRET\` → \`999 999 999 99999\`

Postal / identity
- \`ZIP_FR\` → \`99999\`
- \`ZIP_US\` → \`99999\`
- \`ZIP_US_PLUS4\` → \`99999-9999\`
- \`POSTCODE_UK\` → \`aa9 9aa\`
- \`SSN\` → \`999-99-9999\`
- \`NIR_FR\` → \`9 99 99 99 999 999 99\`

Other
- \`IP_ADDRESS\` → \`999.999.999.999\`
- \`DURATION\` → \`99:99:99.999\`
- \`NUMBER_FR\` → \`9 999 999\``,
    },
  ],
};
