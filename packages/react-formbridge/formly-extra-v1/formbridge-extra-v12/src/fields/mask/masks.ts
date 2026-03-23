/**
 * formura — Input Mask Engine
 * ─────────────────────────────────
 * Cross-platform masking for phone, card, IBAN, date, custom patterns.
 *
 * Pattern characters:
 *   9  → digit  (0-9)
 *   a  → letter (a-z, A-Z)
 *   *  → any character
 *   \  → escape next character (literal)
 *
 * All other characters are treated as separators (auto-inserted).
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type MaskChar = '9' | 'a' | '*';

export interface MaskToken {
  /** Regex that this position must match */
  regex:     RegExp;
  /** Whether this position is a user input slot (vs a separator) */
  isInput:   boolean;
  /** The literal separator character (if !isInput) */
  separator: string;
}

export interface MaskResult {
  /** The formatted display value (with separators) */
  display:  string;
  /** The raw value (only user-typed chars, no separators) */
  raw:      string;
  /** Is the mask completely filled? */
  complete: boolean;
  /** Index of next empty input slot in the display string */
  nextCursorPos: number;
}

export interface ApplyMaskOptions {
  /** Show placeholder characters for empty slots */
  showPlaceholder?: boolean;
  /** Character to use as placeholder for empty slots */
  placeholder?: string;
}

// ─── Regex map ────────────────────────────────────────────────────────────────

const MASK_REGEX: Record<MaskChar, RegExp> = {
  '9': /\d/,
  'a': /[a-zA-Z]/,
  '*': /./,
};

// ─── Parse pattern into tokens ────────────────────────────────────────────────

export function parsePattern(pattern: string): MaskToken[] {
  const tokens: MaskToken[] = [];
  let i = 0;
  while (i < pattern.length) {
    const ch = pattern[i];
    if (ch === '\\') {
      // Escaped literal
      const next = pattern[i + 1] ?? '';
      tokens.push({ regex: /.*/, isInput: false, separator: next });
      i += 2;
    } else if (MASK_REGEX[ch as MaskChar]) {
      tokens.push({ regex: MASK_REGEX[ch as MaskChar], isInput: true, separator: '' });
      i++;
    } else {
      tokens.push({ regex: /.*/, isInput: false, separator: ch });
      i++;
    }
  }
  return tokens;
}

// ─── Apply mask to raw input ──────────────────────────────────────────────────

/**
 * Apply a mask pattern to a raw value string.
 *
 * @example
 * applyMask("4111111111111111", "9999 9999 9999 9999")
 * // → { display: "4111 1111 1111 1111", raw: "4111111111111111", complete: true }
 */
export function applyMask(
  raw:     string,
  pattern: string,
  opts:    ApplyMaskOptions = {},
): MaskResult {
  const tokens    = parsePattern(pattern);
  const ph        = opts.placeholder ?? '_';
  const showPh    = opts.showPlaceholder ?? false;
  const rawChars  = raw.replace(/[^a-zA-Z0-9]/g, '').split('');

  let display    = '';
  let rawOut     = '';
  let rawIdx     = 0;
  let inputSlots = 0;
  let filledSlots = 0;
  let nextCursorPos = -1;

  for (let ti = 0; ti < tokens.length; ti++) {
    const token = tokens[ti];

    if (!token.isInput) {
      // Auto-insert separator only if we have filled slots before it
      if (rawIdx > 0 || display.length === 0) {
        display += token.separator;
      }
      continue;
    }

    inputSlots++;

    // Find next raw char that matches this token
    while (rawIdx < rawChars.length && !token.regex.test(rawChars[rawIdx])) {
      rawIdx++;
    }

    if (rawIdx < rawChars.length) {
      const ch = rawChars[rawIdx];
      display  += ch;
      rawOut   += ch;
      rawIdx++;
      filledSlots++;
    } else {
      // No more raw input
      if (nextCursorPos === -1) nextCursorPos = display.length;
      if (showPh) display += ph;
    }
  }

  return {
    display,
    raw:      rawOut,
    complete: filledSlots === inputSlots,
    nextCursorPos: nextCursorPos === -1 ? display.length : nextCursorPos,
  };
}

/**
 * Extract only user-typed characters from a masked display string.
 */
export function extractRaw(display: string, pattern: string): string {
  const tokens  = parsePattern(pattern);
  const chars   = display.split('');
  let rawOut    = '';
  let charIdx   = 0;

  for (const token of tokens) {
    if (charIdx >= chars.length) break;
    if (!token.isInput) {
      // Skip separator if it matches
      if (chars[charIdx] === token.separator) charIdx++;
      continue;
    }
    if (token.regex.test(chars[charIdx])) {
      rawOut += chars[charIdx];
      charIdx++;
    } else {
      break;
    }
  }

  return rawOut;
}

/**
 * Compute new cursor position after a character is typed or deleted.
 * Skips over separators automatically.
 */
export function computeCursorPosition(
  display:       string,
  cursorAfterRaw: number,
  pattern:       string,
): number {
  const tokens = parsePattern(pattern);
  let inputCount = 0;
  let pos        = 0;

  for (let ti = 0; ti < tokens.length; ti++) {
    if (pos >= display.length + 1) break;
    const token = tokens[ti];

    if (!token.isInput) {
      pos++;
      continue;
    }

    if (inputCount >= cursorAfterRaw) break;
    inputCount++;
    pos++;
  }

  return pos;
}

// ─── Built-in mask presets ────────────────────────────────────────────────────

export const MASKS = {
  // ── Phone ──────────────────────────────────────────────────────
  /** +33 6 12 34 56 78 */
  PHONE_FR:       '+33 9 99 99 99 99',
  /** +1 (555) 123-4567 */
  PHONE_US:       '+1 (999) 999-9999',
  /** +44 7911 123456 */
  PHONE_UK:       '+44 99999 999999',
  /** +XX XXX XXX XXXX (generic international E.164) */
  PHONE_INTL:     '+99 999 999 9999',
  /** 06 12 34 56 78 (French mobile without country code) */
  PHONE_FR_LOCAL: '99 99 99 99 99',

  // ── Card numbers ───────────────────────────────────────────────
  /** 4111 1111 1111 1111 (Visa / Mastercard / 16-digit) */
  CARD_16:        '9999 9999 9999 9999',
  /** 3782 822463 10005 (Amex 15-digit) */
  CARD_AMEX:      '9999 999999 99999',
  /** 4111 1111 1111 1111 1111 (19-digit) */
  CARD_19:        '9999 9999 9999 9999 999',

  // ── Card security ──────────────────────────────────────────────
  /** 123 */
  CVV:            '999',
  /** 1234 (Amex) */
  CVV_AMEX:       '9999',
  /** 12/34 */
  EXPIRY:         '99/99',

  // ── Date & Time ────────────────────────────────────────────────
  /** 31/12/2025 */
  DATE_DMY:       '99/99/9999',
  /** 12/31/2025 */
  DATE_MDY:       '99/99/9999',
  /** 2025-12-31 */
  DATE_ISO:       '9999-99-99',
  /** 12:34 */
  TIME_HM:        '99:99',
  /** 12:34:56 */
  TIME_HMS:       '99:99:99',
  /** 31/12/2025 12:34 */
  DATETIME:       '99/99/9999 99:99',

  // ── Bank / Finance ─────────────────────────────────────────────
  /** FR76 3000 6000 0112 3456 7890 189 */
  IBAN_FR:        'aa99 9999 9999 9999 9999 9999 999',
  /** DE89 3704 0044 0532 0130 00 */
  IBAN_DE:        'aa99 9999 9999 9999 9999 99',
  /** GB29 NWBK 6016 1331 9268 19 */
  IBAN_GB:        'aa99 aaaa 9999 9999 9999 99',
  /** Generic IBAN (up to 34 chars) */
  IBAN:           'aa99 9999 9999 9999 9999 9999 9999 99',
  /** 12-3456-1234567-01 (NZ bank) */
  BANK_NZ:        '99-9999-9999999-99',
  /** 12345678901 (French SIREN) */
  SIREN:          '999 999 999',
  /** 123456789 01234 (French SIRET) */
  SIRET:          '999 999 999 99999',

  // ── Postal / Identity ──────────────────────────────────────────
  /** 75001 */
  ZIP_FR:         '99999',
  /** 90210 */
  ZIP_US:         '99999',
  /** 90210-1234 */
  ZIP_US_PLUS4:   '99999-9999',
  /** SW1A 1AA (UK postcode) */
  POSTCODE_UK:    'aa9 9aa',
  /** 123-45-6789 (US SSN) */
  SSN:            '999-99-9999',
  /** 1234 5678 901 23 (French NIR/INSEE) */
  NIR_FR:         '9 99 99 99 999 999 99',

  // ── Other ──────────────────────────────────────────────────────
  /** 192.168.001.001 */
  IP_ADDRESS:     '999.999.999.999',
  /** HH:MM:SS.mmm (duration) */
  DURATION:       '99:99:99.999',
  /** 1 234 567 (number with spaces every 3) */
  NUMBER_FR:      '9 999 999',
} as const;

export type MaskPreset = keyof typeof MASKS;

// ─── Mask validator ───────────────────────────────────────────────────────────

/**
 * Creates a validator that ensures the mask is completely filled.
 */
export function maskCompleteValidator(
  pattern: string,
  message = 'Please complete this field.',
): (value: string) => string | null {
  return (value: string) => {
    const result = applyMask(value, pattern);
    return result.complete ? null : message;
  };
}
