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

export type {
  JsonFieldDescriptor,
  JsonFieldType,
  JsonFormDefinition,
} from './core/field-builders/dynamic/types';
export { field } from './core/field-builders/field';
export { inferFromObject, inferFromType } from './core/field-builders/infer';
export type { MaskPreset } from './core/field-builders/mask/constants';
export { MASKS } from './core/field-builders/mask/constants';
export type { MaskPatternInput } from './core/field-builders/mask/masks';
export type {
  MaskPatternConfig,
  MaskTokenMap,
} from './core/field-builders/mask/types';
export type { InferFieldOptions, InferOverrides } from './core/field-builders/types';
export {
  type JoiResolverIssue,
  type JoiResolverOptions,
  joiResolver,
  type ValibotResolverIssue,
  type ValibotResolverOptions,
  valibotResolver,
  type YupResolverIssue,
  type YupResolverOptions,
  yupResolver,
  type ZodResolverIssue,
  type ZodResolverOptions,
  zodResolver,
} from './core/resolvers';
export type {
  ResolverAdapterOptions,
  ResolverErrorMode,
  ResolverIssueContext,
  ResolverIssueMapResult,
  ResolverPathInput,
} from './core/resolvers/types';
export type {
  AsyncDependencyShape,
  AsyncOptionsConfig,
  UseAsyncOptionsReturn,
} from './hooks/shared/useAsyncOptions';
export { useAsyncOptions } from './hooks/shared/useAsyncOptions';
export {
  type AnalyticsHandlers,
  type AnalyticsOptions,
  FormAnalyticsTracker,
  useFormBridgeAnalytics,
} from './hooks/shared/useFormAnalytics';
export {
  type UseReadonlyFormOptions,
  type UseReadonlyFormReturn,
  useReadonlyFormBridge,
} from './hooks/shared/useReadonlyForm';
export {
  type UseDynamicFormOptions,
  type UseDynamicFormReturn,
  useDynamicForm,
} from './hooks/useDynamicForm.native';
export { useFormBridge } from './hooks/useFormBridge.native';
export {
  type UseFormWizardOptions,
  type UseFormWizardReturn,
  useFormWizard,
  type WizardStep,
  type WizardStepChangeEvent,
  type WizardStepChangeReason,
} from './hooks/useFormWizard.native';
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
