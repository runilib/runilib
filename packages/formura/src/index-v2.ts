// ─── field.infer() & field.inferType() ────────────────────────────────────────
export { inferFromObject, inferFromType }  from './builders/infer';
export type { InferFieldOptions, InferOverrides } from './builders/infer';

// ─── Dynamic / JSON-driven forms ──────────────────────────────────────────────
export { parseDynamicForm, parseJsonSchema } from './builders/dynamic';
export { useDynamicForm }                    from './hooks/useDynamicForm';
export type {
  JsonFormDefinition,
  JsonFieldDescriptor,
  JsonFieldType,
  JsonValidationRule,
  UseDynamicFormOptions,
  UseDynamicFormReturn,
} from './builders/dynamic';

// ─── Readonly & diff mode ─────────────────────────────────────────────────────
export { useReadonlyForm }  from './hooks/useReadonlyForm';
export type {
  UseReadonlyFormOptions,
  UseReadonlyFormReturn,
  FieldReadonlyState,
  ReadonlyFieldProps,
  ReadonlyMode,
} from './hooks/useReadonlyForm';
