import { useState, useEffect, useMemo, useCallback } from 'react';
import { parseDynamicForm } from '../builders/dynamic';
import { useForm } from './useForm';
import type { JsonFormDefinition } from '../builders/dynamic';
import type { UseFormOptions, UseFormReturn, FormSchema } from '../types';

export interface UseDynamicFormOptions extends UseFormOptions {
  /** Prefill values after parsing */
  defaultValues?: Record<string, unknown>;
}

export interface UseDynamicFormReturn {
  /** Same as useForm return — fields, Form, state, etc. */
  form:         UseFormReturn<FormSchema> | null;
  /** Ordered field names to render */
  fieldOrder:   string[];
  /** Form metadata (title, submitLabel) */
  meta:         { id?: string; title?: string; submitLabel?: string };
  /** Whether any field should be visible given current values */
  isVisible:    (name: string) => boolean;
  /** Loading state (when fetching schema from API) */
  isLoading:    boolean;
  /** Error loading the schema */
  loadError:    string | null;
}

/**
 * `useDynamicForm` — parse a JSON form definition (inline or from an API)
 * and get back a fully working formura form.
 *
 * @example
 * // From an async API
 * const { form, fieldOrder, meta, isVisible } = useDynamicForm(
 *   () => fetch('/api/forms/contact').then(r => r.json())
 * );
 *
 * if (!form) return <Spinner />;
 *
 * return (
 *   <form.Form onSubmit={handleSubmit}>
 *     <h2>{meta.title}</h2>
 *     {fieldOrder.filter(isVisible).map(name => {
 *       const Field = form.fields[name];
 *       return Field ? <Field key={name} /> : null;
 *     })}
 *     <form.Form.Submit>{meta.submitLabel ?? 'Submit'}</form.Form.Submit>
 *   </form.Form>
 * );
 *
 * @example
 * // Inline definition
 * const { form, fieldOrder, isVisible } = useDynamicForm({
 *   fields: [
 *     { name: 'name',  type: 'text',  label: 'Name',  required: true },
 *     { name: 'email', type: 'email', label: 'Email', required: true },
 *     { name: 'vip',   type: 'switch', label: 'VIP customer' },
 *     { name: 'code',  type: 'text',  label: 'VIP code',
 *       showWhen: { field: 'vip', value: true } },
 *   ],
 * });
 */
export function useDynamicForm(
  source:  JsonFormDefinition | (() => Promise<JsonFormDefinition>),
  options: UseDynamicFormOptions = {},
): UseDynamicFormReturn {
  const [definition, setDefinition] = useState<JsonFormDefinition | null>(
    typeof source === 'object' ? source : null,
  );
  const [isLoading, setIsLoading] = useState(typeof source === 'function');
  const [loadError, setLoadError] = useState<string | null>(null);

  // ── Fetch definition if source is a function ──────────────────────────────
  useEffect(() => {
    if (typeof source !== 'function') return;
    let cancelled = false;

    setIsLoading(true);
    setLoadError(null);

    (source as () => Promise<JsonFormDefinition>)()
      .then(def => {
        if (!cancelled) { setDefinition(def); setIsLoading(false); }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : 'Failed to load form definition.');
          setIsLoading(false);
        }
      });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Parse definition ──────────────────────────────────────────────────────
  const parsed = useMemo(() => {
    if (!definition) return null;
    return parseDynamicForm(definition);
  }, [definition]);

  // ── Build inner form ──────────────────────────────────────────────────────
  // We build a stable schema reference — re-parse only when definition changes
  const form = useMemo(() => {
    if (!parsed) return null;

    // Merge defaultValues from options
    const schema = { ...parsed.schema };
    if (options.defaultValues) {
      for (const [key, val] of Object.entries(options.defaultValues)) {
        if (schema[key]) {
          schema[key] = { ...schema[key], _defaultValue: val };
        }
      }
    }

    return schema;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsed]);

  // We use a stable hook call — when form is null, we skip
  const innerForm = form
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useForm(form as FormSchema, options)
    : null;

  // ── isVisible — evaluates showWhen conditions ─────────────────────────────
  const isVisible = useCallback((name: string): boolean => {
    if (!parsed || !innerForm) return true;
    const condition = parsed.conditions[name];
    if (!condition) return true;

    const watchedValue = innerForm.getValue(condition.field as keyof FormSchema);

    if ('value' in condition) {
      return watchedValue === condition.value;
    }
    if ('notValue' in condition) {
      return watchedValue !== condition.notValue;
    }
    return true;
  }, [parsed, innerForm]);

  return {
    form:       innerForm,
    fieldOrder: parsed?.fieldOrder ?? [],
    meta:       parsed?.meta ?? {},
    isVisible,
    isLoading,
    loadError,
  };
}
