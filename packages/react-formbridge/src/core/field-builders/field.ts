import { BaseFieldBuilder } from './base/BaseFieldBuilder';
import { BooleanFieldBuilder } from './boolean/BooleanFieldBuilder';
import { DateFieldBuilder } from './date/DateFieldBuilder';
import { FileFieldBuilder } from './file/FileField';
import { inferFromObject, inferFromType } from './infer';
import { MaskedFieldBuilder } from './mask/MaskedFieldBuilder';
import type { MaskPatternInput } from './mask/masks';
import { NumberFieldBuilder } from './number/NumberFieldBuilder';
import { OtpFieldBuilder } from './otp/OtpFieldBuilder';
import { PasswordFieldBuilder } from './password/PasswordFieldBuilder';
import { PhoneFieldBuilder } from './phone/PhoneFieldBuilder';
import { SelectFieldBuilder } from './select/SelectFieldBuilder';
import { EmailFieldBuilder } from './string/EmailFieldBuilder';
import { StringFieldBuilder } from './string/StringFieldBuilder';
import type { FieldNamespace } from './types';

/**
 * `field` — schema builder namespace.
 *
 * Each method returns a fluent builder.
 *
 * @example
 * const schema = {
 *   name: field.text('Full name').required().trim().max(80),
 *   email: field.email('Email').required().trim(),
 *   password: field.password('Password').required().strong(),
 *   confirmPassword: field.password('Confirm password').sameAs('password'),
 *   age: field.number('Age').required().min(18),
 *   country: field.select('Country').options(['FR', 'US', 'UK']).required(),
 *   terms: field.checkbox('I accept the terms').mustBeTrue(),
 *   code: field.otp('Verification code').length(6).digitsOnly(),
 * };
 */
export const field: FieldNamespace = {
  text: (label) => new StringFieldBuilder('text', label),

  email: (label) =>
    new EmailFieldBuilder('email', label).format(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please enter a valid email address.',
    ),
  password: (label) => new PasswordFieldBuilder(label),
  number: (label) => new NumberFieldBuilder(label),
  tel: (label) =>
    new StringFieldBuilder('tel', label).format(
      /^[+\d\s()-]{6,20}$/,
      'Please enter a valid phone number.',
    ),
  url: (label) =>
    new StringFieldBuilder('url', label).format(
      /^https?:\/\/.+/i,
      'Please enter a valid URL (starting with http:// or https://).',
    ),
  textarea: (label) => new StringFieldBuilder('textarea', label),
  checkbox: (label) => new BooleanFieldBuilder('checkbox', label),
  switch: (label) => new BooleanFieldBuilder('switch', label),
  select: (label) => new SelectFieldBuilder('select', label),
  radio: (label) => new SelectFieldBuilder('radio', label),
  date: (label) => new DateFieldBuilder(label),
  otp: (label) => new OtpFieldBuilder(label),
  masked: (label, pattern: MaskPatternInput) => new MaskedFieldBuilder(label, pattern),
  file: (label) => new FileFieldBuilder(label),
  phone: (label) => new PhoneFieldBuilder(label),
  custom: (label, defaultValue) => new BaseFieldBuilder('custom', label, defaultValue),
  infer: inferFromObject,
  inferType: inferFromType,
};
