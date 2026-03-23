import React from 'react';
import {
  View, Text, TextInput, Switch, TouchableOpacity,
  StyleSheet, Platform, ActivityIndicator,
} from 'react-native';
import type { FieldDescriptor, FieldRenderProps } from '../../types';

interface Props extends FieldRenderProps<unknown> {
  descriptor: FieldDescriptor<unknown>;
  extra?:     { style?: object };
}

export function NativeField({ descriptor: d, extra, ...p }: Props) {
  const hasError = Boolean(p.error);

  return (
    <View style={[s.wrap, extra?.style as any]}>
      {/* Label — hide for checkbox/switch (label is inline) */}
      {d._type !== 'checkbox' && d._type !== 'switch' && (
        <Text style={s.label}>
          {p.label}
          {d._required && <Text style={s.required}> *</Text>}
        </Text>
      )}

      {/* Field */}
      {renderNativeField(d, p, hasError)}

      {/* Error / hint */}
      {p.error
        ? <Text style={s.error} accessibilityRole="alert">{p.error}</Text>
        : p.hint
          ? <Text style={s.hint}>{p.hint}</Text>
          : null}
    </View>
  );
}

function renderNativeField(d: FieldDescriptor<unknown>, p: FieldRenderProps<unknown>, hasError: boolean) {
  const borderColor = hasError ? '#ef4444' : '#e5e7eb';

  switch (d._type) {
    case 'checkbox':
    case 'switch':
      return (
        <View style={s.switchRow}>
          <Switch
            value={Boolean(p.value)}
            onValueChange={v => p.onChange(v)}
            disabled={p.disabled}
            trackColor={{ true: '#6366f1' }}
            thumbColor={Platform.OS === 'android' ? '#fff' : undefined}
          />
          <Text style={s.switchLabel}>{p.label}{d._required && <Text style={s.required}> *</Text>}</Text>
        </View>
      );

    case 'select':
    case 'radio':
      return (
        <View style={s.optionsWrap}>
          {d._options?.map(opt => {
            const selected = p.value === opt.value;
            return (
              <TouchableOpacity
                key={String(opt.value)}
                style={[s.optionItem, selected && s.optionItemSelected, hasError && s.optionItemError]}
                onPress={() => { p.onChange(opt.value); p.onBlur(); }}
                disabled={p.disabled}
              >
                <View style={[s.optionRadio, selected && s.optionRadioSelected]}>
                  {selected && <View style={s.optionRadioDot} />}
                </View>
                <Text style={[s.optionLabel, selected && s.optionLabelSelected]}>{opt.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      );

    case 'otp': {
      const len   = d._otpLength ?? 6;
      const chars = String(p.value ?? '').split('');
      const refs: React.RefObject<TextInput>[] = Array.from({ length: len }, () => React.createRef<TextInput>());

      return (
        <View style={s.otpRow}>
          {Array.from({ length: len }).map((_, i) => (
            <TextInput
              key={i}
              ref={refs[i]}
              style={[s.otpCell, { borderColor }, hasError && s.otpCellError]}
              value={chars[i] ?? ''}
              maxLength={1}
              keyboardType="number-pad"
              textAlign="center"
              onChangeText={t => {
                const next = [...chars];
                next[i]   = t.slice(-1);
                p.onChange(next.join(''));
                if (t && refs[i + 1]?.current) refs[i + 1].current?.focus();
              }}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace' && !chars[i] && refs[i - 1]?.current) {
                  refs[i - 1].current?.focus();
                }
              }}
              onBlur={p.onBlur}
              editable={!p.disabled}
            />
          ))}
        </View>
      );
    }

    case 'textarea':
      return (
        <View style={{ position: 'relative' }}>
          <TextInput
            style={[s.input, s.textarea, { borderColor }, hasError && s.inputError, p.disabled && s.inputDisabled]}
            value={p.value as string}
            placeholder={p.placeholder}
            placeholderTextColor="#9ca3af"
            onChangeText={v => p.onChange(v)}
            onBlur={p.onBlur}
            onFocus={p.onFocus}
            editable={!p.disabled}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      );

    case 'number':
      return (
        <TextInput
          style={[s.input, { borderColor }, hasError && s.inputError, p.disabled && s.inputDisabled]}
          value={p.value !== 0 ? String(p.value ?? '') : ''}
          placeholder={p.placeholder}
          placeholderTextColor="#9ca3af"
          keyboardType="numeric"
          onChangeText={v => p.onChange(v === '' ? 0 : Number(v))}
          onBlur={p.onBlur}
          onFocus={p.onFocus}
          editable={!p.disabled}
        />
      );

    default:
      // text, email, password, tel, url
      return (
        <View style={s.inputWrap}>
          <TextInput
            style={[s.input, { borderColor }, hasError && s.inputError, p.disabled && s.inputDisabled]}
            value={p.value as string}
            placeholder={p.placeholder}
            placeholderTextColor="#9ca3af"
            secureTextEntry={d._type === 'password'}
            keyboardType={
              d._type === 'email' ? 'email-address' :
              d._type === 'tel'   ? 'phone-pad'     :
              d._type === 'url'   ? 'url'           :
              'default'
            }
            autoCapitalize={d._type === 'email' || d._type === 'password' ? 'none' : 'sentences'}
            autoCorrect={d._type !== 'email' && d._type !== 'password'}
            textContentType={
              d._type === 'email'    ? 'emailAddress'  :
              d._type === 'password' ? 'password'      :
              d._type === 'tel'      ? 'telephoneNumber':
              'none'
            }
            onChangeText={v => p.onChange(v)}
            onBlur={p.onBlur}
            onFocus={p.onFocus}
            editable={!p.disabled}
          />
          {p.validating && (
            <ActivityIndicator size="small" color="#9ca3af" style={s.spinner} />
          )}
        </View>
      );
  }
}

const s = StyleSheet.create({
  wrap:               { marginBottom: 16 },
  label:              { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  required:           { color: '#ef4444' },
  inputWrap:          { position: 'relative', justifyContent: 'center' },
  input:              { paddingHorizontal: 13, paddingVertical: 11, borderRadius: 9, borderWidth: 1.5, fontSize: 14, color: '#111', backgroundColor: '#fff' },
  textarea:           { height: 96, paddingTop: 11 },
  inputError:         { borderColor: '#ef4444' },
  inputDisabled:      { backgroundColor: '#f9fafb', color: '#9ca3af' },
  spinner:            { position: 'absolute', right: 12 },
  error:              { fontSize: 12, color: '#ef4444', marginTop: 5 },
  hint:               { fontSize: 12, color: '#9ca3af', marginTop: 5 },
  switchRow:          { flexDirection: 'row', alignItems: 'center', gap: 10 },
  switchLabel:        { fontSize: 14, color: '#374151', flex: 1 },
  optionsWrap:        { gap: 8 },
  optionItem:         { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 9, borderWidth: 1.5, borderColor: '#e5e7eb', backgroundColor: '#fff' },
  optionItemSelected: { borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.05)' },
  optionItemError:    { borderColor: '#ef4444' },
  optionRadio:        { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#d1d5db', alignItems: 'center', justifyContent: 'center' },
  optionRadioSelected:{ borderColor: '#6366f1' },
  optionRadioDot:     { width: 8, height: 8, borderRadius: 4, backgroundColor: '#6366f1' },
  optionLabel:        { fontSize: 14, color: '#374151' },
  optionLabelSelected:{ color: '#6366f1', fontWeight: '600' },
  otpRow:             { flexDirection: 'row', gap: 8 },
  otpCell:            { flex: 1, height: 56, borderRadius: 9, borderWidth: 1.5, fontSize: 22, fontWeight: '700', color: '#111', backgroundColor: '#fff' },
  otpCellError:       { borderColor: '#ef4444' },
});
