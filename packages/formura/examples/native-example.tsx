/**
 * formura — React Native example
 * ──────────────────────────────────
 * npm install formura react-native
 *
 * Same schema, same API — the fields auto-render with native primitives.
 */

import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  SafeAreaView, StyleSheet, Alert,
} from 'react-native';
import { useForm, field } from 'formura';

// ─── Example 1: Sign-up form ─────────────────────────────────────────────────

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
      age:        field.number('Age').required().min(18),
      country:    field.select('Country')
                      .options([
                        { label: '🇫🇷 France',        value: 'FR' },
                        { label: '🇺🇸 United States',  value: 'US' },
                        { label: '🇬🇧 United Kingdom', value: 'UK' },
                        { label: '🇸🇳 Senegal',        value: 'SN' },
                      ])
                      .required(),
      newsletter: field.switch('Subscribe to updates'),
      terms:      field.checkbox('I accept the Terms & Conditions').mustBeTrue(),
    },
    { validateOn: 'onTouched' }
  );

  if (submitted) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.success}>
          <Text style={s.successIcon}>🎉</Text>
          <Text style={s.successTitle}>Account created!</Text>
          <Text style={s.successJson}>{JSON.stringify(submitted, null, 2)}</Text>
          <TouchableOpacity style={s.btn} onPress={() => setSubmitted(null)}>
            <Text style={s.btnText}>Start over</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <Text style={s.title}>Create account</Text>
        <Text style={s.subtitle}>Powered by formura · schema-first</Text>

        {state.submitError && (
          <View style={s.submitError}>
            <Text style={s.submitErrorText}>{state.submitError}</Text>
          </View>
        )}

        <Form
          onSubmit={async (values) => {
            await new Promise(r => setTimeout(r, 800));
            setSubmitted(values as Record<string, unknown>);
          }}
          onSubmitError={() => 'Server error. Please try again.'}
        >
          {/* Render the fields — they auto-adapt to native */}
          <View style={s.row}>
            <View style={{ flex: 1 }}><fields.firstName /></View>
            <View style={{ flex: 1 }}><fields.lastName /></View>
          </View>

          <fields.email />
          <fields.password />
          <fields.confirm />
          <fields.age />
          <fields.country />
          <fields.newsletter />
          <fields.terms />

          <Form.Submit
            style={s.btn}
            loadingText="Creating account…"
          >
            <Text style={s.btnText}>Create account →</Text>
          </Form.Submit>
        </Form>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Example 2: OTP screen ────────────────────────────────────────────────────

export function OtpScreen() {
  const { Form, fields, state } = useForm(
    {
      code: field.otp('Verification code')
                .required()
                .length(6)
                .hint('Enter the 6-digit code sent to your phone.'),
    },
    { validateOn: 'onChange' }
  );

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.centeredContent}>
        <Text style={s.bigIcon}>📱</Text>
        <Text style={s.title}>Verify your number</Text>
        <Text style={s.subtitle}>Enter the code we sent to +33 6 •• •• 42</Text>

        <Form
          onSubmit={(v) => Alert.alert('Verified!', `Code: ${v.code}`)}
          style={{ width: '100%' }}
        >
          <fields.code />
          <Form.Submit
            style={[s.btn, { marginTop: 8 }]}
            loadingText="Verifying…"
          >
            <Text style={s.btnText}>Verify</Text>
          </Form.Submit>
        </Form>

        <TouchableOpacity style={s.resendBtn}>
          <Text style={s.resendText}>Didn't receive it? Resend</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Example 3: Profile edit (prefilled values) ───────────────────────────────

export function ProfileEditForm() {
  const { Form, fields, state, reset } = useForm(
    {
      displayName: field.text('Display name').required().trim().max(40),
      bio:         field.textarea('Bio').max(200).hint('Max 200 characters.'),
      website:     field.url('Website').hint('https://yoursite.com'),
      role:        field.radio('Role')
                       .options([
                         { label: 'Developer',  value: 'dev'     },
                         { label: 'Designer',   value: 'design'  },
                         { label: 'Manager',    value: 'manager' },
                       ]),
      notifications: field.switch('Push notifications'),
      publicProfile: field.switch('Public profile'),
    },
    { validateOn: 'onBlur' }
  );

  // Prefill with existing data
  React.useEffect(() => {
    reset({
      displayName:   'AKS',
      bio:           'Senior Frontend Engineer. Building react-unikit.',
      website:       'https://unikit.dev',
      role:          'dev',
      notifications: true,
      publicProfile: true,
    });
  }, [reset]);

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <Text style={s.title}>Edit profile</Text>

        <Form
          onSubmit={(v) => Alert.alert('Saved!', JSON.stringify(v, null, 2))}
        >
          <fields.displayName />
          <fields.bio />
          <fields.website />
          <fields.role />

          <View style={s.switchSection}>
            <Text style={s.switchSectionTitle}>Preferences</Text>
            <fields.notifications />
            <fields.publicProfile />
          </View>

          <Form.Submit style={s.btn} loadingText="Saving…">
            <Text style={s.btnText}>Save changes</Text>
          </Form.Submit>
        </Form>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Example 4: Custom field renderer on native ───────────────────────────────

export function RatingForm() {
  const { Form, fields } = useForm({
    rating: field.number('How would you rate us?')
                .required()
                .min(1, 'Please select at least 1 star.')
                .max(5)
                .render(({ value, onChange, error, label }) => (
                  <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 10 }}>
                      {label}
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      {[1, 2, 3, 4, 5].map(n => (
                        <TouchableOpacity key={n} onPress={() => onChange(n)}>
                          <Text style={{ fontSize: 36, opacity: Number(value) >= n ? 1 : 0.2 }}>★</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    {error && <Text style={{ color: '#ef4444', fontSize: 12, marginTop: 6 }}>{error}</Text>}
                  </View>
                )),
    comment: field.textarea('Leave a comment').max(300).hint('Optional feedback'),
  });

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.title}>Rate your experience</Text>
        <Form onSubmit={(v) => Alert.alert('Thanks!', `${v.rating} stars`)}>
          <fields.rating />
          <fields.comment />
          <Form.Submit style={s.btn}>
            <Text style={s.btnText}>Submit review</Text>
          </Form.Submit>
        </Form>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  safe:               { flex: 1, backgroundColor: '#f9fafb' },
  scroll:             { padding: 24, paddingBottom: 40 },
  centeredContent:    { flex: 1, alignItems: 'center', padding: 32 },
  bigIcon:            { fontSize: 52, marginBottom: 16 },
  title:              { fontSize: 26, fontWeight: '700', color: '#111', letterSpacing: -0.5, marginBottom: 4 },
  subtitle:           { fontSize: 14, color: '#6b7280', marginBottom: 28 },
  row:                { flexDirection: 'row', gap: 12 },
  btn:                { marginTop: 8, backgroundColor: '#6366f1', borderRadius: 12, padding: 15, alignItems: 'center' },
  btnText:            { color: '#fff', fontWeight: '700', fontSize: 15 },
  submitError:        { padding: 12, backgroundColor: '#fef2f2', borderRadius: 8, borderWidth: 1, borderColor: '#fecaca', marginBottom: 16 },
  submitErrorText:    { color: '#ef4444', fontSize: 13 },
  success:            { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  successIcon:        { fontSize: 52, marginBottom: 16 },
  successTitle:       { fontSize: 24, fontWeight: '700', marginBottom: 16, color: '#111' },
  successJson:        { fontFamily: 'monospace', fontSize: 11, color: '#6b7280', marginBottom: 24 },
  switchSection:      { marginTop: 8, marginBottom: 8 },
  switchSectionTitle: { fontSize: 13, fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 },
  resendBtn:          { marginTop: 20 },
  resendText:         { color: '#6366f1', fontSize: 14, fontWeight: '600' },
});
