import { useMemo, useState } from 'react';

import { field, useFormBridge } from '@/demoFormBridge';

import styles from './FormExamples.module.css';
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
    globalDefaults: () => ({
      form: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        },
      },
      submit: {
        loadingText: 'Saving inline theme...',
        style: {
          minWidth: 196,
          padding: '14px 22px',
          borderRadius: 16,
          border: '1px solid rgba(245, 158, 11, 0.22)',
          background: 'rgba(245, 158, 11, 0.14)',
          color: '#fde68a',
          fontWeight: 800,
        },
      },
      field: {
        styles: {
          wrapper: {
            marginBottom: 0,
            gap: 8,
          },
          label: {
            color: '#30415d',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          },
          textInput: {
            background: '#ffffff',
            border: '1px solid rgba(251, 191, 36, 0.18)',
            borderRadius: 16,
            color: '#10203a',
            padding: '14px 16px',
          },
          textarea: {
            minHeight: 108,
            background: '#ffffff',
            border: '1px solid rgba(251, 191, 36, 0.18)',
            borderRadius: 16,
            color: '#10203a',
            padding: '14px 16px',
          },
          hint: {
            color: '#fde68a',
          },
          error: {
            color: '#fca5a5',
          },
        },
        renderRequiredMark: () => <span style={{ color: '#f59e0b' }}>•</span>,
      },
    }),
  });

  const { Form, fields, state, watchAll } = form;
  const liveValues = watchAll();

  return (
    <StylingExampleFrame
      recipeName="Slot overrides"
      accent="#f59e0b"
      title="Style everything with plain objects and slot hooks"
      description="No CSS framework required here. The whole look comes from globalDefaults.field and a couple of local field overrides."
      highlights={['inline objects', 'custom required mark', 'field-level tweaks']}
      preview={
        <>
          <p className={styles.resolverPreviewValue}>
            {liveValues.cardholder || 'Ava Stone'}
          </p>
          <p className={styles.resolverPreviewMuted}>
            Receipt destination: {liveValues.receiptEmail || 'billing@runilib.dev'}.
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
          <fields.receiptEmail
            {...{
              highlightOnError: false,
              renderHint: () => (
                <span style={{ color: '#5f6f88', fontSize: 12 }}>
                  We only use it for invoices and receipts.
                </span>
              ),
            }}
          />
          <fields.postalCode
            {...{
              styles: {
                textInput: {
                  textAlign: 'center',
                  letterSpacing: '0.14em',
                },
              },
            }}
          />
        </div>

        <fields.cardholder />
        <fields.specialInstructions />

        <div className={styles.footerRow}>
          <p className={styles.helperText}>
            A few slot maps are enough to theme the form end to end.
          </p>
          <Form.Submit>Save slot recipe</Form.Submit>
        </div>
      </Form>
    </StylingExampleFrame>
  );
}
