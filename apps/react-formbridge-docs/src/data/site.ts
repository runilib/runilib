import type { CodeSnippet, FaqItem, FeatureCard, SiteStat, UseCaseCard } from '@/types';

import { formbridgePackageVersion } from './packageVersion';

export const libraryInfo = {
  name: 'react-formbridge',
  packageName: '@runilib/react-formbridge',
  version: formbridgePackageVersion,
  tagline: 'Headless, schema-driven forms for React and React Native',
  description:
    'Schema-first, headless forms for React and React Native. One TypeScript schema, typed controllers, built-in validation, conditional logic, draft persistence, and multi-step flows.',
  shortDescription:
    'Headless React and React Native forms with typed controllers, validation, conditional logic, persistence, async options, and multi-step flows.',
  installCommand: 'npm install @runilib/react-formbridge',
  npmUrl: 'https://www.npmjs.com/package/@runilib/react-formbridge',
  githubUrl: 'https://github.com/runilib/react-formbridge',
  monorepoUrl: 'https://github.com/runilib/runilib/tree/main/packages/react-formbridge',
  repoIssuesUrl: 'https://github.com/runilib/react-formbridge/issues',
  discordUrl: 'https://discord.gg/sHz9WnFs2t',
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
  { value: '45', label: 'docs pages' },
  { value: '17', label: 'field builders' },
  { value: '12', label: 'advanced hooks and patterns' },
  { value: '2', label: 'platforms covered' },
];

export const homeFeatures: FeatureCard[] = [
  {
    title: 'One schema for web and native',
    description:
      'Keep the form definition as the source of truth and reuse the same runtime shape across React and React Native.',
  },
  {
    title: 'Typed headless controllers',
    description:
      'fieldController() connects schema-owned state and validation to your own web, native, or design-system components.',
  },
  {
    title: 'Validation included',
    description:
      'Every field carries its own fluent validation rules. No external library required - everything ships with the package.',
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
      'Yes. The schema and runtime API are shared; each platform renders its own controls.',
  },
  {
    question: 'Do I need to install Zod, Yup, or any validation library?',
    answer:
      'No. FormBridge ships with a complete fluent validation API built into every field builder. External adapters exist for teams that already rely on Zod or Yup, but they are entirely optional.',
  },
  {
    question: 'Is react-formbridge only for simple forms?',
    answer:
      'No. The docs include async options, conditional fields, persistence, multi-step wizards, inferred schemas, readonly rendering, and analytics hooks for production flows.',
  },
  {
    question: 'Do I need a provider or a custom registry before I can use it?',
    answer:
      'No. Define a schema, call useFormBridge(), and bind fieldController() to your own components. FormProvider is optional for deep composition.',
  },
];

export const groupDescriptions: Record<string, string> = {
  'Getting started':
    'Install the package, understand the schema mental model, and get a first form on screen quickly.',
  Rendering:
    'Connect typed field controllers to native inputs or reusable design-system adapters.',
  'Core concepts':
    'Learn the hook surface, state model, validation timing, persistence, and builder foundation.',
  'Available Field builders':
    'Browse every built-in field builder with defaults, mini recipes, and platform-specific notes.',
  Advanced:
    'Go beyond simple forms with adapters, persistence, styling, context composition, inference, async options, dynamic forms, wizards, and readonly views.',
};

export const homeSnippets: CodeSnippet[] = [
  {
    label: 'Web',
    filename: 'SignupForm.web.tsx',
    lang: 'tsx',
    code: `import type { FormSchema } from '@runilib/react-formbridge'
import { field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  email: field.email('Work email').required().trim().lowercase(),
  password: field.password('Password').required().strong(),
  role: field.select('Role').options(['admin', 'editor', 'viewer']).required(),
  terms: field.checkbox('Accept terms').mustBeTrue(),
} satisfies FormSchema

export function SignupForm() {
  const form = useFormBridge(schema, {
    validateOn: 'onTouched',
    persist: { key: 'signup-form-web' },
    onSubmit: async (values) => {
      console.log('Submitted values', values)
      window.alert(JSON.stringify(values, null, 2))
    },
  })
  const email = form.fieldController('email')
  const terms = form.fieldController('terms')

  return (
    <form onSubmit={form.handleSubmit}>
      <input
        type="email"
        value={email.value}
        onChange={(event) => email.onChange(event.target.value)}
        onBlur={email.onBlur}
      />
      <label>
        <input
          type="checkbox"
          checked={terms.value}
          onChange={(event) => terms.onChange(event.target.checked)}
        />
        Accept terms
      </label>
      <button disabled={form.state.isSubmitting}>Create account</button>
    </form>
  )
}`,
  },
  {
    label: 'Native',
    filename: 'SignupScreen.native.tsx',
    lang: 'tsx',
    code: `import { Alert, Button, ScrollView, TextInput, View } from 'react-native'
import type { FormSchema } from '@runilib/react-formbridge'
import { field, useFormBridge } from '@runilib/react-formbridge'

const schema = {
  email: field.email('Work email').required().trim().lowercase(),
  password: field.password('Password').required().strong(),
  role: field.select('Role').options(['admin', 'editor', 'viewer']).required(),
  terms: field.checkbox('Accept terms').mustBeTrue(),
} satisfies FormSchema

export function SignupScreen() {
  const form = useFormBridge(schema, {
    validateOn: 'onTouched',
    persist: { key: 'signup-form-native' },
    onSubmit: async (values) => {
      Alert.alert('Submitted', JSON.stringify(values, null, 2))
    },
  })
  const email = form.fieldController('email')
  const password = form.fieldController('password')

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={{ gap: 12, paddingTop: 40, padding: 16 }}>
        <TextInput value={email.value} onChangeText={email.onChange} />
        <TextInput
          value={password.value}
          onChangeText={password.onChange}
          secureTextEntry
        />
        <Button
          title="Create account"
          onPress={form.submit}
          disabled={form.state.isSubmitting}
        />
      </View>
    </ScrollView>
  )
}`,
  },
];
