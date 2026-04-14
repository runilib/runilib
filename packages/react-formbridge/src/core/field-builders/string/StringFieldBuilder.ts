import type { FieldType } from '../../../types/field';
import type { FieldReference } from '../../../types/validation';
import { resolveReferenceValue } from '../../validators/reference';
import { BaseFieldBuilder } from '../base/BaseFieldBuilder';

// ─── String field builder ────────────────────────────────────────────────────
export class StringFieldBuilder<
  TType extends FieldType = FieldType,
> extends BaseFieldBuilder<string, TType> {
  constructor(type: TType) {
    super(type, '');
  }

  /** Minimum string length */
  min(length: number, message?: string): this {
    this._desc._min = length;
    this._desc._minMsg = message ?? `Must be at least ${length} characters.`;
    return this;
  }

  /** Maximum string length */
  max(length: number, message?: string): this {
    this._desc._max = length;
    this._desc._maxMsg = message ?? `Must be at most ${length} characters.`;
    return this;
  }

  /** Regex pattern or accepted regex alternatives */
  pattern(regex: RegExp | RegExp[], message?: string): this {
    const patterns = Array.isArray(regex) ? regex : [regex];

    this._desc._patterns = [...(this._desc._patterns ?? []), ...patterns];
    this._desc._patternsMsg = message ?? this._desc._patternsMsg ?? 'Invalid format.';
    return this;
  }

  /** Alias for pattern() when passing multiple accepted regex alternatives */
  patterns(regexes: RegExp[], message?: string): this {
    return this.pattern(regexes, message);
  }

  /** Internal base format pattern used by built-in field presets like email/url/tel */
  format(regex: RegExp, message?: string): this {
    this._desc._pattern = regex;
    this._desc._patternMsg = message ?? 'Invalid format.';
    return this;
  }

  /** Trim value before validation / submit */
  trim(): this {
    this._desc._trim = true;
    return this;
  }

  /** Lowercase the value on every keystroke */
  lowercase(): this {
    this._desc._transform = (value) => value.toLowerCase();
    return this;
  }

  /** Uppercase the value on every keystroke */
  uppercase(): this {
    this._desc._transform = (value) => value.toUpperCase();
    return this;
  }

  nonEmpty(message?: string): this {
    return this.validate((value) =>
      typeof value === 'string' && value.trim().length > 0
        ? null
        : (message ?? 'This field cannot be empty.'),
    );
  }

  length(exact: number, message?: string): this {
    return this.validate((value) =>
      typeof value === 'string' && value.length === exact
        ? null
        : (message ?? `Must be exactly ${exact} characters.`),
    );
  }

  between(min: number, max: number, message?: string): this {
    return this.validate((value) => {
      if (typeof value !== 'string') {
        return message ?? `Must contain between ${min} and ${max} characters.`;
      }

      return value.length >= min && value.length <= max
        ? null
        : (message ?? `Must contain between ${min} and ${max} characters.`);
    });
  }

  oneOf(values: string[], message?: string): this {
    const allowedValues = new Set(values);

    return this.validate((value) =>
      allowedValues.has(value)
        ? null
        : (message ?? `Value must be one of: ${values.join(', ')}.`),
    );
  }

  notOneOf(values: string[], message?: string): this {
    const blockedValues = new Set(values);

    return this.validate((value) =>
      blockedValues.has(value)
        ? (message ?? `Value must not be one of: ${values.join(', ')}.`)
        : null,
    );
  }

  /** Must match the value of another field (e.g. confirm password) */
  matches(fieldName: string | FieldReference, message?: string): this {
    this._desc._matchField = typeof fieldName === 'string' ? fieldName : fieldName.path;
    this._desc._validators.push((value: string, allValues: Record<string, unknown>) =>
      value === resolveReferenceValue(fieldName, allValues)
        ? null
        : (message ?? 'Values do not match.'),
    );
    return this;
  }

  /** Alias for matches() with more explicit semantics */
  sameAs(fieldName: string | FieldReference, message?: string): this {
    return this.matches(fieldName, message);
  }
}
