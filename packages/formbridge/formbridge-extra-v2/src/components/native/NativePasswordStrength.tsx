import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { scorePassword } from '../../fields/password/strength';
import type { PasswordStrengthMeta } from '../../fields/password/PasswordWithStrength';
import type { FieldRenderProps } from '../../types';

interface Props extends FieldRenderProps<string> {
  strengthMeta: PasswordStrengthMeta;
}

export function NativePasswordStrength({ strengthMeta: m, ...p }: Props) {
  const [show, setShow] = useState(false);
  const [barWidths] = useState(() => [1,2,3,4].map(() => new Animated.Value(0)));

  const result = useMemo(() => {
    if (!p.value) return null;
    const config = {
      ...m._strengthConfig,
      levels: m._strengthCustomLevels ?? m._strengthConfig.levels,
      minAcceptableScore: m._strengthMinAccept,
    };
    return scorePassword(p.value, config);
  }, [p.value, m]);

  // Animate bar segments
  React.useEffect(() => {
    const score = result?.score ?? 0;
    barWidths.forEach((bar, i) => {
      Animated.spring(bar, {
        toValue:         i < score ? 1 : 0,
        useNativeDriver: false,
        tension:         80,
        friction:        8,
      }).start();
    });
  }, [result?.score]);

  const hasError = Boolean(p.error);
  const borderColor = hasError ? '#ef4444' : '#e5e7eb';

  return (
    <View style={s.wrap}>
      <Text style={s.label}>{p.label}</Text>

      {/* Input + toggle */}
      <View style={[s.inputWrap, { borderColor }]}>
        <TextInput
          style={s.input}
          value={p.value || ''}
          placeholder={p.placeholder}
          placeholderTextColor="#9ca3af"
          secureTextEntry={!show}
          onChangeText={v => p.onChange(v)}
          onBlur={p.onBlur}
          onFocus={p.onFocus}
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="newPassword"
          editable={!p.disabled}
        />
        <TouchableOpacity onPress={() => setShow(!show)} style={s.toggle}>
          <Text style={s.toggleText}>{show ? '🙈' : '👁'}</Text>
        </TouchableOpacity>
      </View>

      {/* Strength bar — 4 animated segments */}
      {m._strengthShowBar && result && (
        <View style={{ marginTop: 8 }}>
          <View style={s.barRow}>
            {[0,1,2,3].map(i => (
              <Animated.View
                key={i}
                style={[
                  s.barSegment,
                  {
                    height:       m._strengthBarHeight,
                    borderRadius: m._strengthBarRadius,
                    backgroundColor: barWidths[i].interpolate({
                      inputRange:  [0, 1],
                      outputRange: ['#e5e7eb', result.color],
                    }),
                  },
                ]}
              />
            ))}
          </View>

          <View style={s.barMeta}>
            {m._strengthShowLabel && (
              <Text style={[s.scoreLabel, { color: result.color }]}>
                {result.label}
              </Text>
            )}
            {m._strengthShowEntropy && (
              <Text style={s.entropy}>{result.entropy} bits</Text>
            )}
          </View>
        </View>
      )}

      {/* Rules checklist */}
      {m._strengthShowRules && result && p.value ? (
        <View style={s.rulesList}>
          {result.rules.map(rule => (
            <View key={rule.id} style={s.ruleRow}>
              <View style={[s.ruleDot, rule.passed && s.ruleDotPass]}>
                {rule.passed && <Text style={s.ruleDotCheck}>✓</Text>}
              </View>
              <Text style={[s.ruleText, rule.passed && s.ruleTextPass]}>
                {rule.label}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* Error / hint */}
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
  inputWrap:     { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 9, backgroundColor: '#fff' },
  input:         { flex: 1, paddingHorizontal: 13, paddingVertical: 11, fontSize: 14, color: '#111' },
  toggle:        { paddingHorizontal: 12, paddingVertical: 10 },
  toggleText:    { fontSize: 16 },
  barRow:        { flexDirection: 'row', gap: 4 },
  barSegment:    { flex: 1 },
  barMeta:       { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  scoreLabel:    { fontSize: 12, fontWeight: '700' },
  entropy:       { fontSize: 11, color: '#9ca3af' },
  rulesList:     { marginTop: 8, gap: 5 },
  ruleRow:       { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ruleDot:       { width: 16, height: 16, borderRadius: 8, backgroundColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center' },
  ruleDotPass:   { backgroundColor: '#22c55e' },
  ruleDotCheck:  { color: '#fff', fontSize: 9, fontWeight: '700' },
  ruleText:      { fontSize: 12, color: '#9ca3af' },
  ruleTextPass:  { color: '#374151' },
  error:         { fontSize: 12, color: '#ef4444', marginTop: 5 },
  hint:          { fontSize: 12, color: '#9ca3af', marginTop: 5 },
});
