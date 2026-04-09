import type { EmptyProps, FieldType, Platform, PlatformStyleValue } from './field';
import type { FormSchema, SchemaFieldType } from './schema';
import type {
  NativeAsyncAutocompleteFieldUiOverrides,
  NativeCheckboxFieldUiOverrides,
  NativeFieldUiOverrides,
  NativeFileFieldUiOverrides,
  NativeFormUiOverrides,
  NativeGlobalFieldUiOverrides,
  NativeOtpFieldUiOverrides,
  NativePasswordFieldUiOverrides,
  NativePhoneFieldUiOverrides,
  NativeSelectFieldUiOverrides,
  NativeSubmitUiOverrides,
  NativeSwitchFieldUiOverrides,
  NativeTextFieldUiOverrides,
} from './ui-native';
import type {
  WebAsyncAutocompleteFieldUiOverrides,
  WebCheckboxFieldUiOverrides,
  WebFieldUiOverrides,
  WebFileFieldUiOverrides,
  WebFormUiOverrides,
  WebGlobalFieldUiOverrides,
  WebOtpFieldUiOverrides,
  WebPasswordFieldUiOverrides,
  WebPhoneFieldUiOverrides,
  WebRadioFieldUiOverrides,
  WebSelectFieldUiOverrides,
  WebSubmitUiOverrides,
  WebSwitchFieldUiOverrides,
  WebTextareaFieldUiOverrides,
  WebTextFieldUiOverrides,
} from './ui-web';

// ─── Combined overrides ─────────────────────────────────────────────────────────

export type FieldUiOverrides = WebFieldUiOverrides | NativeFieldUiOverrides;

export type FieldStyleProps<
  TUi = FieldUiOverrides,
  TPlatform extends Platform = Platform,
> = (TPlatform extends 'web'
  ? {
      /** Forwarded to the field root on platforms that support it. */
      className?: string;
    }
  : EmptyProps) & {
  /** Forwarded to the field root. */
  style?: PlatformStyleValue<TPlatform>;
} & TUi;

export type ExtraFieldProps<
  TUi = FieldUiOverrides,
  TPlatform extends Platform = Platform,
> = FieldStyleProps<TUi, TPlatform> & {
  /** Override the label defined in the schema */
  label?: string;
  /** Override placeholder */
  placeholder?: string;
  /** Override hint */
  hint?: string;
};

export type FieldTheme<
  TUi = FieldUiOverrides,
  TPlatform extends Platform = Platform,
> = (TPlatform extends 'web' ? { className?: string } : EmptyProps) & {
  style?: PlatformStyleValue<TPlatform>;
} & TUi;

// ─── Platform form / submit overrides ───────────────────────────────────────────

export type FormUiOverrides = WebFormUiOverrides | NativeFormUiOverrides;

export type SubmitUiOverrides = WebSubmitUiOverrides | NativeSubmitUiOverrides;

export type PlatformFormUiOverrides<TPlatform extends Platform> = TPlatform extends 'web'
  ? WebFormUiOverrides
  : NativeFormUiOverrides;

export type PlatformSubmitUiOverrides<TPlatform extends Platform> =
  TPlatform extends 'web' ? WebSubmitUiOverrides : NativeSubmitUiOverrides;

export type PlatformGlobalFieldUiOverrides<TPlatform extends Platform> =
  TPlatform extends 'web' ? WebGlobalFieldUiOverrides : NativeGlobalFieldUiOverrides;

export type PlatformFieldUiOverrides<TPlatform extends Platform> = TPlatform extends 'web'
  ? WebFieldUiOverrides
  : NativeFieldUiOverrides;

// ─── Per-type platform field UI resolution ──────────────────────────────────────

export type PlatformFieldUiForType<
  TPlatform extends Platform,
  TType extends FieldType,
> = TPlatform extends 'web'
  ? TType extends 'textarea'
    ? WebTextareaFieldUiOverrides
    : TType extends 'checkbox'
      ? WebCheckboxFieldUiOverrides
      : TType extends 'switch'
        ? WebSwitchFieldUiOverrides
        : TType extends 'select'
          ? WebSelectFieldUiOverrides | WebAsyncAutocompleteFieldUiOverrides
          : TType extends 'radio'
            ? WebRadioFieldUiOverrides
            : TType extends 'otp'
              ? WebOtpFieldUiOverrides
              : TType extends 'password'
                ? WebPasswordFieldUiOverrides
                : TType extends 'phone'
                  ? WebPhoneFieldUiOverrides
                  : TType extends 'file'
                    ? WebFileFieldUiOverrides
                    : TType extends 'custom'
                      ? WebGlobalFieldUiOverrides
                      : WebTextFieldUiOverrides
  : TType extends 'checkbox'
    ? NativeCheckboxFieldUiOverrides
    : TType extends 'switch'
      ? NativeSwitchFieldUiOverrides
      : TType extends 'select'
        ? NativeSelectFieldUiOverrides | NativeAsyncAutocompleteFieldUiOverrides
        : TType extends 'radio'
          ? NativeSelectFieldUiOverrides
          : TType extends 'otp'
            ? NativeOtpFieldUiOverrides
            : TType extends 'password'
              ? NativePasswordFieldUiOverrides
              : TType extends 'phone'
                ? NativePhoneFieldUiOverrides
                : TType extends 'file'
                  ? NativeFileFieldUiOverrides
                  : TType extends 'custom'
                    ? NativeGlobalFieldUiOverrides
                    : NativeTextFieldUiOverrides;

// ─── Field component types ──────────────────────────────────────────────────────

export type FieldPropsForSchemaEntry<
  TEntry,
  TPlatform extends Platform,
> = ExtraFieldProps<
  PlatformFieldUiForType<TPlatform, SchemaFieldType<TEntry>>,
  TPlatform
>;

export type FieldComponent<TProps = ExtraFieldProps> = (
  props?: TProps,
) => React.ReactElement | null;

export type FieldComponents<
  S extends FormSchema,
  TPlatform extends Platform = Platform,
> = {
  [K in keyof S]: FieldComponent<FieldPropsForSchemaEntry<S[K], TPlatform>>;
};

// ─── Global UI options ──────────────────────────────────────────────────────────

export type FormBridgeUiOptions<TPlatform extends Platform = Platform> = {
  field?: FieldTheme<PlatformGlobalFieldUiOverrides<TPlatform>, TPlatform>;
  form?: PlatformFormUiOverrides<TPlatform>;
  submit?: PlatformSubmitUiOverrides<TPlatform>;
};
