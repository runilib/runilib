import { useMemo, useState } from 'react';

import { field, type PhoneValue, useFormBridge } from '@runilib/react-formbridge';

import { FieldVariantFrame } from './FieldVariantFrame';
import styles from './FormExamples.module.css';
import { NativeField } from './nativeFormHelpers';
import { simulateSubmitDelay } from './shared';

type PhoneVariantValues = {
  supportLine: PhoneValue | null;
  salesHotline: string | null;
  executiveDesk: PhoneValue | null;
};

function describePhone(value: PhoneValue | string | null | undefined): string {
  if (!value) {
    return 'Nothing selected yet';
  }

  if (typeof value === 'string') {
    return value;
  }

  return `${value.country} · ${value.e164 || value.national}`;
}

function countResolvedPhones(values: PhoneVariantValues): number {
  return [values.supportLine, values.salesHotline, values.executiveDesk].filter(Boolean)
    .length;
}

export function PhoneVariantsExample() {
  const [lastSubmission, setLastSubmission] = useState<PhoneVariantValues | null>(null);

  const schema = useMemo(
    () => ({
      supportLine: field
        .phone('Support line')
        .required()
        .defaultCountry('FR')
        .countryLayout('detached')
        .preferredCountries(['FR', 'BE', 'CH', 'CA'])
        .hint(
          'Searchable country picker with a richer trigger, custom option rows, and formatted storage preview.',
        ),
      salesHotline: field
        .phone('Sales hotline')
        .required()
        .defaultCountry('US')
        .countryLayout('integrated')
        .preferredCountries(['US', 'CA', 'GB'])
        .storeE164()
        .hint(
          'Stores a plain E.164 string while still letting the UI speak in market-specific language.',
        ),
      executiveDesk: field
        .phone('Executive desk')
        .defaultCountry('GB')
        .countryLayout('integrated')
        .preferredCountries(['GB', 'AE', 'SG'])
        .showDialCode(false)
        .hint(
          'Minimal country trigger with a cleaner summary and a more editorial E.164 helper.',
        ),
    }),
    [],
  );

  const form = useFormBridge(schema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
  });

  const { Form, FieldError, FieldLabel, fieldController, watchAll } = form;
  const values = watchAll() as PhoneVariantValues;
  const resolvedCount = countResolvedPhones(values);

  return (
    <FieldVariantFrame
      familyName="Phone"
      accent="#22c55e"
      title="Country pickers, integrated layouts, and custom market language"
      description="The phone field now supports both integrated and detached country triggers, plus the same kind of copy and render overrides as the password and file fields."
      highlights={[
        'integrated or detached layout',
        'custom country trigger',
        'custom option rows',
        'search empty state',
        'custom E.164 helper',
      ]}
      preview={
        <>
          <p className={styles.resolverPreviewValue}>{resolvedCount} routes resolved</p>
          <p className={styles.resolverPreviewMuted}>
            Support: {describePhone(values.supportLine)}. Sales:{' '}
            {describePhone(values.salesHotline)}. Executive:{' '}
            {describePhone(values.executiveDesk)}.
          </p>
        </>
      }
      snapshot={lastSubmission ?? values}
      submittedLabel={
        lastSubmission ? 'Saved the phone playbook with all three routing recipes.' : null
      }
      footer="Use the phone builder for country behavior and storage, then pick an integrated or detached trigger layout and make the picker sound like your product instead of a generic telecom widget."
    >
      <Form
        className={styles.resolverForm}
        onSubmit={async (submittedValues) => {
          await simulateSubmitDelay(320);
          setLastSubmission(submittedValues as PhoneVariantValues);
        }}
      >
        <NativeField
          controller={fieldController('supportLine')}
          FieldError={FieldError}
          FieldLabel={FieldLabel}
          type="tel"
          className={styles.formField}
          inputClassName={styles.formInput}
        />
        <NativeField
          controller={fieldController('salesHotline')}
          FieldError={FieldError}
          FieldLabel={FieldLabel}
          type="tel"
          className={styles.formField}
          inputClassName={styles.formInput}
        />
        <NativeField
          controller={fieldController('executiveDesk')}
          FieldError={FieldError}
          FieldLabel={FieldLabel}
          type="tel"
          className={styles.formField}
          inputClassName={styles.formInput}
        />

        <button
          type="submit"
          className={styles.submitButton}
        >
          Save phone playbook
        </button>
      </Form>
    </FieldVariantFrame>
  );
}
