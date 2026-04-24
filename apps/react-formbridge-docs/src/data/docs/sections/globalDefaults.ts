import type { LibraryDoc } from '../../../types/index';
import { GLOBAL_UI_SURFACE, NATIVE_SLOT_SURFACE, WEB_SLOT_SURFACE } from '../constants';

export const globalDefaultsSection: LibraryDoc['sections'][number] = {
  id: 'fb-global-props',
  title: 'globalDefaults',
  content: `\`globalDefaults\` is the **single place where you theme every generated field, the \`<Form>\` wrapper, and \`Form.Submit\`** at once. You pass it to \`useFormBridge(schema, { globalDefaults })\` and it becomes the shared visual layer for the form - CSS Modules, StyleSheet, utility classes, or design-system components all plug in here.

**Signature**

\`\`\`ts
useFormBridge(schema, {
  globalDefaults: (state) => ({
    field?: FieldTheme,   // applied to every rendered field
    form?:  FormTheme,    // applied to the <Form> wrapper
    submit?: SubmitTheme, // applied to Form.Submit
  }),
})
\`\`\`

- **It's a function**, not a static object. You receive the live \`FormState<S>\` (\`isSubmitting\`, \`isValid\`, \`isDirty\`, \`errors\`, \`values\`, \`submitError\`, …) and return an options bag. This means the theme can **react to form state**: highlight the form red on submit error, change the submit label while submitting, dim fields while the form is busy, etc.\n

- **Local field props still win.** Anything you pass directly on \`<fields.email classNames={...} />\` overrides the matching key from \`globalDefaults.field\`. The merge order is: builder \`behavior\` → \`globalDefaults\` → local field props → \`fieldController\` / custom render.\n

- **Platform-aware typing.** On web, generated fields expose slot maps such as \`classNames\` / \`styles\`, plus DOM passthrough props like \`wrapperProps\` and \`inputProps\`. On native, fields expose RN-friendly \`styles\`, \`wrapperProps\`, \`keyboardType\`, \`secureTextEntry\`, and submit-specific props such as \`containerStyle\`, \`textStyle\`, and \`indicatorColor\`. The hook variant you import (\`useFormBridge\` web vs native) selects the correct shape automatically.

Prefer \`globalDefaults\` over per-field overrides as soon as two or more fields need the same look. Reach for local field props only for genuine one-off exceptions. For full custom chrome beyond styling, see [fieldController](/docs/fieldcontroller) or [field.custom()](/docs/field-custom).`,
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
    globalDefaults: (state) => ({
      form: {
        className: \`\${styles.form} \${state.submitError ? styles.formLevelError : ''}\`,
      },
      field: {
        classNames: {
          wrapper: styles.fieldWrapper,
          label: styles.label,
          textInput: styles.input,
          error: styles.error,
          hint: styles.hint,
          requiredMark: styles.required,
        },
        highlightOnError: true,
      },
      submit: {
        className: styles.submit,
        loadingText: state.isSubmitting ? 'Signing in…' : 'Sign in',
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
    globalDefaults: (state) => ({
      form: { style: s.form },
      field: {
        styles: {
          wrapper: s.fieldWrapper,
          label: s.label,
          textInput: s.input,
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
      content: `\`globalDefaults\` runs on every render of the form, with the latest \`FormState<S>\` as its only argument:

\`\`\`ts
globalDefaults?(state: FormState<S>): FormBridgeOptions<TPlatform>
\`\`\`

**Fields available on state** (non-exhaustive - see the [useFormBridge()](/docs/useformbridge) section for the full list):

| Field | Description |
| --- | --- |
| \`values\` | Current values, typed from the schema |
| \`errors\` | Per-field error map |
| \`formLevelError\` | Form-level error string produced by \`createSchema()\` refinements (\`null\` when none) |
| \`touched\` / \`dirty\` | Per-field tracking bags |
| \`isValid\` / \`isDirty\` / \`isSubmitting\` / \`isSubmitted\` / \`submitCount\` | Form-level flags |
| \`submitError\` | String set by \`onSubmitError(error)\` when your \`onSubmit\` throws |

Because the selector receives \`state\`, the theme can **react**:

- Switch \`submit.loadingText\` while \`state.isSubmitting\` is \`true\`
- Add a \`formLevelError\` className when \`state.submitError\` is set
- Swap the submit button className or style when the form becomes valid / dirty
- Tint every field wrapper when the form has unresolved errors

Return the same shape regardless of state - React just re-renders the theme each time.`,
    },
    {
      id: 'fb-global-props-merge-order',
      title: 'Merge order & precedence',
      content: `FormBridge merges style/behavior from **four layers**, always in the same order:

1. **Builder behavior** - anything declared on the schema builder itself (e.g. \`field.text().placeholder('…').hint('…')\`). Lowest precedence.
2. **globalDefaults**: the function documented here. Covers every field, the form wrapper, and the submit button.
3. **Local field props** - anything passed directly on \`<fields.name classNames={...} />\` or on a \`<Form ...>\` / \`<Form.Submit ...>\` call site. Wins over global config.
4. **fieldController / field.custom().render(...)** - fully custom render layer. Wins over everything above because at that point FormBridge is no longer rendering the chrome itself.

Practical consequences:

- Change the **whole form's look** once in \`globalDefaults\` - no need to repeat \`classNames\` / \`styles\` on every \`<fields.*>\` call site.
- Override a **single field** locally with \`<fields.email classNames={{ wrapper: 'narrow' }} />\` without touching the global theme.
- Keep **one-off exceptions local**; keep **shared language global**. That's the mental model.`,
    },
    {
      id: 'fb-global-props-field',
      title: 'field: shared defaults for every rendered field',
      content: `Everything under \`globalDefaults.field\` is forwarded to **every** \`<fields.*>\` component unless a local prop overrides it. The shape is \`FieldTheme<PlatformGlobalFieldPropsOverrides<TPlatform>>\` - identical to the per-field override type minus a few props that must stay local (see the caveat below).

**Available on both web and native**

| Key | Description |
| --- | --- |
| \`styles?\` | Per-slot style overrides (web + native) |
| \`hideLabel?\` | Hide visual labels while keeping them for screen readers |
| \`highlightOnError?\` | Turn the default red error chrome on/off |
| \`readOnly?\` | Mark every field read-only (handy for "view mode") |
| \`wrapperProps?\` / \`labelProps?\` / \`hintProps?\` / \`errorProps?\` | Passthrough props for the DOM nodes of each slot |
| \`inputProps\` / \`textareaProps\` / \`selectProps\` / \`buttonProps\` / … | Per-type passthrough - FormBridge routes them to the matching renderer |

**Web-only extras**

| Key | Description |
| --- | --- |
| \`classNames?\` | Per-slot class names for renderers such as \`wrapper\`, \`label\`, \`textInput\`, \`textarea\`, or \`select\` |

**Native-only extras**

| Key | Description |
| --- | --- |
| \`keyboardType?\` / \`secureTextEntry?\` | RN-specific input hints for text-like fields |

**Caveat: props that must stay local, not global**

These keys make sense only on an individual field and are **omitted** from the \`globalDefaults.field\` type to prevent accidents:

| Key | Why it must stay local |
| --- | --- |
| \`autoComplete\` | Per-field autofill hint |
| \`autoFocus\` | Only one field should take focus on mount |
| \`enterKeyHint\` | Per-field "enter key" label on mobile |
| \`spellCheck\` | Per-field toggle |
| \`id\` | Must be unique per field |

Declare those directly on the specific \`<fields.*>\` call site.`,
      code: {
        filename: 'global-field.tsx',
        lang: 'tsx',
        code: `useFormBridge(schema, {
  globalDefaults: () => ({
    field: {
      classNames: {
        wrapper: 'fb-field__wrapper',
        label: 'fb-field__label',
        textInput: 'fb-field__input',
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
      title: 'form: overrides applied to the <Form> wrapper',
      content: `Attach styling and passthrough props to the \`<Form>\` wrapper element.

**Web**

| Key | Type | Description |
| --- | --- | --- |
| \`className?\` | \`string\` | Class added to the \`<form>\` element |
| \`style?\` | \`CSSProperties\` | Inline style merged onto the \`<form>\` element |
| \`props?\` | \`HTMLFormAttributes\` | Passthrough attributes spread on \`<form>\` (minus FormBridge-owned: \`children\`, \`onSubmit\`, \`className\`, \`style\`) |

**Native**

| Key | Type | Description |
| --- | --- | --- |
| \`style?\` | \`StyleProp<ViewStyle>\` | Style applied to the wrapper \`<View>\` |
| \`props?\` | \`Record<string, unknown>\` | Passthrough props spread on the wrapper \`<View>\` |

Event handlers like \`onSubmit\`, \`onError\`, and \`onSubmitError\` are set on the \`<Form>\` call site, not here - \`globalDefaults\` is for visual/theming concerns.`,
      code: {
        filename: 'global-form.tsx',
        lang: 'tsx',
        code: `useFormBridge(schema, {
  globalDefaults: (state) => ({
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
      title: 'submit: overrides applied to Form.Submit',
      content: `Style the submit button and drive its loading copy from form state.

**Web**

| Key | Type | Description |
| --- | --- | --- |
| \`className?\` | \`string\` | Class on the \`<button>\` |
| \`style?\` | \`CSSProperties\` | Inline style on the \`<button>\` |
| \`loadingText?\` | \`ReactNode\` | Content shown while submitting (defaults to \`"Please wait…"\`) |
| \`props?\` | \`HTMLButtonAttributes\` | Passthrough attributes spread on \`<button>\` (minus FormBridge-owned: \`children\`, \`type\`, \`disabled\`, \`className\`, \`style\`) |

**Native**

| Key | Type | Description |
| --- | --- | --- |
| \`style?\` | \`StyleProp<ViewStyle>\` | Style applied to the outer \`TouchableOpacity\` |
| \`containerStyle?\` | \`StyleProp<ViewStyle>\` | Style applied to the inner content \`<View>\` |
| \`textStyle?\` | \`StyleProp<TextStyle>\` | Style applied to the label \`<Text>\` |
| \`indicatorColor?\` | \`string\` | Color of the \`ActivityIndicator\` shown while submitting |
| \`loadingText?\` | \`ReactNode\` | Content shown next to the spinner while submitting |
| \`props?\` | \`Record<string, unknown>\` | Passthrough props spread on the outer \`TouchableOpacity\` |
| \`contentProps?\` | \`Record<string, unknown>\` | Passthrough props spread on the inner content \`<View>\` |

FormBridge manages \`disabled\` and the loading transition itself, so \`state.isSubmitting\` is the signal you use to drive \`loadingText\` / \`indicatorColor\` - you never flip \`disabled\` manually mid-submit.`,
      code: {
        filename: 'global-submit.tsx',
        lang: 'tsx',
        code: `useFormBridge(schema, {
  globalDefaults: (state) => ({
    submit: {
      className: 'fb-submit',
      loadingText: state.isSubmitting ? 'Saving…' : undefined,
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
      content: `Every web field exposes a set of named slots so \`globalDefaults.field.classNames\` / \`styles\` can target each piece of the rendered field without reaching into the DOM.

${WEB_SLOT_SURFACE}`,
    },
    {
      id: 'fb-global-props-native-slots',
      title: 'Native slot names',
      content: `Every native field exposes a set of named style slots so \`globalDefaults.field.styles\` can target each piece of the rendered field.

${NATIVE_SLOT_SURFACE}`,
    },
    {
      id: 'fb-global-props-when-to-use',
      title: 'When to use globalDefaults vs. alternatives',
      content: `FormBridge offers three styling layers. Pick the right one for the scope of your change:

- **globalDefaults** - use when **two or more fields** need the same look, or when you want the theme to **react to form state**. Default recommendation for CSS Modules / StyleSheet / design-system-wide chrome. Declared once on \`useFormBridge\`.
- **Local field props** - use for **one-off exceptions** on a single field. Example: \`<fields.email classNames={{ wrapper: 'narrow' }} />\`. Wins over global config.
- **fieldController / field.custom().render(...)** - use when styling isn't enough and you need **custom chrome** (e.g. a bespoke phone picker UI on top of the built-in value model, or a totally new field type). See [fieldController](/docs/fieldcontroller) and [field.custom()](/docs/field-custom).

The [Styling](/docs/styling) section shows end-to-end examples that combine all three layers.`,
    },
  ],
};
