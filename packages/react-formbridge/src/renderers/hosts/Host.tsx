import type {
  ExtraFieldProps,
  FieldComponent,
  FormComponent,
  FormProps,
  FormSchema,
  SubmitButtonComponent,
  SubmitButtonProps,
} from '../../types';

export type FieldHostProps = ExtraFieldProps & {
  field: FieldComponent;
};
export const FieldHost: React.FC<FieldHostProps> = ({ field: Field, ...props }) => {
  return <Field {...props} />;
};

export type SubmitHostProps = SubmitButtonProps & {
  submit: SubmitButtonComponent;
};
export const SubmitHost: React.FC<SubmitHostProps> = ({ submit: Submit, ...props }) => {
  return <Submit {...props} />;
};

export type FormHostProps<F extends FormSchema> = FormProps<F> & {
  form: FormComponent<F>;
};
export const FormHost = <F extends FormSchema>({
  form: FormComp,
  ...props
}: FormHostProps<F>) => {
  return <FormComp {...props} />;
};
