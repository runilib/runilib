import { useMemo, useState } from 'react';

import { field, useFormBridge } from '@runilib/react-formbridge';

import styles from './FormExamples.module.css';
import { MaskExampleFrame } from './MaskExampleFrame';
import { createDemoFieldAppearance, simulateSubmitDelay } from './shared';

export function EmployeeBadgeMaskExample() {
  const [lastSubmission, setLastSubmission] = useState<unknown>(null);

  const formSchema = useMemo(() => {
    const { baseFieldAppearance, compactFieldAppearance } =
      createDemoFieldAppearance(styles);

    return {
      teammateName: field
        .text('Teammate name')
        .required('Teammate name is required')
        .placeholder('Ava Stone')
        .appearance(baseFieldAppearance),
      badgeCode: field
        .masked('Badge code', 'EMP-9999-LL')
        .tokens({
          L: /[A-Z]/,
        })
        .required('Badge code is required')
        .showMaskInPlaceholder()
        .uppercase()
        .validateComplete('Complete the badge code.')
        .appearance(compactFieldAppearance),
    };
  }, []);

  const form = useFormBridge(formSchema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
  });

  const { Form, fields, state, watchAll } = form;
  const liveValues = watchAll();

  return (
    <MaskExampleFrame
      maskName="Badge code"
      accent="#a78bfa"
      title="Employee access badge issuance"
      description="Fixed prefixes also work well with custom masks when you need a recognizable internal format like HR or security badge codes."
      highlights={['Fixed prefix', 'Team-friendly code', 'Custom suffix letters']}
      preview={
        <>
          <p className={styles.resolverPreviewValue}>
            {liveValues.badgeCode || 'EMP-2048-AX'}
          </p>
          <p className={styles.resolverPreviewMuted}>
            The static prefix is rendered automatically while the mask keeps the numeric
            and alphabetic sections in order, then submits the formatted value as-is.
          </p>
        </>
      }
      parsedSubmission={lastSubmission}
      submittedLabel={
        lastSubmission
          ? `Badge created for ${String(liveValues.teammateName || 'teammate')}`
          : null
      }
      submitError={state.submitError}
      footer="This kind of custom mask is useful for HR, security, warehouse, or CRM identifiers that have a fixed prefix plus a structured suffix."
    >
      <Form
        className={styles.resolverForm}
        onSubmit={async (values) => {
          await simulateSubmitDelay();
          setLastSubmission(values);
        }}
      >
        <div className={styles.formRow}>
          <fields.teammateName />
          <fields.badgeCode />
        </div>

        <div className={styles.footerRow}>
          <p className={styles.helperText}>
            Example format: fixed `EMP-` prefix, four digits, then two uppercase letters.
          </p>

          <Form.Submit
            className={styles.submitButton}
            loadingText="Issuing badge…"
          >
            Issue badge
          </Form.Submit>
        </div>
      </Form>
    </MaskExampleFrame>
  );
}
