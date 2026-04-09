import type { FieldType } from '../../../types/field';
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

  /** Lowercase the value before storing */
  lowercase(): this {
    return this.transform((value) => value.toLowerCase());
  }

  /** Uppercase the value before storing */
  uppercase(): this {
    return this.transform((value) => value.toUpperCase());
  }

  /** Must match the value of another field (e.g. confirm password) */
  matches(fieldName: string, message?: string): this {
    this._desc._matchField = fieldName;
    this._desc._validators.push((value: string, allValues: Record<string, unknown>) =>
      value === allValues[fieldName] ? null : (message ?? 'Values do not match.'),
    );
    return this;
  }

  /** Alias for matches() with more explicit semantics */
  sameAs(fieldName: string, message?: string): this {
    return this.matches(fieldName, message);
  }
}
