import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { field, useFormBridge } from '@runilib/react-formbridge';

import styled from 'styled-components/native';
import { NativeField, NativeSubmit } from './nativeFormHelpers';
import { StylingExampleCard } from './StylingExampleCard';
import { simulateSubmitDelay } from './shared';

const PreviewStack = styled.View`
  gap: 10px;
`;

const PreviewValue = styled.Text`
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: #10203a;
`;

const PreviewCopy = styled.Text`
  font-size: 13px;
  line-height: 20px;
  color: #5f6f88;
`;

const PreviewPill = styled.View`
  align-self: flex-start;
  padding: 7px 11px;
  border-radius: 999px;
  background-color: rgba(34, 197, 94, 0.14);
  border-width: 1px;
  border-color: rgba(74, 222, 128, 0.24);
`;

const PreviewPillText = styled.Text`
  color: #dcfce7;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.7px;
  text-transform: uppercase;
`;

const SectionCard = styled.View`
  gap: 14px;
  padding: 16px;
  border-radius: 22px;
  background-color: #ffffff;
  border-width: 1px;
  border-color: rgba(125, 211, 252, 0.12);
`;

const SectionTitle = styled.Text`
  color: #bfdbfe;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.8px;
  text-transform: uppercase;
`;

const FooterText = styled.Text`
  flex: 1;
  color: #5f6f88;
  font-size: 12px;
  line-height: 18px;
`;

export function StyledComponentsStylingExample() {
  const [lastSubmission, setLastSubmission] = useState<unknown>(null);

  const schema = useMemo(
    () => ({
      studioName: field
        .text()
        .required('Studio name is required')
        .trim()
        .placeholder('Northwind Labs')
        .hint('Name shown on invoices and payment confirmations.'),
      contactEmail: field
        .email()
        .required('Billing email is required')
        .trim()
        .placeholder('finance@northwind.dev'),
      city: field
        .text()
        .required('City is required')
        .placeholder('Lyon')
        .hint('Used to localize VAT and invoice copy.'),
      launchNotes: field
        .textarea()
        .required('Add a short handoff note')
        .placeholder('Team prefers invoice reminders every Monday.'),
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
      recipeName="Styled Components"
      accent="#38bdf8"
      title="Compose headless fields inside styled containers"
      description="On native, styled-components owns the layout while fieldController provides value, validation, and event handlers."
      highlights={['application-owned UI', 'styled containers', 'fieldController']}
      preview={
        <PreviewStack>
          <PreviewValue>{String(liveValues.studioName || 'Northwind Labs')}</PreviewValue>
          <PreviewCopy>
            The host stays stable, and attrs feed the generated field its native slot
            styles.
          </PreviewCopy>
          <PreviewPill>
            <PreviewPillText>
              {String(liveValues.city || 'Lyon')} billing region
            </PreviewPillText>
          </PreviewPill>
        </PreviewStack>
      }
      submittedPayload={lastSubmission}
      submittedLabel={
        lastSubmission
          ? `Styled field saved for ${String(liveValues.studioName || 'studio')}`
          : null
      }
      submitError={state.submitError}
      footer="The application controls every rendered component; FormBridge stays focused on state, validation, and submission."
    >
      <Form
        onSubmit={async (values) => {
          await simulateSubmitDelay();
          setLastSubmission(values);
        }}
      >
        <SectionCard>
          <SectionTitle>Studio profile</SectionTitle>
          <NativeField controller={fieldController('studioName')} />
          <NativeField controller={fieldController('contactEmail')} />
          <NativeField controller={fieldController('city')} />
        </SectionCard>

        <SectionCard>
          <SectionTitle>Handoff note</SectionTitle>
          <NativeField
            controller={fieldController('launchNotes')}
            multiline
          />
        </SectionCard>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <FooterText>
            The styled host controls presentation, and the generated field keeps all the
            form behavior.
          </FooterText>
          <NativeSubmit onPress={() => void form.submit()}>
            Save styled recipe
          </NativeSubmit>
        </View>
      </Form>
    </StylingExampleCard>
  );
}
