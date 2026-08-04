import { useMemo, useState } from 'react';

import { field, useFormBridge } from '@runilib/react-formbridge';

import styles from './FormExamples.module.css';
import { MaskExampleFrame } from './MaskExampleFrame';
import { NativeField } from './nativeFormHelpers';
import { simulateSubmitDelay } from './shared';

export function LicensePlateMaskExample() {
  const [lastSubmission, setLastSubmission] = useState<unknown>(null);
  const formSchema = useMemo(
    () => ({
      vehicleName: field
        .text()
        .required('Vehicle label is required')
        .placeholder('North district van'),
      licensePlate: field
        .masked('LL-999-LL')
        .tokens({
          L: /[A-Z]/,
        })
        .required('License plate is required')
        .showMaskInPlaceholder()
        .uppercase()
        .validateComplete('Complete the license plate.'),
    }),
    [],
  );

  const form = useFormBridge(formSchema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
  });

  const { Form, FieldError, FieldLabel, fieldController, state, watchAll } = form;
  const liveValues = watchAll();

  return (
    <MaskExampleFrame
      maskName="License plate"
      accent="#38bdf8"
      title="Fleet registration tracking"
      description="A custom mask is perfect when the value is business-specific and no built-in preset should own the format."
      highlights={[
        'Custom pattern string',
        'Uppercase letters only',
        'Readable separators',
      ]}
      preview={
        <>
          <p className={styles.resolverPreviewValue}>
            {String(liveValues.licensePlate ?? 'AB-123-CD')}
          </p>
          <p className={styles.resolverPreviewMuted}>
            The plate stays easy to scan for operations teams while still storing a
            formatted masked value by default.
          </p>
        </>
      }
      parsedSubmission={lastSubmission}
      submittedLabel={
        lastSubmission
          ? `Vehicle ${String(liveValues.vehicleName || 'record')} saved`
          : null
      }
      submitError={state.submitError}
      footer="Use this pattern when you own the identifier format and want the input to teach the structure as the user types."
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
            controller={fieldController('vehicleName') as never}
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
          <NativeField
            controller={fieldController('licensePlate') as never}
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
            Example format: two letters, three digits, then two letters.
          </p>

          <button
            type="submit"
            className={styles.submitButton}
          >
            Save plate
          </button>
        </div>
      </Form>
    </MaskExampleFrame>
  );
}
