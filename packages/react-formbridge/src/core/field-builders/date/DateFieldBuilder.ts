import { StringFieldBuilder } from '../string/StringFieldBuilder';

// ─── Internal helpers ────────────────────────────────────────────────────────

function isEmptyValue(value: unknown): boolean {
  return value === null || value === undefined || value === '';
}

function parseDateValue(value: unknown): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

// ─── Date field builder ──────────────────────────────────────────────────────
export class DateFieldBuilder extends StringFieldBuilder {
  constructor(label: string) {
    super('date', label);
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
