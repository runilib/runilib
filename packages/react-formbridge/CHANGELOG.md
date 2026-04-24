# Changelog

## 1.0.0

### Major Changes

- [#48](https://github.com/runilib/runilib/pull/48) [`cb6e0f5`](https://github.com/runilib/runilib/commit/cb6e0f56a06754ade5684ae63fa1d9cabe868cb1) Thanks [@akladekouassi](https://github.com/akladekouassi)! - Initial public release of `@runilib/react-formbridge`, a schema-first, headless form engine for React and React Native. Define a form once with the fluent `field` builder and render it anywhere — web or native — with the same API, the same types, and zero platform glue.

  ### Core API

  - `useFormBridge(schema, options)` returns a fully typed `Form`, generated `fields`, reactive values and errors, plus imperative controls.
  - `<Form>` and `<Form.Submit>` primitives that map to the platform-native renderer automatically.
  - `satisfies FormSchema` preserves exact field types so each generated field keeps its own autocomplete and override surface.

  ### Field builders

  - Text-like: `text`, `email`, `password`, `tel`, `url`, `textarea`, `phone` (with `libphonenumber-js` formatting).
  - Selection: `checkbox`, `switch`, `select`, `radio`.
  - Structured inputs: `number`, `date`, `otp`, `masked`, `file`.
  - `custom` builder for bespoke value types and rendering.

  ### Built-in validation as the primary path

  - Fluent rules for `required`, `min`, `max`, `pattern`, `matches`, password strength, `transform`, and `trim`.
  - Sync and async custom validators with debounce support.
  - No external schema library required to ship a production form.

  ### Optional schema resolvers

  - Escape hatches for Zod, Yup, Joi, and Valibot when you need to reuse an existing schema.

  ### Advanced flows

  - `useFormBridgeWizard` for multi-step forms with per-step validation and navigation state.
  - `useDynamicFormBridge` for JSON-driven forms built at runtime.
  - `useFormBridgeReadonly` for read-only and diff views.
  - Conditional visibility, `required`, and `disabled` driven by other field values.
  - Draft persistence with pluggable storage adapters.
  - Async options for remote-loaded selects and autocomplete-style fields.
  - Optional analytics hooks for submit and field-level events.

  ### Platform-aware UI

  - Single package with dedicated web and React Native entry points.
  - Generated fields expose only the override props that make sense for their platform and field type (`inputProps`, `textareaProps`, `selectProps` on web; native-only surface on native).
  - TypeScript resolves the native type surface via the `react-native` customCondition.

  Docs: [react-formbridge.runilib.dev](https://react-formbridge.runilib.dev)

### Patch Changes

- [#47](https://github.com/runilib/runilib/pull/47) [`83a4cc1`](https://github.com/runilib/runilib/commit/83a4cc14b0dea01a63f50874522bd8eac217a696) Thanks [@akladekouassi](https://github.com/akladekouassi)! - update readme files

## [1.0.0] - 2026-03-20

### Added - initial public release

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
- `useFormBridgeReadonly` for readonly and diff rendering
- async options support for remote selects and autocomplete-style fields
- optional analytics hooks for submit and field-level events

**Platform-aware UI**

- one package with web and React Native entry points
- generated fields expose platform-specific UI overrides instead of one large shared bag of props
- web-only props such as `className`, `textareaProps`, and `selectProps` stay on web
- native consumers resolve a native type surface when `react-native` conditions are enabled in TypeScript
