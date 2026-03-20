/**
 * formbridge — React Web example
 * ──────────────────────────────
 * npm install formbridge react react-dom
 */

import React, { useState } from 'react';
import {
  useForm, ErrorMessage, FormProvider, useFormContext, validators,
} from 'formbridge';
import type { UseFormReturn } from 'formbridge';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SignUpForm {
  firstName:       string;
  lastName:        string;
  email:           string;
  password:        string;
  confirmPassword: string;
  age:             number;
  terms:           boolean;
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [submitted, setSubmitted] = useState<SignUpForm | null>(null);

  const form = useForm<SignUpForm>({
    defaultValues: {
      firstName: '', lastName: '', email: '',
      password: '', confirmPassword: '', age: 0, terms: false,
    },
    mode: 'onTouched',     // validate as soon as a field is touched
    reValidateMode: 'onChange', // re-validate on every keystroke after first submit
  });

  const onSubmit = form.handleSubmit(
    (values) => setSubmitted(values),
    (errors) => console.warn('Invalid form:', errors),
  );

  if (submitted) {
    return (
      <div style={s.success}>
        <h2>🎉 Account created!</h2>
        <pre>{JSON.stringify(submitted, null, 2)}</pre>
        <button style={s.btn} onClick={() => { setSubmitted(null); form.reset(); }}>
          Reset
        </button>
      </div>
    );
  }

  return (
    <FormProvider form={form as unknown as UseFormReturn}>
      <div style={s.page}>
        <div style={s.card}>
          <h1 style={s.title}>Create account</h1>
          <p style={s.subtitle}>Powered by <strong>formbridge</strong></p>

          <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} noValidate>
            {/* Row: first + last name */}
            <div style={s.row}>
              <FormField label="First name" name="firstName" placeholder="Jean" required />
              <FormField label="Last name"  name="lastName"  placeholder="Dupont" required />
            </div>

            {/* Email */}
            <FormField
              label="Email address"
              name="email"
              type="email"
              placeholder="you@example.com"
              rules={{ required: true, ...validators.email }}
            />

            {/* Password */}
            <FormField
              label="Password"
              name="password"
              type="password"
              placeholder="Min 8 characters"
              rules={validators.strongPassword}
            />

            {/* Confirm password */}
            <ConfirmPasswordField />

            {/* Age */}
            <FormField
              label="Age"
              name="age"
              type="number"
              placeholder="18"
              rules={{ required: true, min: { value: 18, message: 'You must be at least 18.' } }}
            />

            {/* Terms */}
            <TermsField />

            {/* Submit */}
            <button
              type="submit"
              style={{
                ...s.btn,
                opacity: form.formState.isSubmitting ? 0.6 : 1,
              }}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Creating account…' : 'Create account →'}
            </button>
          </form>
        </div>
      </div>
    </FormProvider>
  );
}

// ─── Reusable FormField ───────────────────────────────────────────────────────

function FormField({ label, name, type = 'text', placeholder, required, rules = {} }: {
  label:        string;
  name:         string;
  type?:        string;
  placeholder?: string;
  required?:    boolean;
  rules?:       Record<string, unknown>;
}) {
  const { register, formState } = useFormContext();
  const allRules = required ? { required: true, ...rules } : rules;

  return (
    <div style={s.field}>
      <label style={s.label}>
        {label}{required && <span style={s.req}> *</span>}
      </label>
      <input
        {...(register(name, allRules) as React.InputHTMLAttributes<HTMLInputElement>)}
        type={type}
        placeholder={placeholder}
        style={{
          ...s.input,
          borderColor: formState.errors[name] ? '#ef4444' : '#e5e7eb',
        }}
      />
      <ErrorMessage error={formState.errors[name] as string | null} />
    </div>
  );
}

// ─── Confirm password (uses watch to compare) ─────────────────────────────────

function ConfirmPasswordField() {
  const { register, watch, formState } = useFormContext();
  const password = watch('password');

  return (
    <div style={s.field}>
      <label style={s.label}>Confirm password <span style={s.req}>*</span></label>
      <input
        {...(register('confirmPassword', {
          required: true,
          validate: (v) => v === password ? null : 'Passwords do not match.',
        }) as React.InputHTMLAttributes<HTMLInputElement>)}
        type="password"
        placeholder="Repeat your password"
        style={{
          ...s.input,
          borderColor: formState.errors.confirmPassword ? '#ef4444' : '#e5e7eb',
        }}
      />
      <ErrorMessage error={formState.errors.confirmPassword as string | null} />
    </div>
  );
}

// ─── Terms checkbox ───────────────────────────────────────────────────────────

function TermsField() {
  const { register, formState } = useFormContext();
  return (
    <div style={{ ...s.field, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <input
        {...(register('terms', { required: 'You must accept the terms.' }) as React.InputHTMLAttributes<HTMLInputElement>)}
        type="checkbox"
        id="terms"
        style={{ width: 16, height: 16, cursor: 'pointer' }}
      />
      <label htmlFor="terms" style={{ ...s.label, margin: 0, cursor: 'pointer' }}>
        I accept the terms and conditions
      </label>
      <ErrorMessage error={formState.errors.terms as string | null} />
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  page:     { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', fontFamily: 'system-ui,sans-serif', padding: 20 },
  card:     { background: '#fff', borderRadius: 14, padding: '36px 40px', width: '100%', maxWidth: 520, boxShadow: '0 4px 32px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb' },
  title:    { fontSize: 26, fontWeight: 700, color: '#111', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#6b7280', marginBottom: 28 },
  row:      { display: 'flex', gap: 16 },
  field:    { marginBottom: 18, display: 'flex', flexDirection: 'column', flex: 1 },
  label:    { fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 },
  req:      { color: '#ef4444' },
  input:    { padding: '10px 13px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 14, outline: 'none', transition: 'border-color 0.15s' },
  btn:      { width: '100%', marginTop: 8, padding: '12px 0', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  success:  { maxWidth: 480, margin: '80px auto', padding: 32, background: '#fff', borderRadius: 14, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', fontFamily: 'system-ui,sans-serif', textAlign: 'center' },
};
