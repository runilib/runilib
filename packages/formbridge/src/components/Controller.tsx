import type { FieldValue, ControllerProps, FormValues, FormState } from '../types';
import { runRules } from '../validators/rules';
import { useCallback, useState } from 'react';

// Internal props injected by useForm
interface InternalProps extends ControllerProps {
  _form: {
    watch:     (name: string) => FieldValue;
    setValue:  (name: string, value: FieldValue, opts?: { shouldValidate?: boolean }) => void;
    trigger:   (name: string) => Promise<boolean>;
    formState: FormState<FormValues>;
  };
}

/**
 * `Controller` — use for controlled components like custom pickers, sliders, etc.
 * Provided automatically via `form.Controller` from `useForm()`.
 *
 * @example
 * <form.Controller
 *   name="country"
 *   rules={{ required: true }}
 *   defaultValue=""
 *   render={({ field, fieldState }) => (
 *     <CountryPicker
 *       value={field.value}
 *       onChange={field.onChange}
 *       error={fieldState.error}
 *     />
 *   )}
 * />
 */
export function Controller({
  name, rules, defaultValue, render, _form,
}: InternalProps): JSX.Element | null {
  const rawValue  = _form.watch(name) ?? defaultValue ?? '';
  const error     = (_form.formState.errors[name] ?? null) as string | null;
  const touched   = Boolean(_form.formState.touched[name]);
  const dirty     = Boolean(_form.formState.dirty[name]);

  const onChange = useCallback((value: FieldValue) => {
    _form.setValue(name, value, { shouldValidate: true });
  }, [name, _form]);

  const onBlur = useCallback(() => {
    _form.trigger(name);
  }, [name, _form]);

  return render({
    field: {
      name,
      value:    rawValue as FieldValue,
      onChange,
      onBlur,
    },
    fieldState: {
      error,
      touched,
      dirty,
      invalid: error !== null,
    },
  }) as JSX.Element | null;
}
