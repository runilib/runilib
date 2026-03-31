import type { LibraryDoc } from '../../types';

const DOC_PREVIEWS = {
  overviewWeb: {
    src: '/docs/formbridge/formbridge-overview-web.svg',
    alt: 'Desktop preview of a schema-first signup form rendered with react-formbridge.',
    caption:
      'Web preview: a complete signup form generated from a schema with typed fields, inline errors, and submit state.',
    maxWidth: 720,
    maxHeight: 420,
  },
  overviewNative: {
    src: '/docs/formbridge/formbridge-overview-native.svg',
    alt: 'Mobile preview of the same signup form rendered on React Native.',
    caption:
      'React Native preview: the same schema rendered as native inputs, pickers, switches, and a submit button.',
    maxWidth: 340,
    maxHeight: 620,
  },
  lifecycle: {
    src: '/docs/formbridge/formbridge-lifecycle.svg',
    alt: 'Preview showing the form lifecycle with state and submit feedback.',
    caption:
      'The hook returns the form wrapper, generated fields, live state, validation, and imperative helpers in one place.',
    maxWidth: 720,
    maxHeight: 420,
  },
  textField: {
    src: '/docs/formbridge/formbridge-overview-web.svg',
    alt: 'Preview of text-based fields such as name, email, url, and textarea.',
    caption:
      'String-based builders share the same mental model: label, hint, validation, and web/native renderer mapping.',
    maxWidth: 720,
    maxHeight: 420,
  },
  password: {
    src: '/docs/formbridge/formbridge-password.svg',
    alt: 'Preview of password fields with strength feedback and confirmation rules.',
    caption:
      'Password flows can combine strength rules, inline helper text, and cross-field confirmation checks.',
    maxWidth: 720,
    maxHeight: 420,
  },
  choice: {
    src: '/docs/formbridge/formbridge-choice-fields.svg',
    alt: 'Preview of select, radio, checkbox, and switch fields.',
    caption:
      'Choice builders cover agreements, toggles, single selection, and guided option picking across platforms.',
    maxWidth: 720,
    maxHeight: 420,
  },
  date: {
    src: '/docs/formbridge/formbridge-date.svg',
    alt: 'Preview of date fields with min and max constraints.',
    caption:
      'Date inputs stay schema-first too, including boundaries such as start/end dates or future-only booking rules.',
    maxWidth: 720,
    maxHeight: 420,
  },
  phone: {
    src: '/docs/formbridge/formbridge-phone.svg',
    alt: 'Preview of the country-aware phone input and masked helpers.',
    caption:
      'Phone and masked inputs handle structure-heavy values while keeping the same validation and rendering flow.',
    maxWidth: 720,
    maxHeight: 420,
  },
  file: {
    src: '/docs/formbridge/formbridge-file.svg',
    alt: 'Preview of a file upload field with preview and validation hints.',
    caption:
      'File fields cover uploads, previews, limits, drag and drop on web, and source selection on native.',
    maxWidth: 720,
    maxHeight: 420,
  },
  otp: {
    src: '/docs/formbridge/formbridge-otp.svg',
    alt: 'Preview of a one-time password field rendered as a code input.',
    caption:
      'OTP inputs are optimized for short verification flows and pair well with onChange validation.',
    maxWidth: 720,
    maxHeight: 420,
  },
  resolver: {
    src: '/docs/formbridge/formbridge-resolver.svg',
    alt: 'Preview representing schema adapter and external validation integration.',
    caption:
      'External schema resolvers let you keep Zod or Yup as the source of truth while still using formbridge renderers.',
    maxWidth: 720,
    maxHeight: 420,
  },
  stylingWeb: {
    src: '/docs/formbridge/formbridge-overview-web.svg',
    alt: 'Desktop preview of a form themed through the global ui layer and local field overrides.',
    caption:
      'Web styling can combine schema defaults, a shared ui theme, and one-off field overrides without changing the form runtime.',
    maxWidth: 720,
    maxHeight: 420,
  },
  stylingNative: {
    src: '/docs/formbridge/formbridge-overview-native.svg',
    alt: 'Mobile preview of the same form themed for React Native.',
    caption:
      'React Native styling follows the same layered model: schema defaults, shared ui theme, and local overrides when one screen needs a different look.',
    maxWidth: 340,
    maxHeight: 620,
  },
  stylingStyledWeb: {
    src: '/docs/formbridge/formbridge-overview-web.svg',
    alt: 'Desktop preview of a form themed with styled-components around generated fields.',
    caption:
      'styled-components recipe: keep a stable styled host around generated fields and submit buttons, then style the built-in slots with normal CSS selectors.',
    maxWidth: 720,
    maxHeight: 420,
  },
  stylingUtilityWeb: {
    src: '/docs/formbridge/formbridge-overview-web.svg',
    alt: 'Desktop preview of a form themed with utility classes and slot class maps.',
    caption:
      'Utility-first recipe: className and classNames slot maps make Tailwind-style theming work without changing the generated field runtime.',
    maxWidth: 720,
    maxHeight: 420,
  },
  stylingSlotWeb: {
    src: '/docs/formbridge/formbridge-overview-web.svg',
    alt: 'Desktop preview of a form themed entirely through inline slot overrides.',
    caption:
      'Slot override recipe: use plain objects, DOM props, and render hooks when you want to stay dependency-free on web.',
    maxWidth: 720,
    maxHeight: 420,
  },
  stylingStyledNative: {
    src: '/docs/formbridge/formbridge-overview-native.svg',
    alt: 'Mobile preview of a form themed with styled-components/native.',
    caption:
      'styled-components/native recipe: wrap generated fields in a stable host and feed native slot styles through attrs or local overrides.',
    maxWidth: 340,
    maxHeight: 620,
  },
  stylingSlotNative: {
    src: '/docs/formbridge/formbridge-overview-native.svg',
    alt: 'Mobile preview of a form themed through native style objects and slot overrides.',
    caption:
      'React Native slot override recipe: one global ui theme plus targeted local overrides is often enough for polished production screens.',
    maxWidth: 340,
    maxHeight: 620,
  },
  asyncWeb: {
    src: '/docs/formbridge/formbridge-async-web.svg',
    alt: 'Desktop preview of an async select or autocomplete flow.',
    caption:
      'Async options support debounce, caching, dependencies, and loading states for remote datasets on web.',
    maxWidth: 720,
    maxHeight: 420,
  },
  asyncNative: {
    src: '/docs/formbridge/formbridge-async-native.svg',
    alt: 'Mobile preview of an async picker flow.',
    caption:
      'The same async options contract can feed native lists, search inputs, or custom pickers.',
    maxWidth: 340,
    maxHeight: 620,
  },
  analyticsWeb: {
    src: '/docs/formbridge/formbridge-lifecycle.svg',
    alt: 'Preview of analytics instrumentation layered on a web form.',
    caption:
      'Analytics stays additive: you keep the same form API and add callbacks for focus, completion, abandonment, and errors.',
    maxWidth: 720,
    maxHeight: 420,
  },
  analyticsNative: {
    src: '/docs/formbridge/formbridge-overview-native.svg',
    alt: 'Preview of analytics instrumentation on a mobile form.',
    caption:
      'On native, the same callbacks can track focus, completion, and abandonment without changing field code.',
    maxWidth: 340,
    maxHeight: 620,
  },
  dynamic: {
    src: '/docs/formbridge/formbridge-dynamic.svg',
    alt: 'Preview of a dynamic form definition rendered at runtime.',
    caption:
      'Dynamic forms let you turn JSON definitions into real formbridge forms while preserving order and visibility rules.',
    maxWidth: 720,
    maxHeight: 420,
  },
  wizard: {
    src: '/docs/formbridge/formbridge-wizard.svg',
    alt: 'Preview of a multi-step wizard flow.',
    caption:
      'Wizard flows accumulate values across steps, apply per-step validation, and keep the same schema-driven building blocks.',
    maxWidth: 720,
    maxHeight: 420,
  },
  readonly: {
    src: '/docs/formbridge/formbridge-readonly.svg',
    alt: 'Preview of a readonly and diff review screen.',
    caption:
      'Readonly and diff rendering are useful for review screens, approval steps, or comparing pending edits to saved data.',
    maxWidth: 720,
    maxHeight: 420,
  },
} as const;

export const formbridgeDocs: LibraryDoc = {
  libId: 'formbridge',
  sidebar: [
    {
      group: 'Getting started',
      items: [
        { id: 'fb-overview', label: 'Overview' },
        { id: 'fb-install', label: 'Installation' },
        { id: 'fb-quickstart', label: 'Quick start' },
        { id: 'fb-schema', label: 'Schema mental model' },
      ],
    },
    {
      group: 'Core API',
      color: 'blue',
      items: [
        { id: 'fb-use-form-bridge', label: 'useFormBridge()' },
        { id: 'fb-form', label: 'Form component' },
        { id: 'fb-fields', label: 'Generated fields' },
        { id: 'fb-state', label: 'State' },
        { id: 'fb-actions', label: 'Actions & helpers' },
        { id: 'fb-validation', label: 'Validation' },
      ],
    },
    {
      group: 'Field builders',
      color: 'blue',
      items: [
        { id: 'fb-text', label: 'field.text()' },
        { id: 'fb-email', label: 'field.email()' },
        { id: 'fb-password', label: 'field.password()' },
        { id: 'fb-tel', label: 'field.tel()' },
        { id: 'fb-url', label: 'field.url()' },
        { id: 'fb-textarea', label: 'field.textarea()' },
        { id: 'fb-number', label: 'field.number()' },
        { id: 'fb-checkbox', label: 'field.checkbox()' },
        { id: 'fb-switch', label: 'field.switch()' },
        { id: 'fb-select', label: 'field.select()' },
        { id: 'fb-radio', label: 'field.radio()' },
        { id: 'fb-date', label: 'field.date()' },
        { id: 'fb-phone', label: 'field.phone()' },
        { id: 'fb-masked', label: 'field.masked()' },
        { id: 'fb-file', label: 'field.file()' },
        { id: 'fb-otp', label: 'field.otp()' },
        { id: 'fb-custom', label: 'field.custom()' },
        { id: 'fb-infer', label: 'field.infer()' },
        { id: 'fb-infer-type', label: 'field.inferType()' },
      ],
    },
    {
      group: 'Advanced',
      color: 'blue',
      items: [
        { id: 'fb-adapters', label: 'Schema adapters' },
        { id: 'fb-conditional', label: 'Conditional logic' },
        { id: 'fb-persistence', label: 'Draft persistence' },
        { id: 'fb-web-ui', label: 'Styling' },
        { id: 'fb-infer', label: 'Infer helpers' },
        { id: 'fb-analytics', label: 'useFormBridgeAnalytics()' },
        { id: 'fb-use-async-options', label: 'useAsyncOptions()' },
        { id: 'fb-dynamic', label: 'useDynamicFormBridge()' },
        { id: 'fb-wizard', label: 'useFormWizardBridge()' },
        { id: 'fb-readonly', label: 'useReadonlyFormBridge()' },
      ],
    },
  ],
  sections: [
    {
      id: 'fb-overview',
      title: 'Overview',
      content: `@runilib/react-formbridge is a schema-driven form builder/runtime for React and React Native.

- You describe the form once with fluent \`field.*\` builders and keep the schema as the source of truth.
- \`useFormBridge()\` returns a ready-to-use \`Form\`, generated \`fields\`, reactive \`state\`, visibility rules, draft helpers, and imperative actions.
- The same schema drives rendering, validation, conditional logic, persistence, analytics, and advanced flows such as wizards or dynamic forms.
- No provider, registry, or field-level wiring is required: the builder/runtime takes care of the form lifecycle for you.`,
      codeTabs: [
        {
          filename: 'Overview.web.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.overviewWeb,
          code: `import { field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  email: field.email('Email').required(),
  password: field.password('Password').required().strong(),
  plan: field.select('Plan').options(['starter','pro']).required(),
  terms: field.checkbox('Accept terms').mustBeTrue(),
}

export function SignupForm() {
  const { Form, fields, state } = useFormBridge(schema, { validateOn: 'onTouched' })

  return (
    <Form onSubmit={async (values) => api.signup(values)}>
      <fields.email />
      <fields.password />
      <fields.plan />
      <fields.terms />
      <Form.Submit loadingText="Creating..." disabled={!state.isValid}>
        Create account
      </Form.Submit>
    </Form>
  )
}`,
        },
        {
          filename: 'ReactNative.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.overviewNative,
          code: `import { ScrollView, View } from 'react-native'
import { field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  email: field.email('Email').required(),
  password: field.password('Password').required().strong(),
  phone: field.phone('Phone').defaultCountry('FR').storeE164(),
}

export function SignupScreen() {
  const { Form, fields, state } = useFormBridge(schema, { validateOn: 'onTouched' })

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Form onSubmit={(values) => api.signup(values)}>
        <View style={{ gap: 12, padding: 16 }}>
          <fields.email />
          <fields.password />
          <fields.phone />
          <Form.Submit disabled={!state.isValid} loadingText="Creating...">
            Create account
          </Form.Submit>
        </View>
      </Form>
    </ScrollView>
  )
}`,
        },
      ],
    },
    {
      id: 'fb-install',
      title: 'Installation',
      content: `Install the scoped package, then let the package exports map resolve the web or native entrypoint automatically.

- Web peers: \`react\` and \`react-dom\`
- Native peers: \`react-native\`
- Some field renderers can rely on extra ecosystem packages in your app, such as phone or file-picker helpers, but the form API itself stays the same.`,
      code: {
        filename: 'terminal',
        lang: 'bash',
        code: `npm install @runilib/react-formbridge
# or
yarn add @runilib/react-formbridge`,
      },
    },
    {
      id: 'fb-quickstart',
      title: 'Quick start',
      content: `A form starts with a plain schema object. Keys become field names, and each builder defines the renderer, default value, validation, and UI metadata for that field.

- Web and native can share the same schema.
- The generated \`fields\` map is fully typed from the schema keys.
- \`Form.Submit\` automatically follows submit state and can be disabled from \`state.isValid\`.`,
      codeTabs: [
        {
          filename: 'RegistrationForm.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.overviewWeb,
          code: `import { field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  fullName: field.text('Full name').required().trim(),
  email: field.email('Email').required(),
  password: field.password('Password').required().strong(),
  terms: field.checkbox('Accept terms').mustBeTrue(),
}

export function RegistrationForm() {
  const { Form, fields, state } = useFormBridge(schema, { validateOn: 'onTouched' })

  return (
    <Form onSubmit={save}>
      <fields.fullName />
      <fields.email />
      <fields.password />
      <fields.terms />
      <Form.Submit disabled={!state.isValid}>Create account</Form.Submit>
    </Form>
  )
}`,
        },
        {
          filename: 'Registration.native.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.overviewNative,
          code: `import { ScrollView, View } from 'react-native'
import { field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  fullName: field.text('Full name').required(),
  email: field.email('Email').required(),
  password: field.password('Password').required().strong(),
}

export function RegistrationScreen() {
  const { Form, fields, state } = useFormBridge(schema, { validateOn: 'onTouched' })
  return (
    <ScrollView>
      <Form onSubmit={save}>
        <View style={{ gap: 12, padding: 16 }}>
          <fields.fullName />
          <fields.email />
          <fields.password />
          <Form.Submit disabled={!state.isValid}>Create</Form.Submit>
        </View>
      </Form>
    </ScrollView>
  )
}`,
        },
      ],
    },
    {
      id: 'fb-schema',
      title: 'Schema mental model',
      content: `A schema is a plain object where each key becomes a field name and each value is a builder.

- The builder defines the field type, default value, label, validation, visibility conditions, and platform hints.
- \`SchemaValues<typeof schema>\` gives you the submitted values shape automatically.
- Because the schema is just data, the same object can drive editing forms, wizards, readonly reviews, analytics, and even dynamic rendering.
- The practical rule of thumb: if a behavior belongs to the field itself, keep it in the builder instead of scattering it across components.`,
      subsections: [
        {
          id: 'fb-schema-shape',
          title: 'What the schema controls',
          content: `- Rendering: text input, select, radio, phone, file, OTP, custom renderer, and more
- Validation: required rules, length/number constraints, async validators, cross-field checks
- UX metadata: labels, placeholders, hints, web overrides
- Runtime conditions: visible, required, disabled, reset/clear/keep on hide`,
        },
      ],
    },

    // ── Core API ───────────────────────────────────────────────
    {
      id: 'fb-use-form-bridge',
      title: 'useFormBridge()',
      content: `Primary hook that turns a schema into a working form runtime.

- Use it when the schema is known in code and you want the main cross-platform API.
- It returns everything needed to render the form, read live state, run validation, persist drafts, and control the form imperatively.
- This is the foundation that the higher-level helpers build on top of.`,
      codeTabs: [
        {
          filename: 'useFormBridge.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.lifecycle,
          code: `const {
  Form,
  fields,
  state,
  visibility,
  isLoadingDraft,
  hasDraft,
  clearDraft,
  saveDraftNow,
  setValue,
  getValue,
  getValues,
  validate,
  reset,
  setError,
  clearErrors,
  watch,
  watchAll,
  submit,
} = useFormBridge(schema, {
  validateOn: 'onBlur',
  revalidateOn: 'onChange',
  resolver,
  persist,
  formKey: 'checkout-step-1',
  initialValues: { quantity: 2 },
  analytics,
})`,
        },
      ],
      subsections: [
        {
          id: 'fb-use-form-bridge-options',
          title: 'Options',
          content: `- \`validateOn\` controls the first validation trigger. Default: \`'onBlur'\`
- \`revalidateOn\` controls follow-up validation after the field was interacted with. Default: \`'onChange'\`
- \`resolver(values)\` plugs external schema validation such as Zod or Yup and becomes the validation source of truth
- \`persist\` enables automatic draft save/restore with storage, TTL, debounce, exclusion, and versioning
- \`formKey\` recreates the internal form instance when the form context changes, which is useful for step-based or tab-based flows
- \`initialValues\` hydrates the runtime from existing data
- \`analytics\` wires form analytics without changing field components
- \`showErrorsOn\` is present in the public type surface; treat it as reserved until the shared runtime adds dedicated error-display timing on top of validation triggers`,
        },
        {
          id: 'fb-use-form-bridge-return',
          title: 'Return value',
          content: `- \`Form\`: wrapper component that owns submit lifecycle
- \`fields\`: typed field components generated from the schema keys
- \`state\`: live values, errors, touched, dirty, status, submit state, and submitError
- \`visibility\`: reactive per-field visibility/required/disabled map
- Draft helpers: \`isLoadingDraft\`, \`hasDraft\`, \`saveDraftNow()\`, \`clearDraft()\`
- Imperative helpers: \`setValue\`, \`getValue\`, \`getValues\`, \`validate\`, \`reset\`, \`setError\`, \`clearErrors\`, \`watch\`, \`watchAll\`, \`submit\``,
        },
      ],
    },
    {
      id: 'fb-form',
      title: 'Form component',
      content: `Wrapper component returned by the hook. It connects submit, validation, async loading state, and submit error handling to the generated field runtime.

- On web, it behaves like a smart \`<form>\`
- On native, it behaves like a smart wrapper you can place inside your layout
- \`Form.Submit\` is coupled to the same runtime, so loading and disabled states stay aligned with the form`,
      codeTabs: [
        {
          filename: 'Form.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.lifecycle,
          code: `<Form
  onSubmit={saveProfile}
  onError={(errors) => console.log(errors)}
  onSubmitError={(error) => console.log(error)}
>
  {/* fields... */}
  <Form.Submit loadingText="Saving...">Save</Form.Submit>
</Form>`,
        },
      ],
      subsections: [
        {
          id: 'fb-form-props',
          title: 'Props',
          content: `- \`onSubmit(values)\` is required and can be sync or async
- \`onError(errors)\` is called when validation fails before submit
- \`onSubmitError(error)\` maps thrown submit errors to a user-facing message stored in \`state.submitError\`
- Web rendering also accepts normal wrapper props such as \`className\` and \`style\``,
        },
        {
          id: 'fb-submit-props',
          title: 'Form.Submit',
          content: `- \`children\` defines the button label
- \`loadingText\` replaces the label while the form is submitting
- \`disabled\` lets you add extra blocking conditions on top of submit state
- Visual props such as \`className\` and \`style\` are forwarded to the renderer`,
        },
      ],
    },
    {
      id: 'fb-fields',
      title: 'Generated fields',
      content: `\`fields.name\` renders the correct platform field for each schema key.

- You never manually register inputs or bind value/error state for standard fields
- Each generated component already knows its validation, current value, hidden/disabled state, and platform renderer
- Per-render overrides stay possible for labels, hints, placeholders, styles, and event hooks without mutating the original schema`,
      subsections: [
        {
          id: 'fb-field-props',
          title: 'Props',
          content: `- \`label\`
- \`hint\`
- \`placeholder\`
- \`disabled\` (override runtime conditions)
- \`required\` (override runtime conditions)
- \`hidden\` (override runtime conditions)
- \`value\` override
- \`error\` override
- \`onChange(value)\`
- \`onBlur()\`
- \`onFocus()\`

Web appearance alias
- \`web.id\`
- \`web.classNames\`
- \`web.styles\`
- \`web.rootProps\`
- \`web.labelProps\`
- \`web.inputProps\`
- \`web.textareaProps\`
- \`web.selectProps\`
- \`web.hintProps\`
- \`web.errorProps\`
- \`web.renderLabel\`
- \`web.renderHint\`
- \`web.renderError\`
- \`web.renderRequiredMark\`
- \`web.hideLabel\`
- \`web.highlightOnError\`

Native appearance alias
- \`native.id\`
- \`native.styles\`
- \`native.rootProps\`
- \`native.labelProps\`
- \`native.inputProps\`
- \`native.hintProps\`
- \`native.errorProps\`
- \`native.renderLabel\`
- \`native.renderHint\`
- \`native.renderError\`
- \`native.renderRequiredMark\`
- \`native.hideLabel\`
- \`native.highlightOnError\``,
        },
        {
          id: 'fb-field-behavior',
          title: 'How overrides behave',
          content: `- Schema-level builder methods define the default contract for every render of that field
- Component props are useful for one-off overrides in a specific screen or section
- Prefer schema-level configuration for business rules, and per-render props for local presentation tweaks`,
        },
      ],
    },
    {
      id: 'fb-state',
      title: 'State',
      content: `Current reactive state returned by \`useFormBridge()\`.

- Read from it to disable buttons, show summaries, build progress UI, or inspect submit lifecycle
- It is already derived from the schema and the current user interactions`,
      code: {
        filename: 'State.ts',
        lang: 'ts',
        preview: DOC_PREVIEWS.lifecycle,
        code: `form.state.values
form.state.errors
form.state.touched
form.state.dirty
form.state.status // 'idle' | 'validating' | 'submitting' | 'success' | 'error'
form.state.isValid
form.state.isDirty
form.state.isSubmitting
form.state.isSuccess
form.state.isError
form.state.submitCount`,
      },
    },
    {
      id: 'fb-actions',
      title: 'Actions & helpers',
      content: `Imperative helpers are useful when the form participates in a bigger flow: wizard steps, route changes, modal close guards, inline autosave, or external events.`,
      code: {
        filename: 'Actions.ts',
        lang: 'ts',
        preview: DOC_PREVIEWS.lifecycle,
        code: `await form.validate(names?)
form.reset(values?)
form.setValue('firstName', 'Ava')
form.getValue('firstName')
form.getValues()
form.setError('email', 'Already used')
form.clearErrors(['email'])
form.watch('email')
form.watchAll()
await form.submit()
await form.saveDraftNow()
await form.clearDraft()
form.visibility.company?.visible`,
      },
    },
    {
      id: 'fb-validation',
      title: 'Validation',
      content: `Validation in react-formbridge happens in two layers.

- Field builders cover most everyday rules directly in the schema: \`required\`, \`min\`, \`max\`, \`pattern\`, \`matches/sameAs\`, number helpers, \`mustBeTrue\`, \`validate(fn)\`, and more.
- A schema-level \`resolver\` lets an external validator such as Zod or Yup own the final result shape.
- Defaults today: \`validateOn='onBlur'\`, \`revalidateOn='onChange'\`.`,
      subsections: [
        {
          id: 'fb-validation-field-level',
          title: 'Field-level validation',
          content: `Use builder methods when the rule belongs to the field itself: required inputs, length or numeric constraints, agreement toggles, file limits, phone formatting, and cross-field checks such as confirm password.`,
        },
        {
          id: 'fb-validation-resolver',
          title: 'Resolver validation',
          content: `Use a resolver when you already own a domain schema elsewhere in the app. The resolver returns \`{ values, errors }\` and becomes the validation source of truth for the form runtime.`,
        },
      ],
    },

    // ── Field builders per builder ────────────────────────────
    {
      id: 'fb-text',
      title: 'field.text()',
      content: `The base builder for free-form strings.

- Use it for names, titles, slugs, comments, usernames, or any string that does not deserve a more specialized builder.
- Most string-oriented builders build on top of the same mental model: label, default value, validation, transform, hint, and platform rendering.`,
      codeTabs: [
        {
          filename: 'Text.web.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.textField,
          code: `const schema = {
  fullName: field.text('Full name')
    .required('Name is required')
    .trim()
    .min(2)
    .max(80)
    .matches(/^[a-z\\s'-]+$/i, 'Only letters and spaces.'),
}
const { Form, fields } = useFormBridge(schema)
<Form onSubmit={save}><fields.fullName /><Form.Submit>Save</Form.Submit></Form>`,
        },
        {
          filename: 'Text.native.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.overviewNative,
          code: `const schema = {
  fullName: field.text('Full name').required().trim(),
}
const { Form, fields } = useFormBridge(schema)
<Form onSubmit={save}><fields.fullName /><Form.Submit>Save</Form.Submit></Form>`,
        },
      ],
      subsections: [
        {
          id: 'fb-text-props',
          title: 'Props & defaults',
          content: `- label (string, required)
- defaultValue (string, default '')
- required(message?) (boolean, default false)
- placeholder (string | undefined)
- hint (string | undefined)
- min(length)
- max(length)
- matches(regex, message?) (RegExp)
- trim()
- lowercase()
- uppercase()
- debounce(ms) (number, default 300)
- validate(fn) (sync/async)
- transform(fn)
- disabled (boolean, default false)
- hidden (boolean, default false)
- appearance(config) for cross-platform field-owned appearance defaults
- web(config) for explicit web-only defaults such as ids, class/style hints, autocomplete behavior, and renderer metadata
- native(config) for explicit native-only defaults such as keyboard hints, autofill behavior, and renderer metadata`,
        },
      ],
    },
    {
      id: 'fb-email',
      title: 'field.email()',
      content: `Specialized string builder for email inputs.

- It keeps the same API as \`field.text()\`
- It adds a built-in email format validator
- It is usually paired with \`trim()\`, \`lowercase()\`, and web autocomplete hints`,
      codeTabs: [
        {
          filename: 'Email.web.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.textField,
          code: `const schema = {
  email: field.email('Work email').required().lowercase().trim(),
}
const { Form, fields } = useFormBridge(schema)
<Form onSubmit={save}><fields.email appearance={{ inputProps:{ autoComplete:'email' }}} /><Form.Submit>Send</Form.Submit></Form>`,
        },
        {
          filename: 'Email.native.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.overviewNative,
          code: `const schema = {
  email: field.email('Work email').required().trim(),
}

const { Form, fields } = useFormBridge(schema)

<Form onSubmit={save}>
  <fields.email />
  <Form.Submit>Send</Form.Submit>
</Form>`,
        },
      ],
      subsections: [
        {
          id: 'fb-email-props',
          title: 'Props & defaults',
          content: `Same as \`field.text()\`, plus:

- built-in email pattern check
- defaultValue \`''\`
- required(default false)
- debounce(300)
- disabled(default false)
- hidden(default false)`,
        },
      ],
    },
    {
      id: 'fb-password',
      title: 'field.password()',
      content: `Password-specialized builder for auth and account flows.

- Use \`strong()\` for built-in strength rules
- Use \`sameAs('password')\` or \`matches('password')\` for confirmation fields
- Use \`withStrengthIndicator()\` when you want richer UI feedback without switching to a custom renderer`,
      codeTabs: [
        {
          filename: 'Password.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.password,
          code: `const schema = {
  password: field.password('Password')
    .required()
    .strong()
    .withStrengthIndicator({ showBar:true, showRules:true, blockWeak:true }),
  confirm: field.password('Confirm').required().sameAs('password','Passwords must match.'),
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-password-props',
          title: 'Props & defaults',
          content: `- defaultValue '' (string)
- required(default false)
- strong() enables built-in strength rules
- sameAs(field, message?)
- withStrengthIndicator({ showBar?, showLabel?, showRules?, showEntropy?, barHeight?, barRadius?, config?, levels?, blockWeak?, blockMsg? })
- debounce(300)
- validate(fn)
- transform(fn)
- disabled(default false)
- hidden(default false)`,
        },
      ],
    },
    {
      id: 'fb-tel',
      title: 'field.tel()',
      content: `Generic telephone string builder without country metadata.

- Use it when you only need a basic phone text input
- Use \`field.phone()\` instead when you need country-aware parsing, dial codes, E.164 output, or built-in phone validation`,
      codeTabs: [
        {
          filename: 'Tel.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.textField,
          code: `const schema = {
  supportPhone: field.tel('Support phone')
    .pattern(/^[+\\d\\s()-]{6,20}$/, 'Enter a valid phone.')
    .required(),
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-tel-props',
          title: 'Props & defaults',
          content: `- defaultValue \`''\` (string)
- required(default false)
- built-in generic phone regex
- pattern(regex, message?) for extra validation
- min(length)
- max(length)
- debounce(300)
- validate(fn)
- transform(fn)
- disabled(default false)
- hidden(default false)
- appearance(config)
- web(config)
- native(config)`,
        },
      ],
    },
    {
      id: 'fb-url',
      title: 'field.url()',
      content: `String builder for URLs with an HTTP/HTTPS format check out of the box.

- Good for profile websites, callback URLs, portfolio links, or support links
- Use \`hint()\` to reinforce the expected shape, for example \`https://...\``,
      codeTabs: [
        {
          filename: 'Url.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.textField,
          code: `const schema = { website: field.url('Website').optional().trim() }`,
        },
      ],
      subsections: [
        {
          id: 'fb-url-props',
          title: 'Props & defaults',
          content: `- built-in URL check
- defaultValue \`''\` (string)
- required(default false)
- trim()
- lowercase()
- uppercase()
- min(length)
- max(length)
- debounce(300)
- validate(fn)
- transform(fn)
- disabled(default false)
- hidden(default false)
- appearance(config)
- web(config)
- native(config)`,
        },
      ],
    },
    {
      id: 'fb-textarea',
      title: 'field.textarea()',
      content: `Multiline version of the string builder.

- Useful for bios, comments, notes, issue descriptions, support tickets, or feedback boxes
- Usually paired with \`max()\` and \`hint()\` to keep user expectations clear`,
      codeTabs: [
        {
          filename: 'Bio.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.textField,
          code: `const schema = { bio: field.textarea('Bio').max(400) }`,
        },
      ],
      subsections: [
        {
          id: 'fb-textarea-props',
          title: 'Props & defaults',
          content: `- defaultValue \`''\` (string)
- required(default false)
- min(length)
- max(length)
- debounce(300)
- validate(fn)
- transform(fn)
- disabled(default false)
- hidden(default false)
- appearance(config)
- web(config)
- native(config)`,
        },
      ],
    },
    {
      id: 'fb-number',
      title: 'field.number()',
      content: `Numeric builder for quantities, prices, ratings, ages, and thresholds.

- The stored value is numeric, not string-based
- Numeric helpers live directly on the builder: \`positive()\`, \`nonNegative()\`, \`integer()\`, and \`step()\``,
      codeTabs: [
        {
          filename: 'Number.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.textField,
          code: `const schema = {
  quantity: field.number('Quantity')
    .required()
    .positive()
    .integer()
    .step(5, 'Order in increments of 5'),
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-number-props',
          title: 'Props & defaults',
          content: `- defaultValue \`0\` (number)
- required(default false)
- min(number)
- max(number)
- positive()
- nonNegative()
- integer()
- step(size, message?)
- debounce(300)
- transform(fn)
- validate(fn)
- disabled(default false)
- hidden(default false)`,
        },
      ],
    },
    {
      id: 'fb-checkbox',
      title: 'field.checkbox()',
      content: `Boolean builder rendered as a checkbox.

- Best for agreements, acceptance of terms, and optional boolean choices
- Use \`mustBeTrue()\` when the field is legally or functionally required before submit`,
      codeTabs: [
        {
          filename: 'Checkbox.web.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.choice,
          code: `const schema = {
  terms: field.checkbox('I accept the Terms of Service')
    .mustBeTrue('Please accept the terms to continue.'),
}`,
        },
        {
          filename: 'Checkbox.native.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.overviewNative,
          code: `const schema = {
  marketing: field.checkbox('Receive product updates'),
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-checkbox-props',
          title: 'Props & defaults',
          content: `- defaultValue \`false\`
- required(default false)
- mustBeTrue(message?) turns the checkbox into a hard validation rule
- hint()
- disabled(default false)
- hidden(default false)
- appearance(config)
- web(config)
- native(config)`,
        },
      ],
    },
    {
      id: 'fb-switch',
      title: 'field.switch()',
      content: `Boolean builder rendered as a switch or toggle.

- Prefer it for settings, preferences, feature flags, and on/off states
- Keep \`field.checkbox()\` for agreements and legal acceptance flows`,
      codeTabs: [
        {
          filename: 'Switch.web.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.choice,
          code: `const schema = {
  notifications: field.switch('Enable email notifications'),
}`,
        },
        {
          filename: 'Switch.native.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.overviewNative,
          code: `const schema = {
  publicProfile: field.switch('Public profile').hint('Visible to other members'),
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-switch-props',
          title: 'Props & defaults',
          content: `- defaultValue \`false\`
- required(default false)
- mustBeTrue(message?) when the toggle must explicitly be enabled
- hint()
- disabled(default false)
- hidden(default false)
- appearance(config)
- web(config)
- native(config)`,
        },
      ],
    },
    {
      id: 'fb-select',
      title: 'field.select()',
      content: `Single-choice picker for finite option lists.

- Use \`options(list)\` for local options
- Use \`optionsFrom(fetcher, config)\` for remote datasets
- Add \`searchable()\` when a richer lookup experience is needed`,
      codeTabs: [
        {
          filename: 'Select.web.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.choice,
          code: `const schema = {
  country: field.select('Country')
    .options(['France', 'Germany', 'Japan'])
    .required(),
}`,
        },
        {
          filename: 'Select.native.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.overviewNative,
          code: `const schema = {
  plan: field.select('Plan')
    .options([
      { label: 'Starter', value: 'starter' },
      { label: 'Pro', value: 'pro' },
    ])
    .required(),
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-select-async-config',
          title: 'optionsFrom config',
          content: `- \`key\`
- \`cacheTtl\` (default \`60000\`)
- \`debounce\` (default \`300\`)
- \`minChars\` (default \`0\`)
- \`dependsOn\` (default \`[]\`)
- \`initialOptions\` (default \`[]\`)
- \`fetchOnMount\` (default \`true\`)
- \`keepPreviousOptions\` (default \`true\`)
- \`preserveOnError\` (default \`true\`)`,
        },
        {
          id: 'fb-select-custom-picker',
          title: 'Custom picker modal',
          content: `Need a custom modal, bottom sheet, command palette, or searchable dialog instead of the built-in picker? Pass \`renderPicker\`.

- Works for local options and \`optionsFrom(...)\`
- Works globally through \`useFormBridge(schema, { globalAppearance })\`
- Works per schema field through \`appearance(...)\`, \`web(...)\`, or \`native(...)\`
- Works per rendered field through \`<Fields.city appearance={{ renderPicker }} />\`

\`\`\`tsx
const schema = {
  city: field
    .select('City')
    .optionsFrom(fetchCities, {
      key: 'city-search',
      debounce: 250,
      minChars: 2,
    })
    .searchable()
    .appearance({
      renderPicker: ({
        open,
        search,
        setSearch,
        options,
        loading,
        error,
        triggerLabel,
        closePicker,
        selectOption,
      }) =>
        open ? (
          <CityLookupModal
            title={triggerLabel}
            query={search}
            loading={loading}
            error={error}
            items={options}
            onQueryChange={setSearch}
            onClose={closePicker}
            onSelect={(option) => selectOption(option)}
          />
        ) : null,
    }),
}
\`\`\`

The \`renderPicker\` context gives you: \`open\`, \`search\`, \`setSearch\`, \`clearSearch\`, \`options\`, \`loading\`, \`error\`, \`selectedOption\`, \`triggerLabel\`, \`openPicker\`, \`closePicker\`, and \`selectOption\`. That makes it easy to plug the same field into a design-system modal on web, a native sheet on mobile, or a fully custom async search experience without replacing the rest of the field API.`,
        },
        {
          id: 'fb-select-props',
          title: 'Props & defaults',
          content: `- defaultValue: '' until the user selects an option
- options(list)
- optionsFrom(fetcher, config)
- required(default false)
- searchable() default false
- placeholder()
- hint()
- disabled(default false)
- hidden(default false)
- appearance(config) for shared picker styling and custom pickers via \`renderPicker\`
- web(config) for ids, class/style hints, and web-specific picker behavior
- native(config) for native-only styling, modal/sheet behavior, and renderer metadata`,
        },
      ],
    },
    {
      id: 'fb-radio',
      title: 'field.radio()',
      content: `Radio-group version of the select builder.

- Best when the number of options is small and each choice should stay visible
- It shares the same option shape as \`field.select()\``,
      codeTabs: [
        {
          filename: 'Radio.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.choice,
          code: `const schema = {
  role: field.radio('Role')
    .options(['Admin','Editor','Viewer'])
    .required(),
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-radio-props',
          title: 'Props & defaults',
          content: `- same option contract as \`field.select()\`
- defaultValue \`''\`
- options(list)
- required(default false)
- hint()
- disabled(default false)
- hidden(default false)
- appearance(config)
- web(config)
- native(config)
- choose radio when all choices should remain visible at once`,
        },
      ],
    },
    {
      id: 'fb-date',
      title: 'field.date()',
      content: `Date-specialized builder with min/max date helpers.

- Use it for booking windows, deadlines, birth dates, subscription start dates, or any date constrained by business rules
- It keeps the same string-field ergonomics while adding semantic date validation`,
      codeTabs: [
        {
          filename: 'Date.web.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.date,
          code: `const schema = {
  startDate: field.date('Start date')
    .required()
    .minDate(new Date(), 'Choose a future date.'),
}`,
        },
        {
          filename: 'Date.native.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.overviewNative,
          code: `const schema = {
  dateOfBirth: field.date('Date of birth')
    .maxDate('2008-01-01', 'You must be at least 18 years old.'),
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-date-props',
          title: 'Props & defaults',
          content: `- defaultValue \`''\` (string)
- required(default false)
- minDate(Date | string, message?)
- maxDate(Date | string, message?)
- hint()
- placeholder()
- debounce(300)
- disabled(default false)
- hidden(default false)
- appearance(config)
- web(config)
- native(config)`,
        },
      ],
    },
    {
      id: 'fb-phone',
      title: 'field.phone()',
      content: `Country-aware phone builder with parsing and validation built in.

- Use it when you need real phone UX rather than a free-form telephone string
- It supports country defaults, preferred countries, dial code display, E.164 storage, and format validation`,
      codeTabs: [
        {
          filename: 'Phone.tsx',
          lang: 'ts',
          preview: DOC_PREVIEWS.phone,
          code: `const schema = {
  phone: field.phone('Phone')
    .defaultCountry('FR')
    .preferredCountries(['FR','US','GB'])
    .searchable()
    .showFlag(true)
    .showDialCode(true)
    .storeE164()
    .required(),
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-phone-props',
          title: 'Props & defaults',
          content: `- defaultValue null
- placeholder 'Enter phone number'
- debounce 0 for immediate formatting feedback
- defaultCountry(code?) default 'FR'
- preferredCountries(string[]) default ['FR','US','GB','DE','ES']
- searchable(default true)
- showFlag(default true)
- showDialCode(default true)
- storeE164(default false)
- validateFormat(default true)
- required(default false)
- disabled(default false)
- hidden(default false)`,
        },
      ],
    },
    {
      id: 'fb-masked',
      title: 'field.masked()',
      content: `String input constrained by a mask pattern or preset.

- Use it for credit cards, expiry dates, ZIP codes, formatted identifiers, or short structured values
- The second argument can be a built-in preset from \`MASKS\` or any custom pattern string
- Masking keeps input readable while preserving normal schema-level validation`,
      codeTabs: [
        {
          filename: 'Masked.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.phone,
          code: `import { MASKS } from '@runilib/react-formbridge'

const schema = {
  cardNumber: field.masked('Card number', MASKS.CARD_16)
    .required()
    .showMaskInPlaceholder()
    .validateComplete('Card is incomplete.'),

  licensePlate: field
    .masked('License plate', 'LL-999-LL')
    .tokens({
      L: /[A-Z]/,
    })
    .uppercase(),
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-masked-props',
          title: 'Props & defaults',
          content: `- mask preset (required)
- custom pattern string supported
- built-in tokens: \`9\` (digit)
- built-in tokens: \`a\` (letter)
- built-in tokens: \`*\` (any)
- defaultValue \`''\` (string)
- required(default false)
- formatted value stored by default, so separators such as \`/\`, \`-\`, and spaces are preserved
- storeRaw(): opt in to the unformatted raw payload when you explicitly need it
- storeMasked(): keep the formatted value explicitly
- showPlaceholder(char?) default false, renders placeholder characters directly inside the value
- showMaskInPlaceholder(char?) default false, keeps the value empty and renders the mask as the input placeholder instead
- tokens(map): add or override token characters for advanced masks such as \`L\` for uppercase letters only
- validateComplete(message?) ensures full mask filled
- uppercase()
- lowercase()
- debounce(300)
- validate(fn)
- transform(fn)
- disabled(default false)
- hidden(default false)`,
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
          content: `Pass any of these presets as \`field.masked('Label', MASKS.X)\`.

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
    },
    {
      id: 'fb-file',
      title: 'field.file()',
      content: `File upload builder for documents, media, and attachments.

- It covers validation, previews, accepted types, max size, multiple upload, and source behavior
- Platform differences are handled by the renderer, while the schema keeps the business contract`,
      codeTabs: [
        {
          filename: 'File.web.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.file,
          code: `const schema = {
  avatar: field.file('Avatar')
    .accept(['image/jpeg','image/png'])
    .maxSize(5 * 1024 * 1024)
    .preview(120)
    .required('Please upload a photo.'),
}`,
        },
        {
          filename: 'File.native.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.overviewNative,
          code: `const schema = {
  identityCard: field.file('Identity card')
    .accept(['image/jpeg', 'image/png', 'application/pdf'])
    .source('documents')
    .withBase64()
    .maxSize(10 * 1024 * 1024),
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-file-props',
          title: 'Props & defaults',
          content: `- defaultValue null for single-file fields, [] after calling multiple()
- accept(string[]) default any
- maxSize(bytes) default no limit
- multiple(maxFiles?) enables array mode and defaults maxFiles to 10
- preview(sizePx?) enables image previews
- source('gallery' | 'camera' | 'documents' | 'all') is especially useful on native
- withBase64()
- resize(maxWidth, maxHeight, quality)
- allowVideo()
- noDragDrop() disables DnD (web)
- required(default false)
- hint()
- disabled(default false)
- hidden(default false)`,
        },
      ],
    },
    {
      id: 'fb-otp',
      title: 'field.otp()',
      content: `One-time-password builder for short verification codes.

- It is a good fit for email verification, sign-in confirmation, payment confirmation, or device pairing
- Combine \`length()\`, \`digitsOnly()\`, and \`validateOn: 'onChange'\` for the smoothest UX`,
      codeTabs: [
        {
          filename: 'Otp.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.otp,
          code: `const schema = {
  code: field.otp('Verification code')
    .length(6)
    .digitsOnly()
    .required(),
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-otp-props',
          title: 'Props & defaults',
          content: `- length(n) default undefined (accepts free length)
- digitsOnly(default false)
- defaultValue '' string
- required(false)
- debounce(300)
- validate(fn)
- transform(fn)
- disabled(default false)
- hidden(default false)`,
        },
      ],
    },
    {
      id: 'fb-custom',
      title: 'field.custom()',
      content: `Escape hatch for UI that deserves a custom renderer while keeping the rest of the form runtime.

- Use it when the built-in field types are not enough
- You still keep schema typing, validation, state, submit lifecycle, and the same generated field map`,
      codeTabs: [
        {
          filename: 'Custom.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.textField,
          code: `const schema = {
  rating: field.custom('Rating', 0)
    .render(({ label, value, onChange, error }) => (
      <div>
        <p>{label}</p>
        {[1,2,3,4,5].map((n) => (
          <button key={n} type="button" onClick={() => onChange(n)}>
            {value >= n ? '★' : '☆'}
          </button>
        ))}
        {error ? <p>{error}</p> : null}
      </div>
    ))
    .validate((value) => (value > 0 ? null : 'Pick a rating')),
}

const { Form, fields } = useFormBridge(schema)

<Form onSubmit={save}>
  <fields.rating />
  <Form.Submit>Send</Form.Submit>
</Form>`,
        },
      ],
      subsections: [
        {
          id: 'fb-custom-props',
          title: 'Props & defaults',
          content: `- label (string, required)
- defaultValue (required, typed)
- required(message?) default false
- render(fn) keeps the normal field runtime while letting you replace the UI

render(fn) receives
- label
- value
- error
- touched
- dirty
- validating
- onChange
- onBlur
- onFocus
- allValues

- validate(fn)
- transform(fn)
- debounce(300)
- disabled(default false)
- hidden(default false)`,
        },
      ],
    },

    // ── Advanced ──────────────────────────────────────────────
    {
      id: 'fb-adapters',
      title: 'Schema adapters (zod, yup, joi, valibot)',
      content: `Use the \`resolver\` option when your real validation source of truth already lives in Zod, Yup, Valibot, Joi, or another schema library.

- The schema builders still drive rendering and UX metadata
- The external schema owns the final values/errors decision
- Successful parsed/coerced values are now forwarded to submit handlers
- This is often the cleanest path in domains that already share validation with the backend`,
      codeTabs: [
        {
          filename: 'zod-resolver.ts',
          lang: 'ts',
          preview: DOC_PREVIEWS.resolver,
          code: `import { z } from 'zod'
import { field, useFormBridge, zodResolver } from '@runilib/react-formbridge'

const schema = {
  email: field.email('Email').required(),
  password: field.password('Password').required(),
}

const zodSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const form = useFormBridge(schema, {
  resolver: zodResolver(zodSchema),
})`,
        },
        {
          filename: 'yup-resolver.ts',
          lang: 'ts',
          preview: DOC_PREVIEWS.resolver,
          code: `import * as yup from 'yup'
import { field, useFormBridge, yupResolver } from '@runilib/react-formbridge'

const schema = {
  name: field.text('Full name').required(),
  age: field.number('Age').required(),
}

const yupSchema = yup.object({
  name: yup.string().min(2).required(),
  age: yup.number().min(18).required(),
})

const form = useFormBridge(schema, {
  resolver: yupResolver(yupSchema),
})`,
        },
        {
          filename: 'joi-resolver.ts',
          lang: 'ts',
          preview: DOC_PREVIEWS.resolver,
          code: `import Joi from 'joi'
import { field, joiResolver, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  email: field.email('Email').required(),
  age: field.number('Age').required().min(18),
}

const joiSchema = Joi.object({
  email: Joi.string().email({ tlds: false }).required(),
  age: Joi.number().min(18).required(),
})

const form = useFormBridge(schema, {
  resolver: joiResolver(joiSchema),
})`,
        },
        {
          filename: 'valibot-resolver.ts',
          lang: 'ts',
          preview: DOC_PREVIEWS.resolver,
          code: `import * as v from 'valibot'
import {
  field,
  useFormBridge,
  valibotResolver,
} from '@runilib/react-formbridge'

const schema = {
  email: field.email('Email').required(),
  password: field.password('Password').required(),
}

const valibotSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(8)),
})

const form = useFormBridge(schema, {
  resolver: valibotResolver(valibotSchema),
})`,
        },
      ],
      subsections: [
        {
          id: 'fb-adapter-options',
          title: 'Shared customization options',
          content: `All four built-in adapters share the same customization surface, so you can keep the same mental model even if the schema library changes later.

- \`rootKey\` controls where pathless errors land. Default: \`'_root'\`. Set it to \`null\` if you want to ignore form-level errors.
- \`errorMode\` controls duplicate messages for the same field: \`'first'\`, \`'last'\`, or \`'join'\`
- \`joinMessagesWith\` customizes the separator used by \`errorMode: 'join'\`
- \`formatPath(path, issue)\` lets you change the error key format, for example if you prefer \`items[0].name\` over \`items.0.name\`
- \`mapIssue(context)\` lets you remap, rewrite, or skip any schema issue before it reaches the form
- \`normalizeMessage(message, issue)\` lets you sanitize or translate messages in one place`,
          code: {
            filename: 'resolver-options.ts',
            lang: 'ts',
            preview: DOC_PREVIEWS.resolver,
            code: `import { field, joiResolver, useFormBridge } from '@runilib/react-formbridge'
import Joi from 'joi'

const schema = {
  email: field.email('Email').required(),
  plan: field.select('Plan').required(),
}

const joiSchema = Joi.object({
  email: Joi.string().email({ tlds: false }).required(),
  plan: Joi.string().required(),
})

const form = useFormBridge(schema, {
  resolver: joiResolver(joiSchema, {
    rootKey: 'form',
    errorMode: 'join',
    joinMessagesWith: ' · ',
    formatPath: (path) => path.map(String).join('.'),
    normalizeMessage: (message) => message.trim(),
    mapIssue: ({ defaultMessage, defaultPathKey }) => {
      if (defaultPathKey === 'plan') {
        return { message: \`Billing: \${defaultMessage}\` }
      }

      return undefined
    },
  }),
})`,
          },
        },
        {
          id: 'fb-adapter-library-options',
          title: 'Library-specific options',
          content: `Each adapter also exposes the options you usually need from its schema engine.

- \`zodResolver(schema, { mode, parseOptions })\`
- \`yupResolver(schema, { mode, validateOptions })\`
- \`joiResolver(schema, { mode, validateOptions, stripQuotes })\`
- \`valibotResolver(schema, { mode, parseOptions, module })\`

\`mode\` accepts \`'auto'\`, \`'sync'\`, or \`'async'\`. The default \`'auto'\` picks the async method when available, then falls back to sync. For Valibot, pass \`module: v\` if you want to avoid relying on runtime \`require()\`, especially in stricter ESM/browser setups.`,
        },
        {
          id: 'fb-adapter-tips',
          title: 'Tips',
          content: `- The resolver must return \`{ values, errors }\`
- The built-in adapters already handle this contract for you; customize them before writing a custom resolver from scratch
- Root errors default to \`'_root'\`, which is useful for banner-level or submit-level failures
- A resolver works with the same \`useFormBridge()\` API on web and native
- Prefer resolvers when business validation already exists elsewhere; prefer builder rules when the validation belongs to the field itself
- \`valibotResolver\` expects \`valibot\` to be installed in the consumer app, or passed explicitly via \`module: v\``,
        },
      ],
    },
    {
      id: 'fb-conditional',
      title: 'Conditional logic',
      content: `Conditional logic lives on the builders themselves, not in ad-hoc component branches.

- This keeps business rules close to the field contract
- The evaluated result is exposed through \`visibility\`, so the UI can still react outside the field renderer when needed`,
      code: {
        filename: 'Conditional.tsx',
        lang: 'tsx',
        preview: DOC_PREVIEWS.choice,
        code: `const schema = {
  accountType: field.radio('Account type')
    .options(['personal', 'business'])
    .required(),
  companyName: field.text('Company name')
    .visibleWhen('accountType', 'business')
    .requiredWhen('accountType', 'business')
    .clearOnHide(),
  vatNumber: field.text('VAT number')
    .visibleWhen('accountType', 'business')
    .disabledWhen('accountType', 'personal'),
}`,
      },
      subsections: [
        {
          id: 'fb-conditional-rules',
          title: 'Visibility',
          content: `- visibleWhen(field, value?)
- visibleWhenNot(field, value)
- visibleWhenTruthy(field)
- visibleWhenFalsy(field)
- visibleWhenAny(pairs)`,
        },
        {
          id: 'fb-conditional-required',
          title: 'Required',
          content: `- requiredWhen(field, value?)
- requiredWhenAny(pairs)`,
        },
        {
          id: 'fb-conditional-disabled',
          title: 'Disabled',
          content: `- disabledWhen(field, value?)`,
        },
        {
          id: 'fb-conditional-reset',
          title: 'Reset on hide',
          content: `- resetOnHide()
- clearOnHide()
- keepOnHide() (default)`,
        },
      ],
    },
    {
      id: 'fb-persistence',
      title: 'Draft persistence',
      content: `Draft persistence lets a form survive refreshes, tab changes, route changes, or interrupted sessions.

- Great for checkout flows, onboarding, long settings screens, or mobile forms that may be backgrounded
- The runtime restores saved values on mount and exposes helpers to manage that lifecycle`,
      code: {
        filename: 'Persist.tsx',
        lang: 'tsx',
        preview: DOC_PREVIEWS.lifecycle,
        code: `const form = useFormBridge(schema, {
  persist: {
    key: 'checkout-step-1',
    storage: 'local',
    ttl: 60 * 60,
    debounce: 800,
    exclude: ['password', 'cvv'],
    version: '2',
  },
})

if (form.isLoadingDraft) return <Spinner />

await form.saveDraftNow()
await form.clearDraft()`,
      },
      subsections: [
        {
          id: 'fb-persistence-notes',
          title: 'When to enable it',
          content: `Use persistence for long or interruption-prone flows. Exclude secrets such as passwords, PINs, OTPs, CVV, or any field you would not want stored locally.`,
        },
      ],
    },
    {
      id: 'fb-web-ui',
      title: 'Styling',
      content: `react-formbridge is intentionally styling-framework agnostic. The form runtime owns value, validation, visibility, and submit lifecycle. Your app stays free to style that runtime with CSS Modules, styled-components, Tailwind-style utilities, inline objects, React Native StyleSheet, NativeWind-friendly wrappers, or an in-house design system.

- Put styling in the schema when it should travel with the field everywhere the schema is reused
- Put styling in \`useFormBridge(schema, { globalAppearance })\` when one screen, one route, or one product area needs a shared visual language
- Put styling on \`<fields.name appearance={...} />\` when a single field needs a local exception
- Reach for \`field.custom().render(...)\` only when the UI structure itself must change; if the built-in renderer is already correct, stay on the styling layers`,
      codeTabs: [
        {
          filename: 'SharedTheme.web.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.stylingWeb,
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
    .appearance({ autoComplete: 'email', inputMode: 'email' }),
  launchNotes: field
    .textarea('Launch notes')
    .hint('Textarea inherits the same ui theme.'),
}

export function CheckoutForm() {
  const form = useFormBridge(schema, {
    validateOn: 'onTouched',
    globalAppearance: {
      form: { className: styles.form },
      submit: {
        className: styles.submit,
        loadingText: 'Saving...',
      },
      field: {
        appearance: {
          classNames: {
            root: styles.field,
            label: styles.label,
            input: styles.input,
            textarea: styles.input,
            error: styles.error,
            hint: styles.hint,
          },
        },
      },
    },
  })

  return (
    <form.Form onSubmit={saveCheckout}>
      <form.fields.projectName />
      <form.fields.ownerEmail
        appearance={{
          styles: {
            input: { borderColor: '#38bdf8' },
          },
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
          preview: DOC_PREVIEWS.stylingNative,
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
    .appearance({
      autoComplete: 'organization',
    }),
  ownerEmail: field
    .email('Owner email')
    .required()
    .appearance({ keyboardType: 'email-address', autoComplete: 'email' }),
  launchNotes: field
    .textarea('Launch notes')
    .hint('Textarea inherits the same ui theme.'),
}

export function CheckoutScreen() {
  const form = useFormBridge(schema, {
    ui: {
      submit: {
        containerStyle: checkoutUi.submitButton,
        textStyle: checkoutUi.submitText,
        loadingText: 'Saving...',
      },
      field: {
        appearance: {
          styles: {
            root: checkoutUi.fieldRoot,
            label: checkoutUi.fieldLabel,
            input: checkoutUi.fieldInput,
            hint: checkoutUi.fieldHint,
            error: checkoutUi.fieldError,
          },
        },
      },
    },
  })

  return (
    <ScrollView>
      <form.Form onSubmit={saveCheckout}>
        <View style={checkoutUi.stack}>
          <form.fields.projectName />
          <form.fields.ownerEmail />
          <form.fields.launchNotes
            appearance={{
              styles: {
                input: { minHeight: 112 },
              },
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
          content: `1. Use \`field.text(...).appearance(...)\` for defaults that belong to the field contract itself: autocomplete, keyboard type, ids, class/style hints, or a reusable baseline chrome that should follow the schema everywhere.
2. Use \`useFormBridge(schema, { globalAppearance })\` when a whole screen or product area needs the same theme. This is the default recommendation for CSS Modules, StyleSheet, utility-class maps, or design-system-wide field chrome.
3. Use local \`appearance\` props on \`<fields.name />\` when one field needs a special variant without mutating the shared schema.
4. Use \`field.custom().render(...)\` only when the structure itself must change. If the generated renderer is already the right input type, styling should usually stay in the layers above.

Merge order is predictable: builder \`appearance\` -> \`ui\` theme appearance -> local field appearance -> custom render hooks.`,
        },
        {
          id: 'fb-web-ui-css-modules',
          title: 'Recipe: shared theme with CSS Modules or StyleSheet',
          content: `This is the most common production setup.

- One \`ui\` object themes the form wrapper, every generated field, and the submit button
- The schema stays reusable across pages because the visual system lives at the screen level
- You still keep an escape hatch for one field with local \`appearance\` overrides`,
          codeTabs: [
            {
              filename: 'CssModulesTheme.web.tsx',
              lang: 'tsx',
              preview: DOC_PREVIEWS.stylingWeb,
              code: `const form = useFormBridge(schema, {
  ui: {
    form: { className: styles.formShell },
    submit: {
      className: styles.submitButton,
      loadingText: 'Applying CSS Modules theme...',
    },
    field: {
      appearance: {
        classNames: {
          root: styles.formField,
          label: styles.formLabel,
          input: styles.formInput,
          textarea: styles.formInput,
          select: styles.formInput,
          hint: styles.helperText,
          error: styles.errorBox,
        },
      },
    },
  },
})

<form.Form onSubmit={save}>
  <form.fields.projectName />
  <form.fields.ownerEmail
    appearance={{
      styles: {
        input: { borderColor: '#38bdf8' },
      },
    }}
  />
  <form.fields.department />
  <form.Form.Submit>Save CSS recipe</form.Form.Submit>
</form.Form>`,
            },
            {
              filename: 'StyleSheetTheme.native.tsx',
              lang: 'tsx',
              preview: DOC_PREVIEWS.stylingNative,
              code: `const form = useFormBridge(schema, {
  ui: {
    field: {
      appearance: {
        styles: {
          root: s.fieldRoot,
          label: s.fieldLabel,
          input: s.fieldInput,
          hint: s.fieldHint,
          error: s.fieldError,
          optionTrigger: s.fieldInput,
        },
      },
    },
    submit: {
      containerStyle: s.submitButton,
      textStyle: s.submitText,
      loadingText: 'Applying StyleSheet theme...',
    },
  },
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
              preview: DOC_PREVIEWS.stylingStyledWeb,
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
  appearance: {
    inputProps: { autoComplete: 'email', inputMode: 'email' },
  },
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
              preview: DOC_PREVIEWS.stylingStyledNative,
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
  appearance: {
    inputProps: {
      autoComplete: 'email',
      keyboardType: 'email-address',
    },
    styles: {
      root: { marginBottom: 0, gap: 8 },
      input: {
        minHeight: 52,
        borderWidth: 1.5,
        borderColor: 'rgba(56, 189, 248, 0.28)',
        borderRadius: 16,
        paddingHorizontal: 14,
        color: '#f8fafc',
        backgroundColor: 'rgba(15, 23, 42, 0.74)',
      },
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
- On native, use \`.attrs({ appearance: { styles: ... } })\` to feed slot styles into the generated field

This stable-host pattern is the safest documented recipe because generated field components are runtime artifacts. It keeps styling ergonomic without forcing users to hand-build every field.`,
          codeTabs: [
            {
              filename: 'StyledComponents.web.tsx',
              lang: 'tsx',
              preview: DOC_PREVIEWS.stylingStyledWeb,
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
  appearance: {
    inputProps: { autoComplete: 'email', inputMode: 'email' },
  },
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
              preview: DOC_PREVIEWS.stylingStyledNative,
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
  appearance: {
    inputProps: {
      autoComplete: 'email',
      keyboardType: 'email-address',
    },
    styles: {
      root: { marginBottom: 0, gap: 8 },
      label: { color: '#dbeafe', fontSize: 12, fontWeight: '800' },
      input: {
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
- Local \`appearance.classNames\` and \`appearance.inputProps\` cover one-off field variations
- The runtime stays the same because the generated field still owns value, validation, and events`,
          code: {
            filename: 'UtilityClasses.web.tsx',
            lang: 'tsx',
            preview: DOC_PREVIEWS.stylingUtilityWeb,
            code: `const form = useFormBridge(schema, {
  ui: {
    form: { className: 'space-y-4' },
    submit: {
      className:
        'inline-flex min-h-12 items-center justify-center rounded-2xl bg-cyan-400 px-5 font-semibold text-slate-950',
    },
    field: {
      appearance: {
        classNames: {
          root: 'space-y-2',
          label:
            'text-xs font-semibold uppercase tracking-[0.14em] text-slate-200',
          input:
            'w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none',
          textarea:
            'min-h-28 w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none',
          select:
            'w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none',
          hint: 'text-xs text-slate-400',
          error: 'text-sm text-rose-300',
        },
      },
    },
  },
})

<form.Form onSubmit={save}>
  <form.fields.ownerEmail
    appearance={{
      classNames: {
        input: 'border-cyan-400 focus:ring-2 focus:ring-cyan-400/30',
      },
      inputProps: {
        autoComplete: 'email',
        inputMode: 'email',
      },
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

- \`appearance.styles\` targets the built-in slots directly on both web and native
- \`renderHint\`, \`renderError\`, and \`renderRequiredMark\` cover the cases where plain styles are not enough
- This is also a good recipe for incrementally migrating an existing screen to react-formbridge`,
          codeTabs: [
            {
              filename: 'SlotOverrides.web.tsx',
              lang: 'tsx',
              preview: DOC_PREVIEWS.stylingSlotWeb,
              code: `const form = useFormBridge(schema, {
  validateOn: 'onTouched',
  ui: {
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
      appearance: {
        styles: {
          root: { marginBottom: 0, gap: 8 },
          label: {
            color: '#f8fafc',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          },
          input: {
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
    },
  },
})

<form.fields.receiptEmail
  appearance={{
    highlightOnError: false,
    renderHint: () => (
      <span style={{ color: '#cbd5e1', fontSize: 12 }}>
        We only use it for invoices and receipts.
      </span>
    ),
  }}
/>

<form.fields.postalCode
  appearance={{
    styles: {
      input: { textAlign: 'center', letterSpacing: '0.14em' },
    },
  }}
/>`,
            },
            {
              filename: 'FieldOverrides.native.tsx',
              lang: 'tsx',
              preview: DOC_PREVIEWS.stylingSlotNative,
              code: `const form = useFormBridge(schema, {
  validateOn: 'onTouched',
  ui: {
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
      appearance: {
        styles: {
          root: { marginBottom: 0, gap: 8 },
          label: {
            color: '#f8fafc',
            fontSize: 12,
            fontWeight: '800',
            letterSpacing: 0.7,
            textTransform: 'uppercase',
          },
          input: {
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
    },
  },
})

<form.fields.receiptEmail
  appearance={{
    highlightOnError: false,
    renderHint: () => (
      <Text style={{ color: '#cbd5e1', fontSize: 12 }}>
        We only use it for invoices and receipts.
      </Text>
    ),
  }}
/>

<form.fields.postalCode
  appearance={{
    styles: {
      input: { textAlign: 'center', letterSpacing: 2 },
    },
  }}
/>`,
            },
          ],
        },
        {
          id: 'fb-web-ui-web-surface',
          title: 'Web styling surface',
          content: `On web, the API is broad enough to work with CSS Modules, utility classes, styled-components, Emotion, or plain objects.

- Root-level \`className\` and \`style\` theme the field container directly
- \`ui.form\` and \`ui.submit\` style the generated form wrapper and submit button
- \`appearance.classNames\` and \`appearance.styles\` target built-in slots such as \`root\`, \`label\`, \`input\`, \`textarea\`, \`select\`, \`hint\`, \`error\`, \`checkboxRow\`, \`checkboxInput\`, \`checkboxLabel\`, \`switchRoot\`, \`switchTrack\`, \`switchThumb\`, \`otpContainer\`, and \`otpInput\`
- \`appearance.highlightOnError\` lets you opt out of the built-in red field chrome while keeping the error message
- \`appearance.rootProps\`, \`appearance.labelProps\`, \`appearance.inputProps\`, \`appearance.textareaProps\`, \`appearance.selectProps\`, \`appearance.hintProps\`, and \`appearance.errorProps\` let you push DOM attributes without losing the generated renderer
- \`appearance.renderLabel\`, \`appearance.renderHint\`, \`appearance.renderError\`, and \`appearance.renderRequiredMark\` cover the cases where styling alone is not enough
- Builder-level \`.appearance(...)\` is the default layer for field-owned UI metadata and styling`,
        },
        {
          id: 'fb-web-ui-native-surface',
          title: 'Native styling surface',
          content: `On React Native, the same layering applies, but the override points stay React Native-friendly instead of DOM-specific.

- Root-level \`style\` themes the field wrapper, while \`ui.form\` and \`ui.submit\` theme the form container and submit button
- \`appearance.styles\` targets \`root\`, \`label\`, \`input\`, \`hint\`, \`error\`, and \`requiredMark\`
- \`appearance.highlightOnError\` lets you opt out of the built-in red field chrome while keeping the error message
- Renderer-specific extra keys are also supported in \`appearance.styles\`, which is especially useful for inputs such as checkboxes, async selectors, or modal option lists
- \`appearance.rootProps\`, \`appearance.labelProps\`, \`appearance.inputProps\`, \`appearance.hintProps\`, and \`appearance.errorProps\` help with test IDs, accessibility, or integration with surrounding layout primitives
- \`appearance.renderLabel\`, \`appearance.renderHint\`, \`appearance.renderError\`, and \`appearance.renderRequiredMark\` cover the cases where a simple style object is not enough
- Builder-level \`.appearance(...)\` is the default layer for field-owned UI metadata and styling`,
        },
        {
          id: 'fb-web-ui-guidance',
          title: 'Use-case guide',
          content: `- Use \`ui\` when a whole route, modal, onboarding flow, or checkout screen should share one visual system
- Use builder-level \`.appearance()\` when the styling belongs to the field definition and should follow the schema everywhere it is reused
- Keep platform-specific differences inside the same \`appearance\` object or at the screen-level \`ui\` theme
- Use local \`appearance\` props when one field needs a variant, a special helper text, or a different accent color on one screen
- Use the stable host recipe for \`styled-components\` and \`styled-components/native\`
- Use \`className\` and \`classNames\` slot maps for Tailwind-style utility frameworks on web
- Use \`style\`, \`appearance.styles\`, wrappers, or the stable host recipe for React Native styling systems such as StyleSheet, NativeWind-friendly wrappers, or in-house component kits
- The API stays agnostic on purpose, so the same schema can power web and native without forcing the same styling stack on both platforms`,
        },
      ],
    },
    {
      id: 'fb-infer',
      title: 'field.infer()',
      content: `\`field.infer(obj, overrides?)\` generates a complete form schema from an existing JavaScript object. It auto-detects field types based on key names and value types, so you can go from a plain object to a working form in one line.

**How auto-detection works:**
- **Key-based** — keys containing \`email\`, \`password\`, \`phone\`, \`url\`, \`bio\`, \`description\`, \`date\`, \`active\`, \`enabled\`, \`toggle\` etc. are mapped to their matching field type
- **Value-based** — \`boolean\` → switch, \`number\` → number, \`Array\` → select, everything else → text
- **Labels** — keys are prettified automatically (\`firstName\` → "First name", \`phone_number\` → "Phone number")

The returned schema can be spread and selectively overridden with explicit builders — inferred fields and hand-written fields mix freely.`,
      code: {
        filename: 'InferBasic.ts',
        lang: 'ts',
        preview: DOC_PREVIEWS.textField,
        code: `import { field } from '@runilib/react-formbridge'

// Pass any object — field.infer reads keys + values to build the schema
const user = {
  firstName: 'Ava',
  email: 'ava@example.com',
  age: 32,
  active: true,
}

const schema = {
  // Infer all fields automatically
  ...field.infer(user),
  // Override a specific field with an explicit builder
  email: field.email('Email').required(),
}

// Result: firstName → text, email → email (overridden),
//         age → number, active → switch`,
      },
      subsections: [
        {
          id: 'fb-infer-overrides',
          title: 'Per-field overrides',
          content: `The second argument lets you customise individual inferred fields without replacing them entirely. Available override options:

- \`type\` — force a specific field type (e.g. \`'select'\`, \`'textarea'\`)
- \`label\` — override the auto-generated label
- \`required\` — \`true\` or a custom error message string
- \`min\` / \`max\` — min/max length or value constraints
- \`placeholder\` / \`hint\` — input placeholder and helper text
- \`options\` — provide options for select/radio fields
- \`disabled\` / \`hidden\` — field state
- \`validate\` — custom validation function \`(value, allValues) => string | null\``,
          code: {
            filename: 'InferOverrides.ts',
            lang: 'ts',
            preview: DOC_PREVIEWS.textField,
            code: `import { field } from '@runilib/react-formbridge'

const product = {
  name: '',
  description: '',
  price: 0,
  category: '',
  inStock: true,
}

const schema = field.infer(product, {
  name:        { required: true, min: 2, max: 100 },
  description: { type: 'textarea', placeholder: 'Describe the product...' },
  price:       { required: true, min: 0, hint: 'Price in euros' },
  category:    { type: 'select', options: ['Electronics', 'Clothing', 'Books'] },
  inStock:     { label: 'Available in stock' },
})`,
          },
        },
        {
          id: 'fb-infer-edit-form',
          title: 'Edit form pattern',
          content: `\`field.infer()\` is ideal for edit/update forms where you already have the entity data. The object values become the default values of each field, so the form is pre-filled automatically.`,
          code: {
            filename: 'InferEditForm.tsx',
            lang: 'tsx',
            preview: DOC_PREVIEWS.textField,
            code: `import { field, useFormBridge } from '@runilib/react-formbridge'

function EditUserForm({ user }: { user: User }) {
  // Schema is generated from the existing user — form is pre-filled
  const schema = field.infer(user, {
    email:    { required: 'Email is required' },
    password: { hidden: true },
    role:     { type: 'select', options: ['admin', 'user', 'viewer'] },
  })

  const { Form, fields } = useFormBridge(schema, {
    onSubmit: (values) => updateUser(user.id, values),
  })

  return <Form>{fields}</Form>
}`,
          },
        },
        {
          id: 'fb-infer-notes',
          title: 'When to use inference vs explicit builders',
          content: `Inference shines for rapid scaffolding — admin panels, CRUD tools, internal dashboards, prototypes. For production user-facing forms, explicit builders give you full control over labels, validation messages, conditional logic, and UX polish.

**Tip:** start with \`field.infer()\` to bootstrap quickly, then progressively replace inferred fields with explicit builders as your form requirements grow.`,
        },
      ],
    },
    {
      id: 'fb-infer-type',
      title: 'field.inferType()',
      content: `\`field.inferType<T>(fields)\` generates a schema purely from a TypeScript type — no object instance needed. You describe each property with its configuration, and the schema is fully typed against \`T\`.

This is useful when:
- You don't have an existing object to infer from (e.g. a creation form)
- You want the schema to be statically typed against a specific interface
- You need to define default values explicitly per field`,
      code: {
        filename: 'InferType.ts',
        lang: 'ts',
        preview: DOC_PREVIEWS.textField,
        code: `import { field } from '@runilib/react-formbridge'

type User = {
  name: string
  email: string
  age: number
  active: boolean
}

// Schema is typed as Record<keyof User, FieldDescriptor>
const schema = field.inferType<User>({
  name:   { label: 'Full name', required: true, min: 2 },
  email:  { label: 'Email', required: true },
  age:    { label: 'Age', min: 18, defaultValue: 18 },
  active: { label: 'Active', type: 'switch' },
})`,
      },
      subsections: [
        {
          id: 'fb-infer-type-defaults',
          title: 'Default values',
          content: `Each field entry accepts an optional \`defaultValue\`. If omitted, a sensible default is derived from the field type:

- \`number\` → \`0\`
- \`checkbox\` / \`switch\` → \`false\`
- Everything else → \`''\` (empty string)`,
          code: {
            filename: 'InferTypeDefaults.ts',
            lang: 'ts',
            preview: DOC_PREVIEWS.textField,
            code: `import { field } from '@runilib/react-formbridge'

type Settings = {
  theme: string
  fontSize: number
  notifications: boolean
}

const schema = field.inferType<Settings>({
  theme:         { label: 'Theme', type: 'select',
                   options: ['light', 'dark', 'auto'], defaultValue: 'auto' },
  fontSize:      { label: 'Font size', min: 10, max: 32, defaultValue: 16 },
  notifications: { label: 'Enable notifications', type: 'switch' },
  // notifications defaults to false (switch type)
})`,
          },
        },
        {
          id: 'fb-infer-type-vs-infer',
          title: 'field.infer() vs field.inferType()',
          content: `| | \`field.infer(obj)\` | \`field.inferType<T>(fields)\` |
|---|---|---|
| **Input** | A runtime object with values | A type + field config map |
| **Default values** | Taken from the object values | Explicit \`defaultValue\` or auto-derived |
| **Type detection** | Automatic from keys & values | You specify \`type\` manually |
| **Best for** | Edit forms, pre-filled data | Creation forms, type-first schemas |
| **Typing** | Inferred from the object shape | Explicit generic \`<T>\` |`,
        },
      ],
    },
    {
      id: 'fb-analytics',
      title: 'useFormBridgeAnalytics()',
      content: `Add analytics to a form without rewriting any field component.

- Track focus, completion time, change counts, abandonment, errors, and successful completion
- Keep callbacks metadata-oriented so analytics stays safe and privacy-conscious
- Works best when paired with a stable getter for current values`,
      codeTabs: [
        {
          filename: 'Analytics.web.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.analyticsWeb,
          code: `import { field, useFormBridge, useFormBridgeAnalytics } from '@runilib/react-formbridge'

const schema = {
  email: field.email('Email').required(),
  password: field.password('Password').required(),
}

export function SignupWithAnalytics() {
  const { Form, fields, state } = useFormBridge(schema)

  useFormBridgeAnalytics(
    {
      formId: 'signup',
      exclude: ['password'],
      callbacks: {
        onFieldComplete: (name, ms) => analytics.track('field_complete', { name, ms }),
        onFormCompleted: (durationMs, submitCount, fieldCount) =>
          analytics.track('form_done', { durationMs, submitCount, fieldCount }),
        onFormAbandoned: (pct, last, values) =>
          analytics.track('form_abandoned', { pct, last, values }),
      },
    },
    () => state.values,
  )

  return (
    <Form onSubmit={(values) => api.signup(values)}>
      <fields.email />
      <fields.password />
      <Form.Submit>Sign up</Form.Submit>
    </Form>
  )
}`,
        },
        {
          filename: 'Analytics.native.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.analyticsNative,
          code: `import { ScrollView, View } from 'react-native'
import { field, useFormBridge, useFormBridgeAnalytics } from '@runilib/react-formbridge'

const schema = { phone: field.phone('Phone').required() }

export function PhoneCapture() {
  const { Form, fields, state } = useFormBridge(schema)

  useFormBridgeAnalytics(
    {
      callbacks: {
        onFieldFocus: (name) => console.log('focus', name),
        onFieldChange: (name, count) => console.log('changes', name, count),
        onFormCompleted: (ms) => console.log('done in', ms),
      },
    },
    () => state.values,
  )

  return (
    <ScrollView>
      <Form onSubmit={(values) => console.log(values)}>
        <View style={{ gap: 12, padding: 16 }}>
          <fields.phone />
          <Form.Submit>Continue</Form.Submit>
        </View>
      </Form>
    </ScrollView>
  )
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-analytics-config',
          title: 'Config & defaults',
          content: `- callbacks (required): any subset of onFieldFocus, onFieldComplete, onFieldAbandoned, onFieldChange, onFieldError, onFieldErrorFixed, onFormAbandoned, onFormCompleted, onFormError
- exclude: string[]; default ['password','confirm','cvv','pin','otp','ssn','secret']
- formId?: string label sent with events`,
        },
        {
          id: 'fb-analytics-notes',
          title: 'Usage notes',
          content: `- Pass a stable getter for current values, e.g. () => state.values
- No field values are sent in onFieldChange; keep events metadata-only
- Works on web (pagehide/beforeunload/visibilitychange) and React Native (AppState)`,
        },
      ],
    },
    {
      id: 'fb-use-async-options',
      title: 'useAsyncOptions()',
      content: `Standalone hook for remote option lists.

- Use it directly when you want to build your own async autocomplete or picker UI
- Use it indirectly through \`field.select().optionsFrom(...)\` when a generated field is enough
- The hook handles debounce, caching, cancellation, dependency keys, and refreshes for you`,
      codeTabs: [
        {
          filename: 'AsyncCity.web.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.asyncWeb,
          code: `import { field, useAsyncOptions } from '@runilib/react-formbridge'

const cityFetcher = async ({ search, deps, signal }) => {
  const res = await fetch('/api/cities?country=' + deps.country + '&q=' + encodeURIComponent(search), { signal })
  const data = await res.json()
  return data.map((city: { id: string; name: string }) => ({ value: city.id, label: city.name }))
}

export function CitySelect({ country }: { country: string }) {
  const asyncCity = useAsyncOptions({
    key: 'cities',
    fetch: cityFetcher,
    dependsOn: ['country'],
    cacheTtl: 5 * 60_000,
    debounce: 250,
    minChars: 2,
    keepPreviousOptions: true,
  }, { country })

  return (
    <div>
      <input
        placeholder="Type a city"
        value={asyncCity.search}
        onChange={(e) => asyncCity.setSearch(e.target.value)}
      />
      {asyncCity.loading ? <p>Loading...</p> : null}
      {asyncCity.error ? <p>{asyncCity.error}</p> : null}
      <ul>
        {asyncCity.options.map((opt) => (
          <li key={opt.value}>{opt.label}</li>
        ))}
      </ul>
    </div>
  )
}`,
        },
        {
          filename: 'AsyncSelect.native.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.asyncNative,
          code: `import { useAsyncOptions } from '@runilib/react-formbridge'
import { FlatList, TextInput, TouchableOpacity, Text, View } from 'react-native'

export function CityPickerNative({ country }: { country: string }) {
  const cities = useAsyncOptions({
    key: 'cities',
    fetch: async ({ search, deps }) => {
      const res = await fetch('https://example.com/cities?country=' + deps.country + '&q=' + search)
      const data = await res.json()
      return data.map((c: any) => ({ value: c.id, label: c.name }))
    },
    dependsOn: ['country'],
    minChars: 1,
  }, { country })

  return (
    <View style={{ gap: 8 }}>
      <TextInput
        placeholder="Search city"
        value={cities.search}
        onChangeText={cities.setSearch}
      />
      {cities.loading ? <Text>Loading…</Text> : null}
      <FlatList
        data={cities.options}
        keyExtractor={(item) => String(item.value)}
        renderItem={({ item }) => (
          <TouchableOpacity><Text>{item.label}</Text></TouchableOpacity>
        )}
      />
    </View>
  )
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-async-config',
          title: 'Config',
          content: `- key: cache namespace (default 'default')
- fetch(context): required async fetcher receiving { search, deps, signal }
- cacheTtl ms (default 60000)
- debounce ms (default 300)
- minChars (default 0) skip fetch until reached
- dependsOn string[] of dependency keys (default [])
- initialOptions SelectOption[] (default [])
- fetchOnMount (default true)
- keepPreviousOptions (default true)
- preserveOnError (default true)
- key + search + deps compose cache key`,
        },
        {
          id: 'fb-async-return',
          title: 'Return',
          content: `- options: SelectOption[]
- loading: boolean
- error: string | null
- search: string
- setSearch(next: string)
- clearSearch()
- refresh() force refetch bypassing cache`,
        },
      ],
    },
    {
      id: 'fb-dynamic',
      title: 'useDynamicFormBridge()',
      content: `Turn a JSON form definition into a real formbridge runtime.

- Useful for CMS-driven forms, experiments, back-office builders, or remote configuration
- The hook parses the definition, preserves field order, and gives you a normal formbridge instance back
- This helper is most compelling when the form shape changes outside the deployed frontend code`,
      codeTabs: [
        {
          filename: 'DynamicForm.web.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.dynamic,
          code: `import { useDynamicFormBridge } from '@runilib/react-formbridge'

const definition = {
  title: 'Feedback',
  fields: [
    { type: 'text', name: 'fullName', label: 'Full name', required: true },
    { type: 'email', name: 'email', label: 'Email', required: true },
    { type: 'textarea', name: 'comment', label: 'Comment', max: 400 },
  ],
}

export function DynamicFeedback() {
  const { form, fieldOrder, isLoading, loadError } = useDynamicFormBridge(definition, {
    validateOn: 'onSubmit',
    defaultValues: { fullName: 'Ava Stone' },
  })

  if (!form) return isLoading ? <p>Loading…</p> : <p>Error: {loadError}</p>

  const { Form, fields } = form
  return (
    <Form onSubmit={(values) => api.send(values)}>
      {fieldOrder.map((name) => {
        const Field = fields[name]
        return <Field key={name} />
      })}
      <Form.Submit>Send</Form.Submit>
    </Form>
  )
}`,
        },
        {
          filename: 'Dynamic.native.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.dynamic,
          code: `import { ScrollView, View, Text } from 'react-native'
import { useDynamicFormBridge } from '@runilib/react-formbridge'

export function RemoteDynamic({ url }: { url: string }) {
  const { form, fieldOrder, isLoading, loadError } = useDynamicFormBridge(
    async () => {
      const res = await fetch(url)
      return res.json()
    },
    { persist: { key: 'remote-form' } },
  )

  if (!form) return <View><Text>{loadError ?? 'Loading…'}</Text></View>

  const { Form, fields } = form
  return (
    <ScrollView>
      <Form onSubmit={(values) => console.log(values)}>
        <View style={{ gap: 10, padding: 16 }}>
          {fieldOrder.map((name) => {
            const Field = fields[name]
            return <Field key={name} />
          })}
          <Form.Submit>Submit</Form.Submit>
        </View>
      </Form>
    </ScrollView>
  )
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-dynamic-options',
          title: 'Options',
          content: `- First argument: a JSON form definition object or an async loader returning one
- Second argument: the normal \`useFormBridge()\` options plus \`defaultValues\`
- Because the returned \`form\` is a standard bridge instance, submit/error handlers still live on \`<Form>\``,
        },
        {
          id: 'fb-dynamic-return',
          title: 'Return',
          content: `- form: useFormBridge return or null while loading
- fieldOrder: string[] for rendering
- meta: definition meta if provided
- isVisible(name): boolean
- isLoading: boolean
- loadError: string | null`,
        },
        {
          id: 'fb-dynamic-notes',
          title: 'Platform note',
          content: `Dynamic forms are easiest to adopt in web dashboards first. If you target native too, validate the exact field set and renderer combination you plan to ship, because dynamic helpers tend to surface edge cases later than static schemas.`,
        },
      ],
    },
    {
      id: 'fb-wizard',
      title: 'useFormWizardBridge()',
      content: `Compose multiple formbridge schemas into a step-by-step flow.

- Each step owns its own schema
- Values are accumulated across steps automatically
- The hook gives you navigation, progress, skip, and final submission helpers without introducing a separate mental model`,
      codeTabs: [
        {
          filename: 'Wizard.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.wizard,
          code: `import { field, useFormWizardBridge } from '@runilib/react-formbridge'

const steps = [
  {
    id: 'account',
    label: 'Account',
    schema: {
      email: field.email('Email').required(),
      password: field.password('Password').required(),
    },
  },
  {
    id: 'profile',
    label: 'Profile',
    schema: {
      firstName: field.text('First name').required(),
      country: field.select('Country').options(['FR','US','GB']).required(),
    },
    condition: (values) => values.email?.endsWith('@company.com'),
    optional: true,
  },
  {
    id: 'review',
    label: 'Review',
    schema: {},
  },
]

export function SignupWizard() {
  const wizard = useFormWizardBridge(steps, {
    persist: { key: 'signup-wizard' },
    onSubmit: (allValues) => api.save(allValues),
  })

  if (!wizard.step) return null

  const { Form, fields } = wizard.currentStep

  return (
    <div>
      <p>Step {wizard.currentStepIndex + 1} / {wizard.totalSteps}</p>
      <Form onSubmit={wizard.next}>
        {'email' in fields && <fields.email />}
        {'password' in fields && <fields.password />}
        {'firstName' in fields && <fields.firstName />}
        {'country' in fields && <fields.country />}
        <Form.Submit>{wizard.isLastStep ? 'Finish' : 'Next'}</Form.Submit>
      </Form>
      {!wizard.isFirstStep && <button onClick={wizard.prev}>Back</button>}
      {wizard.isLastStep && <button onClick={wizard.submit}>Submit</button>}
    </div>
  )
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-wizard-step',
          title: 'Step shape',
          content: `- id: string (required)
- label: string
- schema: FormSchema for the step
- optional?: boolean (enables skip())
- condition?(allValues): boolean to include step
- formOptions?: partial UseFormOptions per step`,
        },
        {
          id: 'fb-wizard-options',
          title: 'Options',
          content: `- onSubmit(allValues) is required
- onSubmitError?(error) lets you map thrown submit errors to a user-facing message
- persist: { key, storage?, ttl?, debounce?, exclude?, version? } is applied per step under a derived key
- validateOn and revalidateOn define the defaults for each step unless a step overrides them with formOptions`,
        },
        {
          id: 'fb-wizard-return',
          title: 'Return',
          content: `- step: current step meta or null
- currentStep: UseFormBridge return for step
- currentStepIndex, totalSteps
- visibleSteps, allSteps, completedSteps
- progress: percent of visibleSteps completed
- isFirstStep, isLastStep
- next(), prev(), goTo(index, skipValidation?), skip()
- submit(): runs final submit
- allValues: accumulated across steps
- isSubmitting, isSuccess, submitError`,
        },
        {
          id: 'fb-wizard-notes',
          title: 'Why it matters',
          content: `Use the wizard hook when one large form would feel heavy or fragile. It keeps the same schema-first API while making multi-step onboarding, checkout, or settings flows much easier to maintain.`,
        },
      ],
    },
    {
      id: 'fb-readonly',
      title: 'useReadonlyFormBridge()',
      content: `Render schema-driven values as readonly rows or as a diff against original values.

- Useful for review steps before submission, audit views, change approval screens, or before/after comparisons
- It reuses the schema labels and option metadata, so your review UI stays aligned with your editing UI`,
      codeTabs: [
        {
          filename: 'Readonly.tsx',
          lang: 'tsx',
          preview: DOC_PREVIEWS.readonly,
          code: `import { field, useReadonlyFormBridge } from '@runilib/react-formbridge'

const schema = {
  fullName: field.text('Full name'),
  email: field.email('Email'),
  country: field.select('Country').options(['FR','US','GB']),
}

export function ReviewCard({ values, original }: { values: any; original?: any }) {
  const readonly = useReadonlyFormBridge(schema, {
    values,
    originalValues: original,
    mode: original ? 'diff' : 'readonly',
  })

  const { ReadonlyFields, changedFields, hasChanges } = readonly

  return (
    <section>
      <ReadonlyFields.fullName />
      <ReadonlyFields.email />
      <ReadonlyFields.country />
      {hasChanges ? <p>{changedFields.length} fields changed.</p> : null}
    </section>
  )
}`,
        },
      ],
      subsections: [
        {
          id: 'fb-readonly-options',
          title: 'Options',
          content: `- First argument: the schema
- values: current data (required)
- mode: 'readonly' | 'diff'
- originalValues?: baseline for diff mode
- formatters?: per-field value formatters`,
        },
        {
          id: 'fb-readonly-return',
          title: 'Return',
          content: `- fields: computed readonly state for each visible field
- fieldNames: ordered list of visible field names
- changedFields: names that differ in diff mode
- hasChanges: boolean summary flag
- ReadonlyFields: generated readonly render components matching the schema keys`,
        },
        {
          id: 'fb-readonly-notes',
          title: 'Platform note',
          content: `Readonly review flows are currently most battle-tested on web. If you plan to rely on this API in native screens too, validate the exact renderer behavior you need before rolling it out broadly.`,
        },
      ],
    },
  ],
};
