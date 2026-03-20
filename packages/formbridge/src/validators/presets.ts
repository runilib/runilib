import type { FieldRules } from '../types';

/**
 * Preset validators you can spread directly into register() rules.
 *
 * @example
 * register('email', validators.email)
 * register('password', validators.strongPassword)
 */
export const validators = {
  /** Valid email address */
  email: {
    pattern: {
      value: /^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}$/i,
      message: 'Please enter a valid email address.',
    },
  } satisfies FieldRules,

  /** URL starting with http:// or https:// */
  url: {
    pattern: {
      value: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/,
      message: 'Please enter a valid URL (starting with http:// or https://).',
    },
  } satisfies FieldRules,

  /** Digits only (useful for zip codes, phone numbers without formatting) */
  numeric: {
    pattern: {
      value: /^\d+$/,
      message: 'This field must contain only numbers.',
    },
  } satisfies FieldRules,

  /** Alphanumeric (letters and digits only) */
  alphanumeric: {
    pattern: {
      value: /^[a-zA-Z0-9]+$/,
      message: 'Only letters and numbers are allowed.',
    },
  } satisfies FieldRules,

  /** Strong password: min 8 chars, 1 uppercase, 1 lowercase, 1 number */
  strongPassword: {
    minLength: { value: 8, message: 'Password must be at least 8 characters.' },
    validate: {
      hasUppercase: (v) =>
        typeof v === 'string' && /[A-Z]/.test(v)
          ? null
          : 'Password must contain at least one uppercase letter.',
      hasLowercase: (v) =>
        typeof v === 'string' && /[a-z]/.test(v)
          ? null
          : 'Password must contain at least one lowercase letter.',
      hasNumber: (v) =>
        typeof v === 'string' && /\d/.test(v)
          ? null
          : 'Password must contain at least one number.',
    },
  } satisfies FieldRules,

  /** French phone number */
  phoneFR: {
    pattern: {
      value: /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
      message: 'Please enter a valid French phone number.',
    },
  } satisfies FieldRules,

  /** International phone (E.164 format) */
  phoneIntl: {
    pattern: {
      value: /^\+[1-9]\d{6,14}$/,
      message: 'Please enter a valid phone number (e.g. +33612345678).',
    },
  } satisfies FieldRules,

  /** Positive number */
  positiveNumber: {
    validate: (v) =>
      typeof v === 'number' && v > 0 ? null : 'Value must be a positive number.',
  } satisfies FieldRules,

  /** Non-empty string after trimming */
  notBlank: {
    validate: (v) =>
      typeof v === 'string' && v.trim().length > 0
        ? null
        : 'This field cannot be blank.',
  } satisfies FieldRules,
};
