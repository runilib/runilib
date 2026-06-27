import { useId, useMemo, useState } from 'react';

import { field, useFormBridge } from '@runilib/react-formbridge';

import { FieldVariantFrame } from './FieldVariantFrame';
import styles from './FormExamples.module.css';
import { simulateSubmitDelay } from './shared';

type ManualController = {
  name: string;
  value: unknown;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  onFocus: () => void;
};

function CheckboxField({
  controller,
  FieldError,
}: {
  controller: ManualController;
  FieldError: (props: { name: string }) => React.JSX.Element | null;
}) {
  const id = useId();
  const checked = Boolean(controller.value);

  return (
    <div className={styles.formField}>
      <label htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => controller.onChange(event.target.checked)}
          onBlur={controller.onBlur}
          onFocus={controller.onFocus}
        />
        <span>{controller.name}</span>
      </label>
      <FieldError name={controller.name} />
    </div>
  );
}

export function CheckboxVariantsExample() {
  const [lastSubmission, setLastSubmission] = useState<Record<string, unknown> | null>(
    null,
  );

  const schema = useMemo(
    () => ({
      acceptTerms: field
        .checkbox()
        .label('Accept launch terms')
        .mustBeTrue('The launch terms must be accepted')
        .hint('Required legal consent.'),
      weeklyDigest: field
        .checkbox()
        .label('Weekly digest')
        .defaultValue(true)
        .hint('Pre-selected communication preference.'),
      betaInvites: field
        .checkbox()
        .label('Beta invites')
        .hint('Optional opt-in for early product previews.'),
    }),
    [],
  );

  const form = useFormBridge(schema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
  });

  const { Form, FieldError, fieldController, watchAll } = form;
  const values = watchAll() as Record<string, unknown>;
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
        <CheckboxField
          controller={fieldController('acceptTerms') as ManualController}
          FieldError={FieldError as (props: { name: string }) => React.JSX.Element | null}
          FieldLabel={FieldLabel as (props: { name: string; htmlFor: string }) => React.JSX.Element | null}
        />
        <CheckboxField
          controller={fieldController('weeklyDigest') as ManualController}
          FieldError={FieldError as (props: { name: string }) => React.JSX.Element | null}
          FieldLabel={FieldLabel as (props: { name: string; htmlFor: string }) => React.JSX.Element | null}
        />
        <CheckboxField
          controller={fieldController('betaInvites') as ManualController}
          FieldError={FieldError as (props: { name: string }) => React.JSX.Element | null}
          FieldLabel={FieldLabel as (props: { name: string; htmlFor: string }) => React.JSX.Element | null}
        />
        <button type="submit" className={styles.submitButton}>
          Save checkbox preferences
        </button>
      </Form>
    </FieldVariantFrame>
  );
}
