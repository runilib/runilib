/**
 * React Formbridge — Reactive Conditional Fields
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

import type { FormSchema } from '../../types/schema';

// ─── Condition types ──────────────────────────────────────────────────────────
export type ConditionPredicate = (values: Record<string, unknown>) => boolean;

type SimpleCondition =
  | { type: 'eq'; field: string; value: unknown } // Equal — true when field === value
  | { type: 'neq'; field: string; value: unknown } // Not equal — true when field !== value
  | { type: 'gt'; field: string; value: number } // Greater than — true when field > value
  | { type: 'gte'; field: string; value: number } // Greater or equal — true when field >= value
  | { type: 'lt'; field: string; value: number } // Less than — true when field < value
  | { type: 'lte'; field: string; value: number } // Less or equal — true when field <= value
  | { type: 'truthy'; field: string } // Truthy — true when field has a non-falsy value
  | { type: 'falsy'; field: string } // Falsy — true when field is falsy (null, '', 0, false, undefined)
  | { type: 'in'; field: string; values: unknown[] } // In list — true when field value is in the array
  | { type: 'notIn'; field: string; values: unknown[] } // Not in list — true when field value is NOT in the array
  | { type: 'fn'; fn: ConditionPredicate }; // Custom predicate — true when fn(allValues) returns true

export type ConditionGroup =
  | { op: 'AND'; conditions: SimpleCondition[] } // All conditions must pass
  | { op: 'OR'; conditions: SimpleCondition[] }; // At least one condition must pass

export type Condition = SimpleCondition | ConditionGroup;

// ─── Evaluate a single condition ─────────────────────────────────────────────
function evaluateSimple(
  condition: SimpleCondition,
  values: Record<string, unknown>,
): boolean {
  switch (condition.type) {
    case 'eq':
      return values[condition.field] === condition.value;
    case 'neq':
      return values[condition.field] !== condition.value;
    case 'gt':
      return Number(values[condition.field]) > condition.value;
    case 'gte':
      return Number(values[condition.field]) >= condition.value;
    case 'lt':
      return Number(values[condition.field]) < condition.value;
    case 'lte':
      return Number(values[condition.field]) <= condition.value;
    case 'truthy':
      return Boolean(values[condition.field]);
    case 'falsy':
      return !values[condition.field];
    case 'in':
      return condition.values.includes(values[condition.field]);
    case 'notIn':
      return !condition.values.includes(values[condition.field]);
    case 'fn':
      return condition.fn(values);
  }
}

function evaluateCondition(
  condition: Condition,
  values: Record<string, unknown>,
): boolean {
  if ('op' in condition) {
    if (condition.op === 'AND') {
      return condition.conditions.every((sc) => evaluateSimple(sc, values));
    }

    if (condition.op === 'OR') {
      return condition.conditions.some((sc) => evaluateSimple(sc, values));
    }
  }

  return evaluateSimple(condition, values);
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
export function evaluateAllConditions<_K extends keyof FormSchema>(
  conditionsMap: Record<string, FieldConditions>,
  values: Record<string, unknown>,
): VisibilityMap {
  const result: VisibilityMap = {};

  for (const [name, conditions] of Object.entries(conditionsMap)) {
    // Visible: ALL conditions must pass (empty = always visible)
    const visible =
      conditions.visible.length === 0
        ? true
        : conditions.visible.every((condition) => evaluateCondition(condition, values));

    // Required: ALL conditions must pass (empty = not conditionally required)
    const required =
      conditions.required.length === 0
        ? false // overridden by schema _required in useForm
        : conditions.required.every((condition) => evaluateCondition(condition, values));

    // Disabled: ANY condition passes (empty = not disabled)
    const disabled =
      conditions.disabled.length > 0 &&
      conditions.disabled.some((condition) => evaluateCondition(condition, values));

    result[name] = { visible, required, disabled };
  }

  return result;
}
