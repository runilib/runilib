import type {
  FormSchema,
  NativeFieldUiOverrides,
  NativeFormUiOverrides,
  NativeGlobalFieldUiOverrides,
  NativeSubmitUiOverrides,
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
  NativeAsyncAutocompleteFieldUiOverrides,
  NativeCheckboxFieldUiOverrides,
  NativeFieldSlot,
  NativeFileFieldUiOverrides,
  NativeGlobalFieldUiOverrides,
  NativeOtpFieldUiOverrides,
  NativePasswordFieldUiOverrides,
  NativePhoneFieldUiOverrides,
  NativeSelectFieldUiOverrides,
  NativeStyleValue,
  NativeSwitchFieldUiOverrides,
  NativeTextFieldUiOverrides,
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
} from './types';

export type FieldUiOverrides = NativeFieldUiOverrides;
export type FieldStyleProps<TUi = NativeFieldUiOverrides> = SharedFieldStyleProps<
  TUi,
  'native'
>;
export type ExtraFieldProps<TUi = NativeFieldUiOverrides> = SharedExtraFieldProps<
  TUi,
  'native'
>;
export type FieldTheme<TUi = NativeGlobalFieldUiOverrides> = SharedFieldTheme<
  TUi,
  'native'
>;
export type FormProps<S extends FormSchema> = SharedFormProps<S, 'native'>;
export type FormComponent<S extends FormSchema> = SharedFormComponent<S, 'native'>;
export type SubmitButtonProps = SharedSubmitButtonProps<'native'>;
export type SubmitButtonComponent = SharedSubmitButtonComponent<'native'>;
export type FieldComponent<TProps = ExtraFieldProps> = SharedFieldComponent<TProps>;
export type FieldComponents<S extends FormSchema> = SharedFieldComponents<S, 'native'>;
export type FormUiOverrides = NativeFormUiOverrides;
export type SubmitUiOverrides = NativeSubmitUiOverrides;
export type FormBridgeUiOptions = SharedFormBridgeUiOptions<'native'>;
export type UseFormOptions<S extends FormSchema> = SharedUseFormOptions<S, 'native'>;
export type UseFormBridgeReturn<S extends FormSchema> = SharedUseFormBridgeReturn<
  S,
  'native'
>;
