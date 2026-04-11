import type { ReactNode } from 'react';

import type {
  FieldDescriptor,
  FieldRenderProps,
  FieldType,
  Validator,
} from '../../../types/field';
import type { ConditionPredicate, FieldConditions } from '../../conditions/conditions';
import { DEFAULT_FIELD_CONDITIONS } from '../../conditions/conditions';

/**
 * Creates a deep clone of a field descriptor to avoid mutation of the original.
 *
 * @param descriptor - The field descriptor to clone.
 * @returns A new `FieldDescriptor` with cloned arrays and objects.
 */
function cloneDescriptor<V, TType extends FieldType>(
  descriptor: FieldDescriptor<V, TType>,
): FieldDescriptor<V, TType> {
  return {
    ...descriptor,
    _validators: [...descriptor._validators],
    _options: descriptor._options ? [...descriptor._options] : undefined,
    _patterns: descriptor._patterns ? [...descriptor._patterns] : undefined,
  };
}

/**
 * Base builder for constructing form field descriptors using a fluent (chainable) API.
 *
 * `BaseFieldBuilder` provides common configuration methods shared by all field types
 * (text, select, checkbox, etc.). Specialized builders extend this class to add
 * type-specific options.
 *
 * @typeParam FD - The type of the field's value (e.g. `string`, `boolean`, `string[]`).
 *
 * @example
 * ```ts
 * // Typically used through the `field` helper, not instantiated directly:
 * const schema = {
 *   email: field.text('Email', '')
 *     .required('Please enter your email')
 *     .placeholder('you@example.com')
 *     .validate((v) => v.includes('@') ? null : 'Invalid email'),
 * };
 * ```
 */
export class BaseFieldBuilder<
  FDefaultValue = unknown,
  TType extends FieldType = FieldType,
> {
  protected _desc: FieldDescriptor<FDefaultValue, TType>;
  protected _conditions: FieldConditions = {
    ...DEFAULT_FIELD_CONDITIONS,
    visible: [],
    required: [],
    disabled: [],
  };

  /**
   * Creates a new field builder.
   *
   * @param type - The field type identifier (e.g. `'text'`, `'select'`, `'checkbox'`).
   * @param label - The human-readable label displayed alongside the field.
   * @param defaultValue - The initial value of the field when the form is first rendered.
   */
  constructor(type: TType, defaultValue: FDefaultValue) {
    this._desc = {
      _type: type,
      _defaultValue: defaultValue,
      _required: false,
      _requiredMsg: 'This field is required.',
      _trim: false,
      _disabled: false,
      _hidden: false,
      _debounce: 300,
      _validators: [],
    };
  }

  /**
   * Overrides the default value set in the constructor.
   *
   * @param value - The new default value for the field.
   * @returns The builder instance for chaining.
   *
   * @example
   * ```ts
   * field.text('Country', '').defaultValue('France');
   * ```
   */
  defaultValue(value: FDefaultValue): this {
    this._desc._defaultValue = value;
    return this;
  }

  /**
   * Marks the field as required. A validation error is shown if the field is left empty.
   *
   * @param message - Custom error message displayed when the field is empty.
   *                  Defaults to `'This field is required.'`.
   * @returns The builder instance for chaining.
   *
   * @example
   * ```ts
   * field.text('Email', '').required('Email is required');
   * ```
   */
  required(message?: string): this {
    this._desc._required = true;
    this._desc._requiredMsg = message ?? 'This field is required.';
    return this;
  }

  /**
   * Marks the field as optional (removes the required constraint).
   * Useful when extending a schema where the field was previously required.
   *
   * @returns The builder instance for chaining.
   */
  optional(): this {
    this._desc._required = false;
    return this;
  }

  /**
   * Overrides the label set in the constructor.
   *
   * @param label - The new human-readable label for the field.
   * @returns The builder instance for chaining.
   */
  label(label: string): this {
    this._desc._label = label;
    return this;
  }

  /**
   * Sets the placeholder text displayed inside the field when it is empty.
   *
   * @param text - The placeholder string. Defaults to an empty string if omitted.
   * @returns The builder instance for chaining.
   *
   * @example
   * ```ts
   * field.text('Search', '').placeholder('Type to search...');
   * ```
   */
  placeholder(text?: string): this {
    this._desc._placeholder = text ?? '';
    return this;
  }

  /**
   * Adds a helper/hint text displayed below the field to guide the user.
   *
   * @param text - The hint message.
   * @returns The builder instance for chaining.
   *
   * @example
   * ```ts
   * field.text('Password', '').hint('Must be at least 8 characters');
   * ```
   */
  hint(text: string): this {
    this._desc._hint = text;
    return this;
  }

  /**
   * Disables (or re-enables) the field. A disabled field is rendered but not interactive.
   *
   * @param value - `true` to disable, `false` to enable. Defaults to `true`.
   * @returns The builder instance for chaining.
   */
  disabled(value = true): this {
    this._desc._disabled = value;
    return this;
  }

  /**
   * Hides (or shows) the field. A hidden field is not rendered at all.
   *
   * @param value - `true` to hide, `false` to show. Defaults to `true`.
   * @returns The builder instance for chaining.
   */
  hidden(value = true): this {
    this._desc._hidden = value;
    return this;
  }

  /**
   * Sets the debounce delay (in milliseconds) for value changes.
   * Validation and side-effects are deferred until the user stops typing
   * for the specified duration.
   *
   * @param ms - Debounce delay in milliseconds.
   * @returns The builder instance for chaining.
   *
   * @example
   * ```ts
   * // Validate 500ms after the user stops typing
   * field.text('Username', '').debounce(500);
   * ```
   */
  debounce(ms: number): this {
    this._desc._debounce = ms;
    return this;
  }

  /**
   * Adds a custom validation function to the field.
   * Multiple validators can be chained — they run in order and the first
   * error message returned is displayed.
   *
   * @param fn - A validator function that receives the current value and returns
   *             `null` (valid) or an error message string (invalid).
   * @returns The builder instance for chaining.
   *
   * @example
   * ```ts
   * field.text('Age', '')
   *   .validate((v) => Number(v) > 0 ? null : 'Must be positive')
   *   .validate((v) => Number(v) < 150 ? null : 'Invalid age');
   * ```
   */
  validate(fn: Validator<FDefaultValue>): this {
    this._desc._validators.push(fn);
    return this;
  }

  /**
   * Registers a transform function that is applied to the field value
   * before validation and submission (e.g. trimming whitespace, normalizing case).
   *
   * @param fn - A pure function that receives the raw value and returns the transformed value.
   * @returns The builder instance for chaining.
   *
   * @example
   * ```ts
   * field.text('Email', '')
   *   .transform((v) => v.toLowerCase().trim());
   * ```
   */
  transform(fn: (value: FDefaultValue) => FDefaultValue): this {
    this._desc._transform = fn;
    return this;
  }

  /**
   * Provides a custom render function to completely override the default
   * field rendering. Use this when the built-in field components don't
   * meet your UI needs.
   *
   * @param fn - A render function receiving `FieldRenderProps` and returning a `ReactNode`.
   * @returns The builder instance for chaining.
   *
   * @example
   * ```ts
   * field.text('Color', '#000000')
   *   .render(({ value, onChange, error }) => (
   *     <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
   *   ));
   * ```
   */
  render(fn: (props: FieldRenderProps<FDefaultValue>) => ReactNode): this {
    this._desc._customRender = fn;
    return this;
  }

  /**
   * Makes the field conditionally visible based on another field's value
   * or a custom predicate function.
   *
   * - When a **string** is passed, the field is visible when the referenced field
   *   equals `value` (defaults to `true`).
   * - When a **function** is passed, the field is visible when the predicate returns `true`.
   *
   * Multiple `visibleWhen*` calls are combined with AND logic (all must be satisfied).
   *
   * @param fieldOrFn - The name of another field, or a predicate `(values) => boolean`.
   * @param value - The value to compare against (only used when `fieldOrFn` is a string).
   * @returns The builder instance for chaining.
   *
   * @example
   * ```ts
   * // Visible when "subscribe" field is true
   * field.text('Email', '').visibleWhen('subscribe');
   *
   * // Visible when "country" equals "other"
   * field.text('Specify country', '').visibleWhen('country', 'other');
   *
   * // Visible based on custom logic
   * field.text('Details', '').visibleWhen((values) => values.age >= 18);
   * ```
   */
  visibleWhen(fieldOrFn: string | ConditionPredicate, value?: unknown): this {
    if (typeof fieldOrFn === 'function') {
      this._conditions.visible.push({ type: 'fn', fn: fieldOrFn });
    } else {
      this._conditions.visible.push({
        type: 'eq',
        field: fieldOrFn,
        value: value ?? true,
      });
    }
    return this;
  }

  /**
   * Makes the field both visible **and** required when the condition is met.
   * This is a shorthand for calling `visibleWhen()` and `requiredWhen()` with the same condition.
   *
   * @param fieldOrFn - The name of the field to watch, or a predicate function receiving all form values.
   * @param value - The value to compare against (defaults to `true`). Ignored when `fieldOrFn` is a function.
   * @returns The builder instance for chaining.
   *
   * @example
   * ```ts
   * // Visible and required when "hasCompany" is true
   * field.text('Company name', '').visibleAndRequiredWhen('hasCompany');
   *
   * // Visible and required when "role" equals "admin"
   * field.text('Admin code', '').visibleAndRequiredWhen('role', 'admin');
   *
   * // Visible and required based on custom logic
   * field.text('License', '').visibleAndRequiredWhen((values) => values.age >= 18);
   * ```
   */
  visibleAndRequiredWhen(fieldOrFn: string | ConditionPredicate, value?: unknown): this {
    if (typeof fieldOrFn === 'function') {
      this._conditions.visible.push({ type: 'fn', fn: fieldOrFn });
      this._conditions.required.push({ type: 'fn', fn: fieldOrFn });
    } else {
      this._conditions.visible.push({
        type: 'eq',
        field: fieldOrFn,
        value: value ?? true,
      });

      this._conditions.required.push({
        type: 'eq',
        field: fieldOrFn,
        value: value ?? true,
      });
    }

    return this;
  }

  /**
   * Makes the field visible when the referenced field does **not** equal the given value.
   *
   * @param field - The name of the field to watch.
   * @param value - The value that should NOT match for this field to be visible.
   * @returns The builder instance for chaining.
   *
   * @example
   * ```ts
   * // Visible when "role" is anything other than "admin"
   * field.text('Reason', '').visibleWhenNot('role', 'admin');
   * ```
   */
  visibleWhenNot(field: string, value: unknown): this {
    this._conditions.visible.push({ type: 'neq', field, value });
    return this;
  }

  /**
   * Makes the field visible when the referenced field has a truthy value
   * (any value that is not `false`, `0`, `''`, `null`, or `undefined`).
   *
   * @param field - The name of the field to watch.
   * @returns The builder instance for chaining.
   *
   * @example
   * ```ts
   * field.text('Company name', '').visibleWhenTruthy('isEmployed');
   * ```
   */
  visibleWhenTruthy(field: string): this {
    this._conditions.visible.push({ type: 'truthy', field });
    return this;
  }

  /**
   * Makes the field visible when the referenced field has a falsy value
   * (`false`, `0`, `''`, `null`, or `undefined`).
   *
   * @param field - The name of the field to watch.
   * @returns The builder instance for chaining.
   *
   * @example
   * ```ts
   * field.text('Reason for decline', '').visibleWhenFalsy('accepted');
   * ```
   */
  visibleWhenFalsy(field: string): this {
    this._conditions.visible.push({ type: 'falsy', field });
    return this;
  }

  /**
   * Makes the field visible when **any** of the given field/value pairs match (OR logic).
   *
   * @param pairs - An array of `[fieldName, expectedValue]` tuples. The field is visible
   *                if at least one pair matches.
   * @returns The builder instance for chaining.
   *
   * @example
   * ```ts
   * // Visible when role is "admin" OR role is "manager"
   * field.text('Admin note', '')
   *   .visibleWhenAny([['role', 'admin'], ['role', 'manager']]);
   * ```
   */
  visibleWhenAny(pairs: Array<[string, unknown]>): this {
    this._conditions.visible.push({
      op: 'OR',
      conditions: pairs.map(([field, value]) => ({
        type: 'eq' as const,
        field,
        value,
      })),
    });
    return this;
  }

  /**
   * Makes the field conditionally required based on another field's value
   * or a custom predicate function.
   *
   * - When a **string** is passed, the field becomes required when the referenced
   *   field equals `value` (defaults to `true`).
   * - When a **function** is passed, the field is required when the predicate returns `true`.
   *
   * @param fieldOrFn - The name of another field, or a predicate `(values) => boolean`.
   * @param value - The value to compare against (only used when `fieldOrFn` is a string).
   * @returns The builder instance for chaining.
   *
   * @example
   * ```ts
   * // Required when "needsInvoice" is true
   * field.text('VAT number', '').requiredWhen('needsInvoice');
   *
   * // Required based on custom logic
   * field.text('Phone', '').requiredWhen((values) => values.contactMethod === 'phone');
   * ```
   */
  requiredWhen(fieldOrFn: string | ConditionPredicate, value?: unknown): this {
    if (typeof fieldOrFn === 'function') {
      this._conditions.required.push({ type: 'fn', fn: fieldOrFn });
    } else {
      this._conditions.required.push({
        type: 'eq',
        field: fieldOrFn,
        value: value ?? true,
      });
    }
    return this;
  }

  /**
   * Makes the field required when **any** of the given field/value pairs match (OR logic).
   *
   * @param pairs - An array of `[fieldName, expectedValue]` tuples. The field becomes
   *                required if at least one pair matches.
   * @returns The builder instance for chaining.
   *
   * @example
   * ```ts
   * field.text('Tax ID', '')
   *   .requiredWhenAny([['country', 'FR'], ['country', 'DE']]);
   * ```
   */
  requiredWhenAny(pairs: Array<[string, unknown]>): this {
    this._conditions.required.push({
      op: 'OR',
      conditions: pairs.map(([field, value]) => ({
        type: 'eq' as const,
        field,
        value,
      })),
    });
    return this;
  }

  /**
   * Conditionally disables the field based on another field's value
   * or a custom predicate function.
   *
   * - When a **string** is passed, the field is disabled when the referenced field
   *   equals `value` (defaults to `true`).
   * - When a **function** is passed, the field is disabled when the predicate returns `true`.
   *
   * @param fieldOrFn - The name of another field, or a predicate `(values) => boolean`.
   * @param value - The value to compare against (only used when `fieldOrFn` is a string).
   * @returns The builder instance for chaining.
   *
   * @example
   * ```ts
   * // Disabled when "locked" is true
   * field.text('Name', '').disabledWhen('locked');
   *
   * // Disabled based on custom logic
   * field.text('Code', '').disabledWhen((values) => values.status === 'submitted');
   * ```
   */
  disabledWhen(fieldOrFn: string | ConditionPredicate, value?: unknown): this {
    if (typeof fieldOrFn === 'function') {
      this._conditions.disabled.push({ type: 'fn', fn: fieldOrFn });
    } else {
      this._conditions.disabled.push({
        type: 'eq',
        field: fieldOrFn,
        value: value ?? true,
      });
    }
    return this;
  }

  /**
   * When the field becomes hidden (via a `visibleWhen*` condition), resets its value
   * back to the default value.
   *
   * @returns The builder instance for chaining.
   *
   * @example
   * ```ts
   * field.text('Other', '')
   *   .visibleWhen('option', 'other')
   *   .resetOnHide();
   * ```
   */
  resetOnHide(): this {
    this._conditions.onHide = 'reset';
    return this;
  }

  /**
   * When the field becomes hidden, keeps its current value intact.
   * The value is preserved and will be included in form submission.
   *
   * @returns The builder instance for chaining.
   */
  keepOnHide(): this {
    this._conditions.onHide = 'keep';
    return this;
  }

  /**
   * When the field becomes hidden, clears its value entirely
   * (sets it to an empty/null state).
   *
   * @returns The builder instance for chaining.
   */
  clearOnHide(): this {
    this._conditions.onHide = 'clear';
    return this;
  }

  /**
   * Builds and returns the final field descriptor with all configured conditions.
   * This is called internally by the form engine — you typically don't need to
   * call it yourself.
   *
   * @returns A cloned `FieldDescriptor` merged with the field's conditions.
   *
   * @internal
   */
  _build(): FieldDescriptor<FDefaultValue, TType> & { _conditions?: FieldConditions } {
    const desc = cloneDescriptor(this._desc);

    return {
      ...desc,
      _conditions: {
        ...this._conditions,
        visible: [...this._conditions.visible],
        required: [...this._conditions.required],
        disabled: [...this._conditions.disabled],
      },
    };
  }
}
