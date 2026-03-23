import React, { useRef, useState, useCallback, useMemo, type JSX } from 'react';
import { validateField, validateAll, extractDefaults } from '../validators/engine';
import { isWeb } from '../utils/platform';
import { FieldBuilder } from '../builders/field';
import type {
  FormSchema, UseFormOptions, UseFormReturn, SchemaValues,
  FormState, FormStatus, FieldDescriptor, FieldComponents, FieldComponent,
  ExtraFieldProps, FormComponent, SubmitButtonProps, ValidationTrigger,
} from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
  trigger:    ValidationTrigger,
  event:      'onChange' | 'onBlur',
  isTouched:  boolean,
  submitted:  boolean,
  revalidate: ValidationTrigger,
): boolean {
  const mode = submitted ? revalidate : trigger;
  if (mode === 'onChange' && event === 'onChange') return true;
  if (mode === 'onBlur'   && event === 'onBlur')   return true;
  if (mode === 'onTouched' && isTouched)            return true;
  return false;
}

// ─── useForm ─────────────────────────────────────────────────────────────────

export function useFormura<S extends FormSchema>(
  schema: S,
  options: UseFormOptions = {},
): UseFormReturn<S> {
  const {
    validateOn    = 'onBlur',
    revalidateOn  = 'onChange',
    resolver,
  } = options;

  // Build descriptors once
  const descriptors = useMemo<Record<string, FieldDescriptor<unknown>>>(() => {
    const result: Record<string, FieldDescriptor<unknown>> = {};
    for (const [key, val] of Object.entries(schema)) {
      result[key] = val instanceof FieldBuilder ? (val as FieldBuilder<unknown>)._build() : val;
    }
    return result;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const defaultValues = useMemo(() => extractDefaults(descriptors), [descriptors]);

  // ── Mutable ref for state (avoids stale closures) ─────────────────────────
  const stateRef     = useRef<FormState<S>>(makeInitialState<S>(descriptors, { ...defaultValues }));
  const submitFnRef  = useRef<((values: SchemaValues<S>) => void | Promise<void>) | null>(null);
  const debounceRefs = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const [, forceUpdate] = useState(0);
  const rerender = useCallback(() => forceUpdate(n => n + 1), []);

  // ── Field validation ─────────────────────────────────────────────────────────

  const runFieldValidation = useCallback(async (name: string, value: unknown): Promise<string | null> => {
    if (resolver) {
      const result = await resolver({ ...stateRef.current.values as Record<string, unknown>, [name]: value });
      return result.errors[name] ?? null;
    }
    return validateField(descriptors[name], value, stateRef.current.values as Record<string, unknown>);
  }, [descriptors, resolver]);

  const runAllValidation = useCallback(async (): Promise<Record<string, string>> => {
    if (resolver) {
      const result = await resolver(stateRef.current.values as Record<string, unknown>);
      return result.errors;
    }
    return validateAll(descriptors, stateRef.current.values as Record<string, unknown>);
  }, [descriptors, resolver]);

  // ── Field value change handler ────────────────────────────────────────────

  const handleChange = useCallback(async (name: string, rawValue: unknown) => {
    const descriptor = descriptors[name];
    let value = rawValue;
    if (descriptor._trim && typeof value === 'string') value = value.trim();
    if (descriptor._transform) value = (descriptor._transform as (v: unknown) => unknown)(value);

    const isDirtyField = value !== defaultValues[name];

    stateRef.current = {
      ...stateRef.current,
      values:  { ...stateRef.current.values as object, [name]: value } as SchemaValues<S>,
      dirty:   { ...stateRef.current.dirty, [name]: isDirtyField },
      isDirty: isDirtyField || Object.values({ ...stateRef.current.dirty, [name]: isDirtyField }).some(Boolean),
    };

    const isTouched = Boolean(stateRef.current.touched[name as keyof S]);
    const submitted  = stateRef.current.submitCount > 0;

    if (shouldValidate(validateOn, 'onChange', isTouched, submitted, revalidateOn)) {
      // Debounce validation for async validators
      clearTimeout(debounceRefs.current[name]);
      stateRef.current = { ...stateRef.current, status: 'validating' };
      rerender();

      debounceRefs.current[name] = setTimeout(async () => {
        const err = await runFieldValidation(name, value);
        const errors = { ...stateRef.current.errors as object, [name]: err ?? undefined } as FormState<S>['errors'];
        if (!err) delete errors[name as keyof S];
        stateRef.current = {
          ...stateRef.current,
          errors,
          isValid: Object.keys(errors).length === 0,
          status:  'idle',
        };
        rerender();
      }, descriptor._debounce);
    } else {
      rerender();
    }
  }, [descriptors, defaultValues, validateOn, revalidateOn, runFieldValidation, rerender]);

  // ── Field blur handler ────────────────────────────────────────────────────

  const handleBlur = useCallback(async (name: string) => {
    stateRef.current = {
      ...stateRef.current,
      touched: { ...stateRef.current.touched, [name]: true },
    };

    const submitted = stateRef.current.submitCount > 0;
    if (shouldValidate(validateOn, 'onBlur', true, submitted, revalidateOn)) {
      clearTimeout(debounceRefs.current[name]);
      stateRef.current = { ...stateRef.current, status: 'validating' };
      rerender();

      const value = (stateRef.current.values as Record<string, unknown>)[name];
      const err   = await runFieldValidation(name, value);
      const errors = { ...stateRef.current.errors as object, [name]: err ?? undefined } as FormState<S>['errors'];
      if (!err) delete errors[name as keyof S];
      stateRef.current = { ...stateRef.current, errors, isValid: Object.keys(errors).length === 0, status: 'idle' };
    }
    rerender();
  }, [validateOn, revalidateOn, runFieldValidation, rerender]);

  // ── handleSubmit (called internally by Form) ─────────────────────────────

  const handleSubmit = useCallback(async (
    onSubmit:      (values: SchemaValues<S>) => void | Promise<void>,
    onError?:      (errors: Partial<Record<keyof S, string>>) => void,
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

    // Touch all fields
    const allTouched = Object.fromEntries(Object.keys(descriptors).map(k => [k, true]));
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

    try {
      await onSubmit({ ...stateRef.current.values });
      stateRef.current = { ...stateRef.current, status: 'success', isSubmitting: false, isSuccess: true, isError: false };
    } catch (err) {
      const msg = onSubmitError ? onSubmitError(err) : 'An error occurred. Please try again.';
      stateRef.current = { ...stateRef.current, status: 'error', isSubmitting: false, isSuccess: false, isError: true, submitError: msg };
    }
    rerender();
  }, [descriptors, runAllValidation, rerender]);

  // ── Public API ────────────────────────────────────────────────────────────

  const setValue = useCallback(<K extends keyof S>(name: K, value: SchemaValues<S>[K]) => {
    handleChange(name as string, value);
  }, [handleChange]);

  const getValue = useCallback(<K extends keyof S>(name: K): SchemaValues<S>[K] =>
    (stateRef.current.values as Record<string, unknown>)[name as string] as SchemaValues<S>[K]
  , []);

  const getValues = useCallback((): SchemaValues<S> => ({ ...stateRef.current.values }), []);

  const validate = useCallback(async (names?: keyof S | Array<keyof S>): Promise<boolean> => {
    let errors: Record<string, string>;
    if (!names) {
      errors = await runAllValidation();
    } else {
      const list = (Array.isArray(names) ? names : [names]) as string[];
      errors = { ...stateRef.current.errors as Record<string, string> };
      for (const n of list) {
        const err = await runFieldValidation(n, (stateRef.current.values as Record<string, unknown>)[n]);
        if (err) errors[n] = err; else delete errors[n];
      }
    }
    stateRef.current = { ...stateRef.current, errors: errors as FormState<S>['errors'], isValid: Object.keys(errors).length === 0 };
    rerender();
    return Object.keys(errors).length === 0;
  }, [runAllValidation, runFieldValidation, rerender]);

  const reset = useCallback((values?: Partial<SchemaValues<S>>) => {
    const newValues = values ? { ...defaultValues, ...values } : { ...defaultValues };
    stateRef.current = makeInitialState<S>(descriptors, newValues);
    rerender();
  }, [defaultValues, descriptors, rerender]);

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
      const errors = { ...stateRef.current.errors as object } as FormState<S>['errors'];
      (Array.isArray(name) ? name : [name]).forEach(n => delete errors[n]);
      stateRef.current = { ...stateRef.current, errors, isValid: Object.keys(errors).length === 0 };
    }
    rerender();
  }, [rerender]);

  const watch = useCallback(<K extends keyof S>(name: K): SchemaValues<S>[K] =>
    (stateRef.current.values as Record<string, unknown>)[name as string] as SchemaValues<S>[K]
  , []);

  const submit = useCallback(async () => {
    if (submitFnRef.current) {
      await handleSubmit(submitFnRef.current);
    }
  }, [handleSubmit]);

  // ── Build Form component ──────────────────────────────────────────────────

  const Form = useMemo((): FormComponent<S> => {
    const FormInner = ({ children, onSubmit, onError, onSubmitError, className, style }: Parameters<FormComponent<S>>[0]) => {
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

    const Submit = ({ children, className, style, loadingText, disabled: extraDisabled }: SubmitButtonProps) => {
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

    (FormInner as FormComponent<S>).Submit = Submit;
    return FormInner as FormComponent<S>;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleSubmit, submit]);

  // ── Build field components ────────────────────────────────────────────────

  const fields = useMemo((): FieldComponents<S> => {
    const result: Record<string, FieldComponent<unknown>> = {};

    for (const [name, descriptor] of Object.entries(descriptors)) {
      result[name] = (extra?: ExtraFieldProps): JSX.Element => {
        const state     = stateRef.current;
        const value     = (state.values as Record<string, unknown>)[name];
        const error     = (state.errors as Record<string, string | undefined>)[name] ?? null;
        const touched   = Boolean((state.touched as Record<string, boolean>)[name]);
        const dirty     = Boolean((state.dirty as Record<string, boolean>)[name]);
        const showError = error && (touched || state.submitCount > 0);

        const desc = { ...descriptor, ...extra && {
          _label:       extra.label       ?? descriptor._label,
          _placeholder: extra.placeholder ?? descriptor._placeholder,
          _hint:        extra.hint        ?? descriptor._hint,
        }};

        const renderProps = {
          name,
          value,
          label:      desc._label,
          placeholder:desc._placeholder,
          error:      showError ? error : null,
          touched,
          dirty,
          validating: state.status === 'validating',
          disabled:   desc._disabled,
          hint:       desc._hint,
          options:    desc._options,
          otpLength:  desc._otpLength,
          onChange:   (v: unknown) => handleChange(name, v),
          onBlur:     () => handleBlur(name),
          onFocus:    () => {},
        };

        // Custom renderer wins
        if (desc._customRender) {
          return desc._customRender(renderProps) as JSX.Element;
        }

        if (desc._hidden) return React.createElement(React.Fragment, null);

        // Platform renderer
        if (isWeb) {
          const { WebField } = require('../components/web/WebField');
          return React.createElement(WebField, { descriptor: desc, ...renderProps, extra });
        }
        const { NativeField } = require('../components/native/NativeField');
        return React.createElement(NativeField, { descriptor: desc, ...renderProps, extra });
      };
    }

    return result as FieldComponents<S>;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [descriptors, handleChange, handleBlur]);

  return {
    Form,
    fields,
    state: stateRef.current,
    setValue,
    getValue,
    getValues,
    validate,
    reset,
    setError,
    clearErrors,
    watch,
    submit,
  };
}
