import { useState } from 'react';

import { createSchema, field, useFormBridge } from '@/demoFormBridge';

import styles from './FormExamples.module.css';
import { createDemoFormUi, simulateSubmitDelay } from './shared';

const tripSchema = createSchema({
  fullName: field.text().required('Full name is required').label('Full name'),
  email: field.email().label('Email').trim().lowercase(),
  phone: field.phone('FR').label('Phone'),
  departureDate: field.date('Departure').required('Departure date is required'),
  returnDate: field.date('Return').required('Return date is required'),
  password: field
    .password()
    .label('Password')
    .required('Password is required')
    .min(8, 'At least 8 characters'),
  confirmPassword: field
    .password()
    .label('Confirm password')
    .required('Please confirm your password'),
})
  .atLeastOne(
    ['email', 'phone'],
    'Provide at least an email or a phone number so we can reach you.',
  )
  .superRefine((values, ctx) => {
    if (
      values.password &&
      values.confirmPassword &&
      values.password !== values.confirmPassword
    ) {
      ctx.addIssue({
        path: 'confirmPassword',
        code: 'password_mismatch',
        message: 'Passwords do not match.',
      });
    }

    if (
      values.password &&
      values.email &&
      String(values.password)
        .toLowerCase()
        .includes(String(values.email).split('@')[0]?.toLowerCase() ?? '__')
    ) {
      ctx.addIssue({
        path: 'password',
        code: 'password_contains_email',
        message: "Don't reuse your email handle inside your password.",
      });
    }
  });

export function SchemaRefinementExample() {
  const [lastSubmission, setLastSubmission] = useState<Record<string, unknown> | null>(
    null,
  );

  const tripForm = useFormBridge(tripSchema, {
    validateOn: 'onTouched',
    revalidateOn: 'onChange',
    globalDefaults: () => createDemoFormUi(styles),
  });

  const { Form, fields, state } = tripForm;
  const formLevelError = state.formLevelError;

  return (
    <section className={`${styles.sectionCard} ${styles.customerSection}`}>
      <div className={styles.customerShell}>
        <aside className={styles.customerAside}>
          <span className={styles.customerEyebrow}>createSchema() refinements</span>
          <h2 className={styles.customerTitle}>Cross-field validation</h2>
          <p className={styles.customerIntro}>
            Four built-in helpers - no Zod, no Yup, no bridge. Each one is a single chain
            call on the value returned by <code>createSchema()</code>, and errors are
            routed to the right field automatically.
          </p>

          <div className={styles.points}>
            <span className={styles.point}>
              <strong>atLeastOne</strong> - email or phone required
            </span>
            <span className={styles.point}>
              <strong>dateRange</strong> - return ≥ departure
            </span>
            <span className={styles.point}>
              <strong>superRefine</strong> - password matches & avoids email handle
            </span>
            <span className={styles.point}>
              Form-level errors surface under <code>state.formLevelError</code>
            </span>
          </div>
        </aside>

        <div className={styles.customerPanel}>
          <div className={styles.customerPanelHead}>
            <div>
              <p className={styles.customerPanelTitle}>Trip booking</p>
              <p className={styles.customerPanelSubtitle}>
                Try submitting with only a phone, mismatched passwords, or a return date
                before departure to see each refinement fire.
              </p>
            </div>

            {lastSubmission ? (
              <div className={styles.successBadge}>
                Booked for {String(lastSubmission.fullName ?? 'traveler')}
              </div>
            ) : null}
          </div>

          <Form
            className={styles.formColumn}
            onSubmit={async (values) => {
              await simulateSubmitDelay(500);
              setLastSubmission(values);
            }}
          >
            <fields.fullName />

            <div style={{ display: 'flex', gap: 14 }}>
              <fields.email />
              <fields.phone />
            </div>

            <div style={{ display: 'flex', gap: 14 }}>
              <fields.departureDate />
              <fields.returnDate />
            </div>

            <fields.password />
            <fields.confirmPassword />

            {formLevelError ? <p className={styles.errorBox}>{formLevelError}</p> : null}

            <Form.Submit className={styles.submitButton}>Book the trip</Form.Submit>
          </Form>
        </div>
      </div>
    </section>
  );
}
