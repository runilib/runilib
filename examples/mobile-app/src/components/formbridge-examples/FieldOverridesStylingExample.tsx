import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { field, useFormBridge } from '@runilib/react-formbridge';

import { formExampleStyles as s } from './FormExamples.styles';
import { NativeField, NativeSubmit } from './nativeFormHelpers';
import { StylingExampleCard } from './StylingExampleCard';
import { simulateSubmitDelay } from './shared';

export function FieldOverridesStylingExample() {
  const [lastSubmission, setLastSubmission] = useState<unknown>(null);

  const schema = useMemo(
    () => ({
      receiptEmail: field
        .email()
        .required('Receipt email is required')
        .placeholder('billing@runilib.dev'),
      postalCode: field.text().required('Postal code is required').placeholder('75002'),
      cardholder: field
        .text()
        .required('Cardholder is required')
        .placeholder('Ava Stone'),
      specialInstructions: field
        .textarea()
        .hint('Great for delivery notes or internal finance context.')
        .placeholder('Leave the invoice open for 14 days.'),
    }),
    [],
  );

  const form = useFormBridge(schema, {
    validateOn: 'onTouched',
  });

  const { Form, fieldController, state, watchAll } = form;
  const liveValues = watchAll();

  return (
    <StylingExampleCard
      recipeName="Field overrides"
      accent="#f59e0b"
      title="Style the form with plain objects and local overrides"
      description="This recipe uses only native style objects, a global props theme, and one-off field props overrides. No styling library is required."
      highlights={[
        'inline native styles',
        'custom required mark',
        'one-off field override',
      ]}
      preview={
        <>
          <Text style={s.previewValue}>
            {String(liveValues.cardholder || 'Ava Stone')}
          </Text>
          <Text style={s.previewText}>
            Receipt destination:{' '}
            {String(liveValues.receiptEmail || 'billing@runilib.dev')}.
          </Text>
        </>
      }
      submittedPayload={lastSubmission}
      submittedLabel={
        lastSubmission
          ? `Inline theme saved for ${String(liveValues.cardholder || 'customer')}`
          : null
      }
      submitError={state.submitError}
      footer="This is the lightest option when you just want to prove the styling API or ship a theme without adding another styling dependency."
    >
      <Form
        onSubmit={async (values) => {
          await simulateSubmitDelay();
          setLastSubmission(values);
        }}
      >
        <View style={s.sectionBlock}>
          <Text style={s.sectionBlockTitle}>Billing context</Text>

          <NativeField controller={fieldController('receiptEmail')} />

          <View style={s.formRow}>
            <View style={s.halfField}>
              <NativeField controller={fieldController('postalCode')} />
            </View>
            <View style={s.halfField}>
              <NativeField controller={fieldController('cardholder')} />
            </View>
          </View>

          <NativeField controller={fieldController('specialInstructions')} />
        </View>

        <NativeSubmit onPress={() => void form.submit()}>
          Save field override recipe
        </NativeSubmit>
      </Form>
    </StylingExampleCard>
  );
}
