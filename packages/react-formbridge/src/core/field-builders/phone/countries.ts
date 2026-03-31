import {
  AsYouType,
  type CountryCode,
  getCountries,
  getCountryCallingCode,
  getExampleNumber,
  parsePhoneNumberFromString,
} from 'libphonenumber-js';
import examples from 'libphonenumber-js/mobile/examples';
import { PRIORITY } from './contants';
import type { CountryInfo } from './types';

function countryCodeToFlag(code: string): string {
  return code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

function getCountryName(code: string, locale = 'en'): string {
  try {
    const displayNames = new Intl.DisplayNames([locale], { type: 'region' });
    return displayNames.of(code) ?? code;
  } catch {
    return code;
  }
}

export const COUNTRIES: CountryInfo[] = getCountries().map((code) => {
  const dial = getCountryCallingCode(code);
  const exampleNational = getExampleNumber(code, examples)?.formatNational();

  return {
    code,
    name: getCountryName(code),
    dial,
    flag: countryCodeToFlag(code),
    exampleNational,
    priority: PRIORITY[code],
  };
});

export const COUNTRIES_SORTED = [...COUNTRIES].sort((a, b) => {
  if ((b.priority ?? 0) !== (a.priority ?? 0)) {
    return (b.priority ?? 0) - (a.priority ?? 0);
  }

  return a.name.localeCompare(b.name);
});

export function getCountry(code: string): CountryInfo | undefined {
  const normalized = code.toUpperCase() as CountryCode;
  return COUNTRIES.find((country) => country.code === normalized);
}

export function getCountryByDial(dial: string): CountryInfo | undefined {
  return COUNTRIES.find((country) => country.dial === dial);
}

export function searchCountries(query: string): CountryInfo[] {
  const q = query.toLowerCase().trim();

  if (!q) {
    return COUNTRIES_SORTED;
  }

  return COUNTRIES_SORTED.filter(
    (country) =>
      country.name.toLowerCase().includes(q) ||
      country.code.toLowerCase().includes(q) ||
      country.dial.includes(q),
  );
}

export interface PhoneValue {
  /** Country ISO code */
  country: string;
  /** Local number formatted in national style */
  national: string;
  /** Full E.164 number */
  e164: string;
  /** Full international display */
  display: string;
}

export function buildPhoneValue(country: CountryInfo, input: string): PhoneValue {
  const trimmed = input.trim();
  const formatter = trimmed.startsWith('+')
    ? new AsYouType()
    : new AsYouType(country.code);

  const formatted = formatter.input(trimmed);
  const parsed = formatter.getNumber();

  const resolvedCountry = (parsed?.country && getCountry(parsed.country)) ?? country;

  const national = parsed?.formatNational() ?? formatted;

  const digits = trimmed.replace(/\D/g, '');
  const e164 =
    parsed?.number ?? (digits.length > 0 ? `+${resolvedCountry.dial}${digits}` : '');

  const display =
    parsed?.formatInternational() ??
    (digits.length > 0 ? `+${resolvedCountry.dial} ${national}`.trim() : '');

  return {
    country: resolvedCountry.code,
    national,
    e164,
    display,
  };
}

export function parseStoredPhoneValue(
  value: PhoneValue | string | null | undefined,
  fallbackCountryCode = 'FR',
): PhoneValue | null {
  const fallbackCountry = getCountry(fallbackCountryCode) ?? COUNTRIES_SORTED[0];

  if (!value) {
    return null;
  }

  if (typeof value !== 'string') {
    if (value.e164) {
      const parsed = parsePhoneNumberFromString(value.e164);

      if (parsed) {
        const resolvedCountry =
          (parsed.country && getCountry(parsed.country)) ??
          getCountry(value.country) ??
          fallbackCountry;

        return {
          country: resolvedCountry.code,
          national: parsed.formatNational(),
          e164: parsed.number,
          display: parsed.formatInternational(),
        };
      }
    }

    const country = getCountry(value.country) ?? fallbackCountry;

    if (!value.national?.trim()) {
      return null;
    }

    return buildPhoneValue(country, value.national);
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const parsed = parsePhoneNumberFromString(
    trimmed,
    trimmed.startsWith('+') ? undefined : fallbackCountry.code,
  );

  if (parsed) {
    const resolvedCountry =
      (parsed.country && getCountry(parsed.country)) ?? fallbackCountry;

    return {
      country: resolvedCountry.code,
      national: parsed.formatNational(),
      e164: parsed.number,
      display: parsed.formatInternational(),
    };
  }

  return buildPhoneValue(fallbackCountry, trimmed);
}
