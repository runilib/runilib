import { useRef, useState, useCallback, useMemo } from 'react';
import { isWeb } from '../utils/platform';
import { runRules } from '../validators/rules';
import { Controller as ControllerComponent } from '../components/Controller';
import type {
  FormValues, FieldRules, FieldValue, FormState,
  UseFormOptions, UseFormReturn, ValidationMode,
} from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeDefaultState<T extends FormValues>(defaults: T): FormState<T> {
  return {
    values:       { ...defaults },
    errors:       {},
    touched:      {},
    dirty:        {},
    isValid:      true,
    isDirty:      false,
    isSubmitting: false,
    isSubmitted:  false,
    submitCount:  0,
  };
}

function shouldValidateOn(
  event: 'onChange' | 'onBlur' | 'onSubmit',
  mode: ValidationMode,
  isTouched: boolean,
  reValidateMode: ValidationMode,
  isSubmitted: boolean,
): boolean {
  const activeMode = isSubmitted ? reValidateMode : mode;
  if (activeMode === 'all') return true;
  if (activeMode === event) return true;
  if (activeMode === 'onTouched' && isTouched) return true;
  return false;
}

// ─── useForm ──────────────────────────────────────────────────────────────────

export function useForm<T extends FormValues = FormValues>({
  defaultValues = {} as T,
  mode          = 'onSubmit',
  reValidateMode = 'onChange',
}: UseFormOptions<T> = {}): UseFormReturn<T> {

  // ── Internal refs (avoid re-renders for non-reactive state) ────────────────
  const stateRef      = useRef<FormState<T>>(makeDefaultState(defaultValues));
  const rulesRef      = useRef<Partial<Record<keyof T, FieldRules>>>({});
  const fieldRefsMap  = useRef<Partial<Record<keyof T, unknown>>>({});

  // ── Reactive slice — only what drives re-renders ──────────────────────────
  const [, forceUpdate] = useState(0);
  const rerender = useCallback(() => forceUpdate(n => n + 1), []);

  // ── Validate a single field ────────────────────────────────────────────────
  const validateField = useCallback(async (name: keyof T): Promise<string | null> => {
    const rules  = rulesRef.current[name];
    const value  = stateRef.current.values[name];
    if (!rules) return null;
    const error = await runRules(value as FieldValue, rules, stateRef.current.values);
    return error ?? null;
  }, []);

  // ── Validate all fields ────────────────────────────────────────────────────
  const validateAll = useCallback(async (): Promise<Partial<Record<keyof T, string>>> => {
    const errors: Partial<Record<keyof T, string>> = {};
    for (const name of Object.keys(rulesRef.current) as Array<keyof T>) {
      const err = await validateField(name);
      if (err) errors[name] = err;
    }
    return errors;
  }, [validateField]);

  // ── register ──────────────────────────────────────────────────────────────
  const register = useCallback(<K extends keyof T>(
    name: K,
    rules?: FieldRules,
  ) => {
    // Store rules
    if (rules) rulesRef.current[name] = rules;

    const currentValue = stateRef.current.values[name] ?? defaultValues[name] ?? '';

    const handleChange = async (rawValue: FieldValue) => {
      const prev  = stateRef.current.values[name];
      const dirty = rawValue !== defaultValues[name];
      stateRef.current = {
        ...stateRef.current,
        values: { ...stateRef.current.values, [name]: rawValue },
        dirty:  { ...stateRef.current.dirty,  [name]: dirty },
        isDirty: dirty || Object.values({ ...stateRef.current.dirty, [name]: dirty }).some(Boolean),
      };

      const isTouched = Boolean(stateRef.current.touched[name]);
      if (shouldValidateOn('onChange', mode, isTouched, reValidateMode, stateRef.current.isSubmitted)) {
        const err = await runRules(rawValue as FieldValue, rulesRef.current[name] ?? {}, stateRef.current.values);
        const errors = { ...stateRef.current.errors, [name]: err ?? undefined };
        if (!err) delete errors[name];
        stateRef.current = {
          ...stateRef.current,
          errors,
          isValid: Object.keys(errors).length === 0,
        };
      }
      rerender();
    };

    const handleBlur = async () => {
      stateRef.current = {
        ...stateRef.current,
        touched: { ...stateRef.current.touched, [name]: true },
      };
      if (shouldValidateOn('onBlur', mode, true, reValidateMode, stateRef.current.isSubmitted)) {
        const err = await runRules(stateRef.current.values[name] as FieldValue, rulesRef.current[name] ?? {}, stateRef.current.values);
        const errors = { ...stateRef.current.errors, [name]: err ?? undefined };
        if (!err) delete errors[name];
        stateRef.current = {
          ...stateRef.current,
          errors,
          isValid: Object.keys(errors).length === 0,
        };
      }
      rerender();
    };

    const ref = (el: unknown) => { fieldRefsMap.current[name] = el; };

    // ── Platform-specific props ─────────────────────────────────────────────
    if (isWeb) {
      return {
        name:     name as string,
        value:    (currentValue ?? '') as string | number,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
          const el = e.target as HTMLInputElement;
          const val = el.type === 'checkbox' ? el.checked : el.value;
          handleChange(val as FieldValue);
        },
        onBlur: handleBlur,
        ref,
      };
    }

    // React Native
    return {
      value:         String(currentValue ?? ''),
      onChangeText:  (text: string) => handleChange(text),
      onBlur:        handleBlur,
      ref,
    };
  }, [defaultValues, mode, reValidateMode, rerender]);

  // ── handleSubmit ─────────────────────────────────────────────────────────
  const handleSubmit = useCallback((
    onValid: (values: T) => void | Promise<void>,
    onInvalid?: (errors: Partial<Record<keyof T, string>>) => void,
  ) => {
    return async () => {
      stateRef.current = {
        ...stateRef.current,
        isSubmitting: true,
        submitCount: stateRef.current.submitCount + 1,
      };
      rerender();

      const errors = await validateAll();

      // Touch all fields on submit
      const allTouched = Object.fromEntries(
        Object.keys(stateRef.current.values).map(k => [k, true])
      ) as Partial<Record<keyof T, boolean>>;

      stateRef.current = {
        ...stateRef.current,
        errors,
        touched: { ...stateRef.current.touched, ...allTouched },
        isValid: Object.keys(errors).length === 0,
        isSubmitting: false,
        isSubmitted: true,
      };
      rerender();

      if (Object.keys(errors).length === 0) {
        await onValid({ ...stateRef.current.values });
      } else {
        onInvalid?.(errors);
      }
    };
  }, [validateAll, rerender]);

  // ── setValue ──────────────────────────────────────────────────────────────
  const setValue = useCallback(<K extends keyof T>(
    name: K,
    value: T[K],
    opts: { shouldValidate?: boolean; shouldDirty?: boolean } = {},
  ) => {
    const dirty = opts.shouldDirty !== false
      ? value !== defaultValues[name]
      : stateRef.current.dirty[name] ?? false;

    stateRef.current = {
      ...stateRef.current,
      values: { ...stateRef.current.values, [name]: value },
      dirty:  { ...stateRef.current.dirty, [name]: dirty },
      isDirty: dirty || Object.values({ ...stateRef.current.dirty, [name]: dirty }).some(Boolean),
    };

    if (opts.shouldValidate) {
      runRules(value as FieldValue, rulesRef.current[name] ?? {}, stateRef.current.values).then(err => {
        const errors = { ...stateRef.current.errors, [name]: err ?? undefined };
        if (!err) delete errors[name];
        stateRef.current = { ...stateRef.current, errors, isValid: Object.keys(errors).length === 0 };
        rerender();
      });
    } else {
      rerender();
    }
  }, [defaultValues, rerender]);

  // ── getValue / getValues ──────────────────────────────────────────────────
  const getValue  = useCallback(<K extends keyof T>(name: K): T[K] => stateRef.current.values[name], []);
  const getValues = useCallback((): T => ({ ...stateRef.current.values }), []);

  // ── trigger ───────────────────────────────────────────────────────────────
  const trigger = useCallback(async (name?: keyof T | Array<keyof T>): Promise<boolean> => {
    let errors: Partial<Record<keyof T, string>>;

    if (!name) {
      errors = await validateAll();
    } else {
      const names = Array.isArray(name) ? name : [name];
      errors = { ...stateRef.current.errors };
      for (const n of names) {
        const err = await validateField(n);
        if (err) errors[n] = err;
        else delete errors[n];
      }
    }

    stateRef.current = { ...stateRef.current, errors, isValid: Object.keys(errors).length === 0 };
    rerender();
    return Object.keys(errors).length === 0;
  }, [validateAll, validateField, rerender]);

  // ── setError ─────────────────────────────────────────────────────────────
  const setError = useCallback((name: keyof T, error: { message: string }) => {
    stateRef.current = {
      ...stateRef.current,
      errors:  { ...stateRef.current.errors, [name]: error.message },
      isValid: false,
    };
    rerender();
  }, [rerender]);

  // ── clearErrors ───────────────────────────────────────────────────────────
  const clearErrors = useCallback((name?: keyof T | Array<keyof T>) => {
    if (!name) {
      stateRef.current = { ...stateRef.current, errors: {}, isValid: true };
    } else {
      const errors = { ...stateRef.current.errors };
      const names  = Array.isArray(name) ? name : [name];
      names.forEach(n => delete errors[n]);
      stateRef.current = { ...stateRef.current, errors, isValid: Object.keys(errors).length === 0 };
    }
    rerender();
  }, [rerender]);

  // ── reset ─────────────────────────────────────────────────────────────────
  const reset = useCallback((values?: Partial<T>) => {
    const next = values ? { ...defaultValues, ...values } : { ...defaultValues };
    stateRef.current = makeDefaultState(next as T);
    rerender();
  }, [defaultValues, rerender]);

  // ── watch ─────────────────────────────────────────────────────────────────
  const watch    = useCallback(<K extends keyof T>(name: K): T[K] => stateRef.current.values[name], []);
  const watchAll = useCallback((): T => ({ ...stateRef.current.values }), []);

  // ── formState (snapshot) ─────────────────────────────────────────────────
  const formState = stateRef.current;

  return {
    register,
    handleSubmit,
    setValue,
    getValue,
    getValues,
    trigger,
    setError,
    clearErrors,
    reset,
    watch,
    watchAll,
    formState,
    // Bind Controller with form context
    Controller: (props: Parameters<typeof ControllerComponent>[0]) =>
      ControllerComponent({ ...props, _form: { watch, setValue, trigger, formState } }),
  } as UseFormReturn<T>;
}
