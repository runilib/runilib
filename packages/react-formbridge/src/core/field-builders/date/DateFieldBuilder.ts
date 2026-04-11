import { isEmptyValue, parseDateValue } from '../common-utils';
import { StringFieldBuilder } from '../string/StringFieldBuilder';

// ─── Date field builder ──────────────────────────────────────────────────────
export class DateFieldBuilder extends StringFieldBuilder<'date'> {
  constructor() {
    super('date');
  }

  minDate(min: Date | string, message?: string): this {
    return this.validate((value) => {
      if (isEmptyValue(value)) {
        return null;
      }

      const currentDate = parseDateValue(value);
      const minDateValue = parseDateValue(min);

      if (!currentDate || !minDateValue) {
        return message ?? 'Invalid date.';
      }

      return currentDate >= minDateValue
        ? null
        : (message ?? `Date must be on or after ${minDateValue.toLocaleDateString()}.`);
    });
  }

  maxDate(max: Date | string, message?: string): this {
    return this.validate((value) => {
      if (isEmptyValue(value)) {
        return null;
      }

      const currentDate = parseDateValue(value);
      const maxDateValue = parseDateValue(max);

      if (!currentDate || !maxDateValue) {
        return message ?? 'Invalid date.';
      }

      return currentDate <= maxDateValue
        ? null
        : (message ?? `Date must be on or before ${maxDateValue.toLocaleDateString()}.`);
    });
  }
}
