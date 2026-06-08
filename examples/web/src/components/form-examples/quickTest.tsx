import { field, useFormBridge } from '@/demoFormBridge';

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

export function QuickTestExample() {
  const form = useFormBridge(schema);

  return (
    <section>
      <form.Form onSubmit={(values) => console.log('save', values)}>
        <input
          name="email"
          value={form.state.values.email}
          onChange={(e) => form.setValue('email', e.target.value)}
          onBlur={() => form.fieldController('email').onBlur()}
        />
        <form.fields.email />
        <form.fields.switch />
        <form.fields.radio />
        <form.fields.text />
        <form.fields.otp />
        <form.fields.file />
        <form.fields.password />
        <form.fields.checkbox />
        <form.Form.Submit>Save</form.Form.Submit>
      </form.Form>
    </section>
  );
}
