import { StringFieldBuilder } from '../string/StringFieldBuilder';
import {
  type MaskPatternInput,
  maskCompleteValidator,
  resolveMaskPattern,
} from './masks';
import type { MaskedDescriptor, MaskedFieldMeta, MaskTokenMap } from './types';

export class MaskedFieldBuilder extends StringFieldBuilder<'text'> {
  private readonly _meta: MaskedFieldMeta;

  constructor(patternInput: MaskPatternInput) {
    super('text');

    const resolvedMask = resolveMaskPattern(patternInput);

    this._meta = {
      _maskPattern: resolvedMask.pattern,
      _maskTokens: resolvedMask.tokens,
      _maskUppercase: false,
      _maskLowercase: false,
      _maskStoreRaw: false,
      _maskShowPlaceholder: false,
      _maskShowInPlaceholder: false,
      _maskPlaceholder: '_',
      _maskValidateComplete: false,
      _maskCompleteMsg: 'Please complete this field.',
    };
  }

  storeRaw(): this {
    this._meta._maskStoreRaw = true;
    return this;
  }

  storeMasked(): this {
    this._meta._maskStoreRaw = false;
    return this;
  }

  showPlaceholder(char = '_'): this {
    this._meta._maskShowPlaceholder = true;
    this._meta._maskPlaceholder = char;
    return this;
  }

  showMaskInPlaceholder(charOrText = '_'): this {
    this._meta._maskShowInPlaceholder = true;
    if (charOrText.length > 1) {
      this._meta._maskPlaceholderText = charOrText;
    } else {
      this._meta._maskPlaceholder = charOrText;
    }
    return this;
  }

  tokens(tokens: MaskTokenMap): this {
    this._meta._maskTokens = {
      ...this._meta._maskTokens,
      ...tokens,
    };
    return this;
  }

  validateComplete(message = 'Please complete this field.'): this {
    this._meta._maskValidateComplete = true;
    this._meta._maskCompleteMsg = message;
    this._desc._validators.push((value: string) =>
      maskCompleteValidator(
        this._meta._maskPattern,
        message,
        this._meta._maskTokens,
      )(value),
    );
    return this;
  }

  /**
   * @internal
   */
  override _build() {
    return {
      ...super._build(),
      ...this._meta,
    };
  }
}

export function isMaskedDescriptor(d: unknown): d is MaskedDescriptor<string> {
  return (
    typeof d === 'object' &&
    d !== null &&
    '_maskPattern' in d &&
    typeof (d as Record<string, unknown>)._maskPattern === 'string'
  );
}
