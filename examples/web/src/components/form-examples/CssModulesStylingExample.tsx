import { useId, useMemo, useState } from 'react';

import { field, useFormBridge } from '@runilib/react-formbridge';

import styles from './FormExamples.module.css';
import { StylingExampleFrame } from './StylingExampleFrame';
import { CUSTOMER_DEPARTMENTS, simulateSubmitDelay } from './shared';

type ManualController = {
  name: string;
  value: unknown;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  onFocus: () => void;
  options?: Array<{ label: string; value: string | number }>;
};

function NativeField({
  controller,
  FieldError,
  FieldLabel,
  type = 'text',
  textarea = false,
}: {
  controller: ManualController;
  FieldError: (props: { name: string }) => React.JSX.Element | null;
  FieldLabel: (props: { name: string; htmlFor: string }) => React.JSX.Element | null;
  type?: string;
  textarea?: boolean;
}) {
  const id = useId();
  const value = controller.value ?? '';

  return (
    <div className={styles.fieldBlock}>
      <FieldLabel name={controller.name} htmlFor={id} />
      {textarea ? (
        <textarea
          id={id}
          value={String(value)}
          onChange={(event) => controller.onChange(event.target.value)}
          onBlur={controller.onBlur}
          onFocus={controller.onFocus}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={String(value)}
          onChange={(event) => controller.onChange(event.target.value)}
          onBlur={controller.onBlur}
          onFocus={controller.onFocus}
        />
      )}
      <FieldError name={controller.name} />
    </div>
  );
}

function NativeSelectField({
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
    <div className={styles.fieldBlock}>
      <FieldLabel name={controller.name} htmlFor={id} />
      <select
        id={id}
        value={String(value)}
        onChange={(event) => controller.onChange(event.target.value)}
        onBlur={controller.onBlur}
        onFocus={controller.onFocus}
      >
        {controller.options?.map((option) => (
          <option key={String(option.value)} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldError name={controller.name} />
    </div>
  );
}

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
  });

  const { Form, FieldError, FieldLabel, fieldController, state, watchAll } = form;
  const liveValues = watchAll() as Record<string, unknown>;
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
            {String(liveValues.projectName ?? 'Billing redesign')}
          </p>
          <p className={styles.resolverPreviewMuted}>
            Current owner: {String(liveValues.ownerEmail ?? 'owner@runilib.dev')}.
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
          <NativeField
            controller={fieldController('projectName') as ManualController}
            FieldError={FieldError as (props: { name: string }) => React.JSX.Element | null}
            FieldLabel={FieldLabel as (props: { name: string; htmlFor: string }) => React.JSX.Element | null}
          />
          <NativeField
            controller={fieldController('ownerEmail') as ManualController}
            FieldError={FieldError as (props: { name: string }) => React.JSX.Element | null}
            FieldLabel={FieldLabel as (props: { name: string; htmlFor: string }) => React.JSX.Element | null}
            type="email"
          />
        </div>

        <NativeSelectField
          controller={fieldController('department') as ManualController}
          FieldError={FieldError as (props: { name: string }) => React.JSX.Element | null}
          FieldLabel={FieldLabel as (props: { name: string; htmlFor: string }) => React.JSX.Element | null}
        />

        <NativeField
          controller={fieldController('launchNotes') as ManualController}
          FieldError={FieldError as (props: { name: string }) => React.JSX.Element | null}
          FieldLabel={FieldLabel as (props: { name: string; htmlFor: string }) => React.JSX.Element | null}
          textarea
        />

        <div className={styles.footerRow}>
          <p className={styles.helperText}>
            CSS Modules provide the global theme, while one field still gets a local
            variation.
          </p>

          <button type="submit" className={styles.submitButton}>
            Save CSS recipe
          </button>
        </div>
      </Form>
    </StylingExampleFrame>
  );
}
