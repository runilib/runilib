import type { LibraryDoc } from './../../../types/index';
import {
  DOC_PREVIEWS,
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
      filename: 'Wizard.tsx',
      lang: 'tsx',
      preview: DOC_PREVIEWS.wizard,
      code: `import type { FormSchema } from '@runilib/react-formbridge'
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

export function SignupWizard() {
  const wizard = useFormBridgeWizard(steps, {
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
    {
      filename: 'WizardRoute.web.tsx',
      lang: 'tsx',
      preview: DOC_PREVIEWS.wizard,
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
      {'email' in fields && <fields.email />}
      {'password' in fields && <fields.password />}
      {'companyName' in fields && <fields.companyName />}
      <Form.Submit>{wizard.isLastStep ? 'Finish' : 'Next'}</Form.Submit>
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
