import type { FileValue } from '../core/field-builders/file/types';
import type { PasswordRule, StrengthResult } from '../core/field-builders/password/types';
import type { PhoneValue } from '../core/field-builders/phone/countries';
import type { CountryInfo, PhoneCountryLayout } from '../core/field-builders/phone/types';
import type { FieldAutoComplete } from './autoComplete';
import type {
  FieldUiRenderers,
  NativeStyleValue,
  SelectPickerRenderContext,
} from './field';

// ─── Slot utilities ─────────────────────────────────────────────────────────────
type NativeStyles<TSlots extends string> = Partial<Record<TSlots, NativeStyleValue>> &
  Record<string, NativeStyleValue | undefined>;
type NativeTextOverride<TContext> = string | ((ctx: TContext) => string);

// ─── Base types ─────────────────────────────────────────────────────────────────

type NativeFieldUiBase<TSlots extends string> = FieldUiRenderers & {
  id?: string;
  testID?: string;
  hideLabel?: boolean;
  /** When false, the default red field chrome is suppressed while the error message still renders. */
  highlightOnError?: boolean;
  styles?: NativeStyles<TSlots>;
  rootProps?: Record<string, unknown>;
  labelProps?: Record<string, unknown>;
  hintProps?: Record<string, unknown>;
  errorProps?: Record<string, unknown>;
};

type NativeInputBehaviorUi = {
  readOnly?: boolean;
  autoComplete?: FieldAutoComplete;
  autoFocus?: boolean;
  keyboardType?: string;
  secureTextEntry?: boolean;
};

// ─── Slot types ─────────────────────────────────────────────────────────────────

type NativeSharedFieldSlot =
  | 'root'
  | 'label'
  | 'input'
  | 'error'
  | 'hint'
  | 'requiredMark';
type NativeCheckboxFieldSlot =
  | NativeSharedFieldSlot
  | 'checkboxRow'
  | 'checkboxBox'
  | 'checkboxLabel';
type NativeSelectFieldSlot =
  | NativeSharedFieldSlot
  | 'optionTrigger'
  | 'optionRow'
  | 'optionLabel'
  | 'modalBackdrop'
  | 'modalCard';
type NativeOtpFieldSlot = NativeSharedFieldSlot | 'otpContainer' | 'otpInput';
type NativePasswordFieldSlot =
  | NativeSharedFieldSlot
  | 'strengthRow'
  | 'strengthBar'
  | 'strengthMeta'
  | 'strengthFill'
  | 'toggle'
  | 'toggleText'
  | 'strengthLabel'
  | 'strengthEntropy'
  | 'rulesList'
  | 'ruleItem'
  | 'ruleBullet'
  | 'ruleText';
type NativePhoneFieldSlot =
  | NativeSharedFieldSlot
  | 'row'
  | 'countryButton'
  | 'countryFlag'
  | 'countryDial'
  | 'countryDivider'
  | 'chevron'
  | 'e164'
  | 'modalBackdrop'
  | 'modalCard'
  | 'searchInput'
  | 'separator'
  | 'countryRow'
  | 'countryName'
  | 'emptyText';
type NativeFileFieldSlot =
  | NativeSharedFieldSlot
  | 'pickButton'
  | 'pickButtonText'
  | 'fileList'
  | 'fileItem'
  | 'fileIcon'
  | 'fileIconText'
  | 'fileName'
  | 'fileMeta'
  | 'removeButton'
  | 'removeText';
type NativeAsyncAutocompleteFieldSlot =
  | NativeSharedFieldSlot
  | 'trigger'
  | 'triggerValue'
  | 'triggerPlaceholder'
  | 'modalBackdrop'
  | 'modalCard'
  | 'searchInput'
  | 'loadingRow'
  | 'loadingText'
  | 'optionRow'
  | 'optionLabel'
  | 'emptyText';

// ─── Exported composite slot type ───────────────────────────────────────────────

export type NativeFieldSlot =
  | NativeSharedFieldSlot
  | NativeCheckboxFieldSlot
  | NativeSelectFieldSlot
  | NativeOtpFieldSlot
  | NativePasswordFieldSlot
  | NativePhoneFieldSlot
  | NativeFileFieldSlot
  | NativeAsyncAutocompleteFieldSlot;

export interface NativeFileFieldRenderContext {
  accept: string[];
  disabled: boolean;
  fileCount: number;
  loading: boolean;
  maxFiles: number;
  maxSize: number | null;
  multiple: boolean;
  preview: boolean;
  previewHeight: number;
}

export interface NativeFileFieldItemRenderContext extends NativeFileFieldRenderContext {
  defaultIcon: React.ReactNode;
  dimensionsLabel?: string;
  file: FileValue;
  formattedSize: string;
  index: number;
}

export interface NativePasswordFieldRenderContext {
  disabled: boolean;
  hasValue: boolean;
  revealed: boolean;
  result: StrengthResult | null;
  valueLength: number;
}

export interface NativePasswordFieldRuleRenderContext
  extends NativePasswordFieldRenderContext {
  index: number;
  rule: PasswordRule;
}

export interface NativePhoneFieldRenderContext {
  currentCountry: CountryInfo;
  disabled: boolean;
  e164Value: string | null;
  filteredCount: number;
  hasValue: boolean;
  layout: PhoneCountryLayout;
  nationalValue: string;
  open: boolean;
  preferredCountries: string[];
  search: string;
  searchable: boolean;
  showDialCode: boolean;
  showFlag: boolean;
  storeE164: boolean;
  value: PhoneValue | string | null;
}

export interface NativePhoneFieldCountryItemRenderContext
  extends NativePhoneFieldRenderContext {
  country: CountryInfo;
  index: number;
  selected: boolean;
}

// ─── Global overrides ───────────────────────────────────────────────────────────

export interface NativeGlobalFieldUiOverrides
  extends NativeFieldUiBase<NativeFieldSlot> {}

// ─── Per-field-type overrides ───────────────────────────────────────────────────

export interface NativeTextFieldUiOverrides
  extends NativeFieldUiBase<NativeSharedFieldSlot>,
    NativeInputBehaviorUi {
  inputProps?: Record<string, unknown>;
}

export interface NativeCheckboxFieldUiOverrides
  extends NativeFieldUiBase<NativeCheckboxFieldSlot> {}

export interface NativeSwitchFieldUiOverrides
  extends NativeFieldUiBase<NativeSharedFieldSlot> {}

export interface NativeSelectFieldUiOverrides
  extends NativeFieldUiBase<NativeSelectFieldSlot> {
  renderPicker?: (ctx: SelectPickerRenderContext) => React.ReactNode;
}

export interface NativeOtpFieldUiOverrides
  extends NativeFieldUiBase<NativeOtpFieldSlot>,
    NativeInputBehaviorUi {
  inputProps?: Record<string, unknown>;
}

export interface NativePasswordFieldUiOverrides
  extends NativeFieldUiBase<NativePasswordFieldSlot>,
    NativeInputBehaviorUi {
  inputProps?: Record<string, unknown>;
  showPasswordText?: NativeTextOverride<NativePasswordFieldRenderContext>;
  hidePasswordText?: NativeTextOverride<NativePasswordFieldRenderContext>;
  renderToggleContent?: (
    ctx: NativePasswordFieldRenderContext & {
      defaultContent: React.ReactNode;
    },
  ) => React.ReactNode;
  renderStrengthLabel?: (
    ctx: NativePasswordFieldRenderContext & {
      defaultContent: React.ReactNode;
      result: StrengthResult;
    },
  ) => React.ReactNode;
  renderStrengthEntropy?: (
    ctx: NativePasswordFieldRenderContext & {
      defaultContent: React.ReactNode;
      result: StrengthResult;
    },
  ) => React.ReactNode;
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
  renderStrengthRule?: (
    ctx: NativePasswordFieldRuleRenderContext & {
      defaultContent: React.ReactNode;
    },
  ) => React.ReactNode;
}

export interface NativePhoneFieldUiOverrides
  extends NativeFieldUiBase<NativePhoneFieldSlot>,
    NativeInputBehaviorUi {
  inputProps?: Record<string, unknown>;
  searchInputProps?: Record<string, unknown>;
  countryLayout?: PhoneCountryLayout;
  countryButtonAriaLabel?: NativeTextOverride<NativePhoneFieldRenderContext>;
  searchPlaceholderText?: NativeTextOverride<NativePhoneFieldRenderContext>;
  emptySearchText?: NativeTextOverride<NativePhoneFieldRenderContext>;
  e164Text?: NativeTextOverride<
    NativePhoneFieldRenderContext & {
      e164: string;
    }
  >;
  renderCountryButtonContent?: (
    ctx: NativePhoneFieldRenderContext & {
      defaultContent: React.ReactNode;
    },
  ) => React.ReactNode;
  renderCountryItemContent?: (
    ctx: NativePhoneFieldCountryItemRenderContext & {
      defaultContent: React.ReactNode;
    },
  ) => React.ReactNode;
  renderEmptySearchContent?: (
    ctx: NativePhoneFieldRenderContext & {
      defaultContent: React.ReactNode;
    },
  ) => React.ReactNode;
  renderE164?: (
    ctx: NativePhoneFieldRenderContext & {
      defaultContent: React.ReactNode;
      e164: string;
    },
  ) => React.ReactNode;
}

export interface NativeFileFieldUiOverrides
  extends NativeFieldUiBase<NativeFileFieldSlot> {
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
  loadingText?: NativeTextOverride<NativeFileFieldRenderContext>;
  pickButtonText?: NativeTextOverride<NativeFileFieldRenderContext>;
  removeButtonText?: NativeTextOverride<NativeFileFieldItemRenderContext>;
  missingPickerNoticeText?: NativeTextOverride<NativeFileFieldRenderContext>;
  renderFileIcon?: (
    file: FileValue,
    ctx: NativeFileFieldItemRenderContext & {
      defaultIcon: React.ReactNode;
    },
  ) => React.ReactNode;
  renderPickButtonContent?: (
    ctx: NativeFileFieldRenderContext & {
      defaultContent: React.ReactNode;
    },
  ) => React.ReactNode;
  renderRemoveButtonContent?: (
    ctx: NativeFileFieldItemRenderContext & {
      defaultContent: React.ReactNode;
    },
  ) => React.ReactNode;
  renderFileMeta?: (
    ctx: NativeFileFieldItemRenderContext & {
      defaultContent: React.ReactNode;
    },
  ) => React.ReactNode;
  renderMissingPickerNotice?: (
    ctx: NativeFileFieldRenderContext & {
      defaultContent: React.ReactNode;
    },
  ) => React.ReactNode;
}

export interface NativeAsyncAutocompleteFieldUiOverrides
  extends NativeFieldUiBase<NativeAsyncAutocompleteFieldSlot>,
    NativeInputBehaviorUi {
  inputProps?: Record<string, unknown>;
  renderPicker?: (ctx: SelectPickerRenderContext) => React.ReactNode;
}

// ─── Combined field overrides (catch-all for generic usage) ─────────────────────

export interface NativeFieldUiOverrides
  extends NativeFieldUiBase<NativeFieldSlot>,
    NativeInputBehaviorUi {
  inputProps?: Record<string, unknown>;
  searchInputProps?: Record<string, unknown>;
  countryLayout?: PhoneCountryLayout;
  renderPicker?: (ctx: SelectPickerRenderContext) => React.ReactNode;
  showPasswordText?: NativeTextOverride<NativePasswordFieldRenderContext>;
  hidePasswordText?: NativeTextOverride<NativePasswordFieldRenderContext>;
  renderToggleContent?: (
    ctx: NativePasswordFieldRenderContext & {
      defaultContent: React.ReactNode;
    },
  ) => React.ReactNode;
  renderStrengthLabel?: (
    ctx: NativePasswordFieldRenderContext & {
      defaultContent: React.ReactNode;
      result: StrengthResult;
    },
  ) => React.ReactNode;
  renderStrengthEntropy?: (
    ctx: NativePasswordFieldRenderContext & {
      defaultContent: React.ReactNode;
      result: StrengthResult;
    },
  ) => React.ReactNode;
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
  renderStrengthRule?: (
    ctx: NativePasswordFieldRuleRenderContext & {
      defaultContent: React.ReactNode;
    },
  ) => React.ReactNode;
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
  loadingText?: NativeTextOverride<NativeFileFieldRenderContext>;
  pickButtonText?: NativeTextOverride<NativeFileFieldRenderContext>;
  removeButtonText?: NativeTextOverride<NativeFileFieldItemRenderContext>;
  missingPickerNoticeText?: NativeTextOverride<NativeFileFieldRenderContext>;
  renderFileIcon?: (
    file: FileValue,
    ctx: NativeFileFieldItemRenderContext & {
      defaultIcon: React.ReactNode;
    },
  ) => React.ReactNode;
  renderPickButtonContent?: (
    ctx: NativeFileFieldRenderContext & {
      defaultContent: React.ReactNode;
    },
  ) => React.ReactNode;
  renderRemoveButtonContent?: (
    ctx: NativeFileFieldItemRenderContext & {
      defaultContent: React.ReactNode;
    },
  ) => React.ReactNode;
  renderFileMeta?: (
    ctx: NativeFileFieldItemRenderContext & {
      defaultContent: React.ReactNode;
    },
  ) => React.ReactNode;
  renderMissingPickerNotice?: (
    ctx: NativeFileFieldRenderContext & {
      defaultContent: React.ReactNode;
    },
  ) => React.ReactNode;
  countryButtonAriaLabel?: NativeTextOverride<NativePhoneFieldRenderContext>;
  searchPlaceholderText?: NativeTextOverride<NativePhoneFieldRenderContext>;
  emptySearchText?: NativeTextOverride<NativePhoneFieldRenderContext>;
  e164Text?: NativeTextOverride<
    NativePhoneFieldRenderContext & {
      e164: string;
    }
  >;
  renderCountryButtonContent?: (
    ctx: NativePhoneFieldRenderContext & {
      defaultContent: React.ReactNode;
    },
  ) => React.ReactNode;
  renderCountryItemContent?: (
    ctx: NativePhoneFieldCountryItemRenderContext & {
      defaultContent: React.ReactNode;
    },
  ) => React.ReactNode;
  renderEmptySearchContent?: (
    ctx: NativePhoneFieldRenderContext & {
      defaultContent: React.ReactNode;
    },
  ) => React.ReactNode;
  renderE164?: (
    ctx: NativePhoneFieldRenderContext & {
      defaultContent: React.ReactNode;
      e164: string;
    },
  ) => React.ReactNode;
}

// ─── Form & submit overrides ────────────────────────────────────────────────────

export interface NativeFormUiOverrides {
  style?: NativeStyleValue;
  props?: Record<string, unknown>;
}

export interface NativeSubmitUiOverrides {
  style?: NativeStyleValue;
  containerStyle?: NativeStyleValue;
  textStyle?: NativeStyleValue;
  indicatorColor?: string;
  loadingText?: string;
  props?: Record<string, unknown>;
  contentProps?: Record<string, unknown>;
}
