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
import type { FileValue } from './core/field-builders/file/types';
import type { PersistOptions } from './core/persist/draft';
import type { AsyncOptionsConfig } from './hooks/shared/useAsyncOptions';
import type { AnalyticsOptions } from './hooks/shared/useFormAnalytics';

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

export type Platform = 'web' | 'native';
type EmptyProps = Record<never, never>;

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

export interface FieldBehaviorConfig {
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
  highlightOnError?: boolean;
  renderPicker?: (ctx: SelectPickerRenderContext) => ReactNode;
}

export interface FieldDescriptor<V = unknown, TType extends FieldType = FieldType> {
  /** Internal type used to pick the right renderer */
  _type: TType;
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

  /** Cross-platform field-owned behavior defaults shared by web and native */
  _behavior?: FieldBehaviorConfig;

  _asyncOptions?: AsyncOptionsConfig<Record<string, unknown>>;

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
export type FormSchemaEntry = { _type: FieldType } | { _build(): { _type: FieldType } };

export type FormSchema = Record<string, FormSchemaEntry>;

/** Extract the value type of a FieldDescriptor */

/** Extract the values object type from a schema */

export type ResolvedFieldDescriptor<T> = T extends { _build(): infer TField }
  ? TField extends FieldDescriptor<infer TValue, infer TType>
    ? FieldDescriptor<TValue, TType>
    : never
  : T extends FieldDescriptor<infer TValue, infer TType>
    ? FieldDescriptor<TValue, TType>
    : never;

export type SchemaFieldType<T> =
  ResolvedFieldDescriptor<T> extends FieldDescriptor<infer _TValue, infer TType>
    ? TType
    : T extends FormSchemaEntry
      ? FieldType
      : never;

type InferFieldValue<T> = T extends { _build(): FieldDescriptor<infer V, FieldType> }
  ? V
  : T extends FieldDescriptor<infer V, FieldType>
    ? V
    : T extends FormSchemaEntry
      ? unknown
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

export interface UseFormBridgeReturn<
  Schema extends FormSchema,
  TPlatform extends Platform = Platform,
> {
  /**
   * The smart Form component — renders a form wrapper.
   * @example <form.Form onSubmit={handleSignUp}> ... <.Form>
   */
  Form: FormComponent<Schema, TPlatform>;
  // Form: FormComponent<S>;

  /**
   * Auto-rendered field components — one per schema key.
   * On web: renders <input>, <textarea>, <select>, etc.
   * On native: renders <TextInput>, <Switch>, <Picker>, etc.
   * @example <form.fields.email />
   */
  fields: FieldComponents<Schema, TPlatform>;

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

export interface BaseFormProps<Schema extends FormSchema> {
  children: ReactNode;
  onSubmit: (values: SchemaValues<Schema>) => void | Promise<void>;
  onError?: (errors: Partial<Record<keyof Schema, string>>) => void;
  /** Called when submission throws — message shown as submitError */
  onSubmitError?: (error: unknown) => string;
}

export type PlatformStyleValue<TPlatform extends Platform = Platform> =
  TPlatform extends 'web' ? CSSProperties : NativeStyleValue;

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

// ─── Field components map ─────────────────────────────────────────────────────

type WebClassNames<TSlots extends string> = Partial<Record<TSlots, string>> &
  Record<string, string | undefined>;
type WebStyles<TSlots extends string> = Partial<Record<TSlots, CSSProperties>> &
  Record<string, CSSProperties | undefined>;
type NativeStyles<TSlots extends string> = Partial<Record<TSlots, NativeStyleValue>> &
  Record<string, NativeStyleValue | undefined>;

type FieldUiRenderers = {
  renderLabel?: (ctx: {
    id: string;
    label: React.ReactNode;
    required: boolean;
  }) => React.ReactNode;
  renderHint?: (ctx: { id: string; hint: React.ReactNode }) => React.ReactNode;
  renderError?: (ctx: { id: string; error: React.ReactNode }) => React.ReactNode;
  renderRequiredMark?: () => React.ReactNode;
};

type WebFieldUiBase<TSlots extends string> = FieldUiRenderers & {
  id?: string;
  hideLabel?: boolean;
  /** When false, the default red field chrome is suppressed while the error message still renders. */
  highlightOnError?: boolean;
  classNames?: WebClassNames<TSlots>;
  styles?: WebStyles<TSlots>;
  rootProps?: HTMLAttributes<HTMLDivElement>;
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>;
  hintProps?: HTMLAttributes<HTMLSpanElement>;
  errorProps?: HTMLAttributes<HTMLSpanElement>;
};

type WebInputBehaviorUi = {
  readOnly?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  spellCheck?: boolean;
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode'];
  enterKeyHint?: InputHTMLAttributes<HTMLInputElement>['enterKeyHint'];
};

type NativeFieldUiBase<TSlots extends string> = FieldUiRenderers & {
  id?: string;
  testID?: string;
  hideLabel?: boolean;
  /** When false, the default red field chrome is suppressed while the error message still renders. */
  highlightOnError?: boolean;
  styles?: NativeStyles<TSlots>;
  rootProps?: Record<string, unknown>;
  labelProps?: Record<string, unknown>;
  hintProps?: Record<string, unknown>;
  errorProps?: Record<string, unknown>;
};

type NativeInputBehaviorUi = {
  readOnly?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  keyboardType?: string;
  secureTextEntry?: boolean;
};

type WebSharedFieldSlot = 'root' | 'label' | 'hint' | 'error' | 'requiredMark';
type WebTextFieldSlot = WebSharedFieldSlot | 'input';
type WebTextareaFieldSlot = WebSharedFieldSlot | 'textarea';
type WebCheckboxFieldSlot =
  | WebSharedFieldSlot
  | 'checkboxRow'
  | 'checkboxInput'
  | 'checkboxLabel';
type WebSwitchFieldSlot =
  | WebSharedFieldSlot
  | 'switchRoot'
  | 'switchTrack'
  | 'switchThumb';
type WebSelectFieldSlot = WebSharedFieldSlot | 'select';
type WebOtpFieldSlot = WebSharedFieldSlot | 'otpContainer' | 'otpInput';
type WebPasswordFieldSlot =
  | WebTextFieldSlot
  | 'toggle'
  | 'strengthRow'
  | 'strengthBar'
  | 'strengthFill'
  | 'strengthLabel'
  | 'strengthEntropy'
  | 'rulesList'
  | 'ruleItem'
  | 'ruleBullet'
  | 'ruleText';
type WebPhoneFieldSlot =
  | WebTextFieldSlot
  | 'row'
  | 'countryButton'
  | 'countrySearchInput'
  | 'countryList'
  | 'countryItem'
  | 'countryName'
  | 'countryDial'
  | 'e164';
type WebFileFieldSlot =
  | WebSharedFieldSlot
  | 'dropZone'
  | 'dropZoneIcon'
  | 'dropZoneText'
  | 'browseButton'
  | 'list'
  | 'listItem'
  | 'previewImage'
  | 'fileIcon'
  | 'fileName'
  | 'fileMeta'
  | 'removeButton'
  | 'addMoreButton';
type WebAsyncAutocompleteFieldSlot =
  | WebTextFieldSlot
  | 'select'
  | 'listbox'
  | 'option'
  | 'optionActive'
  | 'optionSelected'
  | 'empty'
  | 'loading';

export type WebFieldSlot =
  | WebTextFieldSlot
  | WebTextareaFieldSlot
  | WebCheckboxFieldSlot
  | WebSwitchFieldSlot
  | WebSelectFieldSlot
  | WebOtpFieldSlot
  | WebPasswordFieldSlot
  | WebPhoneFieldSlot
  | WebFileFieldSlot
  | WebAsyncAutocompleteFieldSlot;

export interface WebGlobalFieldUiOverrides extends WebFieldUiBase<WebFieldSlot> {}

export interface WebTextFieldUiOverrides
  extends WebFieldUiBase<WebTextFieldSlot>,
    WebInputBehaviorUi {
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'onBlur'
    | 'onFocus'
    | 'disabled'
    | 'name'
    | 'id'
  >;
}

export interface WebTextareaFieldUiOverrides
  extends WebFieldUiBase<WebTextareaFieldSlot>,
    WebInputBehaviorUi {
  textareaProps?: Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'onBlur'
    | 'onFocus'
    | 'disabled'
    | 'name'
    | 'id'
  >;
}

export interface WebCheckboxFieldUiOverrides
  extends WebFieldUiBase<WebCheckboxFieldSlot>,
    WebInputBehaviorUi {
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | 'checked'
    | 'defaultChecked'
    | 'onChange'
    | 'onBlur'
    | 'onFocus'
    | 'disabled'
    | 'name'
    | 'id'
    | 'type'
  >;
}

export interface WebSwitchFieldUiOverrides
  extends WebFieldUiBase<WebSwitchFieldSlot>,
    WebInputBehaviorUi {
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | 'checked'
    | 'defaultChecked'
    | 'onChange'
    | 'onBlur'
    | 'onFocus'
    | 'disabled'
    | 'name'
    | 'id'
    | 'type'
  >;
}

export interface WebSelectFieldUiOverrides extends WebFieldUiBase<WebSelectFieldSlot> {
  selectProps?: Omit<
    SelectHTMLAttributes<HTMLSelectElement>,
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'onBlur'
    | 'onFocus'
    | 'disabled'
    | 'name'
    | 'id'
  >;
  renderPicker?: (ctx: SelectPickerRenderContext) => React.ReactNode;
}

export interface WebRadioFieldUiOverrides
  extends WebFieldUiBase<WebCheckboxFieldSlot>,
    WebInputBehaviorUi {
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | 'checked'
    | 'defaultChecked'
    | 'onChange'
    | 'onBlur'
    | 'onFocus'
    | 'disabled'
    | 'name'
    | 'id'
    | 'type'
  >;
  renderPicker?: (ctx: SelectPickerRenderContext) => React.ReactNode;
}

export interface WebOtpFieldUiOverrides
  extends WebFieldUiBase<WebOtpFieldSlot>,
    WebInputBehaviorUi {
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'onBlur'
    | 'onFocus'
    | 'disabled'
    | 'name'
    | 'id'
    | 'type'
  >;
}

export interface WebPasswordFieldUiOverrides
  extends WebFieldUiBase<WebPasswordFieldSlot>,
    WebInputBehaviorUi {
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | 'type'
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'onBlur'
    | 'onFocus'
    | 'disabled'
    | 'name'
    | 'id'
  >;
}

export interface WebPhoneFieldUiOverrides
  extends WebFieldUiBase<WebPhoneFieldSlot>,
    WebInputBehaviorUi {
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | 'type'
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'onBlur'
    | 'onFocus'
    | 'disabled'
    | 'name'
    | 'id'
  >;
  searchInputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onChange'
  >;
}

export interface WebFileFieldUiOverrides extends WebFieldUiBase<WebFileFieldSlot> {
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | 'type'
    | 'value'
    | 'defaultValue'
    | 'name'
    | 'id'
    | 'accept'
    | 'multiple'
    | 'disabled'
    | 'onChange'
  >;
  renderFileIcon?: (file: FileValue) => ReactNode;
}

export interface WebAsyncAutocompleteFieldUiOverrides
  extends WebFieldUiBase<WebAsyncAutocompleteFieldSlot> {
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'onBlur'
    | 'onFocus'
    | 'disabled'
    | 'name'
    | 'id'
    | 'type'
    | 'role'
    | 'aria-autocomplete'
    | 'aria-controls'
    | 'aria-expanded'
    | 'aria-activedescendant'
  >;
  renderOption?: (
    option: SelectOption,
    state: { active: boolean; selected: boolean },
  ) => React.ReactNode;
  renderEmpty?: () => React.ReactNode;
  renderLoading?: () => React.ReactNode;
  renderPicker?: (ctx: SelectPickerRenderContext) => React.ReactNode;
}

type NativeSharedFieldSlot =
  | 'root'
  | 'label'
  | 'input'
  | 'error'
  | 'hint'
  | 'requiredMark';
type NativeCheckboxFieldSlot =
  | NativeSharedFieldSlot
  | 'checkboxRow'
  | 'checkboxBox'
  | 'checkboxLabel';
type NativeSelectFieldSlot =
  | NativeSharedFieldSlot
  | 'optionTrigger'
  | 'optionRow'
  | 'optionLabel'
  | 'modalBackdrop'
  | 'modalCard';
type NativeOtpFieldSlot = NativeSharedFieldSlot | 'otpContainer' | 'otpInput';
type NativePasswordFieldSlot =
  | NativeSharedFieldSlot
  | 'strengthRow'
  | 'strengthBar'
  | 'strengthFill'
  | 'toggle'
  | 'toggleText'
  | 'strengthLabel';
type NativePhoneFieldSlot =
  | NativeSharedFieldSlot
  | 'row'
  | 'countryButton'
  | 'countryFlag'
  | 'countryDial'
  | 'chevron'
  | 'e164'
  | 'modalBackdrop'
  | 'modalCard'
  | 'searchInput'
  | 'separator'
  | 'countryRow'
  | 'countryName';
type NativeFileFieldSlot =
  | NativeSharedFieldSlot
  | 'pickButton'
  | 'pickButtonText'
  | 'fileList'
  | 'fileItem'
  | 'fileIcon'
  | 'fileIconText'
  | 'fileName'
  | 'fileMeta'
  | 'removeButton'
  | 'removeText';
type NativeAsyncAutocompleteFieldSlot =
  | NativeSharedFieldSlot
  | 'trigger'
  | 'triggerValue'
  | 'triggerPlaceholder'
  | 'modalBackdrop'
  | 'modalCard'
  | 'searchInput'
  | 'loadingRow'
  | 'loadingText'
  | 'optionRow'
  | 'optionLabel'
  | 'emptyText';

export type NativeFieldSlot =
  | NativeSharedFieldSlot
  | NativeCheckboxFieldSlot
  | NativeSelectFieldSlot
  | NativeOtpFieldSlot
  | NativePasswordFieldSlot
  | NativePhoneFieldSlot
  | NativeFileFieldSlot
  | NativeAsyncAutocompleteFieldSlot;

export interface NativeGlobalFieldUiOverrides
  extends NativeFieldUiBase<NativeFieldSlot> {}

export interface NativeTextFieldUiOverrides
  extends NativeFieldUiBase<NativeSharedFieldSlot>,
    NativeInputBehaviorUi {
  inputProps?: Record<string, unknown>;
}

export interface NativeCheckboxFieldUiOverrides
  extends NativeFieldUiBase<NativeCheckboxFieldSlot> {}

export interface NativeSwitchFieldUiOverrides
  extends NativeFieldUiBase<NativeSharedFieldSlot> {}

export interface NativeSelectFieldUiOverrides
  extends NativeFieldUiBase<NativeSelectFieldSlot> {
  renderPicker?: (ctx: SelectPickerRenderContext) => React.ReactNode;
}

export interface NativeOtpFieldUiOverrides
  extends NativeFieldUiBase<NativeOtpFieldSlot>,
    NativeInputBehaviorUi {
  inputProps?: Record<string, unknown>;
}

export interface NativePasswordFieldUiOverrides
  extends NativeFieldUiBase<NativePasswordFieldSlot>,
    NativeInputBehaviorUi {
  inputProps?: Record<string, unknown>;
}

export interface NativePhoneFieldUiOverrides
  extends NativeFieldUiBase<NativePhoneFieldSlot>,
    NativeInputBehaviorUi {
  inputProps?: Record<string, unknown>;
}

export interface NativeFileFieldUiOverrides
  extends NativeFieldUiBase<NativeFileFieldSlot> {
  pickFiles?: (ctx: {
    descriptor: {
      _label: string;
      _required: boolean;
      _hint?: string;
      _disabled: boolean;
      _fileAccept: string[];
      _fileMaxSize: number | null;
      _fileMultiple: boolean;
      _fileMaxFiles: number;
      _filePreview: boolean;
      _filePreviewHeight: number;
      _fileBase64: boolean;
      _fileDragDropLabel: string;
    };
    multiple: boolean;
  }) => Promise<FileValue[] | FileValue | null>;
}

export interface NativeAsyncAutocompleteFieldUiOverrides
  extends NativeFieldUiBase<NativeAsyncAutocompleteFieldSlot>,
    NativeInputBehaviorUi {
  inputProps?: Record<string, unknown>;
  renderPicker?: (ctx: SelectPickerRenderContext) => React.ReactNode;
}

export interface WebFieldUiOverrides
  extends WebFieldUiBase<WebFieldSlot>,
    WebInputBehaviorUi {
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'onBlur'
    | 'onFocus'
    | 'disabled'
    | 'name'
    | 'id'
  >;
  textareaProps?: Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'onBlur'
    | 'onFocus'
    | 'disabled'
    | 'name'
    | 'id'
  >;
  selectProps?: Omit<
    SelectHTMLAttributes<HTMLSelectElement>,
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'onBlur'
    | 'onFocus'
    | 'disabled'
    | 'name'
    | 'id'
  >;
  searchInputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onChange'
  >;
  renderPicker?: (ctx: SelectPickerRenderContext) => React.ReactNode;
  renderOption?: (
    option: SelectOption,
    state: { active: boolean; selected: boolean },
  ) => React.ReactNode;
  renderEmpty?: () => React.ReactNode;
  renderLoading?: () => React.ReactNode;
  renderFileIcon?: (file: FileValue) => ReactNode;
}

export interface NativeFieldUiOverrides
  extends NativeFieldUiBase<NativeFieldSlot>,
    NativeInputBehaviorUi {
  inputProps?: Record<string, unknown>;
  renderPicker?: (ctx: SelectPickerRenderContext) => React.ReactNode;
  pickFiles?: (ctx: {
    descriptor: {
      _label: string;
      _required: boolean;
      _hint?: string;
      _disabled: boolean;
      _fileAccept: string[];
      _fileMaxSize: number | null;
      _fileMultiple: boolean;
      _fileMaxFiles: number;
      _filePreview: boolean;
      _filePreviewHeight: number;
      _fileBase64: boolean;
      _fileDragDropLabel: string;
    };
    multiple: boolean;
  }) => Promise<FileValue[] | FileValue | null>;
}

export type FieldUiOverrides = WebFieldUiOverrides | NativeFieldUiOverrides;

export type FieldStyleProps<
  TUi = FieldUiOverrides,
  TPlatform extends Platform = Platform,
> = (TPlatform extends 'web'
  ? {
      /** Forwarded to the field root on platforms that support it. */
      className?: string;
    }
  : EmptyProps) & {
  /** Forwarded to the field root. */
  style?: PlatformStyleValue<TPlatform>;
  /** Platform-local field UI override. */
  ui?: TUi;
};

export type ExtraFieldProps<
  TUi = FieldUiOverrides,
  TPlatform extends Platform = Platform,
> = FieldStyleProps<TUi, TPlatform> & {
  /** Override the label defined in the schema */
  label?: string;
  /** Override placeholder */
  placeholder?: string;
  /** Override hint */
  hint?: string;
};

export type FieldTheme<
  TUi = FieldUiOverrides,
  TPlatform extends Platform = Platform,
> = (TPlatform extends 'web' ? { className?: string } : EmptyProps) & {
  style?: PlatformStyleValue<TPlatform>;
  ui?: TUi;
};

export interface WebFormUiOverrides {
  className?: string;
  style?: CSSProperties;
  props?: Omit<
    FormHTMLAttributes<HTMLFormElement>,
    'children' | 'onSubmit' | 'className' | 'style'
  >;
}

export interface WebSubmitUiOverrides {
  className?: string;
  style?: CSSProperties;
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

export type PlatformFormUiOverrides<TPlatform extends Platform> = TPlatform extends 'web'
  ? WebFormUiOverrides
  : NativeFormUiOverrides;

export type PlatformSubmitUiOverrides<TPlatform extends Platform> =
  TPlatform extends 'web' ? WebSubmitUiOverrides : NativeSubmitUiOverrides;

export type PlatformGlobalFieldUiOverrides<TPlatform extends Platform> =
  TPlatform extends 'web' ? WebGlobalFieldUiOverrides : NativeGlobalFieldUiOverrides;

export type PlatformFieldUiOverrides<TPlatform extends Platform> = TPlatform extends 'web'
  ? WebFieldUiOverrides
  : NativeFieldUiOverrides;

export type PlatformFieldUiForType<
  TPlatform extends Platform,
  TType extends FieldType,
> = TPlatform extends 'web'
  ? TType extends 'textarea'
    ? WebTextareaFieldUiOverrides
    : TType extends 'checkbox'
      ? WebCheckboxFieldUiOverrides
      : TType extends 'switch'
        ? WebSwitchFieldUiOverrides
        : TType extends 'select'
          ? WebSelectFieldUiOverrides | WebAsyncAutocompleteFieldUiOverrides
          : TType extends 'radio'
            ? WebRadioFieldUiOverrides
            : TType extends 'otp'
              ? WebOtpFieldUiOverrides
              : TType extends 'password'
                ? WebPasswordFieldUiOverrides
                : TType extends 'phone'
                  ? WebPhoneFieldUiOverrides
                  : TType extends 'file'
                    ? WebFileFieldUiOverrides
                    : TType extends 'custom'
                      ? WebGlobalFieldUiOverrides
                      : WebTextFieldUiOverrides
  : TType extends 'checkbox'
    ? NativeCheckboxFieldUiOverrides
    : TType extends 'switch'
      ? NativeSwitchFieldUiOverrides
      : TType extends 'select'
        ? NativeSelectFieldUiOverrides | NativeAsyncAutocompleteFieldUiOverrides
        : TType extends 'radio'
          ? NativeSelectFieldUiOverrides
          : TType extends 'otp'
            ? NativeOtpFieldUiOverrides
            : TType extends 'password'
              ? NativePasswordFieldUiOverrides
              : TType extends 'phone'
                ? NativePhoneFieldUiOverrides
                : TType extends 'file'
                  ? NativeFileFieldUiOverrides
                  : TType extends 'custom'
                    ? NativeGlobalFieldUiOverrides
                    : NativeTextFieldUiOverrides;

export type FieldPropsForSchemaEntry<
  TEntry,
  TPlatform extends Platform,
> = ExtraFieldProps<
  PlatformFieldUiForType<TPlatform, SchemaFieldType<TEntry>>,
  TPlatform
>;

export type FieldComponent<TProps = ExtraFieldProps> = (
  props?: TProps,
) => React.ReactElement | null;

export type FieldComponents<
  S extends FormSchema,
  TPlatform extends Platform = Platform,
> = {
  [K in keyof S]: FieldComponent<FieldPropsForSchemaEntry<S[K], TPlatform>>;
};

export type FormBridgeUiOptions<TPlatform extends Platform = Platform> = {
  field?: FieldTheme<PlatformGlobalFieldUiOverrides<TPlatform>, TPlatform>;
  form?: PlatformFormUiOverrides<TPlatform>;
  submit?: PlatformSubmitUiOverrides<TPlatform>;
};

// ─── useForm options ──────────────────────────────────────────────────────────
export type ValidationTrigger = 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched';

export interface UseFormOptions<
  S extends FormSchema,
  TPlatform extends Platform = Platform,
> {
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
  globalUi?: FormBridgeUiOptions<TPlatform>;
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
