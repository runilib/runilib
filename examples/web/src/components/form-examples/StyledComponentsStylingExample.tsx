import { useCallback, useId, useMemo, useState } from 'react';

import { field, useFormBridge } from '@runilib/react-formbridge';

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
  border-radius: 6px;
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
  color: #5f6f88;
`;

const StudioNameFieldShell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 0;

  & label {
    color: #30415d;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  & input {
    background: #ffffff;
    border: 1px solid rgba(125, 211, 252, 0.18);
    border-radius: 6px;
    color: #10203a;
    padding: 14px 16px;
  }

  & input::placeholder {
    color: #64748b;
  }

  & span {
    color: #5f6f88;
    font-size: 12px;
    line-height: 1.6;
  }
`;

const StudioFormComp = styled.form.attrs({
  autoComplete: 'off',
})`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ContactEmailFieldShell = styled.div`
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
    background: #ffffff;
    border: 1px solid rgba(56, 189, 248, 0.28);
    border-radius: 6px;
    color: #10203a;
    padding: 14px 16px;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  }

  & span {
    color: #64748b;
    font-size: 12px;
  }
`;

const CityFieldShell = styled.div`
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
    border-radius: 6px;
    color: #ecfdf5;
    padding: 14px 16px;
  }

  & span {
    color: #bbf7d0;
    font-size: 12px;
  }
`;

const LaunchNotesFieldShell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 0;

  & label {
    color: #30415d;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  & textarea {
    min-height: 112px;
    background: #ffffff;
    border: 1px solid rgba(125, 211, 252, 0.18);
    border-radius: 6px;
    color: #10203a;
    padding: 14px 16px;
  }

  & textarea::placeholder {
    color: #64748b;
  }

  & span {
    color: #64748b;
    font-size: 12px;
  }
`;

const SubmitShell = styled.button`
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

  const { Form, state, fieldController, watchAll } = form;
  const liveValues = watchAll();

  const studioNameController = fieldController('studioName');
  const contactEmailController = fieldController('contactEmail');
  const cityController = fieldController('city');
  const launchNotesController = fieldController('launchNotes');

  const studioNameId = useId();
  const contactEmailId = useId();
  const cityId = useId();
  const launchNotesId = useId();

  const registerStudioName = useCallback(
    (node: HTMLInputElement | null) => {
      studioNameController.registerFocusable(node);
    },
    [studioNameController],
  );

  const registerContactEmail = useCallback(
    (node: HTMLInputElement | null) => {
      contactEmailController.registerFocusable(node);
    },
    [contactEmailController],
  );

  const registerCity = useCallback(
    (node: HTMLInputElement | null) => {
      cityController.registerFocusable(node);
    },
    [cityController],
  );

  const registerLaunchNotes = useCallback(
    (node: HTMLTextAreaElement | null) => {
      launchNotesController.registerFocusable(node);
    },
    [launchNotesController],
  );

  return (
    <StylingExampleFrame
      recipeName="Styled Components"
      accent="#38bdf8"
      title="Style generated fields from a stable styled host"
      description="This keeps the generated field component as the source of truth, while a styled host injects the visual layer safely. It avoids the instability we hit with runtime-created styled wrappers."
      highlights={['styled field host', 'native input wiring', 'manual fieldController']}
      preview={
        <PreviewStack>
          <PreviewValue>{String(liveValues.studioName || 'Northwind Labs')}</PreviewValue>
          <PreviewCopy>
            The host stays static, and each input is wired manually through
            fieldController.
          </PreviewCopy>
          <PreviewPill>{`${String(liveValues.city || 'Lyon')} billing region`}</PreviewPill>
        </PreviewStack>
      }
      submittedPayload={lastSubmission}
      submittedLabel={
        lastSubmission
          ? `Styled field saved for ${String(liveValues.studioName || 'studio')}`
          : null
      }
      submitError={state.submitError}
      footer="This example uses native inputs wired through fieldController() instead of generated host wrappers."
    >
      <StudioFormComp
        as={Form}
        onSubmit={async (values) => {
          await simulateSubmitDelay();
          setLastSubmission(values);
        }}
      >
        <SectionCard>
          <SectionTitle>Studio profile</SectionTitle>

          <SectionGrid>
            <StudioNameFieldShell>
              <label htmlFor={studioNameId}>{studioNameController.label}</label>
              <input
                ref={registerStudioName}
                id={studioNameId}
                name={studioNameController.name}
                type="text"
                autoComplete="organization"
                value={String(studioNameController.value ?? '')}
                placeholder={studioNameController.placeholder ?? ''}
                disabled={studioNameController.disabled}
                aria-invalid={studioNameController.error ? 'true' : undefined}
                aria-describedby={`${studioNameId}-helper`}
                onChange={(event) => studioNameController.onChange(event.target.value)}
                onBlur={studioNameController.onBlur}
                onFocus={studioNameController.onFocus}
              />
              <span id={`${studioNameId}-helper`}>
                {studioNameController.error ?? studioNameController.hint}
              </span>
            </StudioNameFieldShell>

            <ContactEmailFieldShell>
              <label htmlFor={contactEmailId}>{contactEmailController.label}</label>
              <input
                ref={registerContactEmail}
                id={contactEmailId}
                name={contactEmailController.name}
                type="email"
                autoComplete="email"
                inputMode="email"
                value={String(contactEmailController.value ?? '')}
                placeholder={contactEmailController.placeholder ?? ''}
                disabled={contactEmailController.disabled}
                aria-invalid={contactEmailController.error ? 'true' : undefined}
                aria-describedby={`${contactEmailId}-helper`}
                onChange={(event) => contactEmailController.onChange(event.target.value)}
                onBlur={contactEmailController.onBlur}
                onFocus={contactEmailController.onFocus}
              />
              <span id={`${contactEmailId}-helper`}>
                {contactEmailController.error ?? contactEmailController.hint}
              </span>
            </ContactEmailFieldShell>
          </SectionGrid>

          <CityFieldShell>
            <label htmlFor={cityId}>{cityController.label}</label>
            <input
              ref={registerCity}
              id={cityId}
              name={cityController.name}
              type="text"
              autoComplete="address-level2"
              value={String(cityController.value ?? '')}
              placeholder={cityController.placeholder ?? ''}
              disabled={cityController.disabled}
              aria-invalid={cityController.error ? 'true' : undefined}
              aria-describedby={`${cityId}-helper`}
              onChange={(event) => cityController.onChange(event.target.value)}
              onBlur={cityController.onBlur}
              onFocus={cityController.onFocus}
            />
            <span id={`${cityId}-helper`}>
              {cityController.error ?? cityController.hint}
            </span>
          </CityFieldShell>
        </SectionCard>

        <SectionCard>
          <SectionTitle>Handoff note</SectionTitle>
          <LaunchNotesFieldShell>
            <label htmlFor={launchNotesId}>{launchNotesController.label}</label>
            <textarea
              ref={registerLaunchNotes}
              id={launchNotesId}
              name={launchNotesController.name}
              value={String(launchNotesController.value ?? '')}
              placeholder={launchNotesController.placeholder ?? ''}
              disabled={launchNotesController.disabled}
              aria-invalid={launchNotesController.error ? 'true' : undefined}
              aria-describedby={`${launchNotesId}-helper`}
              onChange={(event) => launchNotesController.onChange(event.target.value)}
              onBlur={launchNotesController.onBlur}
              onFocus={launchNotesController.onFocus}
            />
            <span id={`${launchNotesId}-helper`}>
              {launchNotesController.error ?? launchNotesController.hint}
            </span>
          </LaunchNotesFieldShell>
        </SectionCard>

        <FooterRow>
          <FooterCopy>
            The visual layer lives on the styled host, while each field controller still
            owns validation, value sync, and hint/error rendering.
          </FooterCopy>

          <SubmitShell
            type="submit"
            disabled={state.status === 'submitting'}
          >
            {state.status === 'submitting' ? 'Saving...' : 'Save styled recipe'}
          </SubmitShell>
        </FooterRow>
      </StudioFormComp>
    </StylingExampleFrame>
  );
}
