// ─── Barrel re-export ───────────────────────────────────────────────────────────
// All types are organized into domain-specific files and re-exported here
// so that existing `from '../types/types'` imports continue to work.
// ─────────────────────────────────────────────────────────────────────────────────

export type { FileSourceType, FileValue } from '../core/field-descriptors/file/types';
export type {
  PasswordRule,
  StrengthConfig,
  StrengthResult,
  StrengthRuleConfig,
  StrengthScoreLevel,
} from '../core/field-descriptors/password/types';
export type { PhoneValue } from '../core/field-descriptors/phone/countries';
export type { PhoneCountryLayout } from '../core/field-descriptors/phone/types';
export type {
  AsyncValidator,
  EmptyProps,
  FieldDescriptor,
  FieldRenderersProps,
  FieldRenderHandlers,
  FieldRenderProps,
  FieldRenderState,
  FieldState,
  FieldStyleValue,
  FieldType,
  ISelectOption,
  NativeStyleValue,
  Platform,
  PlatformStyleValue,
  SelectOption,
  SelectPickerRenderContext,
  SyncValidator,
  Validator,
} from './field';
export type {
  BaseFormProps,
  FieldController,
  FieldErrorComponent,
  FieldErrorProps,
  FieldLabelProps,
  FocusableFieldHandle,
  FormComponent,
  FormProps,
  MaskedFieldController,
  OtpFieldController,
  UseFormBridgeReturn,
} from './form';
export type {
  BridgeResult,
  OptionsFetcher,
  OptionsFetcherContext,
  SchemaValidatorBridge,
  UseFormBridgeOptions,
  ValidationTrigger,
} from './options';
export type {
  FormSchema,
  FormSchemaEntry,
  FormState,
  FormStatus,
  ResolvedFieldDescriptor,
  SchemaFieldType,
  SchemaShape,
  SchemaValues,
} from './schema';
export type {
  FieldReference,
  ValidationContext,
  ValidationErrorMap,
  ValidationIssue,
  ValidationIssueInput,
  ValidationPath,
  ValidationPathSegment,
  ValidationResult,
  ValidatorResult,
} from './validation';
