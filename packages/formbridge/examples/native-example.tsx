/**
 * formbridge — React Native example
 * ────────────────────────────────────
 * npm install formbridge react-native
 */

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, SafeAreaView, Switch,
} from 'react-native';
import {
  useForm, ErrorMessage, FormProvider, useFormContext, validators,
} from 'formbridge';
import type { UseFormReturn, NativeFieldProps } from 'formbridge';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SignUpForm {
  firstName:       string;
  lastName:        string;
  email:           string;
  password:        string;
  confirmPassword: string;
  terms:           boolean;
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [submitted, setSubmitted] = useState<SignUpForm | null>(null);

  const form = useForm<SignUpForm>({
    defaultValues: {
      firstName: '', lastName: '', email: '',
      password: '', confirmPassword: '', terms: false,
    },
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const onSubmit = form.handleSubmit(
    (values) => setSubmitted(values),
    (errors) => console.warn('Invalid:', errors),
  );

  if (submitted) {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.success}>
          <Text style={s.successTitle}>🎉 Account created!</Text>
          <Text style={s.successBody}>{JSON.stringify(submitted, null, 2)}</Text>
          <TouchableOpacity style={s.btn} onPress={() => { setSubmitted(null); form.reset(); }}>
            <Text style={s.btnText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container}>
      <FormProvider form={form as unknown as UseFormReturn}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <Text style={s.title}>Create account</Text>
          <Text style={s.subtitle}>Powered by formbridge</Text>

          <View style={s.row}>
            <NativeField label="First name" name="firstName" placeholder="Jean"   required flex />
            <NativeField label="Last name"  name="lastName"  placeholder="Dupont" required flex />
          </View>

          <NativeField
            label="Email"
            name="email"
            placeholder="you@example.com"
            keyboardType="email-address"
            rules={{ required: true, ...validators.email }}
          />

          <NativeField
            label="Password"
            name="password"
            placeholder="Min 8 characters"
            secureTextEntry
            rules={validators.strongPassword}
          />

          <ConfirmPasswordField />

          <TermsField />

          <TouchableOpacity
            style={[s.btn, form.formState.isSubmitting && s.btnDisabled]}
            onPress={onSubmit}
            disabled={form.formState.isSubmitting}
          >
            <Text style={s.btnText}>
              {form.formState.isSubmitting ? 'Creating account…' : 'Create account →'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </FormProvider>
    </SafeAreaView>
  );
}

// ─── NativeField ─────────────────────────────────────────────────────────────

function NativeField({ label, name, placeholder, required, rules = {}, flex, ...inputProps }: {
  label:            string;
  name:             string;
  placeholder?:     string;
  required?:        boolean;
  rules?:           Record<string, unknown>;
  flex?:            boolean;
  keyboardType?:    string;
  secureTextEntry?: boolean;
}) {
  const { register, formState } = useFormContext();
  const allRules = required ? { required: true, ...rules } : rules;
  const fieldProps = register(name, allRules) as NativeFieldProps;
  const hasError = Boolean(formState.errors[name]);

  return (
    <View style={[s.field, flex && { flex: 1 }]}>
      <Text style={s.label}>
        {label}{required && <Text style={s.req}> *</Text>}
      </Text>
      <TextInput
        {...fieldProps}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        style={[s.input, hasError && s.inputError]}
        {...(inputProps as any)}
      />
      <ErrorMessage error={formState.errors[name] as string | null} />
    </View>
  );
}

// ─── Confirm password ─────────────────────────────────────────────────────────

function ConfirmPasswordField() {
  const { register, watch, formState } = useFormContext();
  const password = watch('password') as string;
  const fieldProps = register('confirmPassword', {
    required: true,
    validate: (v: unknown) => v === password ? null : 'Passwords do not match.',
  }) as NativeFieldProps;

  return (
    <View style={s.field}>
      <Text style={s.label}>Confirm password <Text style={s.req}>*</Text></Text>
      <TextInput
        {...fieldProps}
        placeholder="Repeat your password"
        placeholderTextColor="#9ca3af"
        secureTextEntry
        style={[s.input, formState.errors.confirmPassword && s.inputError]}
      />
      <ErrorMessage error={formState.errors.confirmPassword as string | null} />
    </View>
  );
}

// ─── Terms ────────────────────────────────────────────────────────────────────

function TermsField() {
  const { setValue, watch, formState } = useFormContext();
  const accepted = watch('terms') as boolean;

  return (
    <View style={s.termsRow}>
      <Switch
        value={Boolean(accepted)}
        onValueChange={(v) => setValue('terms', v, { shouldValidate: true })}
        trackColor={{ true: '#6366f1' }}
      />
      <Text style={s.termsText}>I accept the terms and conditions</Text>
      {formState.errors.terms && (
        <ErrorMessage error={formState.errors.terms as string | null} />
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#f9fafb' },
  scroll:       { padding: 24, paddingBottom: 40 },
  title:        { fontSize: 26, fontWeight: '700', color: '#111', marginBottom: 4 },
  subtitle:     { fontSize: 14, color: '#6b7280', marginBottom: 28 },
  row:          { flexDirection: 'row', gap: 12 },
  field:        { marginBottom: 16 },
  label:        { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  req:          { color: '#ef4444' },
  input:        { padding: 12, borderRadius: 9, borderWidth: 1, borderColor: '#e5e7eb', fontSize: 14, color: '#111', backgroundColor: '#fff' },
  inputError:   { borderColor: '#ef4444' },
  termsRow:     { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  termsText:    { fontSize: 14, color: '#374151', flex: 1 },
  btn:          { padding: 14, backgroundColor: '#6366f1', borderRadius: 10, alignItems: 'center', marginTop: 8 },
  btnDisabled:  { opacity: 0.6 },
  btnText:      { color: '#fff', fontWeight: '700', fontSize: 15 },
  success:      { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  successTitle: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  successBody:  { fontFamily: 'monospace', fontSize: 12, color: '#374151', marginBottom: 24 },
});
