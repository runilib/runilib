/**
 * formura — Reactive Conditional Fields
 * ──────────────────────────────────────────
 * Declarative, reactive show/hide and required/not-required rules
 * that update automatically whenever form values change.
 *
 * Supports:
 *   - Simple equality:    .visibleWhen('country', 'FR')
 *   - Inequality:         .visibleWhenNot('plan', 'free')
 *   - Multiple (AND):     .visibleWhen('a', 1).visibleWhen('b', 2)
 *   - Multiple (OR):      .visibleWhenAny([['a', 1], ['b', 2]])
 *   - Predicate function: .visibleWhen(values => values.age >= 18)
 *   - requiredWhen:       same API as visibleWhen
 *   - disabledWhen:       same API as visibleWhen
 */

// ─── Condition types ──────────────────────────────────────────────────────────

export type ConditionPredicate = (values: Record<string, unknown>) => boolean;

export type SimpleCondition =
  | { type: 'eq';     field: string; value: unknown }
  | { type: 'neq';    field: string; value: unknown }
  | { type: 'gt';     field: string; value: number }
  | { type: 'gte';    field: string; value: number }
  | { type: 'lt';     field: string; value: number }
  | { type: 'lte';    field: string; value: number }
  | { type: 'truthy'; field: string }
  | { type: 'falsy';  field: string }
  | { type: 'in';     field: string; values: unknown[] }
  | { type: 'notIn';  field: string; values: unknown[] }
  | { type: 'fn';     fn: ConditionPredicate };

export type ConditionGroup =
  | { op: 'AND'; conditions: SimpleCondition[] }
  | { op: 'OR';  conditions: SimpleCondition[] };

export type Condition = SimpleCondition | ConditionGroup;

// ─── Evaluate a single condition ─────────────────────────────────────────────

function evalSimple(c: SimpleCondition, values: Record<string, unknown>): boolean {
  switch (c.type) {
    case 'eq':     return values[c.field] === c.value;
    case 'neq':    return values[c.field] !== c.value;
    case 'gt':     return Number(values[c.field]) > c.value;
    case 'gte':    return Number(values[c.field]) >= c.value;
    case 'lt':     return Number(values[c.field]) < c.value;
    case 'lte':    return Number(values[c.field]) <= c.value;
    case 'truthy': return Boolean(values[c.field]);
    case 'falsy':  return !values[c.field];
    case 'in':     return c.values.includes(values[c.field]);
    case 'notIn':  return !c.values.includes(values[c.field]);
    case 'fn':     return c.fn(values);
  }
}

export function evaluateCondition(c: Condition, values: Record<string, unknown>): boolean {
  if ('op' in c) {
    // Group condition
    if (c.op === 'AND') return c.conditions.every(sc => evalSimple(sc, values));
    if (c.op === 'OR')  return c.conditions.some( sc => evalSimple(sc, values));
  }
  return evalSimple(c as SimpleCondition, values);
}

// ─── FieldConditions — stored per field ──────────────────────────────────────

export interface FieldConditions {
  /** Field is visible only when ALL visibleWhen conditions pass */
  visible:   Condition[];
  /** Field is required only when ALL requiredWhen conditions pass */
  required:  Condition[];
  /** Field is disabled only when ANY disabledWhen condition passes */
  disabled:  Condition[];
  /**
   * When a field becomes hidden, what happens to its value?
   * - 'reset'  → reset to defaultValue (default)
   * - 'keep'   → keep the current value
   * - 'clear'  → set to null/''
   */
  onHide:    'reset' | 'keep' | 'clear';
}

export const DEFAULT_FIELD_CONDITIONS: FieldConditions = {
  visible:  [],
  required: [],
  disabled: [],
  onHide:   'reset',
};

// ─── Evaluate all conditions for all fields ───────────────────────────────────

export interface FieldVisibilityState {
  visible:  boolean;
  required: boolean;
  disabled: boolean;
}

export type VisibilityMap = Record<string, FieldVisibilityState>;

/**
 * Evaluate all field conditions given the current form values.
 * Returns a map of { fieldName → { visible, required, disabled } }.
 */
export function evaluateAllConditions(
  conditionsMap: Record<string, FieldConditions>,
  values:        Record<string, unknown>,
): VisibilityMap {
  const result: VisibilityMap = {};

  for (const [name, conds] of Object.entries(conditionsMap)) {
    // Visible: all AND conditions must pass (empty = always visible)
    const visible = conds.visible.length === 0
      ? true
      : conds.visible.every(c => evaluateCondition(c, values));

    // Required: all AND conditions must pass (empty = use schema default)
    const required = conds.required.length === 0
      ? false // will be overridden by schema _required
      : conds.required.every(c => evaluateCondition(c, values));

    // Disabled: any condition passes (empty = not disabled)
    const disabled = conds.disabled.length > 0
      && conds.disabled.some(c => evaluateCondition(c, values));

    result[name] = { visible, required, disabled };
  }

  return result;
}

// ─── Condition builder mixin ──────────────────────────────────────────────────

/**
 * Mixin added to all field builders.
 * Adds .visibleWhen(), .requiredWhen(), .disabledWhen(), etc.
 */
export class ConditionMixin {
  _conditions: FieldConditions = { ...DEFAULT_FIELD_CONDITIONS };

  /**
   * Show this field only when `fieldName` equals `value`.
   * Chain multiple .visibleWhen() calls for AND logic.
   *
   * @example
   * field.text('Company name')
   *   .visibleWhen('accountType', 'business')
   *
   * // With a predicate function:
   * field.text('Senior discount')
   *   .visibleWhen(values => Number(values.age) >= 65)
   */
  visibleWhen(
    fieldOrFn: string | ConditionPredicate,
    value?: unknown,
  ): this {
    if (typeof fieldOrFn === 'function') {
      this._conditions.visible.push({ type: 'fn', fn: fieldOrFn });
    } else {
      this._conditions.visible.push({ type: 'eq', field: fieldOrFn, value: value ?? true });
    }
    return this;
  }

  /**
   * Show this field only when `fieldName` does NOT equal `value`.
   */
  visibleWhenNot(field: string, value: unknown): this {
    this._conditions.visible.push({ type: 'neq', field, value });
    return this;
  }

  /**
   * Show this field when field value is truthy.
   */
  visibleWhenTruthy(field: string): this {
    this._conditions.visible.push({ type: 'truthy', field });
    return this;
  }

  /**
   * Show this field when ANY of the provided conditions pass (OR logic).
   * @example
   * field.text('Special offer')
   *   .visibleWhenAny([
   *     ['plan', 'pro'],
   *     ['plan', 'enterprise'],
   *   ])
   */
  visibleWhenAny(pairs: Array<[string, unknown]>): this {
    this._conditions.visible.push({
      op:         'OR',
      conditions: pairs.map(([f, v]) => ({ type: 'eq' as const, field: f, value: v })),
    });
    return this;
  }

  /**
   * Show this field when field value is in the provided list.
   */
  visibleWhenIn(field: string, values: unknown[]): this {
    this._conditions.visible.push({ type: 'in', field, values });
    return this;
  }

  /**
   * Show this field when field value is NOT in the provided list.
   */
  visibleWhenNotIn(field: string, values: unknown[]): this {
    this._conditions.visible.push({ type: 'notIn', field, values });
    return this;
  }

  /**
   * Show this field when a numeric field is greater than a value.
   */
  visibleWhenGt(field: string, value: number): this {
    this._conditions.visible.push({ type: 'gt', field, value });
    return this;
  }

  /**
   * Show this field when a numeric field is greater than or equal to a value.
   */
  visibleWhenGte(field: string, value: number): this {
    this._conditions.visible.push({ type: 'gte', field, value });
    return this;
  }

  // ── requiredWhen ──────────────────────────────────────────────

  /**
   * Make this field required only when `fieldName` equals `value`.
   * Chain multiple calls for AND logic.
   *
   * @example
   * field.text('VAT number')
   *   .requiredWhen('accountType', 'business')
   *
   * field.text('Company name')
   *   .requiredWhen('hasCompany', true)
   */
  requiredWhen(
    fieldOrFn: string | ConditionPredicate,
    value?: unknown,
  ): this {
    if (typeof fieldOrFn === 'function') {
      this._conditions.required.push({ type: 'fn', fn: fieldOrFn });
    } else {
      this._conditions.required.push({ type: 'eq', field: fieldOrFn, value: value ?? true });
    }
    return this;
  }

  /**
   * Make this field required when ANY of the conditions pass.
   */
  requiredWhenAny(pairs: Array<[string, unknown]>): this {
    this._conditions.required.push({
      op:         'OR',
      conditions: pairs.map(([f, v]) => ({ type: 'eq' as const, field: f, value: v })),
    });
    return this;
  }

  /**
   * Make this field required when field value is in the list.
   */
  requiredWhenIn(field: string, values: unknown[]): this {
    this._conditions.required.push({ type: 'in', field, values });
    return this;
  }

  // ── disabledWhen ─────────────────────────────────────────────

  /**
   * Disable this field when `fieldName` equals `value`.
   *
   * @example
   * field.text('Email')
   *   .disabledWhen('ssoEnabled', true)
   */
  disabledWhen(
    fieldOrFn: string | ConditionPredicate,
    value?: unknown,
  ): this {
    if (typeof fieldOrFn === 'function') {
      this._conditions.disabled.push({ type: 'fn', fn: fieldOrFn });
    } else {
      this._conditions.disabled.push({ type: 'eq', field: fieldOrFn, value: value ?? true });
    }
    return this;
  }

  /**
   * Disable this field when field value is in the list.
   */
  disabledWhenIn(field: string, values: unknown[]): this {
    this._conditions.disabled.push({ type: 'in', field, values });
    return this;
  }

  // ── onHide behavior ──────────────────────────────────────────

  /**
   * When this field becomes hidden, reset its value to defaultValue.
   * This is the default behavior.
   */
  resetOnHide(): this {
    this._conditions.onHide = 'reset';
    return this;
  }

  /**
   * When this field becomes hidden, keep its current value.
   * Useful when you want to preserve user input if they re-show the field.
   */
  keepOnHide(): this {
    this._conditions.onHide = 'keep';
    return this;
  }

  /**
   * When this field becomes hidden, set its value to null/empty string.
   */
  clearOnHide(): this {
    this._conditions.onHide = 'clear';
    return this;
  }
}
