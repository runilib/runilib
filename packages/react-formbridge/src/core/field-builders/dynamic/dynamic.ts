import type { FieldDescriptor, FieldType, SelectOption } from '../../../types';
import { field } from '../field';
import type { AnyFieldBuilder } from '../types';
import type { JsonFieldDescriptor, JsonFormDefinition, JsonSchemaDraft7 } from './types';

// ─── Convert a single JSON descriptor to a FieldDescriptor ───────────────────

type DynamicBuilderOps = {
  placeholder: (value?: string) => unknown;
  hint: (value: string) => unknown;
  disabled: (value?: boolean) => unknown;
  hidden: (value?: boolean) => unknown;
  required: (message?: string) => unknown;
  min?: (value: number, message?: string) => unknown;
  max?: (value: number, message?: string) => unknown;
  pattern?: (regex: RegExp, message?: string) => unknown;
  options?: (value: SelectOption[] | string[]) => unknown;
  length?: (value: number, message?: string) => unknown;
  _build: () => FieldDescriptor<unknown>;
};

function jsonToFieldDescriptor(json: JsonFieldDescriptor): FieldDescriptor<unknown> {
  const label = json.label;
  let builder: AnyFieldBuilder;

  const type = json.type === 'hidden' ? 'text' : json.type;

  switch (type as FieldType) {
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
    case 'otp':
      builder = field.otp(label);
      break;
    case 'radio':
      builder = field.radio(label);
      break;
    case 'select':
      builder = field.select(label);
      break;
    default:
      builder = field.text(label);
  }

  const b = builder as DynamicBuilderOps;

  // Apply common properties
  if (json.placeholder) b.placeholder(json.placeholder);
  if (json.hint) b.hint(json.hint);
  if (json.disabled) b.disabled(true);
  if (json.type === 'hidden') b.hidden(true);

  // Required
  if (json.required) {
    b.required(typeof json.required === 'string' ? json.required : undefined);
  }

  // Min / max
  if (json.min !== undefined) b.min?.(json.min);
  if (json.max !== undefined) b.max?.(json.max);

  // Pattern
  if (json.pattern) {
    b.pattern?.(new RegExp(json.pattern), json.patternMsg);
  }

  // Options
  if (json.options) {
    const opts: SelectOption[] = json.options.map((o) =>
      typeof o === 'string' ? { label: o, value: o } : o,
    );
    b.options?.(opts);
  }

  // OTP length
  if (json.otpLength) b.length?.(json.otpLength);

  // JSON validation rules
  if (json.validate) {
    for (const rule of json.validate) {
      switch (rule.type) {
        case 'required':
          b.required(rule.message);
          break;
        case 'min':
          b.min?.(rule.value as number, rule.message);
          break;
        case 'max':
          b.max?.(rule.value as number, rule.message);
          break;
        case 'pattern':
          b.pattern?.(new RegExp(rule.value as string), rule.message);
          break;
        case 'email':
          b.pattern?.(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, rule.message);
          break;
        case 'url':
          b.pattern?.(/^https?:\/\/.+/, rule.message);
          break;
      }
    }
  }

  const desc = b._build() as FieldDescriptor<unknown>;

  // Set default value
  if (json.defaultValue !== undefined) {
    desc._defaultValue = json.defaultValue;
  }

  return desc;
}

// ─── parseDynamicForm ────────────────────────────────────────────────────────

/**
 * Convert a JSON form definition (from an API or config file) into a
 * react-formbridge schema ready to pass to `useForm()`.
 *
 * @example
 * // From an API response
 * const response = await api.getFormSchema('signup');
 * const { schema, meta } = parseDynamicForm(response);
 * const { Form, fields } = useForm(schema);
 *
 * @example
 * // Inline JSON definition
 * const { schema } = parseDynamicForm({
 *   id: 'contact',
 *   title: 'Contact us',
 *   fields: [
 *     { name: 'name',    type: 'text',  label: 'Your name',    required: true },
 *     { name: 'email',   type: 'email', label: 'Email',        required: true },
 *     { name: 'message', type: 'textarea', label: 'Message',   required: true, min: 10 },
 *     { name: 'topic',   type: 'select',  label: 'Topic',
 *       options: ['Support','Sales','Partnership'],
 *       required: true },
 *   ],
 *   submitLabel: 'Send message',
 * });
 */
export function parseDynamicForm(definition: JsonFormDefinition): {
  schema: Record<string, FieldDescriptor<unknown>>;
  meta: { id?: string; title?: string; submitLabel?: string };
  /** Ordered list of field names for rendering */
  fieldOrder: string[];
  /** showWhen conditions keyed by field name */
  conditions: Record<string, JsonFieldDescriptor['showWhen']>;
} {
  const sortedFields = [...definition.fields].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );
  const schema: Record<string, FieldDescriptor<unknown>> = {};
  const conditions: Record<string, JsonFieldDescriptor['showWhen']> = {};
  const fieldOrder: string[] = [];

  for (const jsonField of sortedFields) {
    schema[jsonField.name] = jsonToFieldDescriptor(jsonField);
    fieldOrder.push(jsonField.name);
    if (jsonField.showWhen) {
      conditions[jsonField.name] = jsonField.showWhen;
    }
  }

  return {
    schema,
    meta: {
      id: definition.id,
      title: definition.title,
      submitLabel: definition.submitLabel,
    },
    fieldOrder,
    conditions,
  };
}

/**
 * `parseJsonSchema()` — convert a standard JSON Schema (draft-07) into a react-formbridge schema.
 *
 * @example
 * const jsonSchema = {
 *   title: 'User',
 *   required: ['name', 'email'],
 *   properties: {
 *     name:  { type: 'string', title: 'Full name', minLength: 2 },
 *     email: { type: 'string', format: 'email', title: 'Email' },
 *     age:   { type: 'number', title: 'Age', minimum: 18 },
 *   },
 * };
 *
 * const schema = parseJsonSchema(jsonSchema);
 * const { Form, fields } = useForm(schema);
 */
export function parseJsonSchema(
  jsonSchema: JsonSchemaDraft7,
): Record<string, FieldDescriptor<unknown>> {
  const schema: Record<string, FieldDescriptor<unknown>> = {};
  const required = new Set(jsonSchema.required ?? []);

  for (const [name, prop] of Object.entries(jsonSchema.properties)) {
    const label = prop.title ?? name;
    const types = Array.isArray(prop.type) ? prop.type : [prop.type ?? 'string'];
    const pType = types.find((t) => t !== 'null') ?? 'string';

    // Map JSON Schema type + format to react-formbridge field type
    let fieldType: FieldType = 'text';
    if (pType === 'number' || pType === 'integer') fieldType = 'number';
    else if (pType === 'boolean') fieldType = 'switch';
    else if (prop.format === 'email') fieldType = 'email';
    else if (prop.format === 'uri') fieldType = 'url';
    else if (prop.format === 'date') fieldType = 'date';
    else if (prop.format === 'phone') fieldType = 'tel';
    else if (prop.enum) fieldType = 'select';

    const jsonField: JsonFieldDescriptor = {
      name,
      type: fieldType,
      label,
      hint: prop.description,
      required: required.has(name),
      min: prop.minimum ?? prop.minLength,
      max: prop.maximum ?? prop.maxLength,
      pattern: prop.pattern,
      defaultValue: prop.default,
      options: prop.enum?.map((v) => ({
        label: String(v),
        value: v as string | number,
      })),
    };

    schema[name] = jsonToFieldDescriptor(jsonField);
  }

  return schema;
}
