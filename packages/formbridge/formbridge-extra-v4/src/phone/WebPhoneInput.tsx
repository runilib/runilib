import React, { useState, useRef, useCallback, useMemo, useEffect, type CSSProperties } from 'react';
import { COUNTRIES_SORTED, getCountry, searchCountries, buildPhoneValue } from './countries';
import type { PhoneDescriptor } from './PhoneField';
import type { PhoneValue } from './countries';
import { applyMask, extractRaw } from '../mask/masks';

interface Props {
  descriptor: PhoneDescriptor;
  value:      PhoneValue | null;
  error:      string | null;
  onChange:   (v: PhoneValue) => void;
  onBlur:     () => void;
}

export function WebPhoneInput({ descriptor: d, value, error, onChange, onBlur }: Props) {
  const defaultCountry  = getCountry(d._phoneDefaultCountry) ?? COUNTRIES_SORTED[0];
  const currentCountry  = (value?.country ? getCountry(value.country) : null) ?? defaultCountry;

  const [open,   setOpen]   = useState(false);
  const [search, setSearch] = useState('');
  const dropRef  = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const filteredCountries = useMemo(() => {
    const results = searchCountries(search);
    // Put preferred countries first (if no search)
    if (!search) {
      const preferred = results.filter(c => d._phonePreferred.includes(c.code));
      const rest      = results.filter(c => !d._phonePreferred.includes(c.code));
      return [...preferred, { separator: true } as any, ...rest];
    }
    return results;
  }, [search, d._phonePreferred]);

  const handleNationalChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw    = e.target.value;
    const result = applyMask(extractRaw(raw, currentCountry.mask), currentCountry.mask);
    onChange(buildPhoneValue(currentCountry, result.display));
  }, [currentCountry, onChange]);

  const selectCountry = useCallback((country: typeof COUNTRIES_SORTED[0]) => {
    const existing = value?.national ?? '';
    onChange(buildPhoneValue(country, existing));
    setOpen(false);
    setSearch('');
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [value, onChange]);

  const displayValue = useMemo(() => {
    if (!value?.national) return '';
    const result = applyMask(
      extractRaw(value.national, currentCountry.mask),
      currentCountry.mask,
    );
    return result.display;
  }, [value, currentCountry]);

  const hasError = Boolean(error);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 16 }}>
      <label style={labelStyle}>
        {d._label}
        {d._required && <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>}
      </label>

      <div style={{ display: 'flex', gap: 0, position: 'relative' }}>
        {/* Country selector button */}
        <div ref={dropRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => !d._disabled && setOpen(!open)}
            disabled={d._disabled}
            style={selectorBtnStyle(hasError, d._disabled)}
            aria-label="Select country"
            aria-expanded={open}
          >
            {d._phoneShowFlag && <span style={{ fontSize: 18, lineHeight: 1 }}>{currentCountry.flag}</span>}
            {d._phoneShowDialCode && (
              <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
                +{currentCountry.dial}
              </span>
            )}
            <span style={{ fontSize: 10, color: '#9ca3af', marginLeft: 2 }}>▾</span>
          </button>

          {/* Dropdown */}
          {open && (
            <div style={dropdownStyle}>
              {/* Search */}
              {d._phoneSearchable && (
                <div style={{ padding: '8px 10px', borderBottom: '1px solid #f3f4f6' }}>
                  <input
                    autoFocus
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search country…"
                    style={searchInputStyle}
                  />
                </div>
              )}

              {/* Country list */}
              <div style={{ maxHeight: 220, overflowY: 'auto' }}>
                {filteredCountries.map((c: any, i: number) => {
                  if (c.separator) {
                    return <div key="sep" style={{ height: 1, background: '#f3f4f6', margin: '4px 0' }} />;
                  }
                  const isSelected = c.code === currentCountry.code;
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => selectCountry(c)}
                      style={countryItemStyle(isSelected)}
                    >
                      {d._phoneShowFlag && <span style={{ fontSize: 16 }}>{c.flag}</span>}
                      <span style={{ flex: 1, fontSize: 13, color: '#374151', textAlign: 'left' }}>{c.name}</span>
                      <span style={{ fontSize: 12, color: '#9ca3af', fontFamily: 'monospace' }}>+{c.dial}</span>
                    </button>
                  );
                })}
                {filteredCountries.length === 0 && (
                  <p style={{ padding: '12px 14px', fontSize: 13, color: '#9ca3af' }}>No results for "{search}"</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Phone number input */}
        <input
          ref={inputRef}
          type="tel"
          value={displayValue}
          placeholder={d._placeholder}
          disabled={d._disabled}
          onChange={handleNationalChange}
          onBlur={onBlur}
          style={phoneInputStyle(hasError, d._disabled)}
          autoComplete="tel-national"
        />
      </div>

      {error && <span role="alert" style={{ fontSize: 12, color: '#ef4444' }}>{error}</span>}
      {!error && d._hint && <span style={{ fontSize: 12, color: '#9ca3af' }}>{d._hint}</span>}
      {value?.e164 && (
        <span style={{ fontSize: 11, color: '#9ca3af', fontFamily: 'monospace' }}>
          {value.e164}
        </span>
      )}
    </div>
  );
}

const labelStyle: CSSProperties = { fontSize: 13, fontWeight: 600, color: '#374151' };

function selectorBtnStyle(error: boolean, disabled: boolean): CSSProperties {
  return {
    display:         'flex',
    alignItems:      'center',
    gap:             6,
    padding:         '10px 12px',
    borderRadius:    '8px 0 0 8px',
    border:          `1.5px solid ${error ? '#ef4444' : '#e5e7eb'}`,
    borderRight:     '1px solid #e5e7eb',
    background:      disabled ? '#f9fafb' : '#fff',
    cursor:          disabled ? 'not-allowed' : 'pointer',
    minWidth:        88,
    whiteSpace:      'nowrap',
    transition:      'border-color 0.15s',
  };
}

function phoneInputStyle(error: boolean, disabled: boolean): CSSProperties {
  return {
    flex:            1,
    padding:         '10px 13px',
    borderRadius:    '0 8px 8px 0',
    border:          `1.5px solid ${error ? '#ef4444' : '#e5e7eb'}`,
    borderLeft:      'none',
    fontSize:        14,
    outline:         'none',
    background:      disabled ? '#f9fafb' : '#fff',
    color:           '#111',
    fontFamily:      'monospace',
    letterSpacing:   '0.04em',
  };
}

const dropdownStyle: CSSProperties = {
  position:    'absolute',
  top:         '100%',
  left:        0,
  zIndex:      999,
  background:  '#fff',
  border:      '1.5px solid #e5e7eb',
  borderRadius: 10,
  boxShadow:   '0 8px 32px rgba(0,0,0,0.12)',
  minWidth:    280,
  marginTop:   4,
};

const searchInputStyle: CSSProperties = {
  width:        '100%',
  padding:      '7px 10px',
  border:       '1.5px solid #e5e7eb',
  borderRadius: 7,
  fontSize:     13,
  outline:      'none',
  boxSizing:    'border-box',
};

function countryItemStyle(selected: boolean): CSSProperties {
  return {
    display:         'flex',
    alignItems:      'center',
    gap:             10,
    width:           '100%',
    padding:         '9px 14px',
    background:      selected ? '#eff6ff' : 'transparent',
    border:          'none',
    cursor:          'pointer',
    textAlign:       'left',
    transition:      'background 0.1s',
  };
}
