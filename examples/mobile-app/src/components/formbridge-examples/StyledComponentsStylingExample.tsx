import { useMemo, useState } from 'react';
import { View } from 'react-native';

import {
  FieldHost,
  FormHost,
  field,
  SubmitHost,
  useFormBridge,
} from '@/src/demoFormBridge';

import styled from 'styled-components/native';
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

const StudioFormComp = styled(FormHost)`
  gap: 16px;
`;

const StudioNameFieldShell = styled(FieldHost).attrs({
  styles: {
    wrapper: {
      marginBottom: 0,
      gap: 8,
    },
    label: {
      color: '#30415d',
      fontSize: 12,
      fontWeight: '800',
      letterSpacing: 0.7,
      textTransform: 'uppercase',
    },
    textInput: {
      minHeight: 52,
      borderWidth: 1.5,
      borderColor: 'rgba(125, 211, 252, 0.18)',
      borderRadius: 16,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 15,
      color: '#10203a',
      backgroundColor: '#ffffff',
    },
    hint: {
      color: '#5f6f88',
      fontSize: 12,
      lineHeight: 18,
    },
    error: {
      color: '#fda4af',
      fontSize: 12,
      fontWeight: '700',
    },
  },
  inputProps: {
    autoComplete: 'organization',
  },
})`
  margin-bottom: 0px;
`;

const ContactEmailFieldShell = styled(FieldHost).attrs({
  styles: {
    wrapper: {
      marginBottom: 0,
      gap: 8,
    },
    label: {
      color: '#dbeafe',
      fontSize: 12,
      fontWeight: '800',
      letterSpacing: 0.7,
      textTransform: 'uppercase',
    },
    textInput: {
      minHeight: 52,
      borderWidth: 1.5,
      borderColor: 'rgba(56, 189, 248, 0.28)',
      borderRadius: 16,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 15,
      color: '#10203a',
      backgroundColor: '#ffffff',
    },
    hint: {
      color: '#64748b',
      fontSize: 12,
    },
    error: {
      color: '#fda4af',
      fontSize: 12,
      fontWeight: '700',
    },
  },
  inputProps: {
    autoComplete: 'email',
    keyboardType: 'email-address',
  },
})`
  margin-bottom: 0px;
`;

const CityFieldShell = styled(FieldHost).attrs({
  styles: {
    wrapper: {
      marginBottom: 0,
      gap: 8,
    },
    label: {
      color: '#dcfce7',
      fontSize: 12,
      fontWeight: '800',
      letterSpacing: 0.7,
      textTransform: 'uppercase',
    },
    textInput: {
      minHeight: 52,
      borderWidth: 1.5,
      borderColor: 'rgba(74, 222, 128, 0.24)',
      borderRadius: 16,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 15,
      color: '#ecfdf5',
      backgroundColor: 'rgba(2, 44, 34, 0.44)',
    },
    hint: {
      color: '#bbf7d0',
      fontSize: 12,
    },
    error: {
      color: '#fda4af',
      fontSize: 12,
      fontWeight: '700',
    },
  },
})`
  margin-bottom: 0px;
`;

const LaunchNotesFieldShell = styled(FieldHost).attrs({
  styles: {
    wrapper: {
      marginBottom: 0,
      gap: 8,
    },
    label: {
      color: '#30415d',
      fontSize: 12,
      fontWeight: '800',
      letterSpacing: 0.7,
      textTransform: 'uppercase',
    },
    textInput: {
      minHeight: 112,
      borderWidth: 1.5,
      borderColor: 'rgba(125, 211, 252, 0.18)',
      borderRadius: 16,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 15,
      color: '#10203a',
      backgroundColor: '#ffffff',
    },
    hint: {
      color: '#64748b',
      fontSize: 12,
    },
    error: {
      color: '#fda4af',
      fontSize: 12,
      fontWeight: '700',
    },
  },
})`
  margin-bottom: 0px;
`;

const SubmitShell = styled(SubmitHost).attrs({
  loadingText: 'Applying styled system...',
  textStyle: {
    color: '#042033',
    fontWeight: '800',
  },
})`
  margin-top: 6px;
  min-height: 52px;
  border-radius: 18px;
  background-color: #38bdf8;
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

  const { Form, fields, state, watchAll } = form;
  const liveValues = watchAll();

  return (
    <StylingExampleCard
      recipeName="Styled Components"
      accent="#38bdf8"
      title="Style generated fields from a stable styled host"
      description="On native, the styled host stays static and injects the generated field plus its slot styles. That keeps styled-components/native ergonomic without runtime wrapper instability."
      highlights={['styled field host', 'attrs for native slots', 'styled(Form.Submit)']}
      preview={
        <PreviewStack>
          <PreviewValue>{liveValues.studioName || 'Northwind Labs'}</PreviewValue>
          <PreviewCopy>
            The host stays stable, and attrs feed the generated field its native slot
            styles.
          </PreviewCopy>
          <PreviewPill>
            <PreviewPillText>{liveValues.city || 'Lyon'} billing region</PreviewPillText>
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
      footer="This is the safest styled-components/native pattern with generated fields: the host handles the styling contract, and the formbridge field still owns value, validation, and renderer logic."
    >
      <StudioFormComp
        form={Form}
        // biome-ignore lint/suspicious/noExplicitAny: To be fixed
        onSubmit={async (values: any) => {
          await simulateSubmitDelay();
          setLastSubmission(values);
        }}
      >
        <SectionCard>
          <SectionTitle>Studio profile</SectionTitle>
          <StudioNameFieldShell field={fields.studioName} />
          <ContactEmailFieldShell field={fields.contactEmail} />
          <CityFieldShell field={fields.city} />
        </SectionCard>

        <SectionCard>
          <SectionTitle>Handoff note</SectionTitle>
          <LaunchNotesFieldShell field={fields.launchNotes} />
        </SectionCard>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <FooterText>
            The styled host controls presentation, and the generated field keeps all the
            form behavior.
          </FooterText>
          <SubmitShell submit={Form.Submit}>Save styled recipe</SubmitShell>
        </View>
      </StudioFormComp>
    </StylingExampleCard>
  );
}
