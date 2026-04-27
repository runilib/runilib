import type { LibraryDoc } from './../../../types/index';

export const tutorialCheckoutSection: LibraryDoc['sections'][number] = {
  id: 'fb-tutorial-checkout',
  title: 'Tutorial: checkout flow',
  content: `Use checkout when a form has to prove it can handle real business density: contact details, masks, selects, live previews, and saved progress.

- Masked fields cover card number, expiry, CVV, and internal business codes
- \`select()\` keeps option metadata in the schema for both web and native
- Draft persistence helps longer flows survive reloads or app restarts`,
  codeTabs: [
    {
      filename: 'web.tsx',
      lang: 'tsx',
      code: `import { field, MASKS, useFormBridge } from '@runilib/react-formbridge'

const checkoutSchema = {
  firstName: field.text('First name').required().trim(),
  lastName: field.text('Last name').required().trim(),
  email: field.email('Email').required().trim().lowercase(),
  phone: field.tel('Phone').required(),
  department: field.select('Department').options([
    { label: 'Sales', value: 'sales' },
    { label: 'Finance', value: 'finance' },
    { label: 'Operations', value: 'ops' },
  ]).required(),
  customerCode: field
    .masked('LL-9999')
    .tokens({ L: /[A-Z]/ })
    .required()
    .showMaskInPlaceholder()
    .uppercase()
    .validateComplete('Complete the customer code.'),
  cardNumber: field.masked(MASKS.CARD_16).required().showMaskInPlaceholder(),
  expiry: field.masked(MASKS.EXPIRY).required().showMaskInPlaceholder(),
  cvv: field.masked(MASKS.CVV).required().showMaskInPlaceholder(),
}

export function CustomerCheckout() {
  const { Form, fields, watchAll } = useFormBridge(checkoutSchema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
    persist: { key: 'customer-checkout', storage: 'local', exclude: ['cvv'] },
  })

  const liveValues = watchAll()

  return (
    <Form onSubmit={async (values) => api.saveCustomer(values)}>
      <fields.firstName />
      <fields.lastName />
      <fields.email />
      <fields.phone />
      <fields.department />
      <fields.customerCode />
      <fields.cardNumber />
      <fields.expiry />
      <fields.cvv />
      <aside>Preview •••• {String(liveValues.cardNumber ?? '').slice(-4)}</aside>
      <Form.Submit>Save customer</Form.Submit>
    </Form>
  )
}`,
    },
    {
      filename: 'native.tsx',
      lang: 'tsx',
      code: `import { Text, View } from 'react-native'
import { field, MASKS, useFormBridge } from '@runilib/react-formbridge'

const checkoutSchema = {
  firstName: field.text('First name').required().trim(),
  lastName: field.text('Last name').required().trim(),
  email: field.email('Email').required().trim().lowercase(),
  phone: field.tel('Phone').required(),
  department: field.select('Department').options([
    { label: 'Sales', value: 'sales' },
    { label: 'Finance', value: 'finance' },
    { label: 'Operations', value: 'ops' },
  ]).required(),
  customerCode: field
    .masked('LL-9999')
    .tokens({ L: /[A-Z]/ })
    .required()
    .showMaskInPlaceholder()
    .uppercase()
    .validateComplete('Complete the customer code.'),
  cardNumber: field.masked(MASKS.CARD_16).required().showMaskInPlaceholder(),
  expiry: field.masked(MASKS.EXPIRY).required().showMaskInPlaceholder(),
  cvv: field.masked(MASKS.CVV).required().showMaskInPlaceholder(),
}

export function CustomerCheckoutScreen() {
  const { Form, fields, watchAll } = useFormBridge(checkoutSchema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
    persist: { key: 'customer-checkout-native', storage: 'async' },
  })

  const liveValues = watchAll()

  return (
    <Form onSubmit={async (values) => api.saveCustomer(values)}>
      <View style={{ gap: 12, padding: 16 }}>
        <fields.firstName />
        <fields.lastName />
        <fields.email />
        <fields.phone />
        <fields.department />
        <fields.customerCode />
        <fields.cardNumber />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <fields.expiry />
          </View>
          <View style={{ flex: 1 }}>
            <fields.cvv />
          </View>
        </View>
        <Text>Preview •••• {String(liveValues.cardNumber ?? '').slice(-4)}</Text>
        <Form.Submit>Save customer</Form.Submit>
      </View>
    </Form>
  )
}`,
    },
  ],
  subsections: [
    {
      id: 'fb-tutorial-checkout-persist',
      title: 'Persist the draft',
      content: `Checkout, onboarding, and support forms are much safer when the user can leave and come back.

- Use \`persist.key\` to scope the draft to the business flow
- Pick the storage target that matches the platform: local storage on web, async storage on native
- Add \`exclude\` when some values should never be cached locally, such as ephemeral tokens`,
      code: {
        filename: 'CheckoutPersistence.ts',
        lang: 'ts',
        code: `const form = useFormBridge(checkoutSchema, {
  persist: {
    key: 'customer-checkout',
    storage: 'local',
    debounce: 250,
    exclude: ['cvv'],
  },
})`,
      },
    },
    {
      id: 'fb-tutorial-checkout-layout',
      title: 'Layout without forking the runtime',
      content: `The shape of the form can change a lot between screens, but the schema does not have to.

- Put layout concerns in your host components and field wrappers
- Keep the field semantics in the builders
- Use generated fields for most inputs, then style or group them in rows, cards, or side panels as needed`,
    },
  ],
};
