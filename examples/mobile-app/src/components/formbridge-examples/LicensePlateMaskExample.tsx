import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { field, useFormBridge } from '@runilib/react-formbridge';

import { formExampleStyles as s } from './FormExamples.styles';
import { MaskExampleCard } from './MaskExampleCard';
import { createNativeFieldProps, simulateSubmitDelay } from './shared';

export function LicensePlateMaskExample() {
  const [lastSubmission, setLastSubmission] = useState<unknown>(null);
  const fieldProps = useMemo(() => createNativeFieldProps(), []);

  const formSchema = useMemo(
    () => ({
      vehicleName: field
        .text()
        .label('Vehicle name')
        .placeholder('North hub van')
        .required('Required'),
      licensePlate: field
        .masked('LL-999-LL')
        .label('License plate')
        .placeholder('AB-123-CD')
        .tokens({
          L: /[A-Z]/,
        })
        .required('Required')
        .showMaskInPlaceholder()
        .uppercase()
        .validateComplete('Incomplete plate'),
    }),
    [],
  );

  const form = useFormBridge(formSchema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
  });

  const { Form, fields, state, watchAll } = form;
  const liveValues = watchAll();

  return (
    <MaskExampleCard
      maskName="License plate"
      accent="#38bdf8"
      title="Fleet registration tracking"
      description="Custom masks are a good fit for operational identifiers that belong to your own product rules."
      highlights={[
        'Custom pattern string',
        'Uppercase letters only',
        'Readable separators',
      ]}
      preview={
        <>
          <Text style={s.previewValue}>{liveValues.licensePlate || 'AB-123-CD'}</Text>
          <Text style={s.previewText}>
            The mask teaches the expected structure while keeping the value easy to scan
            in dispatch or support tools, and the formatted value is stored by default.
          </Text>
        </>
      }
      parsedSubmission={lastSubmission}
      submittedLabel={
        lastSubmission
          ? `Vehicle ${String(liveValues.vehicleName || 'record')} saved`
          : null
      }
      submitError={state.submitError}
      footer="This pattern is useful when your app owns the identifier format and wants to prevent malformed values at entry time."
    >
      <Form
        onSubmit={async (values) => {
          await simulateSubmitDelay();
          setLastSubmission(values);
        }}
      >
        <View style={s.sectionBlock}>
          <Text style={s.sectionBlockTitle}>Fleet</Text>

          <View style={s.formRow}>
            <View style={s.halfField}>
              <fields.vehicleName {...fieldProps} />
            </View>
            <View style={s.halfField}>
              <fields.licensePlate {...fieldProps} />
            </View>
          </View>
        </View>

        <Form.Submit
          style={s.submitButton}
          loadingText="Saving vehicle..."
        >
          Save plate
        </Form.Submit>
      </Form>
    </MaskExampleCard>
  );
}
