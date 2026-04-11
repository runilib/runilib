import type { CSSProperties, ReactNode } from 'react';

import type { AsyncOptionsConfig } from '../hooks/shared/useAsyncOptions';

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
export type EmptyProps = Record<never, never>;

// ─── Style primitives ─────────────────────────────────────────────────────────

export type NativeStyleValue =
  | Record<string, unknown>
  | number
  | Array<NativeStyleValue | null | undefined>;

export type FieldStyleValue = CSSProperties | NativeStyleValue;

export type PlatformStyleValue<TPlatform extends Platform = Platform> =
  TPlatform extends 'web' ? CSSProperties : NativeStyleValue;

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

// ─── Select option ─────────────────────────────────────────────────────────────

export interface ISelectOption {
  label: string;
  value: string | number;
}

export type SelectOption = ISelectOption & Record<string, unknown>;

// ─── Select picker render context ──────────────────────────────────────────────

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

// ─── Field descriptor ──────────────────────────────────────────────────────────
export interface FieldDescriptor<DV = unknown, FType extends FieldType = FieldType> {
  /** Internal type used to pick the right renderer */
  _type: FType;
  /** Human-readable label */
  _label?: string;
  /** Placeholder text */
  _placeholder?: string;
  /** Default value */
  _defaultValue: DV;
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
  _validators: Validator<DV>[];
  /** Transform before storing (e.g., toUpperCase) */
  _transform?: (v: DV) => DV;
  /** Cross-field dependency name for validation */
  _matchField?: string;
  /** Custom renderer (overrides platform renderer) */
  _customRender?: (props: FieldRenderProps<DV>) => ReactNode;
  /** Helper text shown below the field */
  _hint?: string;
  /** Max file size for file fields */
  _maxFileSize?: number;
  /** Accepted file types */
  _accept?: string[];

  _asyncOptions?: AsyncOptionsConfig<Record<string, unknown>>;

  _searchable?: boolean;
}

// ─── Per-field runtime state ───────────────────────────────────────────────────

export interface FieldState<V = unknown> {
  value: V;
  error: string | null;
  touched: boolean;
  dirty: boolean;
  validating: boolean;
}

// ─── Shared field render contract ──────────────────────────────────────────────

export interface FieldRenderState<V = unknown> {
  name: string;
  value: V;
  label: string;
  placeholder?: string;
  error: string | null;
  touched: boolean;
  dirty: boolean;
  validating: boolean;
  disabled: boolean;
  required: boolean;
  hint?: string;
  options?: SelectOption[];
  otpLength?: number;
  allValues: Record<string, unknown>;
}

export interface FieldRenderHandlers<V = unknown> {
  onChange: (value: V) => void;
  onBlur: () => void;
  onFocus: () => void;
}

// ─── Props passed to each rendered field ────────────────────────────────────────

export type FieldRenderProps<V = unknown> = FieldRenderState<V> & FieldRenderHandlers<V>;

// ─── Field UI renderers (shared by web & native) ───────────────────────────────
export type FieldRenderersProps = {
  renderLabel?: (ctx: {
    id: string;
    name: string;
    label: React.ReactNode;
    required: boolean;
  }) => React.ReactNode;
  renderHint?: (ctx: {
    id: string;
    name: string;
    hint: React.ReactNode;
  }) => React.ReactNode;
  renderError?: (ctx: {
    id: string;
    name: string;
    error: React.ReactNode;
  }) => React.ReactNode;
  renderRequiredMark?: () => React.ReactNode;
};
