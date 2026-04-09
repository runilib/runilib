import type { CountryCode } from 'libphonenumber-js';

export type PhoneCountryLayout = 'integrated' | 'detached';

export interface CountryInfo {
  /** ISO 3166-1 alpha-2 code */
  code: CountryCode;
  /** Country name */
  name: string;
  /** International dial code (without +) */
  dial: string;
  /** Flag emoji */
  flag: string;
  /** Example national format, used as placeholder/help */
  exampleNational?: string;
  /** Priority — shown at top of the list (higher = earlier) */
  priority?: number;
}
