import { useMemo, useState } from 'react';

import { field, useFormBridge, zodBridge } from '@runilib/react-formbridge';

import { z } from 'zod';
import { BridgeExampleFrame } from './BridgeExampleFrame';
import styles from './FormExamples.module.css';
import { createDemoFormUi, simulateSubmitDelay } from './shared';

export function ZodBridgeExample() {
  const [lastSubmission, setLastSubmission] = useState<unknown>(null);

  const formSchema = useMemo(
    () => ({
      workspaceName: field.text().label('Workspace name').placeholder('Runi Commerce'),
      contactEmail: field
        .email()
        .label('Contact email')
        .placeholder('founder@runilib.dev'),
      teamSize: field.text().label('Team size').placeholder('12'),
      launchDate: field.date().label('Launch date').placeholder('2026-05-10'),
    }),
    [],
  );

  const schema = useMemo(
    () =>
      z.object({
        workspaceName: z.string().trim().min(3, 'Use at least 3 characters.'),
        contactEmail: z.string().trim().email('Use a valid email address.'),
        teamSize: z.coerce.number().int().min(2, 'Plan for at least 2 seats.'),
        launchDate: z.string().trim().min(1, 'Pick a launch date.'),
      }),
    [],
  );

  const bridge = useMemo(
    () => zodBridge(schema as Parameters<typeof zodBridge>[0], { mode: 'auto' }),
    [schema],
  );

  const form = useFormBridge(formSchema, {
    validateOn: 'onBlur',
    globalDefaults: () => createDemoFormUi(styles),
    validatorBridge: bridge,
  });

  const { Form, fields, state, watchAll } = form;

  const liveValues = watchAll();

  return (
    <BridgeExampleFrame
      bridgeName="Zod"
      accent="#fb923c"
      title="Product launch intake"
      description="Great when you want one schema to validate raw inputs and return a strongly typed payload to your submit handler."
      highlights={['Number coercion', 'Typed output', 'Trimmed strings']}
      preview={
        <>
          <p className={styles.resolverPreviewValue}>
            {liveValues.workspaceName || 'New workspace'}
          </p>
          <p className={styles.resolverPreviewMuted}>
            Team size stays a text input in the UI, then Zod coerces it into a number for
            the final payload.
          </p>
        </>
      }
      parsedSubmission={lastSubmission}
      submittedLabel={
        lastSubmission
          ? `Payload saved for ${String(liveValues.workspaceName || 'workspace')}`
          : null
      }
      submitError={state.submitError}
      footer="Use Zod when you also want TypeScript inference around the exact payload that leaves the form."
    >
      <Form
        className={styles.resolverForm}
        onSubmit={async (values) => {
          await simulateSubmitDelay();
          setLastSubmission(values);
        }}
      >
        <div className={styles.formRow}>
          <fields.workspaceName />
          <fields.contactEmail />
        </div>

        <div className={styles.formRow}>
          <fields.teamSize />
          <fields.launchDate />
        </div>

        <div className={styles.footerRow}>
          <p className={styles.helperText}>
            Submit and inspect how `teamSize` comes back as a real number.
          </p>

          <Form.Submit
            className={styles.submitButton}
            loadingText="Normalizing with Zod…"
          >
            Validate with Zod
          </Form.Submit>
        </div>
      </Form>
    </BridgeExampleFrame>
  );
}
