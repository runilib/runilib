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
      code: `export function TextField({ controller }) {
  if (!controller.visible) return null

  return (
    <div className="field">
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
      />
      {controller.error ? <p role="alert">{controller.error}</p> : null}
    </div>
  )
}`,
    },
    {
      filename: 'TextField.native.tsx',
      lang: 'tsx',
      code: `import { Text, TextInput, View } from 'react-native'

export function TextField({ controller }) {
  if (!controller.visible) return null

  return (
    <View>
      <Text>{controller.label}{controller.required ? ' *' : ''}</Text>
      <TextInput
        ref={controller.registerFocusable}
        value={String(controller.value ?? '')}
        placeholder={controller.placeholder}
        editable={!controller.disabled}
        onChangeText={controller.onChange}
        onBlur={controller.onBlur}
        onFocus={controller.onFocus}
      />
      {controller.error ? <Text accessibilityRole="alert">{controller.error}</Text> : null}
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
import { TextField } from './TextField'

const schema = {
  name: field.text('Name').required().trim(),
  email: field.email('Email').required(),
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
        code: `const schema = {
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
