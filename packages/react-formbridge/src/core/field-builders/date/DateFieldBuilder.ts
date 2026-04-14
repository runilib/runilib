import type { FieldReference } from '../../../types/validation';
import { resolveReferenceValue } from '../../validators/reference';
import { isEmptyValue, parseDateValue } from '../common-utils';
import { StringFieldBuilder } from '../string/StringFieldBuilder';

function computeAge(date: Date, now = new Date()): number {
  let age = now.getFullYear() - date.getFullYear();
  const hasHadBirthdayThisYear =
    now.getMonth() > date.getMonth() ||
    (now.getMonth() === date.getMonth() && now.getDate() >= date.getDate());

  if (!hasHadBirthdayThisYear) {
    age -= 1;
  }

  return age;
}

function resolveDateLike(
  value: Date | string | number | FieldReference,
  allValues: Record<string, unknown>,
): Date | null {
  const source =
    value instanceof Date
      ? value
      : typeof value === 'string' || typeof value === 'number'
        ? value
        : resolveReferenceValue(value, allValues);

  if (typeof source === 'number') {
    return parseDateValue(new Date(source));
  }

  return parseDateValue(source);
}

// ─── Date field builder ──────────────────────────────────────────────────────
export class DateFieldBuilder extends StringFieldBuilder<'date'> {
  constructor() {
    super('date');
  }

  before(date: Date | string | FieldReference, message?: string): this {
    return this.validate((value, allValues) => {
      if (isEmptyValue(value)) {
        return null;
      }

      const currentDate = parseDateValue(value);
      const targetDate = resolveDateLike(date, allValues);

      if (!currentDate || !targetDate) {
        return message ?? 'Invalid date.';
      }

      return currentDate < targetDate
        ? null
        : (message ?? `Date must be before ${targetDate.toLocaleDateString()}.`);
    });
  }

  after(date: Date | string | FieldReference, message?: string): this {
    return this.validate((value, allValues) => {
      if (isEmptyValue(value)) {
        return null;
      }

      const currentDate = parseDateValue(value);
      const targetDate = resolveDateLike(date, allValues);

      if (!currentDate || !targetDate) {
        return message ?? 'Invalid date.';
      }

      return currentDate > targetDate
        ? null
        : (message ?? `Date must be after ${targetDate.toLocaleDateString()}.`);
    });
  }

  between(
    start: Date | string | number,
    end: Date | string | number,
    message?: string,
  ): this {
    return this.validate((value) => {
      if (isEmptyValue(value)) {
        return null;
      }

      const currentDate = parseDateValue(value);
      const startDate = resolveDateLike(start, {});
      const endDate = resolveDateLike(end, {});

      if (!currentDate || !startDate || !endDate) {
        return message ?? 'Invalid date.';
      }

      return currentDate >= startDate && currentDate <= endDate
        ? null
        : (message ??
            `Date must be between ${startDate.toLocaleDateString()} and ${endDate.toLocaleDateString()}.`);
    });
  }

  past(message?: string): this {
    return this.validate((value) => {
      if (isEmptyValue(value)) {
        return null;
      }

      const currentDate = parseDateValue(value);

      if (!currentDate) {
        return message ?? 'Invalid date.';
      }

      return currentDate < new Date() ? null : (message ?? 'Date must be in the past.');
    });
  }

  future(message?: string): this {
    return this.validate((value) => {
      if (isEmptyValue(value)) {
        return null;
      }

      const currentDate = parseDateValue(value);

      if (!currentDate) {
        return message ?? 'Invalid date.';
      }

      return currentDate > new Date() ? null : (message ?? 'Date must be in the future.');
    });
  }

  minAge(age: number, message?: string): this {
    return this.validate((value) => {
      if (isEmptyValue(value)) {
        return null;
      }

      const currentDate = parseDateValue(value);

      if (!currentDate) {
        return message ?? 'Invalid date.';
      }

      return computeAge(currentDate) >= age
        ? null
        : (message ?? `Must be at least ${age} years old.`);
    });
  }

  maxAge(age: number, message?: string): this {
    return this.validate((value) => {
      if (isEmptyValue(value)) {
        return null;
      }

      const currentDate = parseDateValue(value);

      if (!currentDate) {
        return message ?? 'Invalid date.';
      }

      return computeAge(currentDate) <= age
        ? null
        : (message ?? `Must be at most ${age} years old.`);
    });
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
