import { useMemo, useState } from 'react';

import { field, useFormBridge, yupResolver } from '@runilib/react-formbridge';

import * as yup from 'yup';
import styles from './FormExamples.module.css';
import { ResolverExampleFrame } from './ResolverExampleFrame';
import { createDemoFormUi, simulateSubmitDelay } from './shared';

export function YupResolverExample() {
  const [lastSubmission, setLastSubmission] = useState<unknown>(null);

  const formSchema = useMemo(
    () => ({
      companyName: field.text().label('Company name').placeholder('Runilib Studio'),
      website: field.url().label('Website').placeholder('https://runilib.dev'),
      monthlyBudget: field.text().label('Monthly budget').placeholder('2500'),
      acceptsPilot: field
        .checkbox()
        .label('Approve pilot terms')
        .hint('Required before the pilot request can move forward.'),
    }),
    [],
  );

  const schema = useMemo(
    () =>
      yup.object({
        companyName: yup
          .string()
          .trim()
          .min(2, 'Add a company name.')
          .required('Required'),
        website: yup.string().trim().url('Use a full https:// URL.').required('Required'),
        monthlyBudget: yup
          .number()
          .transform((value, originalValue) => {
            return String(originalValue).trim() === '' ? undefined : value;
          })
          .typeError('Use a numeric monthly budget.')
          .min(500, 'Budget should start at 500.')
          .required('Required'),
        acceptsPilot: yup.boolean().oneOf([true], 'You need to approve the pilot terms.'),
      }),
    [],
  );

  const resolver = useMemo(() => yupResolver(schema, { mode: 'sync' }), [schema]);

  const form = useFormBridge(formSchema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
    globalStyles: () => createDemoFormUi(styles),
    resolver,
  });

  const { Form, fields, state, watchAll } = form;

  const liveValues = watchAll();

  return (
    <ResolverExampleFrame
      resolverName="Yup"
      accent="#34d399"
      title="Pilot qualification form"
      description="Useful when your team already models product or API validation with Yup and wants the same chainable style in the UI layer."
      highlights={['Chainable API', 'Number casting', 'Boolean constraints']}
      preview={
        <>
          <p className={styles.resolverPreviewValue}>
            {liveValues.companyName || 'Pilot company'}
          </p>
          <p className={styles.resolverPreviewMuted}>
            Yup casts the budget into a number and blocks submission until the opt-in flag
            is explicitly accepted.
          </p>
        </>
      }
      parsedSubmission={lastSubmission}
      submittedLabel={
        lastSubmission
          ? `Pilot request queued for ${String(liveValues.companyName || 'company')}`
          : null
      }
      submitError={state.submitError}
      footer="Yup is a strong fit when you want readable chained rules and painless casting for common business forms."
    >
      <Form
        className={styles.resolverForm}
        onSubmit={async (values) => {
          await simulateSubmitDelay();
          setLastSubmission(values);
        }}
      >
        <div className={styles.formRow}>
          <fields.companyName />
          <fields.website />
        </div>

        <fields.monthlyBudget />
        <fields.acceptsPilot />

        <div className={styles.footerRow}>
          <p className={styles.helperText}>
            Budget stays simple in the input, then Yup casts it before submit.
          </p>

          <Form.Submit
            className={styles.submitButton}
            loadingText="Checking with Yup…"
          >
            Validate with Yup
          </Form.Submit>
        </div>
      </Form>
    </ResolverExampleFrame>
  );
}
