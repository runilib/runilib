// ─── JSON field descriptor (what the server sends) ────────────────────────────
export type JsonFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'textarea'
  | 'checkbox'
  | 'switch'
  | 'select'
  | 'radio'
  | 'date'
  | 'otp'
  | 'hidden';

export interface JsonFieldDescriptor {
  /** Field name / key */
  name: string;
  /** Field type */
  type: JsonFieldType;
  /** Human-readable label */
  label: string;
  /** Placeholder */
  placeholder?: string;
  /** Helper text */
  hint?: string;
  /** Default value */
  defaultValue?: unknown;
  /** Mark required */
  required?: boolean | string;
  /** Min (length or number) */
  min?: number;
  /** Max (length or number) */
  max?: number;
  /** Regex pattern */
  pattern?: string;
  /** Pattern error message */
  patternMsg?: string;
  /** Options for select/radio */
  options?: Array<string | { label: string; value: string | number }>;
  /** OTP length */
  otpLength?: number;
  /** Disabled */
  disabled?: boolean;
  /** Order (for rendering) */
  order?: number;
  /** Condition — show only when another field has a certain value */
  showWhen?: { field: string; value: unknown } | { field: string; notValue: unknown };
  /** Validation rules as a JSON array */
  validate?: JsonValidationRule[];
}

export interface JsonValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'email' | 'url' | 'custom';
  value?: unknown;
  message: string;
}

/** The full JSON form definition (typically returned by an API) */
export interface JsonFormDefinition {
  /** Optional form ID (used for persistence key) */
  id?: string;
  /** Optional form title */
  title?: string;
  /** The fields */
  fields: JsonFieldDescriptor[];
  /** Optional submit button label */
  submitLabel?: string;
}

// ─── JSON Schema (standard draft-07) converter ───────────────────────────────

export interface JsonSchemaDraft7 {
  title?: string;
  properties: Record<string, JsonSchemaProp>;
  required?: string[];
}

export interface JsonSchemaProp {
  type?: string | string[];
  format?: string;
  title?: string;
  description?: string;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  enum?: unknown[];
  default?: unknown;
}
