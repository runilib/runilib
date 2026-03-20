import React, { createContext, useContext, type FC, type ReactNode } from 'react';
import type { UseFormReturn, FormValues } from '../types';

const FormContext = createContext<UseFormReturn<FormValues> | null>(null);

interface FormProviderProps {
  children: ReactNode;
  form:     UseFormReturn<FormValues>;
}

/**
 * `FormProvider` — shares form context with deeply nested children.
 * Use with `useFormContext()` in child components.
 *
 * @example
 * const form = useForm();
 *
 * <FormProvider form={form}>
 *   <DeepChildComponent />
 * </FormProvider>
 */
export const FormProvider: FC<FormProviderProps> = ({ children, form }) => (
  <FormContext.Provider value={form}>{children}</FormContext.Provider>
);

/**
 * `useFormContext` — access the nearest `FormProvider`'s form instance.
 *
 * @example
 * function MyInput() {
 *   const { register, formState } = useFormContext();
 *   return <input {...register('email')} />;
 * }
 */
export function useFormContext<T extends FormValues = FormValues>(): UseFormReturn<T> {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error('[formbridge] useFormContext must be used inside <FormProvider>.');
  return ctx as UseFormReturn<T>;
}
