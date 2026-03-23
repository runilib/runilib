import React, { useRef, useCallback, type CSSProperties } from 'react';
import { applyMask, extractRaw, parsePattern } from '../../fields/mask/masks';
import type { MaskedDescriptor } from '../../fields/mask/MaskedField';
import type { FieldRenderProps } from '../../types';

interface Props extends FieldRenderProps<string> {
  descriptor: MaskedDescriptor<string>;
}

export function WebMaskedInput({ descriptor: d, ...p }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;

    // Apply case transform
    if (d._maskUppercase) raw = raw.toUpperCase();
    if (d._maskLowercase) raw = raw.toLowerCase();

    // Extract raw (remove all separators) then re-apply mask
    const cleaned  = extractRaw(raw, d._maskPattern);
    const result   = applyMask(cleaned, d._maskPattern, {
      showPlaceholder: d._maskShowPlaceholder,
      placeholder:     d._maskPlaceholder,
    });

    // Store raw or masked depending on config
    p.onChange(d._maskStoreRaw ? result.raw : result.display);

    // Restore cursor after React re-render
    requestAnimationFrame(() => {
      if (inputRef.current) {
        const pos = result.nextCursorPos;
        inputRef.current.setSelectionRange(pos, pos);
      }
    });
  }, [d, p]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!inputRef.current) return;

    const sel = inputRef.current.selectionStart ?? 0;

    // Skip over separators on arrow keys
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const tokens    = parsePattern(d._maskPattern);
      const direction = e.key === 'ArrowLeft' ? -1 : 1;
      let newPos      = sel + direction;

      // Skip non-input tokens
      if (newPos >= 0 && newPos <= (inputRef.current.value.length)) {
        const ch = inputRef.current.value[newPos - (direction === 1 ? 1 : 0)];
        const ti = tokens.findIndex((_, i) => {
          let offset = 0;
          for (let j = 0; j < i; j++) offset++;
          return offset === newPos;
        });
        if (ti >= 0 && !tokens[ti]?.isInput) {
          newPos += direction;
        }
      }
      e.preventDefault();
      inputRef.current.setSelectionRange(newPos, newPos);
      return;
    }

    // On Backspace, skip over separators
    if (e.key === 'Backspace' && sel > 0) {
      const val    = inputRef.current.value;
      const tokens = parsePattern(d._maskPattern);
      let checkPos = sel - 1;

      // Find the token at this position
      let tokenIdx = 0;
      let pos      = 0;
      while (pos < val.length && tokenIdx < tokens.length) {
        if (!tokens[tokenIdx].isInput) { pos++; tokenIdx++; continue; }
        if (pos === checkPos) break;
        pos++; tokenIdx++;
      }

      if (tokenIdx < tokens.length && !tokens[tokenIdx]?.isInput) {
        // Skip the separator — move back one more
        e.preventDefault();
        const raw    = extractRaw(val.substring(0, checkPos), d._maskPattern);
        const trimmed = raw.slice(0, -1);
        const result  = applyMask(trimmed, d._maskPattern);
        p.onChange(d._maskStoreRaw ? result.raw : result.display);
        requestAnimationFrame(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(result.nextCursorPos, result.nextCursorPos);
          }
        });
      }
    }
  }, [d, p]);

  // Compute display value
  const displayValue = React.useMemo(() => {
    const raw    = d._maskStoreRaw ? p.value : extractRaw(p.value, d._maskPattern);
    const result = applyMask(raw || '', d._maskPattern, {
      showPlaceholder: d._maskShowPlaceholder,
      placeholder:     d._maskPlaceholder,
    });
    return result.display;
  }, [p.value, d]);

  const hasError = Boolean(p.error);

  const baseStyle: CSSProperties = {
    padding:      '10px 13px',
    borderRadius: 8,
    border:       `1.5px solid ${hasError ? '#ef4444' : '#e5e7eb'}`,
    fontSize:     14,
    outline:      'none',
    background:   p.disabled ? '#f9fafb' : '#fff',
    color:        '#111',
    width:        '100%',
    fontFamily:   'monospace',
    letterSpacing: '0.06em',
    transition:   'border-color 0.15s',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 16 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
        {p.label}
        {d._required && <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>}
      </label>
      <input
        ref={inputRef}
        type="text"
        value={displayValue}
        placeholder={d._placeholder}
        disabled={p.disabled}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={p.onBlur}
        onFocus={p.onFocus}
        style={baseStyle}
        inputMode="numeric"
        autoComplete="off"
      />
      {p.error && (
        <span role="alert" style={{ fontSize: 12, color: '#ef4444' }}>{p.error}</span>
      )}
      {!p.error && p.hint && (
        <span style={{ fontSize: 12, color: '#9ca3af' }}>{p.hint}</span>
      )}
    </div>
  );
}
