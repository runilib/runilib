/**
 * Formbridge — Reactive Conditional Fields
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
  | { type: 'eq'; field: string; value: unknown }
  | { type: 'neq'; field: string; value: unknown }
  | { type: 'gt'; field: string; value: number }
  | { type: 'gte'; field: string; value: number }
  | { type: 'lt'; field: string; value: number }
  | { type: 'lte'; field: string; value: number }
  | { type: 'truthy'; field: string }
  | { type: 'falsy'; field: string }
  | { type: 'in'; field: string; values: unknown[] }
  | { type: 'notIn'; field: string; values: unknown[] }
  | { type: 'fn'; fn: ConditionPredicate };

export type ConditionGroup =
  | { op: 'AND'; conditions: SimpleCondition[] }
  | { op: 'OR'; conditions: SimpleCondition[] };

export type Condition = SimpleCondition | ConditionGroup;

// ─── Evaluate a single condition ─────────────────────────────────────────────
function evalSimple(c: SimpleCondition, values: Record<string, unknown>): boolean {
  switch (c.type) {
    case 'eq':
      return values[c.field] === c.value;
    case 'neq':
      return values[c.field] !== c.value;
    case 'gt':
      return Number(values[c.field]) > c.value;
    case 'gte':
      return Number(values[c.field]) >= c.value;
    case 'lt':
      return Number(values[c.field]) < c.value;
    case 'lte':
      return Number(values[c.field]) <= c.value;
    case 'truthy':
      return Boolean(values[c.field]);
    case 'falsy':
      return !values[c.field];
    case 'in':
      return c.values.includes(values[c.field]);
    case 'notIn':
      return !c.values.includes(values[c.field]);
    case 'fn':
      return c.fn(values);
  }
}

export function evaluateCondition(
  c: Condition,
  values: Record<string, unknown>,
): boolean {
  if ('op' in c) {
    if (c.op === 'AND') return c.conditions.every((sc) => evalSimple(sc, values));
    if (c.op === 'OR') return c.conditions.some((sc) => evalSimple(sc, values));
  }
  return evalSimple(c as SimpleCondition, values);
}

// ─── FieldConditions — stored per field ──────────────────────────────────────

export interface FieldConditions {
  /** Field is visible only when ALL visibleWhen conditions pass */
  visible: Condition[];
  /** Field is required only when ALL requiredWhen conditions pass */
  required: Condition[];
  /** Field is disabled only when ANY disabledWhen condition passes */
  disabled: Condition[];
  /**
   * When a field becomes hidden, what happens to its value?
   * - 'reset'  → reset to defaultValue (default)
   * - 'keep'   → keep the current value
   * - 'clear'  → set to null/''
   */
  onHide: 'reset' | 'keep' | 'clear';
}

export const DEFAULT_FIELD_CONDITIONS: FieldConditions = {
  visible: [],
  required: [],
  disabled: [],
  onHide: 'reset',
};

// ─── Evaluate all conditions for all fields ───────────────────────────────────

export interface FieldVisibilityState {
  visible: boolean;
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
  values: Record<string, unknown>,
): VisibilityMap {
  const result: VisibilityMap = {};

  for (const [name, conds] of Object.entries(conditionsMap)) {
    // Visible: ALL conditions must pass (empty = always visible)
    const visible =
      conds.visible.length === 0
        ? true
        : conds.visible.every((c) => evaluateCondition(c, values));

    // Required: ALL conditions must pass (empty = not conditionally required)
    const required =
      conds.required.length === 0
        ? false // overridden by schema _required in useForm
        : conds.required.every((c) => evaluateCondition(c, values));

    // Disabled: ANY condition passes (empty = not disabled)
    const disabled =
      conds.disabled.length > 0 &&
      conds.disabled.some((c) => evaluateCondition(c, values));

    result[name] = { visible, required, disabled };
  }

  return result;
}

// ─── ConditionMixin class ─────────────────────────────────────────────────────

/**
 * Standalone class — used directly OR via the WithConditions factory.
 *
 * You generally don't instantiate this directly.
 * Use WithConditions(YourBase) to inject these methods into a builder.
 */
export class ConditionMixin {
  _conditions: FieldConditions = {
    ...DEFAULT_FIELD_CONDITIONS,
    visible: [],
    required: [],
    disabled: [],
  };

  // ── visibleWhen ───────────────────────────────────────────────

  /**
   * Show this field only when `fieldName` equals `value`.
   * Chain multiple calls for AND logic.
   *
   * @example
   * field.text('Company name').visibleWhen('accountType', 'business')
   *
   * // Predicate:
   * field.text('Senior discount').visibleWhen(v => Number(v.age) >= 65)
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

  /** Show when field !== value */
  visibleWhenNot(field: string, value: unknown): this {
    this._conditions.visible.push({ type: 'neq', field, value });
    return this;
  }

  /** Show when field is truthy */
  visibleWhenTruthy(field: string): this {
    this._conditions.visible.push({ type: 'truthy', field });
    return this;
  }

  /** Show when field is falsy */
  visibleWhenFalsy(field: string): this {
    this._conditions.visible.push({ type: 'falsy', field });
    return this;
  }

  /**
   * Show when ANY of the pairs match — OR logic.
   * @example
   * field.text('Offer').visibleWhenAny([['plan', 'pro'], ['plan', 'enterprise']])
   */
  visibleWhenAny(pairs: Array<[string, unknown]>): this {
    this._conditions.visible.push({
      op: 'OR',
      conditions: pairs.map(([f, v]) => ({ type: 'eq' as const, field: f, value: v })),
    });
    return this;
  }

  /** Show when field value is in the list */
  visibleWhenIn(field: string, values: unknown[]): this {
    this._conditions.visible.push({ type: 'in', field, values });
    return this;
  }

  /** Show when field value is NOT in the list */
  visibleWhenNotIn(field: string, values: unknown[]): this {
    this._conditions.visible.push({ type: 'notIn', field, values });
    return this;
  }

  /** Show when numeric field > value */
  visibleWhenGt(field: string, value: number): this {
    this._conditions.visible.push({ type: 'gt', field, value });
    return this;
  }

  /** Show when numeric field >= value */
  visibleWhenGte(field: string, value: number): this {
    this._conditions.visible.push({ type: 'gte', field, value });
    return this;
  }

  /** Show when numeric field < value */
  visibleWhenLt(field: string, value: number): this {
    this._conditions.visible.push({ type: 'lt', field, value });
    return this;
  }

  /** Show when numeric field <= value */
  visibleWhenLte(field: string, value: number): this {
    this._conditions.visible.push({ type: 'lte', field, value });
    return this;
  }

  // ── requiredWhen ──────────────────────────────────────────────

  /**
   * Make this field required only when `fieldName` equals `value`.
   * Chain multiple calls for AND logic.
   *
   * @example
   * field.text('VAT number').requiredWhen('accountType', 'business')
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

  /** Required when ANY of the pairs match — OR logic */
  requiredWhenAny(pairs: Array<[string, unknown]>): this {
    this._conditions.required.push({
      op: 'OR',
      conditions: pairs.map(([f, v]) => ({ type: 'eq' as const, field: f, value: v })),
    });
    return this;
  }

  /** Required when field value is in the list */
  requiredWhenIn(field: string, values: unknown[]): this {
    this._conditions.required.push({ type: 'in', field, values });
    return this;
  }

  // ── disabledWhen ─────────────────────────────────────────────

  /**
   * Disable this field when `fieldName` equals `value`.
   *
   * @example
   * field.text('Email').disabledWhen('ssoEnabled', true)
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

  /** Disable when field value is in the list */
  disabledWhenIn(field: string, values: unknown[]): this {
    this._conditions.disabled.push({ type: 'in', field, values });
    return this;
  }

  // ── onHide behavior ──────────────────────────────────────────

  /** When hidden, reset to defaultValue. This is the default. */
  resetOnHide(): this {
    this._conditions.onHide = 'reset';
    return this;
  }

  /** When hidden, keep the current value. */
  keepOnHide(): this {
    this._conditions.onHide = 'keep';
    return this;
  }

  /** When hidden, set to null / empty string. */
  clearOnHide(): this {
    this._conditions.onHide = 'clear';
    return this;
  }
}

// ─── WithConditions — mixin factory ──────────────────────────────────────────

/**
 * Injects all ConditionMixin methods into any class.
 *
 * Usage — apply ONCE on your base builder, every subclass inherits for free:
 *
 * ```ts
 * // In FieldBuilder.ts
 * class _FieldBuilder<T> { ... }
 * export const FieldBuilder = WithConditions(_FieldBuilder)
 *
 * // In StringFieldBuilder.ts — nothing to do, already inherited
 * class StringFieldBuilder extends FieldBuilder { ... }
 *
 * // At runtime
 * field.text('Company').visibleWhen('type', 'business').requiredWhen('type', 'business')
 * ```
 *
 * If you only want conditions on ONE builder (not all), apply it to that class:
 * ```ts
 * class PasswordFieldBuilder extends WithConditions(StringFieldBuilder) { ... }
 * ```
 */
export function WithConditions<TBase extends new (...args: any[]) => object>(
  Base: TBase,
) {
  return class extends Base {
    /**
     * Each instance gets its own _conditions object.
     * Initialized fresh so instances never share state.
     */
    _conditions: FieldConditions = {
      ...DEFAULT_FIELD_CONDITIONS,
      visible: [],
      required: [],
      disabled: [],
    };

    // ── visibleWhen ─────────────────────────────────────────────

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

    visibleWhenNot(field: string, value: unknown): this {
      this._conditions.visible.push({ type: 'neq', field, value });
      return this;
    }

    visibleWhenTruthy(field: string): this {
      this._conditions.visible.push({ type: 'truthy', field });
      return this;
    }

    visibleWhenFalsy(field: string): this {
      this._conditions.visible.push({ type: 'falsy', field });
      return this;
    }

    visibleWhenAny(pairs: Array<[string, unknown]>): this {
      this._conditions.visible.push({
        op: 'OR',
        conditions: pairs.map(([f, v]) => ({ type: 'eq' as const, field: f, value: v })),
      });
      return this;
    }

    visibleWhenIn(field: string, values: unknown[]): this {
      this._conditions.visible.push({ type: 'in', field, values });
      return this;
    }

    visibleWhenNotIn(field: string, values: unknown[]): this {
      this._conditions.visible.push({ type: 'notIn', field, values });
      return this;
    }

    visibleWhenGt(field: string, value: number): this {
      this._conditions.visible.push({ type: 'gt', field, value });
      return this;
    }

    visibleWhenGte(field: string, value: number): this {
      this._conditions.visible.push({ type: 'gte', field, value });
      return this;
    }

    visibleWhenLt(field: string, value: number): this {
      this._conditions.visible.push({ type: 'lt', field, value });
      return this;
    }

    visibleWhenLte(field: string, value: number): this {
      this._conditions.visible.push({ type: 'lte', field, value });
      return this;
    }

    // ── requiredWhen ────────────────────────────────────────────

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

    requiredWhenAny(pairs: Array<[string, unknown]>): this {
      this._conditions.required.push({
        op: 'OR',
        conditions: pairs.map(([f, v]) => ({ type: 'eq' as const, field: f, value: v })),
      });
      return this;
    }

    requiredWhenIn(field: string, values: unknown[]): this {
      this._conditions.required.push({ type: 'in', field, values });
      return this;
    }

    // ── disabledWhen ────────────────────────────────────────────

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

    disabledWhenIn(field: string, values: unknown[]): this {
      this._conditions.disabled.push({ type: 'in', field, values });
      return this;
    }

    // ── onHide ──────────────────────────────────────────────────

    resetOnHide(): this {
      this._conditions.onHide = 'reset';
      return this;
    }
    keepOnHide(): this {
      this._conditions.onHide = 'keep';
      return this;
    }
    clearOnHide(): this {
      this._conditions.onHide = 'clear';
      return this;
    }
  };
}

// ─── Type helper ─────────────────────────────────────────────────────────────

/**
 * Extracts the type produced by WithConditions so you can annotate
 * variables and function params without re-typing everything.
 *
 * @example
 * type MyBuilder = WithConditionsType<typeof MyBase>
 */
export type WithConditionsType<TBase extends new (...args: any[]) => object> =
  InstanceType<ReturnType<typeof WithConditions<TBase>>>;
