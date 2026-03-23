import type { ReactNode, ComponentType } from 'react';

// ─── Field types ───────────────────────────────────────────────────────────────

export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'textarea'
  | 'checkbox'
  | 'switch'
  | 'select'
  | 'radio'
  | 'date'
  | 'otp'
  | 'custom';

// ─── Form state machine ────────────────────────────────────────────────────────

export type FormStatus = 'idle' | 'validating' | 'submitting' | 'success' | 'error';

// ─── Validation ────────────────────────────────────────────────────────────────

export type SyncValidator<V = unknown>  = (value: V, allValues: Record<string, unknown>) => string | null;
export type AsyncValidator<V = unknown> = (value: V, allValues: Record<string, unknown>) => Promise<string | null>;
export type Validator<V = unknown>      = SyncValidator<V> | AsyncValidator<V>;

// ─── Field descriptor (created by field.xxx()) ────────────────────────────────

export interface FieldDescriptor<V = unknown> {
  /** Internal type used to pick the right renderer */
  _type:          FieldType;
  /** Human-readable label */
  _label:         string;
  /** Placeholder text */
  _placeholder?:  string;
  /** Default value */
  _defaultValue:  V;
  /** Is the field required */
  _required:      boolean;
  /** Required error message */
  _requiredMsg:   string;
  /** Min (string length or number) */
  _min?:          number;
  _minMsg?:       string;
  /** Max (string length or number) */
  _max?:          number;
  _maxMsg?:       string;
  /** Regex pattern */
  _pattern?:      RegExp;
  _patternMsg?:   string;
  /** Options for select / radio */
  _options?:      SelectOption[];
  /** OTP length */
  _otpLength?:    number;
  /** Password strength enforcement */
  _strongPassword?: boolean;
  /** Trim value before validation */
  _trim:          boolean;
  /** Disable the field */
  _disabled:      boolean;
  /** Hide the field */
  _hidden:        boolean;
  /** Debounce ms for async validators */
  _debounce:      number;
  /** Custom sync/async validators */
  _validators:    Validator<V>[];
  /** Transform before storing (e.g., toUpperCase) */
  _transform?:    (v: V) => V;
  /** Cross-field dependency name for validation */
  _matchField?:   string;
  /** Custom renderer (overrides platform renderer) */
  _customRender?: (props: FieldRenderProps<V>) => ReactNode;
  /** Helper text shown below the field */
  _hint?:         string;
  /** Max file size for file fields */
  _maxFileSize?:  number;
  /** Accepted file types */
  _accept?:       string[];
}

export interface SelectOption {
  label: string;
  value: string | number;
}

// ─── Per-field runtime state ───────────────────────────────────────────────────

export interface FieldState<V = unknown> {
  value:      V;
  error:      string | null;
  touched:    boolean;
  dirty:      boolean;
  validating: boolean;
}

// ─── Form state (what the user gets) ─────────────────────────────────────────

export interface FormState<Schema extends FormSchema> {
  values:       SchemaValues<Schema>;
  errors:       Partial<Record<keyof Schema, string>>;
  touched:      Partial<Record<keyof Schema, boolean>>;
  dirty:        Partial<Record<keyof Schema, boolean>>;
  status:       FormStatus;
  isValid:      boolean;
  isDirty:      boolean;
  isSubmitting: boolean;
  isSuccess:    boolean;
  isError:      boolean;
  submitCount:  number;
  /** Error returned by onSubmit (e.g., API error) */
  submitError:  string | null;
}

// ─── Schema = map of field descriptors ────────────────────────────────────────

export type FormSchema = Record<string, FieldDescriptor<any>>;

/** Extract the value type of a FieldDescriptor */
type FieldValue<D> = D extends FieldDescriptor<infer V> ? V : never;

/** Extract the values object type from a schema */
export type SchemaValues<S extends FormSchema> = {
  [K in keyof S]: FieldValue<S[K]>;
};

// ─── Props passed to each rendered field ─────────────────────────────────────

export interface FieldRenderProps<V = unknown> {
  name:         string;
  value:        V;
  label:        string;
  placeholder?: string;
  error:        string | null;
  touched:      boolean;
  dirty:        boolean;
  validating:   boolean;
  disabled:     boolean;
  hint?:        string;
  options?:     SelectOption[];
  otpLength?:   number;
  onChange:     (value: V) => void;
  onBlur:       () => void;
  onFocus:      () => void;
}

// ─── useForm return ────────────────────────────────────────────────────────────

export interface UseFormReturn<Schema extends FormSchema> {
  /**
   * The smart Form component — renders a form wrapper.
   * @example <form.Form onSubmit={handleSignUp}> ... </form.Form>
   */
  Form: FormComponent<Schema>;

  /**
   * Auto-rendered field components — one per schema key.
   * On web: renders <input>, <textarea>, <select>, etc.
   * On native: renders <TextInput>, <Switch>, <Picker>, etc.
   * @example <form.fields.email />
   */
  fields: FieldComponents<Schema>;

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

  /**
   * Programmatic submit — same as pressing the submit button.
   */
  submit: () => Promise<void>;
}

// ─── Form component type ─────────────────────────────────────────────────────

export interface FormProps<Schema extends FormSchema> {
  children:        ReactNode;
  onSubmit:        (values: SchemaValues<Schema>) => void | Promise<void>;
  onError?:        (errors: Partial<Record<keyof Schema, string>>) => void;
  /** Called when submission throws — message shown as submitError */
  onSubmitError?:  (error: unknown) => string;
  className?:      string;
  style?:          object;
}

export type FormComponent<Schema extends FormSchema> = {
  (props: FormProps<Schema>): JSX.Element;
  /** A submit button that is automatically disabled + shows loading state */
  Submit: SubmitButtonComponent;
};

export interface SubmitButtonProps {
  children?:   ReactNode;
  className?:  string;
  style?:      object;
  loadingText?: string;
  disabled?:   boolean;
}
export type SubmitButtonComponent = (props: SubmitButtonProps) => JSX.Element;

// ─── Field components map ─────────────────────────────────────────────────────

export type FieldComponents<Schema extends FormSchema> = {
  [K in keyof Schema]: FieldComponent<FieldValue<Schema[K]>>;
};

export interface ExtraFieldProps {
  /** Override the label defined in the schema */
  label?:       string;
  /** Override placeholder */
  placeholder?: string;
  /** Override hint */
  hint?:        string;
  /** Additional class (web only) */
  className?:   string;
  /** Additional style */
  style?:       object;
}
export type FieldComponent<V = unknown> = (props?: ExtraFieldProps) => JSX.Element;

// ─── useForm options ──────────────────────────────────────────────────────────

export type ValidationTrigger = 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched';

export interface UseFormOptions {
  /**
   * When validation runs:
   * - `onBlur`   (default) — after field loses focus
   * - `onChange` — on every keystroke
   * - `onSubmit` — only on submit
   * - `onTouched` — after blur, then on every change
   */
  validateOn?:     ValidationTrigger;
  /**
   * After first submission, when to re-validate.
   * Defaults to `'onChange'`.
   */
  revalidateOn?:   ValidationTrigger;
  /**
   * Schema-level resolver (Zod, Yup, Joi, Valibot).
   * When provided, field-level validators are bypassed.
   */
  resolver?:       SchemaResolver;
  /**
   * Show field errors inline immediately without user interaction.
   */
  showErrorsOn?:   'submit' | 'always';
}

// ─── Resolver ────────────────────────────────────────────────────────────────

export interface ResolverResult {
  values: Record<string, unknown>;
  errors: Record<string, string>;
}

export type SchemaResolver = (values: Record<string, unknown>) => Promise<ResolverResult>;
