import React, { useId, type CSSProperties } from 'react';
import type { FieldDescriptor, FieldRenderProps } from '../../types';

interface Props extends FieldRenderProps<unknown> {
  descriptor: FieldDescriptor<unknown>;
  extra?:     { className?: string; style?: object };
}

/** Renders the correct web input for any field type */
export function WebField({ descriptor, extra, ...p }: Props) {
  const id = useId();

  return (
    <div
      className={extra?.className}
      style={{
        display:       'flex',
        flexDirection: 'column',
        gap:           5,
        ...(extra?.style as CSSProperties),
      }}
    >
      {/* Label */}
      <label htmlFor={id} style={labelStyle}>
        {p.label}
        {descriptor._required && <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>}
      </label>

      {/* Input area */}
      {renderInput(descriptor, id, p)}

      {/* Error / hint */}
      {p.error
        ? <span role="alert" style={errorStyle}>{p.error}</span>
        : p.hint
          ? <span style={hintStyle}>{p.hint}</span>
          : null}
    </div>
  );
}

// ─── Input renderers by type ─────────────────────────────────────────────────

function renderInput(d: FieldDescriptor<unknown>, id: string, p: FieldRenderProps<unknown>) {
  const hasError = Boolean(p.error);

  const baseInput: CSSProperties = {
    padding:     '10px 13px',
    borderRadius: 8,
    border:      `1.5px solid ${hasError ? '#ef4444' : '#e5e7eb'}`,
    fontSize:    14,
    outline:     'none',
    background:  p.disabled ? '#f9fafb' : '#fff',
    color:       '#111',
    width:       '100%',
    transition:  'border-color 0.15s',
    cursor:      p.disabled ? 'not-allowed' : 'text',
  };

  switch (d._type) {
    case 'textarea':
      return (
        <textarea
          id={id}
          value={p.value as string}
          placeholder={p.placeholder}
          disabled={p.disabled}
          onChange={e => p.onChange(e.target.value)}
          onBlur={p.onBlur}
          onFocus={p.onFocus}
          rows={4}
          style={{ ...baseInput, resize: 'vertical', cursor: p.disabled ? 'not-allowed' : 'text' }}
        />
      );

    case 'checkbox':
      return (
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: p.disabled ? 'not-allowed' : 'pointer' }}>
          <input
            id={id}
            type="checkbox"
            checked={Boolean(p.value)}
            disabled={p.disabled}
            onChange={e => p.onChange(e.target.checked)}
            onBlur={p.onBlur}
            style={{ width: 18, height: 18, accentColor: '#6366f1', cursor: 'inherit' }}
          />
          <span style={{ fontSize: 14, color: '#374151' }}>{p.label}</span>
        </label>
      );

    case 'switch':
      return (
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: p.disabled ? 'not-allowed' : 'pointer' }}
          onClick={() => !p.disabled && p.onChange(!p.value)}
          onBlur={p.onBlur}
          tabIndex={0}
          role="switch"
          aria-checked={Boolean(p.value)}
        >
          <div style={{
            width: 44, height: 24, borderRadius: 12,
            background: p.value ? '#6366f1' : '#e5e7eb',
            position: 'relative', transition: 'background 0.2s',
            opacity: p.disabled ? 0.5 : 1,
          }}>
            <div style={{
              position: 'absolute', top: 3,
              left: p.value ? 22 : 3,
              width: 18, height: 18, borderRadius: 9,
              background: '#fff', transition: 'left 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
          </div>
          <span style={{ fontSize: 14, color: '#374151' }}>{p.label}</span>
        </div>
      );

    case 'select':
      return (
        <select
          id={id}
          value={p.value as string}
          disabled={p.disabled}
          onChange={e => p.onChange(e.target.value)}
          onBlur={p.onBlur}
          style={{ ...baseInput, cursor: p.disabled ? 'not-allowed' : 'pointer' }}
        >
          <option value="">{p.placeholder ?? `Select ${p.label}`}</option>
          {d._options?.map(o => (
            <option key={String(o.value)} value={String(o.value)}>{o.label}</option>
          ))}
        </select>
      );

    case 'radio':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {d._options?.map(o => (
            <label key={String(o.value)} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: p.disabled ? 'not-allowed' : 'pointer' }}>
              <input
                type="radio"
                name={p.name}
                value={String(o.value)}
                checked={p.value === o.value}
                disabled={p.disabled}
                onChange={() => p.onChange(o.value)}
                onBlur={p.onBlur}
                style={{ accentColor: '#6366f1' }}
              />
              <span style={{ fontSize: 14, color: '#374151' }}>{o.label}</span>
            </label>
          ))}
        </div>
      );

    case 'otp': {
      const len   = d._otpLength ?? 6;
      const chars = String(p.value ?? '').split('');
      return (
        <div style={{ display: 'flex', gap: 8 }}>
          {Array.from({ length: len }).map((_, i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              value={chars[i] ?? ''}
              disabled={p.disabled}
              onChange={e => {
                const next = [...chars];
                next[i]   = e.target.value.slice(-1);
                p.onChange(next.join(''));
                // Auto-focus next
                const sib = e.target.nextElementSibling as HTMLInputElement | null;
                if (sib && e.target.value) sib.focus();
              }}
              onKeyDown={e => {
                if (e.key === 'Backspace' && !chars[i]) {
                  const prev = (e.target as HTMLInputElement).previousElementSibling as HTMLInputElement | null;
                  if (prev) prev.focus();
                }
              }}
              onBlur={p.onBlur}
              style={{
                ...baseInput,
                width: 44, height: 52, textAlign: 'center',
                fontSize: 20, fontWeight: 700,
              }}
            />
          ))}
        </div>
      );
    }

    case 'number':
      return (
        <input
          id={id}
          type="number"
          value={p.value as number}
          placeholder={p.placeholder}
          disabled={p.disabled}
          min={d._min}
          max={d._max}
          onChange={e => p.onChange(Number(e.target.value))}
          onBlur={p.onBlur}
          onFocus={p.onFocus}
          style={baseInput}
        />
      );

    case 'date':
      return (
        <input
          id={id}
          type="date"
          value={p.value as string}
          disabled={p.disabled}
          min={d._min !== undefined ? String(d._min) : undefined}
          max={d._max !== undefined ? String(d._max) : undefined}
          onChange={e => p.onChange(e.target.value)}
          onBlur={p.onBlur}
          style={baseInput}
        />
      );

    default:
      // text, email, password, tel, url
      return (
        <div style={{ position: 'relative' }}>
          <input
            id={id}
            type={d._type}
            value={p.value as string}
            placeholder={p.placeholder}
            disabled={p.disabled}
            onChange={e => p.onChange(e.target.value)}
            onBlur={p.onBlur}
            onFocus={p.onFocus}
            style={baseInput}
            autoComplete={d._type === 'email' ? 'email' : d._type === 'password' ? 'current-password' : undefined}
          />
          {p.validating && (
            <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: '#9ca3af' }}>
              ⟳
            </span>
          )}
        </div>
      );
  }
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const labelStyle: CSSProperties = {
  fontSize:   13,
  fontWeight: 600,
  color:      '#374151',
};

const errorStyle: CSSProperties = {
  fontSize: 12,
  color:    '#ef4444',
  display:  'flex',
  alignItems: 'center',
  gap:      4,
};

const hintStyle: CSSProperties = {
  fontSize: 12,
  color:    '#9ca3af',
};
