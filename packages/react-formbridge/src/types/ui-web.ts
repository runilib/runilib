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
import type { FieldUiRenderers, SelectOption, SelectPickerRenderContext } from './field';

// ─── Slot utilities ─────────────────────────────────────────────────────────────

type WebClassNames<TSlots extends string> = Partial<Record<TSlots, string>> &
  Record<string, string | undefined>;
type WebStyles<TSlots extends string> = Partial<Record<TSlots, CSSProperties>> &
  Record<string, CSSProperties | undefined>;
type WebTextOverride<TContext> = string | ((ctx: TContext) => string);

// ─── Base types ─────────────────────────────────────────────────────────────────

type WebFieldUiBase<TSlots extends string> = FieldUiRenderers & {
  id?: string;
  hideLabel?: boolean;
  /** When false, the default red field chrome is suppressed while the error message still renders. */
  highlightOnError?: boolean;
  classNames?: WebClassNames<TSlots>;
  styles?: WebStyles<TSlots>;
  rootProps?: HTMLAttributes<HTMLDivElement>;
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>;
  hintProps?: HTMLAttributes<HTMLSpanElement>;
  errorProps?: HTMLAttributes<HTMLSpanElement>;
};

type WebInputBehaviorUi = {
  readOnly?: boolean;
  autoComplete?: FieldAutoComplete;
  autoFocus?: boolean;
  spellCheck?: boolean;
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode'];
  enterKeyHint?: InputHTMLAttributes<HTMLInputElement>['enterKeyHint'];
};

// ─── Slot types ─────────────────────────────────────────────────────────────────

type WebSharedFieldSlot = 'root' | 'label' | 'hint' | 'error' | 'requiredMark';
type WebTextFieldSlot = WebSharedFieldSlot | 'input';
type WebTextareaFieldSlot = WebSharedFieldSlot | 'textarea';
type WebCheckboxFieldSlot =
  | WebSharedFieldSlot
  | 'checkboxRow'
  | 'checkboxInput'
  | 'checkboxLabel';
type WebSwitchFieldSlot =
  | WebSharedFieldSlot
  | 'switchRoot'
  | 'switchTrack'
  | 'switchThumb'
  | 'switchLabel';
type WebSelectFieldSlot = WebSharedFieldSlot | 'select';
type WebOtpFieldSlot = WebSharedFieldSlot | 'otpContainer' | 'otpInput';
type WebPasswordFieldSlot =
  | WebTextFieldSlot
  | 'toggle'
  | 'strengthRow'
  | 'strengthBar'
  | 'strengthMeta'
  | 'strengthFill'
  | 'strengthLabel'
  | 'strengthEntropy'
  | 'rulesList'
  | 'ruleItem'
  | 'ruleBullet'
  | 'ruleText';
type WebPhoneFieldSlot =
  | WebTextFieldSlot
  | 'row'
  | 'countryButton'
  | 'countryFlag'
  | 'countryDivider'
  | 'chevron'
  | 'countrySearchInput'
  | 'countrySearchWrapper'
  | 'countryList'
  | 'countryScroll'
  | 'countryItem'
  | 'separator'
  | 'countryName'
  | 'countryDial'
  | 'e164'
  | 'emptyText';
type WebFileFieldSlot =
  | WebSharedFieldSlot
  | 'dropZone'
  | 'dropZoneIcon'
  | 'dropZoneText'
  | 'browseButton'
  | 'list'
  | 'listItem'
  | 'previewImage'
  | 'fileIcon'
  | 'fileName'
  | 'fileMeta'
  | 'removeButton'
  | 'addMoreButton';
type WebAsyncAutocompleteFieldSlot =
  | WebTextFieldSlot
  | 'select'
  | 'listbox'
  | 'option'
  | 'optionActive'
  | 'optionSelected'
  | 'empty'
  | 'loading';

// ─── Exported composite slot type ───────────────────────────────────────────────

export type WebFieldSlot =
  | WebTextFieldSlot
  | WebTextareaFieldSlot
  | WebCheckboxFieldSlot
  | WebSwitchFieldSlot
  | WebSelectFieldSlot
  | WebOtpFieldSlot
  | WebPasswordFieldSlot
  | WebPhoneFieldSlot
  | WebFileFieldSlot
  | WebAsyncAutocompleteFieldSlot;

export interface WebFileFieldRenderContext {
  accept: string[];
  disabled: boolean;
  dragging: boolean;
  fileCount: number;
  loading: boolean;
  maxFiles: number;
  maxSize: number | null;
  multiple: boolean;
  preview: boolean;
  previewHeight: number;
}

export interface WebFileFieldItemRenderContext extends WebFileFieldRenderContext {
  defaultIcon: ReactNode;
  dimensionsLabel?: string;
  file: FileValue;
  formattedSize: string;
  index: number;
}

export interface WebPasswordFieldRenderContext {
  disabled: boolean;
  hasValue: boolean;
  revealed: boolean;
  result: StrengthResult | null;
  valueLength: number;
}

export interface WebPasswordFieldRuleRenderContext extends WebPasswordFieldRenderContext {
  index: number;
  rule: PasswordRule;
}

export interface WebPhoneFieldRenderContext {
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

export interface WebPhoneFieldCountryItemRenderContext
  extends WebPhoneFieldRenderContext {
  country: CountryInfo;
  index: number;
  selected: boolean;
}

// ─── Global overrides ───────────────────────────────────────────────────────────

export interface WebGlobalFieldUiOverrides extends WebFieldUiBase<WebFieldSlot> {}

// ─── Per-field-type overrides ───────────────────────────────────────────────────

export interface WebTextFieldUiOverrides
  extends WebFieldUiBase<WebTextFieldSlot>,
    WebInputBehaviorUi {
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'onFocus' | 'disabled' | 'name'
  >;
}

export interface WebTextareaFieldUiOverrides
  extends WebFieldUiBase<WebTextareaFieldSlot>,
    WebInputBehaviorUi {
  textareaProps?: Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'onFocus' | 'disabled' | 'name'
  >;
}

export interface WebCheckboxFieldUiOverrides
  extends WebFieldUiBase<WebCheckboxFieldSlot>,
    WebInputBehaviorUi {
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'checked' | 'defaultChecked' | 'onChange' | 'onBlur' | 'onFocus' | 'disabled' | 'name'
  >;
}

export interface WebSwitchFieldUiOverrides
  extends WebFieldUiBase<WebSwitchFieldSlot>,
    WebInputBehaviorUi {
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'checked' | 'defaultChecked' | 'onChange' | 'onBlur' | 'onFocus' | 'disabled' | 'name'
  >;
}

export interface WebSelectFieldUiOverrides extends WebFieldUiBase<WebSelectFieldSlot> {
  selectProps?: Omit<
    SelectHTMLAttributes<HTMLSelectElement>,
    'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'onFocus' | 'disabled' | 'name'
  >;
  renderPicker?: (ctx: SelectPickerRenderContext) => React.ReactNode;
}

export interface WebRadioFieldUiOverrides
  extends WebFieldUiBase<WebCheckboxFieldSlot>,
    WebInputBehaviorUi {
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'checked' | 'defaultChecked' | 'onChange' | 'onBlur' | 'onFocus' | 'disabled' | 'name'
  >;
  renderPicker?: (ctx: SelectPickerRenderContext) => React.ReactNode;
}

export interface WebOtpFieldUiOverrides
  extends WebFieldUiBase<WebOtpFieldSlot>,
    WebInputBehaviorUi {
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'onFocus' | 'disabled' | 'name'
  >;
}

export interface WebPasswordFieldUiOverrides
  extends WebFieldUiBase<WebPasswordFieldSlot>,
    WebInputBehaviorUi {
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
}

export interface WebPhoneFieldUiOverrides
  extends WebFieldUiBase<WebPhoneFieldSlot>,
    WebInputBehaviorUi {
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
  searchInputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onChange'
  >;
  countryLayout?: PhoneCountryLayout;
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

export interface WebFileFieldUiOverrides extends WebFieldUiBase<WebFileFieldSlot> {
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
}

export interface WebAsyncAutocompleteFieldUiOverrides
  extends WebFieldUiBase<WebAsyncAutocompleteFieldSlot> {
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
  renderOption?: (
    option: SelectOption,
    state: { active: boolean; selected: boolean },
  ) => React.ReactNode;
  renderEmpty?: () => React.ReactNode;
  renderLoading?: () => React.ReactNode;
  renderPicker?: (ctx: SelectPickerRenderContext) => React.ReactNode;
}

// ─── Combined field overrides (catch-all for generic usage) ─────────────────────

export interface WebFieldUiOverrides
  extends WebFieldUiBase<WebFieldSlot>,
    WebInputBehaviorUi {
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'onFocus' | 'disabled' | 'name'
  >;
  textareaProps?: Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'onFocus' | 'disabled' | 'name'
  >;
  selectProps?: Omit<
    SelectHTMLAttributes<HTMLSelectElement>,
    'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'onFocus' | 'disabled' | 'name'
  >;
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

export interface WebFormUiOverrides {
  className?: string;
  style?: CSSProperties;
  props?: Omit<
    FormHTMLAttributes<HTMLFormElement>,
    'children' | 'onSubmit' | 'className' | 'style'
  >;
}

export interface WebSubmitUiOverrides {
  className?: string;
  style?: CSSProperties;
  loadingText?: string;
  props?: Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'children' | 'type' | 'disabled' | 'className' | 'style'
  >;
}
