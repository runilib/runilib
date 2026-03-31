import { useState } from 'react';

import { type FormSchema, field, useFormWizardBridge } from '@runilib/react-formbridge';
import { useWalkit, WalkitStep, type WalkitStepProps } from '@runilib/react-walkit';

import styles from './Settings.module.css';

// This page uses a different animation to showcase the variety

export const SETTINGS_STEPS: { [key in string]: WalkitStepProps } = {
  PROFILE: {
    id: 'settings-profile',
    sequence: 8,
    route: '/settings',
    title: '👤 Your profile',
    content: 'Update your name, email, avatar and timezone here.',
  },
  NOTIFS: {
    id: 'settings-notifs',
    sequence: 9,
    route: '/settings',
    title: '🔔 Notifications',
    content: 'Choose exactly which events send you an email or push alert.',
  },
  THEME: {
    id: 'settings-theme',
    sequence: 10,
    route: '/settings',
    title: '🎨 Appearance',
    content: 'Switch between light and dark, or let the system decide.',
  },
  BILLING: {
    id: 'settings-billing',
    sequence: 11,
    route: '/settings',
    title: '💳 Plan & billing',
    content: 'Manage your subscription, invoices and payment method.',
  },
  LIBS: {
    id: 'settings-libs',
    sequence: 12,
    route: '/settings',
    title: '⚡ runilib',
    content: 'This app is powered by runilib — same code, every platform.',
  },
};

export function Settings({ onBack }: { onBack: () => void }) {
  const { start, isRunning } = useWalkit();
  const [activeSection, setActiveSection] = useState('profile');

  const steps: Array<{ id: string; label: string; schema: FormSchema }> = [
    {
      id: 'identity',
      label: 'Identité',
      schema: {
        name: field.text('Nom complet').required('Champ requis'),
        email: field.email('Email').required('Champ requis'),
      } satisfies FormSchema,
    },
    {
      id: 'security',
      label: 'Sécurité',
      schema: {
        password: field.password('Mot de passe').required('Champ requis'),
        otp: field.otp('Code').length(6).required('Champ requis'),
      } satisfies FormSchema,
    },
  ];

  const wizard = useFormWizardBridge(steps, {
    onSubmit: async (values) => {
      console.log('submit wizard', values);
    },
    persist: {
      key: 'signup-wizard',
      storage: 'local',
    },
  });
  const SECTIONS = ['Profile', 'Notifications', 'Appearance', 'Billing', 'Security'];

  if (!wizard.step) {
    return <div>Aucune étape disponible.</div>;
  }

  // const { Form, fields } = wizard.currentStep;

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={onBack}
        >
          ← Back
        </button>
        <nav className={styles.nav}>
          {SECTIONS.map((s) => (
            <button
              type="button"
              key={s}
              className={`${styles.navItem} ${activeSection === s.toLowerCase() ? styles.navActive : ''}`}
              onClick={() => setActiveSection(s.toLowerCase())}
            >
              {s}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        <div className={styles.topBar}>
          <h1 className={styles.title}>Settings</h1>
          <div className={styles.topBarRight}>
            <span className={styles.animBadge}>✦ flip animation</span>
            <button
              type="button"
              className="btn btn-ghost"
              style={{ fontSize: 12 }}
              onClick={() => start('settings-profile')}
              disabled={isRunning}
            >
              {isRunning ? '▶ Running…' : '▶ Tour'}
            </button>
          </div>
        </div>

        <div className={styles.content}>
          {/* Profile */}
          <WalkitStep {...SETTINGS_STEPS.PROFILE}>
            <section className={`card ${styles.section}`}>
              <h2 className={styles.sectionTitle}>Profile</h2>
              <div className={styles.profileRow}>
                <div className={styles.avatar}>AK</div>
                <div className={styles.profileFields}>
                  <div className={styles.fieldRow}>
                    <Field
                      label="Full name"
                      defaultValue="AKS"
                    />
                    <Field
                      label="Username"
                      defaultValue="aks-dev"
                    />
                  </div>
                  <div className={styles.fieldRow}>
                    <Field
                      label="Email"
                      defaultValue="aks@unikit.dev"
                      type="email"
                    />
                    <Field
                      label="Timezone"
                      defaultValue="Europe/Paris"
                    />
                  </div>
                </div>
              </div>
              <div className={styles.sectionFooter}>
                <button
                  type="button"
                  className="btn btn-primary"
                >
                  Save changes
                </button>
              </div>
            </section>
          </WalkitStep>

          {/* Notifications */}
          <WalkitStep {...SETTINGS_STEPS.NOTIFS}>
            <section className={`card ${styles.section}`}>
              <h2 className={styles.sectionTitle}>Notifications</h2>
              <div className={styles.toggleList}>
                {[
                  {
                    label: 'Task assigned to me',
                    sub: 'When a teammate assigns you a task',
                    on: true,
                  },
                  {
                    label: 'Due date approaching',
                    sub: '24h before a task is due',
                    on: true,
                  },
                  {
                    label: 'Comment mention',
                    sub: 'When someone @mentions you',
                    on: true,
                  },
                  {
                    label: 'Weekly digest',
                    sub: 'Sunday summary of your week',
                    on: false,
                  },
                  {
                    label: 'Project updates',
                    sub: 'Status changes on your projects',
                    on: false,
                  },
                ].map((item) => (
                  <ToggleRow
                    key={item.label}
                    {...item}
                  />
                ))}
              </div>
            </section>
          </WalkitStep>

          {/* Appearance */}
          <WalkitStep {...SETTINGS_STEPS.THEME}>
            <section className={`card ${styles.section}`}>
              <h2 className={styles.sectionTitle}>Appearance</h2>
              <div className={styles.themeGrid}>
                {['System', 'Light', 'Dark'].map((t) => (
                  <ThemeOption
                    key={t}
                    name={t}
                    active={t === 'Dark'}
                  />
                ))}
              </div>
            </section>
          </WalkitStep>

          {/* Billing */}
          <WalkitStep
            {...SETTINGS_STEPS.BILLING}
            renderPopover={({ walkitStep, onNext, onStop }) => (
              <BillingWalkitPopover
                title={walkitStep.title}
                content={walkitStep.content}
                onNext={onNext}
                onClose={onStop}
              />
            )}
          >
            <section className={`card ${styles.section}`}>
              <h2 className={styles.sectionTitle}>Plan & Billing</h2>
              <div className={styles.planRow}>
                <div className={styles.planInfo}>
                  <span className="tag tag-amber">Pro Plan</span>
                  <p className={styles.planDesc}>$12/month · Renews on Apr 17, 2026</p>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost"
                >
                  Manage plan
                </button>
              </div>
            </section>
          </WalkitStep>

          {/* runilib libs */}
          <WalkitStep {...SETTINGS_STEPS.LIBS}>
            <section className={`card ${styles.section} ${styles.libsSection}`}>
              <h2 className={styles.sectionTitle}>⚡ Powered by runilib</h2>
              <p className={styles.libsDesc}>
                Libraries used in this app — same API on React and React Native.
              </p>
              <div className={styles.libsList}>
                {[
                  {
                    name: 'stepwise',
                    version: 'v1.0.0',
                    status: 'active',
                    desc: 'Guided onboarding tours',
                  },
                  {
                    name: 'formura',
                    version: 'v1.0.0',
                    status: 'active',
                    desc: 'Cross-platform form state',
                  },
                  {
                    name: 'toastly',
                    version: null,
                    status: 'coming-soon',
                    desc: 'Toast notifications',
                  },
                  {
                    name: 'modalkit',
                    version: null,
                    status: 'coming-soon',
                    desc: 'Modals & bottom sheets',
                  },
                ].map((lib) => (
                  <div
                    key={lib.name}
                    className={styles.libRow}
                  >
                    <div>
                      <p className={styles.libName}>{lib.name}</p>
                      <p className={styles.libDesc2}>{lib.desc}</p>
                    </div>
                    <span
                      className={`tag ${lib.status === 'active' ? 'tag-green' : ''}`}
                      style={
                        lib.status !== 'active'
                          ? {
                              background: 'rgba(120,120,120,0.1)',
                              color: 'var(--muted)',
                              border: '1px solid rgba(120,120,120,0.18)',
                            }
                          : {}
                      }
                    >
                      {lib.version ?? 'soon'}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </WalkitStep>
        </div>
      </main>
    </div>
  );
}

// ─── Small sub-components ─────────────────────────────────────────────────────

function Field({
  label,
  defaultValue,
  type = 'text',
}: {
  label: string;
  defaultValue: string;
  type?: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
      <label
        htmlFor=""
        style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)' }}
      >
        {label}
      </label>
      <input
        type={type}
        defaultValue={defaultValue}
        style={{
          padding: '9px 12px',
          background: 'var(--bg3)',
          border: '1px solid var(--border2)',
          borderRadius: 8,
          fontSize: 13.5,
          color: 'var(--text)',
          outline: 'none',
        }}
      />
    </div>
  );
}

function ToggleRow({ label, sub, on }: { label: string; sub: string; on: boolean }) {
  const [checked, setChecked] = useState(on);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '11px 0',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div>
        <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{label}</p>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{sub}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => setChecked(!checked)}
        style={{
          width: 42,
          height: 24,
          borderRadius: 12,
          background: checked ? 'var(--accent)' : 'var(--surface2)',
          cursor: 'pointer',
          position: 'relative',
          transition: 'background 0.2s',
          flexShrink: 0,
          border: 'none',
          padding: 0,
          outline: 'none',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 3,
            left: checked ? 20 : 3,
            width: 18,
            height: 18,
            borderRadius: 9,
            background: '#fff',
            transition: 'left 0.2s',
            display: 'block',
          }}
        />
      </button>
    </div>
  );
}

function ThemeOption({ name, active }: { name: string; active: boolean }) {
  return (
    <div
      style={{
        flex: 1,
        padding: '14px 16px',
        background: active ? 'rgba(240,165,0,0.1)' : 'var(--bg3)',
        border: `1.5px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 10,
        textAlign: 'center',
        cursor: 'pointer',
      }}
    >
      <p
        style={{
          fontSize: 13.5,
          fontWeight: 600,
          color: active ? 'var(--accent)' : 'var(--muted)',
        }}
      >
        {name}
      </p>
    </div>
  );
}

function BillingWalkitPopover({
  title,
  content,
  onNext,
  onClose,
}: {
  title?: string;
  content?: string;
  onNext: () => void;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignSelf: 'flex-start',
          padding: '5px 10px',
          borderRadius: 999,
          background: 'rgba(240,165,0,0.14)',
          color: 'var(--accent)',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}
      >
        Custom popover
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
          {title ?? 'Plan & billing'}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: 13.5,
            color: 'var(--muted)',
            lineHeight: 1.6,
          }}
        >
          {content ?? 'Manage your subscription, invoices and payment method.'}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          padding: '10px 12px',
          borderRadius: 12,
          background: 'var(--bg3)',
          border: '1px solid var(--border)',
        }}
      >
        <div>
          <p style={{ margin: 0, fontSize: 11, color: 'var(--muted)' }}>Current plan</p>
          <p
            style={{
              margin: '4px 0 0',
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--text)',
            }}
          >
            Pro
          </p>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 11, color: 'var(--muted)' }}>Renewal</p>
          <p
            style={{
              margin: '4px 0 0',
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--text)',
            }}
          >
            Apr 17
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 8,
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            border: '1px solid var(--border)',
            background: 'transparent',
            color: 'var(--muted)',
            padding: '10px 12px',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Close
        </button>
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
          Continue
        </button>
      </div>
    </div>
  );
}
