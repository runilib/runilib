import { useMemo, useState } from 'react';

import { field, useFormBridge, valibotResolver } from '@runilib/react-formbridge';

import * as v from 'valibot';
import styles from './FormExamples.module.css';
import { ResolverExampleFrame } from './ResolverExampleFrame';
import { createDemoFormUi, DEMO_PLANS, simulateSubmitDelay } from './shared';

export function ValibotResolverExample() {
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

  const resolver = useMemo(
    () =>
      valibotResolver(schema, {
        module: v as NonNullable<Parameters<typeof valibotResolver>[1]>['module'],
        mode: 'sync',
      }),
    [schema],
  );

  const form = useFormBridge(formSchema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
    globalStyles: () => createDemoFormUi(styles),
    resolver,
  });

  const { Form, fields, state, watchAll } = form;

  const liveValues = watchAll();
  const planLabel =
    DEMO_PLANS.find((item) => item.value === liveValues.plan)?.label ??
    'No plan selected';

  return (
    <ResolverExampleFrame
      resolverName="Valibot"
      accent="#a78bfa"
      title="Billing enrollment"
      description="A compact option when you want composable validation pipelines, excellent tree-shaking, and explicit control over the parsing module."
      highlights={['Composable pipelines', 'Module injection', 'Tree-shakable']}
      preview={
        <>
          <p className={styles.resolverPreviewValue}>{planLabel}</p>
          <p className={styles.resolverPreviewMuted}>
            This example passes `{` module: v `}` explicitly so the resolver stays stable
            in ESM and browser-first environments.
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
          <fields.plan />
          <fields.cardholder />
        </div>

        <div className={styles.formRow}>
          <fields.receiptEmail />
          <fields.cardLast4 />
        </div>

        <div className={styles.footerRow}>
          <p className={styles.helperText}>
            Valibot is lean, explicit, and easy to wire when you already think in small
            validation pipes.
          </p>

          <Form.Submit
            className={styles.submitButton}
            loadingText="Parsing with Valibot…"
          >
            Validate with Valibot
          </Form.Submit>
        </div>
      </Form>
    </ResolverExampleFrame>
  );
}
