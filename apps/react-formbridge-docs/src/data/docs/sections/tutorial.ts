import type { LibraryDoc } from './../../../types/index';

export const tutorialSection: LibraryDoc['sections'][number] = {
  id: 'fb-tutorial',
  title: 'Tutorial',
  content: `This tutorial is the guided path through react-formbridge. The goal is not to show every API in one sitting. The goal is to help you understand the schema-first mental model well enough that simple and complex forms both feel predictable.

- If you want the shortest route, start with \`Quick start\`
- If you want the deeper mental model, stay on this page and build the tutorial flow step by step
- The same ideas apply to React web and React Native, so each milestone shows both render targets`,
  codeTabs: [
    {
      filename: 'TutorialResult.web.tsx',
      lang: 'tsx',
      code: `import type { FormSchema } from '@runilib/react-formbridge'
import { field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  firstName: field.text('First name').required().trim(),
  lastName: field.text('Last name').required().trim(),
  email: field.email('Work email').required().trim().lowercase(),
  accountType: field.select('Account type').options([
    { label: 'Personal', value: 'personal' },
    { label: 'Company', value: 'company' },
  ]).required(),
  companyName: field
    .text('Company name')
    .visibleAndRequiredWhen('accountType', 'company')
    .clearOnHide(),
  terms: field.checkbox('Accept terms').mustBeTrue(),
} satisfies FormSchema

export function TutorialResult() {
  const { Form, fields, state } = useFormBridge(schema, {
    validateOn: 'onTouched',
    revalidateOn: 'onChange',
  })

  return (
    <Form onSubmit={async (values) => api.createAccount(values)}>
      <fields.firstName />
      <fields.lastName />
      <fields.email />
      <fields.accountType />
      <fields.companyName />
      <fields.terms />
      <Form.Submit disabled={!state.isValid}>Create account</Form.Submit>
    </Form>
  )
}`,
    },
    {
      filename: 'TutorialResult.native.tsx',
      lang: 'tsx',
      code: `import { ScrollView, View } from 'react-native'
import type { FormSchema } from '@runilib/react-formbridge'
import { field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  firstName: field.text('First name').required().trim(),
  lastName: field.text('Last name').required().trim(),
  email: field.email('Work email').required().trim().lowercase(),
  accountType: field.select('Account type').options([
    { label: 'Personal', value: 'personal' },
    { label: 'Company', value: 'company' },
  ]).required(),
  companyName: field
    .text('Company name')
    .visibleWhen('accountType', 'company')
    .requiredWhen('accountType', 'company')
    .clearOnHide(),
  terms: field.checkbox('Accept terms').mustBeTrue(),
} satisfies FormSchema

export function TutorialResultScreen() {
  const { Form, fields, state } = useFormBridge(schema, {
    validateOn: 'onTouched',
    revalidateOn: 'onChange',
  })

  return (
    <ScrollView>
      <Form onSubmit={async (values) => api.createAccount(values)}>
        <View style={{ gap: 12, padding: 16 }}>
          <fields.firstName />
          <fields.lastName />
          <fields.email />
          <fields.accountType />
          <fields.companyName />
          <fields.terms />
          <Form.Submit disabled={!state.isValid}>Create account</Form.Submit>
        </View>
      </Form>
    </ScrollView>
  )
}`,
    },
  ],
  subsections: [
    {
      id: 'fb-tutorial-before',
      title: 'Before you begin',
      content: `You do not need to memorize the full API before starting. This tutorial assumes you already know basic React and JSX, and that you are comfortable reading TypeScript examples even if your app uses JavaScript.

- Familiarity with React components and hooks will help
- Familiarity with HTML inputs or React Native inputs will help
- You do not need prior experience with react-formbridge itself`,
    },
    {
      id: 'fb-tutorial-build',
      title: 'What we are building',
      content: `We will build an account signup flow that starts small and grows into a realistic product form.

- We begin with a tiny newsletter-style form
- Then we add more fields and reactive state
- Then we add conditional business fields, stronger validation, and better submit behavior
- Finally, the later tutorial pages branch into checkout, custom UI, resolvers, wizard flows, and native screens

The preview above is the kind of final form we are aiming for on both web and mobile.`,
    },
    {
      id: 'fb-tutorial-prerequisites',
      title: 'Prerequisites',
      content: `To get the most out of this page, you should already be comfortable with:

- React components and props
- React hooks
- Modern JavaScript or TypeScript syntax such as \`const\`, arrow functions, destructuring, and async / await
- Basic form concepts like submit handlers, validation errors, and controlled inputs`,
    },
    {
      id: 'fb-tutorial-setup-browser',
      title: 'Setup option 1: stay inside the docs',
      content: `This is the fastest path.

- Read the code tabs on this page and on the follow-up tutorial pages
- Use the visual previews to compare the web and native render targets
- Open the reference pages whenever you want the full surface of one hook or one builder

This option is enough if your goal is to understand the runtime before you wire it into a real product.`,
    },
    {
      id: 'fb-tutorial-setup-local',
      title: 'Setup option 2: run the examples locally',
      content: `If you want to follow along in a real workspace, the monorepo already includes a docs app, a web example app, and a mobile example app.`,
      code: {
        filename: 'tutorial-setup.sh',
        lang: 'bash',
        code: `yarn install

# Documentation site
yarn dev:docs:formbridge

# Web examples (Vite)
yarn dev:ex:web

# Expo / React Native examples
yarn dev:ex:mobile`,
      },
    },
    {
      id: 'fb-tutorial-help',
      title: 'If you get stuck',
      content: `A tutorial only works if you can recover when something feels fuzzy.

- Use the GitHub issue tracker when you think you found an API, typing, or runtime bug
- Use the Feedback page in this docs site when a guide is confusing, incomplete, or missing an example
- When in doubt, compare the tutorial pages with the reference pages for \`useFormBridge()\`, \`fieldController()\`, and the specific builder you are using`,
    },
    {
      id: 'fb-tutorial-overview',
      title: 'What react-formbridge solves',
      content: `react-formbridge is a schema-driven form runtime for React and React Native. It helps with the parts of forms that usually get duplicated or scattered:

- Defining the value shape and keeping it typed
- Rendering fields from one source of truth
- Running validation and showing errors at the right time
- Expressing conditional logic without hiding it in component branches
- Keeping web and native behavior aligned without rewriting the same form twice`,
    },
    {
      id: 'fb-tutorial-basics',
      title: 'The core mental model',
      content: `The basic loop is simple:

1. Define a schema with \`field.*\` builders
2. Pass that schema to \`useFormBridge()\`
3. Render \`Form\` and the generated \`fields\`
4. Use \`state\`, \`watch()\`, or \`fieldController(name)\` only when the screen needs more control

The important idea is that the schema owns the field behavior, while the component tree owns layout and product chrome.`,
    },
    {
      id: 'fb-tutorial-newsletter',
      title: 'A small newsletter signup form',
      content: `We always start with the smallest useful form. A one-field newsletter signup is enough to learn the relationship between the schema, the generated field, and the submit wrapper.`,
      codeTabs: [
        {
          filename: 'NewsletterSignup.web.tsx',
          lang: 'tsx',
          code: `import type { FormSchema } from '@runilib/react-formbridge'
import { field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  email: field.email('Email address').required().trim().lowercase(),
} satisfies FormSchema

export function NewsletterSignup() {
  const { Form, fields } = useFormBridge(schema, {
    validateOn: 'onSubmit',
  })

  return (
    <Form onSubmit={async (values) => api.subscribe(values)}>
      <fields.email />
      <Form.Submit>Join newsletter</Form.Submit>
    </Form>
  )
}`,
        },
        {
          filename: 'NewsletterSignup.native.tsx',
          lang: 'tsx',
          code: `import { ScrollView, View } from 'react-native'
import type { FormSchema } from '@runilib/react-formbridge'
import { field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  email: field.email('Email address').required().trim().lowercase(),
} satisfies FormSchema

export function NewsletterSignupScreen() {
  const { Form, fields } = useFormBridge(schema, {
    validateOn: 'onSubmit',
  })

  return (
    <ScrollView>
      <Form onSubmit={async (values) => api.subscribe(values)}>
        <View style={{ gap: 12, padding: 16 }}>
          <fields.email />
          <Form.Submit>Join newsletter</Form.Submit>
        </View>
      </Form>
    </ScrollView>
  )
}`,
        },
      ],
    },
    {
      id: 'fb-tutorial-next',
      title: 'Where to go next',
      content: `Once the tiny form feels clear, continue in this order:

1. \`Tutorial: signup form\` for multi-field schemas, conditional sections, and live state
2. \`Tutorial: checkout flow\` for masks, persistence, denser layouts, and previews
3. \`Tutorial: validation & resolvers\` for Zod, Yup, Joi, Valibot, and async options
4. \`Tutorial: custom UI & styling\` for \`fieldController(name)\`, \`field.custom()\`, and styling systems
5. \`Tutorial: advanced flows\` for wizards, dynamic forms, readonly review screens, analytics, and route-driven mobile flows`,
    },
  ],
};
