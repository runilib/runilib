import type React from 'react';
import { createContext, useContext } from 'react';

import type { Platform } from '../../types/field';
import type { UseFormBridgeReturn } from '../../types/form';
import type { FormSchema } from '../../types/schema';

type AnyFormBridgeReturn = UseFormBridgeReturn<FormSchema, Platform>;

const FormBridgeContext = createContext<AnyFormBridgeReturn | null>(null);

export interface FormBridgeProviderProps {
  children?: React.ReactNode;
  value: unknown;
}

export const FormBridgeProvider = ({ children, value }: FormBridgeProviderProps) => {
  return (
    <FormBridgeContext.Provider value={value as AnyFormBridgeReturn}>
      {children}
    </FormBridgeContext.Provider>
  );
};

export function useFormBridgeContext<
  Schema extends FormSchema,
  TPlatform extends Platform = Platform,
>() {
  const context = useContext(FormBridgeContext);

  if (!context) {
    throw new Error(
      'useFormBridgeContext must be used in <form.Form> or <form.FormProvider> which come from the main hooks useFormBridge.😉😉😉',
    );
  }

  return context as UseFormBridgeReturn<Schema, TPlatform>;
}
