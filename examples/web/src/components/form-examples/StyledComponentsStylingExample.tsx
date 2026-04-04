import { useMemo, useState } from 'react';

import {
  FieldHost,
  FormHost,
  field,
  SubmitHost,
  useFormBridge,
} from '@runilib/react-formbridge';

import styled from 'styled-components';
import { StylingExampleFrame } from './StylingExampleFrame';
import { simulateSubmitDelay } from './shared';

const PreviewStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PreviewValue = styled.p`
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #f8fbff;
`;

const PreviewCopy = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 1.7;
  color: #d5dded;
`;

const PreviewPill = styled.span`
  width: fit-content;
  padding: 7px 11px;
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.14);
  border: 1px solid rgba(74, 222, 128, 0.24);
  color: #dcfce7;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

const SectionCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
  border-radius: 22px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent),
    rgba(11, 17, 33, 0.36);
  border: 1px solid rgba(125, 211, 252, 0.12);
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const SectionTitle = styled.p`
  margin: 0;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #bfdbfe;
`;

const FooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding-top: 2px;
`;

const FooterCopy = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 1.65;
  color: #94a3b8;
`;

const StudioNameFieldShell = styled(FieldHost).attrs({
  ui: {
    inputProps: {
      autoComplete: 'organization',
    },
  },
})`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 0;

  & label {
    color: #f8fafc;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  & input {
    background: rgba(15, 23, 42, 0.62);
    border: 1px solid rgba(125, 211, 252, 0.18);
    border-radius: 16px;
    color: #f8fafc;
    padding: 14px 16px;
  }

  & input::placeholder {
    color: #64748b;
  }

  & span {
    color: #cbd5e1;
    font-size: 12px;
    line-height: 1.6;
  }
`;

const StudioFormComp = styled(FormHost)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ContactEmailFieldShell = styled(FieldHost).attrs({
  ui: {
    inputProps: {
      autoComplete: 'email',
      inputMode: 'email',
    },
  },
})`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 0;

  & label {
    color: #dbeafe;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  & input {
    background: rgba(15, 23, 42, 0.74);
    border: 1px solid rgba(56, 189, 248, 0.28);
    border-radius: 16px;
    color: #f8fafc;
    padding: 14px 16px;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  }

  & span {
    color: #94a3b8;
    font-size: 12px;
  }
`;

const CityFieldShell = styled(FieldHost)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 0;

  & label {
    color: #dcfce7;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  & input {
    background: rgba(2, 44, 34, 0.44);
    border: 1px solid rgba(74, 222, 128, 0.24);
    border-radius: 16px;
    color: #ecfdf5;
    padding: 14px 16px;
  }

  & span {
    color: #bbf7d0;
    font-size: 12px;
  }
`;

const LaunchNotesFieldShell = styled(FieldHost)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 0;

  & label {
    color: #f8fafc;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  & textarea {
    min-height: 112px;
    background: rgba(15, 23, 42, 0.62);
    border: 1px solid rgba(125, 211, 252, 0.18);
    border-radius: 16px;
    color: #f8fafc;
    padding: 14px 16px;
  }

  & textarea::placeholder {
    color: #64748b;
  }

  & span {
    color: #94a3b8;
    font-size: 12px;
  }
`;

const SubmitShell = styled(SubmitHost).attrs({
  loadingText: 'Applying styled system...',
})`
  min-width: 196px;
  padding: 14px 22px;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, #38bdf8, #22c55e);
  color: #04121c;
  font-weight: 800;
  box-shadow: 0 16px 32px rgba(34, 197, 94, 0.18);
`;

export function StyledComponentsStylingExample() {
  const [lastSubmission, setLastSubmission] = useState<unknown>(null);

  const schema = useMemo(
    () => ({
      studioName: field
        .text('Studio name')
        .required('Studio name is required')
        .trim()
        .placeholder('Northwind Labs')
        .hint('Name shown on invoices and payment confirmations.'),
      contactEmail: field
        .email('Billing email')
        .required('Billing email is required')
        .trim()
        .placeholder('finance@northwind.dev'),
      city: field
        .text('City')
        .required('City is required')
        .placeholder('Lyon')
        .hint('Used to localize VAT and invoice copy.'),
      launchNotes: field
        .textarea('Launch notes')
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
    <StylingExampleFrame
      recipeName="Styled Components"
      accent="#38bdf8"
      title="Style generated fields from a stable styled host"
      description="This keeps the generated field component as the source of truth, while a styled host injects the visual layer safely. It avoids the instability we hit with runtime-created styled wrappers."
      highlights={[
        'styled field host',
        'styled(Form.Submit)',
        'selectors for inner input',
      ]}
      preview={
        <PreviewStack>
          <PreviewValue>{liveValues.studioName || 'Northwind Labs'}</PreviewValue>
          <PreviewCopy>
            The host stays static, and the generated field is injected through the `field`
            prop.
          </PreviewCopy>
          <PreviewPill>{liveValues.city || 'Lyon'} billing region</PreviewPill>
        </PreviewStack>
      }
      submittedPayload={lastSubmission}
      submittedLabel={
        lastSubmission
          ? `Styled field saved for ${String(liveValues.studioName || 'studio')}`
          : null
      }
      submitError={state.submitError}
      footer="This is the most reliable styled-components pattern with the current generated field model: you still style the field component, but through one stable host."
    >
      <StudioFormComp
        form={Form}
        onSubmit={async (values) => {
          await simulateSubmitDelay();
          setLastSubmission(values);
        }}
      >
        <SectionCard>
          <SectionTitle>Studio profile</SectionTitle>

          <SectionGrid>
            <StudioNameFieldShell field={fields.studioName} />
            <ContactEmailFieldShell field={fields.contactEmail} />
          </SectionGrid>

          <CityFieldShell field={fields.city} />
        </SectionCard>

        <SectionCard>
          <SectionTitle>Handoff note</SectionTitle>
          <LaunchNotesFieldShell field={fields.launchNotes} />
        </SectionCard>

        <FooterRow>
          <FooterCopy>
            The visual layer lives on the styled host, while `fields.studioName` still
            owns validation, value sync, and hint/error rendering.
          </FooterCopy>

          <SubmitShell submit={Form.Submit}>Save styled recipe</SubmitShell>
        </FooterRow>
      </StudioFormComp>
    </StylingExampleFrame>
  );
}
