import React, { useMemo } from 'react';

import type { FieldDescriptor, FormSchema, SchemaValues } from '../../types';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ReadonlyMode = 'readonly' | 'diff';

export interface UseReadonlyFormOptions<S extends FormSchema> {
  /**
   * Display mode.
   * - `readonly`: plain readonly rendering
   * - `diff`: highlights changed values compared to `originalValues`
   */
  mode: ReadonlyMode;

  /**
   * Current values to display.
   */
  values: SchemaValues<S>;

  /**
   * Original values used in `diff` mode to determine which fields changed.
   */
  originalValues?: Partial<SchemaValues<S>>;

  /**
   * Per-field custom formatter.
   */
  formatters?: Partial<Record<keyof S, (value: unknown) => string>>;
}

export interface FieldReadonlyState {
  name: string;
  label: string;
  value: unknown;
  display: string;
  changed: boolean;
  original?: unknown;
  originalDisplay?: string;
}

export interface UseReadonlyFormReturn<S extends FormSchema> {
  /**
   * Computed readonly state for every visible field.
   */
  fields: Record<keyof S, FieldReadonlyState>;

  /**
   * Ordered list of visible field names.
   */
  fieldNames: Array<keyof S>;

  /**
   * In diff mode, list of changed field names.
   */
  changedFields: Array<keyof S>;

  /**
   * Whether at least one field changed.
   */
  hasChanges: boolean;

  /**
   * Readonly render components, one per field.
   */
  ReadonlyFields: ReadonlyFieldsComponent<S>;
}

export type ReadonlyFieldsComponent<S extends FormSchema> = {
  [K in keyof S]: (props?: ReadonlyFieldProps) => React.ReactElement | null;
};

export interface ReadonlyFieldProps {
  /**
   * Optional label override.
   */
  label?: string;

  /**
   * Optional display formatter override for this render only.
   */
  format?: (value: unknown) => string;

  /**
   * Optional cross-platform style prop forwarded to the renderer.
   */
  style?: object;

  /**
   * Optional className for web renderers.
   */
  className?: string;

  /**
   * Forces diff UI even when mode is `readonly`.
   */
  showDiff?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

type BuilderLike<T> = {
  _build: () => FieldDescriptor<T>;
};

function isFieldBuilder(value: unknown): value is BuilderLike<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    '_build' in value &&
    typeof (value as BuilderLike<unknown>)._build === 'function'
  );
}

function normalizeDescriptors<S extends FormSchema>(
  schema: S,
): Record<string, FieldDescriptor<unknown>> {
  const result: Record<string, FieldDescriptor<unknown>> = {};

  for (const [key, value] of Object.entries(schema)) {
    result[key] = isFieldBuilder(value)
      ? value._build()
      : (value as FieldDescriptor<unknown>);
  }

  return result;
}

function areValuesDifferent(left: unknown, right: unknown): boolean {
  return !Object.is(left, right);
}

function formatValue(value: unknown, descriptor: FieldDescriptor<unknown>): string {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  switch (descriptor._type) {
    case 'checkbox':
    case 'switch':
      return value ? '✓ Yes' : '✗ No';

    case 'password':
      return '••••••••';

    case 'select':
    case 'radio': {
      const option = descriptor._options?.find((item) => item.value === value);
      return option ? option.label : String(value);
    }

    case 'number':
      return String(value);

    case 'date': {
      if (typeof value === 'string' || value instanceof Date) {
        const parsedDate = new Date(value);
        if (!Number.isNaN(parsedDate.getTime())) {
          return parsedDate.toLocaleDateString();
        }
      }

      return String(value);
    }

    default:
      return String(value);
  }
}

// ─── useReadonlyFormBridge ────────────────────────────────────────────────────

export function useReadonlyFormBridge<S extends FormSchema>(
  schema: S,
  options: UseReadonlyFormOptions<S>,
): UseReadonlyFormReturn<S> {
  const { mode, values, originalValues = {}, formatters = {} } = options;

  const descriptors = useMemo<Record<string, FieldDescriptor<unknown>>>(() => {
    return normalizeDescriptors(schema);
  }, [schema]);

  const { fields, fieldNames, changedFields } = useMemo(() => {
    const nextFields: Record<string, FieldReadonlyState> = {};
    const nextFieldNames: string[] = [];
    const nextChangedFields: string[] = [];

    for (const [name, descriptor] of Object.entries(descriptors)) {
      if (descriptor._hidden) {
        continue;
      }

      nextFieldNames.push(name);

      const value = (values as Record<string, unknown>)[name];
      const originalValue = (originalValues as Record<string, unknown>)[name];
      const formatter = (
        formatters as Record<string, ((value: unknown) => string) | undefined>
      )[name];

      const display = formatter ? formatter(value) : formatValue(value, descriptor);
      const changed =
        mode === 'diff' &&
        originalValue !== undefined &&
        areValuesDifferent(originalValue, value);

      const originalDisplay =
        changed && originalValue !== undefined
          ? formatter
            ? formatter(originalValue)
            : formatValue(originalValue, descriptor)
          : undefined;

      if (changed) {
        nextChangedFields.push(name);
      }

      nextFields[name] = {
        name,
        label: descriptor._label ?? '',
        value,
        display,
        changed,
        original: changed ? originalValue : undefined,
        originalDisplay,
      };
    }

    return {
      fields: nextFields as Record<keyof S, FieldReadonlyState>,
      fieldNames: nextFieldNames as Array<keyof S>,
      changedFields: nextChangedFields as Array<keyof S>,
    };
  }, [descriptors, values, originalValues, mode, formatters]);

  const ReadonlyFields = useMemo((): ReadonlyFieldsComponent<S> => {
    const result: Record<
      string,
      (props?: ReadonlyFieldProps) => React.ReactElement | null
    > = {};

    for (const name of fieldNames as string[]) {
      result[name] = (props?: ReadonlyFieldProps) => {
        const state = fields[name as keyof S];
        const label = props?.label ?? state.label;
        const display = props?.format ? props.format(state.value) : state.display;
        const showDiff = props?.showDiff ?? mode === 'diff';

        const nextState: FieldReadonlyState = {
          ...state,
          label,
          display,
        };

        const { ReadonlyField } = require('../../renderers/web/ReadonlyField');

        return React.createElement(ReadonlyField, {
          state: nextState,
          showDiff,
          props,
        });
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
