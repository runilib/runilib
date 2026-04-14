import type { FieldReference } from '../../../types/validation';
import { resolveReferenceValue } from '../../validators/reference';
import { BaseFieldBuilder } from '../base/BaseFieldBuilder';

// ─── Number field builder ────────────────────────────────────────────────────
export class NumberFieldBuilder extends BaseFieldBuilder<number, 'number'> {
  constructor() {
    super('number', 0);
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

  gt(value: number, message?: string): this {
    return this.validate((currentValue) =>
      currentValue > value ? null : (message ?? `Must be greater than ${value}.`),
    );
  }

  gte(value: number, message?: string): this {
    return this.validate((currentValue) =>
      currentValue >= value
        ? null
        : (message ?? `Must be greater than or equal to ${value}.`),
    );
  }

  lt(value: number, message?: string): this {
    return this.validate((currentValue) =>
      currentValue < value ? null : (message ?? `Must be lower than ${value}.`),
    );
  }

  lte(value: number, message?: string): this {
    return this.validate((currentValue) =>
      currentValue <= value
        ? null
        : (message ?? `Must be lower than or equal to ${value}.`),
    );
  }

  between(min: number, max: number, message?: string): this {
    return this.validate((value) =>
      value >= min && value <= max
        ? null
        : (message ?? `Must be between ${min} and ${max}.`),
    );
  }

  multipleOf(value: number, message?: string): this {
    return this.validate((currentValue) => {
      if (value <= 0) {
        return 'multipleOf() expects a value greater than 0.';
      }

      const quotient = currentValue / value;
      return Number.isInteger(quotient)
        ? null
        : (message ?? `Must be a multiple of ${value}.`);
    });
  }

  greaterThan(value: number | string | FieldReference, message?: string): this {
    return this.validate((currentValue, allValues) => {
      const targetValue =
        typeof value === 'number' ? value : resolveReferenceValue(value, allValues);

      if (typeof targetValue !== 'number') {
        return null;
      }

      return currentValue > targetValue
        ? null
        : (message ?? `Must be greater than ${targetValue}.`);
    });
  }

  lowerThan(value: number | string | FieldReference, message?: string): this {
    return this.validate((currentValue, allValues) => {
      const targetValue =
        typeof value === 'number' ? value : resolveReferenceValue(value, allValues);

      if (typeof targetValue !== 'number') {
        return null;
      }

      return currentValue < targetValue
        ? null
        : (message ?? `Must be lower than ${targetValue}.`);
    });
  }

  step(stepValue: number, message?: string): this {
    return this.multipleOf(stepValue, message ?? `Must match a step of ${stepValue}.`);
  }
}
