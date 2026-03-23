import type { LibraryDoc } from '../../types'

export const formbridgeDocs: LibraryDoc = {
  libId: 'formbridge',
  sidebar: [
    {
      group: 'Getting started',
      items: [
        { id: 'fb-overview',     label: 'Overview' },
        { id: 'fb-install',      label: 'Installation' },
        { id: 'fb-quickstart',   label: 'Quick start' },
      ],
    },
    {
      group: 'Core API',
      color: 'blue',
      items: [
        { id: 'fb-usform',       label: 'useForm()' },
        { id: 'fb-field',        label: 'field builder' },
        { id: 'fb-validation',   label: 'Validation' },
        { id: 'fb-state',        label: 'Form state' },
      ],
    },
    {
      group: 'Field types',
      color: 'blue',
      items: [
        { id: 'fb-text',         label: 'text / email / password' },
        { id: 'fb-number',       label: 'number' },
        { id: 'fb-phone',        label: 'phone()' },
        { id: 'fb-select',       label: 'select / radio' },
        { id: 'fb-checkbox',     label: 'checkbox / switch' },
        { id: 'fb-file',         label: 'file upload' },
        { id: 'fb-masks',        label: 'Masks' },
      ],
    },
    {
      group: 'Advanced',
      color: 'blue',
      items: [
        { id: 'fb-conditional',  label: 'Conditional fields' },
        { id: 'fb-wizard',       label: 'Wizard forms' },
        { id: 'fb-persist',      label: 'Draft persistence' },
        { id: 'fb-infer',        label: 'field.infer()' },
        { id: 'fb-i18n',         label: 'i18n' },
      ],
    },
  ],
  sections: [
    {
      id: 'fb-overview',
      title: 'Overview',
      content: `formbridge is a schema-first, cross-platform form library for React and React Native.

Write a TypeScript schema once — formbridge generates components, validation, and UI automatically, identical on both platforms.

**The core idea:** describe what you want, not how to build it.`,
      code: {
        filename: 'SignupForm.tsx',
        lang: 'tsx',
        code: `import { useForm, field } from 'formbridge'

const { Form, fields } = useForm({
  name:     field.text('Full name').required().trim(),
  email:    field.email('Email').required(),
  password: field.password('Password').required().strong(),
  terms:    field.checkbox('Accept terms').mustBeTrue(),
}, { validateOn: 'onTouched' })

return (
  <Form onSubmit={(values) => api.signup(values)}>
    <fields.name />
    <fields.email />
    <fields.password />
    <fields.terms />
    <Form.Submit loadingText="Creating account...">
      Create account
    </Form.Submit>
  </Form>
)`,
      },
    },
    {
      id: 'fb-install',
      title: 'Installation',
      content: 'Install formbridge with your preferred package manager.',
      code: {
        filename: 'terminal',
        lang: 'bash',
        code: `# npm
npm install formbridge

# yarn
yarn add formbridge

# pnpm
pnpm add formbridge

# Expo / React Native (optional peer deps)
npx expo install @react-native-async-storage/async-storage
npx expo install expo-image-picker expo-document-picker`,
      },
    },
    {
      id: 'fb-quickstart',
      title: 'Quick start',
      content: `A complete example with validation, phone field, and draft persistence.`,
      code: {
        filename: 'RegistrationForm.tsx',
        lang: 'tsx',
        code: `import { useForm, field } from 'formbridge'
import { setLocale } from 'formbridge'

// Set French locale globally (optional)
setLocale('fr')

export function RegistrationForm() {
  const { Form, fields, state, hasDraft, clearDraft } = useForm(
    {
      firstName: field.text('First name').required().trim().min(2),
      lastName:  field.text('Last name').required().trim(),
      email:     field.email('Email').required(),
      phone:     field.phone('Phone').defaultCountry('FR').required(),
      password:  field.password('Password')
                   .required()
                   .withStrengthIndicator({ showRules: true }),
      confirm:   field.password('Confirm password')
                   .required()
                   .matches('password', 'Passwords do not match.'),
      plan:      field.select('Plan')
                   .options(['free', 'pro', 'enterprise'])
                   .required(),
      // Visible only when plan !== 'free'
      coupon:    field.text('Coupon code')
                   .visibleWhenNot('plan', 'free'),
      terms:     field.checkbox('Accept Terms & Conditions')
                   .mustBeTrue(),
    },
    {
      validateOn: 'onTouched',
      persist: {
        key:     'registration',
        storage: 'local',
        ttl:     3600,
        exclude: ['password', 'confirm'],
      },
    }
  )

  return (
    <Form onSubmit={async (values) => {
      await api.register(values)
      await clearDraft()
    }}>
      {hasDraft && <DraftBanner onClear={clearDraft} />}
      <fields.firstName />
      <fields.lastName />
      <fields.email />
      <fields.phone />
      <fields.password />
      <fields.confirm />
      <fields.plan />
      <fields.coupon />
      <fields.terms />
      <Form.Submit>Create account</Form.Submit>
    </Form>
  )
}`,
      },
    },
    {
      id: 'fb-usform',
      title: 'useForm()',
      content: `The core hook. Takes a schema and options, returns everything you need.`,
      code: {
        filename: 'useForm.ts',
        lang: 'tsx',
        code: `const {
  // Render components
  Form,          // <Form onSubmit={fn}> wrapper
  fields,        // { fieldName: () => JSX.Element }

  // State
  state: {
    values,      // current values
    errors,      // validation errors
    touched,     // touched fields
    dirty,       // modified fields
    status,      // 'idle' | 'validating' | 'submitting' | 'success' | 'error'
    isValid,
    isDirty,
    isSubmitting,
    submitCount,
    submitError,
  },

  // Visibility (reactive conditions)
  visibility,    // { fieldName: { visible, required, disabled } }

  // Persistence
  hasDraft,      // true if a draft was restored
  clearDraft,    // () => Promise<void>
  saveDraftNow,  // () => Promise<void>

  // Programmatic API
  setValue,      // (name, value) => void
  getValue,      // (name) => value
  getValues,     // () => all values
  validate,      // (name?) => Promise<boolean>
  reset,         // (values?) => void
  setError,      // (name, message) => void
  clearErrors,   // (name?) => void
  watch,         // (name) => value (reactive)
  submit,        // () => Promise<void>
} = useForm(schema, options)`,
      },
    },
    {
      id: 'fb-field',
      title: 'field builder API',
      content: `All field builders follow the same fluent chaining pattern.`,
      code: {
        filename: 'field-api.ts',
        lang: 'ts',
        code: `// Available field types
field.text(label)
field.email(label)
field.password(label)
field.number(label)
field.tel(label)          // simple phone input
field.phone(label)        // with country selector
field.url(label)
field.textarea(label)
field.checkbox(label)
field.switch(label)
field.select(label).options([...])
field.radio(label).options([...])
field.date(label)
field.otp(label)
field.file(label)

// Universal chainable methods
.required(msg?)           // mark as required
.min(n, msg?)             // min length or value
.max(n, msg?)             // max length or value
.pattern(regex, msg?)     // regex validation
.validate(async fn)       // custom validator (sync or async)
.debounce(ms)             // debounce async validation
.hint(text)               // helper text below input
.placeholder(text)        // placeholder
.disabled(bool?)          // disable the field
.hidden(bool?)            // hide statically
.trim()                   // trim whitespace on change

// Conditional (reactive)
.visibleWhen(field, value)
.visibleWhenNot(field, value)
.visibleWhenAny([[field, value], ...])
.visibleWhenIn(field, values[])
.visibleWhenGte(field, n)
.requiredWhen(field, value)
.disabledWhen(field, value)
.resetOnHide()            // reset value when hidden
.keepOnHide()             // keep value when hidden`,
      },
    },
    {
      id: 'fb-phone',
      title: 'field.phone()',
      content: `A complete phone field with country selector, flag emoji, dial code, and automatic masking per country.`,
      code: {
        filename: 'PhoneExample.tsx',
        lang: 'tsx',
        code: `const { Form, fields } = useForm({
  phone: field.phone('Phone number')
    .required('Please enter your phone number.')
    .defaultCountry('FR')
    .preferredCountries(['FR', 'SN', 'CI', 'US', 'GB'])
    .searchable()             // search box in picker
    .showFlag(true)           // show flag emoji
    .showDialCode(true)       // show +33, +1...
    .storeE164()              // store "+33612345678" instead of object
    .hint('Format applied automatically per country'),
})

// Stored value (default — PhoneValue object):
// {
//   country:  "FR",
//   national: "6 12 34 56 78",
//   e164:     "+33612345678",
//   display:  "+33 6 12 34 56 78"
// }

// With .storeE164() — stores plain string:
// "+33612345678"`,
      },
    },
    {
      id: 'fb-masks',
      title: 'Masks & formatting',
      content: `30+ built-in mask presets for phone, card, IBAN, date, and more.`,
      code: {
        filename: 'MasksExample.tsx',
        lang: 'tsx',
        code: `import { MaskedFieldBuilder, MASKS } from 'formbridge'

const { Form, fields } = useForm({
  // Credit card — stores raw digits, displays formatted
  card:   new MaskedFieldBuilder('Card number', MASKS.CARD_16)
            .required()
            .validateComplete('Please enter the full card number.'),

  expiry: new MaskedFieldBuilder('Expiry', MASKS.EXPIRY)
            .required()
            .validateComplete(),

  cvv:    new MaskedFieldBuilder('CVV', MASKS.CVV).required(),

  // IBAN — auto uppercase
  iban:   new MaskedFieldBuilder('IBAN', MASKS.IBAN_FR)
            .uppercase()
            .required(),

  // Custom pattern: 9 = digit, a = letter, * = any
  custom: new MaskedFieldBuilder('Reference', '99-aaa-9999')
            .required(),
})

// Available presets:
// MASKS.PHONE_FR, PHONE_US, PHONE_UK, PHONE_INTL
// MASKS.CARD_16, CARD_AMEX, CARD_19, CVV, EXPIRY
// MASKS.DATE_DMY, DATE_MDY, DATE_ISO, TIME_HM
// MASKS.IBAN_FR, IBAN_DE, IBAN_GB, SIREN, SIRET
// MASKS.ZIP_FR, ZIP_US, SSN, NIR_FR, IP_ADDRESS`,
      },
    },
    {
      id: 'fb-wizard',
      title: 'Wizard / multi-step forms',
      content: `Multi-step forms that validate one step at a time, persist progress, and merge all values at submission.`,
      code: {
        filename: 'OnboardingWizard.tsx',
        lang: 'tsx',
        code: `import { useFormWizard, field } from 'formbridge'

const wizard = useFormWizard([
  {
    id:     'personal',
    label:  'Personal info',
    schema: {
      firstName: field.text('First name').required(),
      email:     field.email('Email').required(),
    },
  },
  {
    id:    'account',
    label: 'Account setup',
    schema: {
      username: field.text('Username').required().min(3),
      password: field.password('Password').required().strong()
                  .withStrengthIndicator({ showRules: true }),
    },
  },
  {
    id:    'plan',
    label: 'Choose plan',
    schema: {
      plan: field.select('Plan')
              .options(['free', 'pro', 'enterprise'])
              .required(),
    },
  },
], {
  onSubmit: async (allValues) => {
    await api.register(allValues)
  },
  persist: { key: 'signup-wizard', ttl: 86400 },
})

const { Form, fields } = wizard.currentStep

return (
  <Form>
    {Object.keys(fields).map(name => {
      const F = (fields as any)[name]
      return F ? <F key={name} /> : null
    })}
    <WizardNav
      onPrev={wizard.prev}
      onNext={wizard.next}
      onSubmit={wizard.submit}
      isFirst={wizard.isFirstStep}
      isLast={wizard.isLastStep}
      isSubmitting={wizard.isSubmitting}
      progress={wizard.progress}
    />
  </Form>
)`,
      },
    },
    {
      id: 'fb-i18n',
      title: 'Internationalisation (i18n)',
      content: `Built-in locale packs for EN, FR, ES, DE, PT. Call setLocale() once at app init.`,
      code: {
        filename: 'i18n.ts',
        lang: 'ts',
        code: `import { setLocale, registerLocale } from 'formbridge'

// Use a built-in locale
setLocale('fr')
setLocale('es')
setLocale('de')
setLocale('pt')

// Override specific messages
setLocale('fr', {
  required: 'Ce champ est obligatoire.',
  min:      ({ min }) => \`Minimum \${min} caractères.\`,
})

// Register a new locale
registerLocale('ar', {
  required: 'هذا الحقل مطلوب.',
  email:    'البريد الإلكتروني غير صالح.',
  // ...all other keys
})
setLocale('ar')

// Per-field overrides still take priority:
field.text('Name').required('Required — please fill this in.')`,
      },
    },
  ],
}
