import type { FieldType } from '../../../types/field';
import { BaseFieldBuilder } from '../base/BaseFieldBuilder';

// ─── Boolean field builder ───────────────────────────────────────────────────

export class BooleanFieldBuilder<
  TType extends Extract<FieldType, 'checkbox' | 'switch'> = Extract<
    FieldType,
    'checkbox' | 'switch'
  >,
> extends BaseFieldBuilder<boolean, TType> {
  constructor(type: TType) {
    super(type, false);
  }

  /** Must be checked / true to pass */
  mustBeTrue(message?: string): this {
    this._desc._required = true;
    this._desc._requiredMsg = message ?? 'You must accept this.';
    this._desc._validators.push((value: boolean) =>
      value ? null : (message ?? 'You must accept this.'),
    );
    return this;
  }
}
