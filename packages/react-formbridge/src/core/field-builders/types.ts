import type { FieldType, SelectOption } from '../../types';
import type { BaseFieldBuilder } from './base/BaseFieldBuilder';
import type { BooleanFieldBuilder } from './boolean/BooleanFieldBuilder';
import type { DateFieldBuilder } from './date/DateFieldBuilder';
import type { FileFieldBuilder } from './file/FileField';
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
  | StringFieldBuilder
  | PasswordFieldBuilder
  | NumberFieldBuilder
  | BooleanFieldBuilder
  | SelectFieldBuilder
  | DateFieldBuilder
  | OtpFieldBuilder
  | MaskedFieldBuilder
  | FileFieldBuilder
  | PhoneFieldBuilder
  // biome-ignore lint/suspicious/noExplicitAny: builder value type is intentionally open here
  | BaseFieldBuilder<any>;

// ─── field namespace ─────────────────────────────────────────────────────────

export type FieldNamespace = {
  text: (label: string) => StringFieldBuilder;
  email: (label: string) => EmailFieldBuilder;
  password: (label: string) => PasswordFieldBuilder;
  number: (label: string) => NumberFieldBuilder;
  tel: (label: string) => StringFieldBuilder;
  url: (label: string) => StringFieldBuilder;
  textarea: (label: string) => StringFieldBuilder;
  checkbox: (label: string) => BooleanFieldBuilder;
  switch: (label: string) => BooleanFieldBuilder;
  select: (label: string) => SelectFieldBuilder;
  radio: (label: string) => SelectFieldBuilder;
  date: (label: string) => DateFieldBuilder;
  otp: (label: string) => OtpFieldBuilder;
  masked: (label: string, pattern: MaskPatternInput) => MaskedFieldBuilder;
  file: (label: string) => FileFieldBuilder;
  phone: (label: string) => PhoneFieldBuilder;
  custom: <V = unknown>(label: string, defaultValue: V) => BaseFieldBuilder<V>;
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
