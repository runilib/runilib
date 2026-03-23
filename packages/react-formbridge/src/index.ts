// ─── Core ─────────────────────────────────────────────────────────────────────
export { useFormBridge }       from './hooks/useFormura';
export { field }         from './builders/field';

// ─── Resolvers ────────────────────────────────────────────────────────────────
export { zodResolver, yupResolver, joiResolver, valibotResolver } from './adapters/resolvers';

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



// ─── Feature: Masks ───────────────────────────────────────────────────────────
export { MaskedFieldBuilder }                          from './fields/mask/MaskedField';
export { isMaskedDescriptor }                          from './fields/mask/MaskedField';
export { MASKS, applyMask, extractRaw, parsePattern }  from './fields/mask/masks';
export { maskCompleteValidator }                       from './fields/mask/masks';
export type { MaskPreset, MaskResult, MaskToken, ApplyMaskOptions } from './fields/mask/masks';
export type { MaskedDescriptor, MaskedFieldMeta }      from './fields/mask/MaskedField';

// ─── Feature: Password strength ──────────────────────────────────────────────
export { scorePassword }                               from './fields/password/strength';
export { STRENGTH_CONFIG_STRICT }                      from './fields/password/strength';
export { STRENGTH_CONFIG_SIMPLE }                      from './fields/password/strength';
export { STRENGTH_CONFIG_FR }                          from './fields/password/strength';
export { PasswordStrengthMixin, isStrengthDescriptor } from './fields/password/PasswordWithStrength';
export { DEFAULT_STRENGTH_META }                       from './fields/password/PasswordWithStrength';
export type {
  StrengthResult,
  StrengthConfig,
  StrengthScoreLevel,
  StrengthRuleConfig,
  PasswordRule,
}                                                      from './fields/password/strength';
export type { PasswordStrengthMeta }                   from './fields/password/PasswordWithStrength';

// ─── Feature: File upload ─────────────────────────────────────────────────────
export { FileFieldBuilder, isFileDescriptor }          from './fields/file/FileField';
export type {
  FileValue,
  FileFieldMeta,
  FileSourceType,
}                                                      from './fields/file/FileField';

// ─── Web renderers (for integration into WebField.tsx) ────────────────────────
// These are imported dynamically inside useForm — not re-exported here.

// ─── Integration note ─────────────────────────────────────────────────────────
// To integrate these features into the main formura package:
// 1. Copy this entire src/ into formura/src/
// 2. In formura/src/hooks/useForm.ts, add checks for masked/strength/file
//    descriptors when rendering fields (see INTEGRATION.md)
// 3. Add exports from this index.ts to formura/src/index.ts
// 4. In formura/src/builders/field.ts, add:
//    masked: (label, pattern) => new MaskedFieldBuilder(label, pattern)
//    file:   (label) => new FileFieldBuilder(label)


// ─── Types ────────────────────────────────────────────────────────────────────
export type {
  FormSchema,
  FormState,
  FormStatus,
  FieldDescriptor,
  FieldType,
  FieldRenderProps,
  UseFormReturn,
  UseFormOptions,
  ValidationTrigger,
  SchemaValues,
  SelectOption,
  SchemaResolver,
  ResolverResult,
  ExtraFieldProps,
  SubmitButtonProps,
} from './types';
