import type { ReactNode } from 'react';

// ─── Field value types ────────────────────────────────────────────────────────

export type FieldValue = string | number | boolean | null | undefined;
export type FormValues = Record<string, FieldValue>;

// ─── Validation ───────────────────────────────────────────────────────────────

export type ValidatorFn<V extends FieldValue = FieldValue> =
  (value: V, allValues: FormValues) => string | null | undefined | Promise<string | null | undefined>;

export interface FieldRules<V extends FieldValue = FieldValue> {
  /** Field is required. Pass true or a custom error message. */
  required?:  boolean | string;
  /** Minimum length (strings) or minimum value (numbers). */
  min?:       number | { value: number; message: string };
  /** Maximum length (strings) or maximum value (numbers). */
  max?:       number | { value: number; message: string };
  /** Minimum string length. */
  minLength?: number | { value: number; message: string };
  /** Maximum string length. */
  maxLength?: number | { value: number; message: string };
  /** Regex pattern. */
  pattern?:   RegExp | { value: RegExp; message: string };
  /** Custom async or sync validator function. */
  validate?:  ValidatorFn<V> | Record<string, ValidatorFn<V>>;
}

// ─── Field state ──────────────────────────────────────────────────────────────

export interface FieldState {
  value:       FieldValue;
  error:       string | null;
  touched:     boolean;
  dirty:       boolean;
  validating:  boolean;
}

// ─── Form state ───────────────────────────────────────────────────────────────

export interface FormState<T extends FormValues = FormValues> {
  values:      T;
  errors:      Partial<Record<keyof T, string>>;
  touched:     Partial<Record<keyof T, boolean>>;
  dirty:       Partial<Record<keyof T, boolean>>;
  isValid:     boolean;
  isDirty:     boolean;
  isSubmitting:boolean;
  isSubmitted: boolean;
  submitCount: number;
}

// ─── Register return ─────────────────────────────────────────────────────────

/** Props returned by register() for web <input> elements */
export interface WebFieldProps {
  name:        string;
  value:       string | number;
  checked?:    boolean;
  onChange:    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onBlur:      () => void;
  ref:         React.RefCallback<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
}

/** Props returned by register() for React Native TextInput */
export interface NativeFieldProps {
  value:         string;
  onChangeText:  (text: string) => void;
  onBlur:        () => void;
  ref:           React.RefCallback<unknown>;
}

export type FieldProps = WebFieldProps | NativeFieldProps;

// ─── Controller ──────────────────────────────────────────────────────────────

export interface ControllerRenderProps<V extends FieldValue = FieldValue> {
  value:    V;
  onChange: (value: V) => void;
  onBlur:   () => void;
  name:     string;
}

export interface ControllerFieldState {
  error:    string | null;
  touched:  boolean;
  dirty:    boolean;
  invalid:  boolean;
}

export interface ControllerProps<V extends FieldValue = FieldValue> {
  name:         string;
  rules?:       FieldRules<V>;
  defaultValue?:V;
  render:       (props: { field: ControllerRenderProps<V>; fieldState: ControllerFieldState }) => ReactNode;
}

// ─── useForm options ─────────────────────────────────────────────────────────

export type ValidationMode = 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';

export interface UseFormOptions<T extends FormValues = FormValues> {
  /** Default values for all fields. */
  defaultValues?:  T;
  /** When to trigger validation. @default 'onSubmit' */
  mode?:           ValidationMode;
  /** Re-validate mode after first submission. @default 'onChange' */
  reValidateMode?: ValidationMode;
}

// ─── useForm return ───────────────────────────────────────────────────────────

export interface UseFormReturn<T extends FormValues = FormValues> {
  /**
   * Register an uncontrolled field.
   * Returns props for web `<input>` or RN `<TextInput>` depending on platform.
   */
  register:       <K extends keyof T>(name: K, rules?: FieldRules<T[K] extends FieldValue ? T[K] : FieldValue>) => FieldProps;

  /** Handle form submission with validation. */
  handleSubmit:   (onValid: (values: T) => void | Promise<void>, onInvalid?: (errors: Partial<Record<keyof T, string>>) => void) => () => Promise<void>;

  /** Set a field value programmatically. */
  setValue:       <K extends keyof T>(name: K, value: T[K], opts?: { shouldValidate?: boolean; shouldDirty?: boolean }) => void;

  /** Get current value of a field. */
  getValue:       <K extends keyof T>(name: K) => T[K];

  /** Get all current values. */
  getValues:      () => T;

  /** Trigger validation manually for one or all fields. */
  trigger:        (name?: keyof T | Array<keyof T>) => Promise<boolean>;

  /** Set an error manually. */
  setError:       (name: keyof T, error: { message: string }) => void;

  /** Clear errors for one or all fields. */
  clearErrors:    (name?: keyof T | Array<keyof T>) => void;

  /** Reset the form to default values. */
  reset:          (values?: Partial<T>) => void;

  /** Watch a field value (reactive). */
  watch:          <K extends keyof T>(name: K) => T[K];

  /** Watch all values (reactive). */
  watchAll:       () => T;

  /** Current form state snapshot (non-reactive by default — use watch for reactivity). */
  formState:      FormState<T>;

  /**
   * A controlled field component — use when register() is not enough
   * (e.g., custom pickers, date inputs, sliders).
   */
  Controller:     (props: ControllerProps) => JSX.Element | null;
}
