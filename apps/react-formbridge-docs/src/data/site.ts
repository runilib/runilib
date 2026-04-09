import type { CodeSnippet, FaqItem, FeatureCard, SiteStat, UseCaseCard } from '@/types';

export const libraryInfo = {
  name: 'react-formbridge',
  packageName: '@runilib/react-formbridge',
  version: '1.0.0',
  tagline: 'Schema-driven form builder for React and React Native',
  description:
    'Complete documentation for schema-driven forms across React web and React Native. Define one TypeScript schema, generate typed fields, wire validation, add conditional logic, persist drafts, and ship advanced flows without rebuilding the form runtime screen by screen.',
  shortDescription:
    'Schema-driven React and React Native forms with typed fields, validation, conditional logic, persistence, async options, and multi-step flows.',
  installCommand: 'npm install @runilib/react-formbridge',
  npmUrl: 'https://www.npmjs.com/package/@runilib/react-formbridge',
  githubUrl: 'https://github.com/runilib/react-formbridge',
  monorepoUrl: 'https://github.com/runilib/runilib/tree/main/packages/react-formbridge',
  repoIssuesUrl: 'https://github.com/runilib/runilib/issues',
};

export const primaryKeywords = [
  'react-formbridge',
  '@runilib/react-formbridge',
  'React form builder',
  'React Native form builder',
  'schema-driven forms',
  'TypeScript form validation',
  'React form documentation',
  'React Native form documentation',
  'multi-step forms',
  'form persistence',
  'cross-platform forms',
];

export const homeStats: SiteStat[] = [
  { value: '46', label: 'docs pages' },
  { value: '17', label: 'field builders' },
  { value: '11', label: 'advanced hooks and patterns' },
  { value: '2', label: 'platforms covered' },
];

export const homeFeatures: FeatureCard[] = [
  {
    title: 'One schema for web and native',
    description:
      'Keep the form definition as the source of truth and reuse the same runtime shape across React and React Native.',
  },
  {
    title: 'Typed generated fields',
    description:
      'useFormBridge() returns a ready-to-render Form wrapper and field components with UI props scoped to each platform.',
  },
  {
    title: 'Validation and resolvers',
    description:
      'Combine fluent field validation with zod, yup, joi, or valibot adapters without duplicating the render layer.',
  },
  {
    title: 'Production patterns included',
    description:
      'Draft persistence, async options, readonly views, dynamic forms, analytics hooks, and wizards are documented end to end.',
  },
];

export const useCases: UseCaseCard[] = [
  {
    title: 'Signup and account creation',
    description:
      'Start from a small schema, add password strength, cross-field validation, and draft recovery without hand-wiring input state.',
  },
  {
    title: 'Checkout and billing',
    description:
      'Use masked fields, phone inputs, dynamic country-specific requirements, and saved progress for longer purchase flows.',
  },
  {
    title: 'Back-office and CRUD editing',
    description:
      'Seed existing values, infer fields from data structures, and pair edit forms with readonly or diff views for approval steps.',
  },
  {
    title: 'Multi-step onboarding',
    description:
      'Split large schemas into wizard steps, keep validation predictable, and preserve a shared submission model across pages or screens.',
  },
];

export const faqItems: FaqItem[] = [
  {
    question: 'Does react-formbridge support both React web and React Native?',
    answer:
      'Yes. The library is designed around one schema-first API that renders on React web and React Native with platform-specific UI surfaces where needed.',
  },
  {
    question: 'Can I keep zod or yup as the validation source of truth?',
    answer:
      'Yes. The documentation covers zod, yup, joi, and valibot adapters so external schemas can drive validation while formbridge handles rendering and field orchestration.',
  },
  {
    question: 'Is react-formbridge only for simple forms?',
    answer:
      'No. The docs include async options, conditional fields, persistence, multi-step wizards, inferred schemas, readonly rendering, and analytics hooks for production flows.',
  },
  {
    question: 'Do I need a provider or a custom registry before I can use it?',
    answer:
      'No. The standard flow is provider-free. You define a schema, call useFormBridge(), and render the generated Form and field components directly.',
  },
];

export const groupDescriptions: Record<string, string> = {
  'Getting started':
    'Install the package, understand the schema mental model, and get a first form on screen quickly.',
  Tutorials:
    'Follow end-to-end guides for signup, checkout, validation, custom UI, and advanced production flows on web and React Native.',
  'Core API':
    'Learn the main hook surface, generated fields, state model, validation timing, and the shared builder foundation.',
  'Available Field builders':
    'Browse every built-in field builder with defaults, mini recipes, and platform-specific notes.',
  Advanced:
    'Go beyond simple forms with adapters, persistence, styling, inference, async options, dynamic forms, wizards, and readonly views.',
};

export const homeSnippets: CodeSnippet[] = [
  {
    label: 'Web',
    filename: 'SignupForm.web.tsx',
    lang: 'tsx',
    preview: {
      src: '/docs/formbridge/formbridge-overview-web.svg',
      alt: 'Web preview of a schema-driven signup form rendered with generated fields.',
      caption: 'Web preview',
      maxWidth: 1440,
      maxHeight: 900,
    },
    code: `import type { FormSchema } from '@runilib/react-formbridge'
import { field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  email: field.email('Work email').required().trim().lowercase(),
  password: field.password('Password').required().strong(),
  role: field.select('Role').options(['admin', 'editor', 'viewer']).required(),
  terms: field.checkbox('Accept terms').mustBeTrue(),
} satisfies FormSchema

export function SignupForm() {
  const { Form, fields, state } = useFormBridge(schema, {
    validateOn: 'onTouched',
    persist: { key: 'signup-form-web' },
  })

  return (
    <Form onSubmit={async (values) => api.signup(values)}>
      <fields.email />
      <fields.password />
      <fields.role />
      <fields.terms />
      <Form.Submit disabled={!state.isValid}>Create account</Form.Submit>
    </Form>
  )
}`,
  },
  {
    label: 'Native',
    filename: 'SignupScreen.native.tsx',
    lang: 'tsx',
    preview: {
      src: '/docs/formbridge/formbridge-overview-native.svg',
      alt: 'Native preview of the same schema rendered as a mobile signup screen.',
      caption: 'Native preview',
      maxWidth: 720,
      maxHeight: 1280,
    },
    code: `import { ScrollView, View } from 'react-native'
import type { FormSchema } from '@runilib/react-formbridge'
import { field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  email: field.email('Work email').required().trim().lowercase(),
  password: field.password('Password').required().strong(),
  role: field.select('Role').options(['admin', 'editor', 'viewer']).required(),
  terms: field.checkbox('Accept terms').mustBeTrue(),
} satisfies FormSchema

export function SignupScreen() {
  const { Form, fields, state } = useFormBridge(schema, {
    validateOn: 'onTouched',
    persist: { key: 'signup-form-native' },
  })

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Form onSubmit={async (values) => api.signup(values)}>
        <View style={{ gap: 12, padding: 16 }}>
          <fields.email />
          <fields.password />
          <fields.role />
          <fields.terms />
          <Form.Submit disabled={!state.isValid}>Create account</Form.Submit>
        </View>
      </Form>
    </ScrollView>
  )
}`,
  },
];
