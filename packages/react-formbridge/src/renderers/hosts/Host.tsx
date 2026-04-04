import React from 'react';

import type {
  ExtraFieldProps,
  FieldComponent,
  FormComponent,
  FormProps,
  FormSchema,
  Platform,
  SubmitButtonComponent,
  SubmitButtonProps,
} from '../../types';

export type FieldHostProps<TProps extends ExtraFieldProps = ExtraFieldProps> = TProps & {
  field: FieldComponent<TProps>;
};
export const FieldHost = <TProps extends ExtraFieldProps>({
  field: Field,
  ...props
}: FieldHostProps<TProps>) => {
  return React.createElement(
    Field as React.JSXElementConstructor<TProps>,
    props as unknown as TProps,
  );
};

export type SubmitHostProps<TPlatform extends Platform = Platform> =
  SubmitButtonProps<TPlatform> & {
    submit: SubmitButtonComponent<TPlatform>;
  };
export const SubmitHost = <TPlatform extends Platform = Platform>({
  submit: Submit,
  ...props
}: SubmitHostProps<TPlatform>) => {
  return React.createElement(
    Submit as React.JSXElementConstructor<SubmitButtonProps<TPlatform>>,
    props as React.Attributes & SubmitButtonProps<TPlatform>,
  );
};

export type FormHostProps<
  F extends FormSchema,
  TPlatform extends Platform = Platform,
> = FormProps<F, TPlatform> & {
  form: FormComponent<F, TPlatform>;
};
export const FormHost = <F extends FormSchema, TPlatform extends Platform = Platform>({
  form: FormComp,
  ...props
}: FormHostProps<F, TPlatform>) => {
  return React.createElement(
    FormComp as React.JSXElementConstructor<FormProps<F, TPlatform>>,
    props as React.Attributes & FormProps<F, TPlatform>,
  );
};
