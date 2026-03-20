import type { FieldDescriptor } from '../../types';
import { MASKS, applyMask, maskCompleteValidator } from './masks';
import type { MaskPreset } from './masks';

// ─── Extended FieldDescriptor for masked fields ───────────────────────────────

export interface MaskedFieldMeta {
  /** The mask pattern string */
  _maskPattern:       string;
  /** Transform value to uppercase before masking */
  _maskUppercase:     boolean;
  /** Transform value to lowercase before masking */
  _maskLowercase:     boolean;
  /** Store raw value (no separators) or masked display value */
  _maskStoreRaw:      boolean;
  /** Show placeholder characters for empty slots */
  _maskShowPlaceholder: boolean;
  /** Placeholder character */
  _maskPlaceholder:   string;
  /** Auto-validate completeness */
  _maskValidateComplete: boolean;
  /** Complete validation message */
  _maskCompleteMsg:   string;
}

export type MaskedDescriptor<V = string> = FieldDescriptor<V> & MaskedFieldMeta;

// ─── MaskedFieldBuilder ───────────────────────────────────────────────────────

import { field } from '../../builders/field';

/**
 * `field.masked()` — a text field with automatic input masking.
 *
 * Supports built-in presets (phone, card, IBAN, date, etc.)
 * or a custom pattern string.
 *
 * @example
 * field.masked('Card number', MASKS.CARD_16)
 *   .required()
 *   .validateComplete('Please enter a full card number.')
 *
 * field.masked('IBAN', MASKS.IBAN_FR)
 *   .uppercase()
 *   .required()
 *
 * field.masked('Phone', '+33 9 99 99 99 99')
 *   .required()
 */
export class MaskedFieldBuilder {
  private _desc: FieldDescriptor<string>;
  private _meta: MaskedFieldMeta;

  constructor(label: string, pattern: string | MaskPreset) {
    const resolvedPattern = pattern in MASKS
      ? MASKS[pattern as MaskPreset]
      : pattern as string;

    // Reuse base text builder
    const base = field.text(label) as any;
    this._desc = base._build();

    this._meta = {
      _maskPattern:            resolvedPattern,
      _maskUppercase:          false,
      _maskLowercase:          false,
      _maskStoreRaw:           true,   // default: store raw value (no separators)
      _maskShowPlaceholder:    false,
      _maskPlaceholder:        '_',
      _maskValidateComplete:   false,
      _maskCompleteMsg:        'Please complete this field.',
    };
  }

  // ── Field builder delegation ───────────────────────────────────

  required(message?: string): this {
    this._desc._required = true;
    if (message) this._desc._requiredMsg = message;
    return this;
  }

  placeholder(text: string): this {
    this._desc._placeholder = text;
    return this;
  }

  hint(text: string): this {
    this._desc._hint = text;
    return this;
  }

  disabled(value = true): this {
    this._desc._disabled = value;
    return this;
  }

  hidden(value = true): this {
    this._desc._hidden = value;
    return this;
  }

  validate(fn: (v: string, all: Record<string, unknown>) => string | null | Promise<string | null>): this {
    this._desc._validators.push(fn as any);
    return this;
  }

  // ── Mask-specific methods ─────────────────────────────────────

  /** Convert input to uppercase as the user types */
  uppercase(): this {
    this._meta._maskUppercase = true;
    this._meta._maskLowercase = false;
    return this;
  }

  /** Convert input to lowercase as the user types */
  lowercase(): this {
    this._meta._maskLowercase = true;
    this._meta._maskUppercase = false;
    return this;
  }

  /**
   * Store the masked display value (with separators) instead of the raw value.
   * Default: raw value is stored.
   */
  storeMasked(): this {
    this._meta._maskStoreRaw = false;
    return this;
  }

  /**
   * Show placeholder characters for unfilled slots.
   * @param char — placeholder character (default: '_')
   */
  showPlaceholder(char = '_'): this {
    this._meta._maskShowPlaceholder = true;
    this._meta._maskPlaceholder     = char;
    return this;
  }

  /**
   * Auto-validate that the mask is completely filled.
   */
  validateComplete(message = 'Please complete this field.'): this {
    this._meta._maskValidateComplete = true;
    this._meta._maskCompleteMsg      = message;
    this._desc._validators.push(
      (v: string) => maskCompleteValidator(this._meta._maskPattern, message)(v) as any
    );
    return this;
  }

  /** Returns the combined descriptor (called by useForm) */
  _build(): MaskedDescriptor<string> {
    return {
      ...this._desc,
      ...this._meta,
      _type: 'text' as const,
    } as MaskedDescriptor<string>;
  }
}

/** Check if a descriptor has mask metadata */
export function isMaskedDescriptor(d: FieldDescriptor<unknown>): d is MaskedDescriptor<string> {
  return '_maskPattern' in d;
}
