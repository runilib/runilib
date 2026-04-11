import type { SelectOption, Validator } from '../../types/field';

// ─── Internal helpers ────────────────────────────────────────────────────────

export function isEmptyValue(value: unknown): boolean {
  return value === null || value === undefined || value === '';
}

export function parseDateValue(value: unknown): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

const OPTIONS_VALIDATOR_TAG = Symbol('options-validator');

type TaggedValidator<V> = Validator<V> & {
  [OPTIONS_VALIDATOR_TAG]?: true;
};

export function tagOptionsValidator<V>(validator: Validator<V>): TaggedValidator<V> {
  const tagged = validator as TaggedValidator<V>;
  tagged[OPTIONS_VALIDATOR_TAG] = true;
  return tagged;
}

export function isOptionsValidator<V>(
  validator: Validator<V>,
): validator is TaggedValidator<V> {
  return Boolean((validator as TaggedValidator<V>)[OPTIONS_VALIDATOR_TAG]);
}

export function normalizeSelectValue(
  value: SelectOption | SelectOption['value'] | '' | null | undefined,
): SelectOption['value'] | '' {
  if (value === '' || value == null) {
    return '';
  }

  return typeof value === 'object' ? value.value : value;
}
