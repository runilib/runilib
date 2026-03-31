import { useCallback, useEffect, useMemo, useState } from 'react';

import { parseDynamicForm } from '../../core/field-builders/dynamic/dynamic';
import type { JsonFormDefinition } from '../../core/field-builders/dynamic/types';
import type { FormSchema, UseFormBridgeReturn, UseFormOptions } from '../../types';
import { useFormBridge } from '../useFormBridge.web';

export interface UseDynamicFormOptions<S extends FormSchema> extends UseFormOptions<S> {
  /**
   * Default values injected after parsing the dynamic schema.
   */
  defaultValues?: Record<string, unknown>;
}

export interface UseDynamicFormReturn {
  /**
   * Fully initialized form bridge instance.
   * Returns `null` while the dynamic definition is still unavailable.
   */
  form: UseFormBridgeReturn<FormSchema> | null;

  /**
   * Ordered list of field names as declared by the dynamic form parser.
   */
  fieldOrder: string[];

  /**
   * Form metadata extracted from the JSON definition.
   */
  meta: {
    id?: string;
    title?: string;
    submitLabel?: string;
  };

  /**
   * Returns whether a field should currently be visible according to its
   * dynamic visibility conditions.
   */
  isVisible: (name: string) => boolean;

  /**
   * Loading state when the form definition is fetched asynchronously.
   */
  isLoading: boolean;

  /**
   * Error message if the dynamic definition could not be loaded.
   */
  loadError: string | null;
}

const EMPTY_SCHEMA: FormSchema = {};

/**
 * `useDynamicFormBridge`
 * Parses a JSON definition (inline or async) and returns a ready-to-use
 * `useFormBridge` instance with metadata and dynamic visibility helpers.
 */
export function useDynamicFormBridge<S extends FormSchema>(
  source: JsonFormDefinition | (() => Promise<JsonFormDefinition>),
  options: UseDynamicFormOptions<S> = {},
): UseDynamicFormReturn {
  const [definition, setDefinition] = useState<JsonFormDefinition | null>(
    typeof source === 'function' ? null : source,
  );
  const [isLoading, setIsLoading] = useState<boolean>(typeof source === 'function');
  const [loadError, setLoadError] = useState<string | null>(null);

  const { defaultValues, ...formOptions } = options;

  // ── Sync / fetch definition ────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    if (typeof source !== 'function') {
      setDefinition(source);
      setLoadError(null);
      setIsLoading(false);
      return () => {
        cancelled = true;
      };
    }

    setIsLoading(true);
    setLoadError(null);

    source()
      .then((nextDefinition) => {
        if (cancelled) {
          return;
        }

        setDefinition(nextDefinition);
        setIsLoading(false);
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }

        setLoadError(
          error instanceof Error ? error.message : 'Failed to load form definition.',
        );
        setDefinition(null);
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [source]);

  // ── Parse dynamic definition ───────────────────────────────────────────────
  const parsed = useMemo(() => {
    if (!definition) {
      return null;
    }

    return parseDynamicForm(definition);
  }, [definition]);

  // ── Merge runtime default values into parsed schema ────────────────────────
  const resolvedSchema = useMemo<FormSchema>(() => {
    if (!parsed) {
      return EMPTY_SCHEMA;
    }

    if (!defaultValues) {
      return parsed.schema as FormSchema;
    }

    const nextSchema: FormSchema = { ...parsed.schema };

    for (const [fieldName, defaultValue] of Object.entries(defaultValues)) {
      if (!nextSchema[fieldName]) {
        continue;
      }

      nextSchema[fieldName] = {
        ...nextSchema[fieldName],
        _defaultValue: defaultValue,
      };
    }

    return nextSchema;
  }, [parsed, defaultValues]);

  // Always call the hook once to respect the Rules of Hooks.
  const bridge = useFormBridge(resolvedSchema, formOptions);

  // ── Visibility evaluation ──────────────────────────────────────────────────
  const isVisible = useCallback(
    (name: string): boolean => {
      if (!parsed) {
        return true;
      }

      const condition = parsed.conditions[name];
      if (!condition) {
        return true;
      }

      const watchedValue = bridge.getValue(condition.field);

      if ('value' in condition) {
        return watchedValue === condition.value;
      }

      if ('notValue' in condition) {
        return watchedValue !== condition.notValue;
      }

      return true;
    },
    [parsed, bridge],
  );

  return {
    form: parsed ? bridge : null,
    fieldOrder: parsed?.fieldOrder ?? [],
    meta: parsed?.meta ?? {},
    isVisible,
    isLoading,
    loadError,
  };
}
