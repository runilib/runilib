import type { LibraryDoc } from './../../../types/index';
import {
  DYNAMIC_JSON_SURFACE,
  DYNAMIC_OPTIONS_SURFACE,
  DYNAMIC_RETURN_SURFACE,
} from '../constants';

export const dynamicSection: LibraryDoc['sections'][number] = {
  id: 'fb-dynamic',

  title: 'useDynamicFormBridge()',
  content: `Turn a JSON form definition into a real formbridge runtime.

- Useful for CMS-driven forms, experiments, back-office builders, or remote configuration
- The hook parses the definition, preserves field order, and gives you a normal formbridge instance back
- This helper is most compelling when the form shape changes outside the deployed frontend code
- A very practical pattern is “one dynamic step per route” for cross-page wizards whose step definitions come from a backend`,
  codeTabs: [
    {
      filename: 'DynamicFormPlayground.web.tsx',
      interactive: true,
      lang: 'tsx',
      code: `import { useMemo, useState } from 'react'
import { useDynamicFormBridge } from '@runilib/react-formbridge'

const DEFINITIONS = {
  feedback: {
    id: 'feedback',
    title: 'Product feedback',
    submitLabel: 'Send feedback',
    fields: [
      { type: 'text', name: 'fullName', label: 'Full name', required: true },
      { type: 'email', name: 'email', label: 'Email', required: true },
      {
        type: 'select',
        name: 'topic',
        label: 'Topic',
        options: ['UX', 'Performance', 'Bug report'],
        required: true,
      },
      { type: 'textarea', name: 'comment', label: 'Comment', min: 10, max: 400 },
    ],
  },
  callback: {
    id: 'callback',
    title: 'Request a callback',
    submitLabel: 'Book callback',
    fields: [
      { type: 'text', name: 'fullName', label: 'Full name', required: true },
      { type: 'tel', name: 'phone', label: 'Phone', required: true },
      {
        type: 'select',
        name: 'bestTime',
        label: 'Best time',
        options: ['Morning', 'Afternoon', 'Evening'],
        required: true,
      },
      { type: 'checkbox', name: 'hasOrder', label: 'I already have an order' },
      {
        type: 'text',
        name: 'orderNumber',
        label: 'Order number',
        showWhen: { field: 'hasOrder', value: true },
      },
    ],
  },
}

export function DynamicFormPlayground() {
  const [kind, setKind] = useState<'feedback' | 'callback'>('feedback')
  const [submitted, setSubmitted] = useState<Record<string, unknown> | null>(null)
  const definition = useMemo(() => DEFINITIONS[kind], [kind])

  const { form, fieldOrder, meta, isVisible, isLoading, loadError } = useDynamicFormBridge(
    definition,
    {
      formKey: kind,
      validateOn: 'onBlur',
      defaultValues:
        kind === 'feedback'
          ? { fullName: 'Ava Stone', topic: 'UX' }
          : { fullName: 'Ava Stone', bestTime: 'Morning' },
    },
  )

  if (!form) {
    return (
      <p>{isLoading ? 'Loading…' : 'Error: ' + String(loadError ?? 'Unknown error')}</p>
    )
  }

  const { Form, fieldController, state } = form

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 20, background: '#f5f7fb' }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        <button type="button" onClick={() => setKind('feedback')}>
          Feedback form
        </button>
        <button type="button" onClick={() => setKind('callback')}>
          Callback form
        </button>
      </div>

      <p style={{ marginTop: 0, color: '#4b5563' }}>
        Current definition: <strong>{meta.title ?? 'Untitled form'}</strong>
      </p>

      <Form
        onSubmit={async (values) => {
          setSubmitted(values)
        }}
      >
        {fieldOrder
          .filter((name) => isVisible(name))
          .map((name) => (
            <AppField key={name} form={form} name={name} />
          ))}

        <button type="submit">{meta.submitLabel ?? 'Submit'}</button>
      </Form>

      <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
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
      filename: 'Dynamic.native.tsx',
      lang: 'tsx',
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

  const { Form, fieldController } = form
  return (
    <ScrollView>
      <Form onSubmit={(values) => console.log(values)}>
        <View style={{ gap: 10, padding: 16 }}>
          {fieldOrder.map((name) => {
            const Field = fields[name]
            return <Field key={name} />
          })}
          <button type="submit">Submit</button>
        </View>
      </Form>
    </ScrollView>
  )
}`,
    },
    {
      filename: 'DynamicWizardStep.web.tsx',
      lang: 'tsx',
      code: `import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDynamicFormBridge } from '@runilib/react-formbridge'

const NEXT_STEP_BY_ID = {
  personal: 'company',
  company: 'review',
} as const

export function DynamicSignupStepRoute() {
  const navigate = useNavigate()
  const { stepId = 'personal' } = useParams<{ stepId?: string }>()

  const loadDefinition = useMemo(
    () => async () => {
      const response = await fetch('/api/forms/signup/' + stepId)
      if (!response.ok) throw new Error('Failed to load step definition')
      return response.json()
    },
    [stepId],
  )

  const { form, fieldOrder, meta, isLoading, loadError } = useDynamicFormBridge(
    loadDefinition,
    {
      formKey: stepId,
      validateOn: 'onBlur',
      persist: {
        key: 'signup-step:' + stepId,
        storage: 'local',
      },
    },
  )

  if (!form) {
    return isLoading ? <p>Loading…</p> : <p>Error: {loadError}</p>
  }

  const nextStepId = NEXT_STEP_BY_ID[stepId as keyof typeof NEXT_STEP_BY_ID]
  const { Form, fieldController } = form

  return (
    <Form
      onSubmit={async (values) => {
        await api.saveStep(stepId, values)

        if (nextStepId) navigate('/signup/' + nextStepId)
        else navigate('/signup/review')
      }}
    >
      <h1>{meta.title ?? 'Signup'}</h1>

      {fieldOrder.map((name) => {
        const Field = fields[name]
        return <Field key={name} />
      })}

      <button type="submit">
        {meta.submitLabel ?? (nextStepId ? 'Continue' : 'Finish')}
      </button>
    </Form>
  )
}`,
    },
    {
      filename: 'DynamicWizardStep.native.tsx',
      lang: 'tsx',
      code: `import { ScrollView, Text, View } from 'react-native'
import { useMemo } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useDynamicFormBridge } from '@runilib/react-formbridge'

const NEXT_STEP_BY_ID = {
  personal: 'company',
  company: 'review',
} as const

export function DynamicSignupStepScreen() {
  const router = useRouter()
  const { stepId = 'personal' } = useLocalSearchParams<{ stepId?: string }>()

  const loadDefinition = useMemo(
    () => async () => {
      const response = await fetch('https://api.example.com/forms/signup/' + stepId)
      if (!response.ok) throw new Error('Failed to load step definition')
      return response.json()
    },
    [stepId],
  )

  const { form, fieldOrder, meta, isLoading, loadError } = useDynamicFormBridge(
    loadDefinition,
    {
      formKey: stepId,
      validateOn: 'onBlur',
      persist: {
        key: 'signup-step:' + stepId,
        storage: 'async',
      },
    },
  )

  if (!form) {
    return (
      <View>
        <Text>{isLoading ? 'Loading…' : loadError}</Text>
      </View>
    )
  }

  const nextStepId = NEXT_STEP_BY_ID[stepId as keyof typeof NEXT_STEP_BY_ID]
  const { Form, fieldController } = form

  return (
    <ScrollView>
      <Form
        onSubmit={async (values) => {
          await api.saveStep(stepId, values)

          if (nextStepId) router.replace('/signup/' + nextStepId)
          else router.replace('/signup/review')
        }}
      >
        <View style={{ gap: 12, padding: 16 }}>
          <Text>{meta.title ?? 'Signup'}</Text>

          {fieldOrder.map((name) => {
            const Field = fields[name]
            return <Field key={name} />
          })}

          <button type="submit">
            {meta.submitLabel ?? (nextStepId ? 'Continue' : 'Finish')}
          </button>
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
      content: `${DYNAMIC_OPTIONS_SURFACE}

${DYNAMIC_JSON_SURFACE}

Because the returned \`form\` is a standard bridge instance, submit/error handlers still live on \`<Form>\`.`,
    },
    {
      id: 'fb-dynamic-wizard',
      title: 'Cross-page / cross-screen wizard pattern',
      content: `Use \`useDynamicFormBridge()\` for cross-page or cross-screen wizards when the backend already decides the fields for each step and the router or navigator already decides which page is active.

- Put the route param in the dynamic loader so each page fetches only its own step definition
- On native, treat the screen param the same way and fetch one step definition per screen
- Set \`formKey: stepId\` so the form runtime resets cleanly when the route changes
- Include the step id in \`persist.key\` to avoid draft collisions between pages
- Submit the current step to your API, then let the router navigate to the next page
- This pattern is ideal when the server owns the canonical onboarding session or partial payload`,
    },
    {
      id: 'fb-dynamic-return',
      title: 'Return',
      content: `${DYNAMIC_RETURN_SURFACE}`,
    },
    {
      id: 'fb-dynamic-notes',
      title: 'Platform note',
      content: `Dynamic forms are easiest to adopt in web dashboards first. If you target native too, validate the exact field set and renderer combination you plan to ship, because dynamic helpers tend to surface edge cases later than static schemas.

- \`useDynamicFormBridge()\` is excellent for one dynamic step per route
- If you also want a client-owned wizard state machine with \`progress\`, \`completedSteps\`, \`allValues\`, \`goToStep()\`, and route-driven restoration, prefer \`useFormBridgeWizard({ stepId, onStepChange })\` once the step schemas are known in the client`,
    },
  ],
};
