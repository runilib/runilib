import { useMemo, useState } from 'react';

import { field, useFormBridge } from '@runilib/react-formbridge';

import styles from './FormExamples.module.css';
import { StylingExampleFrame } from './StylingExampleFrame';
import { CUSTOMER_DEPARTMENTS, createDemoFormUi, simulateSubmitDelay } from './shared';

export function CssModulesStylingExample() {
  const [lastSubmission, setLastSubmission] = useState<unknown>(null);

  const schema = useMemo(
    () => ({
      projectName: field
        .text()
        .label('Project name')
        .required('Project name is required')
        .trim()
        .placeholder('Billing redesign'),
      ownerEmail: field
        .email()
        .required('Owner email is required')
        .trim()
        .placeholder('owner@runilib.dev'),
      department: field
        .select()
        .options(CUSTOMER_DEPARTMENTS)
        .required('Pick a department'),
      launchNotes: field
        .textarea()
        .required()
        .placeholder('Describe the tone, audience, and review plan.')
        .hint(
          'Textarea inherits the same CSS Modules theme through the shared props layer.',
        ),
    }),
    [],
  );

  const form = useFormBridge(schema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
    globalDefaults: () => createDemoFormUi(styles),
  });

  const { Form, fields, state, watchAll } = form;
  const liveValues = watchAll();
  const departmentLabel =
    CUSTOMER_DEPARTMENTS.find((item) => item.value === liveValues.department)?.label ??
    'No department yet';

  return (
    <StylingExampleFrame
      recipeName="CSS Modules"
      accent="#f59e0b"
      title="Apply one props theme to every generated field"
      description="This mirrors the dashboard strategy: CSS Modules define the chrome once, then useFormBridge applies it to inputs, textareas, select fields, and submit buttons."
      highlights={[
        'global props theme',
        'shared class names',
        'screen-level consistency',
      ]}
      preview={
        <>
          <p className={styles.resolverPreviewValue}>
            {liveValues.projectName || 'Billing redesign'}
          </p>
          <p className={styles.resolverPreviewMuted}>
            Current owner: {liveValues.ownerEmail || 'owner@runilib.dev'}.
          </p>
          <div className={styles.previewDepartment}>{departmentLabel}</div>
        </>
      }
      submittedPayload={lastSubmission}
      submittedLabel={
        lastSubmission
          ? `CSS Modules theme shipped for ${String(liveValues.projectName || 'project')}`
          : null
      }
      submitError={state.submitError}
      footer="Choose this pattern when your web app already uses CSS Modules and you want the formbridge fields to drop into the same design language immediately."
    >
      <Form
        className={styles.resolverForm}
        onSubmit={async (values) => {
          await simulateSubmitDelay();
          setLastSubmission(values);
        }}
      >
        <div className={styles.formRow}>
          <fields.projectName />
          <fields.ownerEmail
            autoComplete="email"
            inputMode="email"
          />
        </div>

        <fields.department
          styles={{
            select: {
              background: 'rgba(17, 24, 39, 0.76)',
              borderColor: 'rgba(245, 158, 11, 0.24)',
            },
          }}
        />

        <fields.launchNotes />

        <div className={styles.footerRow}>
          <p className={styles.helperText}>
            CSS Modules provide the global theme, while one field still gets a local
            variation.
          </p>

          <Form.Submit
            className={styles.submitButton}
            loadingText="Applying module theme..."
          >
            Save CSS recipe
          </Form.Submit>
        </div>
      </Form>
    </StylingExampleFrame>
  );
}
