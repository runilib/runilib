'use client';

import { useCallback, useMemo, useState } from 'react';

import {
  type FeedbackSubmissionValues,
  getInitialFeedbackValues,
  normalizeFeedbackType,
  normalizeRelevantPage,
} from '@/lib/feedback';
import { FEEDBACK_SCHEMA, type FeedbackFormValues } from '@/lib/feedbackSchema';

import Link from 'next/link';
import styled, { css } from 'styled-components';
import { AppField, useFormBridge } from '../demoFormBridge';

export const FeedbackPage = ({
  initialRelevantPage = '',
}: {
  initialRelevantPage?: string;
}) => {
  const normalizedInitialRelevantPage = normalizeRelevantPage(initialRelevantPage);
  const [didSendFeedback, setDidSendFeedback] = useState(false);
  const initialValues = useMemo(
    () => getInitialFeedbackValues(normalizedInitialRelevantPage),
    [normalizedInitialRelevantPage],
  );

  const feedbackForm = useFormBridge(FEEDBACK_SCHEMA, {
    initialValues,
    revalidateOn: 'onChange',
    validateOn: 'onTouched',
  });

  const isBugReport = feedbackForm.watch('feedbackType') === 'bug';

  const handleSubmit = useCallback(
    async (values: FeedbackFormValues) => {
      setDidSendFeedback(false);

      const payload: FeedbackSubmissionValues = {
        feedbackType: normalizeFeedbackType(String(values.feedbackType ?? 'general')),
        subject: String(values.subject ?? ''),
        area: String(values.area ?? ''),
        relevantPage: String(values.relevantPage ?? ''),
        name: String(values.name ?? ''),
        email: String(values.email ?? ''),
        message: String(values.message ?? ''),
        expectedBehavior: String(values.expectedBehavior ?? ''),
        actualBehavior: String(values.actualBehavior ?? ''),
        reproductionSteps: String(values.reproductionSteps ?? ''),
        contactConsent: Boolean(values.contactConsent),
      };
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        throw new Error(result?.error ?? 'Unable to send feedback right now.');
      }

      feedbackForm.resetFields(initialValues);
      setDidSendFeedback(true);
    },
    [feedbackForm, initialValues],
  );

  const handleReset = useCallback(() => {
    feedbackForm.resetFields(initialValues);
    setDidSendFeedback(false);
  }, [feedbackForm, initialValues]);

  const handleSubmitError = useCallback((error: unknown) => {
    setDidSendFeedback(false);

    if (error instanceof Error && error.message.trim()) {
      return error.message;
    }

    return 'Unable to send feedback right now.';
  }, []);

  return (
    <Main>
      <Shell className="shell">
        <Breadcrumbs>
          <Link href="/">Home</Link>
          <span>•</span>
          <Link href="/docs">Docs</Link>
          <span>•</span>
          <span>Feedback</span>
        </Breadcrumbs>

        <Hero>
          <HeroCopy>
            <HeroBadge>Community feedback</HeroBadge>
            <HeroTitle>Tell us what should feel better.</HeroTitle>
            <HeroLead>
              This page is powered by react-formbridge itself. Share rough edges, missing
              examples, documentation gaps, or API ideas, and we will send the report
              straight to the team inbox.
            </HeroLead>
          </HeroCopy>

          <HeroCard>
            <HeroCardTitle>Best for</HeroCardTitle>
            <HeroList>
              <li>Confusing or outdated docs</li>
              <li>Missing field builder examples</li>
              <li>Type safety or validation issues</li>
              <li>Feature requests for the runtime</li>
            </HeroList>
          </HeroCard>
        </Hero>

        <ContentGrid>
          <FormCard>
            <SectionHeading>Feedback form</SectionHeading>
            <FormNote>
              A few specific details go a long way. For bug reports, the bug-only fields
              below appear automatically and become required through the schema.
            </FormNote>

            <feedbackForm.Form
              className="feedback-form"
              onSubmit={handleSubmit}
              onError={() => undefined}
              onSubmitError={handleSubmitError}
              style={undefined}
            >
              <AppField
                form={feedbackForm}
                name="feedbackType"
              />

              <TwoColumnGrid>
                <AppField
                  form={feedbackForm}
                  name="subject"
                />
                <AppField
                  form={feedbackForm}
                  name="area"
                />
              </TwoColumnGrid>

              <TwoColumnGrid>
                <AppField
                  form={feedbackForm}
                  name="relevantPage"
                />
                <AppField
                  form={feedbackForm}
                  name="email"
                  inputProps={{ type: 'email' }}
                />
              </TwoColumnGrid>

              <AppField
                form={feedbackForm}
                name="name"
              />

              <AppField
                form={feedbackForm}
                name="message"
                kind="textarea"
                textareaStyle={{ minHeight: '180px' }}
              />

              <BugGrid>
                <AppField
                  form={feedbackForm}
                  name="expectedBehavior"
                  kind="textarea"
                />
                <AppField
                  form={feedbackForm}
                  name="actualBehavior"
                  kind="textarea"
                />
                <AppField
                  form={feedbackForm}
                  name="reproductionSteps"
                  kind="textarea"
                  textareaStyle={{ minHeight: '152px' }}
                />
              </BugGrid>

              <AppField
                form={feedbackForm}
                name="contactConsent"
              />

              {isBugReport ? (
                <BugNote>
                  Because the schema knows this is a bug report, the reproduction fields
                  are visible and required until the report is complete.
                </BugNote>
              ) : null}

              {feedbackForm.state.submitError ? (
                <ErrorNote>{feedbackForm.state.submitError}</ErrorNote>
              ) : null}

              <Actions>
                <PrimaryButton
                  type="submit"
                  disabled={feedbackForm.state.isSubmitting}
                >
                  {feedbackForm.state.isSubmitting
                    ? 'Sending feedback…'
                    : 'Send feedback'}
                </PrimaryButton>
                <SecondaryButton
                  type="button"
                  onClick={handleReset}
                  disabled={feedbackForm.state.isSubmitting}
                >
                  Clear form
                </SecondaryButton>
              </Actions>
            </feedbackForm.Form>

            {didSendFeedback ? (
              <SuccessNote>
                Feedback sent. The message is on its way to{' '}
                <strong>akladekouassi@gmail.com</strong>.
              </SuccessNote>
            ) : null}
          </FormCard>

          <Aside>
            <AsideCard>
              <AsideTitle>What to include</AsideTitle>
              <AsideList>
                <li>The doc page or API surface you were using</li>
                <li>What felt confusing, missing, or incorrect</li>
                <li>Any code sample or constraint that shaped the problem</li>
                <li>The smallest repro if the issue is runtime-related</li>
              </AsideList>
            </AsideCard>

            <AsideCard>
              <AsideTitle>Why this page uses FormBridge</AsideTitle>
              <AsideCopy>
                The docs should dogfood the same schema-first flow they describe. This
                page uses application-owned fields, conditional visibility, runtime
                validation, and the built-in submit pipeline instead of a one-off state
                machine.
              </AsideCopy>
            </AsideCard>

            <AsideCard>
              <AsideTitle>Where the feedback goes</AsideTitle>
              <AsideCopy>
                Submit sends the report to the docs inbox directly. If you leave a contact
                email and opt in, we can reply there for follow-up details.
              </AsideCopy>
            </AsideCard>
          </Aside>
        </ContentGrid>
      </Shell>
    </Main>
  );
};

const Main = styled.main`
  min-height: calc(100vh - 220px);
  padding: 40px 0 24px;

  @media (max-width: 720px) {
    padding-top: 28px;
  }
`;

const Shell = styled.div`
  display: grid;
  gap: 24px;
`;

const Breadcrumbs = styled.nav`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${({ theme }) => theme.textMuted};
  font-size: 13px;
  font-weight: 600;

  a {
    color: ${({ theme }) => theme.textSoft};

    &:hover {
      color: ${({ theme }) => theme.accent};
    }
  }
`;

const Hero = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.8fr);
  gap: 24px;
  align-items: stretch;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const HeroCopy = styled.div`
  display: grid;
  gap: 14px;
`;

const HeroBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  background: ${({ theme }) => theme.accentSoft};
  color: ${({ theme }) => theme.accent};
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const HeroTitle = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.text};
  font-size: clamp(2.35rem, 5vw, 4rem);
  line-height: 0.98;
  letter-spacing: -0.04em;
`;

const HeroLead = styled.p`
  margin: 0;
  max-width: 62ch;
  color: ${({ theme }) => theme.textSoft};
  font-size: 17px;
  line-height: 1.72;
`;

const HeroCard = styled.aside`
  align-self: start;
  padding: 22px;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
`;

const HeroCardTitle = styled.h2`
  margin: 0 0 12px;
  color: ${({ theme }) => theme.text};
  font-size: 18px;
`;

const HeroList = styled.ul`
  display: grid;
  gap: 10px;
  margin: 0;
  padding-left: 18px;
  color: ${({ theme }) => theme.textSoft};
  line-height: 1.65;
`;

const ContentGrid = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(260px, 0.75fr);
  gap: 24px;
  align-items: start;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

const FormCard = styled.section`
  --feedback-error: ${({ theme }) => (theme.mode === 'dark' ? '#ff9fb0' : '#d1435b')};
  --feedback-error-soft: ${({ theme }) =>
    theme.mode === 'dark' ? 'rgba(255, 159, 176, 0.22)' : 'rgba(209, 67, 91, 0.14)'};

  padding: 24px;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};

  .feedback-form {
    display: grid;
    gap: 18px;
    margin-top: 22px;
  }

  [data-fb-field] {
    display: grid;
    gap: 8px;
    margin: 0;
  }

  [data-fb-slot='label'],
  [data-fb-slot='checkbox-label'] {
    color: ${({ theme }) => theme.text};
    font-size: 14px;
    font-weight: 700;
  }

  [data-fb-slot='checkbox-label'] {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    line-height: 1.55;
  }

  [data-fb-slot='required-mark'] {
    color: ${({ theme }) => theme.accent};
  }

  [data-fb-slot='input'],
  [data-fb-slot='select'],
  [data-fb-slot='textarea'] {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 5px;
    background: ${({ theme }) => theme.surfaceSoft};
    color: ${({ theme }) => theme.text};
    font: inherit;
  }

  [data-fb-slot='input'],
  [data-fb-slot='select'] {
    min-height: 46px;
    padding: 0 14px;
  }

  [data-fb-slot='textarea'] {
    min-height: 132px;
    padding: 12px 14px;
    resize: vertical;
  }

  [data-fb-slot='checkbox-input'] {
    width: 18px;
    height: 18px;
    margin-top: 2px;
    accent-color: ${({ theme }) => theme.accent};
  }

  [data-fb-slot='hint'] {
    color: ${({ theme }) => theme.textMuted};
    font-size: 12px;
  }

  [data-fb-slot='error'] {
    color: var(--feedback-error);
    font-size: 12px;
    font-weight: 700;
  }

  [data-fb-field][data-fb-error] > [data-fb-slot='label'],
  [data-fb-field][data-fb-error] [data-fb-slot='checkbox-label'],
  [data-fb-field][data-fb-error] [data-fb-slot='switch-label'],
  [data-fb-field][data-fb-error] [data-fb-slot='required-mark'] {
    color: var(--feedback-error) !important;
  }

  [data-fb-field][data-fb-error] [data-fb-slot='input'],
  [data-fb-field][data-fb-error] [data-fb-slot='textarea'],
  [data-fb-field][data-fb-error] [data-fb-slot='select'],
  [data-fb-field][data-fb-error] [data-fb-slot='otp-input'],
  [data-fb-field][data-fb-error] [data-fb-slot='country-button'],
  [data-fb-field][data-fb-error] [data-fb-slot='browse-button'],
  [data-fb-field][data-fb-error] [data-fb-slot='drop-zone'],
  [data-fb-field][data-fb-error] [data-fb-slot='switch-track'] {
    border-color: var(--feedback-error) !important;
    box-shadow: 0 0 0 4px var(--feedback-error-soft) !important;
  }

  [data-fb-field='checkbox'][data-fb-error] [data-fb-slot='checkbox-input'] {
    accent-color: var(--feedback-error) !important;
    outline: 2px solid var(--feedback-error);
    outline-offset: 2px;
  }

  @media (max-width: 640px) {
    padding: 18px;
  }
`;

const SectionHeading = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.text};
  font-size: 24px;
  font-weight: 800;
`;

const FormNote = styled.p`
  margin: 10px 0 0;
  color: ${({ theme }) => theme.textSoft};
  line-height: 1.7;
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const BugGrid = styled.div`
  display: grid;
  gap: 16px;
`;

const BugNote = styled.p`
  margin: -4px 0 0;
  padding: 12px 14px;
  border-radius: 12px;
  background: ${({ theme }) => theme.accentSoft};
  color: ${({ theme }) => theme.textSoft};
  font-size: 13px;
  line-height: 1.65;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
`;

const buttonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 18px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease;

  &:hover {
    transform: translateY(-1px);
  }

  &:disabled {
    transform: none;
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled.button`
  ${buttonStyles}
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.textSoft};
  cursor: pointer;
`;

const PrimaryButton = styled.button`
  ${buttonStyles}
  border: 1px solid ${({ theme }) => theme.accent};
  background: ${({ theme }) => theme.accent};
  color: #ffffff;
  cursor: pointer;
`;

const SuccessNote = styled.div`
  display: grid;
  gap: 8px;
  margin-top: 18px;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.borderStrong};
  background: ${({ theme }) => theme.accentSoft};
  color: ${({ theme }) => theme.textSoft};
  line-height: 1.65;
`;

const ErrorNote = styled.div`
  margin: -4px 0 0;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.borderStrong};
  background: ${({ theme }) => theme.surfaceSoft};
  color: #d1435b;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.6;
`;

const Aside = styled.aside`
  display: grid;
  gap: 16px;
`;

const AsideCard = styled.section`
  padding: 20px;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
`;

const AsideTitle = styled.h2`
  margin: 0 0 12px;
  color: ${({ theme }) => theme.text};
  font-size: 18px;
`;

const AsideList = styled.ul`
  display: grid;
  gap: 10px;
  margin: 0;
  padding-left: 18px;
  color: ${({ theme }) => theme.textSoft};
  line-height: 1.65;
`;

const AsideCopy = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.textSoft};
  line-height: 1.7;
`;
