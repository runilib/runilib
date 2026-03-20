import type { PhoneValue, CountryInfo } from './countries';

export interface PhoneFieldMeta {
  _phoneEnabled:         true;
  _phoneDefaultCountry:  string;
  _phonePreferred:       string[];
  _phoneSearchable:      boolean;
  _phoneShowFlag:        boolean;
  _phoneShowDialCode:    boolean;
  _phoneStoreE164:       boolean;
  _phoneValidateFormat:  boolean;
}

export class PhoneFieldBuilder {
  private _meta: PhoneFieldMeta;
  private _label:       string;
  private _required:    boolean = false;
  private _requiredMsg: string  = 'Please enter a phone number.';
  private _hint?:       string;
  private _disabled:    boolean = false;
  private _placeholder: string  = 'Enter phone number';

  constructor(label: string) {
    this._label = label;
    this._meta  = {
      _phoneEnabled:        true,
      _phoneDefaultCountry: 'FR',
      _phonePreferred:      ['FR', 'US', 'GB', 'DE', 'ES'],
      _phoneSearchable:     true,
      _phoneShowFlag:       true,
      _phoneShowDialCode:   true,
      _phoneStoreE164:      false,  // by default stores PhoneValue object
      _phoneValidateFormat: true,
    };
  }

  required(message?: string): this {
    this._required    = true;
    this._requiredMsg = message ?? 'Please enter a phone number.';
    return this;
  }

  hint(text: string): this { this._hint = text; return this; }
  disabled(v = true): this { this._disabled = v; return this; }
  placeholder(text: string): this { this._placeholder = text; return this; }

  /** Default country shown when no value is set */
  defaultCountry(code: string): this {
    this._meta._phoneDefaultCountry = code.toUpperCase();
    return this;
  }

  /** Countries shown at the top of the picker */
  preferredCountries(codes: string[]): this {
    this._meta._phonePreferred = codes.map(c => c.toUpperCase());
    return this;
  }

  /** Show a search box in the country picker */
  searchable(value = true): this {
    this._meta._phoneSearchable = value;
    return this;
  }

  /** Show country flag in the selector */
  showFlag(value = true): this {
    this._meta._phoneShowFlag = value;
    return this;
  }

  /** Show dial code (+33) next to the flag */
  showDialCode(value = true): this {
    this._meta._phoneShowDialCode = value;
    return this;
  }

  /**
   * Store just the E.164 string (+33612345678) instead of the full PhoneValue object.
   * Useful when your API expects a plain string.
   */
  storeE164(): this {
    this._meta._phoneStoreE164 = true;
    return this;
  }

  /** Validate that the national number fills the country mask */
  validateFormat(value = true): this {
    this._meta._phoneValidateFormat = value;
    return this;
  }

  _build() {
    const validators: ((v: unknown) => string | null)[] = [];

    if (this._required) {
      validators.push((v: unknown) => {
        if (!v) return this._requiredMsg;
        const pv = v as PhoneValue;
        if (!pv.national || pv.national.replace(/\D/g, '').length === 0) return this._requiredMsg;
        return null;
      });
    }

    if (this._meta._phoneValidateFormat) {
      validators.push((v: unknown) => {
        if (!v) return null;
        const pv  = v as PhoneValue;
        const raw = pv.national?.replace(/\D/g, '') ?? '';
        if (raw.length === 0) return null; // covered by required
        if (raw.length < 5) return 'Phone number is too short.';
        if (raw.length > 15) return 'Phone number is too long.';
        return null;
      });
    }

    return {
      _type:         'phone' as const,
      _label:        this._label,
      _defaultValue: null as PhoneValue | null,
      _required:     this._required,
      _requiredMsg:  this._requiredMsg,
      _hint:         this._hint,
      _placeholder:  this._placeholder,
      _disabled:     this._disabled,
      _trim:         false,
      _debounce:     0,
      _validators:   validators,
      ...this._meta,
    };
  }
}

export type PhoneDescriptor = ReturnType<PhoneFieldBuilder['_build']>;

export function isPhoneDescriptor(d: object): d is PhoneDescriptor {
  return '_phoneEnabled' in d;
}
