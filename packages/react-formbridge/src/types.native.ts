import type {
  FormSchema,
  NativeFieldPropsOverrides,
  NativeFormPropsOverrides,
  NativeGlobalFieldPropsOverrides,
  NativeSubmitPropsOverrides,
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
  UseFormOptions as SharedUseFormOptions,
} from './types';

export type {
  AsyncValidator,
  FieldController,
  FieldRenderProps,
  FileValue,
  FocusableFieldHandle,
  FormSchema,
  FormState,
  FormStatus,
  NativeFileFieldItemRenderContext,
  NativeFileFieldRenderContext,
  NativePasswordFieldRenderContext,
  NativePasswordFieldRuleRenderContext,
  NativePhoneFieldCountryItemRenderContext,
  NativePhoneFieldRenderContext,
  OptionsFetcher,
  OptionsFetcherContext,
  PasswordRule,
  PhoneCountryLayout,
  PhoneValue,
  ResolverResult,
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
} from './types';
export type { FieldAutoComplete } from './types/autoComplete';

export type FieldPropsOverrides = NativeFieldPropsOverrides;
export type GlobalFieldPropsOverrides = NativeGlobalFieldPropsOverrides;
export type FormPropsOverrides = NativeFormPropsOverrides;
export type SubmitPropsOverrides = NativeSubmitPropsOverrides;
export type FieldStyleProps<TProps = FieldPropsOverrides> = SharedFieldStyleProps<
  TProps,
  'native'
>;
export type ExtraFieldProps<TProps = FieldPropsOverrides> = SharedExtraFieldProps<
  TProps,
  'native'
>;
export type FieldTheme<TProps = GlobalFieldPropsOverrides> = SharedFieldTheme<
  TProps,
  'native'
>;
export type FormProps<S extends FormSchema> = SharedFormProps<S, 'native'>;
export type FormComponent<S extends FormSchema> = SharedFormComponent<S, 'native'>;
export type SubmitButtonProps = SharedSubmitButtonProps<'native'>;
export type SubmitButtonComponent = SharedSubmitButtonComponent<'native'>;
export type FieldComponent<TProps = ExtraFieldProps> = SharedFieldComponent<TProps>;
export type FieldComponents<S extends FormSchema> = SharedFieldComponents<S, 'native'>;
export type FormBridgeOptions = SharedFormBridgeOptions<'native'>;
export type UseFormOptions<S extends FormSchema> = SharedUseFormOptions<S, 'native'>;
export type FieldErrorProps<S extends FormSchema> = SharedErrorMessageProps<S, 'native'>;
export type FieldLabelProps<S extends FormSchema> = SharedLabelProps<S, 'native'>;
export type UseFormBridgeReturn<S extends FormSchema> = SharedUseFormBridgeReturn<
  S,
  'native'
>;
