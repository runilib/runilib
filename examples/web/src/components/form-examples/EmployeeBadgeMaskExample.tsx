import { useId, useMemo, useState } from 'react';

import { field, useFormBridge } from '@runilib/react-formbridge';

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
      <FieldLabel name={controller.name} htmlFor={id} />
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

export function EmployeeBadgeMaskExample() {
  const [lastSubmission, setLastSubmission] = useState<unknown>(null);

  const formSchema = useMemo(
    () => ({
      teammateName: field
        .text()
        .required('Teammate name is required')
        .placeholder('Ava Stone'),
      badgeCode: field
        .masked('EMP-9999-LL')
        .tokens({
          L: /[A-Z]/,
        })
        .required('Badge code is required')
        .showMaskInPlaceholder()
        .uppercase()
        .validateComplete('Complete the badge code.'),
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
      maskName="Badge code"
      accent="#a78bfa"
      title="Employee access badge issuance"
      description="Fixed prefixes also work well with custom masks when you need a recognizable internal format like HR or security badge codes."
      highlights={['Fixed prefix', 'Team-friendly code', 'Custom suffix letters']}
      preview={
        <>
          <p className={styles.resolverPreviewValue}>
            {String(liveValues.badgeCode ?? 'EMP-2048-AX')}
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
          ? `Badge created for ${String(liveValues.teammateName ?? 'teammate')}`
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
          <NativeField
            controller={fieldController('teammateName') as ManualController}
            FieldError={FieldError as (props: { name: string }) => React.JSX.Element | null}
            FieldLabel={FieldLabel as (props: { name: string; htmlFor: string }) => React.JSX.Element | null}
          />
          <NativeField
            controller={fieldController('badgeCode') as ManualController}
            FieldError={FieldError as (props: { name: string }) => React.JSX.Element | null}
            FieldLabel={FieldLabel as (props: { name: string; htmlFor: string }) => React.JSX.Element | null}
          />
        </div>

        <div className={styles.footerRow}>
          <p className={styles.helperText}>
            Example format: fixed EMP- prefix, four digits, then two uppercase letters.
          </p>

          <button type="submit" className={styles.submitButton}>
            Issue badge
          </button>
        </div>
      </Form>
    </MaskExampleFrame>
  );
}
