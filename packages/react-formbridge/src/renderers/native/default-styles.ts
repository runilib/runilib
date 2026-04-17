import type { TextStyle, ViewStyle } from 'react-native';

export const defaultInputStyle: TextStyle = {
  minHeight: 44,
  paddingHorizontal: 12,
  paddingVertical: 10,
  borderWidth: 1,
  borderColor: '#d1d5db',
  backgroundColor: '#ffffff',
  color: '#0f172a',
  fontSize: 15,
  lineHeight: 20,
};

export const defaultTextareaStyle: TextStyle = {
  ...defaultInputStyle,
  minHeight: 96,
  paddingTop: 10,
};

export const defaultCheckboxRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
};

export const defaultCheckboxBoxStyle: ViewStyle = {
  width: 20,
  height: 20,
  borderWidth: 1,
  borderColor: '#94a3b8',
  backgroundColor: '#ffffff',
};

export const defaultSwitchRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
};

export const defaultOptionModalBackdropStyle: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  padding: 20,
  backgroundColor: 'rgba(15, 23, 42, 0.42)',
};

export const defaultOptionModalCardStyle: ViewStyle = {
  width: '100%',
  maxHeight: '72%',
  // borderRadius: 22,
  backgroundColor: '#ffffff',
  paddingHorizontal: 12,
  paddingTop: 10,
  paddingBottom: 12,
  gap: 8,
};

export const defaultOptionRowStyle: ViewStyle = {
  // borderRadius: 14,
  paddingHorizontal: 14,
  paddingVertical: 14,
  backgroundColor: '#f8fafc',
  borderWidth: 1,
  borderColor: '#e2e8f0',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
};

export const defaultOptionTriggerStyle: ViewStyle = {
  minHeight: 52,
  // borderRadius: 16,
  paddingHorizontal: 14,
  justifyContent: 'center',
  borderWidth: 1,
  borderColor: '#d1d5db',
  backgroundColor: '#ffffff',
};

export const defaultOptionTriggerLabelStyle: TextStyle = {
  fontSize: 15,
  lineHeight: 20,
  color: '#0f172a',
};

export const defaultOptionLabelStyle: TextStyle = {
  fontSize: 15,
  fontWeight: '600',
  color: '#0f172a',
};

export const defaultOptionHeaderStyle: ViewStyle = {
  paddingHorizontal: 4,
  paddingTop: 2,
  paddingBottom: 2,
};

export const defaultOptionTitleStyle: TextStyle = {
  fontSize: 12,
  fontWeight: '800',
  letterSpacing: 0.8,
  textTransform: 'uppercase',
  color: '#64748b',
};

export const defaultOptionListContentStyle: ViewStyle = {
  gap: 8,
  paddingBottom: 2,
};

export const defaultOptionCheckStyle: TextStyle = {
  fontSize: 16,
  fontWeight: '800',
  color: '#2563eb',
};
