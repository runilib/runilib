/**
 * formura v1.3 — Draft persistence + Conditional fields
 * ──────────────────────────────────────────────────────────
 *
 * Same code works on React web and React Native.
 */

import React, { useEffect } from 'react';
import { useForm, field } from 'formura';
import { ConditionMixin } from 'formura';
import { useFormWizard }  from 'formura';

// Helper to add conditions to a field builder
function conditional<T>(builder: T): T & ConditionMixin {
  Object.assign(builder as any, new ConditionMixin());
  return builder as T & ConditionMixin;
}

// ─── Example 1: Company signup with reactive conditions + draft ───────────────

export function CompanySignupForm() {
  const { Form, fields, state, hasDraft, clearDraft, isLoadingDraft, visibility } = useForm(
    {
      // ── Always visible ──────────────────────────────────────────
      firstName: field.text('First name').required().trim(),
      lastName:  field.text('Last name').required().trim(),
      email:     field.email('Email').required(),
      password:  field.password('Password').required().strong(),

      // ── Visible only when hasCompany is true ────────────────────
      hasCompany: conditional(field.switch('I represent a company')),

      companyName: conditional(field.text('Company name'))
        .requiredWhen('hasCompany', true)
        .visibleWhen('hasCompany', true)
        .resetOnHide(),   // clears when hidden

      vatNumber: conditional(field.text('VAT number'))
        .requiredWhen('hasCompany', true)
        .visibleWhen('hasCompany', true)
        .visibleWhen('country', 'FR')  // AND: only in France
        .resetOnHide(),

      website: conditional(field.url('Company website'))
        .visibleWhen('hasCompany', true)
        .keepOnHide(),    // keeps value if user hides/re-shows

      // ── Country select — changes VAT field visibility ───────────
      country: field.select('Country')
        .options([
          { label: '🇫🇷 France',        value: 'FR' },
          { label: '🇺🇸 United States',  value: 'US' },
          { label: '🇩🇪 Germany',        value: 'DE' },
          { label: '🇬🇧 United Kingdom', value: 'UK' },
        ])
        .required(),

      // ── Pro plan features ────────────────────────────────────────
      plan: field.select('Plan')
        .options(['free', 'pro', 'enterprise'])
        .required(),

      teamSize: conditional(field.number('Team size'))
        .visibleWhenIn('plan', ['pro', 'enterprise'])
        .requiredWhen('plan', 'pro')
        .requiredWhen('plan', 'enterprise')
        .min(1),

      couponCode: conditional(field.text('Coupon code'))
        .visibleWhenNot('plan', 'free')
        .hint('Optional — 10% off on annual billing'),

      // ── Age-gated feature ─────────────────────────────────────────
      seniorDiscount: conditional(field.checkbox('I am 65+ (senior discount)'))
        .visibleWhenGte('age', 65),

      age: field.number('Age').required().min(18).max(120),

      terms: field.checkbox('I accept the Terms & Conditions').mustBeTrue(),
    },
    {
      validateOn: 'onTouched',
      persist: {
        key:      'company-signup',
        storage:  'local',
        ttl:      7200,           // 2 hours
        exclude:  ['password'],   // never persist passwords
        debounce: 800,
        version:  '1',
        onRestore: (values) => console.log('[formura] Draft restored:', Object.keys(values)),
      },
    }
  );

  if (isLoadingDraft) {
    return <div>Loading saved draft…</div>;
  }

  return (
    <Form
      onSubmit={async (values) => {
        await fetch('/api/signup', { method: 'POST', body: JSON.stringify(values) });
        await clearDraft();  // Remove draft after successful submit
      }}
    >
      {/* Draft restoration banner */}
      {hasDraft && (
        <div style={{ padding: '10px 14px', background: '#fef9c3', border: '1px solid #fde047',
                      borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
          📋 Your previous progress has been restored.{' '}
          <button
            type="button"
            onClick={() => clearDraft()}
            style={{ color: '#b45309', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Start fresh
          </button>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        <fields.firstName />
        <fields.lastName />
      </div>
      <fields.email />
      <fields.password />
      <fields.country />
      <fields.age />
      <fields.seniorDiscount />  {/* appears only when age >= 65 */}

      <div style={{ borderTop: '1px solid #e5e7eb', margin: '16px 0 12px' }} />

      <fields.plan />
      <fields.teamSize />      {/* appears for pro/enterprise */}
      <fields.couponCode />    {/* hidden for free plan */}

      <div style={{ borderTop: '1px solid #e5e7eb', margin: '16px 0 12px' }} />

      <fields.hasCompany />
      <fields.companyName />   {/* visible when hasCompany + required */}
      <fields.vatNumber />     {/* visible when hasCompany AND country=FR */}
      <fields.website />       {/* visible when hasCompany */}

      <div style={{ borderTop: '1px solid #e5e7eb', margin: '16px 0 12px' }} />

      <fields.terms />

      {/* Debug: field visibility state */}
      {process.env.NODE_ENV === 'development' && (
        <details style={{ marginTop: 16, fontSize: 11, color: '#9ca3af' }}>
          <summary>Field visibility</summary>
          <pre>{JSON.stringify(visibility, null, 2)}</pre>
        </details>
      )}

      <Form.Submit loadingText="Creating account…">Create account</Form.Submit>
    </Form>
  );
}

// ─── Example 2: Multi-step wizard with persistence ────────────────────────────

export function OnboardingWizard() {
  const wizard = useFormWizard(
    [
      {
        id:    'personal',
        label: 'Personal info',
        schema: {
          firstName: field.text('First name').required().trim(),
          lastName:  field.text('Last name').required().trim(),
          email:     field.email('Email').required(),
        },
      },
      {
        id:    'company',
        label: 'Company (optional)',
        schema: {
          hasCompany:  conditional(field.switch('I represent a company')),
          companyName: conditional(field.text('Company name'))
            .requiredWhen('hasCompany', true)
            .visibleWhen('hasCompany', true),
          companySize: conditional(field.select('Company size'))
            .visibleWhen('hasCompany', true)
            .options(['1–10', '11–50', '51–200', '200+']),
        },
        // Skip this step if user came from a social login
        condition: (allValues) => allValues.source !== 'social',
      },
      {
        id:    'plan',
        label: 'Choose plan',
        schema: {
          plan: field.select('Plan')
            .options([
              { label: 'Free — up to 5 projects', value: 'free'       },
              { label: 'Pro — unlimited, $12/mo',  value: 'pro'        },
              { label: 'Enterprise — contact us',   value: 'enterprise' },
            ])
            .required(),
          coupon: conditional(field.text('Coupon code'))
            .visibleWhenIn('plan', ['pro', 'enterprise'])
            .hint('Have a coupon? Enter it here.'),
        },
      },
      {
        id:    'password',
        label: 'Secure your account',
        schema: {
          password: field.password('Password')
            .required()
            .withStrengthIndicator({ showRules: true }),
          confirm:  field.password('Confirm password')
            .required()
            .matches('password', 'Passwords do not match.'),
          terms:    field.checkbox('I accept the Terms & Conditions').mustBeTrue(),
        },
      },
    ],
    {
      validateOn: 'onTouched',
      onSubmit: async (allValues) => {
        console.log('Final submit values:', allValues);
        await fetch('/api/onboarding', {
          method: 'POST',
          body: JSON.stringify(allValues),
        });
      },
      persist: {
        key:     'onboarding-wizard',
        storage: 'local',
        ttl:     24 * 3600,     // 24 hours
        exclude: ['password', 'confirm'],
      },
    }
  );

  if (wizard.isSuccess) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
        <h2>Welcome aboard!</h2>
        <p>Your account has been created.</p>
      </div>
    );
  }

  const { Form, fields } = wizard.currentStep;

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: 32, fontFamily: 'system-ui, sans-serif' }}>

      {/* Progress bar */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          {wizard.visibleSteps.map((step, i) => (
            <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width:        24, height: 24, borderRadius: '50%',
                background:   wizard.completedSteps.has(step.id) ? '#22c55e' :
                              i === wizard.currentStepIndex ? '#6366f1' : '#e5e7eb',
                color:        i <= wizard.currentStepIndex ? '#fff' : '#9ca3af',
                fontSize:     11, fontWeight: 700,
                display:      'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {wizard.completedSteps.has(step.id) ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: 12, color: i === wizard.currentStepIndex ? '#6366f1' : '#9ca3af' }}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
        <div style={{ height: 4, borderRadius: 2, background: '#e5e7eb', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 2, background: '#6366f1',
            width: `${wizard.progress}%`, transition: 'width 0.4s',
          }} />
        </div>
      </div>

      {/* Step title */}
      <h2 style={{ marginBottom: 20 }}>
        Step {wizard.currentStepIndex + 1} of {wizard.totalSteps} — {wizard.step.label}
      </h2>

      {/* Submit error */}
      {wizard.submitError && (
        <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca',
                      borderRadius: 8, color: '#ef4444', fontSize: 13, marginBottom: 16 }}>
          {wizard.submitError}
        </div>
      )}

      {/* Current step fields */}
      <Form>
        {Object.keys(fields).map(name => {
          const F = (fields as any)[name];
          return F ? <F key={name} /> : null;
        })}

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          {!wizard.isFirstStep && (
            <button
              type="button"
              onClick={wizard.prev}
              style={{ flex: 1, padding: 12, background: 'transparent',
                       border: '1.5px solid #e5e7eb', borderRadius: 9,
                       cursor: 'pointer', fontSize: 14, fontWeight: 600 }}
            >
              ← Back
            </button>
          )}

          {wizard.isLastStep ? (
            <button
              type="button"
              onClick={wizard.submit}
              disabled={wizard.isSubmitting}
              style={{ flex: 1, padding: 12, background: '#6366f1', color: '#fff',
                       border: 'none', borderRadius: 9, cursor: 'pointer',
                       fontSize: 14, fontWeight: 700, opacity: wizard.isSubmitting ? 0.6 : 1 }}
            >
              {wizard.isSubmitting ? 'Creating account…' : '🚀 Create account'}
            </button>
          ) : (
            <button
              type="button"
              onClick={wizard.next}
              style={{ flex: 1, padding: 12, background: '#6366f1', color: '#fff',
                       border: 'none', borderRadius: 9, cursor: 'pointer',
                       fontSize: 14, fontWeight: 700 }}
            >
              Next →
            </button>
          )}
        </div>
      </Form>
    </div>
  );
}

// ─── Example 3: Dynamic required based on another field ───────────────────────

export function InsuranceForm() {
  const { Form, fields, state } = useForm(
    {
      coverageType: field.select('Coverage type')
        .options([
          { label: 'Basic',         value: 'basic'    },
          { label: 'Standard',      value: 'standard' },
          { label: 'Comprehensive', value: 'comp'     },
        ])
        .required(),

      // Only required for standard/comprehensive
      driverName: conditional(field.text('Additional driver name'))
        .visibleWhenIn('coverageType', ['standard', 'comp'])
        .requiredWhenIn('coverageType', ['standard', 'comp']),

      // Visible only for comprehensive, optional
      homeAddress: conditional(field.text('Home address'))
        .visibleWhen('coverageType', 'comp'),

      // Disabled when coverage is basic
      bonusProtection: conditional(field.switch('Bonus protection'))
        .disabledWhen('coverageType', 'basic')
        .hint('Not available with basic coverage'),

      // Visible only when age is a senior
      seniorReduction: conditional(field.switch('Senior reduction (age 70+)'))
        .visibleWhenGte('driverAge', 70),

      driverAge: field.number('Driver age').required().min(18).max(100),
    },
    {
      validateOn: 'onTouched',
      persist: {
        key:     'insurance-form',
        storage: 'session',  // sessionStorage — clears on tab close
        ttl:     0,          // no TTL — lives until tab is closed
      },
    }
  );

  return (
    <Form onSubmit={(v) => console.log('Insurance quote:', v)}>
      <fields.coverageType />
      <fields.driverAge />
      <fields.driverName />        {/* hidden for basic */}
      <fields.homeAddress />       {/* only for comprehensive */}
      <fields.bonusProtection />   {/* disabled for basic */}
      <fields.seniorReduction />   {/* appears when age >= 70 */}
      <Form.Submit>Get my quote</Form.Submit>
    </Form>
  );
}

// ─── Example 4: React Native — same code ─────────────────────────────────────

import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';

export function NativeConditionalForm() {
  const { Form, fields, hasDraft, clearDraft, isLoadingDraft } = useForm(
    {
      accountType: field.select('Account type')
        .options(['personal', 'business'])
        .required(),

      companyName: conditional(field.text('Company name'))
        .requiredWhen('accountType', 'business')
        .visibleWhen('accountType', 'business'),

      vatNumber: conditional(field.text('VAT number'))
        .visibleWhen('accountType', 'business'),

      email:    field.email('Email').required(),
      password: field.password('Password').required().strong(),

      notifications: field.switch('Enable push notifications'),

      // Disable notification frequency when notifications are off
      notifFrequency: conditional(field.select('Notification frequency'))
        .options(['realtime', 'daily', 'weekly'])
        .visibleWhenTruthy('notifications')
        .disabledWhenNot?.('notifications', true),
    },
    {
      validateOn: 'onTouched',
      persist: {
        key:     'native-form',
        storage: 'async',   // AsyncStorage on native
        ttl:     3600,
        exclude: ['password'],
      },
    }
  );

  if (isLoadingDraft) {
    return (
      <SafeAreaView style={ns.safe}>
        <Text style={ns.loading}>Restoring your progress…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={ns.safe}>
      <ScrollView contentContainerStyle={ns.scroll} keyboardShouldPersistTaps="handled">

        {hasDraft && (
          <View style={ns.draftBanner}>
            <Text style={ns.draftText}>📋 Draft restored from your last session</Text>
            <TouchableOpacity onPress={() => clearDraft()}>
              <Text style={ns.draftClear}>Clear</Text>
            </TouchableOpacity>
          </View>
        )}

        <Form onSubmit={(v) => console.log('Native submit:', v)}>
          <fields.accountType />
          <fields.companyName />    {/* hidden for personal */}
          <fields.vatNumber />      {/* hidden for personal */}
          <fields.email />
          <fields.password />
          <fields.notifications />
          <fields.notifFrequency /> {/* hidden when notifications off */}
          <Form.Submit>Create account</Form.Submit>
        </Form>
      </ScrollView>
    </SafeAreaView>
  );
}

const ns = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: '#f9fafb' },
  scroll:      { padding: 20, paddingBottom: 40 },
  loading:     { textAlign: 'center', padding: 40, color: '#6b7280' },
  draftBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                 padding: 12, backgroundColor: '#fef9c3', borderRadius: 8, marginBottom: 16,
                 borderWidth: 1, borderColor: '#fde047' },
  draftText:   { fontSize: 13, color: '#92400e', flex: 1 },
  draftClear:  { fontSize: 13, color: '#b45309', fontWeight: '600', textDecorationLine: 'underline' },
});
