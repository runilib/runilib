import type { ReactNode } from 'react';

import type { FileValue } from '../core/field-builders/file/types';
import type { PasswordRule, StrengthResult } from '../core/field-builders/password/types';
import type { PhoneValue } from '../core/field-builders/phone/countries';
import type { CountryInfo, PhoneCountryLayout } from '../core/field-builders/phone/types';
import type { FieldAutoComplete } from './autoComplete';
import type {
  FieldRenderersProps,
  NativeStyleValue,
  SelectPickerRenderContext,
} from './field';

// ─── Slot utilities ─────────────────────────────────────────────────────────────

/**
 * Internal: typed `styles` record for a native field's slots. Includes an
 * index signature so consumers can add custom keys while keeping autocomplete
 * on known slots.
 */
type NativeStyles<TSlots extends string> = Partial<Record<TSlots, NativeStyleValue>> &
  Record<string, NativeStyleValue | undefined>;

/**
 * Internal: a piece of label/helper text that can be either a plain string or
 * a function receiving a render context (dynamic formatting).
 */
type NativeTextOverride<TContext> = string | ((ctx: TContext) => string);

// ─── Base types ─────────────────────────────────────────────────────────────────

/**
 * Internal: the common prop shape shared by every native field override type.
 * Mirrors the web version ({@link import('./ui-web').WebFieldPropsBase}) but
 * with React Native equivalents (`testID`, `keyboardType`, `secureTextEntry`).
 *
 * @typeParam TSlots - Union of slot names available for the specific field.
 */
type NativeFieldPropsBase<TSlots extends string> = FieldRenderersProps & {
  /** Stable id used internally (e.g. for aria-* on Text labels). */
  id?: string;
  /** Test ID forwarded to the wrapper element (for RN Testing Library). */
  testID?: string;
  /** Hide the visual label (still readable by screen readers). */
  hideLabel?: boolean;
  /**
   * When `false`, the default red field chrome is suppressed while the error
   * message still renders. Useful for custom error styling.
   */
  highlightOnError?: boolean;
  /** Marks the input as read-only. */
  readOnly?: boolean;
  /** Typed autofill hint — see {@link FieldAutoComplete}. */
  autoComplete?: FieldAutoComplete;
  /** Move focus into this field on mount. */
  autoFocus?: boolean;
  /**
   * RN `TextInput` keyboardType (`'default'`, `'numeric'`, `'email-address'`, …).
   * Loosely typed as `string` to stay decoupled from `react-native`.
   */
  keyboardType?: string;
  /** Maps to `TextInput.secureTextEntry`. */
  secureTextEntry?: boolean;
  /** Per-slot inline-style overrides. See {@link NativeFieldSlot}. */
  styles?: NativeStyles<TSlots>;
  /** Passthrough props for the field's wrapper `<View>`. */
  wrapperProps?: Record<string, unknown>;
  /** Passthrough props for the `<Text>` label. */
  labelProps?: Record<string, unknown>;
  /** Passthrough props for the `<Text>` hint. */
  hintProps?: Record<string, unknown>;
  /** Passthrough props for the `<Text>` error. */
  errorProps?: Record<string, unknown>;
};

/**
 * Internal: the subset of {@link NativeFieldPropsBase} that controls input
 * *behavior* (as opposed to styling). Mixed into every text-like field.
 */
type NativeInputBehaviorProps = Pick<
  NativeFieldPropsBase<NativeFieldSlot>,
  'readOnly' | 'autoComplete' | 'autoFocus' | 'keyboardType' | 'secureTextEntry'
>;

// ─── Slot types ─────────────────────────────────────────────────────────────────
// Each field type declares the named style slots it supports. These are the
// keys you pass to `styles={{ … }}` on a native field to target each piece of
// the rendered UI without subclassing the renderer.

/** Slots every native field shares (wrapper, label, hint, error). */
type NativeSharedFieldSlot = 'wrapper' | 'label' | 'error' | 'hint' | 'requiredMark';
/** Slots for single-line text-like inputs (text/email/number/tel/url/date). */
type NativeTextFieldSlot = NativeSharedFieldSlot | 'textInput';
/** Slots for the checkbox renderer (row + custom box + inline label). */
type NativeCheckboxFieldSlot =
  | NativeSharedFieldSlot
  | 'checkboxRow'
  | 'checkboxBox'
  | 'checkboxLabel';
/**
 * Slots for the select renderer (trigger + modal with options).
 * The native select uses a modal picker, not a system menu.
 */
type NativeSelectFieldSlot =
  | NativeSharedFieldSlot
  | 'selectTrigger'
  | 'selectTriggerLabel'
  | 'selectOptionRow'
  | 'selectOptionLabel'
  | 'selectModalBackdrop'
  | 'selectModalCard';
/** Slots for the OTP renderer (one container + N digit inputs). */
type NativeOtpFieldSlot =
  | NativeSharedFieldSlot
  | 'otpContainer'
  | 'otpInput'
  | 'otpSeparator';
/**
 * Slots for the password renderer — visibility toggle plus the optional
 * strength meter and rule list.
 */
type NativePasswordFieldSlot =
  | NativeSharedFieldSlot
  | 'passwordInput'
  | 'passwordToggle'
  | 'passwordToggleText'
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
 * Slots for the phone renderer — country picker trigger, modal + list of
 * countries, and the E.164 preview.
 */
type NativePhoneFieldSlot =
  | NativeSharedFieldSlot
  | 'phoneInput'
  | 'phoneRow'
  | 'phoneCountryButton'
  | 'phoneCountryFlag'
  | 'phoneCountryDial'
  | 'phoneCountryDivider'
  | 'phoneChevron'
  | 'phoneE164'
  | 'phoneModalBackdrop'
  | 'phoneModalCard'
  | 'phoneSearchInput'
  | 'phoneSeparator'
  | 'phoneCountryRow'
  | 'phoneCountryName'
  | 'phoneEmptyText';
/**
 * Slots for the file renderer — a single "Pick files" button plus the file
 * list with per-item metadata and a remove button.
 */
type NativeFileFieldSlot =
  | NativeSharedFieldSlot
  | 'filePickButton'
  | 'filePickButtonText'
  | 'fileList'
  | 'fileItem'
  | 'fileIcon'
  | 'fileIconText'
  | 'fileName'
  | 'fileMeta'
  | 'fileRemoveButton'
  | 'fileRemoveText';
/**
 * Slots for the async-autocomplete renderer — uses a trigger + modal combobox
 * pattern (no inline listbox like web).
 */
type NativeAsyncAutocompleteFieldSlot =
  | NativeSharedFieldSlot
  | 'autocompleteTrigger'
  | 'autocompleteTriggerValue'
  | 'autocompleteTriggerPlaceholder'
  | 'autocompleteModalBackdrop'
  | 'autocompleteModalCard'
  | 'autocompleteSearchInput'
  | 'autocompleteLoadingRow'
  | 'autocompleteLoadingText'
  | 'autocompleteOptionRow'
  | 'autocompleteOptionLabel'
  | 'autocompleteEmptyText';

// ─── Exported composite slot type ───────────────────────────────────────────────

/**
 * Union of every slot name declared by native field renderers — useful as
 * the key type for global `styles` maps that target any field.
 */
export type NativeFieldSlot =
  | NativeSharedFieldSlot
  | NativeTextFieldSlot
  | NativeCheckboxFieldSlot
  | NativeSelectFieldSlot
  | NativeOtpFieldSlot
  | NativePasswordFieldSlot
  | NativePhoneFieldSlot
  | NativeFileFieldSlot
  | NativeAsyncAutocompleteFieldSlot;

/**
 * Read-only snapshot handed to every file-field render override on native.
 * Mirrors the web context minus the `dragging` flag (no drag-and-drop on RN).
 */
export interface NativeFileFieldRenderContext {
  /** Accepted MIME types / extensions. */
  accept: string[];
  /** Whether the field is disabled. */
  disabled: boolean;
  /** Number of currently-held files. */
  fileCount: number;
  /** `true` while the native file picker is opening or the upload is pending. */
  loading: boolean;
  /** Max number of files the field accepts. */
  maxFiles: number;
  /** Max size per file in bytes, or `null` if unconstrained. */
  maxSize: number | null;
  /** Whether the field accepts multiple files. */
  multiple: boolean;
  /** Whether thumbnails are rendered for image files. */
  preview: boolean;
  /** Height used for image previews. */
  previewHeight: number;
}

/**
 * Per-item render context for a single row in the native file list. Extends
 * {@link NativeFileFieldRenderContext} with the file and presentation helpers.
 */
export interface NativeFileFieldItemRenderContext extends NativeFileFieldRenderContext {
  /** Default icon FormBridge would render for this file. */
  defaultIcon: React.ReactNode;
  /** Pre-formatted "WxH" string for image files, if known. */
  dimensionsLabel?: string;
  /** The file value wrapper (URI + metadata). */
  file: FileValue;
  /** Human-readable file size (e.g. `"1.2 MB"`). */
  formattedSize: string;
  /** Zero-based index in the file list. */
  index: number;
}

/**
 * Render context for password-field overrides on native — visibility toggle
 * and strength meter state.
 */
export interface NativePasswordFieldRenderContext {
  /** Whether the field is disabled. */
  disabled: boolean;
  /** `true` when the user has typed at least one character. */
  hasValue: boolean;
  /** `true` when the password is currently shown in plaintext. */
  revealed: boolean;
  /** Latest strength result, or `null` before the first evaluation. */
  result: StrengthResult | null;
  /** Current value length (avoids exposing the value itself). */
  valueLength: number;
}

/**
 * Render context for a single rule in the password rule list on native.
 * Extends {@link NativePasswordFieldRenderContext}.
 */
export interface NativePasswordFieldRuleRenderContext
  extends NativePasswordFieldRenderContext {
  /** Zero-based index in the rule list. */
  index: number;
  /** The rule definition (label, predicate, …). */
  rule: PasswordRule;
}

/**
 * Render context for phone-field overrides on native — matches the web
 * context field-for-field so cross-platform theming can share helpers.
 */
export interface NativePhoneFieldRenderContext {
  /** Currently-selected country. */
  currentCountry: CountryInfo;
  /** Whether the field is disabled. */
  disabled: boolean;
  /** Current E.164 representation, or `null` if invalid/empty. */
  e164Value: string | null;
  /** Number of countries matching the current search query. */
  filteredCount: number;
  /** `true` when the user has entered at least one digit. */
  hasValue: boolean;
  /** Layout mode for the country picker. */
  layout: PhoneCountryLayout;
  /** Locally-entered phone number. */
  nationalValue: string;
  /** Whether the country picker modal is open. */
  open: boolean;
  /** ISO codes of countries pinned to the top. */
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
 * Per-row render context for the native country picker list. Extends
 * {@link NativePhoneFieldRenderContext}.
 */
export interface NativePhoneFieldCountryItemRenderContext
  extends NativePhoneFieldRenderContext {
  /** The country this row represents. */
  country: CountryInfo;
  /** Zero-based index in the country list. */
  index: number;
  /** `true` if this country is currently selected. */
  selected: boolean;
}

// ─── Global overrides ───────────────────────────────────────────────────────────

/**
 * "Catch-all" override shape that targets every native field in one go — used
 * for `globalDefaults.field`. Inherits the full base + slot union.
 */
export interface NativeGlobalFieldPropsOverrides
  extends NativeFieldPropsBase<NativeFieldSlot> {}

// ─── Per-field-type overrides ───────────────────────────────────────────────────

/**
 * Override shape for `text`/`email`/`number`/`tel`/`url`/`date` renderers on
 * native — all single-line text-like fields share this shape.
 */
export interface NativeTextFieldPropsOverrides
  extends NativeFieldPropsBase<NativeTextFieldSlot>,
    NativeInputBehaviorProps {
  /** Passthrough props for the underlying `TextInput`. */
  inputProps?: Record<string, unknown>;
}

/** Override shape for the `checkbox` field renderer on native. */
export interface NativeCheckboxFieldPropsOverrides
  extends NativeFieldPropsBase<NativeCheckboxFieldSlot> {}

/**
 * Override shape for the `switch` field renderer on native — uses the RN
 * `<Switch>` component and adds row/label slots.
 */
export interface NativeSwitchFieldPropsOverrides
  extends NativeFieldPropsBase<NativeSharedFieldSlot | 'switchRow' | 'switchLabel'> {}

/**
 * Override shape for the `select` (and `radio`) field renderer on native.
 * Radio fields reuse this shape because they share the modal picker.
 */
export interface NativeSelectFieldPropsOverrides
  extends NativeFieldPropsBase<NativeSelectFieldSlot> {
  /** Replace the whole picker UI — see {@link SelectPickerRenderContext}. */
  renderPicker?: (ctx: SelectPickerRenderContext) => React.ReactNode;
}

/** Override shape for the `otp` field renderer on native. */
export interface NativeOtpFieldPropsOverrides
  extends NativeFieldPropsBase<NativeOtpFieldSlot>,
    NativeInputBehaviorProps {
  /** Passthrough props applied to each digit `TextInput`. */
  inputProps?: Record<string, unknown>;
}

/**
 * Override shape for the `password` renderer on native — visibility toggle
 * plus the optional strength meter and rule list.
 */
export interface NativePasswordFieldPropsOverrides
  extends NativeFieldPropsBase<NativePasswordFieldSlot>,
    NativeInputBehaviorProps {
  /** Passthrough props for the underlying `TextInput`. */
  inputProps?: Record<string, unknown>;
  /** Text/renderer for the "show password" toggle. */
  showPasswordText?: NativeTextOverride<NativePasswordFieldRenderContext>;
  /** Text/renderer for the "hide password" toggle. */
  hidePasswordText?: NativeTextOverride<NativePasswordFieldRenderContext>;
  /** Full renderer override for the visibility toggle content. */
  renderToggleContent?: (
    ctx: NativePasswordFieldRenderContext & {
      defaultContent: React.ReactNode;
    },
  ) => React.ReactNode;
  /** Override the strength label text ("Weak", "Strong", …). */
  renderStrengthLabel?: (
    ctx: NativePasswordFieldRenderContext & {
      defaultContent: React.ReactNode;
      result: StrengthResult;
    },
  ) => React.ReactNode;
  /** Override the strength entropy display. */
  renderStrengthEntropy?: (
    ctx: NativePasswordFieldRenderContext & {
      defaultContent: React.ReactNode;
      result: StrengthResult;
    },
  ) => React.ReactNode;
  /** Override the whole strength meter row (bar + label + entropy). */
  renderStrengthRowContent?: (
    ctx: NativePasswordFieldRenderContext & {
      defaultBarContent: React.ReactNode;
      defaultContent: React.ReactNode;
      defaultEntropyContent: React.ReactNode;
      defaultLabelContent: React.ReactNode;
      defaultMetaContent: React.ReactNode;
      result: StrengthResult;
    },
  ) => React.ReactNode;
  /** Override the rendering of a single rule in the rule list. */
  renderStrengthRule?: (
    ctx: NativePasswordFieldRuleRenderContext & {
      defaultContent: React.ReactNode;
    },
  ) => React.ReactNode;
}

/**
 * Override shape for the `phone` field renderer on native — country modal
 * picker, search, layout, and E.164 preview.
 */
export interface NativePhoneFieldPropsOverrides
  extends NativeFieldPropsBase<NativePhoneFieldSlot>,
    NativeInputBehaviorProps {
  /** Passthrough props for the phone number `TextInput`. */
  inputProps?: Record<string, unknown>;
  /** Passthrough props for the search `TextInput` inside the country picker. */
  searchInputProps?: Record<string, unknown>;
  /** Layout mode for the country picker. */
  countryLayout?: PhoneCountryLayout;
  /** Accessibility label for the country-picker trigger button. */
  countryButtonAriaLabel?: NativeTextOverride<NativePhoneFieldRenderContext>;
  /** Placeholder for the country-search input. */
  searchPlaceholderText?: NativeTextOverride<NativePhoneFieldRenderContext>;
  /** Text shown when the search query matches no countries. */
  emptySearchText?: NativeTextOverride<NativePhoneFieldRenderContext>;
  /** Label shown next to / below the E.164 preview. */
  e164Text?: NativeTextOverride<
    NativePhoneFieldRenderContext & {
      e164: string;
    }
  >;
  /** Full renderer for the country-picker trigger content. */
  renderCountryButtonContent?: (
    ctx: NativePhoneFieldRenderContext & {
      defaultContent: React.ReactNode;
    },
  ) => React.ReactNode;
  /** Full renderer for a single row in the country list. */
  renderCountryItemContent?: (
    ctx: NativePhoneFieldCountryItemRenderContext & {
      defaultContent: React.ReactNode;
    },
  ) => React.ReactNode;
  /** Full renderer for the "no results" state in the country picker. */
  renderEmptySearchContent?: (
    ctx: NativePhoneFieldRenderContext & {
      defaultContent: React.ReactNode;
    },
  ) => React.ReactNode;
  /** Full renderer for the E.164 preview. */
  renderE164?: (
    ctx: NativePhoneFieldRenderContext & {
      defaultContent: React.ReactNode;
      e164: string;
    },
  ) => React.ReactNode;
}

/**
 * Override shape for the `file` field renderer on native.
 *
 * FormBridge does not ship with a bundled file picker on React Native — you
 * must wire one in via `pickFiles` (e.g. `expo-document-picker`,
 * `react-native-image-picker`). The renderer otherwise handles the list UI,
 * previews, and removals.
 */
export interface NativeFileFieldPropsOverrides
  extends NativeFieldPropsBase<NativeFileFieldSlot> {
  /**
   * The user-supplied file picker. Called when the user taps the "Pick files"
   * button; must resolve to the selected files (or `null` if the user
   * cancels). Receives the compiled descriptor so you can honor `accept`,
   * `maxSize`, etc. at pick time.
   */
  pickFiles?: (ctx: {
    descriptor: {
      /** Field label. */
      _label: string;
      /** Whether the field is required. */
      _required: boolean;
      /** Helper text for the field, if any. */
      _hint?: string;
      /** Whether the field is disabled. */
      _disabled: boolean;
      /** Accepted MIME types / extensions. */
      _fileAccept: string[];
      /** Max size per file in bytes, or `null` if unconstrained. */
      _fileMaxSize: number | null;
      /** Whether the field accepts multiple files. */
      _fileMultiple: boolean;
      /** Max number of files the field accepts. */
      _fileMaxFiles: number;
      /** Whether to render thumbnails for images. */
      _filePreview: boolean;
      /** Height used for image previews. */
      _filePreviewHeight: number;
      /** Whether to base64-encode file contents on read. */
      _fileBase64: boolean;
      /** Label text for drag-and-drop instructions (ignored on native). */
      _fileDragDropLabel: string;
    };
    /** Convenience flag: `true` when the user can pick more than one file. */
    multiple: boolean;
  }) => Promise<FileValue[] | FileValue | null>;
  /** Text shown while the picker is open / files are loading. */
  loadingText?: NativeTextOverride<NativeFileFieldRenderContext>;
  /** Label for the "Pick files" button. */
  pickButtonText?: NativeTextOverride<NativeFileFieldRenderContext>;
  /** Label for the per-file "Remove" button. */
  removeButtonText?: NativeTextOverride<NativeFileFieldItemRenderContext>;
  /** Text shown when no `pickFiles` implementation has been provided. */
  missingPickerNoticeText?: NativeTextOverride<NativeFileFieldRenderContext>;
  /** Render a custom icon for a given file in the list. */
  renderFileIcon?: (
    file: FileValue,
    ctx: NativeFileFieldItemRenderContext & {
      defaultIcon: React.ReactNode;
    },
  ) => React.ReactNode;
  /** Render the full "Pick files" button content. */
  renderPickButtonContent?: (
    ctx: NativeFileFieldRenderContext & {
      defaultContent: React.ReactNode;
    },
  ) => React.ReactNode;
  /** Render the full "Remove" button content per file. */
  renderRemoveButtonContent?: (
    ctx: NativeFileFieldItemRenderContext & {
      defaultContent: React.ReactNode;
    },
  ) => React.ReactNode;
  /** Render the metadata block for a file (size, dimensions, …). */
  renderFileMeta?: (
    ctx: NativeFileFieldItemRenderContext & {
      defaultContent: React.ReactNode;
    },
  ) => React.ReactNode;
  /** Render the "no picker installed" fallback notice. */
  renderMissingPickerNotice?: (
    ctx: NativeFileFieldRenderContext & {
      defaultContent: React.ReactNode;
    },
  ) => React.ReactNode;
}

/**
 * Override shape for the native async-autocomplete renderer — used when a
 * `select` field declares an async options source. Uses a modal picker
 * pattern on native.
 */
export interface NativeAsyncAutocompleteFieldPropsOverrides
  extends NativeFieldPropsBase<NativeAsyncAutocompleteFieldSlot>,
    NativeInputBehaviorProps {
  /** Passthrough props for the `TextInput` used inside the modal. */
  inputProps?: Record<string, unknown>;
  /** Replace the whole picker UI — see {@link SelectPickerRenderContext}. */
  renderPicker?: (ctx: SelectPickerRenderContext) => React.ReactNode;
}

// ─── Combined field overrides (catch-all for generic usage) ─────────────────────

/**
 * Catch-all override interface that surfaces *every* per-field override prop
 * from every native field type in one shape. Used by generic helpers and by
 * `globalDefaults.field` when you need to forward arbitrary props without
 * narrowing by field type.
 *
 * Prefer the per-field interfaces (e.g. {@link NativeTextFieldPropsOverrides})
 * when you know the field type — this one exists for generic code paths.
 */
export interface NativeFieldPropsOverrides
  extends NativeFieldPropsBase<NativeFieldSlot>,
    NativeInputBehaviorProps {
  /** Passthrough props for any text-like `TextInput`. */
  inputProps?: Record<string, unknown>;
  /** Passthrough props for the search `TextInput` in modal pickers. */
  searchInputProps?: Record<string, unknown>;
  /** Layout mode for the phone country picker. */
  countryLayout?: PhoneCountryLayout;
  /** Replace the whole select/autocomplete picker UI. */
  renderPicker?: (ctx: SelectPickerRenderContext) => React.ReactNode;
  /** Password: text/renderer for the "show password" toggle. */
  showPasswordText?: NativeTextOverride<NativePasswordFieldRenderContext>;
  /** Password: text/renderer for the "hide password" toggle. */
  hidePasswordText?: NativeTextOverride<NativePasswordFieldRenderContext>;
  /** Password: full renderer override for the visibility toggle content. */
  renderToggleContent?: (
    ctx: NativePasswordFieldRenderContext & {
      defaultContent: React.ReactNode;
    },
  ) => React.ReactNode;
  /** Password: override the strength label text. */
  renderStrengthLabel?: (
    ctx: NativePasswordFieldRenderContext & {
      defaultContent: React.ReactNode;
      result: StrengthResult;
    },
  ) => React.ReactNode;
  /** Password: override the strength entropy display. */
  renderStrengthEntropy?: (
    ctx: NativePasswordFieldRenderContext & {
      defaultContent: React.ReactNode;
      result: StrengthResult;
    },
  ) => React.ReactNode;
  /** Password: override the whole strength row (bar + label + entropy). */
  renderStrengthRowContent?: (
    ctx: NativePasswordFieldRenderContext & {
      defaultBarContent: React.ReactNode;
      defaultContent: React.ReactNode;
      defaultEntropyContent: React.ReactNode;
      defaultLabelContent: React.ReactNode;
      defaultMetaContent: React.ReactNode;
      result: StrengthResult;
    },
  ) => React.ReactNode;
  /** Password: override the rendering of a single rule in the rule list. */
  renderStrengthRule?: (
    ctx: NativePasswordFieldRuleRenderContext & {
      defaultContent: React.ReactNode;
    },
  ) => React.ReactNode;
  /** File: user-supplied file picker implementation. */
  pickFiles?: (ctx: {
    descriptor: {
      _label: string;
      _required: boolean;
      _hint?: string;
      _disabled: boolean;
      _fileAccept: string[];
      _fileMaxSize: number | null;
      _fileMultiple: boolean;
      _fileMaxFiles: number;
      _filePreview: boolean;
      _filePreviewHeight: number;
      _fileBase64: boolean;
      _fileDragDropLabel: string;
    };
    multiple: boolean;
  }) => Promise<FileValue[] | FileValue | null>;
  /** File: text shown while the picker is open / files are loading. */
  loadingText?: NativeTextOverride<NativeFileFieldRenderContext>;
  /** File: label for the "Pick files" button. */
  pickButtonText?: NativeTextOverride<NativeFileFieldRenderContext>;
  /** File: label for the per-file "Remove" button. */
  removeButtonText?: NativeTextOverride<NativeFileFieldItemRenderContext>;
  /** File: text shown when no `pickFiles` implementation is wired in. */
  missingPickerNoticeText?: NativeTextOverride<NativeFileFieldRenderContext>;
  /** File: render a custom icon for a given file in the list. */
  renderFileIcon?: (
    file: FileValue,
    ctx: NativeFileFieldItemRenderContext & {
      defaultIcon: React.ReactNode;
    },
  ) => React.ReactNode;
  /** File: render the full "Pick files" button content. */
  renderPickButtonContent?: (
    ctx: NativeFileFieldRenderContext & {
      defaultContent: React.ReactNode;
    },
  ) => React.ReactNode;
  /** File: render the full "Remove" button content per file. */
  renderRemoveButtonContent?: (
    ctx: NativeFileFieldItemRenderContext & {
      defaultContent: React.ReactNode;
    },
  ) => React.ReactNode;
  /** File: render the metadata block for a file (size, dimensions, …). */
  renderFileMeta?: (
    ctx: NativeFileFieldItemRenderContext & {
      defaultContent: React.ReactNode;
    },
  ) => React.ReactNode;
  /** File: render the "no picker installed" fallback notice. */
  renderMissingPickerNotice?: (
    ctx: NativeFileFieldRenderContext & {
      defaultContent: React.ReactNode;
    },
  ) => React.ReactNode;
  /** Phone: accessibility label for the country-picker trigger button. */
  countryButtonAriaLabel?: NativeTextOverride<NativePhoneFieldRenderContext>;
  /** Phone: placeholder for the country-search input. */
  searchPlaceholderText?: NativeTextOverride<NativePhoneFieldRenderContext>;
  /** Phone: text shown when the search query matches no countries. */
  emptySearchText?: NativeTextOverride<NativePhoneFieldRenderContext>;
  /** Phone: label shown next to the E.164 preview. */
  e164Text?: NativeTextOverride<
    NativePhoneFieldRenderContext & {
      e164: string;
    }
  >;
  /** Phone: full renderer for the country-picker trigger content. */
  renderCountryButtonContent?: (
    ctx: NativePhoneFieldRenderContext & {
      defaultContent: React.ReactNode;
    },
  ) => React.ReactNode;
  /** Phone: full renderer for a single row in the country list. */
  renderCountryItemContent?: (
    ctx: NativePhoneFieldCountryItemRenderContext & {
      defaultContent: React.ReactNode;
    },
  ) => React.ReactNode;
  /** Phone: full renderer for the "no results" state in the country picker. */
  renderEmptySearchContent?: (
    ctx: NativePhoneFieldRenderContext & {
      defaultContent: React.ReactNode;
    },
  ) => React.ReactNode;
  /** Phone: full renderer for the E.164 preview. */
  renderE164?: (
    ctx: NativePhoneFieldRenderContext & {
      defaultContent: React.ReactNode;
      e164: string;
    },
  ) => React.ReactNode;
}

// ─── Form & submit overrides ────────────────────────────────────────────────────

/**
 * Override shape for the `<Form>` wrapper `<View>` on native. Set via
 * `globalDefaults.form` on `useFormBridge` options.
 */
export interface NativeFormPropsOverrides {
  /** Style applied to the wrapper `<View>` wrapper. */
  style?: NativeStyleValue;
  /** Passthrough props spread on the wrapper `<View>`. */
  props?: Record<string, unknown>;
}

/**
 * Override shape for the `Form.Submit` button on native. Set via
 * `globalDefaults.submit` on `useFormBridge` options.
 */
export interface NativeSubmitPropsOverrides {
  /** Style applied to the outer `TouchableOpacity`. */
  style?: NativeStyleValue;
  /** Style applied to the inner container `<View>`. */
  containerStyle?: NativeStyleValue;
  /** Style applied to the button label `<Text>`. */
  textStyle?: NativeStyleValue;
  /** Color of the ActivityIndicator shown while submitting. */
  indicatorColor?: string;
  /** Content shown next to the spinner while submitting. */
  loadingText?: ReactNode;
  /** Passthrough props spread on the outer `TouchableOpacity`. */
  props?: Record<string, unknown>;
  /** Passthrough props spread on the inner content container `<View>`. */
  contentProps?: Record<string, unknown>;
}
