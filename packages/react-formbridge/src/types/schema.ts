import type { BaseFieldBuilder } from '../core/field-builders/base/BaseFieldBuilder';
import type {
  BuiltFileDescriptor,
  FileFieldBuilder,
} from '../core/field-builders/file/FileFieldBuilder';
import type { AnyFieldBuilder } from '../core/field-builders/types';
import type { FieldDescriptor, FieldType } from './field';

// ─── Form state machine ────────────────────────────────────────────────────────

/**
 * Lifecycle state of the form.
 *
 * Transitions (happy path):
 * `idle` → `validating` → `submitting` → `success`
 *
 * On error: any state may transition to `error`, then back to `idle` on the next
 * field interaction. This is the single source of truth exposed via
 * {@link FormState.status}.
 *
 * @remarks
 * - `idle`        - no submission in flight; default/resting state.
 * - `validating`  - schema/async validators are running before submit.
 * - `submitting`  - `onSubmit` handler is awaiting.
 * - `success`     - last submission resolved without throwing.
 * - `error`       - last submission threw or validation rejected.
 */
export type FormStatus = 'idle' | 'validating' | 'submitting' | 'success' | 'error';

// ─── Schema = map of field descriptors ──────────────────────────────────────────

/**
 * A single entry inside a {@link FormSchema}.
 *
 * Accepts either a fully-built {@link FieldDescriptor} or an {@link AnyFieldBuilder}
 * (the fluent builder form). Both get normalized to a descriptor by
 * {@link ResolvedFieldDescriptor} before use.
 */
export type FormSchemaEntry = FieldDescriptor<unknown, FieldType> | AnyFieldBuilder;

/**
 * A FormBridge form schema - the object you pass to `useFormBridge({ schema })`.
 *
 * Keys are field names; values are descriptors or builders. FormBridge derives
 * `values`, `errors`, `touched`, etc. from this shape, so the schema is the
 * single source of truth for both runtime behavior and TypeScript inference.
 *
 * @example
 * ```ts
 * const schema = {
 *   email: text().email().required(),
 *   age:   number().min(18),
 * } satisfies FormSchema;
 * ```
 */
export type FormSchema = Record<string, FormSchemaEntry>;

// ─── Schema type inference ──────────────────────────────────────────────────────

/**
 * Internal: normalizes a schema entry to a {@link FieldDescriptor}.
 *
 * - `FileFieldBuilder` → `BuiltFileDescriptor` (special-cased because files
 *   carry extra metadata like upload handlers).
 * - `BaseFieldBuilder<V, F>` → `FieldDescriptor<V, F>`.
 * - Anything else is passed through unchanged.
 *
 * @typeParam T - A schema entry to unwrap.
 */
type BuiltField<T> = T extends FileFieldBuilder
  ? BuiltFileDescriptor
  : T extends BaseFieldBuilder<infer DValue, infer FType>
    ? FieldDescriptor<DValue, FType>
    : T;

/**
 * Internal: reshapes a `FieldDescriptor<V, F>` into itself, stripping any
 * non-descriptor shapes. Used as a filter after {@link BuiltField}.
 */
type NormalizeField<T> =
  T extends FieldDescriptor<infer DValue, infer FType>
    ? FieldDescriptor<DValue, FType>
    : never;

/**
 * Canonical {@link FieldDescriptor} shape for a schema entry `T`, whether it
 * started life as a builder or a raw descriptor. Used throughout the type layer
 * as a normalization step.
 */
export type ResolvedFieldDescriptor<T> = NormalizeField<BuiltField<T>>;

/**
 * Extracts the {@link FieldType} (e.g. `'text'`, `'number'`, `'file'`) of a
 * schema entry. Falls back to the broad `FieldType` union when the type cannot
 * be narrowed.
 *
 * @typeParam T - A schema entry.
 */
export type SchemaFieldType<T> =
  ResolvedFieldDescriptor<T> extends FieldDescriptor<infer _DValue, infer FType>
    ? FType
    : T extends FormSchemaEntry
      ? FieldType
      : never;

/**
 * Internal: extracts the runtime value type for a schema entry.
 *
 * For example, a `text()` field infers `string`, a `number()` field infers
 * `number`, a `file()` field infers `FileValue`, etc.
 */
type InferFieldValue<T> =
  ResolvedFieldDescriptor<T> extends FieldDescriptor<infer V, FieldType>
    ? V
    : T extends FormSchemaEntry
      ? unknown
      : never;

/**
 * Phantom marker used by `createSchema()` to carry the underlying shape type without
 * exposing field keys at the top level of the returned object. Type-only -
 * never present at runtime.
 */
export declare const FB_SCHEMA_SHAPE: unique symbol;

/**
 * Internal: extracts the underlying shape from either a raw shape or a wrapped
 * `FormBridgeSchema`. Unwrapping preserves field-level inference even when the
 * wrapper hides keys from autocomplete.
 */
export type SchemaShape<S> = S extends {
  readonly [FB_SCHEMA_SHAPE]: infer TSchema;
}
  ? TSchema extends FormSchema
    ? TSchema
    : S
  : S;

/**
 * Strongly-typed `{ [fieldName]: value }` map inferred from a {@link FormSchema}.
 *
 * This is what you get back from `state.values`, what `onSubmit(values)`
 * receives, and what `setValues()` accepts. Using `SchemaValues<typeof schema>`
 * in your own code gives you full autocomplete on field names and value types.
 *
 * @typeParam S - The schema type.
 */
export type SchemaValues<S extends FormSchema> = {
  [K in keyof SchemaShape<S>]: InferFieldValue<SchemaShape<S>[K]>;
};

// ─── Form state (what the user gets) ────────────────────────────────────────────

/**
 * The complete public state of a form. Returned by `useFormBridge` as the
 * `state` object and passed to selectors like `globalDefaults(state)`.
 *
 * All boolean flags (`isValid`, `isDirty`, …) are derived from the raw maps
 * (`errors`, `dirty`, `touched`, `status`) and kept in sync automatically - do
 * not mutate them directly.
 *
 * @typeParam Schema - The form's schema, used to key `values`/`errors`/etc.
 */
export interface FormState<Schema extends FormSchema> {
  /**
   * Current field values, typed from the schema. Each key matches a schema
   * field; each value is the inferred runtime type (string, number, File, …).
   */
  values: SchemaValues<Schema>;
  /**
   * Per-field error messages. A key is present only when the field currently
   * has an error; absent keys mean the field is valid. Messages are plain
   * strings produced by the validator pipeline (Zod/Yup/Joi/Valibot/built-in).
   */
  errors: Partial<Record<keyof SchemaShape<Schema>, string>>;
  /**
   * Per-field "has been touched" flags. A field becomes touched when the user
   * blurs it at least once. Used to gate error visibility so forms don't
   * scream red on first render.
   */
  touched: Partial<Record<keyof SchemaShape<Schema>, boolean>>;
  /**
   * Per-field "has been modified" flags. Set to `true` the first time a field's
   * value diverges from its initial value, and cleared if the user reverts it.
   */
  dirty: Partial<Record<keyof SchemaShape<Schema>, boolean>>;
  /**
   * Coarse lifecycle state - see {@link FormStatus}. Prefer the boolean
   * helpers below (`isSubmitting`, `isSubmitSuccess`, …) for UI conditions.
   */
  status: FormStatus;
  /**
   * `true` when {@link errors} is empty. Reflects current validation, not
   * whether the user has attempted submit - use with `submitCount` if you only
   * want to show errors after a submit attempt.
   */
  isValid: boolean;
  /**
   * `true` when at least one field is dirty. Useful for "unsaved changes"
   * prompts and enabling Save buttons.
   */
  isDirty: boolean;
  /**
   * `true` while {@link status} is `'submitting'` or `'validating'`. Use this
   * to disable inputs or show a spinner during submission.
   */
  isSubmitting: boolean;
  /** `true` when the last submission completed successfully. */
  isSubmitSuccess: boolean;
  /** `true` when the last submission failed (threw or returned a rejection). */
  isSubmitError: boolean;
  /**
   * Monotonic counter incremented on every submit attempt (successful or not).
   * Use it as a signal that the user has tried to submit at least once.
   */
  submitCount: number;
  /**
   * Form-level validation error produced by cross-field rules (e.g. `refine()`
   * / `superRefine()` in a `createSchema()` pipeline). `null` when there is no
   * form-level validation issue.
   */
  formLevelError: string | null;
  /**
   * Error message produced by the most recent failed `onSubmit` call - for
   * example an API/network error. `null` when the last submission succeeded or
   * no submission has happened yet.
   */
  submitError: string | null;
}
