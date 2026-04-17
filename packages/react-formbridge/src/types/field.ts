import type { CSSProperties, ReactNode } from 'react';

import type { AsyncOptionsConfig } from '../hooks/shared/useAsyncOptions';
import type { ValidatorResult } from './validation';

// ─── Field types ───────────────────────────────────────────────────────────────

/**
 * All built-in field kinds FormBridge knows how to render and validate.
 *
 * Drives renderer selection (`_type` in {@link FieldDescriptor}) and determines
 * which validation primitives apply (e.g. `'email'` enables the email regex,
 * `'number'` enables numeric coercion).
 *
 * Use `'custom'` when you want to ship your own renderer via
 * `_customRender` — FormBridge still manages state, validation and events,
 * but hands the UI off to you.
 */
export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'textarea'
  | 'checkbox'
  | 'switch'
  | 'select'
  | 'radio'
  | 'date'
  | 'otp'
  | 'file'
  | 'phone'
  | 'custom';

/**
 * Target platform for a FormBridge renderer. Used as a generic parameter to
 * switch between web (`CSSProperties`, DOM events) and native (RN `StyleSheet`,
 * `TouchableOpacity`) types.
 */
export type Platform = 'web' | 'native';

/**
 * Empty object type used in conditional types when a branch contributes no
 * additional props (e.g. `TPlatform extends 'web' ? {...} : EmptyProps`).
 * Equivalent to `{}` but lint-safe.
 */
export type EmptyProps = Record<never, never>;

// ─── Style primitives ─────────────────────────────────────────────────────────

/**
 * Structural stand-in for React Native's `StyleProp<ViewStyle | TextStyle>`.
 *
 * Kept as a loose shape so `types/` stays decoupled from `react-native`:
 * - an object of style keys,
 * - a registered-style number (RN's `StyleSheet.create` returns numeric IDs),
 * - or a nested array of the above.
 */
export type NativeStyleValue =
  | Record<string, unknown>
  | number
  | Array<NativeStyleValue | null | undefined>;

/**
 * Union of every style value FormBridge accepts across both platforms.
 * Prefer {@link PlatformStyleValue} when you know the target.
 */
export type FieldStyleValue = CSSProperties | NativeStyleValue;

/**
 * Style value resolved for a specific platform:
 * - `'web'` → React's `CSSProperties`
 * - `'native'` → {@link NativeStyleValue}
 *
 * @typeParam TPlatform - The platform to resolve for.
 */
export type PlatformStyleValue<TPlatform extends Platform = Platform> =
  TPlatform extends 'web' ? CSSProperties : NativeStyleValue;

// ─── Validation ────────────────────────────────────────────────────────────────

/**
 * Synchronous validator. Return `null` when valid, or an error message string
 * to mark the field invalid. Receives the full form values so you can do
 * cross-field checks.
 *
 * @typeParam V - The validated field's value type.
 */
export type SyncValidator<V = unknown> = (
  value: V,
  allValues: Record<string, unknown>,
) => ValidatorResult;

/**
 * Async validator. Same contract as {@link SyncValidator} but returns a
 * promise — typically used for server-side checks (username availability,
 * coupon codes, …). FormBridge debounces calls via `_debounce`.
 *
 * @typeParam V - The validated field's value type.
 */
export type AsyncValidator<V = unknown> = (
  value: V,
  allValues: Record<string, unknown>,
) => Promise<ValidatorResult>;

/**
 * Any validator FormBridge can run on a field. Union of {@link SyncValidator}
 * and {@link AsyncValidator}.
 */
export type Validator<V = unknown> = SyncValidator<V> | AsyncValidator<V>;

// ─── Select option ─────────────────────────────────────────────────────────────

/**
 * Minimal shape for a select/radio option. `label` is what the user sees,
 * `value` is what goes into form state.
 */
export interface ISelectOption {
  /** Displayed text for the option. */
  label: string;
  /** Serialized value stored in form state when the option is picked. */
  value: string | number;
}

/**
 * Extensible select/radio option: {@link ISelectOption} plus any extra keys
 * (icon, description, group, …) your custom renderer needs.
 */
export type SelectOption = ISelectOption & Record<string, unknown>;

// ─── Select picker render context ──────────────────────────────────────────────

/**
 * Full context handed to custom select/radio picker renderers. Everything you
 * need to build a popover, bottom sheet, combobox, or custom radio list is in
 * here — no need to reach back into FormBridge state.
 */
export interface SelectPickerRenderContext {
  /** The platform we're rendering on (for styling or behavior branching). */
  platform: 'web' | 'native';
  /** `'select'` for dropdown-style, `'radio'` for inline radio groups. */
  fieldType: 'select' | 'radio';
  /** Whether the picker overlay/panel is currently open. */
  open: boolean;
  /** Label node to render as the picker's title or aria-label. */
  label: ReactNode;
  /** Placeholder shown when no option is selected. */
  placeholder?: string;
  /** Whether the field is marked as required in the schema. */
  required: boolean;
  /** Whether the field is disabled. */
  disabled: boolean;
  /** Whether the schema enabled client-side search filtering on options. */
  searchable: boolean;
  /** `true` while async options are being fetched. */
  loading: boolean;
  /** Current error message for the field, if any. */
  error: string | null;
  /** Current search query text (bound to {@link setSearch}). */
  search: string;
  /** All currently-visible options (after async load + search filter). */
  options: SelectOption[];
  /** The option matching the current field value, or `null` if none. */
  selectedOption: SelectOption | null;
  /** Shorthand for `selectedOption?.value`. */
  selectedValue: SelectOption['value'] | null;
  /** Human-readable label for the trigger button ("Select…", "3 items", …). */
  triggerLabel: string;
  /** Imperatively opens the picker overlay. */
  openPicker: () => void;
  /** Imperatively closes the picker overlay. */
  closePicker: () => void;
  /** Updates the search query (triggers re-filter / async re-fetch). */
  setSearch: (value: string) => void;
  /** Clears the search query in one call. */
  clearSearch: () => void;
  /**
   * Commits a selection. Accepts either a full `SelectOption` or just its
   * `value` — whichever is more convenient at the call site.
   */
  selectOption: (option: SelectOption | SelectOption['value']) => void;
}

// ─── Field descriptor ──────────────────────────────────────────────────────────

/**
 * The normalized, fully-resolved description of a single form field.
 *
 * This is what field builders compile down to and what the runtime reads at
 * render/validate/submit time. Most consumers should use the builder API
 * (`text()`, `number()`, …) rather than constructing a descriptor by hand, but
 * the type is exported for advanced custom fields.
 *
 * All property names are prefixed with `_` to signal "internal wire format" —
 * they're meant to be produced by builders, not typed by end users.
 *
 * @typeParam DV - The field's value type (e.g. `string`, `number`, `File`).
 * @typeParam FType - The concrete {@link FieldType} variant.
 */
export interface FieldDescriptor<DV = unknown, FType extends FieldType = FieldType> {
  /** Field kind — used by the runtime to pick the correct renderer. */
  _type: FType;
  /** Human-readable label rendered above/next to the input. */
  _label?: string;
  /** Placeholder text shown when the field is empty. */
  _placeholder?: string;
  /** Initial value assigned to the field on mount / reset. */
  _defaultValue: DV;
  /** `true` if the field must be filled before submission. */
  _required: boolean;
  /** Error message shown when a required field is empty. */
  _requiredMsg: string;
  /** Minimum value (numbers) or minimum length (strings). */
  _min?: number;
  /** Error message paired with {@link _min}. */
  _minMsg?: string;
  /** Maximum value (numbers) or maximum length (strings). */
  _max?: number;
  /** Error message paired with {@link _max}. */
  _maxMsg?: string;
  /** Primary regex pattern the value must match. */
  _pattern?: RegExp;
  /** Error message paired with {@link _pattern}. */
  _patternMsg?: string;
  /**
   * Accepted regex alternatives. When multiple are defined, matching *any*
   * one of them is enough to pass.
   */
  _patterns?: RegExp[];
  /** Error message paired with {@link _patterns}. */
  _patternsMsg?: string;
  /** Options list for `select` and `radio` fields. */
  _options?: SelectOption[];
  /** Digit count for OTP fields (e.g. `6` for a 6-digit code). */
  _otpLength?: number;
  /**
   * Renders each OTP cell with a masking character (e.g. `•`) while the real
   * value stays in state. Leave unset to show the typed character as-is.
   */
  _otpMaskChar?: string;
  /**
   * Group sizes for the OTP layout, e.g. `[3, 2]` renders `___-__` with a
   * non-editable separator inserted between each group. When set, the total
   * length is the sum of the sizes.
   */
  _otpGroups?: number[];
  /** Visible separator inserted between OTP groups. Defaults to `-`. */
  _otpSeparator?: string;
  /** Enables the built-in "strong password" rule set. */
  _strongPassword?: boolean;
  /** Trim whitespace from the value before validation runs. */
  _trim: boolean;
  /** Renders the field in a disabled state and skips its validation. */
  _disabled: boolean;
  /** Removes the field from the UI entirely (value still tracked). */
  _hidden: boolean;
  /** Debounce in ms applied to async validators. */
  _debounce: number;
  /** Extra sync/async validators merged with the built-in rules. */
  _validators: Validator<DV>[];
  /**
   * Immediate transform applied on every change. Must be idempotent (e.g.
   * `toUpperCase`) because it runs on every keystroke.
   */
  _transform?: (v: DV) => DV;
  /**
   * Output transform applied on blur and submit only. Safe for non-idempotent
   * logic like trimming, normalization, or parsing.
   */
  _outputTransform?: (v: DV) => DV;
  /**
   * Name of another field this one depends on (used for cross-field rules like
   * "password confirmation matches password").
   */
  _matchField?: string;
  /** Custom renderer that overrides the built-in platform renderer. */
  _customRender?: (props: FieldRenderProps<DV>) => ReactNode;
  /** Helper text displayed below the field. */
  _hint?: string;
  /** Max accepted file size in bytes (file fields). */
  _maxFileSize?: number;
  /** Accepted MIME types / extensions for file inputs (e.g. `['image/*']`). */
  _accept?: string[];
  /**
   * Config for loading options asynchronously from a URL or function — see
   * {@link AsyncOptionsConfig}. Applies to `select` and `radio` fields.
   */
  _asyncOptions?: AsyncOptionsConfig<Record<string, unknown>>;
  /**
   * Enables client-side filtering of options via a search input inside the
   * picker.
   */
  _searchable?: boolean;
}

// ─── Per-field runtime state ───────────────────────────────────────────────────

/**
 * Runtime state for a single field, as kept inside the form store. This is the
 * raw shape — renderers see the richer {@link FieldRenderState}.
 *
 * @typeParam V - The field's value type.
 */
export interface FieldState<V = unknown> {
  /** Current value. */
  value: V;
  /** Current error message, or `null` if the field is valid. */
  error: string | null;
  /** `true` if the field has been blurred at least once. */
  touched: boolean;
  /** `true` if the value differs from the initial default. */
  dirty: boolean;
  /** `true` while an async validator is running for this field. */
  validating: boolean;
}

// ─── Shared field render contract ──────────────────────────────────────────────

/**
 * Read-only view of a field's state as passed to renderers and `_customRender`.
 *
 * Enriches {@link FieldState} with everything a renderer needs to draw the UI
 * without touching the store: label, placeholder, disabled/required flags,
 * option list, etc. Pair with {@link FieldRenderHandlers} to also get
 * change/blur/focus callbacks.
 *
 * @typeParam V - The field's value type.
 */
export interface FieldRenderState<V = unknown> {
  /** Schema key (the field's name in `values`/`errors`). */
  name: string;
  /** Current value. */
  value: V;
  /** Label resolved from the descriptor. */
  label: string;
  /** Placeholder resolved from the descriptor. */
  placeholder?: string;
  /** Current error message, or `null` if valid. */
  error: string | null;
  /** Whether the field has been blurred at least once. */
  touched: boolean;
  /** Whether the field's value has diverged from its default. */
  dirty: boolean;
  /** `true` while an async validator is in flight. */
  validating: boolean;
  /** Whether the field is disabled. */
  disabled: boolean;
  /** Whether the field is required. */
  required: boolean;
  /** Optional helper text. */
  hint?: string;
  /** Resolved options for select/radio fields (after async loading). */
  options?: SelectOption[];
  /** OTP digit count (OTP fields only). */
  otpLength?: number;
  /** Full values map — useful for cross-field logic in custom renderers. */
  allValues: Record<string, unknown>;
  /** Initial/default value, stringified for uncontrolled inputs. */
  defaultValue?: string;
}

/**
 * Callbacks a renderer calls to report user interactions back to FormBridge.
 *
 * @typeParam V - The field's value type.
 */
export interface FieldRenderHandlers<V = unknown> {
  /** Report a new value — triggers validation and re-render. */
  onChange: (value: V) => void;
  /** Report that the field lost focus — flips `touched` and runs blur validation. */
  onBlur: () => void;
  /** Report that the field gained focus — used by focus tracking/analytics. */
  onFocus: () => void;
}

// ─── Props passed to each rendered field ────────────────────────────────────────

/**
 * The full prop bag passed to a field renderer — state + handlers.
 * This is what `_customRender` receives.
 */
export type FieldRenderProps<V = unknown> = FieldRenderState<V> & FieldRenderHandlers<V>;

// ─── Field UI renderers (shared by web & native) ───────────────────────────────

/**
 * Per-slot render overrides shared by every field on both platforms.
 *
 * Use these when you want to tweak just the label/hint/error markup without
 * replacing the whole field renderer. Each slot receives a context with the
 * computed id/name plus the default content, so you can wrap or replace it.
 */
export type FieldRenderersProps = {
  /** Override the `<label>` slot. */
  renderLabel?: (ctx: {
    /** DOM id bound to the input via `htmlFor` / accessibility. */
    id: string;
    /** Schema key. */
    name: string;
    /** Default label content. */
    label: React.ReactNode;
    /** Whether the field is required (for rendering the "*" mark). */
    required: boolean;
  }) => React.ReactNode;
  /** Override the helper/hint slot shown below the field. */
  renderHint?: (ctx: {
    /** DOM id of the hint element (paired with `aria-describedby`). */
    id: string;
    /** Schema key. */
    name: string;
    /** Default hint content. */
    hint: React.ReactNode;
  }) => React.ReactNode;
  /** Override the error slot shown below the field. */
  renderError?: (ctx: {
    /** DOM id of the error element (paired with `aria-describedby`). */
    id: string;
    /** Schema key. */
    name: string;
    /** Default error message. */
    error: React.ReactNode;
  }) => React.ReactNode;
  /** Override the required mark (defaults to a red asterisk). */
  renderRequiredMark?: () => React.ReactNode;
};
