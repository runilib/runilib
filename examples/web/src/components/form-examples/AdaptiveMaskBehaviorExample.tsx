import { useId, useMemo, useState } from 'react';

import { field, MASKS, useFormBridge } from '@runilib/react-formbridge';

import styles from './FormExamples.module.css';
import { MaskExampleFrame } from './MaskExampleFrame';
import { simulateSubmitDelay } from './shared';

type ManualController = {
  name: string;
  value: unknown;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  onFocus: () => void;
};

function NativeField({
  controller,
  FieldError,
  FieldLabel,
}: {
  controller: ManualController;
  FieldError: (props: { name: string }) => React.JSX.Element | null;
  FieldLabel: (props: { name: string; htmlFor: string }) => React.JSX.Element | null;
}) {
  const id = useId();
  const value = controller.value ?? '';

  return (
    <div>
      <FieldLabel
        name={controller.name}
        htmlFor={id}
      />
      <input
        id={id}
        value={String(value)}
        onChange={(event) => controller.onChange(event.target.value)}
        onBlur={controller.onBlur}
        onFocus={controller.onFocus}
      />
      <FieldError name={controller.name} />
    </div>
  );
}

export function AdaptiveMaskBehaviorExample() {
  const [lastSubmission, setLastSubmission] = useState<unknown>(null);

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
  });

  const { Form, FieldError, FieldLabel, fieldController, state, watchAll } = form;
  const liveValues = watchAll() as Record<string, unknown>;

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
            {String(liveValues.cardNumber ?? '4242 4242 4242 4242')}
          </p>
          <p className={styles.resolverPreviewMuted}>
            Expiry {String(liveValues.expiry ?? '09/28')} · CVV{' '}
            {String(liveValues.cvv ?? '482')} · Member{' '}
            {String(liveValues.memberCode ?? 'AB-4821')}
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
            <NativeField
              controller={fieldController('cardNumber') as ManualController}
              FieldError={
                FieldError as (props: { name: string }) => React.JSX.Element | null
              }
              FieldLabel={
                FieldLabel as (props: {
                  name: string;
                  htmlFor: string;
                }) => React.JSX.Element | null
              }
            />
          </div>

          <div className={styles.maskAdaptiveInlineRow}>
            <div className={styles.maskAdaptiveField}>
              <NativeField
                controller={fieldController('expiry') as ManualController}
                FieldError={
                  FieldError as (props: { name: string }) => React.JSX.Element | null
                }
                FieldLabel={
                  FieldLabel as (props: {
                    name: string;
                    htmlFor: string;
                  }) => React.JSX.Element | null
                }
              />
            </div>
            <div className={styles.maskAdaptiveField}>
              <NativeField
                controller={fieldController('cvv') as ManualController}
                FieldError={
                  FieldError as (props: { name: string }) => React.JSX.Element | null
                }
                FieldLabel={
                  FieldLabel as (props: {
                    name: string;
                    htmlFor: string;
                  }) => React.JSX.Element | null
                }
              />
            </div>
            <div className={styles.maskAdaptiveField}>
              <NativeField
                controller={fieldController('memberCode') as ManualController}
                FieldError={
                  FieldError as (props: { name: string }) => React.JSX.Element | null
                }
                FieldLabel={
                  FieldLabel as (props: {
                    name: string;
                    htmlFor: string;
                  }) => React.JSX.Element | null
                }
              />
            </div>
          </div>
        </div>

        <div className={styles.footerRow}>
          <p className={styles.helperText}>
            Notice how the short masks stay tight while the card field and alphanumeric
            member code size themselves from the pattern.
          </p>

          <button
            type="submit"
            className={styles.submitButton}
          >
            Save mask setup
          </button>
        </div>
      </Form>
    </MaskExampleFrame>
  );
}
