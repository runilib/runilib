import type { FieldType, SelectOption } from '../../types/field';
import type { BaseFieldBuilder } from './base/BaseFieldBuilder';
import type { BooleanFieldBuilder } from './boolean/BooleanFieldBuilder';
import type { DateFieldBuilder } from './date/DateFieldBuilder';
import type { FileFieldBuilder } from './file/FileFieldBuilder';
import type { inferFromObject, inferFromType } from './infer';
import type { MaskedFieldBuilder } from './mask/MaskedFieldBuilder';
import type { MaskPatternInput } from './mask/masks';
import type { NumberFieldBuilder } from './number/NumberFieldBuilder';
import type { OtpFieldBuilder } from './otp/OtpFieldBuilder';
import type { PasswordFieldBuilder } from './password/PasswordFieldBuilder';
import type { PhoneFieldBuilder } from './phone/PhoneFieldBuilder';
import type { SelectFieldBuilder } from './select/SelectFieldBuilder';
import type { EmailFieldBuilder } from './string/EmailFieldBuilder';
import type { StringFieldBuilder } from './string/StringFieldBuilder';

export type AnyFieldBuilder =
  | EmailFieldBuilder
  | StringFieldBuilder<FieldType>
  | PasswordFieldBuilder
  | NumberFieldBuilder
  | BooleanFieldBuilder<'checkbox' | 'switch'>
  | SelectFieldBuilder<'select' | 'radio'>
  | DateFieldBuilder
  | OtpFieldBuilder
  | MaskedFieldBuilder
  | FileFieldBuilder
  | PhoneFieldBuilder
  | BaseFieldBuilder<unknown, 'custom'>;

// ─── field namespace ─────────────────────────────────────────────────────────

export type FieldNamespace = {
  text: (label?: string) => StringFieldBuilder<'text'>;
  email: (label?: string) => EmailFieldBuilder;
  password: (label?: string) => PasswordFieldBuilder;
  number: (label?: string) => NumberFieldBuilder;
  tel: (label?: string) => StringFieldBuilder<'tel'>;
  url: (label?: string) => StringFieldBuilder<'url'>;
  textarea: (label?: string) => StringFieldBuilder<'textarea'>;
  checkbox: (label?: string) => BooleanFieldBuilder<'checkbox'>;
  switch: (label?: string) => BooleanFieldBuilder<'switch'>;
  select: (label?: string) => SelectFieldBuilder<'select'>;
  radio: (label?: string) => SelectFieldBuilder<'radio'>;
  date: (label?: string) => DateFieldBuilder;
  otp: (label?: string) => OtpFieldBuilder;
  masked: (pattern: MaskPatternInput) => MaskedFieldBuilder;
  file: (label?: string) => FileFieldBuilder;
  phone: (label?: string) => PhoneFieldBuilder;
  custom: <V = unknown>(defaultValue: V) => BaseFieldBuilder<V, 'custom'>;
  infer: typeof inferFromObject;
  inferType: typeof inferFromType;
};

/** Per-field override options for field.infer() */
export interface InferFieldOptions<V = unknown> {
  /** Override the auto-detected field type */
  type?: FieldType;
  /** Label (defaults to a prettified version of the key) */
  label?: string;
  /** Placeholder */
  placeholder?: string;
  /** Hint text */
  hint?: string;
  /** Mark required */
  required?: boolean | string;
  /** Min (length or value) */
  min?: number;
  /** Max (length or value) */
  max?: number;
  /** Options for select/radio */
  options?: SelectOption[] | string[];
  /** Disable */
  disabled?: boolean;
  /** Hide */
  hidden?: boolean;
  /** Custom validator */
  validate?: (
    v: V,
    all: Record<string, unknown>,
  ) => string | null | Promise<string | null>;
}

/** Map of field keys to their override options */
export type InferOverrides<T extends Record<string, unknown>> = {
  [K in keyof T]?: InferFieldOptions<T[K]>;
};
