/**
 * formura — useForm v1.3
 * ──────────────────────────
 * Adds to the existing useForm:
 *   1. Draft persistence  (persist option)
 *   2. Reactive conditions (visibleWhen / requiredWhen / disabledWhen)
 *
 * This file shows the ADDITIONS to the existing useForm.ts.
 * The full hook is shown here; integrate it by replacing useForm.ts in formura.
 */

import React, {
  useRef, useState, useCallback, useMemo, useEffect, type JSX,
} from 'react';
import { validateField, validateAll, extractDefaults } from '../validators/engine';
import { isWeb } from '../utils/platform';
import { FieldBuilder } from '../builders/field';
import {
  evaluateAllConditions,
  ConditionMixin,
} from '../conditions/conditions';
import type { VisibilityMap, FieldConditions } from '../conditions/conditions';
import { usePersist } from '../persist/draft';
import type { PersistOptions } from '../persist/draft';
import type {
  FormSchema, UseFormOptions, UseFormReturn, SchemaValues,
  FormState, FieldDescriptor,
} from '../types';

// ─── Extended options ─────────────────────────────────────────────────────────

export interface UseFormOptionsV13<T extends FormSchema> extends UseFormOptions {
  /**
   * Enable automatic draft persistence.
   * The form values are saved to storage on every change and restored on mount.
   *
   * @example
   * useForm(schema, {
   *   persist: {
   *     key:     'signup-form',
   *     storage: 'local',          // 'local' | 'session' | 'async' | CustomAdapter
   *     ttl:     3600,             // seconds before draft expires (0 = no expiry)
   *     exclude: ['password', 'confirm', 'cvv'],  // never persisted
   *     debounce: 800,             // ms before writing to storage
   *     version: '2',             // bump to invalidate old drafts
   *   }
   * })
   */
  persist?: PersistOptions;
}

// ─── Extended return ──────────────────────────────────────────────────────────

export interface UseFormReturnV13<T extends FormSchema> extends UseFormReturn<T> {
  /**
   * Current visibility / required / disabled state per field.
   * Updated reactively whenever values change.
   */
  visibility: VisibilityMap;

  /**
   * True while loading a saved draft from storage (async).
   * Show a loading indicator during this phase on React Native.
   */
  isLoadingDraft: boolean;

  /**
   * True if a draft was found and restored on mount.
   */
  hasDraft: boolean;

  /**
   * Call this after successful submission to delete the saved draft.
   */
  clearDraft: () => Promise<void>;

  /**
   * Force-save the current form values immediately (bypasses debounce).
   * Useful in wizard forms before navigating to the next step.
   */
  saveDraftNow: () => Promise<void>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeInitialState<S extends FormSchema>(
  descriptors: Record<string, FieldDescriptor<unknown>>,
  values: Record<string, unknown>,
): FormState<S> {
  return {
    values:       values as SchemaValues<S>,
    errors:       {},
    touched:      {},
    dirty:        {},
    status:       'idle',
    isValid:      true,
    isDirty:      false,
    isSubmitting: false,
    isSuccess:    false,
    isError:      false,
    submitCount:  0,
    submitError:  null,
  };
}

function shouldValidate(
  mode: string, event: 'onChange' | 'onBlur',
  isTouched: boolean, submitted: boolean, revalidate: string,
): boolean {
  const m = submitted ? revalidate : mode;
  if (m === 'onChange' && event === 'onChange') return true;
  if (m === 'onBlur'   && event === 'onBlur')   return true;
  if (m === 'onTouched' && isTouched)            return true;
  return false;
}

// ─── useForm v1.3 ─────────────────────────────────────────────────────────────

export function useFormV13<S extends FormSchema>(
  schema:  S,
  options: UseFormOptionsV13<S> = {},
): UseFormReturnV13<S> {
  const {
    validateOn    = 'onBlur',
    revalidateOn  = 'onChange',
    resolver,
    persist: persistOpts,
  } = options;

  // ── Build descriptors and extract conditions ──────────────────────────────
  const { descriptors, conditionsMap } = useMemo(() => {
    const desc:  Record<string, FieldDescriptor<unknown>> = {};
    const conds: Record<string, FieldConditions>          = {};

    for (const [key, val] of Object.entries(schema)) {
      const built = val instanceof FieldBuilder
        ? (val as FieldBuilder<unknown>)._build()
        : val;

      desc[key] = built;

      // Extract conditions from the mixin if present
      if ((val as any)._conditions) {
        conds[key] = (val as any)._conditions;
      }
    }

    return { descriptors: desc, conditionsMap: conds };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const defaultValues = useMemo(() => extractDefaults(descriptors), [descriptors]);

  // ── Core state ─────────────────────────────────────────────────────────────
  const stateRef    = useRef<FormState<S>>(makeInitialState<S>(descriptors, { ...defaultValues }));
  const submitFnRef = useRef<((values: SchemaValues<S>) => void | Promise<void>) | null>(null);

  const [, forceUpdate]    = useState(0);
  const rerender = useCallback(() => forceUpdate(n => n + 1), []);

  // ── Visibility state (reactive) ────────────────────────────────────────────
  const [visibility, setVisibility] = useState<VisibilityMap>(() =>
    evaluateAllConditions(conditionsMap, stateRef.current.values as Record<string, unknown>)
  );

  // ── Previous visibility ref (to detect changes) ───────────────────────────
  const prevVisibilityRef = useRef<VisibilityMap>(visibility);

  // ── Persist ────────────────────────────────────────────────────────────────
  const {
    isLoading: isLoadingDraft,
    hasDraft,
    draftValues,
    clearDraft,
    saveDraftNow,
    save: persistSave,
  } = usePersist(persistOpts, () => stateRef.current.values as Record<string, unknown>);

  // Restore draft values once loaded
  useEffect(() => {
    if (draftValues) {
      stateRef.current = makeInitialState<S>(descriptors, {
        ...defaultValues,
        ...draftValues,
      });
      rerender();
    }
  }, [draftValues]); // eslint-disable-line

  // ── Update visibility whenever values change ──────────────────────────────

  const updateVisibility = useCallback((newValues: Record<string, unknown>) => {
    if (Object.keys(conditionsMap).length === 0) return;

    const newVis = evaluateAllConditions(conditionsMap, newValues);
    setVisibility(newVis);

    // Handle onHide behavior — reset/clear values of newly hidden fields
    const prev   = prevVisibilityRef.current;
    let   changed = false;
    const updatedValues = { ...newValues };

    for (const [fieldName, vis] of Object.entries(newVis)) {
      const wasVisible = prev[fieldName]?.visible ?? true;
      const nowVisible = vis.visible;

      if (wasVisible && !nowVisible) {
        // Field just became hidden
        const onHide = conditionsMap[fieldName]?.onHide ?? 'reset';
        if (onHide === 'reset') {
          updatedValues[fieldName] = defaultValues[fieldName];
          changed = true;
        } else if (onHide === 'clear') {
          const desc = descriptors[fieldName];
          updatedValues[fieldName] = typeof desc._defaultValue === 'string' ? '' : null;
          changed = true;
        }
        // 'keep' → do nothing
      }
    }

    prevVisibilityRef.current = newVis;

    if (changed) {
      stateRef.current = {
        ...stateRef.current,
        values: updatedValues as SchemaValues<S>,
      };
    }
  }, [conditionsMap, defaultValues, descriptors]);

  // ── Field validation ──────────────────────────────────────────────────────

  const runFieldValidation = useCallback(async (
    name: string, value: unknown,
  ): Promise<string | null> => {
    // If field is hidden → no validation
    const vis = evaluateAllConditions(conditionsMap, stateRef.current.values as Record<string, unknown>);
    if (vis[name] && !vis[name].visible) return null;

    if (resolver) {
      const result = await resolver({
        ...(stateRef.current.values as Record<string, unknown>),
        [name]: value,
      });
      return result.errors[name] ?? null;
    }

    const desc = { ...descriptors[name] };

    // Apply reactive required condition
    if (conditionsMap[name]?.required?.length > 0) {
      const isRequired = conditionsMap[name].required.every(c => {
        const { evaluateCondition } = require('../conditions/conditions');
        return evaluateCondition(c, stateRef.current.values as Record<string, unknown>);
      });
      if (isRequired) desc._required = true;
    }

    return validateField(desc, value, stateRef.current.values as Record<string, unknown>);
  }, [descriptors, conditionsMap, resolver]);

  const runAllValidation = useCallback(async (): Promise<Record<string, string>> => {
    const values = stateRef.current.values as Record<string, unknown>;
    const vis    = evaluateAllConditions(conditionsMap, values);
    const errors: Record<string, string> = {};

    if (resolver) {
      const result = await resolver(values);
      // Only return errors for visible fields
      for (const [k, msg] of Object.entries(result.errors)) {
        if (vis[k] === undefined || vis[k].visible) {
          errors[k] = msg as string;
        }
      }
      return errors;
    }

    for (const [name, descriptor] of Object.entries(descriptors)) {
      // Skip hidden fields
      if (vis[name] && !vis[name].visible) continue;

      const desc = { ...descriptor };

      // Apply reactive required
      if (conditionsMap[name]?.required?.length > 0) {
        const { evaluateCondition } = require('../conditions/conditions');
        const isRequired = conditionsMap[name].required.every(
          (c: any) => evaluateCondition(c, values)
        );
        if (isRequired) desc._required = true;
      }

      const err = await validateField(desc, values[name], values);
      if (err) errors[name] = err;
    }

    return errors;
  }, [descriptors, conditionsMap, resolver]);

  // ── Handle field change ───────────────────────────────────────────────────

  const handleChange = useCallback(async (name: string, rawValue: unknown) => {
    const descriptor = descriptors[name];
    let value = rawValue;
    if (descriptor._trim && typeof value === 'string') value = value.trim();
    if (descriptor._transform) value = (descriptor._transform as (v: unknown) => unknown)(value);

    const newValues   = { ...(stateRef.current.values as Record<string, unknown>), [name]: value };
    const isDirtyField = value !== defaultValues[name];

    stateRef.current = {
      ...stateRef.current,
      values:  newValues as SchemaValues<S>,
      dirty:   { ...stateRef.current.dirty, [name]: isDirtyField },
      isDirty: isDirtyField || Object.values({ ...stateRef.current.dirty, [name]: isDirtyField }).some(Boolean),
    };

    // Update visibility based on new values
    updateVisibility(newValues);

    // Persist
    persistSave(newValues);

    const isTouched = Boolean(stateRef.current.touched[name as keyof S]);
    const submitted  = stateRef.current.submitCount > 0;

    if (shouldValidate(validateOn, 'onChange', isTouched, submitted, revalidateOn)) {
      const err = await runFieldValidation(name, value);
      const errors = {
        ...(stateRef.current.errors as Record<string, string | undefined>),
        [name]: err ?? undefined,
      };
      if (!err) delete errors[name];
      stateRef.current = {
        ...stateRef.current,
        errors:  errors as FormState<S>['errors'],
        isValid: Object.keys(errors).length === 0,
      };
    }

    rerender();
  }, [descriptors, defaultValues, validateOn, revalidateOn, runFieldValidation, updateVisibility, persistSave, rerender]);

  // ── Handle blur ───────────────────────────────────────────────────────────

  const handleBlur = useCallback(async (name: string) => {
    stateRef.current = {
      ...stateRef.current,
      touched: { ...stateRef.current.touched, [name]: true },
    };

    const submitted = stateRef.current.submitCount > 0;
    if (shouldValidate(validateOn, 'onBlur', true, submitted, revalidateOn)) {
      const value = (stateRef.current.values as Record<string, unknown>)[name];
      const err   = await runFieldValidation(name, value);
      const errors = {
        ...(stateRef.current.errors as Record<string, string | undefined>),
        [name]: err ?? undefined,
      };
      if (!err) delete errors[name];
      stateRef.current = {
        ...stateRef.current,
        errors:  errors as FormState<S>['errors'],
        isValid: Object.keys(errors).length === 0,
      };
    }
    rerender();
  }, [validateOn, revalidateOn, runFieldValidation, rerender]);

  // ── handleSubmit ──────────────────────────────────────────────────────────

  const handleSubmit = useCallback(async (
    onSubmit: (values: SchemaValues<S>) => void | Promise<void>,
    onError?: (errors: Partial<Record<keyof S, string>>) => void,
    onSubmitError?: (error: unknown) => string,
  ) => {
    stateRef.current = {
      ...stateRef.current,
      status:       'validating',
      isSubmitting: false,
      isSuccess:    false,
      isError:      false,
      submitError:  null,
      submitCount:  stateRef.current.submitCount + 1,
    };
    rerender();

    const rawErrors = await runAllValidation();
    const allTouched = Object.fromEntries(
      Object.keys(descriptors)
        .filter(k => {
          const v = visibility[k];
          return !v || v.visible;
        })
        .map(k => [k, true])
    );

    stateRef.current = {
      ...stateRef.current,
      errors:  rawErrors as FormState<S>['errors'],
      touched: { ...stateRef.current.touched, ...allTouched },
      isValid: Object.keys(rawErrors).length === 0,
    };

    if (Object.keys(rawErrors).length > 0) {
      stateRef.current = { ...stateRef.current, status: 'idle' };
      rerender();
      onError?.(rawErrors as Partial<Record<keyof S, string>>);
      return;
    }

    stateRef.current = { ...stateRef.current, status: 'submitting', isSubmitting: true };
    rerender();

    // Build submitted values — exclude hidden fields
    const submittedValues: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(stateRef.current.values as Record<string, unknown>)) {
      const vis = visibility[k];
      if (!vis || vis.visible) submittedValues[k] = v;
    }

    try {
      await onSubmit(submittedValues as SchemaValues<S>);
      stateRef.current = {
        ...stateRef.current,
        status:       'success',
        isSubmitting: false,
        isSuccess:    true,
        isError:      false,
      };
    } catch (err) {
      const msg = onSubmitError ? onSubmitError(err) : 'An error occurred. Please try again.';
      stateRef.current = {
        ...stateRef.current,
        status:       'error',
        isSubmitting: false,
        isSuccess:    false,
        isError:      true,
        submitError:  msg,
      };
    }
    rerender();
  }, [descriptors, runAllValidation, visibility, rerender]);

  // ── Public methods ────────────────────────────────────────────────────────

  const setValue = useCallback(<K extends keyof S>(name: K, value: SchemaValues<S>[K]) => {
    handleChange(name as string, value);
  }, [handleChange]);

  const getValue  = useCallback(<K extends keyof S>(name: K): SchemaValues<S>[K] =>
    (stateRef.current.values as Record<string, unknown>)[name as string] as SchemaValues<S>[K], []);

  const getValues = useCallback((): SchemaValues<S> => ({ ...stateRef.current.values }), []);

  const validate = useCallback(async (names?: keyof S | Array<keyof S>): Promise<boolean> => {
    let errors: Record<string, string>;
    if (!names) {
      errors = await runAllValidation();
    } else {
      const list = (Array.isArray(names) ? names : [names]) as string[];
      errors = { ...(stateRef.current.errors as Record<string, string>) };
      for (const n of list) {
        const err = await runFieldValidation(n, (stateRef.current.values as Record<string, unknown>)[n]);
        if (err) errors[n] = err; else delete errors[n];
      }
    }
    stateRef.current = {
      ...stateRef.current,
      errors:  errors as FormState<S>['errors'],
      isValid: Object.keys(errors).length === 0,
    };
    rerender();
    return Object.keys(errors).length === 0;
  }, [runAllValidation, runFieldValidation, rerender]);

  const reset = useCallback((values?: Partial<SchemaValues<S>>) => {
    const newValues = values ? { ...defaultValues, ...values } : { ...defaultValues };
    stateRef.current = makeInitialState<S>(descriptors, newValues);
    updateVisibility(newValues as Record<string, unknown>);
    rerender();
  }, [defaultValues, descriptors, updateVisibility, rerender]);

  const setError = useCallback((name: keyof S, message: string) => {
    stateRef.current = {
      ...stateRef.current,
      errors:  { ...stateRef.current.errors, [name]: message },
      isValid: false,
    };
    rerender();
  }, [rerender]);

  const clearErrors = useCallback((name?: keyof S | Array<keyof S>) => {
    if (!name) {
      stateRef.current = { ...stateRef.current, errors: {}, isValid: true };
    } else {
      const errors = { ...(stateRef.current.errors as object) } as FormState<S>['errors'];
      (Array.isArray(name) ? name : [name]).forEach(n => delete errors[n]);
      stateRef.current = {
        ...stateRef.current, errors,
        isValid: Object.keys(errors).length === 0,
      };
    }
    rerender();
  }, [rerender]);

  const watch    = useCallback((name: string) =>
    (stateRef.current.values as Record<string, unknown>)[name], []);
  const watchAll = useCallback(() => ({ ...stateRef.current.values }), []);
  const submit   = useCallback(async () => {
    if (submitFnRef.current) await handleSubmit(submitFnRef.current);
  }, [handleSubmit]);

  // ── Build Form component ──────────────────────────────────────────────────

  const Form = useMemo(() => {
    const FormInner = ({
      children, onSubmit, onError, onSubmitError, className, style,
    }: any) => {
      submitFnRef.current = onSubmit;
      const onPress = (e?: React.FormEvent) => {
        e?.preventDefault();
        handleSubmit(onSubmit, onError, onSubmitError);
      };
      if (isWeb) {
        return React.createElement('form', { onSubmit: onPress, className, style, noValidate: true }, children);
      }
      const { View } = require('react-native');
      return React.createElement(View, { style }, children);
    };

    const Submit = ({ children, className, style, loadingText, disabled: extraDisabled }: any) => {
      const { status } = stateRef.current;
      const loading    = status === 'submitting' || status === 'validating';
      const text       = loading ? (loadingText ?? 'Please wait…') : (children ?? 'Submit');
      if (isWeb) {
        return React.createElement('button', {
          type: 'submit', className, style, disabled: loading || extraDisabled,
        }, text);
      }
      const { TouchableOpacity, Text, ActivityIndicator, View } = require('react-native');
      return React.createElement(
        TouchableOpacity,
        { onPress: submit, disabled: loading || extraDisabled, style },
        React.createElement(View, { style: { flexDirection: 'row', alignItems: 'center', gap: 8 } },
          loading && React.createElement(ActivityIndicator, { size: 'small', color: '#fff' }),
          React.createElement(Text, null, text),
        ),
      );
    };

    (FormInner as any).Submit = Submit;
    return FormInner as any;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleSubmit, submit]);

  // ── Build field components ────────────────────────────────────────────────

  const fields = useMemo(() => {
    const result: Record<string, (extra?: any) => JSX.Element> = {};

    for (const [name, descriptor] of Object.entries(descriptors)) {
      result[name] = (extra?: any): JSX.Element => {
        const state  = stateRef.current;
        const vis    = visibility[name] ?? { visible: true, required: false, disabled: false };

        // Field is hidden → return null
        if (!vis.visible) return React.createElement(React.Fragment, null);

        const value     = (state.values as Record<string, unknown>)[name];
        const error     = (state.errors as Record<string, string | undefined>)[name] ?? null;
        const touched   = Boolean((state.touched as Record<string, boolean>)[name]);
        const showError = error && (touched || state.submitCount > 0);

        const desc = {
          ...descriptor,
          // Apply reactive required
          _required: descriptor._required || vis.required,
          // Apply reactive disabled
          _disabled: descriptor._disabled || vis.disabled,
          ...(extra && {
            _label:       extra.label       ?? descriptor._label,
            _placeholder: extra.placeholder ?? descriptor._placeholder,
            _hint:        extra.hint        ?? descriptor._hint,
          }),
        };

        const renderProps = {
          name,
          value,
          label:      desc._label,
          placeholder:desc._placeholder,
          error:      showError ? error : null,
          touched,
          dirty:      Boolean((state.dirty as Record<string, boolean>)[name]),
          validating: state.status === 'validating',
          disabled:   desc._disabled,
          hint:       desc._hint,
          options:    desc._options,
          otpLength:  desc._otpLength,
          onChange:   (v: unknown) => handleChange(name, v),
          onBlur:     () => handleBlur(name),
          onFocus:    () => {},
        };

        if (desc._customRender) {
          return desc._customRender(renderProps) as JSX.Element;
        }

        if (isWeb) {
          const { WebField } = require('../components/web/WebField');
          return React.createElement(WebField, { descriptor: desc, ...renderProps, extra });
        }
        const { NativeField } = require('../components/native/NativeField');
        return React.createElement(NativeField, { descriptor: desc, ...renderProps, extra });
      };
    }

    return result as any;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [descriptors, visibility, handleChange, handleBlur]);

  return {
    Form,
    fields,
    state: stateRef.current,
    visibility,
    isLoadingDraft,
    hasDraft,
    clearDraft,
    saveDraftNow,
    setValue,
    getValue,
    getValues,
    validate,
    reset,
    setError,
    clearErrors,
    watch: watch as any,
    watchAll,
    submit,
  } as UseFormReturnV13<S>;
}

// Re-export as useForm for drop-in replacement
export { useFormV13 as useForm };
