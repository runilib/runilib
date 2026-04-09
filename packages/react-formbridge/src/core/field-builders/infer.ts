import type { FieldDescriptor, FieldType, SelectOption } from '../../types/field';
import { field } from './field';
import type { AnyFieldBuilder, InferFieldOptions, InferOverrides } from './types';

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
      // Capitalize every word
      .replace(/\b\w/g, (s) => s.toUpperCase())
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

type InferBuilderOps = {
  placeholder: (value?: string) => unknown;
  hint: (value: string) => unknown;
  required: (message?: string) => unknown;
  min?: (value: number, message?: string) => unknown;
  max?: (value: number, message?: string) => unknown;
  disabled: (value?: boolean) => unknown;
  hidden: (value?: boolean) => unknown;
  validate: (fn: NonNullable<InferFieldOptions<unknown>['validate']>) => unknown;
  options?: (value: SelectOption[] | string[]) => unknown;
  _build: () => FieldDescriptor<unknown>;
};

function buildFieldFromEntry(
  key: string,
  value: unknown,
  override: InferFieldOptions<unknown> = {},
): FieldDescriptor<unknown> {
  const label = override.label ?? prettifyKey(key);
  const type = override.type ?? detectType(key, value);

  // Use the right builder
  let builder: AnyFieldBuilder;

  switch (type) {
    case 'email':
      builder = field.email().label(label);
      break;
    case 'password':
      builder = field.password().label(label);
      break;
    case 'number':
      builder = field.number().label(label);
      break;
    case 'checkbox':
      builder = field.checkbox().label(label);
      break;
    case 'switch':
      builder = field.switch().label(label);
      break;
    case 'select':
      builder = field.select().label(label);
      break;
    case 'radio':
      builder = field.radio().label(label);
      break;
    case 'textarea':
      builder = field.textarea().label(label);
      break;
    case 'tel':
      builder = field.tel().label(label);
      break;
    case 'url':
      builder = field.url().label(label);
      break;
    case 'date':
      builder = field.date().label(label);
      break;
    case 'phone':
      builder = field.phone().label(label);
      break;
    default:
      builder = field.text().label(label);
  }

  // Apply overrides
  const inferredBuilder = builder as InferBuilderOps;

  if (override.required) {
    inferredBuilder.required(
      typeof override.required === 'string' ? override.required : undefined,
    );
  }
  if (override.min !== undefined) inferredBuilder.min?.(override.min);
  if (override.max !== undefined) inferredBuilder.max?.(override.max);
  if (override.placeholder) inferredBuilder.placeholder(override.placeholder);
  if (override.hint) inferredBuilder.hint(override.hint);
  if (override.disabled) inferredBuilder.disabled(true);
  if (override.hidden) inferredBuilder.hidden(true);
  if (override.validate) inferredBuilder.validate(override.validate);
  if (override.options) inferredBuilder.options?.(override.options);

  // Set default value from the object
  const desc = inferredBuilder._build();
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
