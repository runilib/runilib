/** biome-ignore-all lint/a11y/useButtonType: <explanation> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
import React from 'react';

type P = { children?: React.ReactNode; style?: object; [k: string]: any };

export const View = React.forwardRef<HTMLDivElement, P>(
  ({ children, style, ...r }, ref) =>
    React.createElement('div', { ref, style, ...r }, children),
);
View.displayName = 'View';
export const Text: React.FC<P> = ({ children, style }) =>
  React.createElement('span', { style }, children);
export const TextInput: React.FC<any> = (p) => React.createElement('input', p);
export const TouchableOpacity: React.FC<P> = ({ children, onPress, style }) =>
  React.createElement('button', { onClick: onPress, style: style }, children);
export const Switch: React.FC<any> = ({ value, onValueChange }) =>
  React.createElement('input', {
    type: 'checkbox',
    checked: value,
    onChange: (e: any) => onValueChange(e.target.checked),
  });
export const ActivityIndicator: React.FC<any> = () =>
  React.createElement('span', null, '⟳');
export const Platform = {
  OS: 'ios' as const,
  select: <T extends object>(o: T) => (o as any).ios ?? (o as any).default,
};
export const StyleSheet = { create: <T extends Record<string, object>>(s: T): T => s };
export default {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Platform,
  StyleSheet,
};
