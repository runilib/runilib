import type { FieldValue, FieldRules, FormValues } from '../types';

function msg(val: string | { value: unknown; message: string }, fallback: string): string {
  return typeof val === 'object' ? val.message : fallback;
}
function num(val: number | { value: number; message: string }): number {
  return typeof val === 'object' ? val.value : val;
}

/**
 * Runs all built-in rules against a value.
 * Returns the first error message found, or null if valid.
 */
export async function runRules(
  value: FieldValue,
  rules: FieldRules,
  allValues: FormValues,
): Promise<string | null> {
  if (!rules) return null;

  // ── required ──────────────────────────────────────────────────────
  if (rules.required) {
    const empty =
      value === null ||
      value === undefined ||
      value === '' ||
      (typeof value === 'string' && value.trim() === '');
    if (empty) {
      return typeof rules.required === 'string'
        ? rules.required
        : 'This field is required.';
    }
  }

  // ── min (number value) ────────────────────────────────────────────
  if (rules.min !== undefined && typeof value === 'number') {
    const limit = num(rules.min);
    if (value < limit) {
      return msg(rules.min, `Value must be at least ${limit}.`);
    }
  }

  // ── max (number value) ────────────────────────────────────────────
  if (rules.max !== undefined && typeof value === 'number') {
    const limit = num(rules.max);
    if (value > limit) {
      return msg(rules.max, `Value must be at most ${limit}.`);
    }
  }

  // ── minLength ─────────────────────────────────────────────────────
  if (rules.minLength !== undefined && typeof value === 'string') {
    const limit = num(rules.minLength);
    if (value.length < limit) {
      return msg(rules.minLength, `Must be at least ${limit} characters.`);
    }
  }

  // ── maxLength ─────────────────────────────────────────────────────
  if (rules.maxLength !== undefined && typeof value === 'string') {
    const limit = num(rules.maxLength);
    if (value.length > limit) {
      return msg(rules.maxLength, `Must be at most ${limit} characters.`);
    }
  }

  // ── pattern ───────────────────────────────────────────────────────
  if (rules.pattern !== undefined && typeof value === 'string') {
    const regex = rules.pattern instanceof RegExp ? rules.pattern : rules.pattern.value;
    if (!regex.test(value)) {
      return rules.pattern instanceof RegExp
        ? 'Invalid format.'
        : rules.pattern.message;
    }
  }

  // ── validate (custom) ────────────────────────────────────────────
  if (rules.validate) {
    if (typeof rules.validate === 'function') {
      const result = await rules.validate(value, allValues);
      if (result) return result;
    } else {
      // Multiple named validators
      for (const fn of Object.values(rules.validate)) {
        const result = await fn(value, allValues);
        if (result) return result;
      }
    }
  }

  return null;
}
