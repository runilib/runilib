import type { FieldDescriptor, FieldType, SelectOption, Validator, FieldRenderProps } from '../types';
import type { ReactNode } from 'react';

// ─── Base builder class ────────────────────────────────────────────────────────

class FieldBuilder<V = unknown> {
  protected _desc: FieldDescriptor<V>;

  constructor(type: FieldType, label: string, defaultValue: V) {
    this._desc = {
      _type:         type,
      _label:        label,
      _defaultValue: defaultValue,
      _required:     false,
      _requiredMsg:  'This field is required.',
      _trim:         false,
      _disabled:     false,
      _hidden:       false,
      _debounce:     300,
      _validators:   [],
    };
  }

  /** Mark the field as required */
  required(message?: string): this {
    this._desc._required    = true;
    this._desc._requiredMsg = message ?? 'This field is required.';
    return this;
  }

  /** Add a custom label (overrides constructor label) */
  label(label: string): this {
    this._desc._label = label;
    return this;
  }

  /** Add placeholder text */
  placeholder(text: string): this {
    this._desc._placeholder = text;
    return this;
  }

  /** Add helper text shown below the field */
  hint(text: string): this {
    this._desc._hint = text;
    return this;
  }

  /** Disable the field */
  disabled(value = true): this {
    this._desc._disabled = value;
    return this;
  }

  /** Hide the field from the UI (value still tracked) */
  hidden(value = true): this {
    this._desc._hidden = value;
    return this;
  }

  /** Debounce async validators (ms) */
  debounce(ms: number): this {
    this._desc._debounce = ms;
    return this;
  }

  /** Add a custom validator (sync or async) */
  validate(fn: Validator<V>): this {
    this._desc._validators.push(fn);
    return this;
  }

  /** Transform the value before storing (e.g., trim, lowercase) */
  transform(fn: (v: V) => V): this {
    this._desc._transform = fn;
    return this;
  }

  /** Custom renderer — overrides the platform's default UI */
  render(fn: (props: FieldRenderProps<V>) => ReactNode): this {
    this._desc._customRender = fn;
    return this;
  }

  /** Return the descriptor (called internally by formura) */
  _build(): FieldDescriptor<V> {
    return this._desc;
  }
}

// ─── String field builder ─────────────────────────────────────────────────────

class StringFieldBuilder extends FieldBuilder<string> {
  constructor(type: FieldType, label: string) {
    super(type, label, '');
  }

  /** Minimum string length */
  min(length: number, message?: string): this {
    this._desc._min    = length;
    this._desc._minMsg = message ?? `Must be at least ${length} characters.`;
    return this;
  }

  /** Maximum string length */
  max(length: number, message?: string): this {
    this._desc._max    = length;
    this._desc._maxMsg = message ?? `Must be at most ${length} characters.`;
    return this;
  }

  /** Regex pattern */
  pattern(regex: RegExp, message?: string): this {
    this._desc._pattern    = regex;
    this._desc._patternMsg = message ?? 'Invalid format.';
    return this;
  }

  /** Trim value before validation */
  trim(): this {
    this._desc._trim = true;
    return this;
  }

  /** Must match the value of another field (e.g., confirmPassword) */
  matches(fieldName: string, message?: string): this {
    this._desc._matchField = fieldName;
    this._desc._validators.push(
      (value: string, all: Record<string, unknown>) =>
        value === all[fieldName] ? null : (message ?? 'Values do not match.')
    );
    return this;
  }
}

// ─── Password field builder ───────────────────────────────────────────────────

class PasswordFieldBuilder extends StringFieldBuilder {
  constructor(label: string) { super('password', label); }

  /** Enforce strong password (uppercase, lowercase, number, min 8) */
  strong(message?: string): this {
    this._desc._strongPassword = true;
    this._desc._validators.push((value: string) => {
      if (value.length < 8)        return 'Password must be at least 8 characters.';
      if (!/[A-Z]/.test(value))    return 'Password must contain at least one uppercase letter.';
      if (!/[a-z]/.test(value))    return 'Password must contain at least one lowercase letter.';
      if (!/\d/.test(value))       return 'Password must contain at least one number.';
      if (!/[^A-Za-z0-9]/.test(value)) return 'Password must contain at least one special character.';
      return null;
    });
    return this;
  }
}

// ─── Number field builder ─────────────────────────────────────────────────────

class NumberFieldBuilder extends FieldBuilder<number> {
  constructor(label: string) { super('number', label, 0); }

  min(value: number, message?: string): this {
    this._desc._min    = value;
    this._desc._minMsg = message ?? `Must be at least ${value}.`;
    return this;
  }

  max(value: number, message?: string): this {
    this._desc._max    = value;
    this._desc._maxMsg = message ?? `Must be at most ${value}.`;
    return this;
  }

  positive(message?: string): this {
    return this.min(0.0001, message ?? 'Must be a positive number.');
  }

  integer(message?: string): this {
    return this.validate(v =>
      Number.isInteger(v) ? null : (message ?? 'Must be a whole number.')
    );
  }
}

// ─── Boolean field builder ────────────────────────────────────────────────────

class BooleanFieldBuilder extends FieldBuilder<boolean> {
  constructor(type: FieldType, label: string) { super(type, label, false); }

  /** Must be checked/true to pass */
  mustBeTrue(message?: string): this {
    this._desc._required    = true;
    this._desc._requiredMsg = message ?? 'You must accept this.';
    return this;
  }
}

// ─── Select / Radio field builder ─────────────────────────────────────────────

class SelectFieldBuilder extends FieldBuilder<string> {
  constructor(type: FieldType, label: string) { super(type, label, ''); }

  options(opts: SelectOption[] | string[]): this {
    this._desc._options = opts.map(o =>
      typeof o === 'string' ? { label: o, value: o } : o
    );
    return this;
  }
}

// ─── OTP field builder ────────────────────────────────────────────────────────

class OtpFieldBuilder extends FieldBuilder<string> {
  constructor(label: string) { super('otp', label, ''); }

  length(n: number): this {
    this._desc._otpLength = n;
    this._desc._min       = n;
    this._desc._max       = n;
    return this;
  }
}

// ─── ─── ─── field namespace ─── ─── ─────────────────────────────────────────

/**
 * `field` — the schema builder namespace.
 *
 * Each method returns a builder with a fluent API.
 * Chain methods to configure your field, then pass to `useForm()`.
 *
 * @example
 * const { Form, fields } = useForm({
 *   name:     field.text('Full name').required().trim().max(80),
 *   email:    field.email('Email').required(),
 *   password: field.password('Password').required().strong(),
 *   age:      field.number('Age').required().min(18),
 *   country:  field.select('Country').options(['FR','US','UK']).required(),
 *   terms:    field.checkbox('I accept the terms').mustBeTrue(),
 * });
 */
export const field = {
  /** Single-line text input */
  text: (label: string) => new StringFieldBuilder('text', label),

  /** Email input — comes with email format validation built in */
  email: (label: string) => {
    const b = new StringFieldBuilder('email', label);
    b.pattern(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please enter a valid email address.'
    );
    return b;
  },

  /** Password input — hidden by default, can enforce strength */
  password: (label: string) => new PasswordFieldBuilder(label),

  /** Numeric input */
  number: (label: string) => new NumberFieldBuilder(label),

  /** Phone number input */
  tel: (label: string) => {
    const b = new StringFieldBuilder('tel', label);
    b.pattern(/^[+\d\s()\-]{6,20}$/, 'Please enter a valid phone number.');
    return b;
  },

  /** URL input */
  url: (label: string) => {
    const b = new StringFieldBuilder('url', label);
    b.pattern(/^https?:\/\/.+/, 'Please enter a valid URL (starting with http:// or https://).');
    return b;
  },

  /** Multi-line text area */
  textarea: (label: string) => new StringFieldBuilder('textarea', label),

  /** Checkbox — renders as <input type="checkbox"> on web, <Switch> on native */
  checkbox: (label: string) => new BooleanFieldBuilder('checkbox', label),

  /** Toggle switch — same as checkbox but renders as a switch on both platforms */
  switch: (label: string) => new BooleanFieldBuilder('switch', label),

  /** Dropdown select */
  select: (label: string) => new SelectFieldBuilder('select', label),

  /** Radio group */
  radio: (label: string) => new SelectFieldBuilder('radio', label),

  /** Date picker */
  date: (label: string) => new StringFieldBuilder('date', label),

  /** OTP / PIN code input */
  otp: (label: string) => new OtpFieldBuilder(label),

  /** Custom field with your own renderer */
  custom: <V = unknown>(label: string, defaultValue: V) =>
    new FieldBuilder<V>('custom', label, defaultValue),
};

export type { FieldBuilder, StringFieldBuilder, NumberFieldBuilder, BooleanFieldBuilder, SelectFieldBuilder };
