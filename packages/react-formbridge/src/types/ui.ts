import type { EmptyProps, FieldType, Platform, PlatformStyleValue } from './field';
import type { FormSchema, SchemaFieldType, SchemaShape } from './schema';
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

/**
 * Cross-platform union of every field-level UI override shape. Used as the
 * default for generic helpers that don't care about the platform.
 */
export type FieldPropsOverrides = WebFieldPropsOverrides | NativeFieldPropsOverrides;

/**
 * Style + className slot shared by every field. Used as a building block for
 * {@link ExtraFieldProps} and {@link FieldTheme}.
 *
 * @typeParam TProps - Extra per-field override props merged in.
 * @typeParam TPlatform - `'web'` or `'native'`.
 */
export type FieldStyleProps<
  TProps = FieldPropsOverrides,
  TPlatform extends Platform = Platform,
> = (TPlatform extends 'web'
  ? {
      /** Forwarded to the field wrapper on platforms that support it. */
      className?: string;
    }
  : EmptyProps) & {
  /** Forwarded to the field wrapper. */
  style?: PlatformStyleValue<TPlatform>;
} & TProps;

/**
 * Full props accepted by an auto-rendered `<form.fields.*>` component.
 *
 * Extends {@link FieldStyleProps} with schema-overriding slots (`label`,
 * `placeholder`, `hint`) plus any type-specific overrides `TProps` declares.
 *
 * @typeParam TProps - Type-specific field overrides (e.g. `WebTextFieldPropsOverrides`).
 * @typeParam TPlatform - `'web'` or `'native'`.
 */
export type ExtraFieldProps<
  TProps = FieldPropsOverrides,
  TPlatform extends Platform = Platform,
> = FieldStyleProps<TProps, TPlatform> & {
  /** Override the label defined in the schema. */
  label?: string;
  /** Override the placeholder defined in the schema. */
  placeholder?: string;
  /** Override the hint defined in the schema. */
  hint?: string;
};

/**
 * Theming shape used by `globalConfigs` and similar "apply to every field"
 * config points. Same building blocks as {@link FieldStyleProps} but no
 * per-field overrides (label/placeholder/hint) — those must stay local.
 *
 * @typeParam TProps - Extra per-field override props merged in.
 * @typeParam TPlatform - `'web'` or `'native'`.
 */
export type FieldTheme<
  TProps = FieldPropsOverrides,
  TPlatform extends Platform = Platform,
> = (TPlatform extends 'web' ? { className?: string } : EmptyProps) & {
  /** Base style applied to every field. */
  style?: PlatformStyleValue<TPlatform>;
} & TProps;

// ─── Platform form / submit overrides ───────────────────────────────────────────

/** Cross-platform union of form-level UI overrides (`globalConfigs.form`). */
export type FormPropsOverrides = WebFormPropsOverrides | NativeFormPropsOverrides;

/** Cross-platform union of submit-button UI overrides (`globalConfigs.submit`). */
export type SubmitPropsOverrides = WebSubmitPropsOverrides | NativeSubmitPropsOverrides;

/**
 * Form-level override type resolved to a single platform.
 * @typeParam TPlatform - `'web'` or `'native'`.
 */
export type PlatformFormPropsOverrides<TPlatform extends Platform> =
  TPlatform extends 'web' ? WebFormPropsOverrides : NativeFormPropsOverrides;

/**
 * Submit-button override type resolved to a single platform.
 * @typeParam TPlatform - `'web'` or `'native'`.
 */
export type PlatformSubmitPropsOverrides<TPlatform extends Platform> =
  TPlatform extends 'web' ? WebSubmitPropsOverrides : NativeSubmitPropsOverrides;

/**
 * Global (applies to *every* field) override type resolved to a single
 * platform. Used by `globalConfigs.field`.
 *
 * @typeParam TPlatform - `'web'` or `'native'`.
 */
export type PlatformGlobalFieldPropsOverrides<TPlatform extends Platform> =
  TPlatform extends 'web'
    ? WebGlobalFieldPropsOverrides
    : NativeGlobalFieldPropsOverrides;

/**
 * Union of every per-type field override for a single platform. Rarely
 * needed directly — prefer {@link PlatformFieldPropsForType} to narrow by
 * field type.
 *
 * @typeParam TPlatform - `'web'` or `'native'`.
 */
export type PlatformFieldPropsOverrides<TPlatform extends Platform> =
  TPlatform extends 'web' ? WebFieldPropsOverrides : NativeFieldPropsOverrides;

// ─── Per-type platform field UI resolution ──────────────────────────────────────

/**
 * Resolves to the exact override shape for a given `(platform, fieldType)`
 * pair — e.g. `PlatformFieldPropsForType<'web', 'select'>` resolves to
 * `WebSelectFieldPropsOverrides | WebAsyncAutocompleteFieldPropsOverrides`.
 *
 * Used by {@link FieldPropsForSchemaEntry} to give each `<form.fields.*>`
 * component exactly the props its field type supports.
 *
 * @typeParam TPlatform - `'web'` or `'native'`.
 * @typeParam TType - The concrete {@link FieldType}.
 */
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

/**
 * Props accepted by the auto-rendered component for a given schema entry on a
 * given platform. This is how `<form.fields.email>` knows it can take an
 * `autoComplete` prop but `<form.fields.file>` takes `accept`/`maxFileSize`.
 *
 * @typeParam TEntry - A schema entry (descriptor or builder).
 * @typeParam TPlatform - `'web'` or `'native'`.
 */
export type FieldPropsForSchemaEntry<
  TEntry,
  TPlatform extends Platform,
> = ExtraFieldProps<
  PlatformFieldPropsForType<TPlatform, SchemaFieldType<TEntry>>,
  TPlatform
>;

/**
 * Callable shape for a single auto-rendered field component. Props are
 * optional (every field can be rendered with schema defaults) and the
 * component may return `null` if the field is hidden by conditions.
 */
export type FieldComponent<TProps = ExtraFieldProps> = (
  props?: TProps,
) => React.ReactElement | null;

/**
 * Strongly-typed map of auto-rendered field components — one entry per schema
 * key. Exposed on the hook as `.fields`.
 *
 * @typeParam S - The form schema.
 * @typeParam TPlatform - `'web'` or `'native'`.
 */
export type FieldComponents<
  S extends FormSchema,
  TPlatform extends Platform = Platform,
> = {
  [K in keyof SchemaShape<S>]: FieldComponent<
    FieldPropsForSchemaEntry<SchemaShape<S>[K], TPlatform>
  >;
};

// ─── Global UI options ──────────────────────────────────────────────────────────

/**
 * Shape returned by the `globalConfigs(state)` selector on `useFormBridge`
 * options. Lets you theme *every* rendered field, the form wrapper, and the
 * submit button in one place, reactively from form state.
 *
 * @typeParam TPlatform - `'web'` or `'native'`.
 */
export type FormBridgeOptions<TPlatform extends Platform = Platform> = {
  /** Overrides applied to every rendered field. */
  field?: Omit<
    FieldTheme<PlatformGlobalFieldPropsOverrides<TPlatform>, TPlatform>,
    'autoComplete' | 'autoFocus' | 'enterKeyHint' | 'spellCheck' | 'id'
  >;
  /** Overrides applied to the `<Form>` wrapper. */
  form?: PlatformFormPropsOverrides<TPlatform>;
  /** Overrides applied to `Form.Submit`. */
  submit?: PlatformSubmitPropsOverrides<TPlatform>;
};
