import type {
  FormSchema,
  FieldErrorProps as SharedErrorMessageProps,
  FormComponent as SharedFormComponent,
  FormProps as SharedFormProps,
  FieldLabelProps as SharedLabelProps,
  UseFormBridgeReturn as SharedUseFormBridgeReturn,
  UseFormBridgeOptions as SharedUseFormOptions,
} from './types';

export type {
  AsyncValidator,
  BridgeResult,
  FieldController,
  FieldReference,
  FieldRenderProps,
  FileValue,
  FocusableFieldHandle,
  FormSchema,
  FormState,
  FormStatus,
  MaskedFieldController,
  OptionsFetcher,
  OptionsFetcherContext,
  OtpFieldController,
  PasswordRule,
  PhoneCountryLayout,
  PhoneValue,
  SchemaValidatorBridge,
  SchemaValues,
  SelectOption,
  SelectPickerRenderContext,
  StrengthConfig,
  StrengthResult,
  StrengthRuleConfig,
  StrengthScoreLevel,
  SyncValidator,
  ValidationContext,
  ValidationErrorMap,
  ValidationIssue,
  ValidationIssueInput,
  ValidationPath,
  ValidationPathSegment,
  ValidationResult,
  ValidationTrigger,
  Validator,
  ValidatorResult,
} from './types';
export type { FieldAutoComplete } from './types/autoComplete';

export type FormProps<S extends FormSchema> = SharedFormProps<S, 'native'>;
export type FormComponent<S extends FormSchema> = SharedFormComponent<S, 'native'>;
export type UseFormBridgeOptions<S extends FormSchema> = SharedUseFormOptions<
  S,
  'native'
>;
export type FieldErrorProps<S extends FormSchema> = SharedErrorMessageProps<S, 'native'>;
export type FieldLabelProps<S extends FormSchema> = SharedLabelProps<S, 'native'>;
export type UseFormBridgeReturn<S extends FormSchema> = SharedUseFormBridgeReturn<
  S,
  'native'
>;
