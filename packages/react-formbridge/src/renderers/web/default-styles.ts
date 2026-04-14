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
  boxSizing: 'border-box',
  lineHeight: 1.35,
};

export const defaultTextareaStyle: CSSProperties = {
  ...defaultControlStyle,
  lineHeight: 1.5,
};

export const defaultOtpContainerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'stretch',
  gap: 8,
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
