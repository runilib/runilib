import { BaseFieldBuilder } from '../base/BaseFieldBuilder';

/** Character set accepted in an OTP field. */
export type OtpCharset = 'digits' | 'letters' | 'alphanumeric';

const OTP_CHARSET_PATTERNS: Record<OtpCharset, { single: RegExp; full: RegExp }> = {
  digits: { single: /^\d$/, full: /^\d*$/ },
  letters: { single: /^[A-Za-z]$/, full: /^[A-Za-z]*$/ },
  alphanumeric: { single: /^[A-Za-z0-9]$/, full: /^[A-Za-z0-9]*$/ },
};

/**
 * Returns the regex pair used to validate (`full`) and filter individual
 * keystrokes (`single`) for the given OTP charset. Renderers use this to
 * derive keyboard hints and to drop disallowed characters as the user types.
 */
export function getOtpCharsetPattern(charset: OtpCharset) {
  return OTP_CHARSET_PATTERNS[charset];
}

// ─── OTP field builder ───────────────────────────────────────────────────────
export class OtpFieldBuilder extends BaseFieldBuilder<string, 'otp'> {
  constructor() {
    super('otp', '');
  }

  length(length: number, message?: string): this {
    this._desc._otpLength = length;
    this._desc._min = length;
    this._desc._max = length;

    this._desc._validators.push((value: string) =>
      value.length === length
        ? null
        : (message ?? `Code must be exactly ${length} digits.`),
    );

    return this;
  }

  /**
   * Restricts the OTP value to digits only (`0-9`). Sets the OTP charset so
   * web/native renderers pick a numeric keyboard and reject non-digit
   * keystrokes before they reach form state.
   */
  digitsOnly(message?: string): this {
    return this._restrictTo('digits', message ?? 'Only digits are allowed.');
  }

  /**
   * Restricts the OTP value to ASCII letters (`A-Z`, `a-z`). Useful for
   * letter-only access codes and short tokens. Renderers fall back to a
   * standard text keyboard.
   */
  lettersOnly(message?: string): this {
    return this._restrictTo('letters', message ?? 'Only letters are allowed.');
  }

  /**
   * Restricts the OTP value to alphanumeric characters (`A-Z`, `a-z`,
   * `0-9`). Common for invitation codes and email verification codes that
   * mix letters and numbers.
   */
  alphanumeric(message?: string): this {
    return this._restrictTo(
      'alphanumeric',
      message ?? 'Only letters and digits are allowed.',
    );
  }

  /**
   * Masks each cell with a display character (default `•`). The real value
   * stays in form state - only the rendered character is replaced.
   */
  mask(char: string = '•'): this {
    this._desc._otpMaskChar = char.slice(0, 1) || '•';
    return this;
  }

  /**
   * Splits the OTP into groups separated by a non-editable character, e.g.
   * `.groups([3, 2], '-')` renders `___-__`. Sets the total code length to
   * the sum of the group sizes and keeps the stored value as a flat string.
   */
  groups(sizes: number[], separator: string = '-'): this {
    const cleaned = sizes.filter((size) => Number.isInteger(size) && size > 0);

    if (cleaned.length === 0) {
      return this;
    }

    const total = cleaned.reduce((sum, size) => sum + size, 0);

    this._desc._otpGroups = cleaned;
    this._desc._otpSeparator = separator;
    this._desc._otpLength = total;
    this._desc._min = total;
    this._desc._max = total;

    return this;
  }

  private _restrictTo(charset: OtpCharset, message: string): this {
    this._desc._otpCharset = charset;
    const { full } = getOtpCharsetPattern(charset);
    this._desc._validators.push((value: string) => (full.test(value) ? null : message));
    return this;
  }
}
