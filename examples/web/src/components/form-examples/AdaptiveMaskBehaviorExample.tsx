import { useMemo, useState } from 'react';

import { field, MASKS, useFormBridge } from '@runilib/react-formbridge';

import styles from './FormExamples.module.css';
import { MaskExampleFrame } from './MaskExampleFrame';
import { createDemoFieldUi, createDemoFormUi, simulateSubmitDelay } from './shared';

export function AdaptiveMaskBehaviorExample() {
  const [lastSubmission, setLastSubmission] = useState<unknown>(null);
  const { compactFieldUi } = createDemoFieldUi(styles);

  const formSchema = useMemo(
    () => ({
      cardNumber: field
        .masked(MASKS.CARD_16)
        .label('Card number')
        .required('Card number is required')
        .showMaskInPlaceholder()
        .validateComplete('Complete the card number.'),
      expiry: field
        .masked(MASKS.EXPIRY)
        .label('Expiry')
        .required('Expiry date is required')
        .showMaskInPlaceholder()
        .validateComplete('Complete the expiry date.'),
      cvv: field
        .masked(MASKS.CVV)
        .label('CVV')
        .required('CVV is required')
        .showMaskInPlaceholder()
        .validateComplete('Complete the CVV.'),
      memberCode: field
        .masked('LL-9999')
        .label('Member code')
        .tokens({
          L: /[A-Z]/,
          9: /[2-7]/,
        })
        .required('Member code is required')
        .showMaskInPlaceholder()
        .uppercase()
        .validateComplete('Complete the member code.'),
    }),
    [],
  );

  const form = useFormBridge(formSchema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
    globalStyles: () => createDemoFormUi(styles),
  });

  const { Form, fields, state, watchAll } = form;
  const liveValues = watchAll();

  return (
    <MaskExampleFrame
      maskName="Adaptive behavior"
      accent="#f59e0b"
      title="Mask-aware width and token behavior"
      description="This demo shows the new mask behavior directly in the example app: short masks stay compact, longer masks expand to match the pattern, and custom letter tokens stop the field from behaving like a numeric-only input."
      highlights={[
        'auto width by pattern',
        'maxLength follows the mask',
        'letter-aware input mode',
      ]}
      preview={
        <>
          <p className={styles.resolverPreviewValue}>
            {liveValues.cardNumber || '4242 4242 4242 4242'}
          </p>
          <p className={styles.resolverPreviewMuted}>
            Expiry {liveValues.expiry || '09/28'} · CVV {liveValues.cvv || '482'} · Member{' '}
            {liveValues.memberCode || 'AB-4821'}
          </p>
          <div className={styles.points}>
            <span className={styles.point}>Card masks claim more width</span>
            <span className={styles.point}>Expiry and CVV stay compact</span>
            <span className={styles.point}>Letter tokens accept alpha input</span>
          </div>
        </>
      }
      parsedSubmission={lastSubmission}
      submittedLabel={
        lastSubmission
          ? `Stored ${String(liveValues.memberCode || 'masked values')}`
          : null
      }
      submitError={state.submitError}
      footer="Put short masks next to each other without hand-tuning widths, then let longer identifiers like card numbers take the room they need. Custom alpha tokens still work cleanly in the same form."
    >
      <Form
        className={styles.resolverForm}
        onSubmit={async (values) => {
          await simulateSubmitDelay();
          setLastSubmission(values);
        }}
      >
        <div className={styles.maskAdaptiveStack}>
          <div className={styles.maskAdaptiveWideField}>
            <fields.cardNumber />
          </div>

          <div className={styles.maskAdaptiveInlineRow}>
            <div className={styles.maskAdaptiveField}>
              <fields.expiry {...compactFieldUi} />
            </div>
            <div className={styles.maskAdaptiveField}>
              <fields.cvv {...compactFieldUi} />
            </div>
            <div className={styles.maskAdaptiveField}>
              <fields.memberCode {...compactFieldUi} />
            </div>
          </div>
        </div>

        <div className={styles.footerRow}>
          <p className={styles.helperText}>
            Notice how the short masks stay tight while the card field and alphanumeric
            member code size themselves from the pattern.
          </p>

          <Form.Submit
            className={styles.submitButton}
            loadingText="Saving masks…"
          >
            Save mask setup
          </Form.Submit>
        </div>
      </Form>
    </MaskExampleFrame>
  );
}
