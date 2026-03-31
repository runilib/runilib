import type { CountryCode } from 'libphonenumber-js';

export const PRIORITY: Partial<Record<CountryCode, number>> = {
  FR: 10,
  US: 9,
  GB: 8,
  DE: 7,
  ES: 6,
  IT: 5,
  SN: 4,
  CI: 3,
  CA: 2,
  BE: 1,
};
