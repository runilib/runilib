import { BaseFieldBuilder } from '../base/BaseFieldBuilder';

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

  digitsOnly(message?: string): this {
    this._desc._validators.push((value: string) =>
      /^\d*$/.test(value) ? null : (message ?? 'Only digits are allowed.'),
    );

    return this;
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
}
