import { parsePhoneNumberFromString } from 'libphonenumber-js';
import type { FieldDescriptor } from '../../../types/field';
import type { FieldConditions } from '../../conditions/conditions';
import { BaseFieldBuilder } from '../base/BaseFieldBuilder';
import { buildPhoneValue, getCountry, type PhoneValue } from './countries';
import type { PhoneCountryLayout } from './types';

export interface PhoneFieldMeta {
  _phoneEnabled: true;
  _phoneDefaultCountry: string;
  _phonePreferred: string[];
  _phoneSearchable: boolean;
  _phoneShowFlag: boolean;
  _phoneShowDialCode: boolean;
  _phoneCountryLayout: PhoneCountryLayout;
  _phoneStoreE164: boolean;
  _phoneValidateFormat: boolean;
}

export type PhoneDescriptor = FieldDescriptor<PhoneValue | string | null, 'phone'> &
  PhoneFieldMeta & {
    _conditions?: FieldConditions<any>;
  };

export class PhoneFieldBuilder extends BaseFieldBuilder<
  PhoneValue | string | null,
  'phone'
> {
  private readonly _meta: PhoneFieldMeta;

  constructor() {
    super('phone', null);

    this._desc._placeholder = 'Enter phone number';
    this._desc._requiredMsg = 'Please enter a phone number.';
    this._desc._debounce = 0;
    this._desc._trim = false;

    this._meta = {
      _phoneEnabled: true,
      _phoneDefaultCountry: 'FR',
      _phonePreferred: ['FR', 'US', 'GB', 'DE', 'ES'],
      _phoneSearchable: true,
      _phoneShowFlag: true,
      _phoneShowDialCode: true,
      _phoneCountryLayout: 'integrated',
      _phoneStoreE164: false,
      _phoneValidateFormat: true,
    };
  }

  override required(message?: string): this {
    super.required(message ?? 'Please enter a phone number.');
    return this;
  }

  override hint(text: string): this {
    super.hint(text);
    return this;
  }

  override disabled(value = true): this {
    super.disabled(value);
    return this;
  }

  override placeholder(text?: string): this {
    super.placeholder(text ?? 'Enter phone number');
    return this;
  }

  defaultCountry(code: string): this {
    this._meta._phoneDefaultCountry = code.toUpperCase();
    return this;
  }

  preferredCountries(codes: string[]): this {
    this._meta._phonePreferred = codes.map((countryCode) => countryCode.toUpperCase());
    return this;
  }

  searchable(value = true): this {
    this._meta._phoneSearchable = value;
    return this;
  }

  showFlag(value = true): this {
    this._meta._phoneShowFlag = value;
    return this;
  }

  showDialCode(value = true): this {
    this._meta._phoneShowDialCode = value;
    return this;
  }

  countryLayout(layout: PhoneCountryLayout): this {
    this._meta._phoneCountryLayout = layout;
    return this;
  }

  storeE164(): this {
    this._meta._phoneStoreE164 = true;
    return this;
  }

  validateFormat(value = true): this {
    this._meta._phoneValidateFormat = value;
    return this;
  }

  /**
   * @internal
   */
  override _build(): PhoneDescriptor {
    const base = super._build();
    const validators = [...base._validators];

    const toCandidate = (value: unknown): string => {
      if (!value) {
        return '';
      }

      if (typeof value === 'string') {
        return value.trim();
      }

      const phone = value as PhoneValue;

      if (phone.e164?.trim()) {
        return phone.e164.trim();
      }

      if (phone.country && phone.national?.trim()) {
        const country = getCountry(phone.country);
        if (country) {
          return buildPhoneValue(country, phone.national).e164;
        }
      }

      return phone.national?.trim() ?? '';
    };

    if (base._required) {
      validators.push((value: unknown) => {
        const candidate = toCandidate(value);

        if (!candidate) {
          return base._requiredMsg ?? 'Please enter a phone number.';
        }

        if (candidate.replace(/\D/g, '').length === 0) {
          return base._requiredMsg ?? 'Please enter a phone number.';
        }

        return null;
      });
    }

    if (this._meta._phoneValidateFormat) {
      validators.push((value: unknown) => {
        const candidate = toCandidate(value);

        if (!candidate) {
          return null;
        }

        const parsed = parsePhoneNumberFromString(candidate);

        if (!parsed) {
          return 'Phone number format is invalid.';
        }

        if (!parsed.isPossible()) {
          return 'Phone number is too short or too long.';
        }

        if (!parsed.isValid()) {
          return 'Phone number format is invalid.';
        }

        return null;
      });
    }

    return {
      ...base,
      ...this._meta,
      _type: 'phone',
      _validators: validators,
    };
  }
}

export function isPhoneDescriptor(d: object): d is PhoneDescriptor {
  return '_phoneEnabled' in d;
}
