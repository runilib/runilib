/**
 * formura — Web example
 * ─────────────────────────
 * npm install formura react react-dom
 *
 * The key difference from react-hook-form:
 * - You define your schema ONCE with field builders
 * - Fields render themselves with the right input type, label, error
 * - No register(), no spread props, no manual validation wiring
 */

import React, { useState } from 'react';
import { useForm, field, zodResolver } from 'formura';

// ─── Optional: Zod schema (you can mix or replace the field builders) ─────────
// import { z } from 'zod';
// const schema = z.object({ ... });
// const form = useForm({ ... }, { resolver: zodResolver(schema) });

// ─── Example 1: Sign up form ─────────────────────────────────────────────────

export function SignUpForm() {
  const [submitted, setSubmitted] = useState<Record<string, unknown> | null>(null);

  const { Form, fields, state } = useForm(
    {
      firstName:  field.text('First name').required().trim().max(50),
      lastName:   field.text('Last name').required().trim().max(50),
      email:      field.email('Email address').required()
                      .hint('We\'ll never share your email.'),
      password:   field.password('Password').required().strong()
                      .hint('Min 8 chars, uppercase, number, special char.'),
      confirm:    field.password('Confirm password').required()
                      .matches('password', 'Passwords do not match.'),
      age:        field.number('Age').required().min(18).max(120),
      country:    field.select('Country')
                      .options([
                        { label: '🇫🇷 France',         value: 'FR' },
                        { label: '🇺🇸 United States',   value: 'US' },
                        { label: '🇬🇧 United Kingdom',  value: 'UK' },
                        { label: '🇩🇪 Germany',         value: 'DE' },
                        { label: '🇸🇳 Senegal',         value: 'SN' },
                      ])
                      .required(),
      role:       field.radio('I am a…')
                      .options([
                        { label: 'Developer',  value: 'dev'     },
                        { label: 'Designer',   value: 'design'  },
                        { label: 'Manager',    value: 'manager' },
                      ])
                      .required(),
      newsletter: field.checkbox('Subscribe to the newsletter'),
      terms:      field.checkbox('I accept the Terms & Conditions').mustBeTrue(),
    },
    { validateOn: 'onTouched' }
  );

  if (submitted) {
    return (
      <div style={s.success}>
        <div style={s.successIcon}>🎉</div>
        <h2 style={s.successTitle}>Account created!</h2>
        <pre style={s.successJson}>{JSON.stringify(submitted, null, 2)}</pre>
        <button style={s.btn} onClick={() => setSubmitted(null)}>Start over</button>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h1 style={s.title}>Create account</h1>
        <p style={s.subtitle}>Powered by <strong>formura</strong> · schema-first</p>

        {state.submitError && (
          <div style={s.submitError}>{state.submitError}</div>
        )}

        <Form
          onSubmit={async (values) => {
            await new Promise(r => setTimeout(r, 800)); // simulate API
            setSubmitted(values as Record<string, unknown>);
          }}
          onError={(errors) => console.warn('Form errors:', errors)}
          onSubmitError={(err) => 'Server error. Please try again.'}
        >
          {/* Name row */}
          <div style={s.row}>
            <fields.firstName />
            <fields.lastName  />
          </div>

          <fields.email />
          <fields.password />
          <fields.confirm />
          <fields.age />
          <fields.country />
          <fields.role />
          <fields.newsletter />
          <fields.terms />

          {/* Custom submit button */}
          <Form.Submit
            style={s.btn}
            loadingText="Creating account…"
          >
            Create account →
          </Form.Submit>
        </Form>

        {/* Debug state (dev only) */}
        {process.env.NODE_ENV === 'development' && (
          <details style={{ marginTop: 24 }}>
            <summary style={{ cursor: 'pointer', color: '#9ca3af', fontSize: 12 }}>
              Debug state
            </summary>
            <pre style={{ fontSize: 11, color: '#6b7280', marginTop: 8, overflow: 'auto' }}>
              {JSON.stringify({ values: state.values, errors: state.errors, status: state.status }, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

// ─── Example 2: OTP verification ─────────────────────────────────────────────

export function OtpForm() {
  const { Form, fields } = useForm(
    {
      otp: field.otp('Verification code').required().length(6)
               .hint('Enter the 6-digit code sent to your email.'),
    },
    { validateOn: 'onChange' }
  );

  return (
    <Form onSubmit={(v) => alert(`OTP: ${v.otp}`)}>
      <fields.otp />
      <Form.Submit style={s.btn}>Verify</Form.Submit>
    </Form>
  );
}

// ─── Example 3: Async username check ─────────────────────────────────────────

export function UsernameForm() {
  const { Form, fields } = useForm(
    {
      username: field.text('Username')
                    .required()
                    .min(3)
                    .max(20)
                    .pattern(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores.')
                    .validate(async (v) => {
                      // Simulates API call
                      await new Promise(r => setTimeout(r, 500));
                      const taken = ['admin', 'aks', 'root'];
                      return taken.includes(String(v)) ? 'Username is already taken.' : null;
                    })
                    .debounce(400)
                    .hint('Checking availability as you type…'),
    },
    { validateOn: 'onChange' }
  );

  return (
    <Form onSubmit={(v) => alert(`Username chosen: ${v.username}`)}>
      <fields.username />
      <Form.Submit style={s.btn}>Choose username</Form.Submit>
    </Form>
  );
}

// ─── Example 4: Custom field renderer ────────────────────────────────────────

export function CustomRendererForm() {
  const { Form, fields } = useForm({
    rating: field.number('Rating').required().min(1).max(5)
                .render(({ value, onChange, error, label }) => (
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>{label}</p>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => onChange(n)}
                          style={{
                            fontSize: 28,
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            opacity: Number(value) >= n ? 1 : 0.25,
                          }}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    {error && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>{error}</p>}
                  </div>
                )),
  });

  return (
    <Form onSubmit={(v) => alert(`Rating: ${v.rating} stars`)}>
      <fields.rating />
      <Form.Submit style={s.btn}>Submit review</Form.Submit>
    </Form>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  page:        { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', fontFamily: 'system-ui, sans-serif', padding: 24 },
  card:        { background: '#fff', borderRadius: 16, padding: '36px 40px', width: '100%', maxWidth: 540, boxShadow: '0 4px 32px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb' },
  title:       { fontSize: 26, fontWeight: 700, color: '#111', marginBottom: 4, fontFamily: 'Georgia, serif' },
  subtitle:    { fontSize: 14, color: '#6b7280', marginBottom: 28 },
  row:         { display: 'flex', gap: 14 },
  btn:         { width: '100%', marginTop: 12, padding: '13px 0', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer' },
  submitError: { padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#ef4444', fontSize: 13, marginBottom: 16 },
  success:     { maxWidth: 460, margin: '80px auto', padding: 36, textAlign: 'center', fontFamily: 'system-ui, sans-serif' },
  successIcon: { fontSize: 48, marginBottom: 16 },
  successTitle:{ fontSize: 24, fontWeight: 700, color: '#111', marginBottom: 16 },
  successJson: { fontSize: 11, color: '#6b7280', textAlign: 'left', background: '#f9fafb', padding: 16, borderRadius: 8, overflow: 'auto', marginBottom: 20 },
};

// ─── Default export: all examples on one page ─────────────────────────────────

export default function App() {
  const [demo, setDemo] = useState<'signup' | 'otp' | 'username' | 'custom'>('signup');

  const tabs: { id: typeof demo; label: string }[] = [
    { id: 'signup',   label: 'Sign up' },
    { id: 'otp',      label: 'OTP' },
    { id: 'username', label: 'Async check' },
    { id: 'custom',   label: 'Custom field' },
  ];

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '24px 0 0', background: '#f9fafb' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setDemo(t.id)}
            style={{
              padding: '8px 18px', borderRadius: 8, border: 'none',
              background: demo === t.id ? '#6366f1' : '#e5e7eb',
              color:      demo === t.id ? '#fff'    : '#374151',
              fontWeight: 600, fontSize: 13, cursor: 'pointer',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {demo === 'signup'   && <SignUpForm />}
      {demo === 'otp'      && <div style={{ padding: 40, maxWidth: 360, margin: '0 auto' }}><OtpForm /></div>}
      {demo === 'username' && <div style={{ padding: 40, maxWidth: 360, margin: '0 auto' }}><UsernameForm /></div>}
      {demo === 'custom'   && <div style={{ padding: 40, maxWidth: 360, margin: '0 auto' }}><CustomRendererForm /></div>}
    </div>
  );
}
