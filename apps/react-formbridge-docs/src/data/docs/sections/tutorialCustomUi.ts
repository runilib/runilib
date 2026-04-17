import type { LibraryDoc } from './../../../types/index';

export const tutorialCustomUiSection: LibraryDoc['sections'][number] = {
  id: 'fb-tutorial-custom-ui',
  title: 'Tutorial: custom UI & styling',
  content: `Generated fields are the default path, but the runtime still leaves room for design-system wrappers and fully bespoke inputs.

- Use \`fieldController(name)\` when the value model is still one of the built-in field types and you only want custom UI
- Use \`field.custom(defaultValue)\` when the field needs a new value model
- Keep styling in \`globalDefaults\`, local field overrides, or host components so the schema stays focused on behavior`,
  codeTabs: [
    {
      filename: 'CustomRenderedMask.web.tsx',
      lang: 'tsx',
      code: `const schema = {
  workspaceName: field.text('Workspace').required(),
  launchAccessCode: field
    .masked('OPS-9999-LL')
    .label('Launch access code')
    .placeholder('2048-QA')
    .hint('Rendered manually through form.fieldController(...).')
    .required()
    .validateComplete('Complete the launch access code.'),
}

export function MissionControlForm() {
  const form = useFormBridge(schema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
  })

  const accessCodeController = form.fieldController('launchAccessCode')

  return (
    <form.Form onSubmit={async (values) => api.save(values)}>
      <form.fields.workspaceName />
      <label htmlFor={accessCodeController.id}>{accessCodeController.label}</label>
      <input
        id={accessCodeController.id}
        ref={(node) => accessCodeController.registerFocusable(node)}
        value={String(accessCodeController.value ?? '').replace(/^OPS-/, '')}
        placeholder="2048-QA"
        disabled={accessCodeController.disabled}
        onChange={(event) => accessCodeController.onChange('OPS-' + event.target.value.toUpperCase())}
        onBlur={accessCodeController.onBlur}
        onFocus={accessCodeController.onFocus}
      />
      {accessCodeController.error ? <p>{accessCodeController.error}</p> : null}
      <button type="button" onClick={() => accessCodeController.focus()}>Focus code field</button>
      <form.Form.Submit>Save</form.Form.Submit>
    </form.Form>
  )
}`,
    },
    {
      filename: 'CustomRenderedMask.native.tsx',
      lang: 'tsx',
      code: `import { Text, TextInput, TouchableOpacity, View } from 'react-native'

const schema = {
  workspaceName: field.text('Workspace').required(),
  launchAccessCode: field
    .masked('OPS-9999-LL')
    .label('Launch access code')
    .placeholder('2048-QA')
    .hint('Rendered manually through form.fieldController(...).')
    .required()
    .validateComplete('Complete the launch access code.'),
}

export function MissionControlScreen() {
  const form = useFormBridge(schema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
  })

  const accessCode = form.fieldController('launchAccessCode')

  return (
    <form.Form onSubmit={async (values) => api.save(values)}>
      <View style={{ gap: 12, padding: 16 }}>
        <form.fields.workspaceName />
        <Text>{accessCode.label}</Text>
        <TextInput
          ref={(node) => accessCode.registerFocusable(node)}
          value={String(accessCode.value ?? '').replace(/^OPS-/, '')}
          placeholder="2048-QA"
          editable={!accessCode.disabled}
          onChangeText={(text) => accessCode.onChange('OPS-' + text.toUpperCase())}
          onBlur={accessCode.onBlur}
          onFocus={accessCode.onFocus}
        />
        {accessCode.error ? <Text>{accessCode.error}</Text> : null}
        <TouchableOpacity onPress={() => accessCode.focus()}>
          <Text>Focus code field</Text>
        </TouchableOpacity>
        <form.Form.Submit>Save</form.Form.Submit>
      </View>
    </form.Form>
  )
}`,
    },
  ],
  subsections: [
    {
      id: 'fb-tutorial-custom-field',
      title: 'Use field.custom() for new value models',
      content: `If the built-in field families are close but not quite right, keep the new value model typed in the schema and replace the renderer completely.`,
      code: {
        filename: 'CustomRating.tsx',
        lang: 'tsx',
        code: `const schema = {
  rating: field
    .custom(0)
    .label('Rating')
    .render(({ label, value, onChange, error }) => (
      <div>
        <p>{label}</p>
        {[1, 2, 3, 4, 5].map((step) => (
          <button key={step} type="button" onClick={() => onChange(step)}>
            {value >= step ? '★' : '☆'}
          </button>
        ))}
        {error ? <p>{error}</p> : null}
      </div>
    ))
    .validate((value) => (value > 0 ? null : 'Pick a rating')),
}`,
      },
    },
    {
      id: 'fb-tutorial-custom-styling',
      title: 'Style the same runtime in different ways',
      content: `The product shell can evolve without rewriting the field semantics. Keep styling in the UI layer and keep behavior in the schema.`,
      codeTabs: [
        {
          filename: 'StyledRecipe.web.tsx',
          lang: 'tsx',
          code: `import styled from 'styled-components'
import {
  FieldHost,
  FormHost,
  SubmitHost,
  field,
  useFormBridge,
} from '@runilib/react-formbridge'

const Shell = styled(FormHost)\`
  display: grid;
  gap: 14px;
\`

const EmailField = styled(FieldHost).attrs({
  inputProps: { autoComplete: 'email', inputMode: 'email' },
})\`
  & input {
    border-radius: 8px;
    border: 1px solid #cbd5e1;
  }
\`

const SubmitButton = styled(SubmitHost)\`
  border-radius: 8px;
  background: #2563eb;
  color: white;
\`

const schema = {
  email: field.email('Email').required(),
  password: field.password('Password').required(),
}

export function StyledRecipe() {
  const form = useFormBridge(schema)

  return (
    <Shell form={form.Form} onSubmit={async (values) => api.save(values)}>
      <EmailField field={form.fields.email} />
      <FieldHost field={form.fields.password} />
      <SubmitButton submit={form.Form.Submit}>Sign in</SubmitButton>
    </Shell>
  )
}`,
        },
        {
          filename: 'StyledRecipe.native.tsx',
          lang: 'tsx',
          code: `import styled from 'styled-components/native'
import {
  FieldHost,
  FormHost,
  SubmitHost,
  field,
  useFormBridge,
} from '@runilib/react-formbridge'

const StyledForm = styled(FormHost)\`
  gap: 16px;
\`

const EmailField = styled(FieldHost).attrs({
    inputProps: {
      autoComplete: 'email',
      keyboardType: 'email-address',
    },
    styles: {
      wrapper: { gap: 6 },
      input: {
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
      },
    },
})\`\`

const SubmitButton = styled(SubmitHost)\`
  border-radius: 8px;
  background: #2563eb;
\`

const schema = {
  email: field.email('Email').required(),
  password: field.password('Password').required(),
}

export function StyledRecipeScreen() {
  const form = useFormBridge(schema)

  return (
    <StyledForm form={form.Form} onSubmit={async (values) => api.save(values)}>
      <EmailField field={form.fields.email} />
      <FieldHost field={form.fields.password} />
      <SubmitButton submit={form.Form.Submit}>Sign in</SubmitButton>
    </StyledForm>
  )
}`,
        },
      ],
    },
  ],
};
