/**
 * Example - React Web
 * ────────────────────
 * Illustrates a full onboarding tour on a dashboard page.
 *
 * Install:
 *   npm install @runilib/react-walkit react react-dom
 */

import type { CSSProperties } from 'react';
import React from 'react';

import { useWalkit, WalkitProvider, WalkitStep } from '@runilib/react-walkit';

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <WalkitProvider
      animationType="bounce"
      overlayColor="rgba(10,10,20,0.78)"
      spotlightPadding={10}
      spotlightBorderRadius={12}
      theme={{
        primaryButtonColor: '#6366f1',
        background: '#ffffff',
        titleColor: '#1e1e2e',
        subTitleColor: '#6b7280',
        border: '#e5e7eb',
      }}
      labels={{ next: 'Next →', prev: '← Back', finish: 'Got it! 🎉', close: '✕' }}
      onStart={() => console.log('Tour started!')}
      onStop={() => console.log('Tour ended!')}
      onStepChange={(step, index) => console.log(`Step ${index + 1}: ${step.id}`)}
    >
      <Dashboard />
    </WalkitProvider>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard() {
  const { start } = useWalkit();

  return (
    <div style={styles.page}>
      {/* Header */}
      <WalkitStep
        id="header"
        sequence={1}
        title="Welcome to your Dashboard 👋"
        content="All your key metrics and tools are available right from here."
        placement="bottom"
      >
        <header style={styles.header}>
          <h1 style={styles.logo}>MyApp</h1>
          <nav style={styles.nav}>
            <a
              href="/"
              style={styles.navLink}
            >
              Home
            </a>
            <a
              href="/"
              style={styles.navLink}
            >
              Reports
            </a>
          </nav>
        </header>
      </WalkitStep>

      <main style={styles.main}>
        {/* Search */}
        <WalkitStep
          id="search"
          sequence={2}
          title="🔍 Search"
          content="Quickly find any content, user, or report across the whole app."
          placement="bottom"
        >
          <input
            style={styles.search}
            placeholder="Search anything…"
          />
        </WalkitStep>

        {/* Stats */}
        <WalkitStep
          id="stats"
          sequence={3}
          title="📊 Your Stats"
          content="Monitor your daily and monthly KPIs at a glance. Data refreshes every hour."
          placement="bottom"
        >
          <div style={styles.statsRow}>
            <StatCard
              label="Users"
              value="12,430"
              trend="+8%"
            />
            <StatCard
              label="Revenue"
              value="$41,200"
              trend="+12%"
            />
            <StatCard
              label="Tasks"
              value="94"
              trend="-3%"
              negative
            />
          </div>
        </WalkitStep>

        {/* Actions */}
        <div style={styles.actions}>
          <WalkitStep
            id="export"
            sequence={4}
            title="📥 Export"
            content="Download your data as CSV or PDF with one click."
            placement="top"
          >
            <button
              type="button"
              style={styles.btnSecondary}
            >
              Export
            </button>
          </WalkitStep>

          <WalkitStep
            id="new-report"
            sequence={5}
            title="✨ New Report"
            content="Create a custom report with the metrics that matter most to you."
            placement="top"
          >
            <button
              type="button"
              style={styles.btnPrimary}
            >
              + New Report
            </button>
          </WalkitStep>
        </div>

        {/* Start tour */}
        <div style={{ marginTop: 40, display: 'flex', gap: 12 }}>
          <button
            type="button"
            onClick={() => start()}
            style={styles.tourBtn}
          >
            🚀 Start Tour
          </button>
          <AnimationShowcase />
        </div>
      </main>
    </div>
  );
}

// ─── Animation picker (bonus) ─────────────────────────────────────────────────

const ANIMATIONS = ['fade', 'slide', 'zoom', 'bounce', 'flip', 'glow'];

function AnimationShowcase() {
  const [selected, setSelected] = React.useState('bounce');
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <span style={{ fontSize: 13, color: '#6b7280' }}>Animation:</span>
      {ANIMATIONS.map((a) => (
        <button
          type="button"
          key={a}
          onClick={() => setSelected(a)}
          style={{
            padding: '5px 10px',
            borderRadius: 6,
            border: '1px solid #e5e7eb',
            background: a === selected ? '#6366f1' : 'white',
            color: a === selected ? 'white' : '#374151',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          {a}
        </button>
      ))}
    </div>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  trend,
  negative = false,
}: Readonly<{
  label: string;
  value: string;
  trend: string;
  negative?: boolean;
}>) {
  return (
    <div style={styles.card}>
      <p style={styles.cardValue}>{value}</p>
      <p style={styles.cardLabel}>{label}</p>
      <span style={{ ...styles.cardTrend, color: negative ? '#ef4444' : '#10b981' }}>
        {trend}
      </span>
    </div>
  );
}

// ─── Custom react-walkit example ───────────────────────────────────────────────────

export function AppWithCustomTooltip() {
  return (
    <WalkitProvider
      renderPopover={({
        walkitStep,
        walkitStepIndex,
        totalWalkitSteps,
        onNext,
        onPrev,
        onStop,
      }) => (
        <div style={{ fontFamily: 'sans-serif' }}>
          <div
            style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}
          >
            <strong style={{ fontSize: 14, color: '#1e1e2e' }}>{walkitStep.title}</strong>
            <button
              type="button"
              onClick={onStop}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#9ca3af',
              }}
            >
              ✕
            </button>
          </div>
          {walkitStep.content && (
            <p style={{ color: '#6b7280', fontSize: 13, margin: '0 0 12px' }}>
              {walkitStep.content}
            </p>
          )}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 12, color: '#9ca3af' }}>
              {walkitStepIndex + 1} / {totalWalkitSteps}
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              {walkitStepIndex > 0 && (
                <button
                  type="button"
                  onClick={onPrev}
                  style={{
                    fontSize: 12,
                    background: 'none',
                    border: '1px solid #e5e7eb',
                    borderRadius: 6,
                    padding: '4px 10px',
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
                  fontSize: 12,
                  background: '#6366f1',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '4px 12px',
                  cursor: 'pointer',
                }}
              >
                {walkitStepIndex === totalWalkitSteps - 1 ? 'Done ✓' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}
    >
      <Dashboard />
    </WalkitProvider>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, CSSProperties> = {
  page: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    maxWidth: 700,
    margin: '0 auto',
    background: '#fff',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderBottom: '1px solid #e5e7eb',
  },
  logo: { margin: 0, fontSize: 20, fontWeight: 700, color: '#1e1e2e' },
  nav: { display: 'flex', gap: 20 },
  navLink: { textDecoration: 'none', color: '#6b7280', fontSize: 14 },
  main: { padding: '28px 24px' },
  search: {
    width: '100%',
    padding: '11px 16px',
    fontSize: 14,
    borderRadius: 10,
    border: '1px solid #e5e7eb',
    boxSizing: 'border-box',
    outline: 'none',
  },
  statsRow: { display: 'flex', gap: 16, marginTop: 20 },
  card: {
    flex: 1,
    background: '#f9fafb',
    borderRadius: 12,
    padding: '18px 20px',
    border: '1px solid #e5e7eb',
  },
  cardValue: { margin: 0, fontSize: 24, fontWeight: 700, color: '#1e1e2e' },
  cardLabel: { margin: '4px 0 6px', fontSize: 12, color: '#9ca3af' },
  cardTrend: { fontSize: 12, fontWeight: 600 },
  actions: { display: 'flex', gap: 12, marginTop: 20 },
  btnPrimary: {
    padding: '10px 20px',
    background: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  btnSecondary: {
    padding: '10px 20px',
    background: 'white',
    color: '#374151',
    border: '1px solid #e5e7eb',
    borderRadius: 10,
    fontSize: 14,
    cursor: 'pointer',
  },
  tourBtn: {
    padding: '12px 24px',
    background: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
};
