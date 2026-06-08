import { useCallback, useId, useMemo, useState } from 'react';

import type { FieldController } from '@/demoFormBridge';
import { field, useFormBridge } from '@/demoFormBridge';

import styles from './FormExamples.module.css';
import { MaskExampleFrame } from './MaskExampleFrame';
import { createDemoFormUi, simulateSubmitDelay } from './shared';

const ACCESS_CODE_PREFIX = 'OPS';

type CustomMaskSchema = {
  workspaceName: ReturnType<typeof field.text>;
  launchAccessCode: ReturnType<typeof field.masked>;
};

type AccessCodeState = {
  inputValue: string;
  storedValue: string;
  rawValue: string;
  digits: string;
  letters: string;
  complete: boolean;
};

function buildAccessCodeState(source: string): AccessCodeState {
  const upper = source.toUpperCase().replace(/^OPS[-\s]?/, '');
  const digits = upper.replace(/\D/g, '').slice(0, 4);
  const letters = digits.length === 4 ? upper.replace(/[^A-Z]/g, '').slice(0, 2) : '';
  const inputValue = `${digits}${digits.length === 4 ? '-' : ''}${letters}`;
  const storedValue = inputValue ? `${ACCESS_CODE_PREFIX}-${inputValue}` : '';

  return {
    inputValue,
    storedValue,
    rawValue: `${digits}${letters}`,
    digits,
    letters,
    complete: digits.length === 4 && letters.length === 2,
  };
}

const CustomRenderedAccessCodeField = ({
  controller,
}: {
  controller: FieldController<CustomMaskSchema, 'launchAccessCode'>;
}) => {
  const inputId = useId();
  const registerInput = useCallback(
    (node: HTMLInputElement | null) => {
      controller.registerFocusable(node);
    },
    [controller],
  );

  const meta = useMemo(
    () =>
      buildAccessCodeState(typeof controller.value === 'string' ? controller.value : ''),
    [controller.value],
  );

  const helperId = `${inputId}-helper`;
  const helperText =
    controller.error ??
    controller.hint ??
    'The prefix is rendered outside the input. Enter four digits, then two letters.';
  const helperClassName = controller.error
    ? styles.customMaskError
    : styles.customMaskHint;
  const statusLabel = controller.error
    ? 'Needs review'
    : meta.complete
      ? 'Ready to issue'
      : meta.rawValue.length > 0
        ? 'In progress'
        : 'Awaiting entry';
  const statusToneClassName = controller.error
    ? styles.customMaskStatusError
    : meta.complete
      ? styles.customMaskStatusReady
      : styles.customMaskStatusIdle;
  const visiblePlaceholder = (controller.placeholder ?? '2048-QA').replace(
    /^OPS[-\s]?/,
    '',
  );

  return (
    <div className={styles.customMaskField}>
      <div className={styles.customMaskHeader}>
        <label
          htmlFor={inputId}
          className={styles.customMaskLabel}
        >
          <span>{controller.label}</span>
          <span className={styles.customMaskRequired}>*</span>
        </label>

        <span className={`${styles.customMaskStatus} ${statusToneClassName}`}>
          {statusLabel}
        </span>
      </div>

      <div
        className={styles.customMaskShell}
        data-error={controller.error ? 'true' : undefined}
        data-complete={meta.complete ? 'true' : undefined}
      >
        <span className={styles.customMaskPrefix}>{ACCESS_CODE_PREFIX}</span>

        <input
          ref={registerInput}
          id={inputId}
          type="text"
          value={meta.inputValue}
          placeholder={visiblePlaceholder}
          disabled={controller.disabled}
          spellCheck={false}
          inputMode="text"
          maxLength={7}
          autoCapitalize="characters"
          aria-invalid={Boolean(controller.error) || undefined}
          aria-describedby={helperId}
          className={styles.customMaskInput}
          onChange={(event) => {
            controller.onChange(buildAccessCodeState(event.target.value).storedValue);
          }}
          onBlur={controller.onBlur}
          onFocus={controller.onFocus}
        />
      </div>

      <div className={styles.customMaskFooter}>
        <span
          id={helperId}
          className={helperClassName}
        >
          {helperText}
        </span>

        <span className={styles.customMaskMeta}>
          {meta.digits.length}/4 digits · {meta.letters.length}/2 letters
        </span>
      </div>
    </div>
  );
};

export function CustomRenderedMaskExample() {
  const [lastSubmission, setLastSubmission] = useState<unknown>(null);

  const formSchema = useMemo(
    (): CustomMaskSchema => ({
      workspaceName: field
        .text('Workspace')
        .required('Workspace name is required')
        .placeholder('Ops bridge control'),
      launchAccessCode: field
        .masked('OPS-9999-LL')
        .label('Launch access code')
        .placeholder('2048-QA')
        .hint(
          'This field is rendered manually through form.fieldController(...), so the UI is entirely custom.',
        )
        .required('Access code is required')
        .validateComplete('Complete the launch access code.'),
    }),
    [],
  );

  const form = useFormBridge(formSchema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
    globalDefaults: () => createDemoFormUi(styles),
  });

  const { Form, fieldController, fields, state, watchAll } = form;
  const liveValues = watchAll();
  const launchAccessCode = fieldController('launchAccessCode');
  const codeState = buildAccessCodeState(String(liveValues.launchAccessCode ?? ''));

  return (
    <MaskExampleFrame
      maskName="Custom render"
      accent="#fb7185"
      title="Build your own masked input chrome"
      description="This example keeps FormBridge form state, validation, touched state, and submit flow wired up, while rendering the field completely by hand from form.fieldController(...). The prefix shell, status badge, helper row, and imperative focus are all yours."
      highlights={[
        'form.fieldController(...)',
        'Custom prefix + status UI',
        'Form state + focus still wired',
      ]}
      preview={
        <>
          <p className={styles.resolverPreviewValue}>
            {liveValues.launchAccessCode || 'OPS-2048-QA'}
          </p>
          <p className={styles.resolverPreviewMuted}>
            Raw suffix {codeState.rawValue || '2048QA'} ·{' '}
            {codeState.complete ? 'complete and ready' : 'still being composed'}
          </p>
          <div className={styles.points}>
            <span className={styles.point}>Prefix rendered outside the input</span>
            <span className={styles.point}>Imperative focus via controller.focus()</span>
            <span className={styles.point}>You own every DOM node</span>
          </div>
        </>
      }
      parsedSubmission={lastSubmission}
      submittedLabel={
        lastSubmission
          ? `Launch access issued for ${String(liveValues.workspaceName || 'workspace')}`
          : null
      }
      submitError={state.submitError}
      footer="With fieldController, you can keep the field in the schema, but render and drive the UI yourself with the same lifecycle hooks the built-ins use."
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
          <CustomRenderedAccessCodeField controller={launchAccessCode} />
        </div>

        <div className={styles.footerRow}>
          <p className={styles.helperText}>
            The custom field is fully manual, but still validates on blur and can be
            focused programmatically.
          </p>

          <div className={styles.actionRow}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => launchAccessCode.focus()}
            >
              Focus code field
            </button>

            <Form.Submit
              className={styles.submitButton}
              loadingText="Issuing access…"
            >
              Save launch code
            </Form.Submit>
          </div>
        </div>
      </Form>
    </MaskExampleFrame>
  );
}
