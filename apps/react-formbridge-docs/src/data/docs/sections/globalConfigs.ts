import type { LibraryDoc } from '../../../types/index';
import {
  GLOBAL_UI_SURFACE,
  NATIVE_SLOT_SURFACE,
  WEB_SLOT_SURFACE,
} from '../constants';

export const globalConfigsSection: LibraryDoc['sections'][number] = {
  id: 'fb-global-props',
  title: 'globalConfigs',
  content: `\`globalConfigs\` is the **single place where you theme every generated field, the \`<Form>\` wrapper, and \`Form.Submit\`** at once. You pass it to \`useFormBridge(schema, { globalConfigs })\` and it becomes the shared visual layer for the form — CSS Modules, StyleSheet, utility classes, or design-system components all plug in here.

**Signature**

\`\`\`ts
useFormBridge(schema, {
  globalConfigs: (state) => ({
    field?: FieldTheme,   // applied to every rendered field
    form?:  FormTheme,    // applied to the <Form> wrapper
    submit?: SubmitTheme, // applied to Form.Submit
  }),
})
\`\`\`

- **It's a function**, not a static object. You receive the live \`FormState<S>\` (\`isSubmitting\`, \`isValid\`, \`isDirty\`, \`errors\`, \`values\`, \`submitError\`, …) and return an options bag. This means the theme can **react to form state**: highlight the form red on submit error, change the submit label while submitting, dim fields while the form is busy, etc.
- **Local field props still win.** Anything you pass on \`<fields.email ui={...} />\` overrides the matching key from \`globalConfigs.field\`. The merge order is: builder \`behavior\` → \`globalConfigs\` → local \`ui\` → \`fieldController\` / custom render.
- **Platform-aware typing.** On web, \`field\`/\`form\`/\`submit\` accept web-specific overrides (\`className\`, \`classNames\`, \`wrapperProps\`, \`inputProps\`, …). On native, they accept RN-specific overrides (\`style\`, \`containerStyle\`, \`textStyle\`, \`indicatorColor\`, …). The hook variant you import (\`useFormBridge\` web vs native) selects the correct shape automatically.

> Prefer \`globalConfigs\` over per-field \`ui\` as soon as two or more fields need the same look. Reach for local \`ui\` only for genuine one-off exceptions. For full custom chrome beyond styling, see [\`fieldController\`](/docs/fieldcontroller) or [\`field.custom()\`](/docs/field-custom).`,
  codeTabs: [
    {
      filename: 'ReactiveTheme.web.tsx',
      lang: 'tsx',
      code: `import { field, useFormBridge } from '@runilib/react-formbridge'
import styles from './Form.module.css'

const schema = {
  email: field.email('Email').required(),
  password: field.password('Password').required().min(8),
}

export function LoginForm() {
  const { Form, fields, state } = useFormBridge(schema, {
    validateOn: 'onTouched',
    globalConfigs: (state) => ({
      form: {
        className: \`\${styles.form} \${state.submitError ? styles.formError : ''}\`,
      },
      field: {
        classNames: {
          wrapper: styles.fieldWrapper,
          label: styles.label,
          input: styles.input,
          error: styles.error,
          hint: styles.hint,
          requiredMark: styles.required,
        },
        highlightOnError: true,
      },
      submit: {
        className: styles.submit,
        loadingText: state.isSubmitting ? 'Signing in…' : 'Sign in',
        disabled: !state.isDirty,
      },
    }),
  })

  return (
    <Form onSubmit={(v) => api.login(v)}>
      <fields.email />
      <fields.password />
      <Form.Submit>Sign in</Form.Submit>
    </Form>
  )
}`,
    },
    {
      filename: 'ReactiveTheme.native.tsx',
      lang: 'tsx',
      code: `import { field, useFormBridge } from '@runilib/react-formbridge/native'
import { StyleSheet } from 'react-native'

const schema = {
  email: field.email('Email').required(),
  password: field.password('Password').required().min(8),
}

export function LoginScreen() {
  const { Form, fields } = useFormBridge(schema, {
    validateOn: 'onTouched',
    globalConfigs: (state) => ({
      form: { style: s.form },
      field: {
        styles: {
          wrapper: s.fieldWrapper,
          label: s.label,
          input: s.input,
          error: s.error,
        },
      },
      submit: {
        style: s.submit,
        textStyle: s.submitText,
        indicatorColor: '#fff',
        loadingText: state.isSubmitting ? 'Signing in…' : undefined,
      },
    }),
  })

  return (
    <Form onSubmit={(v) => api.login(v)}>
      <fields.email />
      <fields.password />
      <Form.Submit>Sign in</Form.Submit>
    </Form>
  )
}

const s = StyleSheet.create({ /* … */ })`,
    },
  ],
  subsections: [
    {
      id: 'fb-global-props-signature',
      title: 'Signature & reactive state',
      content: `\`globalConfigs\` runs on every render of the form, with the latest \`FormState<S>\` as its only argument:

\`\`\`ts
globalConfigs?(state: FormState<S>): FormBridgeOptions<TPlatform>
\`\`\`

**Fields available on \`state\`** (non-exhaustive — see the [\`useFormBridge()\`](/docs/useformbridge) section for the full list):

- \`values\` — current values, typed from the schema
- \`errors\` — per-field error map (\`state.errors.__form\` for form-level errors from \`schema()\`)
- \`touched\` / \`dirty\` — per-field tracking bags
- \`isValid\` / \`isDirty\` / \`isSubmitting\` / \`isSubmitted\` / \`submitCount\` — form-level flags
- \`submitError\` — string set by \`onSubmitError(error)\` when your \`onSubmit\` throws

Because the selector receives \`state\`, the theme can **react**:

- Switch \`submit.loadingText\` while \`state.isSubmitting\` is \`true\`
- Add a \`formError\` className when \`state.submitError\` is set
- Disable the submit button until \`state.isDirty\`
- Tint every field wrapper when the form has unresolved errors

Return the same shape regardless of state — React just re-renders the theme each time.`,
    },
    {
      id: 'fb-global-props-merge-order',
      title: 'Merge order & precedence',
      content: `FormBridge merges style/behavior from **four layers**, always in the same order:

1. **Builder \`behavior\`** — anything declared on the schema builder itself (e.g. \`field.text().placeholder('…').hint('…')\`). Lowest precedence.
2. **\`globalConfigs\`**: the function documented here. Covers every field, the form wrapper, and the submit button.
3. **Local \`ui\` prop** — anything passed on \`<fields.name ui={...} />\` or on a \`<Form ...>\` / \`<Form.Submit ...>\` call site. Wins over global config.
4. **\`fieldController\` / \`field.custom().render(...)\`** — fully custom render layer. Wins over everything above because at that point FormBridge is no longer rendering the chrome itself.

Practical consequences:

- Change the **whole form's look** once in \`globalConfigs\` — no need to repeat \`className\` / \`style\` on every \`<fields.*>\` call site.
- Override a **single field** locally with \`<fields.email className="..." />\` without touching the global theme.
- Keep **one-off exceptions local**; keep **shared language global**. That's the mental model.`,
    },
    {
      id: 'fb-global-props-field',
      title: 'field: shared defaults for every rendered field',
      content: `Everything under \`globalConfigs.field\` is forwarded to **every** \`<fields.*>\` component unless a local \`ui\` overrides it. The shape is \`FieldTheme<PlatformGlobalFieldPropsOverrides<TPlatform>>\` — identical to the per-field override type minus a few props that must stay local (see the caveat below).

**Available on both web and native**

- \`style\`: base style applied to every field wrapper
- \`classNames?\` (web) / \`styles?\`: per-slot overrides (see the **Web slot names** and **Native slot names** subsections below)
- \`hideLabel?\`: hide visual labels while keeping them for screen readers
- \`highlightOnError?\`: turn the default red error chrome on/off
- \`readOnly?\`: mark every field read-only (handy for "view mode")
- \`inputMode?\`: virtual-keyboard hint for text-like fields
- \`wrapperProps?\` / \`labelProps?\` / \`hintProps?\` / \`errorProps?\`: passthrough props for the DOM nodes of each slot
- Plus every per-type passthrough (\`inputProps\`, \`textareaProps\`, \`selectProps\`, \`buttonProps\`, …): FormBridge routes them to the matching renderer.

**Web-only extras**

- \`className?\`: class added to every field's wrapper

**Caveat: props that must stay local, not global**

These keys make sense only on an individual field and are **omitted** from the \`globalConfigs.field\` type to prevent accidents:

- \`autoComplete\`: per-field autofill hint
- \`autoFocus\`: only one field should take focus on mount
- \`enterKeyHint\`: per-field "enter key" label on mobile
- \`spellCheck\`: per-field toggle
- \`id\`: must be unique per field

Declare those on the local \`ui\` prop of the specific \`<fields.*>\` call site.`,
      code: {
        filename: 'global-field.tsx',
        lang: 'tsx',
        code: `useFormBridge(schema, {
  globalConfigs: () => ({
    field: {
      className: 'fb-field',
      classNames: {
        wrapper: 'fb-field__wrapper',
        label: 'fb-field__label',
        input: 'fb-field__input',
        textarea: 'fb-field__input',
        select: 'fb-field__input',
        error: 'fb-field__error',
        hint: 'fb-field__hint',
        requiredMark: 'fb-field__required',
      },
      hideLabel: false,
      highlightOnError: true,
      wrapperProps: { 'data-testid': 'field' },
    },
  }),
})`,
      },
    },
    {
      id: 'fb-global-props-form',
      title: '`form` — overrides applied to the `<Form>` wrapper',
      content: `Attach styling and passthrough props to the \`<Form>\` wrapper element.

**Web (\`WebFormPropsOverrides\`)**

- \`className?: string\` — class added to the \`<form>\` element
- \`style?: CSSProperties\` — inline style merged onto the \`<form>\` element
- \`props?\` — passthrough attributes spread on \`<form>\` (minus FormBridge-owned: \`children\`, \`onSubmit\`, \`className\`, \`style\`)

**Native (\`NativeFormPropsOverrides\`)**

- \`style?: StyleProp<ViewStyle>\` — style applied to the wrapper \`<View>\`
- \`props?: Record<string, unknown>\` — passthrough props spread on the wrapper \`<View>\`

Event handlers like \`onSubmit\`, \`onError\`, and \`onSubmitError\` are set on the \`<Form>\` call site, not here — \`globalConfigs\` is for visual/theming concerns.`,
      code: {
        filename: 'global-form.tsx',
        lang: 'tsx',
        code: `useFormBridge(schema, {
  globalConfigs: (state) => ({
    form: {
      className: state.submitError ? 'fb-form fb-form--error' : 'fb-form',
      style: { display: 'grid', gap: 16 },
      props: { 'data-testid': 'checkout-form', autoComplete: 'on' },
    },
  }),
})`,
      },
    },
    {
      id: 'fb-global-props-submit',
      title: '`submit` — overrides applied to `Form.Submit`',
      content: `Style the submit button and drive its loading copy from form state.

**Web (\`WebSubmitPropsOverrides\`)**

- \`className?: string\` — class on the \`<button>\`
- \`style?: CSSProperties\` — inline style on the \`<button>\`
- \`loadingText?: string\` — label shown while submitting (defaults to \`"Please wait…"\`)
- \`props?\` — passthrough attributes spread on \`<button>\` (minus FormBridge-owned: \`children\`, \`type\`, \`disabled\`, \`className\`, \`style\`)

**Native (\`NativeSubmitPropsOverrides\`)**

- \`style?: StyleProp<ViewStyle>\` — style applied to the outer \`TouchableOpacity\`
- \`containerStyle?: StyleProp<ViewStyle>\` — style applied to the inner content \`<View>\`
- \`textStyle?: StyleProp<TextStyle>\` — style applied to the label \`<Text>\`
- \`indicatorColor?: string\` — color of the \`ActivityIndicator\` shown while submitting
- \`loadingText?: string\` — text shown next to the spinner while submitting
- \`props?: Record<string, unknown>\` — passthrough props spread on the outer \`TouchableOpacity\`
- \`contentProps?: Record<string, unknown>\` — passthrough props spread on the inner content \`<View>\`

FormBridge manages \`disabled\` and the loading transition itself, so \`state.isSubmitting\` is the signal you use to drive \`loadingText\` / \`indicatorColor\` — you never flip \`disabled\` manually mid-submit.`,
      code: {
        filename: 'global-submit.tsx',
        lang: 'tsx',
        code: `useFormBridge(schema, {
  globalConfigs: (state) => ({
    submit: {
      className: 'fb-submit',
      loadingText: state.isSubmitting ? 'Saving…' : undefined,
      disabled: !state.isDirty || !state.isValid,
    },
  }),
})`,
      },
    },
    {
      id: 'fb-global-props-surface',
      title: 'Complete surface reference',
      content: `${GLOBAL_UI_SURFACE}`,
    },
    {
      id: 'fb-global-props-web-slots',
      title: 'Web slot names',
      content: `Every web field exposes a set of named slots so \`globalConfigs.field.classNames\` / \`styles\` can target each piece of the rendered field without reaching into the DOM.

${WEB_SLOT_SURFACE}`,
    },
    {
      id: 'fb-global-props-native-slots',
      title: 'Native slot names',
      content: `Every native field exposes a set of named style slots so \`globalConfigs.field.styles\` can target each piece of the rendered field.

${NATIVE_SLOT_SURFACE}`,
    },
    {
      id: 'fb-global-props-when-to-use',
      title: 'When to use globalConfigs vs. alternatives',
      content: `FormBridge offers three styling layers. Pick the right one for the scope of your change:

- **\`globalConfigs\`** — use when **two or more fields** need the same look, or when you want the theme to **react to form state**. Default recommendation for CSS Modules / StyleSheet / design-system-wide chrome. Declared once on \`useFormBridge\`.
- **Local \`ui\` prop** — use for **one-off exceptions** on a single field. Example: \`<fields.email className='narrow' />\`. Wins over global config.
- **\`fieldController\` / \`field.custom().render(...)\`** — use when styling isn't enough and you need **custom chrome** (e.g. a bespoke phone picker UI on top of the built-in value model, or a totally new field type). See [\`fieldController\`](/docs/fieldcontroller) and [\`field.custom()\`](/docs/field-custom).

> The [\`Styling\`](/docs/styling) section shows end-to-end examples that combine all three layers.`,
    },
  ],
};
