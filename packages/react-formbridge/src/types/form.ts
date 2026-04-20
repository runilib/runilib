import type { ButtonHTMLAttributes, FormHTMLAttributes, ReactNode } from 'react';

import type { VisibilityMap } from '../core/conditions/conditions';
import type {
  EmptyProps,
  FieldRenderHandlers,
  FieldRenderState,
  NativeStyleValue,
  Platform,
  PlatformStyleValue,
  SelectOption,
} from './field';
import type {
  FormSchema,
  FormState,
  ResolvedFieldDescriptor,
  SchemaShape,
  SchemaValues,
} from './schema';
import type { FieldComponents } from './ui';

// ─── Standalone FieldError component ─────────────────────────────────────────

/**
 * Props for the standalone `<FieldError />` component returned by
 * `useFormBridge`. Use it anywhere in the tree to render the validation error
 * for a single field with the same visibility rules (touched || submitted) as
 * the auto-rendered fields.
 *
 * @typeParam Schema - The form schema (drives the `name` autocomplete).
 * @typeParam TPlatform - `'web'` or `'native'` - selects className vs native style.
 */
export type FieldErrorProps<
  Schema extends FormSchema,
  TPlatform extends Platform = Platform,
> = {
  /** The field name to show the error for. Typed from the schema keys. */
  name: keyof SchemaShape<Schema> & string;
  /**
   * Custom render function. Called *only* when there is an error to show, so
   * you don't have to null-check inside it.
   */
  render?: (ctx: { name: string; error: string }) => ReactNode;
} & (TPlatform extends 'web' ? { className?: string } : EmptyProps) & {
    /** Inline style - `CSSProperties` on web, `StyleProp<TextStyle>` on native. */
    style?: PlatformStyleValue<TPlatform>;
  };

/**
 * The component type returned by `useFormBridge().FieldError`. Returns `null`
 * when the target field has no error to render, so it's safe to mount
 * unconditionally.
 */
export type FieldErrorComponent<
  Schema extends FormSchema,
  TPlatform extends Platform = Platform,
> = (props: FieldErrorProps<Schema, TPlatform>) => React.ReactElement | null;

// ─── Standalone Label component ────────────────────────────────────────────────

/**
 * Props for the standalone `<FieldLabel />` component. Renders the label and
 * required-mark for a field, pulling the text straight from the schema (or
 * overridden via `children`).
 *
 * @typeParam Schema - The form schema (drives the `name` autocomplete).
 * @typeParam TPlatform - `'web'` or `'native'`.
 */
export type FieldLabelProps<
  Schema extends FormSchema,
  TPlatform extends Platform = Platform,
> = {
  /** The field name to show the label for. Typed from the schema keys. */
  name: keyof SchemaShape<Schema> & string;
  /** Override the label text coming from the schema. */
  children?: ReactNode;
  /**
   * Custom render function. Receives everything needed to build an accessible
   * label - useful for wrapping the label in tooltips, icons, etc.
   */
  render?: (ctx: {
    name: string;
    label: string;
    required: boolean;
    htmlFor: string;
  }) => ReactNode;
  /** Custom renderer for the required-mark (defaults to a red asterisk). */
  renderRequiredMark?: () => ReactNode;
} & (TPlatform extends 'web' ? { className?: string; htmlFor?: string } : EmptyProps) & {
    /** Inline style - `CSSProperties` on web, `StyleProp<TextStyle>` on native. */
    style?: PlatformStyleValue<TPlatform>;
  };

/**
 * Minimal imperative handle a focusable field must expose to FormBridge so
 * features like "focus first invalid field on submit" can work. Both methods
 * are optional - FormBridge gracefully skips fields that don't support them.
 */
export interface FocusableFieldHandle {
  /** Move keyboard focus to this field. */
  focus?: () => void;
  /** Remove focus from this field. */
  blur?: () => void;
}

/**
 * Internal: extra metadata attached to a {@link FieldController} based on the
 * field's type. Select/radio fields get an `options` array; OTP fields get
 * `otpLength`; everything else gets nothing.
 */
type FieldControllerTypeMetadata<TEntry> =
  ResolvedFieldDescriptor<TEntry> extends { _type: 'select' | 'radio' }
    ? { options?: SelectOption[] }
    : ResolvedFieldDescriptor<TEntry> extends { _type: 'otp' }
      ? { otpLength?: number }
      : Record<never, never>;

/**
 * Internal: {@link FieldRenderState} narrowed to a specific schema key. Strips
 * the generic `name`/`options`/`otpLength` so they can be re-added with
 * precise types by {@link FieldController}.
 */
type FieldControllerState<
  Schema extends FormSchema,
  K extends keyof SchemaShape<Schema> & string = keyof SchemaShape<Schema> & string,
> = Omit<FieldRenderState<SchemaValues<Schema>[K]>, 'name' | 'options' | 'otpLength'> & {
  name: K;
};

/**
 * Headless controller for a single field. Returned by
 * `useFormBridge().fieldController(name)`.
 *
 * Combines:
 * - the full field render state (value, error, touched, …),
 * - type-specific metadata (options for select, otpLength for OTP, …),
 * - change/blur/focus handlers,
 * - imperative actions (`setValue`, `validate`, `setError`, …).
 *
 * Use this when you need full control over a field's rendering - it's the
 * public API for writing "custom field" components.
 *
 * @typeParam Schema - The form schema.
 * @typeParam K - Which field (must be a valid schema key).
 */
export type FieldController<
  Schema extends FormSchema,
  K extends keyof SchemaShape<Schema> & string = keyof SchemaShape<Schema> & string,
> = FieldControllerState<Schema, K> &
  FieldControllerTypeMetadata<SchemaShape<Schema>[K]> &
  FieldRenderHandlers<SchemaValues<Schema>[K]> & {
    /**
     * Whether the field is visible per the schema's `conditions` rules.
     * Hidden fields still hold a value but are excluded from the rendered tree.
     */
    visible: boolean;
    /** Imperatively set the field's value (triggers validation). */
    setValue: (value: SchemaValues<Schema>[K]) => void;
    /** Move focus to this field (if its handle supports it). */
    focus: () => void;
    /** Remove focus from this field (if its handle supports it). */
    blur: () => void;
    /** Run validation for just this field. Resolves to `true` when valid. */
    validate: () => Promise<boolean>;
    /** Manually set an error message - typically from a server response. */
    setError: (message: string) => void;
    /** Clear any error currently set on this field. */
    clearError: () => void;
    /**
     * Callback your custom renderer calls once with a ref-like focusable
     * handle. FormBridge uses it to drive focus programmatically.
     */
    registerFocusable: (target: FocusableFieldHandle | null) => void;
  };

// ─── useFormBridge return ───────────────────────────────────────────────────────

/**
 * The full object returned by `useFormBridge`. This is the public API surface
 * consumers interact with - every component, handler, and store accessor you
 * get from the hook lives here.
 *
 * @typeParam Schema - The form schema you passed in.
 * @typeParam TPlatform - Target platform, inferred from `useFormBridge.web` vs
 *   `useFormBridge.native`.
 */
export interface UseFormBridgeReturn<
  Schema extends FormSchema,
  TPlatform extends Platform = Platform,
> {
  /**
   * Optional provider for advanced composition.
   * Useful when form consumers live outside `<form.Form>` but still need
   * access to `watch()`, state, `fieldController()`, `submit()`, etc.
   *
   * @example <form.FormProvider><MySidebar /></form.FormProvider>
   */
  FormProvider: (props: { children: ReactNode }) => JSX.Element;

  /**
   * The smart Form component - renders a form wrapper bound to the hook's
   * state. Exposes `.Submit` as a nested component for a drop-in submit button.
   *
   * @example <form.Form onSubmit={handleSignUp}> ... </form.Form>
   */
  Form: FormComponent<Schema, TPlatform>;

  /**
   * Auto-rendered field components - one entry per schema key, picked by the
   * field's type.
   *
   * - On web: renders `<input>`, `<textarea>`, `<select>`, etc.
   * - On native: renders `<TextInput>`, `<Switch>`, `<Picker>`, etc.
   *
   * @example <form.fields.email />
   */
  fields: FieldComponents<Schema, TPlatform>;

  /**
   * Standalone error-message component.
   * Renders the validation error for a given field using the same visibility
   * rules as the auto-rendered fields (touched || submitted).
   *
   * @example <form.FieldError name="email" />
   */
  FieldError: FieldErrorComponent<Schema, TPlatform>;

  /**
   * Standalone label component.
   * Renders the label (+ required mark) for a given field from the schema.
   *
   * @example <form.FieldLabel name="email" />
   */
  FieldLabel: (props: FieldLabelProps<Schema, TPlatform>) => React.ReactElement | null;

  /**
   * Field-scoped controller exposing render props plus imperative actions
   * like change, blur, focus, validate, and manual error control.
   * See {@link FieldController}.
   */
  fieldController: <K extends keyof SchemaShape<Schema> & string>(
    name: K,
  ) => FieldController<Schema, K>;

  /** Current form state (reactive). See {@link FormState}. */
  state: FormState<Schema>;

  /**
   * Set a field value programmatically. Triggers validation for that field
   * and any fields whose rules depend on it.
   */
  setValue: <K extends keyof SchemaShape<Schema>>(
    name: K,
    value: SchemaValues<Schema>[K],
  ) => void;

  /** Get the current value of a single field. */
  getValue: <K extends keyof SchemaShape<Schema>>(name: K) => SchemaValues<Schema>[K];

  /** Get the full values map - same shape as `state.values`. */
  getValues: () => SchemaValues<Schema>;

  /**
   * Manually trigger validation for one, multiple, or all fields.
   * Returns `true` if every validated field is valid.
   *
   * @param names - Omit to validate everything; pass a key or array of keys
   *   to scope the run.
   */
  validate: (
    names?: keyof SchemaShape<Schema> | Array<keyof SchemaShape<Schema>>,
  ) => Promise<boolean>;

  /**
   * Reset fields to their default values. Pass a partial object to override
   * specific defaults (useful for "reset with last-submitted values").
   */
  resetFields: (values?: Partial<SchemaValues<Schema>>) => void;

  /**
   * Set a field error manually - typically called from an API error branch in
   * your `onSubmit` to surface server-side validation.
   */
  setError: (name: keyof SchemaShape<Schema>, message: string) => void;

  /**
   * Clear errors. Pass a key/array to scope the clear, or omit to wipe them all.
   */
  clearErrors: (
    name?: keyof SchemaShape<Schema> | Array<keyof SchemaShape<Schema>>,
  ) => void;

  /**
   * Subscribe to a reactive field value. The component calling `watch(name)`
   * re-renders whenever that field changes.
   */
  watch: <K extends keyof SchemaShape<Schema>>(name: K) => SchemaValues<Schema>[K];

  /**
   * Reactive version of `getValues` - the caller re-renders on *any* value
   * change. Use sparingly; prefer `watch(name)` when you only care about one
   * field.
   */
  watchAll: () => SchemaValues<Schema>;

  /**
   * Programmatic submit - same as pressing the submit button. Runs validation,
   * awaits `onSubmit`, and updates `status`/`submitError` accordingly.
   */
  submit: () => Promise<void>;

  /**
   * Current visibility / required / disabled state per field, derived from
   * the schema's `conditions` rules. Updated reactively as values change.
   */
  visibility: VisibilityMap;

  persistanceHelpers: {
    /**
     * Call this after a successful submission to delete the saved draft so the
     * form won't rehydrate stale data next time.
     */
    clearDraft: () => Promise<void>;

    /**
     * Force-save the current form values immediately (bypasses the debounced
     * autosave). Useful in wizard forms before navigating to the next step.
     */
    saveDraftNow: () => Promise<void>;

    /**
     * `true` while loading a saved draft from storage (async).
     * Show a loading indicator during this phase on React Native.
     */
    isLoadingDraft: boolean;

    /** `true` if a draft was found and restored on mount. */
    hasDraft: boolean;
  };
}

// ─── Form component type ────────────────────────────────────────────────────────

/**
 * Base props shared by every platform's `<Form>` component. Extended with
 * platform-specific style/className + native DOM/View passthrough props by
 * {@link FormProps}.
 *
 * @typeParam Schema - The form schema (typed `onSubmit`/`onError`).
 */
export interface BaseFormProps<Schema extends FormSchema> {
  /** The form body - typically a tree of `<form.fields.*>` and a `<form.Form.Submit>`. */
  children: ReactNode;
  /**
   * Called when the user submits and validation passes. Receives the fully
   * typed values map. Return a promise to put the form in `'submitting'`
   * state for the duration.
   */
  onSubmit: (values: SchemaValues<Schema>) => void | Promise<void>;
  /**
   * Called when the user submits but validation fails. Receives the current
   * errors map - useful for analytics or showing a banner.
   */
  onError?: (errors: Partial<Record<keyof SchemaShape<Schema>, string>>) => void;
  /**
   * Called when the `onSubmit` handler throws. Return a string to display it
   * as `state.submitError`; FormBridge shows a generic message otherwise.
   */
  onSubmitError?: (error: unknown) => string;
}

/**
 * Native `<form>` attributes passed through on web. Keys owned by FormBridge
 * (`children`, `onSubmit`, `style`, `className`) are stripped so the library
 * keeps control over them.
 *
 * Lets you set native form attributes like `id`, `name`, `autoComplete`,
 * `aria-*`, `target`, `method`, …
 */
export type WebFormNativeProps = Omit<
  FormHTMLAttributes<HTMLFormElement>,
  'children' | 'onSubmit' | 'style' | 'className'
>;

/**
 * Passthrough for `View` props on native. Kept as a loose index signature so
 * this shared types file stays decoupled from `react-native`.
 *
 * Consumers may pass any `ViewProps` (testID, accessibilityLabel,
 * pointerEvents, …).
 */
export interface NativeFormNativeProps {
  [key: string]: unknown;
}

/**
 * Props accepted by the {@link FormComponent} returned from `useFormBridge`.
 *
 * On top of {@link BaseFormProps}, this type layers on platform-specific
 * passthroughs so you can use the component exactly like a native `<form>`
 * (web) or `<View>` (native).
 *
 * @typeParam Schema - The form schema.
 * @typeParam TPlatform - `'web'` or `'native'`.
 */
export type FormProps<
  Schema extends FormSchema,
  TPlatform extends Platform = Platform,
> = BaseFormProps<Schema> &
  (TPlatform extends 'web'
    ? WebFormNativeProps & { className?: string }
    : NativeFormNativeProps) & {
    /** Inline style for the form wrapper. */
    style?: PlatformStyleValue<TPlatform>;
  };

/**
 * The smart Form component type. Callable like a regular React component and
 * carries a `Submit` static for the bundled submit button.
 *
 * @typeParam Schema - The form schema.
 * @typeParam TPlatform - `'web'` or `'native'`.
 */
export type FormComponent<
  Schema extends FormSchema,
  TPlatform extends Platform = Platform,
> = {
  (props: FormProps<Schema, TPlatform>): JSX.Element;
  /**
   * A submit button automatically disabled while `status` is
   * `'submitting'` / `'validating'`, with optional loading text swap.
   */
  Submit: SubmitButtonComponent<TPlatform>;
};

/**
 * Native `<button>` attributes passed through on web. Keys owned by FormBridge
 * (`children`, `style`) are stripped so the library keeps control over them.
 *
 * Lets you set native button attributes like `type`, `form`, `name`, `value`,
 * `formAction`, `aria-*`, …
 */
export type WebSubmitNativeProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'style'
>;

/**
 * Passthrough for `TouchableOpacity` props on native. Kept as a loose index
 * signature so this shared types file stays decoupled from `react-native`.
 *
 * Consumers may pass any `TouchableOpacityProps` (testID, accessibilityLabel,
 * hitSlop, activeOpacity, …). `disabled` is typed explicitly because
 * FormBridge also reads it.
 */
export interface NativeSubmitNativeProps {
  /** Manual disable flag - combined with the automatic in-flight disable. */
  disabled?: boolean;
  [key: string]: unknown;
}

/**
 * Props accepted by the `Form.Submit` button.
 *
 * On top of the base slot props (`children`, `loadingText`, `style`), this
 * type layers on platform-specific passthroughs so the component behaves like
 * a native `<button>` (web) or `<TouchableOpacity>` (native).
 *
 * @typeParam TPlatform - `'web'` or `'native'`.
 */
export type SubmitButtonProps<TPlatform extends Platform = Platform> = {
  /** Button label. Defaults to `'Submit'` when omitted. */
  children?: ReactNode;
  /** Inline style for the wrapper button. */
  style?: PlatformStyleValue<TPlatform>;
  /** Label shown while the form is submitting/validating (defaults to `'Please wait…'`). */
  loadingText?: ReactNode;
  /** Container style - native only (wraps the button visual). */
  containerStyle?: TPlatform extends 'native' ? NativeStyleValue : never;
  /** Text style applied to the label - native only. */
  textStyle?: TPlatform extends 'native' ? NativeStyleValue : never;
  /** Loading indicator color - native only. */
  indicatorColor?: TPlatform extends 'native' ? string : never;
} & (TPlatform extends 'web' ? WebSubmitNativeProps : NativeSubmitNativeProps);

/**
 * The component type returned as `Form.Submit`. Always resolves to a valid
 * element - there is no null branch.
 */
export type SubmitButtonComponent<TPlatform extends Platform = Platform> = (
  props: SubmitButtonProps<TPlatform>,
) => JSX.Element;
