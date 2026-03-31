import type { FieldDescriptor, FieldType } from '../../types';
import type { BaseFieldBuilder } from './base/BaseFieldBuilder';
import { field } from './field';
import type { InferFieldOptions, InferOverrides } from './types';

// ─── Label prettifier ─────────────────────────────────────────────────────────

function prettifyKey(key: string): string {
  return (
    key
      // camelCase → words
      .replace(/([A-Z])/g, ' $1')
      // snake_case → words
      .replace(/_/g, ' ')
      // kebab-case → words
      .replace(/-/g, ' ')
      // Capitalize first letter
      .replace(/^./, (s) => s.toUpperCase())
      .trim()
  );
}

// ─── Auto-detect field type from value ───────────────────────────────────────

function detectType(key: string, value: unknown): FieldType {
  const k = key.toLowerCase();

  // Key-based detection first
  if (k.includes('email')) return 'email';
  if (k.includes('password') || k.includes('pass')) return 'password';
  if (k.includes('phone') || k.includes('tel')) return 'tel';
  if (k.includes('url') || k.includes('website') || k.includes('link')) return 'url';
  if (
    k.includes('bio') ||
    k.includes('description') ||
    k.includes('note') ||
    k.includes('comment')
  )
    return 'textarea';
  if (k.includes('date') || k.includes('birthday') || k.includes('born')) return 'date';
  if (
    k.includes('enabled') ||
    k.includes('active') ||
    k.includes('toggle') ||
    k.includes('visible')
  )
    return 'switch';

  // Value-type-based detection
  if (typeof value === 'boolean') return 'switch';
  if (typeof value === 'number') return 'number';
  if (Array.isArray(value)) return 'select';
  if (/^phone|tel|mobile|cell|fax/i.test(key)) return 'phone';
  return 'text';
}

// ─── Build a single FieldDescriptor from a key + value + override ────────────

function buildFieldFromEntry(
  key: string,
  value: unknown,
  override: InferFieldOptions<unknown> = {},
): FieldDescriptor<unknown> {
  const label = override.label ?? prettifyKey(key);
  const type = override.type ?? detectType(key, value);

  // Use the right builder
  let builder: BaseFieldBuilder<any>;

  switch (type) {
    case 'email':
      builder = field.email(label);
      break;
    case 'password':
      builder = field.password(label);
      break;
    case 'number':
      builder = field.number(label);
      break;
    case 'checkbox':
      builder = field.checkbox(label);
      break;
    case 'switch':
      builder = field.switch(label);
      break;
    case 'select':
      builder = field.select(label);
      break;
    case 'radio':
      builder = field.radio(label);
      break;
    case 'textarea':
      builder = field.textarea(label);
      break;
    case 'tel':
      builder = field.tel(label);
      break;
    case 'url':
      builder = field.url(label);
      break;
    case 'date':
      builder = field.date(label);
      break;
    case 'phone':
      builder = field.phone(label);
      break;
    default:
      builder = field.text(label);
  }

  // Apply overrides
  if (override.required)
    builder.required(
      typeof override.required === 'string' ? override.required : undefined,
    );
  if (override.min !== undefined) (builder as any).min?.(override.min);
  if (override.max !== undefined) (builder as any).max?.(override.max);
  if (override.placeholder) builder.placeholder(override.placeholder);
  if (override.hint) builder.hint(override.hint);
  if (override.disabled) (builder as any).disabled(true);
  if (override.hidden) (builder as any).hidden(true);
  if (override.validate) (builder as any).validate(override.validate);
  if (override.options) (builder as any).options?.(override.options);

  // Set default value from the object
  const desc = (builder as any)._build() as FieldDescriptor<unknown>;
  desc._defaultValue = value ?? desc._defaultValue;

  return desc;
}

// ─── field.infer() ────────────────────────────────────────────────────────────

/**
 * `field.infer()` — generate a formbridge schema from an existing object or TypeScript type.
 *
 * Automatically detects field types from key names and value types.
 * Pass overrides to customise individual fields.
 *
 * @example
 * // From an existing user object (edit form)
 * const schema = field.infer(existingUser, {
 *   email:    { required: true },
 *   password: { hidden: true },
 *   role:     { type: 'select', options: ['admin','user','viewer'] },
 * });
 *
 * const { Form, fields } = useForm(schema);
 *
 * @example
 * // From a plain object with defaults
 * const schema = field.infer({
 *   firstName: '',
 *   email:     '',
 *   age:       0,
 *   active:    true,
 *   role:      '',
 * }, {
 *   firstName: { required: true, min: 2 },
 *   email:     { required: true },
 *   age:       { min: 18 },
 *   role:      { type: 'select', options: ['admin', 'user'] },
 * });
 */
function inferFromObject<T extends Record<string, unknown>>(
  obj: T,
  overrides: InferOverrides<T> = {},
): Record<keyof T, FieldDescriptor<unknown>> {
  const schema: Record<string, FieldDescriptor<unknown>> = {};

  for (const [key, value] of Object.entries(obj)) {
    schema[key] = buildFieldFromEntry(
      key,
      value,
      (overrides as Record<string, InferFieldOptions<unknown>>)[key] ?? {},
    );
  }

  return schema as Record<keyof T, FieldDescriptor<unknown>>;
}

/**
 * `field.inferType<T>()` — generate a schema purely from a TypeScript type (no object needed).
 * You must pass a key map that describes each property.
 *
 * @example
 * type User = { name: string; email: string; age: number; active: boolean };
 *
 * const schema = field.inferType<User>({
 *   name:   { label: 'Full name', required: true },
 *   email:  { label: 'Email',     required: true },
 *   age:    { label: 'Age',       min: 18         },
 *   active: { label: 'Active',   type: 'switch'  },
 * });
 */
function inferFromType<T extends Record<string, unknown>>(
  fields: { [K in keyof T]: InferFieldOptions<T[K]> & { defaultValue?: T[K] } },
): Record<keyof T, FieldDescriptor<unknown>> {
  const schema: Record<string, FieldDescriptor<unknown>> = {};

  for (const [key, opts] of Object.entries(fields) as [
    string,
    InferFieldOptions<unknown> & { defaultValue?: unknown },
  ][]) {
    const defaultValue = opts.defaultValue ?? getDefaultForType(opts.type ?? 'text');
    schema[key] = buildFieldFromEntry(key, defaultValue, opts);
  }

  return schema as Record<keyof T, FieldDescriptor<unknown>>;
}

function getDefaultForType(type: FieldType): unknown {
  if (type === 'number') return 0;
  if (type === 'checkbox' || type === 'switch') return false;
  return '';
}

// ─── Attach to field namespace ────────────────────────────────────────────────

// These are attached in the main field.ts via module augmentation
export { inferFromObject, inferFromType };
