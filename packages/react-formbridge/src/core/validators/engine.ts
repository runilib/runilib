import type { FieldDescriptor } from '../../types';

function matchesPattern(pattern: RegExp, value: string): boolean {
  return new RegExp(pattern.source, pattern.flags).test(value);
}

/**
 * Runs all validation rules for a field descriptor against a value.
 * Returns the first error message found, or null if valid.
 */
export async function validateField(
  descriptor: FieldDescriptor<unknown>,
  value: unknown,
  allValues: Record<string, unknown>,
): Promise<string | null> {
  const d = descriptor;

  // Apply transform before validation
  let v = value;
  if (d._trim && typeof v === 'string') v = v.trim();
  if (d._transform) v = (d._transform as (x: unknown) => unknown)(v);

  // ── required ──────────────────────────────────────────────────────────────
  if (d._required) {
    const empty =
      v === null ||
      v === undefined ||
      (typeof v === 'string' && v.trim() === '') ||
      (typeof v === 'boolean' && v === false && d._required);

    if (empty) return d._requiredMsg;
  }

  // If not required and empty, skip further validation
  if (v === null || v === undefined || v === '') return null;

  // ── min ───────────────────────────────────────────────────────────────────
  if (d._min !== undefined) {
    if (typeof v === 'string' && v.length < d._min)
      return d._minMsg ?? `Min ${d._min} characters.`;
    if (typeof v === 'number' && v < d._min)
      return d._minMsg ?? `Min value is ${d._min}.`;
  }

  // ── max ───────────────────────────────────────────────────────────────────
  if (d._max !== undefined) {
    if (typeof v === 'string' && v.length > d._max) {
      return d._maxMsg ?? `Max ${d._max} characters.`;
    }
    if (typeof v === 'number' && v > d._max) {
      return d._maxMsg ?? `Max value is ${d._max}.`;
    }
  }

  // ── pattern ───────────────────────────────────────────────────────────────
  if (d._pattern && typeof v === 'string') {
    if (!matchesPattern(d._pattern, v)) {
      return d._patternMsg ?? 'Invalid format.';
    }
  }

  // ── accepted pattern alternatives ─────────────────────────────────────────
  if (d._patterns?.length && typeof v === 'string') {
    const matched = d._patterns.some((pattern) => matchesPattern(pattern, v));

    if (!matched) {
      return d._patternsMsg ?? 'Invalid format.';
    }
  }

  // ── custom validators ─────────────────────────────────────────────────────
  for (const validator of d._validators) {
    const result = await validator(v, allValues);
    if (result) return result;
  }

  return null;
}

/**
 * Validates all fields in a schema and returns a map of errors.
 */
export async function validateAll(
  descriptors: Record<string, FieldDescriptor<unknown>>,
  values: Record<string, unknown>,
): Promise<Record<string, string>> {
  const errors: Record<string, string> = {};

  await Promise.all(
    Object.entries(descriptors).map(async ([name, descriptor]) => {
      const err = await validateField(descriptor, values[name], values);
      if (err) errors[name] = err;
    }),
  );

  return errors;
}

/** Extract default values from a schema of descriptors */
export function extractDefaults(
  descriptors: Record<string, FieldDescriptor<unknown>>,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(descriptors).map(([k, d]) => [k, d._defaultValue]),
  );
}
