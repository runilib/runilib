import type { BaseFieldBuilder } from '../core/field-builders/base/BaseFieldBuilder';
import type {
  BuiltFileDescriptor,
  FileFieldBuilder,
} from '../core/field-builders/file/FileField';
import type { AnyFieldBuilder } from '../core/field-builders/types';
import type { FieldDescriptor, FieldType } from './field';

// ─── Form state machine ────────────────────────────────────────────────────────
export type FormStatus = 'idle' | 'validating' | 'submitting' | 'success' | 'error';

// ─── Schema = map of field descriptors ──────────────────────────────────────────

export type FormSchemaEntry = FieldDescriptor<unknown, FieldType> | AnyFieldBuilder;

export type FormSchema = Record<string, FormSchemaEntry>;

// ─── Schema type inference ──────────────────────────────────────────────────────

type BuiltField<T> = T extends FileFieldBuilder
  ? BuiltFileDescriptor
  : T extends BaseFieldBuilder<infer DValue, infer FType>
    ? FieldDescriptor<DValue, FType>
    : T;

type NormalizeField<T> =
  T extends FieldDescriptor<infer DValue, infer FType>
    ? FieldDescriptor<DValue, FType>
    : never;

export type ResolvedFieldDescriptor<T> = NormalizeField<BuiltField<T>>;

export type SchemaFieldType<T> =
  ResolvedFieldDescriptor<T> extends FieldDescriptor<infer _DValue, infer FType>
    ? FType
    : T extends FormSchemaEntry
      ? FieldType
      : never;

type InferFieldValue<T> =
  ResolvedFieldDescriptor<T> extends FieldDescriptor<infer V, FieldType>
    ? V
    : T extends FormSchemaEntry
      ? unknown
      : never;

export type SchemaValues<S extends FormSchema> = {
  [K in keyof S]: InferFieldValue<S[K]>;
};

// ─── Form state (what the user gets) ────────────────────────────────────────────

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
