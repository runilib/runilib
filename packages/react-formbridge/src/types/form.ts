import type { ReactNode } from 'react';

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
  SchemaValues,
} from './schema';
import type { FieldComponents } from './ui';

// ─── Standalone FieldError component ─────────────────────────────────────────
export type FieldErrorProps<
  Schema extends FormSchema,
  TPlatform extends Platform = Platform,
> = {
  /** The field name to show the error for. */
  name: keyof Schema & string;
  /** Custom render function — called only when there is an error to show. */
  render?: (ctx: { name: string; error: string }) => ReactNode;
} & (TPlatform extends 'web' ? { className?: string } : EmptyProps) & {
    style?: PlatformStyleValue<TPlatform>;
  };

export type FieldErrorComponent<
  Schema extends FormSchema,
  TPlatform extends Platform = Platform,
> = (props: FieldErrorProps<Schema, TPlatform>) => React.ReactElement | null;

// ─── Standalone Label component ────────────────────────────────────────────────

export type FieldLabelProps<
  Schema extends FormSchema,
  TPlatform extends Platform = Platform,
> = {
  /** The field name to show the label for. */
  name: keyof Schema & string;
  /** Override the label text from the schema. */
  children?: ReactNode;
  /** Custom render function. */
  render?: (ctx: {
    name: string;
    label: string;
    required: boolean;
    htmlFor: string;
  }) => ReactNode;
  /** Custom required-mark renderer. */
  renderRequiredMark?: () => ReactNode;
} & (TPlatform extends 'web' ? { className?: string; htmlFor?: string } : EmptyProps) & {
    style?: PlatformStyleValue<TPlatform>;
  };

export interface FocusableFieldHandle {
  focus?: () => void;
  blur?: () => void;
}

type FieldControllerTypeMetadata<TEntry> =
  ResolvedFieldDescriptor<TEntry> extends { _type: 'select' | 'radio' }
    ? { options?: SelectOption[] }
    : ResolvedFieldDescriptor<TEntry> extends { _type: 'otp' }
      ? { otpLength?: number }
      : Record<never, never>;

type FieldControllerState<
  Schema extends FormSchema,
  K extends keyof Schema & string = keyof Schema & string,
> = Omit<FieldRenderState<SchemaValues<Schema>[K]>, 'name' | 'options' | 'otpLength'> & {
  name: K;
};

export type FieldController<
  Schema extends FormSchema,
  K extends keyof Schema & string = keyof Schema & string,
> = FieldControllerState<Schema, K> &
  FieldControllerTypeMetadata<Schema[K]> &
  FieldRenderHandlers<SchemaValues<Schema>[K]> & {
    visible: boolean;
    setValue: (value: SchemaValues<Schema>[K]) => void;
    focus: () => void;
    blur: () => void;
    validate: () => Promise<boolean>;
    setError: (message: string) => void;
    clearError: () => void;
    registerFocusable: (target: FocusableFieldHandle | null) => void;
  };

// ─── useFormBridge return ───────────────────────────────────────────────────────

export interface UseFormBridgeReturn<
  Schema extends FormSchema,
  TPlatform extends Platform = Platform,
> {
  /**
   * The smart Form component — renders a form wrapper.
   * @example <form.Form onSubmit={handleSignUp}> ... <.Form>
   */
  Form: FormComponent<Schema, TPlatform>;

  /**
   * Auto-rendered field components — one per schema key.
   * On web: renders <input>, <textarea>, <select>, etc.
   * On native: renders <TextInput>, <Switch>, <Picker>, etc.
   * @example <form.fields.email />
   */
  fields: FieldComponents<Schema, TPlatform>;

  /**
   * Standalone error-message component.
   * Renders the validation error for a given field using the same
   * visibility rules as the auto-rendered fields (touched || submitted).
   * @example <form.ErrorMessage name="email" />
   */
  FieldError: FieldErrorComponent<Schema, TPlatform>;

  /**
   * Standalone label component.
   * Renders the label (+ required mark) for a given field from the schema.
   * @example <form.Label name="email" />
   */
  FieldLabel: (props: FieldLabelProps<Schema, TPlatform>) => React.ReactElement | null;

  /**
   * Field-scoped controller exposing render props plus imperative actions
   * like change, blur, focus, validate, and manual error control.
   */
  fieldController: <K extends keyof Schema & string>(
    name: K,
  ) => FieldController<Schema, K>;

  /**
   * Current form state (reactive).
   */
  state: FormState<Schema>;

  /**
   * Set a field value programmatically.
   */
  setValue: <K extends keyof Schema>(name: K, value: SchemaValues<Schema>[K]) => void;

  /**
   * Get the current value of a field.
   */
  getValue: <K extends keyof Schema>(name: K) => SchemaValues<Schema>[K];

  /**
   * Get all current values.
   */
  getValues: () => SchemaValues<Schema>;

  /**
   * Manually trigger validation for one, multiple, or all fields.
   * Returns true if all validated fields are valid.
   */
  validate: (names?: keyof Schema | Array<keyof Schema>) => Promise<boolean>;

  /**
   * Reset to default values (or provided values).
   */
  reset: (values?: Partial<SchemaValues<Schema>>) => void;

  /**
   * Set a field error manually (e.g., from an API response).
   */
  setError: (name: keyof Schema, message: string) => void;

  /**
   * Clear errors for one or all fields.
   */
  clearErrors: (name?: keyof Schema | Array<keyof Schema>) => void;

  /**
   * Watch a reactive field value.
   */
  watch: <K extends keyof Schema>(name: K) => SchemaValues<Schema>[K];

  watchAll: () => SchemaValues<Schema>;

  /**
   * Programmatic submit — same as pressing the submit button.
   */
  submit: () => Promise<void>;

  /**
   * Current visibility / required / disabled state per field.
   * Updated reactively whenever values change.
   */
  visibility: VisibilityMap;

  /**
   * True while loading a saved draft from storage (async).
   * Show a loading indicator during this phase on React Native.
   */
  isLoadingDraft: boolean;

  /**
   * True if a draft was found and restored on mount.
   */
  hasDraft: boolean;

  /**
   * Call this after successful submission to delete the saved draft.
   */
  clearDraft: () => Promise<void>;

  /**
   * Force-save the current form values immediately (bypasses debounce).
   * Useful in wizard forms before navigating to the next step.
   */
  saveDraftNow: () => Promise<void>;
}

// ─── Form component type ────────────────────────────────────────────────────────

export interface BaseFormProps<Schema extends FormSchema> {
  children: ReactNode;
  onSubmit: (values: SchemaValues<Schema>) => void | Promise<void>;
  onError?: (errors: Partial<Record<keyof Schema, string>>) => void;
  /** Called when submission throws — message shown as submitError */
  onSubmitError?: (error: unknown) => string;
}

export type FormProps<
  Schema extends FormSchema,
  TPlatform extends Platform = Platform,
> = BaseFormProps<Schema> &
  (TPlatform extends 'web' ? { className?: string } : EmptyProps) & {
    style?: PlatformStyleValue<TPlatform>;
  };

export type FormComponent<
  Schema extends FormSchema,
  TPlatform extends Platform = Platform,
> = {
  (props: FormProps<Schema, TPlatform>): JSX.Element;
  /** A submit button that is automatically disabled + shows loading state */
  Submit: SubmitButtonComponent<TPlatform>;
};

export type SubmitButtonProps<TPlatform extends Platform = Platform> = {
  children?: ReactNode;
  style?: PlatformStyleValue<TPlatform>;
  loadingText?: string;
  disabled?: boolean;
  containerStyle?: TPlatform extends 'native' ? NativeStyleValue : never;
  textStyle?: TPlatform extends 'native' ? NativeStyleValue : never;
  indicatorColor?: TPlatform extends 'native' ? string : never;
} & (TPlatform extends 'web' ? { className?: string } : EmptyProps);

export type SubmitButtonComponent<TPlatform extends Platform = Platform> = (
  props: SubmitButtonProps<TPlatform>,
) => JSX.Element;
