import React from 'react';
type P = { children?: React.ReactNode; style?: object; [k: string]: any };
export const View     = React.forwardRef<HTMLDivElement, P>(({ children, style, ...r }, ref) => React.createElement('div', { ref, style, ...r }, children));
export const Text: React.FC<P>  = ({ children, style }) => React.createElement('span', { style }, children);
export const TextInput: React.FC<any> = (p) => React.createElement('input', p);
export const Platform = { OS: 'ios' as const, select: <T extends object>(o: T): T[keyof T] => (o as any).ios ?? (o as any).default };
export const StyleSheet = { create: <T extends Record<string, object>>(s: T): T => s };
export default { View, Text, TextInput, Platform, StyleSheet };
