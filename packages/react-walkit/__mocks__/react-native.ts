import React from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type StyleProp = object | undefined | null | false;
type ViewProps = {
  children?: React.ReactNode;
  style?: StyleProp;
  collapsable?: boolean;
  [key: string]: any;
};
type TextProps = {
  children?: React.ReactNode;
  style?: StyleProp;
  numberOfLines?: number;
  [key: string]: any;
};
type TouchableProps = {
  children?: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp;
  hitSlop?: object;
  [key: string]: any;
};

// ─── Components ───────────────────────────────────────────────────────────────

export const View = React.forwardRef<HTMLDivElement, ViewProps>(
  ({ children, style, collapsable: _c, ...rest }, ref) =>
    React.createElement('div', { ref, style, ...rest }, children),
);
View.displayName = 'View';

export const Text: React.FC<TextProps> = ({ children, style, numberOfLines: _n, ...rest }) =>
  React.createElement('span', { style, ...rest }, children);

export const TouchableOpacity: React.FC<TouchableProps> = ({
  children,
  onPress,
  style,
  hitSlop: _h,
  ...rest
}) => React.createElement('button', { onClick: onPress, style, ...rest }, children);

export const TouchableWithoutFeedback: React.FC<TouchableProps> = ({ children, onPress }) =>
  React.createElement('div', { onClick: onPress }, children);

export const TextInput: React.FC<any> = (props) => React.createElement('input', props);

export const Image: React.FC<any> = (props) => React.createElement('img', props);

export const Modal: React.FC<{
  children?: React.ReactNode;
  visible?: boolean;
  [key: string]: any;
}> = ({ children }) => React.createElement('div', null, children);

export const StatusBar: React.FC<any> = () => null;

// ─── Animated ─────────────────────────────────────────────────────────────────

class AnimatedValue {
  _value: number;
  constructor(v: number) {
    this._value = v;
  }
  setValue(v: number) {
    this._value = v;
  }
  interpolate(_cfg: object): AnimatedValue {
    return this;
  }
}

export const Animated = {
  Value: AnimatedValue,
  View,
  timing: (_v: AnimatedValue, _cfg: object) => ({ start: (cb?: () => void) => cb?.() }),
  spring: (_v: AnimatedValue, _cfg: object) => ({ start: (cb?: () => void) => cb?.() }),
};

// ─── StyleSheet ───────────────────────────────────────────────────────────────

export const StyleSheet = {
  create: <T extends Record<string, object>>(styles: T): T => styles,
  absoluteFill: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 } as object,
};

// ─── Platform ─────────────────────────────────────────────────────────────────

export const Platform = {
  OS: 'ios' as const,
  select: <T extends object>(obj: T): T[keyof T] => (obj as any).ios ?? (obj as any).default,
};

// ─── Dimensions ───────────────────────────────────────────────────────────────

export const Dimensions = {
  get: (_dim: 'window' | 'screen') => ({ width: 375, height: 812, scale: 1, fontScale: 1 }),
};

// ─── Default export (for `import RN from 'react-native'`) ─────────────────────

export default {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Image,
  Modal,
  StatusBar,
  Animated,
  StyleSheet,
  Platform,
  Dimensions,
};
