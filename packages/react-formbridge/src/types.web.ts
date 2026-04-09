import type {
  FormSchema,
  FieldErrorProps as SharedErrorMessageProps,
  ExtraFieldProps as SharedExtraFieldProps,
  FieldComponent as SharedFieldComponent,
  FieldComponents as SharedFieldComponents,
  FieldStyleProps as SharedFieldStyleProps,
  FieldTheme as SharedFieldTheme,
  FormBridgeUiOptions as SharedFormBridgeUiOptions,
  FormComponent as SharedFormComponent,
  FormProps as SharedFormProps,
  FieldLabelProps as SharedLabelProps,
  SubmitButtonComponent as SharedSubmitButtonComponent,
  SubmitButtonProps as SharedSubmitButtonProps,
  UseFormBridgeReturn as SharedUseFormBridgeReturn,
  UseFormOptions as SharedUseFormOptions,
  WebFieldUiOverrides,
  WebFormUiOverrides,
  WebGlobalFieldUiOverrides,
  WebSubmitUiOverrides,
} from './types';

export type {
  AsyncValidator,
  FieldBehaviorConfig,
  FieldController,
  FieldDescriptor,
  FieldRenderHandlers,
  FieldRenderProps,
  FieldRenderState,
  FieldState,
  FieldStyleValue,
  FieldType,
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
  Platform,
  PlatformStyleValue,
  ResolvedFieldDescriptor,
  ResolverResult,
  SchemaFieldType,
  SchemaResolver,
  SchemaValues,
  SelectOption,
  SelectPickerRenderContext,
  StrengthConfig,
  StrengthResult,
  StrengthRuleConfig,
  StrengthScoreLevel,
  SyncValidator,
  ValidationTrigger,
  Validator,
  WebAsyncAutocompleteFieldUiOverrides,
  WebCheckboxFieldUiOverrides,
  WebFieldSlot,
  WebFieldUiOverrides,
  WebFileFieldItemRenderContext,
  WebFileFieldRenderContext,
  WebFileFieldUiOverrides,
  WebGlobalFieldUiOverrides,
  WebOtpFieldUiOverrides,
  WebPasswordFieldRenderContext,
  WebPasswordFieldRuleRenderContext,
  WebPasswordFieldUiOverrides,
  WebPhoneFieldCountryItemRenderContext,
  WebPhoneFieldRenderContext,
  WebPhoneFieldUiOverrides,
  WebRadioFieldUiOverrides,
  WebSelectFieldUiOverrides,
  WebSwitchFieldUiOverrides,
  WebTextareaFieldUiOverrides,
  WebTextFieldUiOverrides,
} from './types';
export type { FieldAutoComplete } from './types/autoComplete';

export type FieldUiOverrides = WebFieldUiOverrides;
export type FieldStyleProps<TUi = WebFieldUiOverrides> = SharedFieldStyleProps<
  TUi,
  'web'
>;
export type ExtraFieldProps<TUi = WebFieldUiOverrides> = SharedExtraFieldProps<
  TUi,
  'web'
>;
export type FieldTheme<TUi = WebGlobalFieldUiOverrides> = SharedFieldTheme<TUi, 'web'>;
export type FormProps<S extends FormSchema> = SharedFormProps<S, 'web'>;
export type FormComponent<S extends FormSchema> = SharedFormComponent<S, 'web'>;
export type SubmitButtonProps = SharedSubmitButtonProps<'web'>;
export type SubmitButtonComponent = SharedSubmitButtonComponent<'web'>;
export type FieldComponent<TProps = ExtraFieldProps> = SharedFieldComponent<TProps>;
export type FieldComponents<S extends FormSchema> = SharedFieldComponents<S, 'web'>;
export type FormUiOverrides = WebFormUiOverrides;
export type SubmitUiOverrides = WebSubmitUiOverrides;
export type FormBridgeUiOptions = SharedFormBridgeUiOptions<'web'>;
export type UseFormOptions<S extends FormSchema> = SharedUseFormOptions<S, 'web'>;
export type FieldErrorProps<S extends FormSchema> = SharedErrorMessageProps<S, 'web'>;
export type FieldLabelProps<S extends FormSchema> = SharedLabelProps<S, 'web'>;
export type UseFormBridgeReturn<S extends FormSchema> = SharedUseFormBridgeReturn<
  S,
  'web'
>;
