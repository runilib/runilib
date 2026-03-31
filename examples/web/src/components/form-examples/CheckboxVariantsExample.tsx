import { useMemo, useState } from 'react';

import { field, useFormBridge } from '@runilib/react-formbridge';

import { FieldVariantFrame } from './FieldVariantFrame';
import styles from './FormExamples.module.css';
import { createDemoFormUi, simulateSubmitDelay } from './shared';

export function CheckboxVariantsExample() {
  const [lastSubmission, setLastSubmission] = useState<Record<string, unknown> | null>(
    null,
  );

  const schema = useMemo(
    () => ({
      acceptTerms: field
        .checkbox('Accept launch terms')
        .mustBeTrue('The launch terms must be accepted')
        .hint('Required legal consent.'),
      weeklyDigest: field
        .checkbox('Receive weekly digest')
        .defaultValue(true)
        .hint('Pre-selected communication preference.'),
      betaInvites: field
        .checkbox('Join beta invite list')
        .hint('Optional opt-in for early product previews.'),
    }),
    [],
  );

  const form = useFormBridge(schema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
    globalAppearance: createDemoFormUi(styles),
  });

  const { Form, fields, watchAll } = form;
  const values = watchAll();
  const enabledCount = Object.values(values).filter(Boolean).length;

  return (
    <FieldVariantFrame
      familyName="Checkbox"
      accent="#f59e0b"
      title="Consent toggles with different behaviors"
      description="Checkbox fields are great for legal confirmations, optional opt-ins, and pre-checked communication preferences."
      highlights={[
        'mustBeTrue',
        'defaultValue(true)',
        'optional consent',
        'inline hints',
      ]}
      preview={
        <>
          <p className={styles.resolverPreviewValue}>{enabledCount}/3 enabled</p>
          <p className={styles.resolverPreviewMuted}>
            A required legal checkbox plus two optional preference toggles.
          </p>
          <div className={styles.points}>
            {values.acceptTerms ? (
              <span className={styles.point}>Terms accepted</span>
            ) : null}
            {values.weeklyDigest ? (
              <span className={styles.point}>Weekly digest on</span>
            ) : null}
            {values.betaInvites ? (
              <span className={styles.point}>Beta invites on</span>
            ) : null}
          </div>
        </>
      }
      snapshot={lastSubmission ?? values}
      submittedLabel={
        lastSubmission ? `Saved ${enabledCount} active checkbox preferences` : null
      }
      footer="Use checkbox when each value is independent: mandatory consent, optional marketing, or feature opt-ins can all live side by side."
    >
      <Form
        className={styles.resolverForm}
        onSubmit={async (submittedValues) => {
          await simulateSubmitDelay(280);
          setLastSubmission(submittedValues as Record<string, unknown>);
        }}
      >
        <fields.acceptTerms />
        <fields.weeklyDigest />
        <fields.betaInvites />

        <Form.Submit
          className={styles.submitButton}
          loadingText="Saving preferences…"
        >
          Save checkbox preferences
        </Form.Submit>
      </Form>
    </FieldVariantFrame>
  );
}
