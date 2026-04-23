import type { LibraryDoc } from './../../../types/index';
import {
  GLOBAL_UI_SURFACE,
  HOST_HELPERS_SURFACE,
  NATIVE_SLOT_SURFACE,
  WEB_SLOT_SURFACE,
} from '../constants';

export const webUiSection: LibraryDoc['sections'][number] = {
  id: 'fb-web-ui',

  title: 'Styling',
  content: `react-formbridge is intentionally styling-framework agnostic. The form runtime owns value, validation, visibility, and submit lifecycle. Your app stays free to style that runtime with CSS Modules, styled-components, Tailwind-style utilities, inline objects, React Native StyleSheet, NativeWind-friendly wrappers, or an in-house design system.

- Put field-owned behavior metadata in the schema when it should travel with the field everywhere the schema is reused
- Put styling in \`useFormBridge(schema, { globalDefaults })\` when one screen, one route, or one product area needs a shared visual language
- Put styling directly on \`<fields.name classNames={...} styles={...} />\` when a single field needs a local exception, and let the generated field type decide which override props are available
- Reach for \`form.fieldController(name)\` when a built-in field needs fully custom chrome; reach for \`field.custom(...).render(...)\` only when the value model itself is no longer one of the built-in field types`,
  codeTabs: [
    {
      filename: 'SharedTheme.web.tsx',
      lang: 'tsx',
      code: `import { field, useFormBridge } from '@runilib/react-formbridge'
import styles from './Checkout.module.css'

const schema = {
  projectName: field
    .text('Project name')
    .required()
    .placeholder('Billing redesign'),
  ownerEmail: field
    .email('Owner email')
    .required()
  launchNotes: field
    .textarea('Launch notes')
    .hint('Textarea inherits the same shared theme.'),
}

export function CheckoutForm() {
  const form = useFormBridge(schema, {
    validateOn: 'onTouched',
    globalDefaults: () => ({
      form: { className: styles.form },
      submit: {
        className: styles.submit,
        loadingText: 'Saving...',
      },
      field: {
          classNames: {
            wrapper: styles.field,
            label: styles.label,
            textInput: styles.input,
            textarea: styles.input,
            error: styles.error,
            hint: styles.hint,
        },
      },
    }),
  })

  return (
    <form.Form onSubmit={saveCheckout}>
      <form.fields.projectName />
      <form.fields.ownerEmail
        styles={{
            textInput: { borderColor: '#38bdf8' },
        }}
      />
      <form.fields.launchNotes />
      <form.Form.Submit>Save theme</form.Form.Submit>
    </form.Form>
  )
}`,
    },
    {
      filename: 'SharedTheme.native.tsx',
      lang: 'tsx',
      code: `import { ScrollView, StyleSheet, View } from 'react-native'
import { field, useFormBridge } from '@runilib/react-formbridge'

const checkoutUi = StyleSheet.create({
  stack: { gap: 14, padding: 16 },
  fieldRoot: { marginBottom: 0, gap: 8 },
  fieldLabel: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  fieldInput: {
    minHeight: 52,
    borderWidth: 1.5,
    borderColor: 'rgba(125, 211, 252, 0.18)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#f8fafc',
    backgroundColor: 'rgba(15, 23, 42, 0.62)',
  },
  fieldHint: { color: '#94a3b8', fontSize: 12 },
  fieldError: { color: '#fda4af', fontSize: 12, fontWeight: '700' },
  submitButton: { minHeight: 52, borderRadius: 18, backgroundColor: '#38bdf8' },
  submitText: { color: '#06202f', fontWeight: '800' },
})

const schema = {
  projectName: field.text('Project name')
    .required()
  ownerEmail: field
    .email('Owner email')
    .required()
  launchNotes: field
    .textarea('Launch notes')
    .hint('Textarea inherits the same shared theme.'),
}

export function CheckoutScreen() {
  const form = useFormBridge(schema, {
    globalDefaults: () => ({
      submit: {
        containerStyle: checkoutUi.submitButton,
        textStyle: checkoutUi.submitText,
        loadingText: 'Saving...',
      },
      field: {
          styles: {
            wrapper: checkoutUi.fieldRoot,
            label: checkoutUi.fieldLabel,
            textInput: checkoutUi.fieldInput,
            hint: checkoutUi.fieldHint,
            error: checkoutUi.fieldError,
          },
      },
    }),
  })

  return (
    <ScrollView>
      <form.Form onSubmit={saveCheckout}>
        <View style={checkoutUi.stack}>
          <form.fields.projectName />
          <form.fields.ownerEmail />
          <form.fields.launchNotes
            styles={{
                textInput: { minHeight: 112 }
            }}
          />
          <form.Form.Submit>Save theme</form.Form.Submit>
        </View>
      </form.Form>
    </ScrollView>
  )
}`,
    },
  ],
  subsections: [
    {
      id: 'fb-web-ui-layers',
      title: 'Choose the right layer',
      content: `
1. Use \`useFormBridge(schema, { globalDefaults })\` when a whole screen or product area needs the same theme. This is the default recommendation for CSS Modules, StyleSheet, utility-class maps, or design-system-wide field chrome.
2. Use local props on \`<fields.name classNames={...} />\` when one field needs a special variant without mutating the shared schema.
3. Use \`form.fieldController(name)\` when a built-in field needs a fully custom trigger, shell, or modal while keeping the same schema contract. Use \`field.custom(defaultValue).render(...)\` only when the value model itself is custom.

The public type surface guards these layers too: a text field does not expose textarea-only or select-only props, and native fields do not expose web-only props such as \`className\`.

Merge order is predictable: builder \`behavior\` → \`globalDefaults\` → local field props → field controller or custom render layer.`,
    },
    {
      id: 'fb-web-ui-global-ui',
      title: 'globalDefaults surface',
      content: `${GLOBAL_UI_SURFACE}`,
    },
    {
      id: 'fb-web-ui-typing',
      title: 'Typing rules',
      content: `| Field family | Override prop | Platform |
| --- | --- | --- |
| Text-like fields | \`inputProps\` | Web + Native |
| \`textarea\` fields | \`textareaProps\` | Web only |
| \`select\` fields | \`selectProps\` | Web only |
| Web fields | \`classNames\` / \`styles\` slot maps | Web only |
| Native fields | \`className\`, \`textareaProps\`, \`selectProps\` | Not exposed |`,
    },
    {
      id: 'fb-web-ui-css-modules',
      title: 'Recipe: shared theme with CSS Modules or StyleSheet',
      content: `This is the most common production setup.

- One \`globalDefaults\` object themes the form wrapper, every generated field, and the submit button
- The schema stays reusable across pages because the visual system lives at the screen level
- You still keep an escape hatch for one field with local prop overrides`,
      codeTabs: [
        {
          filename: 'CssModulesTheme.web.tsx',
          lang: 'tsx',
          code: `const form = useFormBridge(schema, {
  globalDefaults: () => ({
    form: { className: styles.formShell },
    submit: {
      className: styles.submitButton,
      loadingText: 'Applying CSS Modules theme...',
    },
    field: {
        classNames: {
          wrapper: styles.formField,
          label: styles.formLabel,
          textInput: styles.formInput,
          textarea: styles.formInput,
          select: styles.formInput,
          hint: styles.helperText,
          error: styles.errorBox,
        },    },
  }),
})

<form.Form onSubmit={save}>
  <form.fields.projectName />
  <form.fields.ownerEmail
    styles={{
        textInput: { borderColor: '#38bdf8' },
    }}
  />
  <form.fields.department />
  <form.Form.Submit>Save CSS recipe</form.Form.Submit>
</form.Form>`,
        },
        {
          filename: 'StyleSheetTheme.native.tsx',
          lang: 'tsx',
          code: `const form = useFormBridge(schema, {
  globalDefaults: () => ({
    field: {
        styles: {
          wrapper: s.fieldRoot,
          label: s.fieldLabel,
          textInput: s.fieldInput,
          hint: s.fieldHint,
          error: s.fieldError,
          selectTrigger: s.fieldInput,
        },
      },
    submit: {
      containerStyle: s.submitButton,
      textStyle: s.submitText,
      loadingText: 'Applying StyleSheet theme...',
    },
  }),
})

<form.Form onSubmit={save}>
  <View style={s.stack}>
    <form.fields.projectName />
    <form.fields.ownerEmail />
    <form.fields.department />
    <form.Form.Submit>Save native recipe</form.Form.Submit>
  </View>
</form.Form>`,
        },
      ],
    },
    {
      id: 'fb-web-ui-hosts',
      title: 'Host helpers: FieldHost, SubmitHost, FormHost',
      content: `react-formbridge now exports official host components for styling libraries that want a stable component reference.

- \`FieldHost\` renders any generated field component passed through its \`field\` prop
- \`SubmitHost\` renders \`Form.Submit\` through a stable \`submit\` prop
- \`FormHost\` renders the generated \`Form\` component through a stable \`form\` prop

These helpers are especially useful with \`styled-components\`, \`styled-components/native\`, or any wrapper-based styling system that works better with stable host components than with runtime-generated field references.`,
      codeTabs: [
        {
          filename: 'Hosts.web.tsx',
          lang: 'tsx',
          code: `import {
  FieldHost,
  FormHost,
  field,
  SubmitHost,
  useFormBridge,
} from '@runilib/react-formbridge'
import styled from 'styled-components'

const StyledForm = styled(FormHost)\`
  display: flex;
  flex-direction: column;
  gap: 16px;
\`

const EmailField = styled(FieldHost).attrs({
  inputProps: { autoComplete: 'email', inputMode: 'email' },
})\`
  & input {
    border-radius: 16px;
    border: 1px solid rgba(56, 189, 248, 0.28);
    background: rgba(15, 23, 42, 0.74);
    color: #f8fafc;
  }
\`

const SubmitButton = styled(SubmitHost)\`
  min-width: 196px;
  border-radius: 16px;
  background: linear-gradient(135deg, #38bdf8, #22c55e);
  color: #04121c;
  font-weight: 800;
\`

const form = useFormBridge({
  contactEmail: field.email('Contact email').required(),
})

<StyledForm form={form.Form} onSubmit={save}>
  <EmailField field={form.fields.contactEmail} />
  <SubmitButton submit={form.Form.Submit}>Save styled recipe</SubmitButton>
</StyledForm>`,
        },
        {
          filename: 'Hosts.native.tsx',
          lang: 'tsx',
          code: `import {
  FieldHost,
  FormHost,
  field,
  SubmitHost,
  useFormBridge,
} from '@runilib/react-formbridge'
import styled from 'styled-components/native'

const StyledForm = styled(FormHost)\`
  gap: 16px;
\`

const EmailField = styled(FieldHost).attrs({
    inputProps: {
      autoComplete: 'email',
      keyboardType: 'email-address',
    },
    styles: {
      wrapper: { marginBottom: 0, gap: 8 },
      textInput: {
        minHeight: 52,
        borderWidth: 1.5,
        borderColor: 'rgba(56, 189, 248, 0.28)',
        borderRadius: 16,
        paddingHorizontal: 14,
        color: '#f8fafc',
        backgroundColor: 'rgba(15, 23, 42, 0.74)',
      },
    },
})\`
  margin-bottom: 0px;
\`

const SubmitButton = styled(SubmitHost).attrs({
  textStyle: { color: '#04121c', fontWeight: '800' },
})\`
  min-height: 52px;
  border-radius: 18px;
  background-color: #38bdf8;
\`

const form = useFormBridge({
  contactEmail: field.email('Contact email').required(),
})

<StyledForm form={form.Form} onSubmit={save}>
  <EmailField field={form.fields.contactEmail} />
  <SubmitButton submit={form.Form.Submit}>Save styled recipe</SubmitButton>
</StyledForm>`,
        },
      ],
    },
    {
      id: 'fb-web-ui-styled-components',
      title: 'Recipe: styled-components on web and native',
      content: `Choose this pattern when the app already uses \`styled-components\` or \`styled-components/native\`.

- Use the exported host helpers instead of rebuilding your own wrappers
- Keep the styled shell stable and pass the generated field, submit button, or form through props
- On web, normal CSS selectors can target \`label\`, \`input\`, \`textarea\`, and the other built-in elements
- On native, use \`.attrs({ styles: { ... } })\` to feed slot styles into the generated field

This stable-host pattern is the safest documented recipe because generated field components are runtime artifacts. It keeps styling ergonomic without forcing users to hand-build every field.`,
      codeTabs: [
        {
          filename: 'StyledComponents.web.tsx',
          lang: 'tsx',
          code: `import {
  FieldHost,
  FormHost,
  field,
  SubmitHost,
  useFormBridge,
} from '@runilib/react-formbridge'
import styled from 'styled-components'

const StudioForm = styled(FormHost)\`
  display: flex;
  flex-direction: column;
  gap: 18px;
\`

const EmailShell = styled(FieldHost).attrs({
  inputProps: { autoComplete: 'email', inputMode: 'email' },
})\`
  display: flex;
  flex-direction: column;
  gap: 8px;

  & label { color: #dbeafe; font-size: 12px; font-weight: 700; }
  & input {
    border-radius: 16px;
    border: 1px solid rgba(56, 189, 248, 0.28);
    background: rgba(15, 23, 42, 0.74);
    color: #f8fafc;
    padding: 14px 16px;
  }
  & span { color: #94a3b8; font-size: 12px; }
\`

const SubmitShell = styled(SubmitHost)\`
  min-width: 196px;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, #38bdf8, #22c55e);
  color: #04121c;
  font-weight: 800;
\`

const form = useFormBridge({
  studioName: field.text('Studio name').required(),
  contactEmail: field.email('Contact email').required(),
})

<StudioForm form={form.Form} onSubmit={save}>
  <EmailShell field={form.fields.contactEmail} hint="Used for invoices only" />
  <SubmitShell submit={form.Form.Submit}>Save styled recipe</SubmitShell>
</StudioForm>`,
        },
        {
          filename: 'StyledComponents.native.tsx',
          lang: 'tsx',
          code: `import {
  FieldHost,
  FormHost,
  field,
  SubmitHost,
  useFormBridge,
} from '@runilib/react-formbridge'
import styled from 'styled-components/native'

const StudioForm = styled(FormHost)\`
  gap: 18px;
\`

const EmailShell = styled(FieldHost).attrs({
    inputProps: {
      autoComplete: 'email',
      keyboardType: 'email-address',
    },
    styles: {
      wrapper: { marginBottom: 0, gap: 8 },
      label: { color: '#dbeafe', fontSize: 12, fontWeight: '800' },
      textInput: {
        minHeight: 52,
        borderWidth: 1.5,
        borderColor: 'rgba(56, 189, 248, 0.28)',
        borderRadius: 16,
        paddingHorizontal: 14,
        color: '#f8fafc',
        backgroundColor: 'rgba(15, 23, 42, 0.74)',
      },
      hint: { color: '#94a3b8', fontSize: 12 },
  },
})\`
  margin-bottom: 0px;
\`

const SubmitShell = styled(SubmitHost).attrs({
  loadingText: 'Applying styled system...',
  textStyle: { color: '#04121c', fontWeight: '800' },
})\`
  min-height: 52px;
  border-radius: 18px;
  background-color: #38bdf8;
\`

const form = useFormBridge({
  studioName: field.text('Studio name').required(),
  contactEmail: field.email('Contact email').required(),
})

<StudioForm form={form.Form} onSubmit={save}>
  <EmailShell field={form.fields.contactEmail} hint="Used for invoices only" />
  <SubmitShell submit={form.Form.Submit}>Save styled recipe</SubmitShell>
</StudioForm>`,
        },
      ],
    },
    {
      id: 'fb-web-ui-utility',
      title: 'Recipe: utility classes on web',
      content: `This recipe is a strong fit for Tailwind, UnoCSS, Windi, or any class-based utility stack.

- The global \`classNames\` map gives most of the form its look
- Local \`classNames\` and \`inputProps\` cover one-off field variations
- The runtime stays the same because the generated field still owns value, validation, and events`,
      code: {
        filename: 'UtilityClasses.web.tsx',
        lang: 'tsx',
        code: `const form = useFormBridge(schema, {
  globalDefaults: () => ({
    form: { className: 'space-y-4' },
    submit: {
      className:
        'inline-flex min-h-12 items-center justify-center rounded-2xl bg-cyan-400 px-5 font-semibold text-slate-950',
    },
    field: {
        classNames: {
          wrapper: 'space-y-2',
          label:
            'text-xs font-semibold uppercase tracking-[0.14em] text-slate-200',
          textInput:
            'w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none',
          textarea:
            'min-h-28 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none',
          select:
            'w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none',
          hint: 'text-xs text-slate-400',
          error: 'text-sm text-rose-300',
        },
    },
  }),
})

<form.Form onSubmit={save}>
  <form.fields.ownerEmail
    classNames={{
      textInput: 'border-cyan-400 focus:ring-2 focus:ring-cyan-400/30',
    }}
    inputProps={{
      autoComplete: 'email',
      inputMode: 'email',
    }}
  />
  <form.fields.launchNotes />
  <form.Form.Submit>Save utility recipe</form.Form.Submit>
</form.Form>`,
      },
    },
    {
      id: 'fb-web-ui-local-overrides',
      title: 'Recipe: local slot overrides with no extra styling library',
      content: `Use this when you want to prove the styling API quickly, or when one form needs a polished custom look without introducing a new styling dependency.

- \`styles\` targets the built-in slots directly on both web and native
- \`renderHint\`, \`renderError\`, and \`renderRequiredMark\` cover the cases where plain styles are not enough
- This is also a good recipe for incrementally migrating an existing screen to react-formbridge`,
      codeTabs: [
        {
          filename: 'SlotOverrides.web.tsx',
          lang: 'tsx',
          code: `const form = useFormBridge(schema, {
  validateOn: 'onTouched',
  globalDefaults: () => ({
    submit: {
      loadingText: 'Saving inline theme...',
      style: {
        minWidth: 196,
        borderRadius: 16,
        background: 'rgba(245, 158, 11, 0.14)',
        color: '#fde68a',
      },
    },
    field: {
        styles: {
          wrapper: { marginBottom: 0, gap: 8 },
          label: {
            color: '#f8fafc',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          },
          textInput: {
            background: 'rgba(15, 23, 42, 0.5)',
            border: '1px solid rgba(251, 191, 36, 0.18)',
            borderRadius: 16,
            color: '#f8fafc',
            padding: '14px 16px',
          },
          textarea: {
            minHeight: 108,
            background: 'rgba(15, 23, 42, 0.5)',
            border: '1px solid rgba(251, 191, 36, 0.18)',
            borderRadius: 16,
            color: '#f8fafc',
            padding: '14px 16px',
          },
          hint: { color: '#fde68a' },
          error: { color: '#fca5a5' },
        },
        renderRequiredMark: () => <span style={{ color: '#f59e0b' }}>•</span>,
      },
  }),
})

<form.fields.receiptEmail
 renderHint={(props) => (
      <span style={{ color: '#cbd5e1', fontSize: 12 }}>
        We only use it for invoices and receipts.
      </span>
    )}
      highlightOnError={false}
/>

<form.fields.postalCode
  styles={{
      textInput: { textAlign: 'center', letterSpacing: '0.14em' },
  }}
/>`,
        },
        {
          filename: 'FieldOverrides.native.tsx',
          lang: 'tsx',
          code: `const form = useFormBridge(schema, {
  validateOn: 'onTouched',
  globalDefaults: () => ({
    submit: {
      loadingText: 'Saving inline theme...',
      containerStyle: {
        minHeight: 52,
        borderRadius: 18,
        backgroundColor: '#f59e0b',
      },
      textStyle: {
        color: '#2a1602',
        fontWeight: '800',
      },
    },
    field: {
        styles: {
          wrapper: { marginBottom: 0, gap: 8 },
          label: {
            color: '#f8fafc',
            fontSize: 12,
            fontWeight: '800',
            letterSpacing: 0.7,
            textTransform: 'uppercase',
          },
          textInput: {
            minHeight: 52,
            borderWidth: 1.5,
            borderColor: 'rgba(251, 191, 36, 0.18)',
            borderRadius: 16,
            paddingHorizontal: 14,
            paddingVertical: 12,
            color: '#f8fafc',
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
          },
          hint: { color: '#fde68a' },
          error: { color: '#fca5a5' },
        },
        renderRequiredMark: () => <Text style={{ color: '#f59e0b' }}>•</Text>,
      },
  }),
})

<form.fields.receiptEmail
highlightOnError={false}
  renderHint={() => (
      <Text style={{ color: '#cbd5e1', fontSize: 12 }}>
        We only use it for invoices and receipts.
      </Text>
    )}
/>

<form.fields.postalCode
  styles={{
      textInput: { textAlign: 'center', letterSpacing: 2 },
  }}
/>`,
        },
      ],
    },
    {
      id: 'fb-web-ui-web-surface',
      title: 'Web styling surface',
      content: `On web, the API is broad enough to work with CSS Modules, utility classes, styled-components, Emotion, or plain objects.

- \`classNames.wrapper\` and \`styles.wrapper\` theme the field container directly
- \`globalDefaults.form\` and \`globalDefaults.submit\` style the generated form wrapper and submit button
- \`highlightOnError\` lets you opt out of the built-in red field chrome while keeping the error message
- \`wrapperProps\`, \`labelProps\`, \`hintProps\`, and \`errorProps\` let you push DOM attributes without losing the generated renderer
- \`inputProps\` is available on text-like web fields, \`textareaProps\` on textarea fields, and \`selectProps\` on select fields
- \`renderLabel\`, \`renderHint\`, \`renderError\`, and \`renderRequiredMark\` cover the cases where styling alone is not enough

${WEB_SLOT_SURFACE}`,
    },
    {
      id: 'fb-web-ui-native-surface',
      title: 'Native styling surface',
      content: `On React Native, the same layering applies, but the override points stay React Native-friendly instead of DOM-specific.

- \`styles.wrapper\` themes the field wrapper, while \`globalDefaults.form\` and \`globalDefaults.submit\` theme the form container and submit button
- \`highlightOnError\` lets you opt out of the built-in red field chrome while keeping the error message
- Renderer-specific extra keys are also supported in \`styles\`, which is especially useful for inputs such as checkboxes, async selectors, or modal option lists
- \`wrapperProps\`, \`labelProps\`, \`inputProps\`, \`hintProps\`, and \`errorProps\` help with test IDs, accessibility, or integration with surrounding layout primitives
- Native fields do not expose web-only props such as \`className\`, \`textareaProps\`, or \`selectProps\`
- \`renderLabel\`, \`renderHint\`, \`renderError\`, and \`renderRequiredMark\` cover the cases where a simple style object is not enough

${NATIVE_SLOT_SURFACE}`,
    },
    {
      id: 'fb-web-ui-guidance',
      title: 'Use-case guide',
      content: `- Use \`globalDefaults\` when a whole route, modal, onboarding flow, or checkout screen should share one visual system
- Keep platform-specific differences inside the \`globalDefaults\` object at the screen level
- Use local field props when one field needs a variant, a special helper text, or a different accent color on one screen
- Use the stable host recipe for \`styled-components\` and \`styled-components/native\`
- Use \`className\` on \`form\` / \`submit\` plus \`classNames\` slot maps on fields for Tailwind-style utility frameworks on web
- Use \`style\`, \`styles\`, wrappers, or the stable host recipe for React Native styling systems such as StyleSheet, NativeWind-friendly wrappers, or in-house component kits
- Let the field type guide the override point: \`inputProps\` for text-like fields, \`textareaProps\` for textareas, \`selectProps\` for selects
- The API stays agnostic on purpose, so the same schema can power web and native without forcing the same styling stack on both platforms

${HOST_HELPERS_SURFACE}`,
    },
  ],
};
