import type { LibraryDoc } from './../../../types/index';

export const tutorialProductionSection: LibraryDoc['sections'][number] = {
  id: 'fb-tutorial-production',
  title: 'Tutorial: advanced flows',
  content: `Once simple forms work, the next problems are usually navigation, partial saves, remote step definitions, review screens, and instrumentation.

- \`useFormBridgeWizard()\` is the client-owned path for multi-step flows
- \`useDynamicFormBridge()\` is the backend-owned path when a remote definition controls the fields
- \`useFormBridgeReadonly()\` keeps review screens aligned with edit screens
- \`useFormBridgeAnalytics()\` makes lifecycle instrumentation additive instead of invasive`,
  codeTabs: [
    {
      filename: 'WizardRoute.web.tsx',
      lang: 'tsx',
      code: `import { useEffect } from 'react'
import {
  MemoryRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom'
import type { FormSchema } from '@runilib/react-formbridge'
import { field, useFormBridgeWizard } from '@runilib/react-formbridge'

const steps = [
  {
    id: 'account',
    label: 'Account',
    schema: {
      email: field.email('Email').required(),
      password: field.password('Password').required(),
    } satisfies FormSchema,
  },
  {
    id: 'company',
    label: 'Company',
    schema: {
      companyName: field.text('Company name').required(),
    } satisfies FormSchema,
  },
  { id: 'review', label: 'Review', schema: {} satisfies FormSchema },
]

export function SignupWizardRoute() {
  const navigate = useNavigate()
  const { stepId } = useParams()

  const wizard = useFormBridgeWizard(steps, {
    stepId,
    initialStepId: 'account',
    persist: { key: 'signup-wizard', storage: 'local' },
    onStepChange: ({ step }) => navigate('/signup/' + step.id),
    onSubmit: (allValues) => api.save(allValues),
  })

  useEffect(() => {
    if (!wizard.isHydrating && wizard.currentStepId && stepId !== wizard.currentStepId) {
      navigate('/signup/' + wizard.currentStepId, { replace: true })
    }
  }, [navigate, stepId, wizard.currentStepId, wizard.isHydrating])

  if (wizard.isHydrating || !wizard.step) return null

  const { Form, fields } = wizard.currentStep

  return (
    <Form onSubmit={async () => {
      if (wizard.isLastStep) await wizard.submit()
      else await wizard.next()
    }}>
      {'email' in fields && <fields.email />}
      {'password' in fields && <fields.password />}
      {'companyName' in fields && <fields.companyName />}
      <Form.Submit>{wizard.isLastStep ? 'Finish' : 'Next'}</Form.Submit>
    </Form>
  )
}

export default function App() {
  return (
    <MemoryRouter initialEntries={['/signup/account']}>
      <Routes>
        <Route path="/" element={<Navigate replace to="/signup/account" />} />
        <Route path="/signup/:stepId" element={<SignupWizardRoute />} />
      </Routes>
    </MemoryRouter>
  )
}`,
    },
    {
      filename: 'WizardRoute.native.tsx',
      lang: 'tsx',
      code: `import { useEffect } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import type { FormSchema } from '@runilib/react-formbridge'
import { field, useFormBridgeWizard } from '@runilib/react-formbridge'

const steps = [
  {
    id: 'personal',
    label: 'Personal info',
    schema: {
      firstName: field.text('First name').required(),
      lastName: field.text('Last name').required(),
      email: field.email('Email').required(),
    } satisfies FormSchema,
  },
  {
    id: 'company',
    label: 'Company info',
    schema: {
      companyName: field.text('Company name').required(),
      role: field.text('Role').required(),
    } satisfies FormSchema,
  },
  { id: 'review', label: 'Review', schema: {} satisfies FormSchema },
]

export function SignupWizardScreen() {
  const router = useRouter()
  const { stepId } = useLocalSearchParams<{ stepId?: string }>()

  const wizard = useFormBridgeWizard(steps, {
    stepId,
    initialStepId: 'personal',
    persist: { key: 'mobile-signup-wizard', storage: 'async' },
    onStepChange: ({ step }) => router.replace('/signup/' + step.id),
    onSubmit: (allValues) => api.save(allValues),
  })

  useEffect(() => {
    if (!wizard.isHydrating && wizard.currentStepId && stepId !== wizard.currentStepId) {
      router.replace('/signup/' + wizard.currentStepId)
    }
  }, [router, stepId, wizard.currentStepId, wizard.isHydrating])
}`,
    },
  ],
  subsections: [
    {
      id: 'fb-tutorial-production-dynamic',
      title: 'Dynamic forms from a backend definition',
      content: `Use \`useDynamicFormBridge()\` when a remote definition controls the field order or even the field set itself.`,
      codeTabs: [
        {
          filename: 'DynamicForm.web.tsx',
          lang: 'tsx',
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
          filename: 'DynamicForm.native.tsx',
          lang: 'tsx',
          code: `import { ScrollView, Text, View } from 'react-native'
import { useDynamicFormBridge } from '@runilib/react-formbridge'

export function RemoteDynamic({ url }: { url: string }) {
  const { form, fieldOrder, isLoading, loadError } = useDynamicFormBridge(
    async () => {
      const res = await fetch(url)
      return res.json()
    },
    { persist: { key: 'remote-form' } },
  )

  if (!form) return <View><Text>{loadError ?? (isLoading ? 'Loading…' : 'No form')}</Text></View>

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
    },
    {
      id: 'fb-tutorial-production-review',
      title: 'Readonly reviews before submit or approval',
      content: `Review screens become much easier to keep in sync when they reuse the same schema labels and option metadata.`,
      code: {
        filename: 'ReadonlyReview.tsx',
        lang: 'tsx',
        code: `import { field, useFormBridgeReadonly } from '@runilib/react-formbridge'

const schema = {
  fullName: field.text('Full name'),
  email: field.email('Email'),
  country: field.select('Country').options(['FR', 'US', 'GB']),
}

const originalValues = {
  fullName: 'Ava Martin',
  email: 'ava@runilib.dev',
  country: 'FR',
}

const editedValues = {
  fullName: 'Ava Martin',
  email: 'ava.martin@runilib.dev',
  country: 'GB',
}

export default function ReviewCard() {
  const { ReadonlyFields, changedFields, hasChanges } = useFormBridgeReadonly(schema, {
    values: editedValues,
    originalValues,
    mode: 'diff',
  })

  return (
    <section style={{ display: 'grid', gap: 12, padding: 16, fontFamily: 'sans-serif' }}>
      <ReadonlyFields.fullName />
      <ReadonlyFields.email />
      <ReadonlyFields.country />
      {hasChanges ? (
        <p style={{ margin: 0, color: '#0369a1' }}>
          {changedFields.length} field(s) changed.
        </p>
      ) : null}
    </section>
  )
}`,
      },
    },
    {
      id: 'fb-tutorial-production-analytics',
      title: 'Add analytics without rewriting the form',
      content: `Analytics hooks are most useful when they stay additive. Keep the same form API and plug in lifecycle tracking next to it.`,
      code: {
        filename: 'AnalyticsTutorial.tsx',
        lang: 'tsx',
        code: `import {
  field,
  useFormBridge,
  useFormBridgeAnalytics,
} from '@runilib/react-formbridge'

const schema = {
  email: field.email('Email').required(),
  role: field.select('Role').options(['admin', 'editor', 'viewer']).required(),
}

export function InstrumentedSignup() {
  const form = useFormBridge(schema)

  useFormBridgeAnalytics(
    {
      formId: 'signup',
      exclude: ['password'],
      handlers: {
        onFieldFocus: (name) => analytics.track('field_focus', { name }),
        onFieldComplete: (name, ms) => analytics.track('field_complete', { name, ms }),
        onFormCompleted: (durationMs, submitCount, fieldCount) =>
          analytics.track('signup_success', { durationMs, submitCount, fieldCount }),
        onFormAbandoned: (pct, lastField, values) =>
          analytics.track('signup_abandon', { pct, lastField, values }),
      },
    },
    () => form.state.values,
  )

  return (
    <form.Form onSubmit={async (values) => api.signup(values)}>
      <form.fields.email />
      <form.fields.role />
      <form.Form.Submit>Create account</form.Form.Submit>
    </form.Form>
  )
}`,
      },
    },
  ],
};
