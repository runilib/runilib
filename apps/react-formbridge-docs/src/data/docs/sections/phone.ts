import type { LibraryDoc } from './../../../types/index';
import { BASE_FIELD_BUILDER_REFERENCE, buildMethodsTable, FENCE } from '../constants';

const PHONE_TEXT_OVERRIDES_TABLE = buildMethodsTable([
  [
    '`countryButtonAriaLabel`',
    '`string | (ctx) => string`',
    'Accessibility label for the country-picker trigger button. Receives the current render context (current country, open state, search, …).',
  ],
  [
    '`searchPlaceholderText`',
    '`string | (ctx) => string`',
    "Placeholder for the country-search input inside the picker. Defaults to `'Search country…'`.",
  ],
  [
    '`emptySearchText`',
    '`string | (ctx) => string`',
    "Text shown when the search query matches no countries. Defaults to `'No countries match \"<query>\".'` / `'No countries available.'`.",
  ],
  [
    '`e164Text`',
    '`string | (ctx & { e164 }) => string`',
    'Opt-in label rendered alongside the E.164 preview. Only shown when `e164Text` or `renderE164` is provided.',
  ],
]);

const PHONE_RENDER_OVERRIDES_TABLE = buildMethodsTable([
  [
    '`renderCountryButtonContent`',
    '`(ctx & { defaultContent }) => ReactNode`',
    'Full renderer for the country-picker trigger content (flag, dial code, chevron). `defaultContent` contains the built-in layout so you can wrap it.',
  ],
  [
    '`renderCountryItemContent`',
    '`(ctx & { country, defaultContent, index, selected }) => ReactNode`',
    'Full renderer for a single row in the country list. Useful to add a "selected" checkmark or a custom layout.',
  ],
  [
    '`renderEmptySearchContent`',
    '`(ctx & { defaultContent }) => ReactNode`',
    'Full renderer for the "no results" state shown inside the picker.',
  ],
  [
    '`renderE164`',
    '`(ctx & { defaultContent, e164 }) => ReactNode`',
    'Opt-in full renderer for the E.164 preview below the input. Only shown when `e164Text` or `renderE164` is provided.',
  ],
  [
    '`renderLabel` / `renderHint` / `renderError` / `renderRequiredMark`',
    '`(ctx) => ReactNode`',
    'Inherited from every field - replace the label, hint, error, or required-mark rendering entirely.',
  ],
]);

const PHONE_PASSTHROUGH_TABLE = buildMethodsTable([
  [
    '`inputProps`',
    'Web: `InputHTMLAttributes` · Native: `TextInputProps`',
    'Passthrough attributes for the phone-number input itself (`aria-*`, `data-*`, `onKeyDown`, `testID`, …).',
  ],
  [
    '`searchInputProps`',
    'Web: `InputHTMLAttributes` · Native: `TextInputProps`',
    'Passthrough attributes for the country-search input inside the picker.',
  ],
  [
    '`wrapperProps` / `labelProps` / `hintProps` / `errorProps`',
    'Platform-native props',
    'Passthrough props for the wrapper, label, hint, and error elements. Each merges its `style` with the default.',
  ],
  [
    '`hideLabel`',
    '`boolean`',
    'Hides the visible label while keeping the accessible name via `aria-label` / `accessibilityLabel`.',
  ],
  [
    '`countryLayout`',
    "`'integrated' | 'detached'`",
    'Same as the builder method but at the render site. Takes precedence over the schema value for this specific render.',
  ],
  [
    '`styles`',
    'Record of slot → style',
    'Per-slot style overrides (see the **Style keys** section below). Each slot is merged **over** the built-in default, so you can tweak a single property or replace it entirely.',
  ],
]);

const PHONE_STYLE_KEYS_NATIVE = buildMethodsTable([
  ['`wrapper`', 'ViewStyle', 'Outer field container.'],
  ['`label`', 'TextStyle', 'Field label.'],
  ['`requiredMark`', 'TextStyle', 'The asterisk shown next to required labels.'],
  ['`hint`', 'TextStyle', 'Helper text below the input.'],
  ['`error`', 'TextStyle', 'Error text shown below the input.'],
  ['`phoneRow`', 'ViewStyle', 'Row wrapping the country button + phone input.'],
  ['`phoneCountryButton`', 'ViewStyle', 'The picker trigger button.'],
  ['`phoneCountryFlag`', 'TextStyle', 'Flag emoji inside the trigger and country rows.'],
  ['`phoneCountryDial`', 'TextStyle', 'Dial-code text (e.g. `+33`).'],
  [
    '`phoneCountryDivider`',
    'ViewStyle',
    'Vertical divider between the country button and input in the `integrated` layout.',
  ],
  ['`phoneChevron`', 'TextStyle', 'Chevron glyph inside the trigger.'],
  ['`phoneInput`', 'TextStyle', 'The phone-number `TextInput`.'],
  ['`phoneE164`', 'TextStyle', 'The opt-in E.164 preview text.'],
  ['`phoneModalBackdrop`', 'ViewStyle', 'Dimmed overlay behind the country picker.'],
  ['`phoneModalCard`', 'ViewStyle', 'The modal card that contains the country list.'],
  ['`phoneSearchInput`', 'TextStyle', 'Country-search input inside the picker.'],
  ['`phoneCountryRow`', 'ViewStyle', 'One row in the country list.'],
  ['`phoneCountryName`', 'TextStyle', 'Country name inside a row.'],
  [
    '`phoneSeparator`',
    'ViewStyle',
    'The separator between preferred countries and the rest of the list.',
  ],
  ['`phoneEmptyText`', 'TextStyle', 'Empty-state text when no countries match.'],
]);

const PHONE_STYLE_KEYS_WEB = buildMethodsTable([
  ['`wrapper`', 'CSSProperties', 'Outer field container.'],
  ['`label`', 'CSSProperties', 'Field label.'],
  ['`requiredMark`', 'CSSProperties', 'The asterisk shown next to required labels.'],
  ['`hint`', 'CSSProperties', 'Helper text below the input.'],
  ['`error`', 'CSSProperties', 'Error text shown below the input.'],
  ['`phoneRow`', 'CSSProperties', 'Row wrapping the country button + phone input.'],
  ['`phoneCountryButton`', 'CSSProperties', 'The picker trigger button.'],
  [
    '`phoneCountryFlag`',
    'CSSProperties',
    'Flag glyph inside the trigger and country rows.',
  ],
  ['`phoneCountryDial`', 'CSSProperties', 'Dial-code text (e.g. `+33`).'],
  [
    '`phoneCountryDivider`',
    'CSSProperties',
    'Vertical divider between the country button and input in the `integrated` layout.',
  ],
  ['`phoneChevron`', 'CSSProperties', 'Chevron glyph inside the trigger.'],
  ['`phoneInput`', 'CSSProperties', 'The phone-number `<input>`.'],
  ['`phoneE164`', 'CSSProperties', 'The opt-in E.164 preview text.'],
  ['`phoneSearchWrapper`', 'CSSProperties', 'Wrapper around the country-search input.'],
  ['`phoneSearchInput`', 'CSSProperties', 'Country-search `<input>`.'],
  ['`phoneCountryList`', 'CSSProperties', 'Outer container of the country list popup.'],
  [
    '`phoneCountryScroll`',
    'CSSProperties',
    'Scrollable container holding the country rows.',
  ],
  ['`phoneCountryItem`', 'CSSProperties', 'One row in the country list.'],
  ['`phoneCountryName`', 'CSSProperties', 'Country name inside a row.'],
  [
    '`phoneSeparator`',
    'CSSProperties',
    'The separator between preferred countries and the rest of the list.',
  ],
  ['`phoneEmptyText`', 'CSSProperties', 'Empty-state text when no countries match.'],
]);

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
      id: 'fb-phone-overrides',
      title: 'Per-render props (text, render, passthroughs)',
      content: `Beyond the builder methods above, every \`<fields.phone />\` renderer accepts props to customize copy, swap rendering, or forward attributes to the underlying inputs. Pass them directly on the rendered field:

${FENCE}tsx
<fields.phone
  searchPlaceholderText="Search a country…"
  emptySearchText={({ search }) => \`No match for "\${search}"\`}
  renderCountryItemContent={({ country, defaultContent, selected }) => (
    <>
      {defaultContent}
      {selected ? <span>✓</span> : null}
    </>
  )}
  inputProps={{ 'aria-describedby': 'phone-help' }}
/>
${FENCE}

**Text overrides** — each accepts a plain string or a function that receives the render context (current country, open state, search query, …).

${PHONE_TEXT_OVERRIDES_TABLE}

**Render overrides** — each receives a \`defaultContent\` node so you can wrap the built-in UI or replace it entirely.

${PHONE_RENDER_OVERRIDES_TABLE}

**Passthrough props & layout**

${PHONE_PASSTHROUGH_TABLE}`,
    },
    {
      id: 'fb-phone-style-keys',
      title: 'Style keys',
      content: `The \`styles\` prop accepts an object keyed by renderer slot. Each entry is merged **over** the built-in default for that slot, so you can tweak one property or replace it.

${FENCE}tsx
<fields.phone
  styles={{
    phoneModalCard: { borderRadius: 20, padding: 16 },
    phoneCountryRow: { paddingVertical: 16 },
    phoneCountryName: { fontWeight: '600' },
  }}
/>
${FENCE}

**Native slots** (\`ViewStyle\` / \`TextStyle\`)

${PHONE_STYLE_KEYS_NATIVE}

**Web slots** (\`CSSProperties\`)

${PHONE_STYLE_KEYS_WEB}`,
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
