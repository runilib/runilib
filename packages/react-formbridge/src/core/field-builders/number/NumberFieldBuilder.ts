import { BaseFieldBuilder } from '../base/BaseFieldBuilder';

// ─── Number field builder ────────────────────────────────────────────────────
export class NumberFieldBuilder extends BaseFieldBuilder<number, 'number'> {
  constructor(label: string) {
    super('number', label, 0);
  }

  min(value: number, message?: string): this {
    this._desc._min = value;
    this._desc._minMsg = message ?? `Must be at least ${value}.`;
    return this;
  }

  max(value: number, message?: string): this {
    this._desc._max = value;
    this._desc._maxMsg = message ?? `Must be at most ${value}.`;
    return this;
  }

  positive(message?: string): this {
    return this.validate((value) =>
      value > 0 ? null : (message ?? 'Must be a positive number.'),
    );
  }

  nonNegative(message?: string): this {
    return this.validate((value) =>
      value >= 0 ? null : (message ?? 'Must be zero or greater.'),
    );
  }

  integer(message?: string): this {
    return this.validate((value) =>
      Number.isInteger(value) ? null : (message ?? 'Must be a whole number.'),
    );
  }

  step(stepValue: number, message?: string): this {
    return this.validate((value) => {
      if (stepValue <= 0) {
        return 'Step must be greater than 0.';
      }

      const quotient = value / stepValue;
      return Number.isInteger(quotient)
        ? null
        : (message ?? `Must match a step of ${stepValue}.`);
    });
  }
}
