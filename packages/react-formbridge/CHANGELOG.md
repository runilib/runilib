# Changelog

## 1.0.2

### Patch Changes

- [#100](https://github.com/runilib/runilib/pull/100) [`2c8f754`](https://github.com/runilib/runilib/commit/2c8f7546e8667a64177dd60036bd6e6f53bb5f51) Thanks [@akladekouassi](https://github.com/akladekouassi)! - **Breaking:** Schema adapters renamed from `*Resolver` to `*Bridge` to align with the library's identity.

  ### Renamed public API

  | Before                                                                                                               | After                                                                                                      |
  | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
  | `zodResolver`, `yupResolver`, `joiResolver`, `valibotResolver`                                                       | `zodBridge`, `yupBridge`, `joiBridge`, `valibotBridge`                                                     |
  | `ZodResolverOptions`, `YupResolverOptions`, `JoiResolverOptions`, `ValibotResolverOptions`                           | `ZodBridgeOptions`, `YupBridgeOptions`, `JoiBridgeOptions`, `ValibotBridgeOptions`                         |
  | `ZodResolverIssue`, `YupResolverIssue`, `JoiResolverIssue`, `ValibotResolverIssue`                                   | `ZodBridgeIssue`, `YupBridgeIssue`, `JoiBridgeIssue`, `ValibotBridgeIssue`                                 |
  | `ResolverAdapterOptions`, `ResolverErrorMode`, `ResolverIssueContext`, `ResolverIssueMapResult`, `ResolverPathInput` | `BridgeAdapterOptions`, `BridgeErrorMode`, `BridgeIssueContext`, `BridgeIssueMapResult`, `BridgePathInput` |
  | `SchemaValidatorResolver`                                                                                            | `SchemaValidatorBridge`                                                                                    |
  | `ResolverResult`                                                                                                     | `BridgeResult`                                                                                             |
  | `useFormBridge(schema, { resolver })` prop                                                                           | `useFormBridge(schema, { validatorBridge })` prop                                                          |

  ### Migration

  ```diff
  - import { zodResolver } from '@runilib/react-formbridge';
  + import { zodBridge } from '@runilib/react-formbridge';

  - const resolver = zodResolver(schema);
  + const bridge = zodBridge(schema);

    useFormBridge(schema, {
  -   resolver,
  +   validatorBridge: bridge,
    });
  ```

  No aliases are kept. Update imports and the `validatorBridge` prop name at call sites.

## 1.0.1

### Patch Changes

- [#97](https://github.com/runilib/runilib/pull/97) [`0ca21cc`](https://github.com/runilib/runilib/commit/0ca21cc23d2344ae70dbe9ea773c0ce5be2af5f7) Thanks [@akladekouassi](https://github.com/akladekouassi)! - fix field.phone country modal bug on native

## 1.0.0

### Major Changes

- [#53](https://github.com/runilib/runilib/pull/53) [`4e5f403`](https://github.com/runilib/runilib/commit/4e5f4032e1caa5cb3c52036d0452ae06e0f77c7c) Thanks [@akladekouassi](https://github.com/akladekouassi)! - Initial public release of `@runilib/react-formbridge`, a schema-first, headless form engine for React and React Native. Define a form once with the fluent `field` builder and render it anywhere — web or native — with the same API, the same types, and zero platform glue.

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
