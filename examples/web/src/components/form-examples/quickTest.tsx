import { useId } from 'react';

import { field, useFormBridge } from '@runilib/react-formbridge';

const schema = {
  email: field.email('Email').required(),
  switch: field.switch('Switch').required(),
  radio: field.radio('Radio').options(['Radio']),
  text: field.text('Text'),
  otp: field.otp('Otp'),
  password: field.password('password'),
  checkbox: field.checkbox('checkbox'),
  file: field.file('file'),
};

type ManualController = {
  name: string;
  value: unknown;
  label?: string;
  options?: Array<{ label: string; value: string | number }>;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  onFocus: () => void;
};

function ManualField({
  controller,
  type = 'text',
}: {
  controller: ManualController;
  type?: string;
}) {
  const inputId = useId();
  const value = controller.value ?? '';

  return (
    <div>
      <label htmlFor={inputId}>{controller.label}</label>
      {type === 'checkbox' ? (
        <input
          id={inputId}
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => controller.onChange(event.target.checked)}
          onBlur={controller.onBlur}
          onFocus={controller.onFocus}
        />
      ) : (
        <input
          id={inputId}
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

export function QuickTestExample() {
  const form = useFormBridge(schema);
  const { Form, fieldController } = form;

  return (
    <section>
      <Form onSubmit={(values) => console.log('save', values)}>
        <ManualField controller={fieldController('email')} />
        <ManualField
          controller={fieldController('switch')}
          type="checkbox"
        />
        <ManualField controller={fieldController('radio')} />
        <ManualField controller={fieldController('text')} />
        <ManualField controller={fieldController('otp')} />
        <ManualField
          controller={fieldController('password')}
          type="password"
        />
        <ManualField
          controller={fieldController('checkbox')}
          type="checkbox"
        />
        <ManualField controller={fieldController('file')} />
        <button type="submit">Save</button>
      </Form>
    </section>
  );
}
