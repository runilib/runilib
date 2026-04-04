import React from 'react';

type HostStyle = React.CSSProperties;
type ViewProps = React.HTMLAttributes<HTMLDivElement> & {
  style?: HostStyle;
};
type TextProps = React.HTMLAttributes<HTMLSpanElement> & {
  style?: HostStyle;
};
type TouchableOpacityProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  style?: HostStyle;
  onPress?: () => void;
};
type TextInputProps = React.InputHTMLAttributes<HTMLInputElement>;
type SwitchProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'checked' | 'defaultChecked' | 'onChange' | 'type' | 'value'
> & {
  style?: HostStyle;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
};

export const View = React.forwardRef<HTMLDivElement, ViewProps>(
  ({ children, style, ...r }, ref) =>
    React.createElement('div', { ref, style, ...r }, children),
);
View.displayName = 'View';
export const Text: React.FC<TextProps> = ({ children, style, ...props }) =>
  React.createElement('span', { style, ...props }, children);
export const TextInput: React.FC<TextInputProps> = (props) =>
  React.createElement('input', props);
export const TouchableOpacity: React.FC<TouchableOpacityProps> = ({
  children,
  onPress,
  style,
  ...props
}) =>
  React.createElement(
    'button',
    { type: 'button', onClick: onPress, style, ...props },
    children,
  );
export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  style,
  ...props
}) =>
  React.createElement('input', {
    type: 'checkbox',
    checked: Boolean(value),
    style,
    ...props,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
      onValueChange?.(event.currentTarget.checked),
  });
export const ActivityIndicator: React.FC<ViewProps> = () =>
  React.createElement('span', null, '⟳');
export const Platform = {
  OS: 'ios' as const,
  select: <T extends { ios?: unknown; default?: unknown }>(options: T) =>
    (options.ios ?? options.default) as T[keyof T],
};
export const StyleSheet = {
  create: <T extends Record<string, HostStyle>>(styles: T): T => styles,
};
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
