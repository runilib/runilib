export {
  joiBridge, valibotBridge, yupBridge, zodBridge, type JoiBridgeIssue,
  type JoiBridgeOptions, type ValibotBridgeIssue,
  type ValibotBridgeOptions, type YupBridgeIssue,
  type YupBridgeOptions, type ZodBridgeIssue,
  type ZodBridgeOptions
} from './core/bridges';
export type {
  BridgeAdapterOptions,
  BridgeErrorMode,
  BridgeIssueContext,
  BridgeIssueMapResult,
  BridgePathInput
} from './core/bridges/types';
export type {
  JsonFieldDescriptor,
  JsonFieldType,
  JsonFormDefinition
} from './core/field-descriptors/dynamic/types';
export { field } from './core/field-descriptors/field';
export { inferFromObject, inferFromType } from './core/field-descriptors/infer';
export { MASKS } from './core/field-descriptors/mask/constants';
export type { MASK_PRESET } from './core/field-descriptors/mask/constants';
export type { MaskPatternInput } from './core/field-descriptors/mask/masks';
export type {
  MaskPatternConfig,
  MaskTokenMap
} from './core/field-descriptors/mask/types';
export type { InferFieldOptions, InferOverrides } from './core/field-descriptors/types';
export type { StorageAdapter, StorageType } from './core/persist/storage';
export {
  createSchema, FormBridgeSchemaValidationError,
  getSchemaValidationApi, type FormBridgeSchema,
  type FormBridgeSchemaApi
} from './core/validators/createSchema';
export { ref } from './core/validators/reference';
export {
  useFormBridgeContext, type FormBridgeProviderProps
} from './hooks/shared/form-context';
export { useAsyncOptions } from './hooks/shared/useAsyncOptions';
export type {
  AsyncDependencyShape,
  AsyncOptionsConfig,
  UseAsyncOptionsReturn
} from './hooks/shared/useAsyncOptions';
export {
  FormBridgeAnalyticsTracker,
  useFormBridgeAnalytics, type AnalyticsHandlers,
  type AnalyticsOptions
} from './hooks/shared/useFormBridgeAnalytics';
export {
  useFormBridgeReadonly, type UseReadonlyFormOptions,
  type UseReadonlyFormReturn
} from './hooks/shared/useFormBridgeReadonly';
export {
  useDynamicFormBridge, type UseDynamicFormOptions,
  type UseDynamicFormReturn
} from './hooks/useDynamicFormBridge.native';
export { useFormBridge } from './hooks/useFormBridge.native';
export {
  useFormBridgeWizard, type UseFormWizardOptions,
  type UseFormWizardReturn, type WizardStep,
  type WizardStepChangeEvent,
  type WizardStepChangeReason
} from './hooks/useFormBridgeWizard.native';
// ─── Types ────────────────────────────────────────────────────────────────────
export type * from './types.native';
