import { useMemo, useState } from 'react';

import { field, useFormBridge } from '@runilib/react-formbridge';

import { FieldVariantFrame } from './FieldVariantFrame';
import styles from './FormExamples.module.css';
import { NativeCheckboxField } from './nativeFormHelpers';
import { simulateSubmitDelay } from './shared';

export function SwitchVariantsExample() {
  const [lastSubmission, setLastSubmission] = useState<Record<string, unknown> | null>(
    null,
  );

  const schema = useMemo(
    () => ({
      publicProfile: field
        .switch('Public profile')
        .defaultValue(true)
        .hint('Starts enabled so the profile is visible to teammates.'),
      pushAlerts: field
        .switch('Push alerts')
        .defaultValue(true)
        .hint('Controls real-time app notifications.'),
      quietHours: field
        .switch('Quiet hours')
        .hint('Silence alerts outside working hours.')
        .disabledWhen('pushAlerts', false),
    }),
    [],
  );

  const form = useFormBridge(schema, {
    validateOn: 'onChange',
    revalidateOn: 'onChange',
  });

  const { Form, FieldError, FieldLabel, fieldController, watchAll } = form;
  const values = watchAll();
  const activeCount = Object.values(values).filter(Boolean).length;

  return (
    <FieldVariantFrame
      familyName="Switch"
      accent="#34d399"
      title="Instant feature toggles for product settings"
      description="Switch is the best fit when the control reads like an on/off product state. This example also shows a dependent switch that only unlocks when alerts are enabled."
      highlights={[
        'default on',
        'product settings',
        'dependent disable',
        'fast toggle UX',
      ]}
      preview={
        <>
          <p className={styles.resolverPreviewValue}>{activeCount} active toggles</p>
          <p className={styles.resolverPreviewMuted}>
            Great for product settings that map directly to an enabled or disabled state.
          </p>
          <div className={styles.points}>
            {values.publicProfile ? (
              <span className={styles.point}>Public profile</span>
            ) : null}
            {values.pushAlerts ? <span className={styles.point}>Push alerts</span> : null}
            {values.quietHours ? <span className={styles.point}>Quiet hours</span> : null}
          </div>
        </>
      }
      snapshot={lastSubmission ?? values}
      submittedLabel={lastSubmission ? `Saved ${activeCount} active switches` : null}
      footer="Use switch when the user expects an immediate on/off state. It feels more natural than a checkbox for product features, privacy controls, and notification settings."
    >
      <Form
        className={styles.resolverForm}
        onSubmit={async (submittedValues) => {
          await simulateSubmitDelay(280);
          setLastSubmission(submittedValues as Record<string, unknown>);
        }}
      >
        <NativeCheckboxField
          controller={fieldController('publicProfile') as never}
          FieldError={FieldError as (props: { name: string }) => React.JSX.Element | null}
          FieldLabel={FieldLabel as (props: { name: string; htmlFor?: string }) => React.JSX.Element | null}
          className={styles.formField}
        />
        <NativeCheckboxField
          controller={fieldController('pushAlerts') as never}
          FieldError={FieldError as (props: { name: string }) => React.JSX.Element | null}
          FieldLabel={FieldLabel as (props: { name: string; htmlFor?: string }) => React.JSX.Element | null}
          className={styles.formField}
        />
        <NativeCheckboxField
          controller={fieldController('quietHours') as never}
          FieldError={FieldError as (props: { name: string }) => React.JSX.Element | null}
          FieldLabel={FieldLabel as (props: { name: string; htmlFor?: string }) => React.JSX.Element | null}
          className={styles.formField}
        />

        <button type="submit" className={styles.submitButton}>
          Save switch settings
        </button>
      </Form>
    </FieldVariantFrame>
  );
}
