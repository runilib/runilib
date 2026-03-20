import { useState, useEffect, useRef } from 'react';
import { TooltipStep, useTooltip, type AnimationType } from '@runilib/tooltip';
import styles from './Settings.module.css';

// This page uses a different animation to showcase the variety
const ANIMATION: AnimationType = 'flip';

const SETTINGS_STEPS = {
  PROFILE: { name: 'settings-profile', order: 1, title: '👤 Your profile',   text: 'Update your name, email, avatar and timezone here.',           placement: 'bottom' as const },
  NOTIFS:  { name: 'settings-notifs',  order: 2, title: '🔔 Notifications', text: 'Choose exactly which events send you an email or push alert.',  placement: 'right'  as const },
  THEME:   { name: 'settings-theme',   order: 3, title: '🎨 Appearance',     text: 'Switch between light and dark, or let the system decide.',      placement: 'right'  as const },
  BILLING: { name: 'settings-billing', order: 4, title: '💳 Plan & billing', text: 'Manage your subscription, invoices and payment method.',        placement: 'top'    as const },
  LIBS:    { name: 'settings-libs',    order: 5, title: '⚡ runilib',   text: 'This app is powered by runilib — same code, every platform.', placement: 'top' as const },
};

export function Settings({ onBack }: { onBack: () => void }) {
  const { start, isRunning } = useTooltip();
  const tourStarted = useRef(false);
  const [activeSection, setActiveSection] = useState('profile');

  useEffect(() => {
    if (!tourStarted.current) {
      tourStarted.current = true;
      const t = setTimeout(() => start('settings-profile'), 600);
      return () => clearTimeout(t);
    }
  }, [start]);

  const SECTIONS = ['Profile', 'Notifications', 'Appearance', 'Billing', 'Security'];

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <button className={styles.backBtn} onClick={onBack}>← Back</button>
        <nav className={styles.nav}>
          {SECTIONS.map(s => (
            <button
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
                          type='button'

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
          <TooltipStep {...SETTINGS_STEPS.PROFILE}>
            <section className={`card ${styles.section}`}>
              <h2 className={styles.sectionTitle}>Profile</h2>
              <div className={styles.profileRow}>
                <div className={styles.avatar}>AK</div>
                <div className={styles.profileFields}>
                  <div className={styles.fieldRow}>
                    <Field label="Full name"   defaultValue="AKS"           />
                    <Field label="Username"    defaultValue="aks-dev"        />
                  </div>
                  <div className={styles.fieldRow}>
                    <Field label="Email"       defaultValue="aks@unikit.dev" type="email" />
                    <Field label="Timezone"    defaultValue="Europe/Paris"   />
                  </div>
                </div>
              </div>
              <div className={styles.sectionFooter}>
                <button               type='button'
 className="btn btn-primary">Save changes</button>
              </div>
            </section>
          </TooltipStep>

          {/* Notifications */}
          <TooltipStep {...SETTINGS_STEPS.NOTIFS}>
            <section className={`card ${styles.section}`}>
              <h2 className={styles.sectionTitle}>Notifications</h2>
              <div className={styles.toggleList}>
                {[
                  { label: 'Task assigned to me',   sub: 'When a teammate assigns you a task', on: true  },
                  { label: 'Due date approaching',  sub: '24h before a task is due',           on: true  },
                  { label: 'Comment mention',       sub: 'When someone @mentions you',          on: true  },
                  { label: 'Weekly digest',         sub: 'Sunday summary of your week',         on: false },
                  { label: 'Project updates',       sub: 'Status changes on your projects',     on: false },
                ].map(item => (
                  <ToggleRow key={item.label} {...item} />
                ))}
              </div>
            </section>
          </TooltipStep>

          {/* Appearance */}
          <TooltipStep {...SETTINGS_STEPS.THEME}>
            <section className={`card ${styles.section}`}>
              <h2 className={styles.sectionTitle}>Appearance</h2>
              <div className={styles.themeGrid}>
                {['System', 'Light', 'Dark'].map(t => (
                  <ThemeOption key={t} name={t} active={t === 'Dark'} />
                ))}
              </div>
            </section>
          </TooltipStep>

          {/* Billing */}
          <TooltipStep {...SETTINGS_STEPS.BILLING}>
            <section className={`card ${styles.section}`}>
              <h2 className={styles.sectionTitle}>Plan & Billing</h2>
              <div className={styles.planRow}>
                <div className={styles.planInfo}>
                  <span className="tag tag-amber">Pro Plan</span>
                  <p className={styles.planDesc}>$12/month · Renews on Apr 17, 2026</p>
                </div>
                <button               type='button'
 className="btn btn-ghost">Manage plan</button>
              </div>
            </section>
          </TooltipStep>

          {/* runilib libs */}
          <TooltipStep {...SETTINGS_STEPS.LIBS}>
            <section className={`card ${styles.section} ${styles.libsSection}`}>
              <h2 className={styles.sectionTitle}>⚡ Powered by runilib</h2>
              <p className={styles.libsDesc}>Libraries used in this app — same API on React and React Native.</p>
              <div className={styles.libsList}>
                {[
                  { name: 'stepwise',   version: 'v1.0.0', status: 'active',      desc: 'Guided onboarding tours' },
                  { name: 'formbridge', version: 'v1.0.0', status: 'active',      desc: 'Cross-platform form state' },
                  { name: 'toastly',    version: null,      status: 'coming-soon', desc: 'Toast notifications' },
                  { name: 'modalkit',   version: null,      status: 'coming-soon', desc: 'Modals & bottom sheets' },
                ].map(lib => (
                  <div key={lib.name} className={styles.libRow}>
                    <div>
                      <p className={styles.libName}>{lib.name}</p>
                      <p className={styles.libDesc2}>{lib.desc}</p>
                    </div>
                    <span className={`tag ${lib.status === 'active' ? 'tag-green' : ''}`} style={lib.status !== 'active' ? { background: 'rgba(120,120,120,0.1)', color: 'var(--muted)', border: '1px solid rgba(120,120,120,0.18)' } : {}}>
                      {lib.version ?? 'soon'}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </TooltipStep>

        </div>
      </main>
    </div>
  );
}

// ─── Small sub-components ─────────────────────────────────────────────────────

function Field({ label, defaultValue, type = 'text' }: { label: string; defaultValue: string; type?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)' }}>{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        style={{ padding: '9px 12px', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 8, fontSize: 13.5, color: 'var(--text)', outline: 'none' }}
      />
    </div>
  );
}

function ToggleRow({ label, sub, on }: { label: string; sub: string; on: boolean }) {
  const [checked, setChecked] = useState(on);
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid var(--border)' }}>
      <div>
        <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{label}</p>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{sub}</p>
      </div>
      <div
        onClick={() => setChecked(!checked)}
        style={{ width: 42, height: 24, borderRadius: 12, background: checked ? 'var(--accent)' : 'var(--surface2)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}
      >
        <div style={{ position: 'absolute', top: 3, left: checked ? 20 : 3, width: 18, height: 18, borderRadius: 9, background: '#fff', transition: 'left 0.2s' }} />
      </div>
    </div>
  );
}

function ThemeOption({ name, active }: { name: string; active: boolean }) {
  return (
    <div style={{ flex: 1, padding: '14px 16px', background: active ? 'rgba(240,165,0,0.1)' : 'var(--bg3)', border: `1.5px solid ${active ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 10, textAlign: 'center', cursor: 'pointer' }}>
      <p style={{ fontSize: 13.5, fontWeight: 600, color: active ? 'var(--accent)' : 'var(--muted)' }}>{name}</p>
    </div>
  );
}
