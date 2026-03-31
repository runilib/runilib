import type {
  ButtonHTMLAttributes,
  CSSProperties,
  FormHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';

import type { VisibilityMap } from './core/conditions/conditions';
import type { PersistOptions } from './core/persist/draft';
import type { AsyncOptionsConfig } from './hooks/shared/useAsyncOptions';
import type { AnalyticsOptions } from './hooks/shared/useFormBridgeAnalytics';

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
  | 'file'
  | 'phone'
  | 'custom';

// ─── Form state machine ────────────────────────────────────────────────────────

export type FormStatus = 'idle' | 'validating' | 'submitting' | 'success' | 'error';

// ─── Validation ────────────────────────────────────────────────────────────────
export type SyncValidator<V = unknown> = (
  value: V,
  allValues: Record<string, unknown>,
) => string | null;
export type AsyncValidator<V = unknown> = (
  value: V,
  allValues: Record<string, unknown>,
) => Promise<string | null>;
export type Validator<V = unknown> = SyncValidator<V> | AsyncValidator<V>;

export type NativeStyleValue =
  | Record<string, unknown>
  | number
  | Array<NativeStyleValue | null | undefined>;

export type FieldStyleValue = React.CSSProperties | NativeStyleValue;

export interface FieldAppearanceConfig {
  id?: string;
  testID?: string;
  readOnly?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  spellCheck?: boolean;
  inputMode?:
    | 'none'
    | 'text'
    | 'tel'
    | 'url'
    | 'email'
    | 'numeric'
    | 'decimal'
    | 'search';
  enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';
  keyboardType?: string;
  secureTextEntry?: boolean;
  rootClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  rootStyle?: FieldStyleValue;
  labelStyle?: FieldStyleValue;
  inputStyle?: FieldStyleValue;
  hintStyle?: FieldStyleValue;
  errorStyle?: FieldStyleValue;
  highlightOnError?: boolean;
  renderPicker?: (ctx: SelectPickerRenderContext) => ReactNode;
}

export interface FieldDescriptor<V = unknown> {
  /** Internal type used to pick the right renderer */
  _type: FieldType;
  /** Human-readable label */
  _label: string;
  /** Placeholder text */
  _placeholder?: string;
  /** Default value */
  _defaultValue: V;
  /** Is the field required */
  _required: boolean;
  /** Required error message */
  _requiredMsg: string;
  /** Min (string length or number) */
  _min?: number;
  _minMsg?: string;
  /** Max (string length or number) */
  _max?: number;
  _maxMsg?: string;
  /** Primary regex pattern */
  _pattern?: RegExp;
  _patternMsg?: string;
  /** Accepted regex alternatives. When multiple are defined, matching any one is enough. */
  _patterns?: RegExp[];
  _patternsMsg?: string;
  /** Options for select / radio */
  _options?: SelectOption[];
  /** OTP length */
  _otpLength?: number;
  /** Password strength enforcement */
  _strongPassword?: boolean;
  /** Trim value before validation */
  _trim: boolean;
  /** Disable the field */
  _disabled: boolean;
  /** Hide the field */
  _hidden: boolean;
  /** Debounce ms for async validators */
  _debounce: number;
  /** Custom sync/async validators */
  _validators: Validator<V>[];
  /** Transform before storing (e.g., toUpperCase) */
  _transform?: (v: V) => V;
  /** Cross-field dependency name for validation */
  _matchField?: string;
  /** Custom renderer (overrides platform renderer) */
  _customRender?: (props: FieldRenderProps<V>) => ReactNode;
  /** Helper text shown below the field */
  _hint?: string;
  /** Max file size for file fields */
  _maxFileSize?: number;
  /** Accepted file types */
  _accept?: string[];

  /** Cross-platform field-owned appearance defaults shared by web and native */
  _appearance?: FieldAppearanceConfig;

  _asyncOptions?: AsyncOptionsConfig<any>;

  _searchable?: boolean;
}

export interface ISelectOption {
  label: string;
  value: string | number;
}

export type SelectOption = ISelectOption & Record<string, unknown>;

export interface SelectPickerRenderContext {
  platform: 'web' | 'native';
  fieldType: 'select' | 'radio';
  open: boolean;
  label: ReactNode;
  placeholder?: string;
  required: boolean;
  disabled: boolean;
  searchable: boolean;
  loading: boolean;
  error: string | null;
  search: string;
  options: SelectOption[];
  selectedOption: SelectOption | null;
  selectedValue: SelectOption['value'] | null;
  triggerLabel: string;
  openPicker: () => void;
  closePicker: () => void;
  setSearch: (value: string) => void;
  clearSearch: () => void;
  selectOption: (option: SelectOption | SelectOption['value']) => void;
}

// ─── Per-field runtime state ───────────────────────────────────────────────────

export interface FieldState<V = unknown> {
  value: V;
  error: string | null;
  touched: boolean;
  dirty: boolean;
  validating: boolean;
}

// ─── Form state (what the user gets) ─────────────────────────────────────────

export interface FormState<Schema extends FormSchema> {
  values: SchemaValues<Schema>;
  errors: Partial<Record<keyof Schema, string>>;
  touched: Partial<Record<keyof Schema, boolean>>;
  dirty: Partial<Record<keyof Schema, boolean>>;
  status: FormStatus;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  isSuccess: boolean;
  isError: boolean;
  submitCount: number;
  /** Error returned by onSubmit (e.g., API error) */
  submitError: string | null;
}

// ─── Schema = map of field descriptors ────────────────────────────────────────
export type FormSchema = Record<
  string,
  FieldDescriptor<any> | { _build(): FieldDescriptor<any> }
>;

/** Extract the value type of a FieldDescriptor */

/** Extract the values object type from a schema */

type InferFieldValue<T> = T extends { _build(): FieldDescriptor<infer V> }
  ? V
  : T extends FieldDescriptor<infer V>
    ? V
    : never;

export type SchemaValues<S extends FormSchema> = {
  [K in keyof S]: InferFieldValue<S[K]>;
};

// ─── Props passed to each rendered field ─────────────────────────────────────

export interface FieldRenderProps<V = unknown> {
  name: string;
  value: V;
  label: string;
  placeholder?: string;
  error: string | null;
  touched: boolean;
  dirty: boolean;
  validating: boolean;
  disabled: boolean;
  hint?: string;
  options?: SelectOption[];
  otpLength?: number;
  onChange: (value: V) => void;
  onBlur: () => void;
  onFocus: () => void;
  allValues: Record<string, unknown>;
}

// ─── useForm return ────────────────────────────────────────────────────────────

export interface UseFormBridgeReturn<Schema extends FormSchema> {
  /**
   * The smart Form component — renders a form wrapper.
   * @example <form.Form onSubmit={handleSignUp}> ... <.Form>
   */
  Form: FormComponent<Schema>;
  // Form: FormComponent<S>;

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

// ─── Form component type ─────────────────────────────────────────────────────

export interface FormProps<Schema extends FormSchema> {
  children: ReactNode;
  onSubmit: (values: SchemaValues<Schema>) => void | Promise<void>;
  onError?: (errors: Partial<Record<keyof Schema, string>>) => void;
  /** Called when submission throws — message shown as submitError */
  onSubmitError?: (error: unknown) => string;

  // Only on web
  className?: string;
  style?: FieldStyleValue;
}

export type FormComponent<Schema extends FormSchema> = {
  (props: FormProps<Schema>): JSX.Element;
  /** A submit button that is automatically disabled + shows loading state */
  Submit: SubmitButtonComponent;
};

export interface SubmitButtonProps {
  children?: ReactNode;
  className?: string;
  style?: FieldStyleValue;
  loadingText?: string;
  disabled?: boolean;
}
export type SubmitButtonComponent = (props: SubmitButtonProps) => JSX.Element;

// ─── Field components map ─────────────────────────────────────────────────────

export type FieldComponent = (props?: ExtraFieldProps) => React.ReactElement | null;

export type FieldComponents<S extends FormSchema> = {
  [K in keyof S]: FieldComponent;
};

export type WebFieldSlot =
  | 'root'
  | 'label'
  | 'input'
  | 'textarea'
  | 'select'
  | 'hint'
  | 'error'
  | 'checkboxRow'
  | 'checkboxInput'
  | 'checkboxLabel'
  | 'switchRoot'
  | 'switchTrack'
  | 'switchThumb'
  | 'otpContainer'
  | 'otpInput';

export interface WebFieldUiOverrides {
  id?: string;
  hideLabel?: boolean;
  /** When false, the default red field chrome is suppressed while the error message still renders. */
  highlightOnError?: boolean;

  classNames?: Partial<Record<WebFieldSlot, string>> & Record<string, string | undefined>;
  styles?: Partial<Record<WebFieldSlot, CSSProperties>> &
    Record<string, CSSProperties | undefined>;

  rootProps?: HTMLAttributes<HTMLDivElement>;
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  textareaProps?: TextareaHTMLAttributes<HTMLTextAreaElement>;
  selectProps?: SelectHTMLAttributes<HTMLSelectElement>;
  hintProps?: HTMLAttributes<HTMLSpanElement>;
  errorProps?: HTMLAttributes<HTMLSpanElement>;

  renderLabel?: (ctx: {
    id: string;
    label: React.ReactNode;
    required: boolean;
  }) => React.ReactNode;

  renderHint?: (ctx: { id: string; hint: React.ReactNode }) => React.ReactNode;

  renderError?: (ctx: { id: string; error: React.ReactNode }) => React.ReactNode;

  renderRequiredMark?: () => React.ReactNode;

  renderPicker?: (ctx: SelectPickerRenderContext) => React.ReactNode;
}

export type NativeFieldSlot =
  | 'root'
  | 'label'
  | 'input'
  | 'error'
  | 'hint'
  | 'requiredMark';

export interface NativeFieldUiOverrides {
  id?: string;
  hideLabel?: boolean;
  /** When false, the default red field chrome is suppressed while the error message still renders. */
  highlightOnError?: boolean;

  styles?: Partial<Record<NativeFieldSlot, NativeStyleValue>> &
    Record<string, NativeStyleValue | undefined>;

  rootProps?: Record<string, unknown>;
  labelProps?: Record<string, unknown>;
  inputProps?: Record<string, unknown>;
  hintProps?: Record<string, unknown>;
  errorProps?: Record<string, unknown>;

  renderLabel?: (ctx: {
    id: string;
    label: React.ReactNode;
    required: boolean;
  }) => React.ReactNode;

  renderHint?: (ctx: { id: string; hint: React.ReactNode }) => React.ReactNode;

  renderError?: (ctx: { id: string; error: React.ReactNode }) => React.ReactNode;

  renderRequiredMark?: () => React.ReactNode;

  renderPicker?: (ctx: SelectPickerRenderContext) => React.ReactNode;
}

export type FieldAppearanceOverrides = WebFieldUiOverrides | NativeFieldUiOverrides;

export interface FieldStyleProps {
  /** Forwarded to the field root on platforms that support it. */
  className?: string;
  /** Forwarded to the field root. */
  style?: FieldStyleValue;
  /** Cross-platform local field appearance override. */
  appearance?: FieldAppearanceOverrides;
}

export interface ExtraFieldProps extends FieldStyleProps {
  /** Override the label defined in the schema */
  label?: string;
  /** Override placeholder */
  placeholder?: string;
  /** Override hint */
  hint?: string;
}

export interface FieldTheme extends Pick<FieldStyleProps, 'className' | 'style'> {
  appearance?: FieldAppearanceOverrides;
}

export interface WebFormUiOverrides {
  className?: string;
  style?: FieldStyleValue;
  props?: Omit<
    FormHTMLAttributes<HTMLFormElement>,
    'children' | 'onSubmit' | 'className' | 'style'
  >;
}

export interface WebSubmitUiOverrides {
  className?: string;
  style?: FieldStyleValue;
  loadingText?: string;
  props?: Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'children' | 'type' | 'disabled' | 'className' | 'style'
  >;
}

export interface NativeFormUiOverrides {
  style?: NativeStyleValue;
  props?: Record<string, unknown>;
}

export interface NativeSubmitUiOverrides {
  style?: NativeStyleValue;
  containerStyle?: NativeStyleValue;
  textStyle?: NativeStyleValue;
  indicatorColor?: string;
  loadingText?: string;
  props?: Record<string, unknown>;
  contentProps?: Record<string, unknown>;
}

export type FormUiOverrides = WebFormUiOverrides | NativeFormUiOverrides;

export type SubmitUiOverrides = WebSubmitUiOverrides | NativeSubmitUiOverrides;

export interface FormBridgeUiOptions {
  field?: FieldTheme;
  form?: FormUiOverrides;
  submit?: SubmitUiOverrides;
}

// ─── useForm options ──────────────────────────────────────────────────────────
export type ValidationTrigger = 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched';

export interface UseFormOptions<S extends FormSchema> {
  /**
   * When validation runs:
   * - `onBlur`   (default) — after field loses focus
   * - `onChange` — on every keystroke
   * - `onSubmit` — only on submit
   * - `onTouched` — after blur, then on every change
   */
  validateOn?: ValidationTrigger;
  /**
   * After first submission, when to re-validate.
   * Defaults to `'onChange'`.
   */
  revalidateOn?: ValidationTrigger;
  /**
   * Schema-level resolver (Zod, Yup, Joi, Valibot).
   * When provided, field-level validators are bypassed.
   */
  resolver?: SchemaResolver;
  /**
   * Show field errors inline immediately without user interaction.
   */
  showErrorsOn?: 'submit' | 'always';

  /**
   * Enable automatic draft persistence.
   * The form values are saved to storage on every change and restored on mount.
   *
   * @example
   * useForm(schema, {
   *   persist: {
   *     key:     'signup-form',
   *     storage: 'local',          // 'local' | 'session' | 'async' | CustomAdapter
   *     ttl:     3600,             // seconds before draft expires (0 = no expiry)
   *     exclude: ['password', 'confirm', 'cvv'],  // never persisted
   *     debounce: 800,             // ms before writing to storage
   *     version: '2',             // bump to invalidate old drafts
   *   }
   * })
   */
  persist?: PersistOptions;

  /**
   * Changes the internal form instance identity.
   * Useful for wizards / multi-step forms.
   */
  formKey?: string;

  /**
   * Initial values applied when the form is created or when formKey changes.
   */
  initialValues?: Partial<SchemaValues<S>>;

  analytics?: AnalyticsOptions;

  /**
   * Global UI layer applied to every rendered field, form wrapper, and submit button.
   * Local field props still win over these defaults.
   */
  globalAppearance?: FormBridgeUiOptions;
}

// ─── Resolver ────────────────────────────────────────────────────────────────

export interface ResolverResult {
  values: Record<string, unknown>;
  errors: Record<string, string>;
}

export type SchemaResolver = (values: Record<string, unknown>) => Promise<ResolverResult>;

export interface OptionsFetcherContext {
  search: string;
  deps: Record<string, unknown>;
  signal: AbortSignal;
}

export type OptionsFetcher = (context: OptionsFetcherContext) => Promise<SelectOption[]>;
