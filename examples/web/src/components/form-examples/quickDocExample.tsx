import type { FormSchema } from '@runilib/react-formbridge';
import { field, useFormBridge } from '@runilib/react-formbridge';

const schema = {
  email: field.email('Work email').required().trim().lowercase(),
  password: field.password('Password').required().strong(),
  role: field.select('Role').options(['admin', 'editor', 'viewer']).required(),
  terms: field.checkbox('Accept terms').mustBeTrue('you have to accept'),
} satisfies FormSchema;

export function SignupForm() {
  const { Form, fields, state } = useFormBridge(schema, {
    validateOn: 'onTouched',
    persist: { key: 'signup-form-web' },
  });

  return (
    <Form onSubmit={async (values) => console.log(values)}>
      <fields.email />
      <fields.password />
      <fields.role />
      <fields.terms />
      <Form.Submit disabled={!state.isValid}>Create account</Form.Submit>
    </Form>
  );
}
