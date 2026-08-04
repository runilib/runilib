import { useMemo, useState } from 'react';
import { Text } from 'react-native';

import { field, type PhoneValue, useFormBridge } from '@runilib/react-formbridge';

import { FieldVariantCard } from './FieldVariantCard';
import { formExampleStyles as s } from './FormExamples.styles';
import { NativeField, NativeSubmit } from './nativeFormHelpers';
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
          'Searchable picker with custom country rows and a friendlier support-routing summary.',
        ),
      salesHotline: field
        .phone('Sales hotline')
        .required()
        .defaultCountry('US')
        .countryLayout('integrated')
        .preferredCountries(['US', 'CA', 'GB'])
        .storeE164()
        .hint(
          'Stores a plain E.164 string while the picker copy stays product-specific.',
        ),
      executiveDesk: field
        .phone('Executive desk')
        .defaultCountry('GB')
        .countryLayout('integrated')
        .preferredCountries(['GB', 'AE', 'SG'])
        .showDialCode(false)
        .hint('Minimal country trigger and cleaner directory formatting.'),
    }),
    [],
  );

  const form = useFormBridge(schema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
  });

  const { Form, fieldController, watchAll } = form;
  const values = watchAll() as PhoneVariantValues;
  const resolvedCount = countResolvedPhones(values);

  return (
    <FieldVariantCard
      familyName="Phone"
      accent="#22c55e"
      title="Country pickers, integrated layouts, and custom routing language"
      description="These phone recipes keep the built-in renderer, but now let you choose whether the country trigger stays integrated with the input or sits as a detached picker beside it."
      highlights={[
        'integrated or detached layout',
        'custom country trigger',
        'custom option rows',
        'search empty state',
        'custom E.164 helper',
      ]}
      preview={
        <>
          <Text style={s.previewValue}>{resolvedCount} routes resolved</Text>
          <Text style={s.previewText}>
            Support: {describePhone(values.supportLine)}. Sales:{' '}
            {describePhone(values.salesHotline)}. Executive:{' '}
            {describePhone(values.executiveDesk)}.
          </Text>
        </>
      }
      snapshot={lastSubmission ?? values}
      submittedLabel={
        lastSubmission ? 'Saved the phone playbook with all three routing recipes.' : null
      }
      footer="Use the builder for country behavior and storage, then choose an integrated or detached trigger layout and tailor the picker copy with phone overrides."
    >
      <Form
        onSubmit={async (submittedValues) => {
          await simulateSubmitDelay(320);
          setLastSubmission(submittedValues as PhoneVariantValues);
        }}
      >
        <NativeField controller={fieldController('supportLine')} />
        <NativeField controller={fieldController('salesHotline')} />
        <NativeField controller={fieldController('executiveDesk')} />

        <NativeSubmit onPress={() => void form.submit()}>
          Save phone playbook
        </NativeSubmit>
      </Form>
    </FieldVariantCard>
  );
}
