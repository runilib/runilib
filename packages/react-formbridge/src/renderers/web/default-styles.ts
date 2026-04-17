import type { CSSProperties } from 'react';

export const defaultFieldRootStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: 4,
  minWidth: 0,
};

export const defaultControlStyle: CSSProperties = {
  minWidth: 0,
  padding: '8px 12px',
  boxSizing: 'border-box',
  border: '1px solid #d1d5db',
  background: '#ffffff',
  color: '#0f172a',
  fontSize: 14,
  lineHeight: 1.35,
};

export const defaultTextareaStyle: CSSProperties = {
  ...defaultControlStyle,
  lineHeight: 1.5,
  resize: 'vertical',
};

export const defaultSelectStyle: CSSProperties = {
  ...defaultControlStyle,
  cursor: 'pointer',
};

export const defaultSelectTriggerStyle: CSSProperties = {
  ...defaultControlStyle,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  width: '100%',
  cursor: 'pointer',
  textAlign: 'left',
};

export const defaultCheckboxRowStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  minWidth: 0,
};

export const defaultCheckboxInputStyle: CSSProperties = {
  margin: 0,
  width: 16,
  height: 16,
  flexShrink: 0,
  accentColor: '#2563eb',
};

export const defaultCheckboxLabelStyle: CSSProperties = {
  color: 'inherit',
  fontSize: 14,
  lineHeight: 1.4,
};

export const defaultSwitchRootStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  minWidth: 0,
};

export const defaultSwitchButtonStyle: CSSProperties = {
  appearance: 'none',
  border: 0,
  background: 'transparent',
  padding: 0,
  margin: 0,
  display: 'inline-flex',
  alignItems: 'center',
  flexShrink: 0,
};

export const defaultSwitchTrackStyle: CSSProperties = {
  position: 'relative',
  width: 44,
  height: 24,
  borderRadius: 999,
  transition: 'background-color 160ms ease',
};

export const defaultSwitchThumbStyle: CSSProperties = {
  position: 'absolute',
  top: 2,
  width: 20,
  height: 20,
  borderRadius: '50%',
  background: '#ffffff',
  boxShadow: '0 1px 4px rgba(15, 23, 42, 0.28)',
  transition: 'left 160ms ease',
};

export const defaultSwitchLabelStyle: CSSProperties = {
  color: 'inherit',
  fontSize: 14,
  lineHeight: 1.4,
};

export const defaultRadioGroupStyle: CSSProperties = {
  display: 'grid',
  gap: 8,
  minWidth: 0,
};

export const defaultRadioOptionStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  minWidth: 0,
};

export const defaultRadioInputStyle: CSSProperties = {
  margin: 0,
  flexShrink: 0,
};

export const defaultRadioLabelStyle: CSSProperties = {
  color: 'inherit',
  fontSize: 14,
  lineHeight: 1.4,
};

export const defaultPasswordInputStyle: CSSProperties = {
  ...defaultControlStyle,
  display: 'block',
  width: '100%',
  font: 'inherit',
  paddingRight: 44,
};

export const defaultPasswordToggleStyle: CSSProperties = {
  appearance: 'none',
  position: 'absolute',
  top: '50%',
  right: 10,
  transform: 'translateY(-50%)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 28,
  minHeight: 28,
  padding: 4,
  border: 0,
  borderRadius: 999,
  background: 'transparent',
  color: '#64748b',
  cursor: 'pointer',
  font: 'inherit',
  lineHeight: 1,
};

export const defaultOtpContainerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'stretch',
  gap: 4,
  width: 'fit-content',
  maxWidth: '100%',
};

export const defaultOtpInputStyle: CSSProperties = {
  ...defaultControlStyle,
  width: 40,
  minWidth: 40,
  minHeight: 40,
  padding: 0,
  border: '1px solid #d1d5db',
  color: '#0f172a',
  textAlign: 'center',
  fontSize: 18,
  fontWeight: 600,
  lineHeight: 1,
  fontVariantNumeric: 'tabular-nums',
};

export const defaultOtpSeparatorStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 12,
  color: '#94a3b8',
  fontSize: 20,
  fontWeight: 600,
  userSelect: 'none',
};

export const defaultMaskedFieldWrapperStyle: CSSProperties = {
  ...defaultFieldRootStyle,
};

export const defaultMaskedInputStyle: CSSProperties = {
  ...defaultControlStyle,
  display: 'block',
  width: '100%',
  font: 'inherit',
  boxSizing: 'border-box',
  lineHeight: 1.25,
  fontVariantNumeric: 'tabular-nums',
};

export const defaultDetachedRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr)',
  gap: 12,
  alignItems: 'stretch',
};

export const defaultIntegratedRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr)',
  alignItems: 'stretch',
  minHeight: 52,
  boxSizing: 'border-box',
  border: '1px solid #d1d5db',
  background: '#ffffff',
};

export const defaultCountryButtonStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  minHeight: 52,
  minWidth: 88,
  padding: '0 12px',
  boxSizing: 'border-box',
  border: '1px solid #d1d5db',
  background: '#ffffff',
  color: '#111827',
  fontSize: 14,
  fontWeight: 600,
  whiteSpace: 'nowrap',
  cursor: 'pointer',
};

export const defaultIntegratedCountryButtonStyle: CSSProperties = {
  minHeight: '100%',
  minWidth: 92,
  padding: '0 14px',
  border: 'none',
  background: 'transparent',
  color: 'inherit',
};

export const defaultCountryDividerStyle: CSSProperties = {
  position: 'absolute',
  top: 8,
  bottom: 8,
  right: 0,
  width: 1,
  background: '#e5e7eb',
  pointerEvents: 'none',
};

export const defaultCountryListStyle: CSSProperties = {
  position: 'absolute',
  top: '100%',
  left: 0,
  zIndex: 50,
  marginTop: 8,
  minWidth: 280,
  background: '#ffffff',
  border: '1px solid #e5e7eb',
  boxShadow: '0 18px 50px rgba(15, 23, 42, 0.14)',
  overflow: 'hidden',
};

export const defaultCountrySearchWrapperStyle: CSSProperties = {
  padding: '12px 12px 0',
};

export const defaultCountrySearchInputStyle: CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '10px 12px',
  border: '1px solid #e5e7eb',
  background: '#f8fafc',
  color: '#111827',
  fontSize: 13,
  outline: 'none',
};

export const defaultCountryScrollStyle: CSSProperties = {
  maxHeight: 260,
  overflowY: 'auto',
  display: 'grid',
  padding: '8px 0',
};

export const defaultCountryItemStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '24px minmax(0, 1fr) auto',
  gap: 10,
  alignItems: 'center',
  padding: '10px 14px',
  border: 'none',
  background: 'transparent',
  color: '#111827',
  fontSize: 13,
  textAlign: 'left',
  cursor: 'pointer',
  width: '100%',
};

export const defaultCountrySeparatorStyle: CSSProperties = {
  height: 1,
  margin: '4px 12px',
  background: '#e5e7eb',
};

export const defaultIntegratedInputStyle: CSSProperties = {
  minWidth: 0,
  width: '100%',
  minHeight: '100%',
  padding: '0 14px',
  boxSizing: 'border-box',
  border: 'none',
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
  outline: 'none',
  background: 'transparent',
  boxShadow: 'none',
  color: 'inherit',
  font: 'inherit',
  lineHeight: 1.35,
};
