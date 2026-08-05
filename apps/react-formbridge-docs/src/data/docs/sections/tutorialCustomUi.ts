import type { LibraryDoc } from './../../../types/index';

export const tutorialCustomUiSection: LibraryDoc['sections'][number] = {
  id: 'fb-tutorial-custom-ui',
  title: 'Render your UI',
  content: `React FormBridge is headless: it does not generate inputs or impose a component library. Use \`fieldController(name)\` to connect schema-owned behavior to UI owned by your application.

- The controller exposes value, events, validation state, semantic metadata, visibility, and focus registration.
- Web and native share the schema, but each platform renders its own accessible controls.
- Put layout, styling, input variants, and design-system adapters in your UI layer.`,
  codeTabs: [
    {
      filename: 'TextField.web.tsx',
      lang: 'tsx',
      code: `import { field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  displayName: field.text('Display name').required().trim(),
}

function TextField({ controller }) {
  if (!controller.visible) return null

  return (
    <div style={{ display: 'grid', gap: 6 }}>
      <label htmlFor={controller.name}>
        {controller.label}{controller.required ? ' *' : ''}
      </label>
      <input
        id={controller.name}
        name={controller.name}
        ref={controller.registerFocusable}
        value={String(controller.value ?? '')}
        placeholder={controller.placeholder}
        disabled={controller.disabled}
        required={controller.required}
        aria-invalid={Boolean(controller.error)}
        onChange={(event) => controller.onChange(event.target.value)}
        onBlur={controller.onBlur}
        onFocus={controller.onFocus}
        style={{ padding: 10, borderRadius: 8, border: '1px solid #9ca3af' }}
      />
      {controller.error ? (
        <span role="alert" style={{ color: '#dc2626' }}>{controller.error}</span>
      ) : null}
    </div>
  )
}

export function TextFieldExample() {
  const form = useFormBridge(schema, {
    validateOn: 'onBlur',
    onSubmit: (values) => console.log(values),
  })

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit}
      style={{ display: 'grid', gap: 12, padding: 20, fontFamily: 'sans-serif' }}
    >
      <TextField controller={form.fieldController('displayName')} />
      <button type="submit">Save</button>
    </form>
  )
}`,
    },
    {
      filename: 'TextField.native.tsx',
      lang: 'tsx',
      code: `import { Button, Text, TextInput, View } from 'react-native'
import { field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  displayName: field.text('Display name').required().trim(),
}

function TextField({ controller }) {
  if (!controller.visible) return null

  return (
    <View style={{ gap: 6 }}>
      <Text>{controller.label}{controller.required ? ' *' : ''}</Text>
      <TextInput
        ref={controller.registerFocusable}
        value={String(controller.value ?? '')}
        placeholder={controller.placeholder}
        editable={!controller.disabled}
        onChangeText={controller.onChange}
        onBlur={controller.onBlur}
        onFocus={controller.onFocus}
        style={{ padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#9ca3af' }}
      />
      {controller.error ? (
        <Text accessibilityRole="alert" style={{ color: '#dc2626' }}>
          {controller.error}
        </Text>
      ) : null}
    </View>
  )
}

export function TextFieldExample() {
  const form = useFormBridge(schema, {
    validateOn: 'onBlur',
    onSubmit: (values) => console.log(values),
  })

  return (
    <View style={{ gap: 12, padding: 20 }}>
      <TextField controller={form.fieldController('displayName')} />
      <Button title="Save" onPress={() => void form.submit()} />
    </View>
  )
}`,
    },
  ],
  subsections: [
    {
      id: 'fb-tutorial-custom-ui-form',
      title: 'Compose a form',
      content: `Create controllers during render, pass them to your UI components, and submit with \`handleSubmit\` on web or \`submit\` on native. \`onSubmit\` belongs to the hook options; the submit helpers run the same validation pipeline.`,
      code: {
        filename: 'ProfileForm.web.tsx',
        lang: 'tsx',
        code: `import { field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  name: field.text('Name').required().trim(),
  email: field.email('Email').required(),
}

function TextField({ controller }) {
  if (!controller.visible) return null

  return (
    <label style={{ display: 'grid', gap: 6 }}>
      {controller.label}{controller.required ? ' *' : ''}
      <input
        value={String(controller.value ?? '')}
        disabled={controller.disabled}
        onChange={(event) => controller.onChange(event.target.value)}
        onBlur={controller.onBlur}
        style={{ padding: 10, borderRadius: 8, border: '1px solid #9ca3af' }}
      />
      {controller.error ? <span role="alert">{controller.error}</span> : null}
    </label>
  )
}

export function ProfileForm() {
  const form = useFormBridge(schema, {
    validateOn: 'onBlur',
    onSubmit: (values) => api.saveProfile(values),
  })

  return (
    <form onSubmit={form.handleSubmit} noValidate>
      <TextField controller={form.fieldController('name')} />
      <TextField controller={form.fieldController('email')} />
      <button type="submit" disabled={form.state.isSubmitting}>
        {form.state.isSubmitting ? 'Saving…' : 'Save'}
      </button>
    </form>
  )
}`,
      },
    },
    {
      id: 'fb-tutorial-custom-ui-adapters',
      title: 'Build design-system adapters',
      content: `Wrap \`fieldController()\` once per control family. A text adapter, checkbox adapter, select adapter, masked-input adapter, and file adapter are usually enough. This keeps form screens concise without coupling FormBridge itself to your UI kit.

Type-specific controllers add useful metadata:

- select/radio: \`options\`
- masked fields: \`displayValue\`, \`rawValue\`, \`maskComplete\`, \`format()\`, and \`unmask()\`
- OTP: \`otpLength\`, \`digits\`, \`setDigit()\`, \`clear()\`, and \`otpComplete\``,
    },
    {
      id: 'fb-tutorial-custom-field',
      title: 'Use field.custom() for a new value model',
      content: `\`field.custom(defaultValue)\` adds a typed value model to the schema. Rendering still happens through its controller, exactly like built-in fields.`,
      code: {
        filename: 'RatingField.tsx',
        lang: 'tsx',
        code: `import { field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  rating: field
    .custom(0)
    .label('Rating')
    .validate((value) => (value > 0 ? null : 'Pick a rating')),
}

function RatingField() {
  const form = useFormBridge(schema)
  const rating = form.fieldController('rating')

  return (
    <div>
      <p>{rating.label}</p>
      {[1, 2, 3, 4, 5].map((step) => (
        <button key={step} type="button" onClick={() => rating.onChange(step)}>
          {rating.value >= step ? '★' : '☆'}
        </button>
      ))}
      {rating.error ? <p role="alert">{rating.error}</p> : null}
    </div>
  )
}`,
      },
    },
  ],
};
