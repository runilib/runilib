import type { BuiltinMaskChar } from './types';

export const MASKS = {
  // Cards
  CARD_16: '9999 9999 9999 9999',
  CARD_AMEX: '9999 999999 99999',
  CARD_19: '9999 9999 9999 9999 999',

  // Security / expiry
  CVV: '999',
  CVV_AMEX: '9999',
  EXPIRY: '99/99',

  // Date / time
  DATE_DMY: '99/99/9999',
  DATE_MDY: '99/99/9999',
  DATE_ISO: '9999-99-99',
  TIME_HM: '99:99',
  TIME_HMS: '99:99:99',
  DATETIME: '99/99/9999 99:99',

  // Bank / finance
  IBAN_FR: 'aa99 9999 9999 9999 9999 9999 999',
  IBAN_DE: 'aa99 9999 9999 9999 9999 99',
  IBAN_GB: 'aa99 aaaa 9999 9999 9999 99',
  IBAN: 'aa99 9999 9999 9999 9999 9999 9999 99',
  BANK_NZ: '99-9999-9999999-99',
  SIREN: '999 999 999',
  SIRET: '999 999 999 99999',

  // Postal / identity
  ZIP_FR: '99999',
  ZIP_US: '99999',
  ZIP_US_PLUS4: '99999-9999',
  POSTCODE_UK: 'aa9 9aa',
  SSN: '999-99-9999',
  NIR_FR: '9 99 99 99 999 999 99',

  // Other
  IP_ADDRESS: '999.999.999.999',
  DURATION: '99:99:99.999',
  NUMBER_FR: '9 999 999',
} as const;

export type MaskPreset = keyof typeof MASKS;

export const MASK_REGEX: Record<BuiltinMaskChar, RegExp> = {
  '9': /\d/,
  a: /[a-zA-Z]/,
  '*': /./,
};
