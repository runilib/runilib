import type { FieldType } from '../../../types';
import { BaseFieldBuilder } from '../base/BaseFieldBuilder';

// ─── Boolean field builder ───────────────────────────────────────────────────

export class BooleanFieldBuilder extends BaseFieldBuilder<boolean> {
  constructor(type: FieldType, label: string) {
    super(type, label, false);
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
