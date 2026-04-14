import { field, useFormBridge } from '@runilib/react-formbridge';

import styles from './FormExamples.module.css';

const schema = {
  email: field.email('Email').required(),
};

export function QuickTestExample() {
  const form = useFormBridge(schema);

  return (
    <section className={`${styles.sectionCard} ${styles.customerSection}`}>
      <form.Form onSubmit={(values) => console.log('save', values)}>
        <input
          name="email"
          value={form.state.values.email}
          onChange={(e) => form.setValue('email', e.target.value)}
          onBlur={() => form.fieldController('email').onBlur()}
        />
        <form.FieldError name="email" />
        <form.Form.Submit>Save</form.Form.Submit>
      </form.Form>
    </section>
  );
}
