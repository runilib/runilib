import type { LibraryDoc } from './../../../types/index';
import {
  ANALYTICS_HANDLERS_SURFACE,
  ANALYTICS_OPTIONS_SURFACE,
  ANALYTICS_TRACKER_SURFACE,
} from '../constants';

export const analyticsSection: LibraryDoc['sections'][number] = {
  id: 'fb-analytics',

  title: 'useFormBridgeAnalytics()',
  content: `Add analytics to a form without rewriting any field component.

- Track focus, completion time, change counts, abandonment, errors, and successful completion
- Keep callbacks metadata-oriented so analytics stays safe and privacy-conscious
- Works best when paired with a stable getter for current values
- For most forms, passing \`analytics\` directly to \`useFormBridge(schema, { analytics })\` is the simplest path; the standalone hook is the lower-level escape hatch`,
  codeTabs: [
    {
      filename: 'Analytics.web.tsx',
      lang: 'tsx',
      code: `import {
  field,
  useFormBridge,
  useFormBridgeAnalytics,
} from '@runilib/react-formbridge'

const schema = {
  email: field.email('Email').required(),
  password: field.password('Password').required(),
}

export function SignupWithAnalytics() {
  const { Form, fields, state } = useFormBridge(schema)

  useFormBridgeAnalytics(
    {
      formId: 'signup',
      exclude: ['password'],
      handlers: {
        onFieldComplete: (name, ms) => analytics.track('field_complete', { name, ms }),
        onFormCompleted: (durationMs, submitCount, fieldCount) =>
          analytics.track('form_done', { durationMs, submitCount, fieldCount }),
        onFormAbandoned: (pct, last, values) =>
          analytics.track('form_abandoned', { pct, last, values }),
      },
    },
    () => state.values,
  )

  return (
    <Form onSubmit={(values) => api.signup(values)}>
      <fields.email />
      <fields.password />
      <Form.Submit>Sign up</Form.Submit>
    </Form>
  )
}`,
    },
    {
      filename: 'Analytics.native.tsx',
      lang: 'tsx',
      code: `import { ScrollView, View } from 'react-native'
import {
  field,
  useFormBridge,
  useFormBridgeAnalytics,
} from '@runilib/react-formbridge'

const schema = { phone: field.phone('Phone').required() }

export function PhoneCapture() {
  const { Form, fields, state } = useFormBridge(schema)

  useFormBridgeAnalytics(
    {
      handlers: {
        onFieldFocus: (name) => console.log('focus', name),
        onFieldChange: (name, count) => console.log('changes', name, count),
        onFormCompleted: (ms) => console.log('done in', ms),
      },
    },
    () => state.values,
  )

  return (
    <ScrollView>
      <Form onSubmit={(values) => console.log(values)}>
        <View style={{ gap: 12, padding: 16 }}>
          <fields.phone />
          <Form.Submit>Continue</Form.Submit>
        </View>
      </Form>
    </ScrollView>
  )
}`,
    },
  ],
  subsections: [
    {
      id: 'fb-analytics-config',
      title: 'Config & defaults',
      content: `${ANALYTICS_OPTIONS_SURFACE}

${ANALYTICS_HANDLERS_SURFACE}`,
    },
    {
      id: 'fb-analytics-tracker',
      title: 'Returned tracker',
      content: `${ANALYTICS_TRACKER_SURFACE}`,
    },
    {
      id: 'fb-analytics-notes',
      title: 'Usage notes',
      content: `- Pass a stable getter for current values, e.g. () => state.values
- No field values are sent in onFieldChange; keep events metadata-only
- Works on web (pagehide/beforeunload/visibilitychange) and React Native (AppState)`,
    },
  ],
};
