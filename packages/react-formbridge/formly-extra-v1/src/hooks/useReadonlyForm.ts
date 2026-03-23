import { useMemo } from 'react';
import type { FormSchema, SchemaValues, FieldDescriptor } from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ReadonlyMode = 'readonly' | 'diff';

export interface UseReadonlyFormOptions<S extends FormSchema> {
  mode:            ReadonlyMode;
  /** The values to display */
  values:          SchemaValues<S>;
  /**
   * Original / saved values for diff mode.
   * Fields that differ from `values` are highlighted.
   */
  originalValues?: Partial<SchemaValues<S>>;
  /** Custom formatter for a field value → display string */
  formatters?:     Partial<Record<keyof S, (value: unknown) => string>>;
}

export interface FieldReadonlyState {
  name:      string;
  label:     string;
  value:     unknown;
  display:   string;
  /** diff mode: true if this value changed compared to originalValues */
  changed:   boolean;
  /** diff mode: the original value (before change) */
  original?: unknown;
  originalDisplay?: string;
}

export interface UseReadonlyFormReturn<S extends FormSchema> {
  /** All fields with their display state */
  fields:     Record<keyof S, FieldReadonlyState>;
  /** Ordered list of field names */
  fieldNames: Array<keyof S>;
  /** Diff-only: list of changed field names */
  changedFields: Array<keyof S>;
  /** Whether any field has changed (useful for showing a "Save" button) */
  hasChanges: boolean;
  /**
   * The ReadonlyField render component — one per field.
   * Renders a label + value row, with diff highlighting.
   * Works on both web and React Native.
   */
  ReadonlyFields: ReadonlyFieldsComponent<S>;
}

export type ReadonlyFieldsComponent<S extends FormSchema> = {
  [K in keyof S]: (props?: ReadonlyFieldProps) => JSX.Element | null;
};

export interface ReadonlyFieldProps {
  /** Override label */
  label?:     string;
  /** Override value formatter */
  format?:    (value: unknown) => string;
  /** Extra style / className */
  style?:     object;
  className?: string;
  /** Show changed indicator even in readonly mode */
  showDiff?:  boolean;
}

// ─── Value formatter ─────────────────────────────────────────────────────────

function formatValue(value: unknown, descriptor: FieldDescriptor<unknown>): string {
  if (value === null || value === undefined || value === '') return '—';

  switch (descriptor._type) {
    case 'checkbox':
    case 'switch':
      return value ? '✓ Yes' : '✗ No';

    case 'password':
      return '••••••••';

    case 'select':
    case 'radio': {
      const opt = descriptor._options?.find(o => o.value === value);
      return opt ? opt.label : String(value);
    }

    case 'number':
      return String(value);

    case 'date':
      if (typeof value === 'string' && value) {
        try { return new Date(value).toLocaleDateString(); } catch { /* ignore */ }
      }
      return String(value);

    default:
      return String(value);
  }
}

// ─── useReadonlyForm ─────────────────────────────────────────────────────────

/**
 * `useReadonlyForm` — display form data without inputs.
 * Same schema, same field components, but renders values as text.
 *
 * Two modes:
 * - `'readonly'` — clean display, no editing
 * - `'diff'`     — highlights what changed vs `originalValues`
 *
 * @example
 * // Readonly display
 * const { ReadonlyFields } = useReadonlyForm(schema, {
 *   mode:   'readonly',
 *   values: user,
 * });
 *
 * <ReadonlyFields.name />
 * <ReadonlyFields.email />
 *
 * @example
 * // Diff — what changed before saving?
 * const { ReadonlyFields, changedFields, hasChanges } = useReadonlyForm(schema, {
 *   mode:           'diff',
 *   values:         pendingChanges,
 *   originalValues: savedUser,
 * });
 *
 * {hasChanges && <Banner>{changedFields.length} fields changed</Banner>}
 * <ReadonlyFields.name />    // shown with strikethrough + new value if changed
 * <ReadonlyFields.email />
 */
export function useReadonlyForm<S extends FormSchema>(
  schema:  S,
  options: UseReadonlyFormOptions<S>,
): UseReadonlyFormReturn<S> {
  const { mode, values, originalValues = {}, formatters = {} } = options;

  // ── Build descriptors ────────────────────────────────────────────────────
  const descriptors = useMemo<Record<string, FieldDescriptor<unknown>>>(() => {
    const result: Record<string, FieldDescriptor<unknown>> = {};
    for (const [key, val] of Object.entries(schema)) {
      // Support both raw descriptors and builders
      result[key] = typeof (val as any)._build === 'function'
        ? (val as any)._build()
        : val;
    }
    return result;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Compute field states ─────────────────────────────────────────────────
  const { fields, fieldNames, changedFields } = useMemo(() => {
    const fields: Record<string, FieldReadonlyState> = {};
    const fieldNames: string[] = [];
    const changedFields: string[] = [];

    for (const [name, descriptor] of Object.entries(descriptors)) {
      if (descriptor._hidden) continue;

      fieldNames.push(name);

      const value   = (values as Record<string, unknown>)[name];
      const custom  = (formatters as Record<string, (v: unknown) => string>)[name];
      const display = custom ? custom(value) : formatValue(value, descriptor);

      const origValue = (originalValues as Record<string, unknown>)[name];
      const changed   = mode === 'diff' && origValue !== undefined && origValue !== value;
      const origDisplay = changed && origValue !== undefined
        ? (custom ? custom(origValue) : formatValue(origValue, descriptor))
        : undefined;

      if (changed) changedFields.push(name);

      fields[name] = {
        name,
        label:          descriptor._label,
        value,
        display,
        changed,
        original:       changed ? origValue : undefined,
        originalDisplay: origDisplay,
      };
    }

    return {
      fields:       fields as Record<keyof S, FieldReadonlyState>,
      fieldNames:   fieldNames as Array<keyof S>,
      changedFields: changedFields as Array<keyof S>,
    };
  }, [descriptors, values, originalValues, mode, formatters]);

  // ── Build ReadonlyFields components ─────────────────────────────────────
  const ReadonlyFields = useMemo((): ReadonlyFieldsComponent<S> => {
    const result: Record<string, (props?: ReadonlyFieldProps) => JSX.Element | null> = {};

    for (const name of fieldNames as string[]) {
      result[name] = (props?: ReadonlyFieldProps) => {
        const state    = fields[name as keyof S];
        const label    = props?.label   ?? state.label;
        const display  = props?.format  ? props.format(state.value) : state.display;
        const showDiff = props?.showDiff ?? (mode === 'diff');

        if (typeof document !== 'undefined') {
          // Web renderer
          const { WebReadonlyField } = require('../components/web/WebReadonlyField');
          return WebReadonlyField({ state: { ...state, label, display }, showDiff, props });
        }

        // Native renderer
        const { NativeReadonlyField } = require('../components/native/NativeReadonlyField');
        return NativeReadonlyField({ state: { ...state, label, display }, showDiff, props });
      };
    }

    return result as ReadonlyFieldsComponent<S>;
  }, [fieldNames, fields, mode]);

  return {
    fields,
    fieldNames,
    changedFields,
    hasChanges: changedFields.length > 0,
    ReadonlyFields,
  };
}
