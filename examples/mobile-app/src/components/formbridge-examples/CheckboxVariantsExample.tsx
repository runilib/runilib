import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { field, useFormBridge } from '@runilib/react-formbridge';

import * as Haptics from 'expo-haptics';
import { FieldVariantCard } from './FieldVariantCard';
import { formExampleStyles as s } from './FormExamples.styles';
import { NativeField, NativeSubmit } from './nativeFormHelpers';
import { simulateSubmitDelay } from './shared';

export function CheckboxVariantsExample() {
  const [lastSubmission, setLastSubmission] = useState<Record<string, unknown> | null>(
    null,
  );

  const schema = useMemo(
    () => ({
      acceptTerms: field
        .checkbox()
        .label('Accept launch terms')
        .mustBeTrue('The launch terms must be accepted')
        .hint('Required legal consent.'),
      weeklyDigest: field
        .checkbox()
        .label('Weekly digest')
        .defaultValue(true)
        .hint('Pre-selected communication preference.'),
      betaInvites: field
        .checkbox()
        .label('Beta invites')
        .hint('Optional opt-in for early access campaigns.'),
    }),
    [],
  );

  const form = useFormBridge(schema, {
    validateOn: 'onBlur',
    revalidateOn: 'onChange',
  });

  const { Form, fieldController, watchAll } = form;
  const values = watchAll();
  const enabledCount = Object.values(values).filter(Boolean).length;

  return (
    <FieldVariantCard
      familyName="Checkbox"
      accent="#f59e0b"
      title="Consent checkboxes and opt-ins"
      description="Checkboxes shine when each value is independent: legal confirmation, marketing preference, or feature opt-in."
      highlights={[
        'mustBeTrue',
        'defaultValue(true)',
        'optional consent',
        'inline hints',
      ]}
      preview={
        <View style={{ gap: 10 }}>
          <Text style={s.previewValue}>{enabledCount}/3 enabled</Text>
          <Text style={s.previewText}>
            One mandatory checkbox plus two optional preferences.
          </Text>
          <View style={s.chipRow}>
            {values.acceptTerms ? (
              <View style={s.chip}>
                <Text style={s.chipText}>Terms accepted</Text>
              </View>
            ) : null}
            {values.weeklyDigest ? (
              <View style={s.chip}>
                <Text style={s.chipText}>Weekly digest</Text>
              </View>
            ) : null}
            {values.betaInvites ? (
              <View style={s.chip}>
                <Text style={s.chipText}>Beta invites</Text>
              </View>
            ) : null}
          </View>
        </View>
      }
      snapshot={lastSubmission ?? values}
      submittedLabel={
        lastSubmission ? `Saved ${enabledCount} active checkbox preferences` : null
      }
      footer="Use checkbox when each answer can be toggled independently. It is ideal for consent collection, opt-ins, and preference stacks."
    >
      <Form
        onSubmit={async (submittedValues) => {
          await simulateSubmitDelay(260);
          setLastSubmission(submittedValues as Record<string, unknown>);
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }}
      >
        <View style={s.sectionBlock}>
          <Text style={s.sectionBlockTitle}>Checkbox family</Text>
          <NativeField controller={fieldController('acceptTerms')} />
          <NativeField controller={fieldController('weeklyDigest')} />
          <NativeField controller={fieldController('betaInvites')} />
        </View>

        <NativeSubmit onPress={() => void form.submit()}>
          Save checkbox preferences
        </NativeSubmit>
      </Form>
    </FieldVariantCard>
  );
}
