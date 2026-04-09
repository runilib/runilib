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

function withLabel<T extends { label: (label: string) => T }>(
  builder: T,
  label?: string,
): T {
  return label ? builder.label(label) : builder;
}

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
  text: (label) => withLabel(new StringFieldBuilder('text'), label),
  email: (label) =>
    withLabel(
      new EmailFieldBuilder('email').format(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please enter a valid email address.',
      ),
      label,
    ),
  password: (label) => withLabel(new PasswordFieldBuilder(), label),
  number: (label) => withLabel(new NumberFieldBuilder(), label),
  tel: (label) =>
    withLabel(
      new StringFieldBuilder('tel').format(
        /^[+\d\s()-]{6,20}$/,
        'Please enter a valid phone number.',
      ),
      label,
    ),
  url: (label) =>
    withLabel(
      new StringFieldBuilder('url').format(
        /^https?:\/\/.+/i,
        'Please enter a valid URL (starting with http:// or https://).',
      ),
      label,
    ),
  textarea: (label) => withLabel(new StringFieldBuilder('textarea'), label),
  checkbox: (label) => withLabel(new BooleanFieldBuilder('checkbox'), label),
  switch: (label) => withLabel(new BooleanFieldBuilder('switch'), label),
  select: (label) => withLabel(new SelectFieldBuilder('select'), label),
  radio: (label) => withLabel(new SelectFieldBuilder('radio'), label),
  date: (label) => withLabel(new DateFieldBuilder(), label),
  otp: (label) => withLabel(new OtpFieldBuilder(), label),
  masked: (pattern: MaskPatternInput) => new MaskedFieldBuilder(pattern),
  file: (label) => withLabel(new FileFieldBuilder(), label),
  phone: (label) => withLabel(new PhoneFieldBuilder(), label),
  custom: (defaultValue) => new BaseFieldBuilder('custom', defaultValue),
  infer: inferFromObject,
  inferType: inferFromType,
};
