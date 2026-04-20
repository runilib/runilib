import type { LibraryDoc } from '../../types';

export const docSidebar: LibraryDoc['sidebar'] = [
  {
    group: 'Getting started',
    items: [
      { id: 'fb-overview', label: 'Introduction' },
      { id: 'fb-install', label: 'Installation' },
      { id: 'fb-quickstart', label: 'Quick start' },
      { id: 'fb-schema-mental-model', label: 'Schema mental model' },
    ],
  },
  {
    group: 'Interactives Tutorials',
    color: 'blue',
    items: [
      { id: 'fb-tutorial', label: 'Tutorial' },
      { id: 'fb-tutorial-signup', label: 'Signup form' },
      { id: 'fb-tutorial-checkout', label: 'Checkout flow' },
      { id: 'fb-tutorial-validation', label: 'Validation & resolvers' },
      {
        id: 'fb-tutorial-schema-validation',
        label: 'createSchema() & strong validation',
      },
      { id: 'fb-tutorial-custom-ui', label: 'Custom UI & styling' },
      { id: 'fb-tutorial-production', label: 'Advanced flows' },
    ],
  },
  {
    group: 'Core concepts',
    color: 'blue',
    items: [
      { id: 'fb-schema', label: 'createSchema()' },
      { id: 'fb-state', label: 'State' },
      { id: 'fb-actions', label: 'Actions & helpers' },
      { id: 'fb-builder-basics', label: 'Builder basics' },
      { id: 'fb-persistence', label: 'Draft persistence' },
    ],
  },
  {
    group: 'Hooks',
    color: 'blue',
    items: [
      { id: 'fb-use-form-bridge', label: 'useFormBridge()' },
      { id: 'fb-use-form-bridge-context', label: 'useFormBridgeContext()' },
      { id: 'fb-analytics', label: 'useFormBridgeAnalytics()' },
      { id: 'fb-dynamic', label: 'useDynamicFormBridge()' },
      { id: 'fb-wizard', label: 'useFormBridgeWizard()' },
      { id: 'fb-readonly', label: 'useFormBridgeReadonly()' },
      { id: 'fb-use-async-options', label: 'useAsyncOptions() - experimental' },
    ],
  },
  {
    group: 'Components',
    color: 'blue',
    items: [
      { id: 'fb-form', label: 'Form Components' },
      { id: 'fb-field-error', label: 'FieldError Components' },
      { id: 'fb-field-label', label: 'FieldLabel Components' },
      { id: 'fb-fields', label: 'Generated fields' },
      { id: 'fb-field-controller', label: 'fieldController()' },
      { id: 'fb-host-helpers', label: 'Host Components' },
    ],
  },
  {
    group: 'Field builders',
    color: 'blue',
    items: [
      { id: 'fb-base-field-builder', label: 'Base field builder' },
      { id: 'fb-text', label: 'field.text()' },
      { id: 'fb-email', label: 'field.email()' },
      { id: 'fb-password', label: 'field.password()' },
      { id: 'fb-tel', label: 'field.tel()' },
      { id: 'fb-url', label: 'field.url()' },
      { id: 'fb-textarea', label: 'field.textarea()' },
      { id: 'fb-number', label: 'field.number()' },
      { id: 'fb-checkbox', label: 'field.checkbox()' },
      { id: 'fb-switch', label: 'field.switch()' },
      { id: 'fb-select', label: 'field.select()' },
      { id: 'fb-radio', label: 'field.radio()' },
      { id: 'fb-date', label: 'field.date()' },
      { id: 'fb-phone', label: 'field.phone()' },
      { id: 'fb-masked', label: 'field.masked()' },
      { id: 'fb-file', label: 'field.file()' },
      { id: 'fb-otp', label: 'field.otp()' },
      { id: 'fb-custom', label: 'field.custom()' },
      { id: 'fb-infer', label: 'field.infer()' },
      { id: 'fb-infer-type', label: 'field.inferType()' },
    ],
  },
  {
    group: 'Validation',
    color: 'blue',
    items: [
      { id: 'fb-validation', label: 'Built-in validation' },
      { id: 'fb-adapters', label: 'Validator resolver' },
      { id: 'fb-conditional', label: 'Conditional logic' },
    ],
  },
  {
    group: 'Styling',
    color: 'blue',
    items: [
      { id: 'fb-global-props', label: 'globalDefaults' },
      { id: 'fb-web-ui', label: 'Styling recipes' },
    ],
  },
];
