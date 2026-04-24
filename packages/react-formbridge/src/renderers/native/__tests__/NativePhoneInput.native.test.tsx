import type React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { field } from '../../../core/field-descriptors/field';
import {
  buildPhoneValue,
  getCountry,
} from '../../../core/field-descriptors/phone/countries';
import { NativePhoneInput } from '../PhoneInput';

function renderPhoneField(
  builder: ReturnType<typeof field.phone>,
  overrides?: Partial<React.ComponentProps<typeof NativePhoneInput>>,
) {
  const descriptor = builder._build();
  const resolvedDescriptor = {
    ...descriptor,
    fieldPropsFromClient: {},
  } as React.ComponentProps<typeof NativePhoneInput>['descriptor'];

  return render(
    <NativePhoneInput
      descriptor={resolvedDescriptor}
      name="phone"
      value={null}
      label={descriptor._label ?? ''}
      placeholder={descriptor._placeholder}
      allValues={{}}
      error={null}
      touched={false}
      dirty={false}
      validating={false}
      disabled={false}
      required={Boolean(descriptor._required)}
      hint={descriptor._hint}
      onChange={() => {}}
      onBlur={() => {}}
      onFocus={() => {}}
      {...overrides}
    />,
  );
}

describe('NativePhoneInput', () => {
  it('keeps the E.164 preview hidden by default and only renders it when opted in', () => {
    const country = getCountry('FR');

    if (!country) {
      throw new Error('Expected FR to be available in the phone country list.');
    }

    const value = buildPhoneValue(country, '06 12 34 56 78');
    const { queryByText, rerender } = renderPhoneField(field.phone('Phone'), {
      value,
    });

    expect(queryByText('+33612345678')).toBeNull();

    const descriptor = field.phone('Phone')._build();
    const resolvedDescriptor = {
      ...descriptor,
      fieldPropsFromClient: {},
    } as React.ComponentProps<typeof NativePhoneInput>['descriptor'];

    rerender(
      <NativePhoneInput
        descriptor={resolvedDescriptor}
        name="phone"
        value={value}
        label={descriptor._label ?? ''}
        placeholder={descriptor._placeholder}
        allValues={{}}
        error={null}
        touched={false}
        dirty={false}
        validating={false}
        disabled={false}
        required={Boolean(descriptor._required)}
        hint={descriptor._hint}
        onChange={() => {}}
        onBlur={() => {}}
        onFocus={() => {}}
        extra={{
          e164Text: ({ e164 }) => `Stored as ${e164}`,
        }}
      />,
    );

    expect(screen.getByText('Stored as +33612345678')).toBeTruthy();
  });
});
