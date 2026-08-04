import { useMemo, useState } from 'react';

import { field, useFormBridge } from '@runilib/react-formbridge';

import styles from './FormExamples.module.css';
import { NativeField } from './nativeFormHelpers';
import { StylingExampleFrame } from './StylingExampleFrame';
import { simulateSubmitDelay } from './shared';

export function SlotOverridesStylingExample() {
  const [lastSubmission, setLastSubmission] = useState<unknown>(null);

  const schema = useMemo(
    () => ({
      receiptEmail: field
        .email()
        .required('Receipt email is required')
        .placeholder('billing@runilib.dev'),
      postalCode: field.text().required('Postal code is required').placeholder('75002'),
      cardholder: field
        .text()
        .required('Cardholder is required')
        .placeholder('Ava Stone'),
      specialInstructions: field
        .textarea()
        .hint('Great for delivery notes or internal finance context.')
        .placeholder('Leave the invoice open for 14 days.'),
    }),
    [],
  );

  const form = useFormBridge(schema, {
    validateOn: 'onTouched',
  });

  const { Form, FieldError, FieldLabel, fieldController, state, watchAll } = form;
  const liveValues = watchAll();

  return (
    <StylingExampleFrame
      recipeName="Slot overrides"
      accent="#f59e0b"
      title="Style everything with plain objects and slot hooks"
      description="No CSS framework required here. The application owns the markup and styles while FormBridge owns form state, validation, and submission."
      highlights={['inline objects', 'custom required mark', 'field-level tweaks']}
      preview={
        <>
          <p className={styles.resolverPreviewValue}>
            {String(liveValues.cardholder || 'Ava Stone')}
          </p>
          <p className={styles.resolverPreviewMuted}>
            Receipt destination:{' '}
            {String(liveValues.receiptEmail || 'billing@runilib.dev')}.
          </p>
        </>
      }
      submittedPayload={lastSubmission}
      submittedLabel={
        lastSubmission
          ? `Inline theme saved for ${String(liveValues.cardholder || 'customer')}`
          : null
      }
      submitError={state.submitError}
      footer="This is the fastest recipe when you want to prove the styling API without bringing any extra styling library into the project."
    >
      <Form
        onSubmit={async (values) => {
          await simulateSubmitDelay();
          setLastSubmission(values);
        }}
      >
        <div className={styles.formRow}>
          <NativeField
            controller={fieldController('receiptEmail')}
            FieldError={FieldError}
            FieldLabel={FieldLabel}
            type="email"
            className={styles.formField}
            inputClassName={styles.formInput}
          />
          <NativeField
            controller={fieldController('postalCode')}
            FieldError={FieldError}
            FieldLabel={FieldLabel}
            className={styles.formField}
            inputClassName={styles.formInput}
          />
        </div>

        <NativeField
          controller={fieldController('cardholder')}
          FieldError={FieldError}
          FieldLabel={FieldLabel}
          className={styles.formField}
          inputClassName={styles.formInput}
        />
        <NativeField
          controller={fieldController('specialInstructions')}
          FieldError={FieldError}
          FieldLabel={FieldLabel}
          textarea
          className={styles.formField}
          inputClassName={styles.formInput}
        />

        <div className={styles.footerRow}>
          <p className={styles.helperText}>
            A few slot maps are enough to theme the form end to end.
          </p>
          <button
            type="submit"
            className={styles.submitButton}
          >
            Save slot recipe
          </button>
        </div>
      </Form>
    </StylingExampleFrame>
  );
}
