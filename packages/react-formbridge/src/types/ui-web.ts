import type {
  ButtonHTMLAttributes,
  CSSProperties,
  FormHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';

import type { FileValue } from '../core/field-builders/file/types';
import type { PasswordRule, StrengthResult } from '../core/field-builders/password/types';
import type { PhoneValue } from '../core/field-builders/phone/countries';
import type { CountryInfo, PhoneCountryLayout } from '../core/field-builders/phone/types';
import type { FieldAutoComplete } from './autoComplete';
import type {
  FieldRenderersProps,
  SelectOption,
  SelectPickerRenderContext,
} from './field';

// ─── Slot utilities ─────────────────────────────────────────────────────────────

/**
 * Internal: typed `classNames` record for a field's slots (wrapper, input, label, …).
 * Includes an index signature so consumers can add custom keys without type
 * errors, while still getting autocomplete on known slots.
 */
type WebClassNames<TSlots extends string> = Partial<Record<TSlots, string>> &
  Record<string, string | undefined>;

/**
 * Internal: typed inline `styles` record for a field's slots. Same shape as
 * {@link WebClassNames} but values are `CSSProperties`.
 */
type WebStyles<TSlots extends string> = Partial<Record<TSlots, CSSProperties>> &
  Record<string, CSSProperties | undefined>;

/**
 * Internal: a piece of label/helper text that can be either a plain string or
 * a function receiving a render context (so consumers can format dynamically).
 */
type WebTextOverride<TContext> = string | ((ctx: TContext) => string);

// ─── Base types ─────────────────────────────────────────────────────────────────

/**
 * Internal: the common prop shape shared by every web field override type.
 * Includes slot `classNames`/`styles`, label/hint/error render overrides (from
 * {@link FieldRenderersProps}), and pass-through attributes for the wrapper,
 * label, hint and error DOM nodes.
 *
 * @typeParam TSlots - Union of slot names available for the specific field.
 */
type WebFieldPropsBase<TSlots extends string> = FieldRenderersProps & {
  /** DOM id used for the input and `<label htmlFor>`. */
  id?: string;
  /** Hide the label element (still present for screen readers). */
  hideLabel?: boolean;
  /**
   * When `false`, the default red field chrome is suppressed while the error
   * message still renders. Useful when you want to style errors yourself.
   */
  highlightOnError?: boolean;
  /** Marks the input as read-only. */
  readOnly?: boolean;
  /** Typed autofill hint - see {@link FieldAutoComplete}. */
  autoComplete?: FieldAutoComplete;
  /** Move focus into this field on mount. */
  autoFocus?: boolean;
  /** Toggle spellcheck on text inputs. */
  spellCheck?: boolean;
  /** Maps to the HTML `inputmode` attribute (virtual keyboard hint). */
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode'];
  /** Maps to the HTML `enterkeyhint` attribute (mobile enter label). */
  enterKeyHint?: InputHTMLAttributes<HTMLInputElement>['enterKeyHint'];
  /** Per-slot className overrides. See {@link WebFieldSlot}. */
  classNames?: WebClassNames<TSlots>;
  /** Per-slot inline-style overrides. */
  styles?: WebStyles<TSlots>;
  /** Passthrough attributes for the field's wrapper `<div>`. */
  wrapperProps?: HTMLAttributes<HTMLDivElement>;
  /** Passthrough attributes for the `<label>` element. */
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>;
  /** Passthrough attributes for the hint `<span>`. */
  hintProps?: HTMLAttributes<HTMLSpanElement>;
  /** Passthrough attributes for the error `<span>`. */
  errorProps?: HTMLAttributes<HTMLSpanElement>;
};

/**
 * Internal: the subset of {@link WebFieldPropsBase} that controls input
 * *behavior* (as opposed to styling). Mixed into every text-like field.
 */
type WebInputBehaviorProps = Pick<
  WebFieldPropsBase<WebFieldSlot>,
  'readOnly' | 'autoComplete' | 'autoFocus' | 'spellCheck' | 'inputMode' | 'enterKeyHint'
>;

// ─── Slot types ─────────────────────────────────────────────────────────────────
// Each field type declares the named CSS slots it supports. These are used as
// keys in `classNames` / `styles` so consumers can target each piece of the
// rendered field without reaching into the DOM.

/** Slots every web field shares (wrapper, label, helper/error spans). */
type WebSharedFieldSlot = 'wrapper' | 'label' | 'hint' | 'error' | 'requiredMark';
/** Slots for single-line text-like inputs (text/email/number/tel/url/date). */
type WebTextFieldSlot = WebSharedFieldSlot | 'textInput';
/** Slots for the textarea renderer. */
type WebTextareaFieldSlot = WebSharedFieldSlot | 'textarea';
/** Slots for the checkbox renderer (row + input + inline label). */
type WebCheckboxFieldSlot =
  | WebSharedFieldSlot
  | 'checkboxRow'
  | 'checkboxInput'
  | 'checkboxLabel';
/** Slots for the switch renderer (custom toggle chrome built on a native input). */
type WebSwitchFieldSlot =
  | WebSharedFieldSlot
  | 'switchRoot'
  | 'switchButton'
  | 'switchTrack'
  | 'switchThumb'
  | 'switchLabel';
/** Slots for the `<select>` renderer and its chevron. */
type WebSelectFieldSlot = WebSharedFieldSlot | 'select' | 'selectValue' | 'selectArrow';
/** Slots for the radio-group renderer. */
type WebRadioFieldSlot =
  | WebSharedFieldSlot
  | 'radioGroup'
  | 'radioOption'
  | 'radioInput'
  | 'radioLabel';
/** Slots for the OTP renderer (one wrapper + N individual digit inputs). */
type WebOtpFieldSlot = WebSharedFieldSlot | 'otpContainer' | 'otpInput' | 'otpSeparator';
/**
 * Slots for the password renderer, including the visibility toggle and the
 * optional strength meter + rule list.
 */
type WebPasswordFieldSlot =
  | WebSharedFieldSlot
  | 'passwordInput'
  | 'passwordToggle'
  | 'passwordStrengthRow'
  | 'passwordStrengthBar'
  | 'passwordStrengthMeta'
  | 'passwordStrengthFill'
  | 'passwordStrengthLabel'
  | 'passwordStrengthEntropy'
  | 'passwordRulesList'
  | 'passwordRuleItem'
  | 'passwordRuleBullet'
  | 'passwordRuleText';
/**
 * Slots for the phone renderer (country picker button, country list, E.164
 * preview, etc.).
 */
type WebPhoneFieldSlot =
  | WebSharedFieldSlot
  | 'phoneInput'
  | 'phoneRow'
  | 'phoneCountryButton'
  | 'phoneCountryFlag'
  | 'phoneCountryDivider'
  | 'phoneChevron'
  | 'phoneSearchInput'
  | 'phoneSearchWrapper'
  | 'phoneCountryList'
  | 'phoneCountryScroll'
  | 'phoneCountryItem'
  | 'phoneSeparator'
  | 'phoneCountryName'
  | 'phoneCountryDial'
  | 'phoneE164'
  | 'phoneEmptyText';
/**
 * Slots for the file renderer (drop zone, browse button, preview list,
 * per-item chrome, etc.).
 */
type WebFileFieldSlot =
  | WebSharedFieldSlot
  | 'fileDropZone'
  | 'fileDropZoneIcon'
  | 'fileDropZoneText'
  | 'fileDropZoneAccept'
  | 'fileDropZoneMaxSize'
  | 'fileBrowseButton'
  | 'fileList'
  | 'fileListItem'
  | 'filePreviewImage'
  | 'fileIcon'
  | 'fileInfo'
  | 'fileName'
  | 'fileMeta'
  | 'fileRemoveButton'
  | 'fileAddMoreButton';
/**
 * Slots for the async autocomplete renderer (combobox with a listbox popup).
 */
type WebAsyncAutocompleteFieldSlot =
  | WebSharedFieldSlot
  | 'autocompleteInput'
  | 'autocompleteSelect'
  | 'autocompleteSelectValue'
  | 'autocompleteSelectArrow'
  | 'autocompleteListbox'
  | 'autocompleteOption'
  | 'autocompleteOptionActive'
  | 'autocompleteOptionSelected'
  | 'autocompleteEmpty'
  | 'autocompleteLoading';

// ─── Exported composite slot type ───────────────────────────────────────────────

/**
 * Union of every slot name declared by web field renderers - useful as the
 * key type for global `classNames`/`styles` maps that target any field.
 */
export type WebFieldSlot =
  | WebTextFieldSlot
  | WebTextareaFieldSlot
  | WebCheckboxFieldSlot
  | WebSwitchFieldSlot
  | WebSelectFieldSlot
  | WebRadioFieldSlot
  | WebOtpFieldSlot
  | WebPasswordFieldSlot
  | WebPhoneFieldSlot
  | WebFileFieldSlot
  | WebAsyncAutocompleteFieldSlot;

/**
 * Read-only snapshot handed to every file-field render override (drop zone,
 * browse button, helper text, …). Carries the effective configuration of the
 * file field plus its live state.
 */
export interface WebFileFieldRenderContext {
  /** Accepted MIME types / extensions (e.g. `['image/*', '.pdf']`). */
  accept: string[];
  /** Whether the field is disabled. */
  disabled: boolean;
  /** `true` while the user is dragging files over the drop zone. */
  dragging: boolean;
  /** Number of currently-held files. */
  fileCount: number;
  /** `true` while an async upload is in progress. */
  loading: boolean;
  /** Max number of files the field accepts (`Infinity` if unlimited). */
  maxFiles: number;
  /** Max size per file in bytes, or `null` if unconstrained. */
  maxSize: number | null;
  /** Whether the field accepts multiple files. */
  multiple: boolean;
  /** Whether thumbnails are rendered for image files. */
  preview: boolean;
  /** Height in px used for image previews. */
  previewHeight: number;
}

/**
 * File-field render context for per-item overrides (single row in the file
 * list). Extends {@link WebFileFieldRenderContext} with the file itself plus
 * presentation helpers.
 */
export interface WebFileFieldItemRenderContext extends WebFileFieldRenderContext {
  /** The default icon FormBridge would render for this file. */
  defaultIcon: ReactNode;
  /** Pre-formatted "WxH" string for image files, if known. */
  dimensionsLabel?: string;
  /** The file value (wrapper around the raw `File`/URI + metadata). */
  file: FileValue;
  /** Human-readable file size (e.g. `"1.2 MB"`). */
  formattedSize: string;
  /** Zero-based index in the file list. */
  index: number;
}

/**
 * Render context passed to password-field overrides (visibility toggle,
 * strength meter, helper text). Snapshots disabled state and strength result.
 */
export interface WebPasswordFieldRenderContext {
  /** Whether the field is disabled. */
  disabled: boolean;
  /** `true` when the user has typed at least one character. */
  hasValue: boolean;
  /** `true` when the password is currently shown in plaintext. */
  revealed: boolean;
  /** Latest strength computation, or `null` before the first evaluation. */
  result: StrengthResult | null;
  /** Current value length (avoids exposing the value itself). */
  valueLength: number;
}

/**
 * Render context for a single rule entry in the password strength rule list.
 * Extends {@link WebPasswordFieldRenderContext} with the rule being rendered.
 */
export interface WebPasswordFieldRuleRenderContext extends WebPasswordFieldRenderContext {
  /** Zero-based index in the rule list. */
  index: number;
  /** The rule definition (label, predicate, …). */
  rule: PasswordRule;
}

/**
 * Render context passed to phone-field overrides (country picker button,
 * country list, E.164 preview). Snapshots the picker state and the current
 * value so overrides never have to read FormBridge state directly.
 */
export interface WebPhoneFieldRenderContext {
  /** Currently-selected country. */
  currentCountry: CountryInfo;
  /** Whether the field is disabled. */
  disabled: boolean;
  /** Current E.164 representation of the value, or `null` if invalid/empty. */
  e164Value: string | null;
  /** Number of countries matching the current search query. */
  filteredCount: number;
  /** `true` when the user has entered at least one digit. */
  hasValue: boolean;
  /** Layout mode for the country picker (flag-only, flag+name, …). */
  layout: PhoneCountryLayout;
  /** Locally-entered phone number (what the user types). */
  nationalValue: string;
  /** Whether the country picker popover is open. */
  open: boolean;
  /** ISO codes of countries pinned to the top of the picker. */
  preferredCountries: string[];
  /** Current search query in the country picker. */
  search: string;
  /** Whether the country picker accepts a search query. */
  searchable: boolean;
  /** Whether to render the dial code next to country names. */
  showDialCode: boolean;
  /** Whether to render country flags. */
  showFlag: boolean;
  /** `true` when FormBridge stores E.164; `false` when it stores national. */
  storeE164: boolean;
  /** The raw field value in its stored shape. */
  value: PhoneValue | string | null;
}

/**
 * Render context for a single row in the country picker list. Extends
 * {@link WebPhoneFieldRenderContext} with the country being rendered.
 */
export interface WebPhoneFieldCountryItemRenderContext
  extends WebPhoneFieldRenderContext {
  /** The country this row represents. */
  country: CountryInfo;
  /** Zero-based index in the country list. */
  index: number;
  /** `true` if this country is currently selected. */
  selected: boolean;
}

// ─── Global overrides ───────────────────────────────────────────────────────────

/**
 * "Catch-all" override shape that targets every web field in one go - used
 * for `globalDefaults.field`. Inherits the full base + slot union.
 */
export interface WebGlobalFieldPropsOverrides extends WebFieldPropsBase<WebFieldSlot> {}

// ─── Per-field-type overrides ───────────────────────────────────────────────────

/**
 * Internal: attributes FormBridge owns on the underlying `<input>` so consumers
 * can't accidentally break state binding by passing them via `inputProps`.
 */
type OmittedHtmlInputAttribute =
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'onBlur'
  | 'onFocus'
  | 'disabled'
  | 'name'
  | 'checked'
  | 'defaultChecked';

/**
 * Override shape for the `text`/`email`/`number`/`tel`/`url`/`date` field
 * renderers. All single-line inputs share this shape.
 */
export interface WebTextFieldPropsOverrides
  extends WebFieldPropsBase<WebTextFieldSlot>,
    WebInputBehaviorProps {
  /** Passthrough attributes for the underlying `<input>` (minus FB-owned ones). */
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, OmittedHtmlInputAttribute>;
}

/** Override shape for the `textarea` field renderer. */
export interface WebTextareaFieldPropsOverrides
  extends WebFieldPropsBase<WebTextareaFieldSlot>,
    WebInputBehaviorProps {
  /** Passthrough attributes for the underlying `<textarea>`. */
  textareaProps?: Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    OmittedHtmlInputAttribute
  >;
}

/** Override shape for the `checkbox` field renderer. */
export interface WebCheckboxFieldPropsOverrides
  extends WebFieldPropsBase<WebCheckboxFieldSlot>,
    WebInputBehaviorProps {
  /** Passthrough attributes for the underlying `<input type="checkbox">`. */
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, OmittedHtmlInputAttribute>;
}

/** Override shape for the `switch` field renderer. */
export interface WebSwitchFieldPropsOverrides
  extends WebFieldPropsBase<WebSwitchFieldSlot>,
    WebInputBehaviorProps {
  /** Passthrough attributes for the underlying `<input type="checkbox">` (hidden). */
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, OmittedHtmlInputAttribute>;
}

/** Override shape for the `select` field renderer. */
export interface WebSelectFieldPropsOverrides
  extends WebFieldPropsBase<WebSelectFieldSlot> {
  /** Passthrough attributes for the native `<select>` element. */
  selectProps?: Omit<SelectHTMLAttributes<HTMLSelectElement>, OmittedHtmlInputAttribute>;
  /** Replace the whole picker UI - see {@link SelectPickerRenderContext}. */
  renderPicker?: (ctx: SelectPickerRenderContext) => React.ReactNode;
}

/** Override shape for the `radio` field renderer. */
export interface WebRadioFieldPropsOverrides
  extends WebFieldPropsBase<WebRadioFieldSlot>,
    WebInputBehaviorProps {
  /** Passthrough attributes for each `<input type="radio">`. */
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, OmittedHtmlInputAttribute>;
  /** Replace the whole picker UI - see {@link SelectPickerRenderContext}. */
  renderPicker?: (ctx: SelectPickerRenderContext) => React.ReactNode;
}

/** Override shape for the `otp` field renderer. */
export interface WebOtpFieldPropsOverrides
  extends WebFieldPropsBase<WebOtpFieldSlot>,
    WebInputBehaviorProps {
  /** Passthrough attributes applied to each digit `<input>`. */
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, OmittedHtmlInputAttribute>;
}

/**
 * Override shape for the `password` field renderer - includes the visibility
 * toggle plus the optional strength meter and rule list.
 */
export interface WebPasswordFieldPropsOverrides
  extends WebFieldPropsBase<WebPasswordFieldSlot>,
    WebInputBehaviorProps {
  /** Passthrough attributes for the underlying `<input>` (type controlled by FB). */
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | 'type'
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'onBlur'
    | 'onFocus'
    | 'disabled'
    | 'name'
  >;
  /** Text/renderer for the "show password" toggle button. */
  showPasswordText?: WebTextOverride<WebPasswordFieldRenderContext>;
  /** Text/renderer for the "hide password" toggle button. */
  hidePasswordText?: WebTextOverride<WebPasswordFieldRenderContext>;
  /** Full renderer override for the visibility toggle button content. */
  renderToggleContent?: (
    ctx: WebPasswordFieldRenderContext & {
      defaultContent: ReactNode;
    },
  ) => ReactNode;
  /** Override the strength label (e.g. "Weak", "Strong"). */
  renderStrengthLabel?: (
    ctx: WebPasswordFieldRenderContext & {
      defaultContent: ReactNode;
      result: StrengthResult;
    },
  ) => ReactNode;
  /** Override the strength entropy value display. */
  renderStrengthEntropy?: (
    ctx: WebPasswordFieldRenderContext & {
      defaultContent: ReactNode;
      result: StrengthResult;
    },
  ) => ReactNode;
  /** Override the whole strength meter row (bar + label + entropy). */
  renderStrengthRowContent?: (
    ctx: WebPasswordFieldRenderContext & {
      defaultBarContent: ReactNode;
      defaultContent: ReactNode;
      defaultEntropyContent: ReactNode;
      defaultLabelContent: ReactNode;
      defaultMetaContent: ReactNode;
      result: StrengthResult;
    },
  ) => ReactNode;
  /** Override the rendering of a single rule in the rule list. */
  renderStrengthRule?: (
    ctx: WebPasswordFieldRuleRenderContext & {
      defaultContent: ReactNode;
    },
  ) => ReactNode;
}

/**
 * Override shape for the `phone` field renderer - includes country picker
 * customization, search input, layout, and E.164 preview.
 */
export interface WebPhoneFieldPropsOverrides
  extends WebFieldPropsBase<WebPhoneFieldSlot>,
    WebInputBehaviorProps {
  /** Passthrough attributes for the underlying phone number `<input>`. */
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | 'type'
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'onBlur'
    | 'onFocus'
    | 'disabled'
    | 'name'
  >;
  /** Passthrough attributes for the country-search `<input>` inside the picker. */
  searchInputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onChange'
  >;
  /** Layout mode for the country picker (flag-only, flag + name, …). */
  countryLayout?: PhoneCountryLayout;
  /** Accessible label for the country-picker trigger button. */
  countryButtonAriaLabel?: WebTextOverride<WebPhoneFieldRenderContext>;
  /** Placeholder text for the country-search input. */
  searchPlaceholderText?: WebTextOverride<WebPhoneFieldRenderContext>;
  /** Text shown when the search query matches no countries. */
  emptySearchText?: WebTextOverride<WebPhoneFieldRenderContext>;
  /** Opt-in label shown next to / below the E.164 preview ("International: …"). */
  e164Text?: WebTextOverride<
    WebPhoneFieldRenderContext & {
      e164: string;
    }
  >;
  /** Full renderer for the country-picker trigger content. */
  renderCountryButtonContent?: (
    ctx: WebPhoneFieldRenderContext & {
      defaultContent: ReactNode;
    },
  ) => ReactNode;
  /** Full renderer for a single row in the country list. */
  renderCountryItemContent?: (
    ctx: WebPhoneFieldCountryItemRenderContext & {
      defaultContent: ReactNode;
    },
  ) => ReactNode;
  /** Full renderer for the "no results" state in the country picker. */
  renderEmptySearchContent?: (
    ctx: WebPhoneFieldRenderContext & {
      defaultContent: ReactNode;
    },
  ) => ReactNode;
  /** Opt-in full renderer for the E.164 preview below the phone input. */
  renderE164?: (
    ctx: WebPhoneFieldRenderContext & {
      defaultContent: ReactNode;
      e164: string;
    },
  ) => ReactNode;
}

/**
 * Override shape for the `file` field renderer - covers the drop zone, browse
 * button, per-file preview/list rendering, and all helper copy.
 */
export interface WebFileFieldPropsOverrides extends WebFieldPropsBase<WebFileFieldSlot> {
  /** Passthrough attributes for the hidden `<input type="file">`. */
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | 'type'
    | 'value'
    | 'defaultValue'
    | 'name'
    | 'accept'
    | 'multiple'
    | 'disabled'
    | 'onChange'
  >;
  /** Text shown while an upload is in progress. */
  loadingText?: WebTextOverride<WebFileFieldRenderContext>;
  /** Idle drop-zone prompt ("Drop files here or browse…"). */
  dropZoneText?: WebTextOverride<WebFileFieldRenderContext>;
  /** Drop-zone prompt shown while dragging ("Release to upload"). */
  dragActiveText?: WebTextOverride<WebFileFieldRenderContext>;
  /** Helper text listing accepted types. */
  acceptedText?: WebTextOverride<
    WebFileFieldRenderContext & {
      /** Accept list pre-formatted for display ("JPG, PNG, PDF"). */
      formattedAccept: string;
    }
  >;
  /** Helper text stating the max file size. */
  maxSizeText?: WebTextOverride<
    WebFileFieldRenderContext & {
      /** Max size pre-formatted ("5 MB"). */
      formattedMaxSize: string;
    }
  >;
  /** Label for the "Browse…" button. */
  browseButtonText?: WebTextOverride<WebFileFieldRenderContext>;
  /** Label for the "+ Add more" button when `multiple` is enabled. */
  addMoreButtonText?: WebTextOverride<WebFileFieldRenderContext>;
  /** Label for the per-file "Remove" button. */
  removeButtonText?: WebTextOverride<WebFileFieldItemRenderContext>;
  /** Render a custom icon for a given file in the list. */
  renderFileIcon?: (
    file: FileValue,
    ctx: WebFileFieldItemRenderContext & {
      defaultIcon: ReactNode;
    },
  ) => ReactNode;
  /** Render a custom icon inside the drop zone. */
  renderDropZoneIcon?: (ctx: WebFileFieldRenderContext) => ReactNode;
  /** Render the full drop-zone content (icon + text). */
  renderDropZoneContent?: (
    ctx: WebFileFieldRenderContext & {
      defaultContent: ReactNode;
      defaultIcon: ReactNode;
    },
  ) => ReactNode;
  /** Render the full "Browse…" button content. */
  renderBrowseButtonContent?: (
    ctx: WebFileFieldRenderContext & {
      defaultContent: ReactNode;
    },
  ) => ReactNode;
  /** Render the full "+ Add more" button content. */
  renderAddMoreButtonContent?: (
    ctx: WebFileFieldRenderContext & {
      defaultContent: ReactNode;
    },
  ) => ReactNode;
  /** Render the full per-file "Remove" button content. */
  renderRemoveButtonContent?: (
    ctx: WebFileFieldItemRenderContext & {
      defaultContent: ReactNode;
    },
  ) => ReactNode;
  /** Render the metadata block for a file (size, dimensions, …). */
  renderFileMeta?: (
    ctx: WebFileFieldItemRenderContext & {
      defaultContent: ReactNode;
    },
  ) => ReactNode;
}

/**
 * Override shape for the async-autocomplete renderer - used when a `select`
 * field declares an async options source.
 */
export interface WebAsyncAutocompleteFieldPropsOverrides
  extends WebFieldPropsBase<WebAsyncAutocompleteFieldSlot> {
  /** Passthrough attributes for the combobox `<input>`. */
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'onBlur'
    | 'onFocus'
    | 'disabled'
    | 'name'
    | 'role'
    | 'aria-autocomplete'
    | 'aria-controls'
    | 'aria-expanded'
    | 'aria-activedescendant'
  >;
  /** Render a single option in the listbox. Receives highlight/selection state. */
  renderOption?: (
    option: SelectOption,
    state: { active: boolean; selected: boolean },
  ) => React.ReactNode;
  /** Render the "no results" state in the listbox. */
  renderEmpty?: () => React.ReactNode;
  /** Render the "loading" state in the listbox. */
  renderLoading?: () => React.ReactNode;
  /** Replace the whole picker UI - see {@link SelectPickerRenderContext}. */
  renderPicker?: (ctx: SelectPickerRenderContext) => React.ReactNode;
}

// ─── Combined field overrides (catch-all for generic usage) ─────────────────────

/**
 * Union of every per-field override shape - the widest type a web field can
 * accept. Useful for helpers that need to handle "any field" without knowing
 * the concrete field type at compile time.
 *
 * You almost never want this in application code: prefer the narrower
 * per-field types (`WebTextFieldPropsOverrides`, `WebFileFieldPropsOverrides`, …).
 */
export interface WebFieldPropsOverrides
  extends WebFieldPropsBase<WebFieldSlot>,
    WebInputBehaviorProps {
  /** Input passthrough - see per-field types for the precise shape. */
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, OmittedHtmlInputAttribute>;
  textareaProps?: Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    OmittedHtmlInputAttribute
  >;
  selectProps?: Omit<SelectHTMLAttributes<HTMLSelectElement>, OmittedHtmlInputAttribute>;
  searchInputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onChange'
  >;
  countryLayout?: PhoneCountryLayout;
  renderPicker?: (ctx: SelectPickerRenderContext) => React.ReactNode;
  renderOption?: (
    option: SelectOption,
    state: { active: boolean; selected: boolean },
  ) => React.ReactNode;
  renderEmpty?: () => React.ReactNode;
  renderLoading?: () => React.ReactNode;
  showPasswordText?: WebTextOverride<WebPasswordFieldRenderContext>;
  hidePasswordText?: WebTextOverride<WebPasswordFieldRenderContext>;
  renderToggleContent?: (
    ctx: WebPasswordFieldRenderContext & {
      defaultContent: ReactNode;
    },
  ) => ReactNode;
  renderStrengthLabel?: (
    ctx: WebPasswordFieldRenderContext & {
      defaultContent: ReactNode;
      result: StrengthResult;
    },
  ) => ReactNode;
  renderStrengthEntropy?: (
    ctx: WebPasswordFieldRenderContext & {
      defaultContent: ReactNode;
      result: StrengthResult;
    },
  ) => ReactNode;
  renderStrengthRowContent?: (
    ctx: WebPasswordFieldRenderContext & {
      defaultBarContent: ReactNode;
      defaultContent: ReactNode;
      defaultEntropyContent: ReactNode;
      defaultLabelContent: ReactNode;
      defaultMetaContent: ReactNode;
      result: StrengthResult;
    },
  ) => ReactNode;
  renderStrengthRule?: (
    ctx: WebPasswordFieldRuleRenderContext & {
      defaultContent: ReactNode;
    },
  ) => ReactNode;
  loadingText?: WebTextOverride<WebFileFieldRenderContext>;
  dropZoneText?: WebTextOverride<WebFileFieldRenderContext>;
  dragActiveText?: WebTextOverride<WebFileFieldRenderContext>;
  acceptedText?: WebTextOverride<
    WebFileFieldRenderContext & {
      formattedAccept: string;
    }
  >;
  maxSizeText?: WebTextOverride<
    WebFileFieldRenderContext & {
      formattedMaxSize: string;
    }
  >;
  browseButtonText?: WebTextOverride<WebFileFieldRenderContext>;
  addMoreButtonText?: WebTextOverride<WebFileFieldRenderContext>;
  removeButtonText?: WebTextOverride<WebFileFieldItemRenderContext>;
  renderFileIcon?: (
    file: FileValue,
    ctx: WebFileFieldItemRenderContext & {
      defaultIcon: ReactNode;
    },
  ) => ReactNode;
  renderDropZoneIcon?: (ctx: WebFileFieldRenderContext) => ReactNode;
  renderDropZoneContent?: (
    ctx: WebFileFieldRenderContext & {
      defaultContent: ReactNode;
      defaultIcon: ReactNode;
    },
  ) => ReactNode;
  renderBrowseButtonContent?: (
    ctx: WebFileFieldRenderContext & {
      defaultContent: ReactNode;
    },
  ) => ReactNode;
  renderAddMoreButtonContent?: (
    ctx: WebFileFieldRenderContext & {
      defaultContent: ReactNode;
    },
  ) => ReactNode;
  renderRemoveButtonContent?: (
    ctx: WebFileFieldItemRenderContext & {
      defaultContent: ReactNode;
    },
  ) => ReactNode;
  renderFileMeta?: (
    ctx: WebFileFieldItemRenderContext & {
      defaultContent: ReactNode;
    },
  ) => ReactNode;
  countryButtonAriaLabel?: WebTextOverride<WebPhoneFieldRenderContext>;
  searchPlaceholderText?: WebTextOverride<WebPhoneFieldRenderContext>;
  emptySearchText?: WebTextOverride<WebPhoneFieldRenderContext>;
  e164Text?: WebTextOverride<
    WebPhoneFieldRenderContext & {
      e164: string;
    }
  >;
  renderCountryButtonContent?: (
    ctx: WebPhoneFieldRenderContext & {
      defaultContent: ReactNode;
    },
  ) => ReactNode;
  renderCountryItemContent?: (
    ctx: WebPhoneFieldCountryItemRenderContext & {
      defaultContent: ReactNode;
    },
  ) => ReactNode;
  renderEmptySearchContent?: (
    ctx: WebPhoneFieldRenderContext & {
      defaultContent: ReactNode;
    },
  ) => ReactNode;
  renderE164?: (
    ctx: WebPhoneFieldRenderContext & {
      defaultContent: ReactNode;
      e164: string;
    },
  ) => ReactNode;
}

// ─── Form & submit overrides ────────────────────────────────────────────────────

/**
 * Theme overrides applied to the `<Form>` wrapper element on web. Attach via
 * `globalDefaults(state).form`.
 */
export interface WebFormPropsOverrides {
  /** className added to the `<form>` element. */
  className?: string;
  /** Inline style merged onto the `<form>` element. */
  style?: CSSProperties;
  /**
   * Passthrough attributes spread onto the `<form>` element (minus FB-owned
   * ones: children, onSubmit, className, style).
   */
  props?: Omit<
    FormHTMLAttributes<HTMLFormElement>,
    'children' | 'onSubmit' | 'className' | 'style'
  >;
}

/**
 * Theme overrides applied to the `Form.Submit` button on web. Attach via
 * `globalDefaults(state).submit`.
 */
export interface WebSubmitPropsOverrides {
  /** className added to the `<button>`. */
  className?: string;
  /** Inline style merged onto the `<button>`. */
  style?: CSSProperties;
  /** Content shown while submitting. Defaults to `"Please wait…"`. */
  loadingText?: ReactNode;
  /**
   * Passthrough attributes spread onto the `<button>` (minus FB-owned ones:
   * children, type, disabled, className, style).
   */
  props?: Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'children' | 'type' | 'disabled' | 'className' | 'style'
  >;
}
