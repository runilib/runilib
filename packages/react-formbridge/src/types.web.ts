import type {
  FormSchema,
  ExtraFieldProps as SharedExtraFieldProps,
  FieldComponent as SharedFieldComponent,
  FieldComponents as SharedFieldComponents,
  FieldStyleProps as SharedFieldStyleProps,
  FieldTheme as SharedFieldTheme,
  FormBridgeUiOptions as SharedFormBridgeUiOptions,
  FormComponent as SharedFormComponent,
  FormProps as SharedFormProps,
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
  FieldDescriptor,
  FieldRenderProps,
  FieldState,
  FieldStyleValue,
  FieldType,
  FormSchema,
  FormState,
  FormStatus,
  OptionsFetcher,
  OptionsFetcherContext,
  Platform,
  PlatformStyleValue,
  ResolvedFieldDescriptor,
  ResolverResult,
  SchemaFieldType,
  SchemaResolver,
  SchemaValues,
  SelectOption,
  SelectPickerRenderContext,
  SyncValidator,
  ValidationTrigger,
  Validator,
  WebAsyncAutocompleteFieldUiOverrides,
  WebCheckboxFieldUiOverrides,
  WebFieldSlot,
  WebFieldUiOverrides,
  WebFileFieldUiOverrides,
  WebGlobalFieldUiOverrides,
  WebOtpFieldUiOverrides,
  WebPasswordFieldUiOverrides,
  WebPhoneFieldUiOverrides,
  WebRadioFieldUiOverrides,
  WebSelectFieldUiOverrides,
  WebSwitchFieldUiOverrides,
  WebTextareaFieldUiOverrides,
  WebTextFieldUiOverrides,
} from './types';

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
export type UseFormBridgeReturn<S extends FormSchema> = SharedUseFormBridgeReturn<
  S,
  'web'
>;
