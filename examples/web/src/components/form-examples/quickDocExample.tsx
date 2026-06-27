import { useId } from 'react';

import type { FormSchema } from '@runilib/react-formbridge';
import { field, useFormBridge } from '@runilib/react-formbridge';

const schema = {
  email: field.email('Work email').required().trim().lowercase(),
  password: field.password('Password').required().strong(),
  role: field.select('Role').options(['admin', 'editor', 'viewer']).required(),
  terms: field.checkbox('Accept terms').mustBeTrue('you have to accept'),
} satisfies FormSchema;

type ManualController = {
  name: string;
  value: unknown;
  label?: string;
  options?: Array<{ label: string; value: string | number }>;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  onFocus: () => void;
};

function ManualField({ controller, type = 'text' }: { controller: ManualController; type?: string }) {
  const id = useId();
  const value = controller.value ?? '';

  return (
    <div>
      <label htmlFor={id}>{controller.label}</label>
      {type === 'checkbox' ? (
        <input
          id={id}
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => controller.onChange(event.target.checked)}
          onBlur={controller.onBlur}
          onFocus={controller.onFocus}
        />
      ) : type === 'select' ? (
        <select
          id={id}
          value={String(value)}
          onChange={(event) => controller.onChange(event.target.value)}
          onBlur={controller.onBlur}
          onFocus={controller.onFocus}
        >
          {controller.options?.map((option) => (
            <option key={String(option.value)} value={String(option.value)}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={type}
          value={String(value)}
          onChange={(event) => controller.onChange(event.target.value)}
          onBlur={controller.onBlur}
          onFocus={controller.onFocus}
        />
      )}
    </div>
  );
}

export function SignupForm() {
  const { Form, fieldController, state } = useFormBridge(schema, {
    validateOn: 'onTouched',
    persist: { key: 'signup-form-web' },
  });

  return (
    <Form onSubmit={async (values) => console.log(values)}>
      <ManualField controller={fieldController('email')} type="email" />
      <ManualField controller={fieldController('password')} type="password" />
      <ManualField controller={fieldController('role')} type="select" />
      <ManualField controller={fieldController('terms')} type="checkbox" />
      <button type="submit" disabled={!state.isValid}>
        Create account
      </button>
    </Form>
  );
}
