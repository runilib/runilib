import React, { useRef, useCallback } from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { applyMask, extractRaw } from '../../fields/mask/masks';
import type { MaskedDescriptor } from '../../fields/mask/MaskedField';
import type { FieldRenderProps } from '../../types';

interface Props extends FieldRenderProps<string> {
  descriptor: MaskedDescriptor<string>;
}

export function NativeMaskedInput({ descriptor: d, ...p }: Props) {
  const inputRef = useRef<TextInput>(null);

  const handleChangeText = useCallback((text: string) => {
    // Apply case transforms
    let raw = text;
    if (d._maskUppercase) raw = raw.toUpperCase();
    if (d._maskLowercase) raw = raw.toLowerCase();

    // Strip all non-alphanumeric to get the raw user input
    const cleaned = raw.replace(/[^a-zA-Z0-9]/g, '');
    const result  = applyMask(cleaned, d._maskPattern, {
      showPlaceholder: d._maskShowPlaceholder,
      placeholder:     d._maskPlaceholder,
    });

    p.onChange(d._maskStoreRaw ? result.raw : result.display);

    // Auto-advance cursor to next input slot
    if (result.complete) {
      inputRef.current?.blur();
    }
  }, [d, p]);

  // Compute display value
  const displayValue = React.useMemo(() => {
    const raw    = d._maskStoreRaw ? p.value : extractRaw(p.value || '', d._maskPattern);
    const result = applyMask(raw || '', d._maskPattern, {
      showPlaceholder: d._maskShowPlaceholder,
      placeholder:     d._maskPlaceholder,
    });
    return result.display;
  }, [p.value, d]);

  const hasError = Boolean(p.error);

  // Determine keyboard type from pattern content
  const keyboardType = d._maskPattern.replace(/[^9a*]/g, '').includes('a')
    ? 'default'
    : 'numeric';

  return (
    <View style={s.wrap}>
      <Text style={s.label}>
        {p.label}
        {d._required && <Text style={s.required}> *</Text>}
      </Text>
      <TextInput
        ref={inputRef}
        style={[s.input, hasError && s.inputError, p.disabled && s.inputDisabled]}
        value={displayValue}
        placeholder={d._placeholder}
        placeholderTextColor="#9ca3af"
        onChangeText={handleChangeText}
        onBlur={p.onBlur}
        onFocus={p.onFocus}
        keyboardType={keyboardType}
        autoCorrect={false}
        autoCapitalize={d._maskUppercase ? 'characters' : 'none'}
        editable={!p.disabled}
      />
      {p.error
        ? <Text style={s.error} accessibilityRole="alert">{p.error}</Text>
        : p.hint
          ? <Text style={s.hint}>{p.hint}</Text>
          : null}
    </View>
  );
}

const s = StyleSheet.create({
  wrap:          { marginBottom: 16 },
  label:         { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  required:      { color: '#ef4444' },
  input:         { borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 9, paddingHorizontal: 13, paddingVertical: 11, fontSize: 14, fontFamily: 'monospace', color: '#111', backgroundColor: '#fff', letterSpacing: 1 },
  inputError:    { borderColor: '#ef4444' },
  inputDisabled: { backgroundColor: '#f9fafb', color: '#9ca3af' },
  error:         { fontSize: 12, color: '#ef4444', marginTop: 5 },
  hint:          { fontSize: 12, color: '#9ca3af', marginTop: 5 },
});
