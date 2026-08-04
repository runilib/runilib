import { useMemo, useState } from 'react';

import { field, useFormBridge, valibotBridge } from '@runilib/react-formbridge';

import * as v from 'valibot';
import { BridgeExampleFrame } from './BridgeExampleFrame';
import styles from './FormExamples.module.css';
import { NativeField, NativeSelectField } from './nativeFormHelpers';
import { DEMO_PLANS, simulateSubmitDelay } from './shared';

export function ValibotBridgeExample() {
  const [lastSubmission, setLastSubmission] = useState<unknown>(null);

  const formSchema = useMemo(
    () => ({
      plan: field.select().label('Plan').options(DEMO_PLANS),
      cardholder: field.text().label('Cardholder').placeholder('Ava Stone'),
      receiptEmail: field
        .email()
        .label('Receipt email')
        .placeholder('billing@runilib.dev'),
      cardLast4: field.text().label('Card last 4').placeholder('1842'),
    }),
    [],
  );

  const schema = useMemo(
    () =>
      v.object({
        plan: v.pipe(
          v.string(),
          v.picklist(['starter', 'scale', 'enterprise'], 'Choose a plan.'),
        ),
        cardholder: v.pipe(
          v.string(),
          v.trim(),
          v.minLength(2, 'Cardholder name is required.'),
        ),
        receiptEmail: v.pipe(v.string(), v.trim(), v.email('Use a valid receipt email.')),
        cardLast4: v.pipe(
          v.string(),
          v.trim(),
          v.regex(/^\d{4}$/, 'Use exactly four digits.'),
        ),
      }),
    [],
  );

  const bridge = useMemo(
    () =>
      valibotBridge(schema, {
        module: v as NonNullable<Parameters<typeof valibotBridge>[1]>['module'],
        mode: 'sync',
      }),
    [schema],
  );

  const form = useFormBridge(formSchema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
    validatorBridge: bridge,
  });

  const { Form, FieldError, FieldLabel, fieldController, state, watchAll } = form;

  const liveValues = watchAll();
  const planLabel =
    DEMO_PLANS.find((item) => item.value === liveValues.plan)?.label ??
    'No plan selected';

  return (
    <BridgeExampleFrame
      bridgeName="Valibot"
      accent="#a78bfa"
      title="Billing enrollment"
      description="A compact option when you want composable validation pipelines, excellent tree-shaking, and explicit control over the parsing module."
      highlights={['Composable pipelines', 'Module injection', 'Tree-shakable']}
      preview={
        <>
          <p className={styles.resolverPreviewValue}>{planLabel}</p>
          <p className={styles.resolverPreviewMuted}>
            This example passes `{` module: v `}` explicitly so the bridge stays stable in
            ESM and browser-first environments.
          </p>
        </>
      }
      parsedSubmission={lastSubmission}
      submittedLabel={
        lastSubmission ? `Enrollment ready for ${String(planLabel).toLowerCase()}` : null
      }
      submitError={state.submitError}
      footer="Valibot works especially well when bundle size matters and you want reusable validation pipelines."
    >
      <Form
        className={styles.resolverForm}
        onSubmit={async (values) => {
          await simulateSubmitDelay();
          setLastSubmission(values);
        }}
      >
        <div className={styles.formRow}>
          <NativeSelectField
            controller={fieldController('plan') as never}
            FieldError={
              FieldError as (props: { name: string }) => React.JSX.Element | null
            }
            FieldLabel={
              FieldLabel as (props: {
                name: string;
                htmlFor?: string;
              }) => React.JSX.Element | null
            }
            className={styles.formField}
            selectClassName={styles.formInput}
          />
          <NativeField
            controller={fieldController('cardholder') as never}
            FieldError={
              FieldError as (props: { name: string }) => React.JSX.Element | null
            }
            FieldLabel={
              FieldLabel as (props: {
                name: string;
                htmlFor?: string;
              }) => React.JSX.Element | null
            }
            className={styles.formField}
            inputClassName={styles.formInput}
          />
        </div>

        <div className={styles.formRow}>
          <NativeField
            controller={fieldController('receiptEmail') as never}
            FieldError={
              FieldError as (props: { name: string }) => React.JSX.Element | null
            }
            FieldLabel={
              FieldLabel as (props: {
                name: string;
                htmlFor?: string;
              }) => React.JSX.Element | null
            }
            type="email"
            className={styles.formField}
            inputClassName={styles.formInput}
          />
          <NativeField
            controller={fieldController('cardLast4') as never}
            FieldError={
              FieldError as (props: { name: string }) => React.JSX.Element | null
            }
            FieldLabel={
              FieldLabel as (props: {
                name: string;
                htmlFor?: string;
              }) => React.JSX.Element | null
            }
            className={styles.formField}
            inputClassName={styles.formInput}
          />
        </div>

        <div className={styles.footerRow}>
          <p className={styles.helperText}>
            Valibot is lean, explicit, and easy to wire when you already think in small
            validation pipes.
          </p>

          <button
            type="submit"
            className={styles.submitButton}
          >
            Validate with Valibot
          </button>
        </div>
      </Form>
    </BridgeExampleFrame>
  );
}
