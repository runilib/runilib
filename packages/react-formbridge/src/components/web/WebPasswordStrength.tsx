import React, { useState, useMemo, type CSSProperties } from 'react';
import { scorePassword } from '../../fields/password/strength';
import type { PasswordStrengthMeta } from '../../fields/password/PasswordWithStrength';
import type { FieldRenderProps } from '../../types';

interface Props extends FieldRenderProps<string> {
  strengthMeta: PasswordStrengthMeta;
}

export function WebPasswordStrength({ strengthMeta: m, ...p }: Props) {
  const [show, setShow] = useState(false);
  const hasError = Boolean(p.error);

  const result = useMemo(() => {
    if (!p.value) return null;
    const config = {
      ...m._strengthConfig,
      levels: m._strengthCustomLevels ?? m._strengthConfig.levels,
      minAcceptableScore: m._strengthMinAccept,
    };
    return scorePassword(p.value, config);
  }, [p.value, m]);

  const baseInput: CSSProperties = {
    padding:      '10px 13px',
    borderRadius: 8,
    border:       `1.5px solid ${hasError ? '#ef4444' : result?.acceptable === false && p.value ? '#f97316' : '#e5e7eb'}`,
    fontSize:     14,
    outline:      'none',
    background:   p.disabled ? '#f9fafb' : '#fff',
    color:        '#111',
    width:        '100%',
    paddingRight: '44px',
    transition:   'border-color 0.15s',
    boxSizing:    'border-box',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 16 }}>
      {/* Label */}
      <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
        {p.label}
        {(p as any)._required && <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>}
      </label>

      {/* Input + show/hide toggle */}
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          value={p.value || ''}
          placeholder={p.placeholder}
          disabled={p.disabled}
          onChange={e => p.onChange(e.target.value)}
          onBlur={p.onBlur}
          onFocus={p.onFocus}
          style={baseInput}
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          style={{
            position: 'absolute', right: 12, top: '50%',
            transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 16, color: '#9ca3af', padding: 2,
          }}
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? '🙈' : '👁'}
        </button>
      </div>

      {/* Strength bar */}
      {m._strengthShowBar && result && (
        <div style={{ marginTop: 4 }}>
          {/* 4 segment bar */}
          <div style={{ display: 'flex', gap: 3 }}>
            {[1, 2, 3, 4].map(level => (
              <div
                key={level}
                style={{
                  flex:         1,
                  height:       m._strengthBarHeight,
                  borderRadius: m._strengthBarRadius,
                  background:   result.score >= level ? result.color : '#e5e7eb',
                  transition:   'background 0.3s',
                }}
              />
            ))}
          </div>

          {/* Label + entropy */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            {m._strengthShowLabel && (
              <span style={{
                fontSize:   12,
                fontWeight: 600,
                color:      result.color,
                transition: 'color 0.3s',
              }}>
                {result.label}
              </span>
            )}
            {m._strengthShowEntropy && (
              <span style={{ fontSize: 11, color: '#9ca3af' }}>
                {result.entropy} bits
              </span>
            )}
          </div>
        </div>
      )}

      {/* Rules checklist */}
      {m._strengthShowRules && result && p.value && (
        <ul style={{
          margin: '4px 0 0',
          padding: 0,
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}>
          {result.rules.map(rule => (
            <li key={rule.id} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12 }}>
              <span style={{
                width:        16,
                height:       16,
                borderRadius: '50%',
                background:   rule.passed ? '#22c55e' : '#e5e7eb',
                display:      'inline-flex',
                alignItems:   'center',
                justifyContent: 'center',
                fontSize:     9,
                flexShrink:   0,
                transition:   'background 0.2s',
                color:        '#fff',
              }}>
                {rule.passed ? '✓' : ''}
              </span>
              <span style={{ color: rule.passed ? '#374151' : '#9ca3af', transition: 'color 0.2s' }}>
                {rule.label}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Error / hint */}
      {p.error && (
        <span role="alert" style={{ fontSize: 12, color: '#ef4444' }}>{p.error}</span>
      )}
      {!p.error && p.hint && (
        <span style={{ fontSize: 12, color: '#9ca3af' }}>{p.hint}</span>
      )}
    </div>
  );
}
