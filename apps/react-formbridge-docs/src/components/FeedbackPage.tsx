'use client';

import { type CSSProperties, useCallback, useMemo, useState } from 'react';

import {
  field,
  type GlobaleDefaultsProps,
  type SchemaValues,
  useFormBridge,
} from '@runilib/react-formbridge';
import {
  FEEDBACK_TYPE_OPTIONS,
  type FeedbackSubmissionValues,
  getInitialFeedbackValues,
  normalizeFeedbackType,
  normalizeRelevantPage,
} from '@/lib/feedback';

import Link from 'next/link';
import styled, { css, type DefaultTheme, useTheme } from 'styled-components';

const FEEDBACK_SCHEMA = {
  feedbackType: field
    .select('Feedback type')
    .options(
      FEEDBACK_TYPE_OPTIONS.map((option) => ({
        label: option.label,
        value: option.value,
      })),
    )
    .defaultValue('general')
    .required()
    .hint('Pick the closest lane so the report starts in the right place.'),
  subject: field
    .text('Subject')
    .required()
    .min(4)
    .placeholder('Short summary of your feedback')
    .hint('A short title makes triage much faster.'),
  area: field
    .text('Area')
    .placeholder('Documentation, validation adapters, wizard flows...')
    .hint('Optional, but helpful when the topic is very specific.'),
  relevantPage: field
    .text('Relevant page')
    .placeholder('/docs/useformbridge or full URL')
    .hint('We prefill this when you open feedback from a docs page.'),
  name: field.text('Name').placeholder('Optional'),
  email: field
    .email('Contact email')
    .placeholder('name@company.com')
    .hint('Optional. Leave it if you want a follow-up.'),
  message: field
    .textarea('Details')
    .required()
    .min(20)
    .max(3000)
    .placeholder('What did you try, what felt off, and what would make this better?')
    .hint('The more concrete the context, the easier it is to act on.'),
  expectedBehavior: field
    .textarea('Expected behavior')
    .visibleWhen('feedbackType', 'bug')
    .requiredWhen('feedbackType', 'bug')
    .clearOnHide()
    .placeholder('What should have happened?')
    .hint('Keep it short and observable.'),
  actualBehavior: field
    .textarea('Actual behavior')
    .visibleWhen('feedbackType', 'bug')
    .requiredWhen('feedbackType', 'bug')
    .clearOnHide()
    .placeholder('What actually happened?')
    .hint('Include error copy, odd state, or incorrect result.'),
  reproductionSteps: field
    .textarea('Steps to reproduce')
    .visibleWhen('feedbackType', 'bug')
    .requiredWhen('feedbackType', 'bug')
    .clearOnHide()
    .placeholder('1. Go to...\n2. Click...\n3. Observe...')
    .hint('A tiny repro is worth a lot.'),
  contactConsent: field
    .checkbox('You can contact me if follow-up details would help.')
    .hint('Useful if you left a contact email above.'),
};

type FeedbackFormValues = SchemaValues<typeof FEEDBACK_SCHEMA>;

function getFeedbackFieldStyles(theme: DefaultTheme): GlobaleDefaultsProps {
  const errorColor = theme.mode === 'dark' ? '#ff9fb0' : '#d1435b';
  const wrapper: CSSProperties = {
    display: 'grid',
    gap: '8px',
    margin: 0,
  };
  const label: CSSProperties = {
    color: theme.text,
    fontSize: '14px',
    fontWeight: 700,
  };
  const requiredMark: CSSProperties = {
    color: theme.accent,
    fontWeight: 800,
  };
  const textInput: CSSProperties = {
    background: theme.surfaceSoft,
    border: `1px solid ${theme.border}`,
    borderRadius: '5px',
    boxSizing: 'border-box',
    color: theme.text,
    fontSize: '14px',
    lineHeight: 1.5,
    minHeight: '46px',
    padding: '0 14px',
    width: '100%',
  };
  const textarea: CSSProperties = {
    background: theme.surfaceSoft,
    border: `1px solid ${theme.border}`,
    borderRadius: '5px',
    boxSizing: 'border-box',
    color: theme.text,
    fontSize: '14px',
    lineHeight: 1.6,
    minHeight: '132px',
    padding: '12px 14px',
    resize: 'vertical',
    width: '100%',
  };
  const select: CSSProperties = {
    background: theme.surfaceSoft,
    border: `1px solid ${theme.border}`,
    borderRadius: '5px',
    boxSizing: 'border-box',
    color: theme.text,
    fontSize: '14px',
    lineHeight: 1.5,
    minHeight: '46px',
    padding: '0 14px',
    width: '100%',
  };
  const hint: CSSProperties = {
    color: theme.textMuted,
    fontSize: '12px',
    lineHeight: 1.6,
  };
  const error: CSSProperties = {
    color: errorColor,
    fontSize: '12px',
    fontWeight: 700,
    lineHeight: 1.5,
  };
  const checkboxRow: CSSProperties = {
    alignItems: 'flex-start',
    display: 'flex',
    gap: '10px',
  };
  const checkboxInput: CSSProperties = {
    accentColor: theme.accent,
    flex: '0 0 18px',
    height: '18px',
    marginTop: '2px',
    width: '18px',
  };
  const checkboxLabel: CSSProperties = {
    color: theme.text,
    fontSize: '14px',
    fontWeight: 700,
    lineHeight: 1.55,
  };

  return {
    field: {
      styles: {
        checkboxInput,
        checkboxLabel,
        checkboxRow,
        error,
        hint,
        textInput,
        label,
        requiredMark,
        wrapper,
        select,
        textarea,
      },
    },
  };
}

function getSubmitStyle(theme: DefaultTheme) {
  return {
    background: theme.accent,
    border: `1px solid ${theme.accent}`,
    borderRadius: '10px',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 700,
    minHeight: '46px',
    padding: '0 18px',
  };
}

export const FeedbackPage = ({
  initialRelevantPage = '',
}: {
  initialRelevantPage?: string;
}) => {
  const theme = useTheme();
  const normalizedInitialRelevantPage = normalizeRelevantPage(initialRelevantPage);
  const [didSendFeedback, setDidSendFeedback] = useState(false);
  const initialValues = useMemo(
    () => getInitialFeedbackValues(normalizedInitialRelevantPage),
    [normalizedInitialRelevantPage],
  );

  const feedbackForm = useFormBridge(FEEDBACK_SCHEMA, {
    globalDefaults: (state) => ({
      field: {
        ...getFeedbackFieldStyles(theme).field,
      },
      form: {
        style: {
          display: 'grid',
          gap: '18px',
          marginTop: '22px',
        },
      },
      submit: {
        loadingText: state.state.isSubmitting ? 'Sending feedback...' : 'Send feedback',
        style: getSubmitStyle(theme),
      },
    }),
    initialValues,
    revalidateOn: 'onChange',
    validateOn: 'onTouched',
  });

  const isBugReport = feedbackForm.watch('feedbackType') === 'bug';

  const handleSubmit = useCallback(
    async (values: FeedbackFormValues) => {
      setDidSendFeedback(false);

      const payload: FeedbackSubmissionValues = {
        ...values,
        feedbackType: normalizeFeedbackType(String(values.feedbackType ?? 'general')),
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
              onSubmit={handleSubmit}
              onSubmitError={handleSubmitError}
            >
              <feedbackForm.fields.feedbackType />

              <TwoColumnGrid>
                <feedbackForm.fields.subject />
                <feedbackForm.fields.area />
              </TwoColumnGrid>

              <TwoColumnGrid>
                <feedbackForm.fields.relevantPage />
                <feedbackForm.fields.email />
              </TwoColumnGrid>

              <feedbackForm.fields.name />

              <feedbackForm.fields.message
                styles={{
                  textarea: {
                    minHeight: '180px',
                  },
                }}
              />

              <BugGrid>
                <feedbackForm.fields.expectedBehavior />
                <feedbackForm.fields.actualBehavior />
                <feedbackForm.fields.reproductionSteps
                  styles={{
                    textarea: {
                      minHeight: '152px',
                    },
                  }}
                />
              </BugGrid>

              <feedbackForm.fields.contactConsent />

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
                <feedbackForm.Form.Submit />
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
                page uses generated fields, conditional visibility, runtime validation,
                and the built-in submit pipeline instead of a one-off state machine.
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
