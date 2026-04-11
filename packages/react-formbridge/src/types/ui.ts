import type { EmptyProps, FieldType, Platform, PlatformStyleValue } from './field';
import type { FormSchema, SchemaFieldType } from './schema';
import type {
  NativeAsyncAutocompleteFieldPropsOverrides,
  NativeCheckboxFieldPropsOverrides,
  NativeFieldPropsOverrides,
  NativeFileFieldPropsOverrides,
  NativeFormPropsOverrides,
  NativeGlobalFieldPropsOverrides,
  NativeOtpFieldPropsOverrides,
  NativePasswordFieldPropsOverrides,
  NativePhoneFieldPropsOverrides,
  NativeSelectFieldPropsOverrides,
  NativeSubmitPropsOverrides,
  NativeSwitchFieldPropsOverrides,
  NativeTextFieldPropsOverrides,
} from './ui-native';
import type {
  WebAsyncAutocompleteFieldPropsOverrides,
  WebCheckboxFieldPropsOverrides,
  WebFieldPropsOverrides,
  WebFileFieldPropsOverrides,
  WebFormPropsOverrides,
  WebGlobalFieldPropsOverrides,
  WebOtpFieldPropsOverrides,
  WebPasswordFieldPropsOverrides,
  WebPhoneFieldPropsOverrides,
  WebRadioFieldPropsOverrides,
  WebSelectFieldPropsOverrides,
  WebSubmitPropsOverrides,
  WebSwitchFieldPropsOverrides,
  WebTextareaFieldPropsOverrides,
  WebTextFieldPropsOverrides,
} from './ui-web';

// ─── Combined overrides ─────────────────────────────────────────────────────────

export type FieldPropsOverrides = WebFieldPropsOverrides | NativeFieldPropsOverrides;

export type FieldStyleProps<
  TProps = FieldPropsOverrides,
  TPlatform extends Platform = Platform,
> = (TPlatform extends 'web'
  ? {
      /** Forwarded to the field root on platforms that support it. */
      className?: string;
    }
  : EmptyProps) & {
  /** Forwarded to the field root. */
  style?: PlatformStyleValue<TPlatform>;
} & TProps;

export type ExtraFieldProps<
  TProps = FieldPropsOverrides,
  TPlatform extends Platform = Platform,
> = FieldStyleProps<TProps, TPlatform> & {
  /** Override the label defined in the schema */
  label?: string;
  /** Override placeholder */
  placeholder?: string;
  /** Override hint */
  hint?: string;
};

export type FieldTheme<
  TProps = FieldPropsOverrides,
  TPlatform extends Platform = Platform,
> = (TPlatform extends 'web' ? { className?: string } : EmptyProps) & {
  style?: PlatformStyleValue<TPlatform>;
} & TProps;

// ─── Platform form / submit overrides ───────────────────────────────────────────

export type FormPropsOverrides = WebFormPropsOverrides | NativeFormPropsOverrides;

export type SubmitPropsOverrides = WebSubmitPropsOverrides | NativeSubmitPropsOverrides;

export type PlatformFormPropsOverrides<TPlatform extends Platform> =
  TPlatform extends 'web' ? WebFormPropsOverrides : NativeFormPropsOverrides;

export type PlatformSubmitPropsOverrides<TPlatform extends Platform> =
  TPlatform extends 'web' ? WebSubmitPropsOverrides : NativeSubmitPropsOverrides;

export type PlatformGlobalFieldPropsOverrides<TPlatform extends Platform> =
  TPlatform extends 'web'
    ? WebGlobalFieldPropsOverrides
    : NativeGlobalFieldPropsOverrides;

export type PlatformFieldPropsOverrides<TPlatform extends Platform> =
  TPlatform extends 'web' ? WebFieldPropsOverrides : NativeFieldPropsOverrides;

// ─── Per-type platform field UI resolution ──────────────────────────────────────

export type PlatformFieldPropsForType<
  TPlatform extends Platform,
  TType extends FieldType,
> = TPlatform extends 'web'
  ? TType extends 'textarea'
    ? WebTextareaFieldPropsOverrides
    : TType extends 'checkbox'
      ? WebCheckboxFieldPropsOverrides
      : TType extends 'switch'
        ? WebSwitchFieldPropsOverrides
        : TType extends 'select'
          ? WebSelectFieldPropsOverrides | WebAsyncAutocompleteFieldPropsOverrides
          : TType extends 'radio'
            ? WebRadioFieldPropsOverrides
            : TType extends 'otp'
              ? WebOtpFieldPropsOverrides
              : TType extends 'password'
                ? WebPasswordFieldPropsOverrides
                : TType extends 'phone'
                  ? WebPhoneFieldPropsOverrides
                  : TType extends 'file'
                    ? WebFileFieldPropsOverrides
                    : TType extends 'custom'
                      ? WebGlobalFieldPropsOverrides
                      : WebTextFieldPropsOverrides
  : TType extends 'checkbox'
    ? NativeCheckboxFieldPropsOverrides
    : TType extends 'switch'
      ? NativeSwitchFieldPropsOverrides
      : TType extends 'select'
        ? NativeSelectFieldPropsOverrides | NativeAsyncAutocompleteFieldPropsOverrides
        : TType extends 'radio'
          ? NativeSelectFieldPropsOverrides
          : TType extends 'otp'
            ? NativeOtpFieldPropsOverrides
            : TType extends 'password'
              ? NativePasswordFieldPropsOverrides
              : TType extends 'phone'
                ? NativePhoneFieldPropsOverrides
                : TType extends 'file'
                  ? NativeFileFieldPropsOverrides
                  : TType extends 'custom'
                    ? NativeGlobalFieldPropsOverrides
                    : NativeTextFieldPropsOverrides;

// ─── Field component types ──────────────────────────────────────────────────────

export type FieldPropsForSchemaEntry<
  TEntry,
  TPlatform extends Platform,
> = ExtraFieldProps<
  PlatformFieldPropsForType<TPlatform, SchemaFieldType<TEntry>>,
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

export type FormBridgeOptions<TPlatform extends Platform = Platform> = {
  field?: FieldTheme<PlatformGlobalFieldPropsOverrides<TPlatform>, TPlatform>;
  form?: PlatformFormPropsOverrides<TPlatform>;
  submit?: PlatformSubmitPropsOverrides<TPlatform>;
};
