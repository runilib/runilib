import type { LibraryDoc } from './../../../types/index';
import {
  WIZARD_EVENT_SURFACE,
  WIZARD_OPTIONS_SURFACE,
  WIZARD_RETURN_SURFACE,
  WIZARD_STEP_SURFACE,
} from '../constants';

export const wizardSection: LibraryDoc['sections'][number] = {
  id: 'fb-wizard',
  title: 'useFormBridgeWizard()',
  content: `Compose multiple formbridge schemas into a step-by-step flow.

- Each step owns its own schema
- Values are accumulated across steps automatically
- The hook gives you navigation, progress, skip, and final submission helpers without introducing a separate mental model
- Pass \`stepId\` + \`onStepChange\` to let a router or native navigator own cross-page / cross-screen navigation while the wizard keeps the state machine`,
  codeTabs: [
    {
      filename: 'WizardPlayground.tsx',
      interactive: true,
      lang: 'tsx',
      code: `import { useState } from 'react'
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
    id: 'profile',
    label: 'Profile',
    schema: {
      firstName: field.text('First name').required(),
      country: field.select('Country').options(['FR','US','GB']).required(),
    } satisfies FormSchema,
    condition: (values) => values.email?.endsWith('@company.com'),
    optional: true,
  },
  {
    id: 'review',
    label: 'Review',
    schema: {} satisfies FormSchema,
  },
]

export function WizardPlayground() {
  const [submitted, setSubmitted] = useState<Record<string, unknown> | null>(null)

  const wizard = useFormBridgeWizard(steps, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
    onSubmit: async (allValues) => {
      setSubmitted(allValues)
    },
  })

  if (!wizard.step) return null

  const { Form, fields } = wizard.currentStep

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 20, background: '#f5f7fb' }}>
      <p style={{ marginTop: 0, color: '#4b5563' }}>
        Step <strong>{wizard.currentStepIndex + 1}</strong> / {wizard.totalSteps}
        {' · '}
        {wizard.step.label}
        {' · '}
        Progress: {wizard.progress}%
      </p>

      <p style={{ color: '#4b5563' }}>
        Visible steps: {wizard.visibleSteps.map((step) => step.id).join(' → ')}
      </p>

      <Form
        onSubmit={async () => {
          if (wizard.isLastStep) await wizard.submit()
          else await wizard.next()
        }}
      >
        {'email' in fields && <AppField form={form} name="email" />}
        {'password' in fields && <AppField form={form} name="password" />}
        {'firstName' in fields && <AppField form={form} name="firstName" />}
        {'country' in fields && <AppField form={form} name="country" />}
        {wizard.step.id === 'review' ? (
          <pre
            style={{
              marginTop: 0,
              padding: 12,
              borderRadius: 12,
              border: '1px solid #d6d9e0',
              background: '#fff',
              whiteSpace: 'pre-wrap',
            }}
          >
            {JSON.stringify(wizard.allValues, null, 2)}
          </pre>
        ) : null}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {!wizard.isFirstStep && (
            <button type="button" onClick={wizard.prev}>
              Back
            </button>
          )}
          {wizard.step.optional ? (
            <button type="button" onClick={() => wizard.skip()}>
              Skip optional step
            </button>
          ) : null}
          <button type="submit">{wizard.isLastStep ? 'Finish' : 'Next'}</button>
        </div>
      </Form>

      <div
        style={{
          marginTop: 16,
          border: '1px solid #d6d9e0',
          borderRadius: 12,
          padding: 12,
          background: '#fff',
        }}
      >
        <strong>Completed steps</strong>
        <p style={{ marginBottom: 8 }}>
          {Array.from(wizard.completedSteps).join(', ') || 'None yet'}
        </p>
        <strong>Last submit</strong>
        <pre style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(submitted, null, 2)}
        </pre>
      </div>
    </div>
  )
}`,
    },
    {
      filename: 'WizardRoute.web.tsx',
      lang: 'tsx',
      code: `import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
      {'email' in fields && <AppField form={form} name="email" />}
      {'password' in fields && <AppField form={form} name="password" />}
      {'companyName' in fields && <AppField form={form} name="companyName" />}
      <button type="submit">{wizard.isLastStep ? 'Finish' : 'Next'}</button>
    </Form>
  )
}`,
    },
  ],
  subsections: [
    {
      id: 'fb-wizard-step',
      title: 'Step shape',
      content: `${WIZARD_STEP_SURFACE}`,
    },
    {
      id: 'fb-wizard-options',
      title: 'Options',
      content: `${WIZARD_OPTIONS_SURFACE}

${WIZARD_EVENT_SURFACE}`,
    },
    {
      id: 'fb-wizard-return',
      title: 'Return',
      content: `${WIZARD_RETURN_SURFACE}`,
    },
    {
      id: 'fb-wizard-notes',
      title: 'Why it matters',
      content: `Use the wizard hook when one large form would feel heavy or fragile. It keeps the same schema-first API while making multi-step onboarding, checkout, or settings flows much easier to maintain.

- Same-page usage still works great for classic steppers
- Controlled mode lets the same hook power route-based web flows and screen-based native flows without rewriting validation or persistence`,
    },
  ],
};
