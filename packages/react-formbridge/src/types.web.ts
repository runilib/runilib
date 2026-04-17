import type {
  FormSchema,
  FieldErrorProps as SharedErrorMessageProps,
  ExtraFieldProps as SharedExtraFieldProps,
  FieldComponent as SharedFieldComponent,
  FieldComponents as SharedFieldComponents,
  FieldStyleProps as SharedFieldStyleProps,
  FieldTheme as SharedFieldTheme,
  FormBridgeOptions as SharedFormBridgeOptions,
  FormComponent as SharedFormComponent,
  FormProps as SharedFormProps,
  FieldLabelProps as SharedLabelProps,
  SubmitButtonComponent as SharedSubmitButtonComponent,
  SubmitButtonProps as SharedSubmitButtonProps,
  UseFormBridgeReturn as SharedUseFormBridgeReturn,
  UseFormBridgeOptions as SharedUseFormOptions,
  WebFieldPropsOverrides,
  WebFormPropsOverrides,
  WebGlobalFieldPropsOverrides,
  WebSubmitPropsOverrides,
} from './types';

export type {
  AsyncValidator,
  FieldController,
  FieldReference,
  FieldRenderProps,
  FileValue,
  FocusableFieldHandle,
  FormSchema,
  FormState,
  FormStatus,
  OptionsFetcher,
  OptionsFetcherContext,
  PasswordRule,
  PhoneCountryLayout,
  PhoneValue,
  ResolverResult,
  SchemaValidatorResolver,
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
  WebFileFieldItemRenderContext,
  WebFileFieldRenderContext,
  WebPasswordFieldRenderContext,
  WebPasswordFieldRuleRenderContext,
  WebPhoneFieldCountryItemRenderContext,
  WebPhoneFieldRenderContext,
} from './types';
export type { FieldAutoComplete } from './types/autoComplete';

export type FieldPropsOverrides = WebFieldPropsOverrides;
export type GlobalFieldPropsOverrides = WebGlobalFieldPropsOverrides;
export type FormPropsOverrides = WebFormPropsOverrides;
export type SubmitPropsOverrides = WebSubmitPropsOverrides;
export type FieldStyleProps<TProps = FieldPropsOverrides> = SharedFieldStyleProps<
  TProps,
  'web'
>;
export type ExtraFieldProps<TProps = FieldPropsOverrides> = SharedExtraFieldProps<
  TProps,
  'web'
>;
export type FieldTheme<TProps = GlobalFieldPropsOverrides> = SharedFieldTheme<
  TProps,
  'web'
>;
export type FormProps<S extends FormSchema> = SharedFormProps<S, 'web'>;
export type FormComponent<S extends FormSchema> = SharedFormComponent<S, 'web'>;
export type SubmitButtonProps = SharedSubmitButtonProps<'web'>;
export type SubmitButtonComponent = SharedSubmitButtonComponent<'web'>;
export type FieldComponent<TProps = ExtraFieldProps> = SharedFieldComponent<TProps>;
export type FieldComponents<S extends FormSchema> = SharedFieldComponents<S, 'web'>;
export type GlobaleDefaultsProps = SharedFormBridgeOptions<'web'>;
export type UseFormBridgeOptions<S extends FormSchema> = SharedUseFormOptions<S, 'web'>;
export type FieldErrorProps<S extends FormSchema> = SharedErrorMessageProps<S, 'web'>;
export type FieldLabelProps<S extends FormSchema> = SharedLabelProps<S, 'web'>;
export type UseFormBridgeReturn<S extends FormSchema> = SharedUseFormBridgeReturn<
  S,
  'web'
>;
