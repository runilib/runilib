import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { field, useFormBridge } from '@runilib/react-formbridge';

import * as Haptics from 'expo-haptics';
import { FieldVariantCard } from './FieldVariantCard';
import { formExampleStyles as s } from './FormExamples.styles';
import { NativeField, NativeSubmit } from './nativeFormHelpers';
import { simulateSubmitDelay } from './shared';

export function SwitchVariantsExample() {
  const [lastSubmission, setLastSubmission] = useState<Record<string, unknown> | null>(
    null,
  );

  const schema = useMemo(
    () => ({
      publicProfile: field
        .switch()
        .defaultValue(true)
        .hint('Starts enabled so teammates can see the profile.'),
      pushAlerts: field
        .switch()
        .defaultValue(true)
        .hint('Controls live mobile notifications.'),
      quietHours: field
        .switch()
        .hint('Only available while push alerts are enabled.')
        .disabledWhen('pushAlerts', false),
    }),
    [],
  );

  const form = useFormBridge(schema, {
    validateOn: 'onChange',
    revalidateOn: 'onChange',
  });

  const { Form, fieldController, watchAll } = form;
  const values = watchAll();
  const activeCount = Object.values(values).filter(Boolean).length;

  return (
    <FieldVariantCard
      familyName="Switch"
      accent="#34d399"
      title="Product settings that feel instantly on or off"
      description="Switch is the best fit when the control represents an immediate product state. This sample also shows a dependent switch that disables itself when alerts are turned off."
      highlights={[
        'default on',
        'instant settings',
        'dependent disable',
        'fast toggle UX',
      ]}
      preview={
        <View style={{ gap: 10 }}>
          <Text style={s.previewValue}>{activeCount} active toggles</Text>
          <Text style={s.previewText}>
            Switches feel more native than checkboxes for product configuration.
          </Text>
          <View style={s.chipRow}>
            {values.publicProfile ? (
              <View style={s.chip}>
                <Text style={s.chipText}>Public profile</Text>
              </View>
            ) : null}
            {values.pushAlerts ? (
              <View style={s.chip}>
                <Text style={s.chipText}>Push alerts</Text>
              </View>
            ) : null}
            {values.quietHours ? (
              <View style={s.chip}>
                <Text style={s.chipText}>Quiet hours</Text>
              </View>
            ) : null}
          </View>
        </View>
      }
      snapshot={lastSubmission ?? values}
      submittedLabel={lastSubmission ? `Saved ${activeCount} active switches` : null}
      footer="Use switch when the control maps to an enabled/disabled state users expect to change immediately, like profile visibility or notification routing."
    >
      <Form
        onSubmit={async (submittedValues) => {
          await simulateSubmitDelay(260);
          setLastSubmission(submittedValues as Record<string, unknown>);
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }}
      >
        <View style={s.sectionBlock}>
          <Text style={s.sectionBlockTitle}>Switch family</Text>
          <NativeField controller={fieldController('publicProfile')} />
          <NativeField controller={fieldController('pushAlerts')} />
          <NativeField controller={fieldController('quietHours')} />
        </View>

        <NativeSubmit onPress={() => void form.submit()}>
          Save switch settings
        </NativeSubmit>
      </Form>
    </FieldVariantCard>
  );
}
