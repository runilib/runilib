import type { LibraryDoc } from '../../types';

export const docSidebar: LibraryDoc['sidebar'] = [
  {
    group: 'Getting started',
    items: [
      { id: 'fb-overview', label: 'Introduction' },
      { id: 'fb-install', label: 'Installation' },
      { id: 'fb-quickstart', label: 'Quick start' },
      { id: 'fb-schema-mental-model', label: 'Schema mental model' },
      { id: 'fb-tutorial-custom-ui', label: 'Render your UI' },
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
    group: 'Rendering',
    color: 'blue',
    items: [
      { id: 'fb-field-controller', label: 'form.fieldController()' },
      { id: 'fb-form', label: '<Form />' },
      { id: 'fb-field-label', label: '<FieldLabel />' },
      { id: 'fb-field-error', label: '<FieldError />' },
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
      { id: 'fb-adapters', label: 'Validator bridge' },
      { id: 'fb-conditional', label: 'Conditional logic' },
    ],
  },
];
