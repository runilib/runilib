import React, { type FC, type ReactNode } from 'react';
import { isWeb } from '../utils/platform';

interface ErrorMessageProps {
  error?:    string | null;
  /** Custom renderer for the error text */
  render?:   (error: string) => ReactNode;
  /** Web: className to apply to the <p> tag */
  className?: string;
  /** RN: style to apply to the <Text> component */
  style?:     object;
}

/**
 * `ErrorMessage` — displays a field error on both web and native.
 *
 * @example
 * <ErrorMessage error={formState.errors.email} />
 */
export const ErrorMessage: FC<ErrorMessageProps> = ({ error, render, className, style }) => {
  if (!error) return null;

  if (render) return <>{render(error)}</>;

  if (isWeb) {
    return (
      <p
        role="alert"
        className={className}
        style={!className ? { color: '#ef4444', fontSize: 12, marginTop: 4 } : undefined}
      >
        {error}
      </p>
    );
  }

  // React Native
  const { Text } = require('react-native');
  return (
    <Text
      accessibilityRole="alert"
      style={[{ color: '#ef4444', fontSize: 12, marginTop: 4 }, style]}
    >
      {error}
    </Text>
  );
};
