import type { CSSProperties } from 'react';
import { useEffect } from 'react';

import type { FormSchema } from '@runilib/react-formbridge';
import { field, useFormWizard } from '@runilib/react-formbridge';

import { useNavigate, useParams } from 'react-router-dom';

const WIZARD_STEPS = [
  {
    id: 'personal',
    label: 'Personal info',
    schema: {
      firstName: field.text('First name').required('First name is required'),
      lastName: field.text('Last name').required('Last name is required'),
      email: field.email('Email').required('Email is required'),
    } satisfies FormSchema,
  },
  {
    id: 'company',
    label: 'Company info',
    schema: {
      companyName: field.text('Company name').required('Company name is required'),
      role: field.text('Role').required('Role is required'),
      teamSize: field.select('Team size').options([
        { label: '1-10', value: '1-10' },
        { label: '11-50', value: '11-50' },
        { label: '51-200', value: '51-200' },
        { label: '200+', value: '200+' },
      ]),
    } satisfies FormSchema,
  },
  {
    id: 'review',
    label: 'Review',
    schema: {} satisfies FormSchema,
  },
] as const;

type WizardStepId = (typeof WIZARD_STEPS)[number]['id'];

function isWizardStepId(value: string | undefined): value is WizardStepId {
  return WIZARD_STEPS.some((step) => step.id === value);
}

export function Wizard({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate();
  const params = useParams<{ stepId?: string }>();
  const routeStepId = isWizardStepId(params.stepId) ? params.stepId : undefined;

  const wizard = useFormWizard([...WIZARD_STEPS], {
    stepId: routeStepId,
    initialStepId: 'personal',
    persist: {
      key: 'web-cross-page-wizard',
      storage: 'local',
    },
    onStepChange: ({ step }) => {
      navigate(`/formbridge/wizard/${step.id}`);
    },
    onSubmit: async (values) => {
      console.log('[@examples/web] cross-page wizard submit', values);
      globalThis.alert?.('Cross-page wizard submitted. Check the console for payload.');
    },
  });

  useEffect(() => {
    if (wizard.isHydrating || !wizard.currentStepId) {
      return;
    }

    if (routeStepId !== wizard.currentStepId) {
      navigate(`/formbridge/wizard/${wizard.currentStepId}`, { replace: true });
    }
  }, [navigate, routeStepId, wizard.currentStepId, wizard.isHydrating]);

  if (wizard.isHydrating) {
    return (
      <div style={pageStyle}>
        <div style={contentStyle}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onBack}
          >
            Back to dashboard
          </button>
          <div style={heroStyle}>
            <p style={eyebrowStyle}>Cross-page wizard</p>
            <h1 style={titleStyle}>Restoring saved progress…</h1>
            <p style={subtitleStyle}>
              This example keeps the wizard state alive across route changes and remounts.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!wizard.step) {
    return (
      <div style={pageStyle}>
        <div style={contentStyle}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onBack}
          >
            Back to dashboard
          </button>
          <p style={subtitleStyle}>No step is currently available.</p>
        </div>
      </div>
    );
  }

  const { Form, fields } = wizard.currentStep;

  return (
    <div style={pageStyle}>
      <div style={contentStyle}>
        <div style={heroStyle}>
          <div style={heroTopStyle}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onBack}
            >
              Back to dashboard
            </button>
            <span style={draftBadgeStyle}>Route-based wizard demo</span>
          </div>

          <p style={eyebrowStyle}>Cross-page wizard</p>
          <h1 style={titleStyle}>A real onboarding flow split across multiple routes.</h1>
          <p style={subtitleStyle}>
            Navigate away, refresh the page, or resume later. The wizard restores the
            active route and the accumulated values from persistent state.
          </p>
        </div>

        <div style={layoutStyle}>
          <section style={mainCardStyle}>
            <div style={stepHeaderStyle}>
              <div>
                <p style={stepCaptionStyle}>
                  Step {wizard.currentStepIndex + 1} / {wizard.totalSteps}
                </p>
                <h2 style={stepTitleStyle}>{wizard.step.label}</h2>
              </div>

              <div style={pillRowStyle}>
                {wizard.visibleSteps.map((item, index) => {
                  const active = item.id === wizard.currentStepId;
                  const complete = wizard.completedSteps.has(item.id);

                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => {
                        void wizard.goTo(index, true);
                      }}
                      style={{
                        ...stepPillStyle,
                        ...(active ? stepPillActiveStyle : {}),
                        ...(complete ? stepPillCompleteStyle : {}),
                      }}
                    >
                      {index + 1}. {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <Form
              onSubmit={async () => {
                if (wizard.isLastStep) {
                  await wizard.submit();
                  return;
                }

                await wizard.next();
              }}
              style={formStyle}
            >
              {'firstName' in fields && <fields.firstName />}
              {'lastName' in fields && <fields.lastName />}
              {'email' in fields && <fields.email />}
              {'companyName' in fields && <fields.companyName />}
              {'role' in fields && <fields.role />}
              {'teamSize' in fields && <fields.teamSize />}

              {wizard.currentStepId === 'review' ? (
                <div style={reviewCardStyle}>
                  <p style={reviewTitleStyle}>Ready to submit</p>
                  <p style={reviewTextStyle}>
                    This screen lives on its own route too. The payload below is the
                    merged state restored from the whole wizard.
                  </p>
                  <pre style={codeStyle}>{JSON.stringify(wizard.allValues, null, 2)}</pre>
                </div>
              ) : null}

              <div style={footerStyle}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={wizard.prev}
                  disabled={wizard.isFirstStep}
                >
                  Back
                </button>

                <Form.Submit>
                  {wizard.isLastStep ? 'Submit wizard' : 'Save and continue'}
                </Form.Submit>
              </div>
            </Form>
          </section>

          <aside style={sidebarStyle}>
            <div style={sidebarCardStyle}>
              <p style={sidebarLabelStyle}>What this demo proves</p>
              <ul style={listStyle}>
                <li>Each step lives on its own route.</li>
                <li>
                  `next()` emits a step transition that the router turns into navigation.
                </li>
                <li>Refresh or remount still restores the step and merged values.</li>
              </ul>
            </div>

            <div style={sidebarCardStyle}>
              <p style={sidebarLabelStyle}>Current payload</p>
              <pre style={codeStyle}>{JSON.stringify(wizard.allValues, null, 2)}</pre>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

const pageStyle: CSSProperties = {
  minHeight: '100vh',
  background:
    'radial-gradient(circle at top right, rgba(91,168,240,0.22), transparent 26%), linear-gradient(180deg, #f7f1e7 0%, #efe6d6 100%)',
  color: '#1d140b',
};

const contentStyle: CSSProperties = {
  maxWidth: 1180,
  margin: '0 auto',
  padding: '32px 24px 48px',
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
};

const heroStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  background: 'rgba(255,255,255,0.74)',
  border: '1px solid rgba(108,76,33,0.12)',
  borderRadius: 28,
  padding: '28px 30px',
  boxShadow: '0 24px 60px rgba(57,41,17,0.08)',
};

const heroTopStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  flexWrap: 'wrap',
};

const draftBadgeStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '8px 12px',
  borderRadius: 999,
  background: 'rgba(29,20,11,0.08)',
  color: '#5f4527',
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: '#8f5d20',
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 'clamp(2rem, 4vw, 3.4rem)',
  lineHeight: 1,
  letterSpacing: '-0.05em',
  maxWidth: 720,
};

const subtitleStyle: CSSProperties = {
  margin: 0,
  maxWidth: 700,
  fontSize: 16,
  lineHeight: 1.65,
  color: '#6a5641',
};

const layoutStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.6fr) minmax(280px, 0.9fr)',
  gap: 22,
};

const mainCardStyle: CSSProperties = {
  background: 'rgba(255,255,255,0.92)',
  borderRadius: 28,
  border: '1px solid rgba(108,76,33,0.12)',
  padding: 28,
  boxShadow: '0 24px 60px rgba(57,41,17,0.08)',
};

const stepHeaderStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 18,
  marginBottom: 24,
};

const stepCaptionStyle: CSSProperties = {
  margin: 0,
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#9a6f37',
};

const stepTitleStyle: CSSProperties = {
  margin: '8px 0 0',
  fontSize: 28,
  lineHeight: 1.1,
};

const pillRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 10,
};

const stepPillStyle: CSSProperties = {
  border: '1px solid rgba(108,76,33,0.14)',
  background: '#fffaf2',
  color: '#6a5641',
  borderRadius: 999,
  padding: '10px 14px',
  fontSize: 13,
  fontWeight: 700,
  cursor: 'pointer',
};

const stepPillActiveStyle: CSSProperties = {
  background: '#1d140b',
  color: '#f7f1e7',
  borderColor: '#1d140b',
};

const stepPillCompleteStyle: CSSProperties = {
  boxShadow: 'inset 0 0 0 1px rgba(91,191,122,0.5)',
};

const formStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 18,
};

const reviewCardStyle: CSSProperties = {
  borderRadius: 20,
  padding: 20,
  background:
    'linear-gradient(180deg, rgba(243,236,224,0.92) 0%, rgba(255,255,255,0.94) 100%)',
  border: '1px solid rgba(108,76,33,0.12)',
};

const reviewTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 18,
  fontWeight: 800,
};

const reviewTextStyle: CSSProperties = {
  margin: '10px 0 0',
  fontSize: 14,
  lineHeight: 1.6,
  color: '#6a5641',
};

const footerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  flexWrap: 'wrap',
  marginTop: 10,
};

const sidebarStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 18,
};

const sidebarCardStyle: CSSProperties = {
  background: 'rgba(29,20,11,0.92)',
  color: '#f7f1e7',
  borderRadius: 24,
  padding: 22,
  boxShadow: '0 24px 60px rgba(29,20,11,0.18)',
};

const sidebarLabelStyle: CSSProperties = {
  margin: 0,
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#f0a500',
};

const listStyle: CSSProperties = {
  margin: '16px 0 0',
  paddingLeft: 18,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  color: '#efe4d4',
  lineHeight: 1.6,
};

const codeStyle: CSSProperties = {
  margin: '16px 0 0',
  borderRadius: 18,
  padding: 16,
  background: 'rgba(16,12,8,0.7)',
  color: '#f7f1e7',
  fontSize: 12,
  lineHeight: 1.55,
  overflowX: 'auto',
};
