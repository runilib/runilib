# Changelog

## [1.0.0] — 2026-03-20

### Added — initial public release

`@runilib/react-formbridge` is a schema-first form library for React and React Native. It lets you define a form once, then render generated fields, validation, and state with the same mental model on web and native.

**Core form API**

- `field` builder namespace to declare form fields fluently
- `useFormBridge(schema, options)` to generate `Form`, `fields`, reactive state, and imperative controls
- `<Form>` and `<Form.Submit>` primitives that map to platform-native renderers
- strongly inferred `values`, `errors`, and generated field props from the schema itself

**Field builders**

- text-like fields: `text`, `email`, `password`, `tel`, `url`, `textarea`, `phone`
- selection fields: `checkbox`, `switch`, `select`, `radio`
- structured inputs: `number`, `date`, `otp`, `masked`, `file`
- `custom` builder for bespoke value types and rendering needs

**Validation and data flow**

- built-in rules for required, min, max, pattern, matching fields, transforms, trimming, and password strength
- sync and async custom validators with debounce support
- schema resolver adapters for Zod, Yup, Joi, and Valibot
- conditional visibility, required, and disabled states driven by other field values

**Advanced flows**

- draft persistence with pluggable storage adapters
- `useFormBridgeWizard` for multi-step flows
- `useDynamicFormBridge` for JSON-driven forms
- `useReadonlyFormBridge` for readonly and diff rendering
- async options support for remote selects and autocomplete-style fields
- optional analytics hooks for submit and field-level events

**Platform-aware UI**

- one package with web and React Native entry points
- generated fields expose platform-specific UI overrides instead of one large shared bag of props
- web-only props such as `className`, `textareaProps`, and `selectProps` stay on web
- native consumers resolve a native type surface when `react-native` conditions are enabled in TypeScript
