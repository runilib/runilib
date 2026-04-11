import type { LibraryDoc } from './../../../types/index';
import { USE_FORM_BRIDGE_RETURN_SURFACE } from '../constants';

export const useFormBridgeContextSection: LibraryDoc['sections'][number] = {
  id: 'fb-use-form-bridge-context',
  title: 'useFormBridgeContext()',
  content: `Consume the nearest form runtime from context.

- Use it inside components rendered under \`<form.Form>\` when you want to split a form into reusable children without prop drilling
- Use it with \`<form.FormProvider>\` when a toolbar, summary panel, sticky footer, or side layout lives outside the actual form wrapper
- It returns the same runtime object as \`useFormBridge(schema)\` for the nearest provider
- It throws if used outside \`<form.Form>\` or \`<form.FormProvider>\``,
  codeTabs: [
    {
      filename: 'FormContext.web.tsx',
      lang: 'tsx',
      code: `import {
  field,
  useFormBridge,
  useFormBridgeContext,
} from '@runilib/react-formbridge'

const schema = {
  email: field.email('Email').required(),
  marketingOptIn: field.checkbox('Receive product updates'),
}

function LiveSummary() {
  const { watch, state } = useFormBridgeContext<typeof schema>()
  const email = watch('email')

  return (
    <aside>
      <p>Current email: {email || '—'}</p>
      <p>{state.isValid ? 'Ready to submit' : 'Some required fields are still missing.'}</p>
    </aside>
  )
}

export function NewsletterSettings() {
  const form = useFormBridge(schema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
  })

  return (
    <form.Form onSubmit={async (values) => api.save(values)}>
      <form.fields.email />
      <form.fields.marketingOptIn />
      <LiveSummary />
      <form.Form.Submit>Save preferences</form.Form.Submit>
    </form.Form>
  )
}`,
    },
    {
      filename: 'FormContext.native.tsx',
      lang: 'tsx',
      code: `import { Text, View } from 'react-native'
import {
  field,
  useFormBridge,
  useFormBridgeContext,
} from '@runilib/react-formbridge'

const schema = {
  fullName: field.text('Full name').required(),
  phone: field.phone('Phone').required(),
}

function SubmitHint() {
  const { state } = useFormBridgeContext<typeof schema>()

  return (
    <Text>{state.isValid ? 'Everything looks good.' : 'Please complete the required fields.'}</Text>
  )
}

export function ContactDetailsScreen() {
  const form = useFormBridge(schema)

  return (
    <form.Form onSubmit={async (values) => api.save(values)}>
      <View style={{ gap: 12, padding: 16 }}>
        <form.fields.fullName />
        <form.fields.phone />
        <SubmitHint />
        <form.Form.Submit>Continue</form.Form.Submit>
      </View>
    </form.Form>
  )
}`,
    },
  ],
  subsections: [
    {
      id: 'fb-use-form-bridge-context-provider',
      title: 'Use FormProvider outside the form tree',
      content: `\`<form.Form>\` already provides context to everything rendered inside it. Reach for \`<form.FormProvider>\` only when a consumer is rendered outside the actual form wrapper but still needs access to \`submit()\`, \`state\`, \`watch()\`, or \`fieldController()\`.`,
      code: {
        filename: 'FormProviderLayout.tsx',
        lang: 'tsx',
        code: `import {
  field,
  useFormBridge,
  useFormBridgeContext,
} from '@runilib/react-formbridge'

const schema = {
  email: field.email('Email').required(),
  coupon: field.text('Coupon code'),
}

function StickyCheckoutBar() {
  const { state, submit } = useFormBridgeContext<typeof schema>()

  return (
    <footer>
      <p>{state.isValid ? 'Ready to pay' : 'Complete the required fields first'}</p>
      <button
        type="button"
        disabled={state.isSubmitting}
        onClick={() => void submit()}
      >
        Pay now
      </button>
    </footer>
  )
}

export function CheckoutLayout() {
  const form = useFormBridge(schema, {
    persist: { key: 'checkout-layout' },
  })

  return (
    <form.FormProvider>
      <div className="checkout-layout">
        <main>
          <form.Form onSubmit={async (values) => api.checkout(values)}>
            <form.fields.email />
            <form.fields.coupon />
          </form.Form>
        </main>

        <StickyCheckoutBar />
      </div>
    </form.FormProvider>
  )
}`,
      },
    },
    {
      id: 'fb-use-form-bridge-context-return',
      title: 'Return value',
      content: `The hook returns the same runtime surface as the nearest \`useFormBridge(schema)\` call.

${USE_FORM_BRIDGE_RETURN_SURFACE}`,
    },
    {
      id: 'fb-use-form-bridge-context-rules',
      title: 'Rules & composition notes',
      content: `- The hook must run below the nearest \`<form.Form>\` or \`<form.FormProvider>\`
- The nearest provider wins, so nested form providers isolate their own runtime
- Prefer plain props when one small child needs one value; prefer context when several descendants need coordinated access to the form runtime
- \`watch()\`, \`watchAll()\`, \`state\`, and \`visibility\` remain reactive because the provider shares the live form api object
- If a consumer needs to trigger submission from outside the rendered form element, \`<form.FormProvider>\` is the intended path`,
    },
  ],
};
