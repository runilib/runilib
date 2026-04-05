import { type RenderWalkitStepProps, WalkitProvider } from '@runilib/react-walkit';

import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AnalyticsLayer } from './AnalyticsLayer';
import './App.css';

import { Dashboard } from './pages/Dashboard';
import { FormbridgeExamplesPage } from './pages/FormbridgeExamplesPage';
import { LibraryHubPage } from './pages/LibraryHubPage';
import { SETTINGS_STEPS, Settings } from './pages/Settings';
import { Wizard } from './pages/Wizard';
import { STEPS, TOUR_LABELS, TOUR_THEME } from './tourConfig';

const APP_TOUR_STEPS = [
  STEPS.HEADER,
  STEPS.NEW_TASK,
  STEPS.FILTERS,
  STEPS.STATS,
  SETTINGS_STEPS.PROFILE,
  SETTINGS_STEPS.NOTIFS,
  SETTINGS_STEPS.THEME,
  SETTINGS_STEPS.BILLING,
];

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <WalkitProvider
      animationType="bounce"
      overlayColor="rgba(10,9,7,0.82)"
      spotlightPadding={10}
      spotlightBorderRadius={14}
      theme={TOUR_THEME}
      labels={TOUR_LABELS}
      steps={APP_TOUR_STEPS}
      stopOnOutsideClick
      renderPopover={(props) => <GlobalWalkitPopover {...props} />}
      onFlowStepChange={({ toStep }) => {
        if (!toStep.route || toStep.route === location.pathname) {
          return;
        }

        navigate(toStep.route, { replace: true });
      }}
      onStart={() => console.log('[@runilib/react-walkit]:onStart tour started')}
      onStop={() => console.log('[@runilib/react-walkit]:onStop tour ended')}
      onStepChange={(step, i) =>
        console.log(`[@runilib/react-walkit]:onStepChange step ${i + 1}: ${step.id}`)
      }
    >
      <AnalyticsLayer />
      <Routes>
        <Route
          path="/"
          element={<LibraryHubPage />}
        />
        <Route
          path="/walkit"
          element={
            <Dashboard
              onGoToSettings={() => navigate('/walkit/settings')}
              onGoToFormbridge={() => navigate('/formbridge')}
            />
          }
        />
        <Route
          path="/walkit/settings"
          element={<Settings onBack={() => navigate('/walkit')} />}
        />
        <Route
          path="/formbridge"
          element={
            <FormbridgeExamplesPage
              onOpenWizard={() => navigate('/formbridge/wizard/personal')}
            />
          }
        />
        <Route
          path="/formbridge/wizard/:stepId"
          element={<Wizard onBack={() => navigate('/formbridge')} />}
        />
        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </WalkitProvider>
  );
}

function GlobalWalkitPopover({
  walkitStep,
  walkitStepIndex,
  totalWalkitSteps,
  onNext,
  onPrev,
  onStop,
}: RenderWalkitStepProps) {
  const isFirst = walkitStepIndex === 0;
  const isLast = walkitStepIndex === totalWalkitSteps - 1;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: 'var(--accent)',
              boxShadow: '0 0 0 5px rgba(240,165,0,0.12)',
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
            }}
          >
            Provider popover
          </span>
        </div>

        <span
          style={{
            fontSize: 12,
            color: 'var(--muted)',
            fontWeight: 600,
          }}
        >
          {walkitStepIndex + 1} / {totalWalkitSteps}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <p
          style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--text)',
            lineHeight: 1.3,
          }}
        >
          {walkitStep.title}
        </p>

        {walkitStep.content ? (
          <p
            style={{
              margin: 0,
              fontSize: 13.5,
              color: 'var(--muted)',
              lineHeight: 1.6,
            }}
          >
            {walkitStep.content}
          </p>
        ) : null}
      </div>

      <div
        style={{
          display: 'flex',
          gap: 6,
        }}
      >
        {Array.from({ length: totalWalkitSteps }).map((_, index) => (
          <div
            key={`walkit-progress-${index.toString()}`}
            style={{
              height: 6,
              flex: 1,
              borderRadius: 999,
              background:
                index <= walkitStepIndex ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
              opacity: index <= walkitStepIndex ? 1 : 0.7,
            }}
          />
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <button
          type="button"
          onClick={onStop}
          style={{
            border: 'none',
            background: 'transparent',
            color: 'var(--muted)',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            padding: '8px 0',
          }}
        >
          Close
        </button>

        <div style={{ display: 'flex', gap: 8 }}>
          {!isFirst && (
            <button
              type="button"
              onClick={onPrev}
              style={{
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--text)',
                padding: '10px 12px',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Back
            </button>
          )}

          <button
            type="button"
            onClick={onNext}
            style={{
              border: 'none',
              background: 'var(--accent)',
              color: '#0f0e0b',
              padding: '10px 14px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {isLast ? 'Finish' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
