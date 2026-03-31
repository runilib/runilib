import { BaseFieldBuilder } from '../base/BaseFieldBuilder';

// ─── OTP field builder ───────────────────────────────────────────────────────
export class OtpFieldBuilder extends BaseFieldBuilder<string> {
  constructor(label: string) {
    super('otp', label, '');
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
}
