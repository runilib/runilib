import {
  FieldHost as SharedFieldHost,
  type FieldHostProps as SharedFieldHostProps,
  FormHost as SharedFormHost,
  type FormHostProps as SharedFormHostProps,
  SubmitHost as SharedSubmitHost,
  type SubmitHostProps as SharedSubmitHostProps,
} from './renderers/hosts/Host';
import type {
  FormSchema,
  ExtraFieldProps as NativeExtraFieldProps,
} from './types.native';

// ─── Core ─────────────────────────────────────────────────────────────────────

// ─── Core ─────────────────────────────────────────────────────────────────────

// ─── Core ─────────────────────────────────────────────────────────────────────

// ─── Core ─────────────────────────────────────────────────────────────────────

export {
  type JoiBridgeIssue,
  type JoiBridgeOptions,
  joiBridge,
  type ValibotBridgeIssue,
  type ValibotBridgeOptions,
  valibotBridge,
  type YupBridgeIssue,
  type YupBridgeOptions,
  yupBridge,
  type ZodBridgeIssue,
  type ZodBridgeOptions,
  zodBridge,
} from './core/bridges';
export type {
  BridgeAdapterOptions,
  BridgeErrorMode,
  BridgeIssueContext,
  BridgeIssueMapResult,
  BridgePathInput,
} from './core/bridges/types';
export type {
  JsonFieldDescriptor,
  JsonFieldType,
  JsonFormDefinition,
} from './core/field-descriptors/dynamic/types';
export { field } from './core/field-descriptors/field';
export { inferFromObject, inferFromType } from './core/field-descriptors/infer';
export type { MASK_PRESET } from './core/field-descriptors/mask/constants';
export { MASKS } from './core/field-descriptors/mask/constants';
export type { MaskPatternInput } from './core/field-descriptors/mask/masks';
export type {
  MaskPatternConfig,
  MaskTokenMap,
} from './core/field-descriptors/mask/types';
export type { InferFieldOptions, InferOverrides } from './core/field-descriptors/types';
export type { StorageAdapter, StorageType } from './core/persist/storage';
export {
  createSchema,
  type FormBridgeSchema,
  type FormBridgeSchemaApi,
  FormBridgeSchemaValidationError,
  getSchemaValidationApi,
} from './core/validators/createSchema';
export { ref } from './core/validators/reference';
export {
  type FormBridgeProviderProps,
  useFormBridgeContext,
} from './hooks/shared/form-context';
export type {
  AsyncDependencyShape,
  AsyncOptionsConfig,
  UseAsyncOptionsReturn,
} from './hooks/shared/useAsyncOptions';
export { useAsyncOptions } from './hooks/shared/useAsyncOptions';
export {
  type AnalyticsHandlers,
  type AnalyticsOptions,
  FormBridgeAnalyticsTracker,
  useFormBridgeAnalytics,
} from './hooks/shared/useFormBridgeAnalytics';
export {
  type UseReadonlyFormOptions,
  type UseReadonlyFormReturn,
  useFormBridgeReadonly,
} from './hooks/shared/useFormBridgeReadonly';
export {
  type UseDynamicFormOptions,
  type UseDynamicFormReturn,
  useDynamicFormBridge,
} from './hooks/useDynamicFormBridge.native';
export { useFormBridge } from './hooks/useFormBridge.native';
export {
  type UseFormWizardOptions,
  type UseFormWizardReturn,
  useFormBridgeWizard,
  type WizardStep,
  type WizardStepChangeEvent,
  type WizardStepChangeReason,
} from './hooks/useFormBridgeWizard.native';
// ─── FormHost ────────────────────────────────────────────────────────────────────
export type FieldHostProps<TProps extends NativeExtraFieldProps = NativeExtraFieldProps> =
  SharedFieldHostProps<TProps>;
export const FieldHost = SharedFieldHost as <TProps extends NativeExtraFieldProps>(
  props: FieldHostProps<TProps>,
) => JSX.Element;

export type SubmitHostProps = SharedSubmitHostProps<'native'>;
export const SubmitHost = SharedSubmitHost as (props: SubmitHostProps) => JSX.Element;

export type FormHostProps<F extends FormSchema> = SharedFormHostProps<F, 'native'>;
export const FormHost = SharedFormHost as <F extends FormSchema>(
  props: FormHostProps<F>,
) => JSX.Element;

// ─── Types ────────────────────────────────────────────────────────────────────
export type * from './types.native';
